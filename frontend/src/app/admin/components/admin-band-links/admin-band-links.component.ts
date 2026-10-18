import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';

import { BandService } from '../../../services/band/band.service';
import { BandLinksService } from '../../../services/band-links/band-links.service';

import { Band } from '../../../models/band/band.model';
import { SocialLinks } from '../../../models/social-links/social-links.model';
import { StreamingLinks } from '../../../models/streaming-links/streaming-links.model';

import { SocialLinksEditorComponent } from '../social-links-editor/social-links-editor.component';
import { StreamingLinksEditorComponent } from '../streaming-links-editor/streaming-links-editor.component';

@Component({
  selector: 'app-admin-band-links',
  standalone: true,
  imports: [
    CommonModule,
    SocialLinksEditorComponent,
    StreamingLinksEditorComponent,
  ],
  templateUrl: './admin-band-links.component.html',
  styleUrl: './admin-band-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminBandLinksComponent implements OnInit {
  band: Band | null = null;

  socialLinks: SocialLinks = {};
  streamingLinks: StreamingLinks = {};

  /**
   * Tracks whether a database record already exists.
   *
   * These are intentionally separate from the link models because
   * the frontend models do not contain MongoDB's _id property.
   */
  hasSocialLinks = false;
  hasStreamingLinks = false;

  isLoading = true;
  isSavingSocial = false;
  isSavingStreaming = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly bandService: BandService,
    private readonly bandLinksService: BandLinksService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const bandSlug = this.route.snapshot.paramMap.get('bandSlug');

    if (!bandSlug) {
      this.errorMessage = 'Band was not specified.';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    this.loadBand(bandSlug);
  }

  /**
   * Loads the individual band first so that its MongoDB ID
   * can be used to retrieve the associated links.
   */
  private loadBand(bandSlug: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bandService.getBandBySlug(bandSlug).subscribe({
      next: (band) => {
        this.band = band;
        this.loadLinks(band._id);
      },

      error: () => {
        this.errorMessage = 'Unable to load the band.';
        this.isLoading = false;

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Loads both social and streaming links for the band.
   *
   * A band may legitimately have no link records yet.
   * A 404 therefore results in an empty editor.
   *
   * Other errors, such as 401 or 500, are allowed to propagate
   * so they can be handled by the subscription error handler.
   */
  private loadLinks(bandId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      socialLinks: this.bandLinksService
        .getAdminSocialLinks(bandId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              return of(null);
            }

            throw error;
          })
        ),

      streamingLinks: this.bandLinksService
        .getAdminStreamingLinks(bandId)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 404) {
              return of(null);
            }

            throw error;
          })
        ),
    }).subscribe({
      next: ({ socialLinks, streamingLinks }) => {
        this.socialLinks = socialLinks ?? {};
        this.streamingLinks = streamingLinks ?? {};

        /**
         * Determines whether POST or PUT should be used when
         * the administrator saves the corresponding links.
         */
        this.hasSocialLinks = socialLinks !== null;
        this.hasStreamingLinks = streamingLinks !== null;

        this.isLoading = false;

        this.cdr.markForCheck();
      },

      error: () => {
        this.errorMessage = 'Unable to load the band links.';
        this.isLoading = false;

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Saves social links for the individual band.
   *
   * Existing record  -> PUT
   * No existing record -> POST
   */
  saveSocialLinks(links: SocialLinks): void {
    if (!this.band || this.isSavingSocial) {
      return;
    }

    this.isSavingSocial = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request$ = this.hasSocialLinks
      ? this.bandLinksService.updateSocialLinks(this.band._id, links)
      : this.bandLinksService.createSocialLinks(this.band._id, links);

    request$.subscribe({
      next: (savedLinks: SocialLinks) => {
        this.socialLinks = savedLinks;
        this.hasSocialLinks = true;

        this.isSavingSocial = false;
        this.successMessage = 'Social links saved successfully.';

        this.cdr.markForCheck();
      },

      error: () => {
        this.isSavingSocial = false;
        this.errorMessage = 'Unable to save social links.';

        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Saves streaming links for the individual band.
   *
   * Existing record  -> PUT
   * No existing record -> POST
   */
  saveStreamingLinks(links: StreamingLinks): void {
    if (!this.band || this.isSavingStreaming) {
      return;
    }

    this.isSavingStreaming = true;
    this.successMessage = '';
    this.errorMessage = '';

    const request$ = this.hasStreamingLinks
      ? this.bandLinksService.updateStreamingLinks(this.band._id, links)
      : this.bandLinksService.createStreamingLinks(this.band._id, links);

    request$.subscribe({
      next: (savedLinks: StreamingLinks) => {
        this.streamingLinks = savedLinks;
        this.hasStreamingLinks = true;

        this.isSavingStreaming = false;
        this.successMessage = 'Streaming links saved successfully.';

        this.cdr.markForCheck();
      },

      error: () => {
        this.isSavingStreaming = false;
        this.errorMessage = 'Unable to save streaming links.';

        this.cdr.markForCheck();
      },
    });
  }
}