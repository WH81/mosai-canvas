import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocialLinks } from '../../models/social-links/social-links.model';

@Injectable({ providedIn: 'root' })
export class FooterService {
  private baseUrl = 'http://localhost:5001/api/social-links';

  constructor(private http: HttpClient) {}

  getHomePageSocialLinks(bandId: string): Observable<SocialLinks> {
    return this.http.get<SocialLinks>(`${this.baseUrl}/band/${bandId}`);
  }
}
