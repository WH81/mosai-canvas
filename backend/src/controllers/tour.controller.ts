import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Tour from '../models/tour.model';

/**
 * Validates a MongoDB ObjectId.
 */
const isValidObjectId = (id: string): boolean =>
  mongoose.Types.ObjectId.isValid(id);

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
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      error: 'Tour ID is required',
    });
    return;
  }

  const tourId = String(id);

  if (!isValidObjectId(tourId)) {
    res.status(400).json({
      error: 'Invalid tour ID',
    });
    return;
  }

  try {
    // CodeQL safe: Wrapped in new mongoose.Types.ObjectId
    const tour = await Tour.findById(
      new mongoose.Types.ObjectId(tourId)
    );

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
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      error: 'Tour ID is required',
    });
    return;
  }

  const tourId = String(id);

  if (!isValidObjectId(tourId)) {
    res.status(400).json({
      error: 'Invalid tour ID',
    });
    return;
  }

  try {
    const {
      title,
      date,
      time,
      venue,
      city,
      state,
      country,
      ticketUrl,
      status,
      description,
      ticketStatus,
      soldOut,
      notes,
    } = req.body;

    // CodeQL safe: strictly validate types to prevent NoSQL operator injection
    const updatePayload: Record<string, any> = {};
    if (typeof title === 'string') updatePayload.title = title.trim();
    if (typeof date === 'string') updatePayload.date = date.trim();
    if (typeof time === 'string') updatePayload.time = time.trim();
    if (typeof venue === 'string') updatePayload.venue = venue.trim();
    if (typeof city === 'string') updatePayload.city = city.trim();
    if (typeof state === 'string') updatePayload.state = state.trim();
    if (typeof country === 'string') updatePayload.country = country.trim();
    if (typeof ticketUrl === 'string') updatePayload.ticketUrl = ticketUrl.trim();
    if (typeof status === 'string') updatePayload.status = status.trim();
    if (typeof description === 'string') updatePayload.description = description.trim();
    if (typeof ticketStatus === 'string') updatePayload.ticketStatus = ticketStatus.trim();
    if (typeof soldOut === 'boolean') updatePayload.soldOut = soldOut;
    if (typeof notes === 'string') updatePayload.notes = notes.trim();

    // CodeQL safe: Wrapped ID and strictly validated update payload
    const updated = await Tour.findByIdAndUpdate(
      new mongoose.Types.ObjectId(tourId),
      updatePayload,
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
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message: 'Tour ID is required',
    });
    return;
  }

  const tourId = String(id);

  if (!isValidObjectId(tourId)) {
    res.status(400).json({
      message: 'Invalid tour ID',
    });
    return;
  }

  try {
    // CodeQL safe: Wrapped in new mongoose.Types.ObjectId
    const deletedTour = await Tour.findByIdAndDelete(
      new mongoose.Types.ObjectId(tourId)
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