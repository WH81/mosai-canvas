import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../../models/members-bio/member.model';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  
  getMember(id: string): Observable<Member> {
    return this.http.get<Member>(`/api/members/${id}`);
  }
  
  constructor(private http: HttpClient) {}

  // This function fetches members by band
  getMembersByBand(band: string): Observable<Member[]> {
    return this.http.get<any[]>(`/api/members/${band}`);
  }
}
