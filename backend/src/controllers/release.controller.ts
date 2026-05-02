// backend/controllers/release.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as ReleaseService from '../services/release.service';
import Release from '../models/release.model';
import mongoose from 'mongoose';

// Interface for Mongoose validation error type (improves type checking in error handling)
interface MongooseError extends Error {
  name: string;
  errors?: object;
}

/**
 * Normalize a date string (YYYY-MM-DD) to a Date object at local midnight.
 */
function normalizeDateToLocal(dateInput: string | Date): Date {
  if (typeof dateInput === 'string') {
    const [year, month, day] = dateInput.split('-').map(Number);
    if (!year || !month || !day) {
      throw new Error('Invalid date format');
    }
    return new Date(year, month - 1, day); // local midnight
  }
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0); // local midnight
  return d;
}

/**
 * GET /api/releases
 * Retrieves all releases.
 */
export const getAllReleases = async (req: Request, res: Response) => {
  try {
    const bandSlug = Array.isArray(req.query.bandSlug)
  ? req.query.bandSlug[0]
  : req.query.bandSlug;


    const filter = bandSlug ? { bandSlug } : {};

    const releases = await ReleaseService.getReleases(filter);

    res.json(releases);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to load releases',
      details: (err as Error).message
    });
  }
};



/**
 * POST /api/releases
 * Creates a new release.
 */
export const createRelease = async (req: Request, res: Response): Promise<void> => {
  try {
    // Normalize incoming releaseDate to UTC midnight if provided.
    if (req.body && req.body.releaseDate) {
      try {
        req.body.releaseDate = normalizeDateToLocal(req.body.releaseDate);
      } catch (e) {
        // If normalization fails, return 422
        res.status(422).json({ error: 'Invalid releaseDate format' });
        return;
      }
    }

    const newRelease = await ReleaseService.createRelease(req.body);
    res.status(201).json(newRelease);
  } catch (err) {
    const error = err as MongooseError;

    if (error.name === 'ValidationError') {
      res.status(422).json({ error: 'Invalid data provided', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create release', details: error.message });
    }
  }
};

/**
 * PUT /api/releases/:id
 * Updates an existing release.
 */
export const updateRelease = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid release ID' });
    return;
  }

  try {
    // Normalize releaseDate if present in the body
    if (req.body && req.body.releaseDate) {
      try {
        req.body.releaseDate = normalizeDateToLocal(req.body.releaseDate);
      } catch (e) {
        res.status(422).json({ error: 'Invalid releaseDate format' });
        return;
      }
    }

    const updatedRelease = await Release.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedRelease) {
      res.status(404).json({ message: 'Release not found' });
      return;
    }

    res.json(updatedRelease);
  } catch (err) {
    const error = err as MongooseError;

    if (error.name === 'ValidationError') {
      res.status(422).json({ error: 'Invalid update data provided', details: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update release', details: error.message });
    }
  }
};

/**
 * DELETE /api/releases/:id
 * Deletes a release by ID.
 */
export const deleteRelease = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid release ID' });
    return;
  }

  try {
    const deletedRelease = await Release.findByIdAndDelete(id);

    if (!deletedRelease) {
      res.status(404).json({ message: 'Release not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
