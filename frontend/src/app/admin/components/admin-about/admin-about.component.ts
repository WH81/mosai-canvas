import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { About } from '../../../models/about/about.model';

import {
  AdminAboutService,
  CreateAboutRequest,
  UpdateAboutRequest,
} from '../../services/admin-about.service';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './admin-about.component.html',
  styleUrls: ['./admin-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAboutComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly aboutService = inject(AdminAboutService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  /**
   * About records currently loaded from MongoDB.
   */
  aboutItems: About[] = [];

  /**
   * Initial/API loading state.
   */
  isLoading = true;

  /**
   * Save operation state.
   */
  isSaving = false;

  /**
   * ID currently being deleted.
   */
  deletingId: string | null = null;

  /**
   * ID currently being edited.
   *
   * null = create mode.
   */
  editingId: string | null = null;

  /**
   * User-facing error message.
   */
  errorMessage = '';

  /**
   * User-facing success message.
   */
  successMessage = '';

  /**
   * One form is used for both creating and editing.
   *
   * Title is intentionally optional.
   */
  readonly aboutForm = this.formBuilder.nonNullable.group({
    title: [
      '',
      [
        Validators.maxLength(100),
      ],
    ],

    body: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(2000),
      ],
    ],
  });

  ngOnInit(): void {
    this.loadAbout();
  }

  /**
   * Load About records immediately when the page opens.
   */
  loadAbout(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.aboutService.getAbout().subscribe({
      next: (items) => {
        this.aboutItems = items;
        this.isLoading = false;

        /*
         * Explicitly notify Angular because this component
         * uses OnPush change detection.
         */
        this.changeDetector.markForCheck();
      },

      error: (error) => {
        console.error(
          'Failed to load About content.',
          error
        );

        this.aboutItems = [];
        this.isLoading = false;

        this.errorMessage =
          'Unable to load About content. Please try again.';

        this.changeDetector.markForCheck();
      },
    });
  }

  /**
   * Begin editing an existing About record.
   */
  startEdit(item: About): void {
    this.editingId = item._id;

    this.successMessage = '';
    this.errorMessage = '';

    this.aboutForm.reset({
      title: item.title ?? '',
      body: item.body,
    });

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.changeDetector.markForCheck();
  }

  /**
   * Return the form to create mode.
   *
   * The form is already visible, so there is no
   * separate "Add About" button.
   */
  cancelEdit(): void {
    this.editingId = null;

    this.aboutForm.reset({
      title: '',
      body: '',
    });

    this.errorMessage = '';
    this.successMessage = '';

    this.changeDetector.markForCheck();
  }

  /**
   * Save a new About record or update an existing one.
   */
  save(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.aboutForm.invalid) {
      this.aboutForm.markAllAsTouched();
      this.changeDetector.markForCheck();
      return;
    }

    if (this.isSaving || this.deletingId) {
      return;
    }

    const rawTitle =
      this.aboutForm.controls.title.value.trim();

    const body =
      this.aboutForm.controls.body.value.trim();

    /*
     * Title is optional.
     *
     * Sending undefined allows the backend to omit the field
     * rather than storing an unnecessary empty string.
     */
    const title =
      rawTitle.length > 0
        ? rawTitle
        : undefined;

    if (!body) {
      this.errorMessage =
        'About text is required.';

      this.aboutForm.controls.body.markAsTouched();

      this.changeDetector.markForCheck();
      return;
    }

    this.isSaving = true;

    if (this.editingId) {
      const request: UpdateAboutRequest = {
        title,
        body,
      };

      this.update(
        this.editingId,
        request
      );

      return;
    }

    const request: CreateAboutRequest = {
      title,
      body,
    };

    this.create(request);
  }

  /**
   * Create a new About record.
   */
  private create(
    request: CreateAboutRequest
  ): void {
    this.aboutService
      .createAbout(request)
      .subscribe({
        next: (createdItem) => {
          this.aboutItems = [
            ...this.aboutItems,
            createdItem,
          ];

          this.isSaving = false;
          this.editingId = null;

          this.aboutForm.reset({
            title: '',
            body: '',
          });

          this.successMessage =
            'About content created successfully.';

          this.changeDetector.markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to create About content.',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to create About content.';

          this.changeDetector.markForCheck();
        },
      });
  }

  /**
   * Update an existing About record.
   */
  private update(
    id: string,
    request: UpdateAboutRequest
  ): void {
    this.aboutService
      .updateAbout(id, request)
      .subscribe({
        next: (updatedItem) => {
          this.aboutItems =
            this.aboutItems.map((item) =>
              item._id === updatedItem._id
                ? updatedItem
                : item
            );

          this.isSaving = false;
          this.editingId = null;

          this.aboutForm.reset({
            title: '',
            body: '',
          });

          this.successMessage =
            'About content updated successfully.';

          this.changeDetector.markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to update About content.',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ??
            'Unable to update About content.';

          this.changeDetector.markForCheck();
        },
      });
  }

  /**
   * Delete an About record.
   */
  delete(item: About): void {
    if (
      this.deletingId ||
      this.isSaving
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${item.title || 'this About section'}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.deletingId = item._id;

    this.changeDetector.markForCheck();

    this.aboutService
      .deleteAbout(item._id)
      .subscribe({
        next: () => {
          /*
           * Remove the record immediately from the
           * in-memory collection.
           */
          this.aboutItems =
            this.aboutItems.filter(
              (existingItem) =>
                existingItem._id !== item._id
            );

          /*
           * If the administrator deleted the item
           * currently being edited, reset the form.
           */
          if (
            this.editingId === item._id
          ) {
            this.editingId = null;

            this.aboutForm.reset({
              title: '',
              body: '',
            });
          }

          this.deletingId = null;

          this.successMessage =
            'About content deleted successfully.';

          this.changeDetector.markForCheck();
        },

        error: (error) => {
          console.error(
            'Failed to delete About content.',
            error
          );

          this.deletingId = null;

          this.errorMessage =
            error?.error?.message ??
            'Unable to delete About content.';

          this.changeDetector.markForCheck();
        },
      });
  }

  /**
   * Convenience getter for template validation.
   */
  get titleControl() {
    return this.aboutForm.controls.title;
  }

  /**
   * Convenience getter for template validation.
   */
  get bodyControl() {
    return this.aboutForm.controls.body;
  }
}