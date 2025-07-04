import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SocialLinks } from '../../models/social-links/social-links.model';
import { StreamingLinks } from '../../models/streaming-links/streaming-links.model';

@Injectable({ providedIn: 'root' })
export class FooterService {
  private socialBaseUrl = 'http://localhost:5001/api/social-links';
  private streamingBaseUrl = 'http://localhost:5001/api/streaming-links';

  constructor(private http: HttpClient) {}

  // Social links
  getHomePageSocialLinks(bandId: string) {
    return this.http.get<SocialLinks>(`${this.socialBaseUrl}/band/${bandId}`);
  }

  // Streaming links
  getHomePageStreamingLinks(bandId: string) {
    return this.http.get<StreamingLinks>(`${this.streamingBaseUrl}/${bandId}`);
  }
}
