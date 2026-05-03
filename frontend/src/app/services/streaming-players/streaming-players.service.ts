import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StreamingPlayers } from '../../models/streaming-players/streaming-players.model';
 
@Injectable({
  providedIn: 'root'
})
export class StreamingPlayersService {
  // Matches proxy.conf.json — all /api calls proxy to http://localhost:5001
  private apiUrl = '/api/streaming-players';
 
  constructor(private http: HttpClient) {}
 
  /**
   * Fetch streaming player config for a band by bandId.
   * Backend uses ?bandId= query param (not /:id path param).
   * Returns null if none found — component handles gracefully.
   */
  getStreamingPlayerByBandId(bandId: string): Observable<StreamingPlayers | null> {
    const params = new HttpParams().set('bandId', bandId);
 
    return this.http.get<StreamingPlayers[]>(this.apiUrl, { params }).pipe(
      map(players => (players && players.length > 0 ? players[0] : null)),
      catchError(err => {
        console.error('[StreamingPlayersService] Failed to fetch streaming player:', err);
        return of(null);
      })
    );
  }
}
 