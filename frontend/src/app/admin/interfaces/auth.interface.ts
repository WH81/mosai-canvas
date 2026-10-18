/**
 * Administrator information returned by the API.
 *
 * Sensitive information such as password/passwordHash
 * is intentionally excluded.
 */
export interface AuthAdmin {
    id: string;
    username: string;
    displayName: string;
    email: string;
    role: 'admin' | 'super-admin';
  }
  
  /**
   * Response returned by:
   *
   * POST /api/auth/login
   */
  export interface AuthResponse {
    message: string;
    token: string;
    admin: AuthAdmin;
  }
  
  /**
   * Credentials submitted during login.
   */
  export interface LoginCredentials {
    identifier: string;
    password: string;
  }