import {
    Injectable,
    inject,
  } from '@angular/core';
  
  import {
    HttpClient,
  } from '@angular/common/http';
  
  import {
    Observable,
  } from 'rxjs';
  
  import {
    Tour,
  } from '../../models/tour/tour.model';
  
  export interface CreateTourRequest {
    date: string;
    band: string;
    venue: string;
    city: string;
    state: string;
  }
  
  export interface UpdateTourRequest {
    date: string;
    band: string;
    venue: string;
    city: string;
    state: string;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class AdminToursService {
    private readonly http = inject(HttpClient);
  
    /**
     * Keep the API path centralized.
     *
     * The authentication interceptor is responsible
     * for attaching the administrator JWT.
     */
    private readonly apiUrl = '/api/tours';
  
    /**
     * Public read endpoint.
     */
    getTours(): Observable<Tour[]> {
      return this.http.get<Tour[]>(
        this.apiUrl
      );
    }
  
    /**
     * Protected administrator create endpoint.
     */
    createTour(
      request: CreateTourRequest
    ): Observable<Tour> {
      return this.http.post<Tour>(
        this.apiUrl,
        request
      );
    }
  
    /**
     * Protected administrator update endpoint.
     */
    updateTour(
      id: string,
      request: UpdateTourRequest
    ): Observable<Tour> {
      return this.http.put<Tour>(
        `${this.apiUrl}/${encodeURIComponent(id)}`,
        request
      );
    }
  
    /**
     * Protected administrator delete endpoint.
     */
    deleteTour(
      id: string
    ): Observable<void> {
      return this.http.delete<void>(
        `${this.apiUrl}/${encodeURIComponent(id)}`
      );
    }
  }