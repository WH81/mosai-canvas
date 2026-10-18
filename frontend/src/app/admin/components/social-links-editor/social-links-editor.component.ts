import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { SocialLinks } from '../../../models/social-links/social-links.model';

/**
 * Reusable administrator editor for social media links.
 *
 * This component remains UI/form focused.
 *
 * It does NOT:
 *
 * - Call backend APIs directly.
 * - Decide which band or member owns the links.
 * - Store authentication information.
 * - Perform authorization checks.
 *
 * The parent component is responsible for persistence.
 */
@Component({
  selector: 'app-social-links-editor',

  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],

  templateUrl: './social-links-editor.component.html',

  styleUrls: ['./social-links-editor.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLinksEditorComponent implements OnChanges {

  /**
   * Existing social links provided by the parent.
   */
  @Input()
  socialLinks: SocialLinks | null = null;

  /**
   * Optional heading displayed above the editor.
   */
  @Input()
  title = 'Social Links';

  /**
   * Prevent editing while the parent is saving.
   */
  @Input()
  saving = false;

  /**
   * Determines whether this reusable editor should display
   * its own Save / Reset / Cancel action buttons.
   *
   * Defaults to true so existing usages of this component
   * continue to work exactly as before.
   *
   * The Artist Editor sets this to false because the parent
   * Artist form has one final Create Artist / Save Changes button.
   */
  @Input()
  showActions = true;

  /**
   * Emits validated social link data.
   */
  @Output()
  save = new EventEmitter<SocialLinks>();

  /**
   * Emits when the administrator cancels editing.
   */
  @Output()
  cancel = new EventEmitter<void>();

  /**
   * Reactive form containing all supported
   * social media platforms.
   */
  readonly form;

  /**
   * Preserve the last data received from the parent.
   */
  private originalValue: SocialLinks = {};

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      facebook: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],

      instagram: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],

      x: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],

      youtube: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],

      tiktok: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],
    });
  }

  /**
   * Update the form whenever the parent provides
   * new social link data.
   */
  ngOnChanges(
    changes: SimpleChanges
  ): void {
    if (changes['socialLinks']) {
      this.originalValue =
        this.normalizeLinks(
          this.socialLinks
        );

      this.form.reset(
        this.originalValue,
        {
          emitEvent: false,
        }
      );

      this.form.markAsPristine();
      this.form.markAsUntouched();
    }
  }

  /**
   * Return the current form value to the parent.
   *
   * This allows a parent form to submit all fields together
   * without requiring this child editor's Save button.
   *
   * Returns null when the link form is invalid.
   */
  getCurrentValue(): SocialLinks | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return null;
    }

    const formValue =
      this.form.getRawValue();

    return {
      facebook: this.cleanUrl(formValue.facebook),
      instagram: this.cleanUrl(formValue.instagram),
      x: this.cleanUrl(formValue.x),
      youtube: this.cleanUrl(formValue.youtube),
      tiktok: this.cleanUrl(formValue.tiktok),
    };
  }

  /**
   * Submit the reusable editor.
   *
   * Existing usages that still display this component's
   * Save button continue to use this method.
   */
  onSubmit(): void {
    if (this.saving) {
      return;
    }

    const value =
      this.getCurrentValue();

    if (!value) {
      return;
    }

    this.save.emit(value);
  }

  /**
   * Reset the form back to the original values
   * provided by the parent.
   */
  onReset(): void {
    if (this.saving) {
      return;
    }

    this.form.reset(
      this.originalValue,
      {
        emitEvent: false,
      }
    );

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  /**
   * Cancel editing.
   */
  onCancel(): void {
    if (this.saving) {
      return;
    }

    this.onReset();

    this.cancel.emit();
  }

  /**
   * Determines whether a specific form control
   * should display an error message.
   */
  hasError(
    controlName: keyof SocialLinks
  ): boolean {
    const control =
      this.form.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }

  /**
   * Returns a user-friendly validation message.
   */
  getErrorMessage(
    controlName: keyof SocialLinks
  ): string {
    const control =
      this.form.get(controlName);

    if (!control?.errors) {
      return '';
    }

    if (control.errors['pattern']) {
      return 'Enter a valid URL starting with http:// or https://';
    }

    if (control.errors['maxlength']) {
      return 'The URL is too long.';
    }

    return 'Please enter a valid value.';
  }

  /**
   * Normalize incoming links.
   */
  private normalizeLinks(
    links: SocialLinks | null
  ): SocialLinks {
    return {
      facebook: links?.facebook ?? '',
      instagram: links?.instagram ?? '',
      x: links?.x ?? '',
      youtube: links?.youtube ?? '',
      tiktok: links?.tiktok ?? '',
    };
  }

  /**
   * Clean administrator input.
   */
  private cleanUrl(
    value: string | null | undefined
  ): string {
    return value?.trim() ?? '';
  }
}