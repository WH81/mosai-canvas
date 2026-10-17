import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';

import {
  catchError,
  finalize,
  forkJoin,
  switchMap,
  throwError,
} from 'rxjs';

import { Band } from '../../../models/band/band.model';

import { SocialLinks } from '../../../models/social-links/social-links.model';

import { StreamingLinks } from '../../../models/streaming-links/streaming-links.model';

import { SocialLinksEditorComponent } from '../social-links-editor/social-links-editor.component';

import { StreamingLinksEditorComponent } from '../streaming-links-editor/streaming-links-editor.component';

/**
 * Administrator page for the homepage
 * Get Connected section.
 *
 * Manages:
 *
 * - Social media links
 * - Streaming links
 */
@Component({
  selector: 'app-admin-get-connected',

  standalone: true,

  imports: [
    CommonModule,
    SocialLinksEditorComponent,
    StreamingLinksEditorComponent,
  ],

  templateUrl: './admin-get-connected.component.html',

  styleUrls: ['./admin-get-connected.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminGetConnectedComponent implements OnInit {

  /**
   * Public API base URL.
   */
  private readonly bandApiUrl = '/api/band';

  /**
   * Mosai Canvas collective slug.
   */
  private readonly collectiveSlug = 'mosai-canvas';

  /**
   * MongoDB ID for the collective.
   */
  private collectiveBandId: string | null = null;

  /**
   * Social media links.
   */
  socialLinks: SocialLinks | null = null;

  /**
   * Streaming links.
   */
  streamingLinks: StreamingLinks | null = null;

  /**
   * Initial loading state.
   */
  loading = true;

  /**
   * Social links save state.
   */
  savingSocial = false;

  /**
   * Streaming links save state.
   */
  savingStreaming = false;

  /**
   * User-facing error message.
   */
  errorMessage: string | null = null;

  /**
   * User-facing success message.
   */
  successMessage: string | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGetConnectedData();
  }

  /**
   * Loads the Mosai Canvas collective and
   * associated social and streaming links.
   */
  loadGetConnectedData(): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.cdr.markForCheck();

    this.http
      .get<Band>(
        `${this.bandApiUrl}/${this.collectiveSlug}`
      )
      .pipe(
        switchMap((band) => {

          if (!band?._id) {
            return throwError(
              () =>
                new Error(
                  'The Mosai Canvas collective record could not be found.'
                )
            );
          }

          this.collectiveBandId = band._id;

          return forkJoin({
            social: this.http.get<SocialLinks>(
              `${this.bandApiUrl}/${this.collectiveSlug}/social-links`
            ),

            streaming: this.http.get<StreamingLinks>(
              `${this.bandApiUrl}/${this.collectiveSlug}/streaming-links`
            ),
          });
        }),

        finalize(() => {
          this.loading = false;

          /**
           * Required because this component uses
           * OnPush change detection.
           */
          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (results) => {

          this.socialLinks =
            this.normalizeSocialLinks(
              results.social
            );

          this.streamingLinks =
            this.normalizeStreamingLinks(
              results.streaming
            );

          this.cdr.markForCheck();
        },

        error: (error: unknown) => {

          console.error(
            'Failed to load Get Connected data:',
            error
          );

          this.errorMessage =
            'Unable to load Get Connected information. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Saves social media links.
   */
  saveSocialLinks(
    links: SocialLinks
  ): void {

    if (
      !this.collectiveBandId ||
      this.savingSocial
    ) {
      return;
    }

    this.savingSocial = true;

    this.clearMessages();

    this.cdr.markForCheck();

    const url =
      `${this.bandApiUrl}/${this.collectiveBandId}/social-links`;

    this.http
      .put<SocialLinks>(
        url,
        links
      )
      .pipe(

        /**
         * If links do not yet exist,
         * create them instead.
         */
        catchError(
          (error: HttpErrorResponse) => {

            if (error.status === 404) {

              return this.http.post<SocialLinks>(
                url,
                links
              );
            }

            return throwError(() => error);
          }
        ),

        finalize(() => {

          this.savingSocial = false;

          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (updatedLinks) => {

          this.socialLinks =
            this.normalizeSocialLinks(
              updatedLinks
            );

          this.successMessage =
            'Social links saved successfully.';

          this.cdr.markForCheck();
        },

        error: (error: unknown) => {

          console.error(
            'Failed to save social links:',
            error
          );

          this.errorMessage =
            'Unable to save social links. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Saves streaming links.
   */
  saveStreamingLinks(
    links: StreamingLinks
  ): void {

    if (
      !this.collectiveBandId ||
      this.savingStreaming
    ) {
      return;
    }

    this.savingStreaming = true;

    this.clearMessages();

    this.cdr.markForCheck();

    const url =
      `${this.bandApiUrl}/${this.collectiveBandId}/streaming-links`;

    this.http
      .put<StreamingLinks>(
        url,
        links
      )
      .pipe(

        /**
         * Create links if they do not exist.
         */
        catchError(
          (error: HttpErrorResponse) => {

            if (error.status === 404) {

              return this.http.post<StreamingLinks>(
                url,
                links
              );
            }

            return throwError(() => error);
          }
        ),

        finalize(() => {

          this.savingStreaming = false;

          this.cdr.markForCheck();
        })
      )
      .subscribe({

        next: (updatedLinks) => {

          this.streamingLinks =
            this.normalizeStreamingLinks(
              updatedLinks
            );

          this.successMessage =
            'Streaming links saved successfully.';

          this.cdr.markForCheck();
        },

        error: (error: unknown) => {

          console.error(
            'Failed to save streaming links:',
            error
          );

          this.errorMessage =
            'Unable to save streaming links. Please try again.';

          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Clears the success message when
   * the social editor is cancelled.
   */
  onSocialCancel(): void {

    this.successMessage = null;

    this.cdr.markForCheck();
  }

  /**
   * Clears the success message when
   * the streaming editor is cancelled.
   */
  onStreamingCancel(): void {

    this.successMessage = null;

    this.cdr.markForCheck();
  }

  /**
   * Clears page messages.
   */
  private clearMessages(): void {

    this.errorMessage = null;

    this.successMessage = null;
  }

  /**
   * Ensures all expected social link
   * properties exist for the editor.
   */
  private normalizeSocialLinks(
    links: SocialLinks | null | undefined
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
   * Ensures all expected streaming link
   * properties exist for the editor.
   */
  private normalizeStreamingLinks(
    links: StreamingLinks | null | undefined
  ): StreamingLinks {

    return {
      spotify: links?.spotify ?? '',
      appleMusic: links?.appleMusic ?? '',
      soundCloud: links?.soundCloud ?? '',
    };
  }
}