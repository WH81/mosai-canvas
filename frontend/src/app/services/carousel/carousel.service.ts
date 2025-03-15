import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarouselItem } from '../../models/carousel/carousel.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // RxJS 'of' to handle errors gracefully

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private apiUrl = 'http://localhost:5001/api/carousel'; // Update this URL based on your backend

  constructor(private http: HttpClient) {}

  // Fetch carousel items from backend
  getCarouselItems(): Observable<CarouselItem[]> {
    return this.http.get<CarouselItem[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching carousel items:', error);
        return of([]); // Return an empty array or handle accordingly
      })
    );
  }

  // Create a new carousel item
  createCarouselItem(newItem: CarouselItem): Observable<CarouselItem | null> {
    return this.http.post<CarouselItem>(this.apiUrl, newItem).pipe(
      catchError((error) => {
        console.error('Error creating carousel item:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Update an existing carousel item
  updateCarouselItem(id: string, updatedItem: CarouselItem): Observable<CarouselItem | null> {
    return this.http.put<CarouselItem>(`${this.apiUrl}/${id}`, updatedItem).pipe(
      catchError((error) => {
        console.error('Error updating carousel item:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Delete a carousel item
  deleteCarouselItem(id: string): Observable<void | null> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting carousel item:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }
}