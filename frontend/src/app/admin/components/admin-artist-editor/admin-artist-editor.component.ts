import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { BandService } from '../../../services/band/band.service';
import { MembersService } from '../../../services/members-bio/members.service';

import { Band } from '../../../models/band/band.model';
import {
  Member,
  SocialLinks,
  StreamingLinks,
} from '../../../models/members-bio/member.model';

import { SocialLinksEditorComponent } from '../social-links-editor/social-links-editor.component';
import { StreamingLinksEditorComponent } from '../streaming-links-editor/streaming-links-editor.component';

interface MemberWriteRequest {
  name: string;
  instrument: string;
  band: string;
  image: string;
  bio: string;
  socialLinks?: SocialLinks;
  streamingLinks?: StreamingLinks;
}

@Component({
  selector: 'app-admin-artist-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    SocialLinksEditorComponent,
    StreamingLinksEditorComponent,
  ],
  templateUrl: './admin-artist-editor.component.html',
  styleUrl: './admin-artist-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminArtistEditorComponent implements OnInit {
  @ViewChild('socialLinksEditor')
  private socialLinksEditor?: SocialLinksEditorComponent;

  @ViewChild('streamingLinksEditor')
  private streamingLinksEditor?: StreamingLinksEditorComponent;

  band: Band | null = null;

  members: Member[] = [];

  editingMemberId: string | null = null;

  editingMember: Member | null = null;

  socialLinks: SocialLinks = {};
  streamingLinks: StreamingLinks = {};

  isLoading = true;
  isSaving = false;
  deletingMemberId: string | null = null;

  errorMessage = '';
  successMessage = '';

  private readonly formBuilder = inject(FormBuilder);

  readonly artistForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],

    instrument: ['', [Validators.required, Validators.maxLength(150)]],

    image: ['', [Validators.required, Validators.maxLength(2048)]],

    bio: ['', [Validators.required, Validators.maxLength(5000)]],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bandService: BandService,
    private readonly membersService: MembersService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const bandSlug = this.route.snapshot.paramMap.get('bandSlug');

    if (!bandSlug) {
      this.isLoading = false;
      this.errorMessage = 'Band was not specified.';

      this.cdr.markForCheck();
      return;
    }

    this.loadBandAndMembers(bandSlug);
  }

  /**
   * Load the selected band first so that the band ID used
   * for write operations comes from trusted application state
   * rather than an editable form field.
   */
  private loadBandAndMembers(bandSlug: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bandService.getBandBySlug(bandSlug).subscribe({
      next: (band) => {
        this.band = band;

        this.loadMembers(band.slug);
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to load band.', error);

        this.isLoading = false;
        this.errorMessage = error.error?.message ?? 'Unable to load the band.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Load all artists for the selected band.
   */
  private loadMembers(bandSlug: string): void {
    this.membersService.getMembersByBand(bandSlug).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoading = false;

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to load artists.', error);

        this.members = [];
        this.isLoading = false;
        this.errorMessage = error.error?.message ?? 'Unable to load artists.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Begin creating a new artist.
   *
   * All artist information and link fields are available
   * before the artist is created.
   */
  startCreate(): void {
    if (this.isSaving || this.deletingMemberId) {
      return;
    }

    this.editingMemberId = null;
    this.editingMember = null;

    this.artistForm.reset({
      name: '',
      instrument: '',
      image: '',
      bio: '',
    });

    this.socialLinks = {};
    this.streamingLinks = {};

    this.errorMessage = '';
    this.successMessage = '';

    this.cdr.markForCheck();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Begin editing an existing artist.
   */
  startEdit(member: Member): void {
    if (this.isSaving || this.deletingMemberId || !member._id) {
      return;
    }

    this.editingMemberId = member._id;
    this.editingMember = member;

    this.artistForm.reset({
      name: member.name,
      instrument: member.instrument,
      image: member.image,
      bio: member.bio,
    });

    this.socialLinks = member.socialLinks ?? {};

    this.streamingLinks = member.streamingLinks ?? {};

    this.errorMessage = '';
    this.successMessage = '';

    this.cdr.markForCheck();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /**
   * Cancel the current create/edit operation.
   */
  cancelEdit(): void {
    if (this.isSaving) {
      return;
    }

    this.editingMemberId = null;
    this.editingMember = null;

    this.artistForm.reset({
      name: '',
      instrument: '',
      image: '',
      bio: '',
    });

    this.socialLinks = {};
    this.streamingLinks = {};

    this.errorMessage = '';
    this.successMessage = '';

    this.cdr.markForCheck();
  }

  /**
   * Save the complete artist.
   *
   * This is now the single primary save operation.
   *
   * It collects:
   *
   * - Artist information
   * - Social links
   * - Streaming links
   *
   * and submits them together through the existing
   * MembersService API.
   */
  save(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isSaving || this.deletingMemberId) {
      return;
    }

    if (!this.band?._id) {
      this.errorMessage = 'The selected band is unavailable.';

      this.cdr.markForCheck();
      return;
    }

    /*
     * Validate the main artist information.
     */
    if (this.artistForm.invalid) {
      this.artistForm.markAllAsTouched();

      this.errorMessage =
        'Complete the required artist information before saving.';

      this.cdr.markForCheck();
      return;
    }

    /*
     * Retrieve the current values from the child
     * link editors.
     *
     * The child editors validate their own fields.
     * This allows the admin to enter all information first
     * and submit everything with one button.
     */
    const currentSocialLinks = this.socialLinksEditor?.getCurrentValue();

    const currentStreamingLinks = this.streamingLinksEditor?.getCurrentValue();

    if (!currentSocialLinks) {
      this.errorMessage =
        'Correct the invalid social media links before saving.';

      this.cdr.markForCheck();
      return;
    }

    if (!currentStreamingLinks) {
      this.errorMessage = 'Correct the invalid streaming links before saving.';

      this.cdr.markForCheck();
      return;
    }

    /*
     * Keep the parent state synchronized with the values
     * currently displayed in the child editors.
     */
    this.socialLinks = currentSocialLinks;
    this.streamingLinks = currentStreamingLinks;

    const form = this.artistForm.getRawValue();

    const request: MemberWriteRequest = {
      name: form.name.trim(),
      instrument: form.instrument.trim(),
      band: String(this.band._id),
      image: form.image.trim(),
      bio: form.bio.trim(),

      socialLinks: this.hasLinkValues(currentSocialLinks)
        ? currentSocialLinks
        : undefined,

      streamingLinks: this.hasLinkValues(currentStreamingLinks)
        ? currentStreamingLinks
        : undefined,
    };

    this.isSaving = true;
    this.cdr.markForCheck();

    if (this.editingMemberId) {
      this.updateMember(this.editingMemberId, request);

      return;
    }

    this.createMember(request);
  }

  /**
   * Create an artist.
   */
  private createMember(request: MemberWriteRequest): void {
    this.membersService.createMember(request).subscribe({
      next: (createdMember) => {
        this.members = [...this.members, createdMember];

        this.editingMemberId = createdMember._id ?? null;

        this.editingMember = createdMember;

        this.socialLinks = createdMember.socialLinks ?? {};

        this.streamingLinks = createdMember.streamingLinks ?? {};

        this.isSaving = false;

        this.successMessage = 'Artist created successfully.';

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to create artist.', error);

        this.isSaving = false;

        this.errorMessage = error.error?.message ?? 'Unable to create artist.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Update an existing artist.
   */
  private updateMember(memberId: string, request: MemberWriteRequest): void {
    this.membersService.updateMember(memberId, request).subscribe({
      next: (updatedMember) => {
        this.members = this.members.map((member) =>
          member._id === updatedMember._id ? updatedMember : member
        );

        this.editingMember = updatedMember;

        this.socialLinks = updatedMember.socialLinks ?? {};

        this.streamingLinks = updatedMember.streamingLinks ?? {};

        this.isSaving = false;

        this.successMessage = 'Artist updated successfully.';

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to update artist.', error);

        this.isSaving = false;

        this.errorMessage = error.error?.message ?? 'Unable to update artist.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Delete an artist.
   */
  deleteMember(member: Member): void {
    if (this.isSaving || this.deletingMemberId || !member._id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${member.name}" from ${
        this.band?.name ?? 'this band'
      }? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.deletingMemberId = member._id;

    this.cdr.markForCheck();

    this.membersService.deleteMember(member._id).subscribe({
      next: () => {
        this.members = this.members.filter(
          (existingMember) => existingMember._id !== member._id
        );

        if (this.editingMemberId === member._id) {
          this.editingMemberId = null;
          this.editingMember = null;

          this.artistForm.reset({
            name: '',
            instrument: '',
            image: '',
            bio: '',
          });

          this.socialLinks = {};
          this.streamingLinks = {};
        }

        this.deletingMemberId = null;

        this.successMessage = 'Artist deleted successfully.';

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to delete artist.', error);

        this.deletingMemberId = null;

        this.errorMessage = error.error?.message ?? 'Unable to delete artist.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Preserve the reusable social-link editor functionality.
   *
   * If its own Save button is used while editing an existing
   * artist, the existing immediate-save behavior remains.
   */
  saveSocialLinks(links: SocialLinks): void {
    this.socialLinks = {
      ...links,
    };

    if (!this.editingMemberId || !this.band?._id) {
      this.successMessage =
        'Social links are ready to be saved with the artist.';

      this.cdr.markForCheck();
      return;
    }

    this.saveLinksWithCurrentMember(links, this.streamingLinks);
  }

  /**
   * Preserve the reusable streaming-link editor functionality.
   */
  saveStreamingLinks(links: StreamingLinks): void {
    this.streamingLinks = {
      ...links,
    };

    if (!this.editingMemberId || !this.band?._id) {
      this.successMessage =
        'Streaming links are ready to be saved with the artist.';

      this.cdr.markForCheck();
      return;
    }

    this.saveLinksWithCurrentMember(this.socialLinks, links);
  }

  /**
   * Persist link changes through the existing member update API.
   *
   * This preserves the existing behavior if an administrator
   * chooses to use a child editor's own Save button.
   */
  private saveLinksWithCurrentMember(
    socialLinks: SocialLinks,
    streamingLinks: StreamingLinks
  ): void {
    if (!this.editingMemberId || !this.band?._id || this.isSaving) {
      return;
    }

    if (this.artistForm.invalid) {
      this.artistForm.markAllAsTouched();

      this.errorMessage =
        'Save the artist information before saving its links.';

      this.cdr.markForCheck();
      return;
    }

    const form = this.artistForm.getRawValue();

    const request: MemberWriteRequest = {
      name: form.name.trim(),
      instrument: form.instrument.trim(),
      band: String(this.band._id),
      image: form.image.trim(),
      bio: form.bio.trim(),

      socialLinks: this.hasLinkValues(socialLinks) ? socialLinks : undefined,

      streamingLinks: this.hasLinkValues(streamingLinks)
        ? streamingLinks
        : undefined,
    };

    this.isSaving = true;
    this.errorMessage = '';

    this.membersService.updateMember(this.editingMemberId, request).subscribe({
      next: (updatedMember) => {
        this.members = this.members.map((member) =>
          member._id === updatedMember._id ? updatedMember : member
        );

        this.editingMember = updatedMember;

        this.socialLinks = updatedMember.socialLinks ?? {};

        this.streamingLinks = updatedMember.streamingLinks ?? {};

        this.isSaving = false;

        this.successMessage = 'Artist links saved successfully.';

        this.cdr.markForCheck();
      },

      error: (error: HttpErrorResponse) => {
        console.error('Failed to save artist links.', error);

        this.isSaving = false;

        this.errorMessage =
          error.error?.message ?? 'Unable to save artist links.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Determine whether a link object contains at least
   * one non-empty value.
   */
  private hasLinkValues(
    links: SocialLinks | StreamingLinks | null | undefined
  ): boolean {
    if (!links) {
      return false;
    }

    return Object.values(links).some(
      (value) => typeof value === 'string' && value.trim().length > 0
    );
  }

  get nameControl() {
    return this.artistForm.controls.name;
  }

  get instrumentControl() {
    return this.artistForm.controls.instrument;
  }

  get imageControl() {
    return this.artistForm.controls.image;
  }

  get bioControl() {
    return this.artistForm.controls.bio;
  }
}
