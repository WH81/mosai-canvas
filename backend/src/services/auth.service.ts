import jwt from 'jsonwebtoken';

import Admin from '../models/admin.model';

import {
  IAdmin,
} from '../interfaces/admin.interface';

export interface AuthResult {
  token: string;

  admin: {
    id: string;
    username: string;
    displayName: string;
    email: string;
    role: 'admin' | 'super-admin';
  };
}

export interface JwtPayload {
  sub: string;

  role:
    | 'admin'
    | 'super-admin';

  iat?: number;

  exp?: number;
}

class AuthService {
  /**
   * Retrieve JWT secret only when needed.
   *
   * This avoids reading process.env before
   * dotenv has initialized.
   */
  private getJwtSecret(): string {
    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        'JWT_SECRET is not configured.'
      );
    }

    if (secret.length < 32) {
      throw new Error(
        'JWT_SECRET must contain at least 32 characters.'
      );
    }

    return secret;
  }

  /**
   * Authenticate administrator.
   */
  async login(
    identifier: string,
    password: string
  ): Promise<AuthResult> {
    const normalizedIdentifier =
      identifier
        .trim()
        .toLowerCase();

    if (
      !normalizedIdentifier ||
      !password
    ) {
      throw new Error(
        'Invalid credentials.'
      );
    }

    const admin =
      await Admin
        .findOne({
          $or: [
            {
              username:
                normalizedIdentifier,
            },
            {
              email:
                normalizedIdentifier,
            },
          ],
        })
        .select(
          '+passwordHash'
        );

    if (!admin) {
      throw new Error(
        'Invalid credentials.'
      );
    }

    if (!admin.isActive) {
      throw new Error(
        'Invalid credentials.'
      );
    }

    const valid =
      await admin.comparePassword(
        password
      );

    if (!valid) {
      throw new Error(
        'Invalid credentials.'
      );
    }

    admin.lastLogin =
      new Date();

    await admin.save();

    const token =
      this.generateToken(admin);

    return {
      token,

      admin:
        this.toSafeAdmin(admin),
    };
  }

  /**
   * Generate JWT.
   */
  generateToken(
    admin: IAdmin
  ): string {
    const payload: JwtPayload = {
      sub:
        admin._id.toString(),

      role:
        admin.role,
    };

    return jwt.sign(
      payload,
      this.getJwtSecret(),
      {
        expiresIn: '8h',

        issuer:
          'mosai-canvas-api',

        audience:
          'mosai-canvas-admin',
      }
    );
  }

  /**
   * Verify JWT.
   */
  verifyToken(
    token: string
  ): JwtPayload {
    try {
      const decoded =
        jwt.verify(
          token,
          this.getJwtSecret(),
          {
            issuer:
              'mosai-canvas-api',

            audience:
              'mosai-canvas-admin',
          }
        );

      if (
        typeof decoded ===
        'string'
      ) {
        throw new Error();
      }

      if (
        typeof decoded.sub !==
          'string' ||
        typeof decoded.role !==
          'string'
      ) {
        throw new Error();
      }

      if (
        decoded.role !==
          'admin' &&
        decoded.role !==
          'super-admin'
      ) {
        throw new Error();
      }

      return decoded as JwtPayload;
    } catch {
      throw new Error(
        'Invalid or expired authentication token.'
      );
    }
  }

  /**
   * Verify that the administrator
   * still exists and is active.
   */
  async getAuthenticatedAdmin(
    adminId: string
  ): Promise<IAdmin> {
    const admin =
      await Admin.findById(
        adminId
      );

    if (
      !admin ||
      !admin.isActive
    ) {
      throw new Error(
        'Administrator account is inactive or unavailable.'
      );
    }

    return admin;
  }

  /**
   * Return only safe administrator fields.
   */
  private toSafeAdmin(
    admin: IAdmin
  ): AuthResult['admin'] {
    return {
      id:
        admin._id.toString(),

      username:
        admin.username,

      displayName:
        admin.displayName,

      email:
        admin.email,

      role:
        admin.role,
    };
  }
}

export default new AuthService();