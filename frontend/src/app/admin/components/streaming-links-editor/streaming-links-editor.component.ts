import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { StreamingLinks } from '../../../models/streaming-links/streaming-links.model';

/**
 * Reusable administrator editor for streaming links.
 *
 * This component is presentation and form logic only.
 *
 * It does NOT:
 *
 * - Call the backend.
 * - Decide which band owns the links.
 * - Handle authentication.
 * - Store tokens.
 *
 * The parent component handles persistence.
 */
@Component({
  selector: 'app-streaming-links-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './streaming-links-editor.component.html',
  styleUrls: ['./streaming-links-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamingLinksEditorComponent
  implements OnChanges {

  /**
   * Existing streaming links supplied by the parent.
   */
  @Input()
  streamingLinks: StreamingLinks | null = null;

  /**
   * Customizable heading.
   */
  @Input()
  title = 'Streaming Links';

  /**
   * Prevent editing while the parent is saving.
   */
  @Input()
  saving = false;

  /**
   * Determines whether this reusable editor should display
   * its own Save / Reset / Cancel action buttons.
   *
   * Defaults to true so existing usages continue working.
   */
  @Input()
  showActions = true;

  /**
   * Emits validated links to the parent.
   */
  @Output()
  save = new EventEmitter<StreamingLinks>();

  /**
   * Emits when editing is cancelled.
   */
  @Output()
  cancel = new EventEmitter<void>();

  /**
   * Reactive form.
   */
  readonly form;

  /**
   * Original values supplied by the parent.
   */
  private originalValue: StreamingLinks = {};

  constructor(
    private readonly formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      spotify: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],

      appleMusic: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],

      soundCloud: [
        '',
        [
          Validators.maxLength(500),
          Validators.pattern(/^https?:\/\/.+/i),
        ],
      ],
    });
  }

  /**
   * Update the form when the parent provides
   * new streaming link data.
   */
  ngOnChanges(
    changes: SimpleChanges
  ): void {
    if (changes['streamingLinks']) {
      this.originalValue =
        this.normalizeLinks(
          this.streamingLinks
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
   * Return the current streaming-link values
   * to the parent.
   *
   * Returns null when validation fails.
   */
  getCurrentValue(): StreamingLinks | null {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return null;
    }

    const formValue =
      this.form.getRawValue();

    return {
      spotify: this.cleanUrl(formValue.spotify),
      appleMusic: this.cleanUrl(formValue.appleMusic),
      soundCloud: this.cleanUrl(formValue.soundCloud),
    };
  }

  /**
   * Submit validated streaming links.
   *
   * Existing usages that display this component's
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
   * Restore original values.
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
   * Determines whether a field should show an error.
   */
  hasError(
    controlName: keyof StreamingLinks
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
   * Returns a readable validation error.
   */
  getErrorMessage(
    controlName: keyof StreamingLinks
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
   * Convert null/undefined values into strings
   * suitable for form controls.
   */
  private normalizeLinks(
    links: StreamingLinks | null
  ): StreamingLinks {
    return {
      spotify: links?.spotify ?? '',
      appleMusic: links?.appleMusic ?? '',
      soundCloud: links?.soundCloud ?? '',
    };
  }

  /**
   * Trim administrator input.
   */
  private cleanUrl(
    value: string | null | undefined
  ): string {
    return value?.trim() ?? '';
  }
}