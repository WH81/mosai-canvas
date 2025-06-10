import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const message = err instanceof Error ? err.message : 'Unexpected server error';

  // Optionally log full error for debugging
  if (err instanceof Error && err.stack) {
    console.error(err.stack);
  } else {
    console.error('Unknown error:', err);
  }

  res.status(500).json({ error: message });
};
