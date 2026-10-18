import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

/**
 * Authentication HTTP interceptor.
 *
 * Responsibilities:
 *
 * - Retrieves the JWT from AuthService.
 * - Adds the JWT to protected API requests.
 * - Uses the standard Bearer authentication scheme.
 * - Does not modify login requests.
 * - Does not expose authentication credentials in logs.
 * - Handles unauthorized (401) responses.
 *
 * Security:
 *
 * - The JWT is never placed in a URL or query string.
 * - The JWT is sent only through the Authorization header.
 * - Authentication state remains centralized in AuthService.
 * - The interceptor does not attempt to validate the JWT.
 * - The backend remains the authoritative security boundary.
 * - A 401 response clears the local authentication state.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  /**
   * Login requests do not have a JWT yet.
   *
   * Explicitly bypass the interceptor for the login endpoint.
   */
  if (req.url.endsWith('/api/auth/login')) {
    return next(req);
  }

  /**
   * Retrieve the currently stored access token.
   */
  const token = authService.getToken();

  /**
   * No token means this is either:
   *
   * - a public request
   * - an unauthenticated request
   * - a request made before login
   *
   * Allow the request to continue normally.
   *
   * Protected backend routes will reject it with 401.
   */
  if (!token) {
    return next(req);
  }

  /**
   * Never mutate the original HttpRequest.
   *
   * Angular HttpRequest objects are immutable.
   *
   * clone() creates a new request containing the
   * Authorization header.
   */
  const authenticatedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  /**
   * Continue the request pipeline.
   *
   * If the backend returns HTTP 401, the JWT is no longer
   * considered valid by the backend.
   *
   * Clear the local authentication state and redirect the
   * administrator to the login page.
   */
  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401
      ) {
        authService.logoutForExpiredSession();
      }

      return throwError(() => error);
    })
  );
};