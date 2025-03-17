import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { About } from '../../models/about/about.model';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private apiUrl = 'http://localhost:5000/api/about'; // Ensure this URL matches your backend's base URL

  constructor(private http: HttpClient) {}

  // Fetch the About section (assuming there's only one About entry)
  getAbout(): Observable<About | null> {
    return this.http.get<About>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching About content:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Create a new About section
  createAbout(aboutData: About): Observable<About | null> {
    return this.http.post<About>(this.apiUrl, aboutData).pipe(
      catchError((error) => {
        console.error('Error creating About content:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Update the About section by ID
  updateAbout(id: string, aboutData: About): Observable<About | null> {
    const updateUrl = `${this.apiUrl}/${id}`; // Ensure that the endpoint includes the ID
    return this.http.put<About>(updateUrl, aboutData).pipe(
      catchError((error) => {
        console.error('Error updating About content:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }

  // Delete the About section by ID
  deleteAbout(id: string): Observable<void | null> {
    const deleteUrl = `${this.apiUrl}/${id}`; // Ensure that the endpoint includes the ID
    return this.http.delete<void>(deleteUrl).pipe(
      catchError((error) => {
        console.error('Error deleting About content:', error);
        return of(null); // Return null or handle accordingly
      })
    );
  }
}
