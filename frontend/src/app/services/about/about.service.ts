import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { About } from '../../models/about/about.model'; // Import the About model

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private apiUrl = 'http://localhost:5001/api/about'; // Make sure this is the correct API URL

  constructor(private http: HttpClient) {}

  // Fetch the About data (GET request)
  getAboutData(): Observable<About[]> {
    return this.http.get<About[]>(this.apiUrl); // Assuming this endpoint returns an array of About objects
  }
}
