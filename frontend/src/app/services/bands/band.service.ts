// band.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BandService {
  private apiUrl = 'http://localhost:5001/api/bands'; // Your backend API URL

  constructor(private http: HttpClient) {}

  getBandBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${slug}`);
  }
}
