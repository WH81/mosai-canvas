import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MailingList } from '../../models/mailing-list/mailing-list.model';

@Injectable({ providedIn: 'root' })
export class MailingListService {
  private apiUrl = '/api/mailing-list';

  constructor(private http: HttpClient) {}

  subscribe(entry: MailingList): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      this.apiUrl,
      entry
    );
  }

  unsubscribe(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.apiUrl}/unsubscribe`,
      { email }
    );
  }
}