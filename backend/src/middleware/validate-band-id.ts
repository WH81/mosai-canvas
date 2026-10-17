import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

export const validateBandId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { bandId } = req.params;

  if (!bandId) {
    res.status(400).json({
      message: 'Band ID is required.',
    });
    return;
  }

  if (!mongoose.Types.ObjectId.isValid(bandId)) {
    res.status(400).json({
      message: 'Invalid band ID.',
    });
    return;
  }

  next();
};