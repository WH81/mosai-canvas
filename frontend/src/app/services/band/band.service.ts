import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Band } from '../../models/band/band.model';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  /**
   * Matches server.ts:
   * app.use('/api/band', bandRoutes)
   */
  private readonly apiUrl = 'http://localhost:5001/api/band';

  /**
   * Holds the currently active band.
   */
  private readonly bandState = signal<Band | null>(null);

  /**
   * Read-only access to the active band.
   */
  readonly currentBand = this.bandState.asReadonly();

  constructor(private readonly http: HttpClient) {}

  /**
   * Get all bands.
   */
  getBands(): Observable<Band[]> {
    return this.http.get<Band[]>(this.apiUrl);
  }

  /**
   * Get a band by its slug.
   */
  getBandBySlug(slug: string): Observable<Band> {
    return this.http.get<Band>(`${this.apiUrl}/${slug}`).pipe(
      tap((band) => this.bandState.set(band))
    );
  }

  /**
   * Clear the currently active band.
   */
  clearBandState(): void {
    this.bandState.set(null);
  }
}