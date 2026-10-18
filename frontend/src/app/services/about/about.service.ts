import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { About } from '../../models/about/about.model';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private readonly apiUrl = '/api/about';

  constructor(private readonly http: HttpClient) {}

  getAboutData(): Observable<About[]> {
    return this.http.get<About[]>(this.apiUrl);
  }
}