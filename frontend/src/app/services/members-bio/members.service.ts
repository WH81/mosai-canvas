import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../../models/members-bio/member.model';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private apiUrl = 'http://localhost:5001/api/members'; // Match your BandService port

  constructor(private http: HttpClient) {}

  getMembersByBand(bandName: string): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}?band=${bandName}`);
  }

  getMember(memberId: string): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${memberId}`);
  }
}
