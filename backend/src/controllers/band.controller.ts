import { Request, Response, NextFunction } from 'express';
import Band from '../models/band.model';
import Member from '../models/member.model'; // optional if you want members
import mongoose from 'mongoose';

// GET /api/bands
export const getAllBands = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bands = await Band.find();
    res.json(bands);
  } catch (error) {
    return next(error);
  }
};

// GET /api/bands/:slug
export const getBandBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const band = await Band.findOne({ slug });

    if (!band) {
      // If band is not found, send a 404 response and return immediately
      res.status(404).json({ message: 'Band not found' });
      return; 
    }

    // If band is found, send the band data as a response
    res.json(band);
  } catch (error) {
    // Send any unexpected errors to the next middleware (error handler)
    next(error);
  }
};

// GET /api/bands/:slug/members (optional)
export const getBandWithMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const band = await Band.findOne({ slug });

    if (!band) {
      res.status(404).json({ message: 'Band not found' });
    }

    const members = band ? await Member.find({ band: band.name }) : [];

    res.json({ band, members });
  } catch (error) {
    return next(error);
  }
};

// POST /api/bands
export const createBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, slug, description, image } = req.body;

  console.log("Request body:", req.body);

  try {
    const bandExists = await Band.findOne({ slug });
    if (bandExists) {
      // Return immediately if band already exists
      res.status(400).json({ message: 'Band with that slug already exists' });
      return;
    }

    const newBand = new Band({ name, slug, description, image });
    const savedBand = await newBand.save();
    res.status(201).json(savedBand);
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

// PUT /api/bands/:id
export const updateBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, slug, description, image } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid Band ID' });
  }

  try {
    const updatedBand = await Band.findByIdAndUpdate(
      id,
      { name, slug, description, image },
      { new: true }
    );

    if (!updatedBand) {
      res.status(404).json({ message: 'Band not found' });
    }

    res.json(updatedBand);
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/bands/:id
export const deleteBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid Band ID' });
  }

  try {
    const deletedBand = await Band.findByIdAndDelete(id);

    if (!deletedBand) {
      res.status(404).json({ message: 'Band not found' });
    }

    res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
