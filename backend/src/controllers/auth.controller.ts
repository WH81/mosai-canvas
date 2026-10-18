import {
  NextFunction,
  Request,
  Response,
} from 'express';

import authService from '../services/auth.service';

interface LoginRequestBody {
  identifier?: unknown;

  password?: unknown;
}

export const login = async (
  req: Request<
    {},
    {},
    LoginRequestBody
  >,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      identifier,
      password,
    } = req.body;

    if (
      typeof identifier !==
        'string' ||
      typeof password !==
        'string'
    ) {
      res.status(400).json({
        message:
          'Username/email and password are required.',
      });

      return;
    }

    const normalizedIdentifier =
      identifier.trim();

    if (
      !normalizedIdentifier ||
      !password
    ) {
      res.status(400).json({
        message:
          'Username/email and password are required.',
      });

      return;
    }

    const result =
      await authService.login(
        normalizedIdentifier,
        password
      );

    res.status(200).json({
      message:
        'Login successful.',

      token:
        result.token,

      admin:
        result.admin,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        'Invalid credentials.'
    ) {
      res.status(401).json({
        message:
          'Invalid credentials.',
      });

      return;
    }

    next(error);
  }
};