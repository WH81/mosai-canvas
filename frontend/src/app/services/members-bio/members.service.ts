import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Member } from '../../models/members-bio/member.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {

  // ============================================================
  // API ENDPOINT
  // ============================================================
  //
  // Use a relative API path so Angular can use the configured
  // development proxy:
  //
  // /api -> http://localhost:5001
  //
  // This also avoids coupling the service to localhost when
  // the application is deployed.
  //
  // ============================================================

  private readonly apiUrl = '/api/members';

  constructor(
    private readonly http: HttpClient
  ) {}

  // ============================================================
  // PUBLIC MEMBER READ OPERATIONS
  // ============================================================

  /**
   * Retrieves all members associated with a band.
   *
   * This is used by the public band page.
   *
   * GET /api/members/band/:bandSlug
   */
  getMembersByBand(
    bandSlug: string
  ): Observable<Member[]> {
    return this.http.get<Member[]>(
      `${this.apiUrl}/band/${bandSlug}`
    );
  }

  /**
   * Retrieves a single member by ID.
   *
   * This is used when a specific member needs to be retrieved.
   *
   * GET /api/members/:memberId
   */
  getMember(
    memberId: string
  ): Observable<Member> {
    return this.http.get<Member>(
      `${this.apiUrl}/${memberId}`
    );
  }

  // ============================================================
  // ADMIN MEMBER CREATE OPERATIONS
  // ============================================================

  /**
   * Creates a new member for a band.
   *
   * Authentication is automatically handled by the existing
   * HTTP authentication interceptor.
   *
   * The band relationship should be established by the backend
   * using the selected band rather than trusting editable
   * relationship fields supplied by the client.
   *
   * POST /api/members
   */
  createMember(
    member: Partial<Member>
  ): Observable<Member> {
    return this.http.post<Member>(
      this.apiUrl,
      member
    );
  }

  /**
   * Creates multiple members in a single request.
   *
   * This corresponds to the existing backend batch endpoint.
   *
   * Authentication is automatically handled by the existing
   * HTTP authentication interceptor.
   *
   * POST /api/members/batch
   */
  createMembersBatch(
    members: Partial<Member>[]
  ): Observable<Member[]> {
    return this.http.post<Member[]>(
      `${this.apiUrl}/batch`,
      members
    );
  }

  // ============================================================
  // ADMIN MEMBER UPDATE OPERATIONS
  // ============================================================

  /**
   * Updates an existing member.
   *
   * Authentication is automatically handled by the existing
   * HTTP authentication interceptor.
   *
   * PUT /api/members/:memberId
   */
  updateMember(
    memberId: string,
    member: Partial<Member>
  ): Observable<Member> {
    return this.http.put<Member>(
      `${this.apiUrl}/${memberId}`,
      member
    );
  }

  // ============================================================
  // ADMIN MEMBER DELETE OPERATIONS
  // ============================================================

  /**
   * Deletes an existing member.
   *
   * Authentication is automatically handled by the existing
   * HTTP authentication interceptor.
   *
   * DELETE /api/members/:memberId
   */
  deleteMember(
    memberId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${memberId}`
    );
  }
}