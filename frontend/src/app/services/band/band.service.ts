import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Band } from '../../models/band/band.model';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  /** * Matches server.ts: app.use('/api/band', bandRoutes)
   * Matches band.routes.ts: router.get('/:slug', getBandBySlug)
   */
  private apiUrl = 'http://localhost:5001/api/band';

  /**
   * 1. Create a Signal to hold the state of the "active" band.
   * This allows other components to reactively subscribe to the logo/branding.
   */
  private bandState = signal<Band | null>(null);

  /**
   * 2. Expose a read-only version of the state.
   */
  readonly currentBand = this.bandState.asReadonly();

  constructor(private http: HttpClient) {}

  getBandBySlug(slug: string): Observable<Band> {
    return this.http.get<Band>(`${this.apiUrl}/${slug}`).pipe(
      tap((band) => this.bandState.set(band))
    );
  }

  clearBandState(): void {
    this.bandState.set(null);
  }
}
