import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';

@Injectable({
  providedIn: 'root',
})
export class BandLinksService {

  // ============================================================
  // API ENDPOINTS
  // ============================================================
  //
  // These are relative API paths so the Angular application can
  // use the configured development proxy locally and the same
  // service can work when the application is deployed.
  //
  // Angular development proxy:
  // /api -> http://localhost:5001
  //
  // ============================================================

  private readonly socialLinksBaseUrl = '/api/social-links';
  private readonly streamingLinksBaseUrl = '/api/streaming-links';

  constructor(
    private readonly http: HttpClient
  ) {}

  // ============================================================
  // SOCIAL LINKS - BAND
  // ============================================================

  /**
   * Retrieves the social media links associated with a band.
   *
   * GET /api/social-links/band/:bandId
   *
   * This endpoint is public because the public band pages
   * also need to retrieve these links.
   */
  getAdminSocialLinks(
    bandId: string
  ): Observable<SocialLinks> {
    return this.http.get<SocialLinks>(
      `${this.socialLinksBaseUrl}/band/${bandId}`
    );
  }

  /**
   * Creates social media links for a band.
   *
   * POST /api/social-links/band/:bandId
   *
   * Authentication is automatically handled by the HTTP
   * interceptor for this protected admin request.
   */
  createSocialLinks(
    bandId: string,
    links: SocialLinks
  ): Observable<SocialLinks> {
    return this.http.post<SocialLinks>(
      `${this.socialLinksBaseUrl}/band/${bandId}`,
      links
    );
  }

  /**
   * Updates existing social media links for a band.
   *
   * PUT /api/social-links/band/:bandId
   *
   * Authentication is automatically handled by the HTTP
   * interceptor for this protected admin request.
   */
  updateSocialLinks(
    bandId: string,
    links: SocialLinks
  ): Observable<SocialLinks> {
    return this.http.put<SocialLinks>(
      `${this.socialLinksBaseUrl}/band/${bandId}`,
      links
    );
  }

  /**
   * Deletes all social media links associated with a band.
   *
   * DELETE /api/social-links/band/:bandId
   *
   * Authentication is automatically handled by the HTTP
   * interceptor for this protected admin request.
   */
  deleteSocialLinks(
    bandId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.socialLinksBaseUrl}/band/${bandId}`
    );
  }

  // ============================================================
  // STREAMING LINKS - BAND
  // ============================================================

  /**
   * Retrieves the streaming links associated with a band.
   *
   * GET /api/streaming-links/band/:bandId
   *
   * This endpoint is public because the public band pages
   * also need to retrieve these links.
   */
  getAdminStreamingLinks(
    bandId: string
  ): Observable<StreamingLinks> {
    return this.http.get<StreamingLinks>(
      `${this.streamingLinksBaseUrl}/band/${bandId}`
    );
  }

  /**
   * Creates streaming links for a band.
   *
   * POST /api/streaming-links/band/:bandId
   *
   * Authentication is automatically handled by the HTTP
   * interceptor for this protected admin request.
   */
  createStreamingLinks(
    bandId: string,
    links: StreamingLinks
  ): Observable<StreamingLinks> {
    return this.http.post<StreamingLinks>(
      `${this.streamingLinksBaseUrl}/band/${bandId}`,
      links
    );
  }

  /**
   * Updates existing streaming links for a band.
   *
   * PUT /api/streaming-links/band/:bandId
   *
   * Authentication is automatically handled by the HTTP
   * interceptor for this protected admin request.
   */
  updateStreamingLinks(
    bandId: string,
    links: StreamingLinks
  ): Observable<StreamingLinks> {
    return this.http.put<StreamingLinks>(
      `${this.streamingLinksBaseUrl}/band/${bandId}`,
      links
    );
  }

  /**
   * Deletes all streaming links associated with a band.
   *
   * DELETE /api/streaming-links/band/:bandId
   *
   * Authentication is automatically handled by the HTTP
   * interceptor for this protected admin request.
   */
  deleteStreamingLinks(
    bandId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.streamingLinksBaseUrl}/band/${bandId}`
    );
  }

  // ============================================================
  // SOCIAL LINKS - PUBLIC BAND PAGE
  // ============================================================

  /**
   * Retrieves social media links for a band using its slug.
   *
   * Used by the public band page.
   *
   * GET /api/social-links/band/:bandSlug
   */
  getSocialLinksBySlug(
    bandSlug: string
  ): Observable<SocialLinks> {
    return this.http.get<SocialLinks>(
      `${this.socialLinksBaseUrl}/band/${bandSlug}`
    );
  }

  /**
   * Retrieves social media links for a band using its ID.
   *
   * Used by the public home page.
   *
   * GET /api/social-links/band/:bandId
   */
  getSocialLinksByBandId(
    bandId: string
  ): Observable<SocialLinks> {
    return this.http.get<SocialLinks>(
      `${this.socialLinksBaseUrl}/band/${bandId}`
    );
  }

  // ============================================================
  // STREAMING LINKS - PUBLIC BAND PAGE
  // ============================================================

  /**
   * Retrieves streaming links for a band using its slug.
   *
   * Used by the public band page.
   *
   * GET /api/streaming-links/band/:bandSlug
   */
  getStreamingLinksBySlug(
    bandSlug: string
  ): Observable<StreamingLinks> {
    return this.http.get<StreamingLinks>(
      `${this.streamingLinksBaseUrl}/band/${bandSlug}`
    );
  }

  /**
   * Retrieves streaming links for a band using its ID.
   *
   * Used by the public home page.
   *
   * GET /api/streaming-links/band/:bandId
   */
  getStreamingLinksByBandId(
    bandId: string
  ): Observable<StreamingLinks> {
    return this.http.get<StreamingLinks>(
      `${this.streamingLinksBaseUrl}/band/${bandId}`
    );
  }


}