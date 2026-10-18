import {
  NextFunction,
  Request,
  Response,
} from 'express';

import authService from '../services/auth.service';

export const authenticateAdmin =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const authorization =
        req.headers.authorization;

      if (
        !authorization ||
        !authorization.startsWith(
          'Bearer '
        )
      ) {
        res.status(401).json({
          message:
            'Authentication required.',
        });

        return;
      }

      const token =
        authorization.substring(
          7
        ).trim();

      if (!token) {
        res.status(401).json({
          message:
            'Authentication required.',
        });

        return;
      }

      const payload =
        authService.verifyToken(
          token
        );

      /**
       * Confirm the account still exists
       * and is active.
       */
      await authService
        .getAuthenticatedAdmin(
          payload.sub
        );

      /**
       * Store authenticated admin
       * information on the request.
       *
       * No global Request type
       * declaration is required.
       */
      (
        req as Request & {
          admin?: {
            id: string;
            role:
              | 'admin'
              | 'super-admin';
          };
        }
      ).admin = {
        id: payload.sub,
        role: payload.role,
      };

      next();
    } catch {
      res.status(401).json({
        message:
          'Invalid or expired authentication token.',
      });
    }
  };