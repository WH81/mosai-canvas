import { Request, Response, NextFunction } from 'express';
import Tour from '../models/tour.model';

/**
 * Returns today's date as YYYY-MM-DD using the server's local date.
 *
 * Tour dates are intentionally stored as date-only strings.
 * This prevents timezone conversion from changing the displayed date.
 */
const getTodayDateString = (): string => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Create a new tour date.
 *
 * Protected by authenticateAdmin + validateTour middleware.
 */
export const createTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tour = await Tour.create(req.body);

    res.status(201).json(tour);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all current and future tour dates.
 *
 * Today's date is included.
 *
 * Example:
 *
 * Today: 2026-08-24
 *
 * 2026-08-23 → hidden
 * 2026-08-24 → shown
 * 2026-08-25 → shown
 * 2026-08-30 → shown
 *
 * Results are ordered newest/closest upcoming date first.
 */
export const getAllTours = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const today = getTodayDateString();

    const tours = await Tour.find({
      date: {
        $gte: today,
      },
    }).sort({
      date: 1,
    });

    res.json(tours);
  } catch (err) {
    next(err);
  }
};

/**
 * Get a single tour by ID.
 */
export const getTourById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);

    if (!tour) {
      res.status(404).json({
        error: 'Tour not found',
      });

      return;
    }

    res.json(tour);
  } catch (err) {
    next(err);
  }
};

/**
 * Update an existing tour.
 *
 * Protected by authenticateAdmin + validateTour middleware.
 */
export const updateTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await Tour.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      res.status(404).json({
        error: 'Tour not found',
      });

      return;
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a tour.
 *
 * Protected by authenticateAdmin middleware.
 */
export const deleteTour = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(
      req.params.id
    );

    if (!deletedTour) {
      res.status(404).json({
        message: 'Tour not found',
      });

      return;
    }

    res.status(200).json({
      message: 'Tour deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};