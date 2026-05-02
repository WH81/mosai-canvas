// FILE: src/app/services/band-links/band-links.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';

@Injectable({ providedIn: 'root' })
export class BandLinksService {
  private bandBaseUrl = 'http://localhost:5001/api/band';

  constructor(private http: HttpClient) {}

  /**
   * ---------------------------------------------------------
   * EXISTING MOSAI CANVAS METHODS (KEEP THESE)
   * Used ONLY by the home page.
   * ---------------------------------------------------------
   */
  getSocialLinksByBandId(bandId: string): Observable<SocialLinks> {
    return this.http.get<SocialLinks>(
      `${this.bandBaseUrl}/${bandId}/social-links`
    );
  }

  getStreamingLinksByBandId(bandId: string): Observable<StreamingLinks> {
    return this.http.get<StreamingLinks>(
      `${this.bandBaseUrl}/${bandId}/streaming-links`
    );
  }

  /**
   * ---------------------------------------------------------
   * ⭐ NEW: GENERIC METHODS FOR ALL OTHER BANDS
   * Used by the dynamic band pages.
   * ---------------------------------------------------------
   */

  getSocialLinksBySlug(slug: string): Observable<SocialLinks> {
    return this.http.get<SocialLinks>(`${this.bandBaseUrl}/${slug}/social-links`);
  }
  
  getStreamingLinksBySlug(slug: string): Observable<StreamingLinks> {
    return this.http.get<StreamingLinks>(`${this.bandBaseUrl}/${slug}/streaming-links`);
  }
  

  /**
   * ⭐ OPTIONAL: Combined method if your backend supports it
   */
  getLinksBySlug(slug: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5001/api/band-links/${slug}`); // NEW
  }
}
