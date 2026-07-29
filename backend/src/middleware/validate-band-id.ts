import { Request, Response, NextFunction } from 'express';

export function validateBandId(req: Request, res: Response, next: NextFunction): void {
  const { bandId } = req.params;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }
  next();
}
