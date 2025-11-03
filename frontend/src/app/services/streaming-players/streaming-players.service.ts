import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StreamingPlayers } from '../../models/streaming-players/streaming-players.model';

@Injectable({
  providedIn: 'root'
})
export class StreamingPlayersService {
  private apiUrl = '/api/streaming-players';

  constructor(private http: HttpClient) {}

  getStreamingPlayerById(id: string): Observable<StreamingPlayers> {
    return this.http.get<StreamingPlayers>(`${this.apiUrl}/${id}`);
  }
}
