import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

@Injectable({ providedIn: 'root' })
export class YouTubeVideosService {
  // Ensure this matches your backend route: app.use('/api/youtube', youtubeRoutes);
  private baseUrl = 'api/youtube/band';

  constructor(private http: HttpClient) {}

  getBandVideos(bandSlug: string): Observable<YouTubeVideo[]> {
    return this.http
      .get<YouTubeVideo[]>(`${this.baseUrl}/${bandSlug}`)
      .pipe(
        catchError((error) => {
          console.error('YouTube fetch error:', error);
          return of([]); 
        })
      );
  }
}