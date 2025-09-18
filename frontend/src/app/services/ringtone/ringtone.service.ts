import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Ringtone } from "../../models/ringtone/ringtone.model";

@Injectable({ providedIn: "root" })
export class RingtoneService {
  private apiUrl = "/api/ringtones";

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ringtone[]> {
    return this.http.get<Ringtone[]>(this.apiUrl);
  }

  getById(id: string): Observable<Ringtone> {
    return this.http.get<Ringtone>(`${this.apiUrl}/${id}`);
  }

  create(ringtone: Ringtone): Observable<Ringtone> {
    return this.http.post<Ringtone>(this.apiUrl, ringtone);
  }

  update(id: string, ringtone: Ringtone): Observable<Ringtone> {
    return this.http.put<Ringtone>(`${this.apiUrl}/${id}`, ringtone);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
