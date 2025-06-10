import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MailingList } from '../../models/mailing-list/mailing-list.model';

@Injectable({ providedIn: 'root' })
export class MailingListService {
  private apiUrl = '/api/mailing-list';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MailingList[]> {
    return this.http.get<MailingList[]>(this.apiUrl);
  }

  getById(id: string): Observable<MailingList> {
    return this.http.get<MailingList>(`${this.apiUrl}/${id}`);
  }

  create(entry: MailingList): Observable<MailingList> {
    return this.http.post<MailingList>(this.apiUrl, entry);
  }

  update(id: string, entry: MailingList): Observable<MailingList> {
    return this.http.put<MailingList>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
