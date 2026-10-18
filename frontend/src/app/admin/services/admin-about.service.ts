import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { About } from '../../models/about/about.model';

export interface CreateAboutRequest {
  title?: string;
  body: string;
}

export interface UpdateAboutRequest {
  title?: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAboutService {
  private readonly http = inject(HttpClient);

  /**
   * Keep the API relative to the Angular application.
   *
   * The Angular development proxy handles /api requests locally.
   */
  private readonly apiUrl = '/api/about';

  /**
   * Retrieve all About records.
   *
   * GET is intentionally public because the home page
   * also needs to retrieve About content.
   */
  getAbout(): Observable<About[]> {
    return this.http.get<About[]>(this.apiUrl);
  }

  /**
   * Create a new About record.
   *
   * Authentication is handled by the HTTP auth interceptor.
   */
  createAbout(
    request: CreateAboutRequest
  ): Observable<About> {
    return this.http.post<About>(
      this.apiUrl,
      request
    );
  }

  /**
   * Update an existing About record.
   */
  updateAbout(
    id: string,
    request: UpdateAboutRequest
  ): Observable<About> {
    return this.http.put<About>(
      `${this.apiUrl}/${encodeURIComponent(id)}`,
      request
    );
  }

  /**
   * Delete an existing About record.
   *
   * The API returns the deleted record so the client
   * can confirm exactly what was removed.
   */
  deleteAbout(id: string): Observable<About> {
    return this.http.delete<About>(
      `${this.apiUrl}/${encodeURIComponent(id)}`
    );
  }
}