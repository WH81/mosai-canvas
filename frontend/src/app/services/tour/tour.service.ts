import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Tour } from '../../models/tour/tour.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TourService {
  private apiUrl = 'http://localhost:5001/api/tours';

  constructor(private http: HttpClient) {}

  getTours(): Observable<Tour[]> {
    return this.http.get<Tour[]>(this.apiUrl);
  }

  addTour(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(this.apiUrl, tour);
  }

  updateTour(id: string, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.apiUrl}/${id}`, tour);
  }

  deleteTour(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
