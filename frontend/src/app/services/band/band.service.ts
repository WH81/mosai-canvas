// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class BandService {
//   private apiUrl = 'http://localhost:5001/api/band';

//   constructor(private http: HttpClient) {}

//   getBandBySlug(slug: string): Observable<any> {
//     return this.http.get(`${this.apiUrl}/${slug}`);
//   }
// }

import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Band } from '../../models/band/band.model';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  private apiUrl = 'http://localhost:5001/api/band';

  // 1. Create a Signal to hold the state of the "active" band
  // This is the "Source of Truth" for your logos and branding
  private bandState = signal<Band | null>(null);

  // 2. Expose a read-only version of the state
  readonly currentBand = this.bandState.asReadonly();

  constructor(private http: HttpClient) {}

  /**
   * Fetches band data and updates the global state automatically
   */
  getBandBySlug(slug: string): Observable<Band> {
    return this.http.get<Band>(`${`${this.apiUrl}/${slug}`}`).pipe(
      tap((band) => {
        // When the data arrives, we update the state signal
        this.bandState.set(band);
      })
    );
  }

  /**
   * Resets the branding back to the default "Mosaic Collective"
   * Call this when navigating away from a band page
   */
  clearBandState(): void {
    this.bandState.set(null);
  }
}