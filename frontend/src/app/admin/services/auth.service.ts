import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import {
  AuthAdmin,
  AuthResponse,
  LoginCredentials,
} from '../interfaces/auth.interface';

/**
 * Authentication service for the administrator area.
 *
 * Responsibilities:
 *
 * - Authenticate administrators against the backend.
 * - Store the JWT access token.
 * - Store safe administrator information.
 * - Expose authentication state to Angular components/guards.
 * - Provide logout functionality.
 *
 * The service does NOT:
 *
 * - Validate JWT signatures.
 * - Decide whether a JWT is cryptographically valid.
 * - Access MongoDB.
 *
 * Those responsibilities belong to the backend.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Backend authentication endpoint.
   *
   * Keep the API URL in one place so it can easily be
   * changed for development/production environments.
   */
  private readonly apiUrl = '/api/auth';

  /**
   * Storage keys.
   *
   * Centralizing these prevents accidental differences
   * between login, logout, and the HTTP interceptor.
   */
  private readonly tokenStorageKey = 'mosai_canvas_admin_token';
  private readonly adminStorageKey = 'mosai_canvas_admin';

  /**
   * Reactive authentication state.
   *
   * null = nobody authenticated.
   * AuthAdmin = authenticated administrator.
   */
  private readonly currentAdminSubject = new BehaviorSubject<AuthAdmin | null>(
    this.loadStoredAdmin()
  );

  /**
   * Public read-only stream of the authenticated administrator.
   *
   * Components can subscribe without being able to modify
   * the underlying BehaviorSubject.
   */
  readonly currentAdmin$: Observable<AuthAdmin | null> =
    this.currentAdminSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  /**
   * Authenticate an administrator.
   *
   * The password is sent only to the backend over HTTPS.
   *
   * The backend:
   *
   * - finds the administrator
   * - validates the password with bcrypt
   * - checks account status
   * - generates the JWT
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        identifier: credentials.identifier.trim(),
        password: credentials.password,
      })
      .pipe(
        tap((response) => {
          this.storeAuthentication(response);
        })
      );
  }

  /**
   * Log the administrator out.
   *
   * Removes the local authentication information.
   *
   * The JWT becomes unusable from the Angular application
   * after removal because the interceptor will no longer
   * attach it to API requests.
   */
  logout(): void {
    this.clearAuthentication();
    this.currentAdminSubject.next(null);

    void this.router.navigate(['/']);
  }

  /**
   * Handles an expired or invalid authentication session.
   *
   * Clears the local authentication state and sends the
   * administrator back to the login page.
   *
   * This is separate from manual logout because:
   *
   * - Manual logout → public home page
   * - Expired/invalid session → admin login page
   */
  logoutForExpiredSession(): void {
    this.clearAuthentication();
    this.currentAdminSubject.next(null);

    void this.router.navigate(['/admin-login']);
  }

  /**
   * Returns the currently stored JWT.
   *
   * Used by the HTTP interceptor when adding:
   *
   * Authorization: Bearer <token>
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  /**
   * Returns the currently authenticated administrator.
   */
  getCurrentAdmin(): AuthAdmin | null {
    return this.currentAdminSubject.value;
  }

  /**
   * Indicates whether an administrator is currently
   * authenticated in this browser session.
   *
   * IMPORTANT:
   *
   * This checks whether a token exists locally.
   * It does not cryptographically validate the JWT.
   *
   * The backend remains the authority for authentication.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Store successful authentication information.
   *
   * Only the JWT and safe administrator information returned
   * by the backend are stored.
   */
  private storeAuthentication(response: AuthResponse): void {
    localStorage.setItem(this.tokenStorageKey, response.token);

    localStorage.setItem(this.adminStorageKey, JSON.stringify(response.admin));

    this.currentAdminSubject.next(response.admin);
  }

  /**
   * Remove all locally stored authentication information.
   */
  private clearAuthentication(): void {
    localStorage.removeItem(this.tokenStorageKey);
    localStorage.removeItem(this.adminStorageKey);
  }

  /**
   * Restore the administrator from localStorage when Angular
   * starts.
   *
   * This allows an authenticated admin to refresh the browser
   * without immediately appearing logged out.
   */
  private loadStoredAdmin(): AuthAdmin | null {
    const storedAdmin = localStorage.getItem(this.adminStorageKey);

    if (!storedAdmin) {
      return null;
    }

    try {
      return JSON.parse(storedAdmin) as AuthAdmin;
    } catch {
      /**
       * If the stored value is corrupted, remove it rather
       * than allowing invalid application state to continue.
       */
      localStorage.removeItem(this.adminStorageKey);

      return null;
    }
  }
}
