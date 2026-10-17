import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Protects administrator-only Angular routes.
 *
 * Responsibilities:
 *
 * - Determines whether an authentication token exists.
 * - Allows authenticated users to access protected routes.
 * - Redirects unauthenticated users to the admin login page.
 * - Preserves the requested URL for post-login navigation.
 *
 * IMPORTANT:
 *
 * This guard is NOT the primary security boundary.
 *
 * The backend must continue protecting administrative API
 * endpoints with authenticateAdmin middleware.
 */
export const adminGuard: CanActivateFn = (
  route,
  state
): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  /**
   * Check whether the browser currently has an
   * authentication token.
   *
   * AuthService intentionally handles access to localStorage.
   */
  if (authService.isAuthenticated()) {
    return true;
  }

  /**
   * No authentication token exists.
   *
   * Redirect the user to the login page.
   *
   * returnUrl allows the login component to know where
   * the administrator originally wanted to go.
   *
   * Example:
   *
   * /admin
   *
   * becomes:
   *
   * /admin-login?returnUrl=%2Fadmin
   */
  return router.createUrlTree(['/admin-login'], {
    queryParams: {
      returnUrl: state.url,
    },
  });
};