import { Request, Response, NextFunction } from 'express';
import Tour from '../models/tour.model';

export const createTour = async (req: Request, res: Response, next: NextFunction) => {
  console.log('POST /api/tours called', req.body); 
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (err) {
    next(err);
  }
};

export const getAllTours = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tours = await Tour.find().sort({ date: 1 });
    res.json(tours);
  } catch (err) {
    next(err);
  }
};

export const getTourById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }
    res.json(tour);
  } catch (err) {
    next(err);
  }
};

export const updateTour = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Tour not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTour = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    if (!deletedTour) {
      res.status(404).json({ message: 'Tour not found' });
      return;
    }
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    next(error);
  }
};
