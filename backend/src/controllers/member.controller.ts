import { NextFunction, Request, Response } from 'express';
import Member from '../models/member.model';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Band from '../models/band.model'; // Import the Band model

// GET /api/members/band/:bandSlug
export const getMembersByBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bandSlug = req.params.bandSlug;
    const members = await Member.find({ bandSlug });
    res.json(members);
  } catch (error) {
      next(error);
  }
};

// GET /api/members/:id
export const getMemberById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }
      res.json(member);
  } catch (error) {
      next(error);
  }
};

// POST /api/members
export const createMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, instrument, band: bandName, image, bio } = req.body;

  try {
    const bandDoc = await Band.findOne({ name: bandName });
    if (!bandDoc) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }

    const bandSlug = slugify(bandName, { lower: true });

    const newMember = new Member({
      name,
      instrument,
      band: bandDoc._id, // 👈 make sure this is an ObjectId
      bandSlug,
      image,
      bio
    });

    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    next(error);
  }
};

// PUT /api/members/:id
export const updateMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, instrument, band, image, bio } = req.body;
  const bandSlug = band ? slugify(band, { lower: true }) : undefined;

  // Validate request body
  if (!name || !instrument || !band || !image || !bio) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id, 
      { name, instrument, band, bandSlug, image, bio },
      { new: true }
    );
  
    // If the member is not found
    if (!updatedMember) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    // Return the updated member
    res.json(updatedMember);
  } catch (error) {
    console.error(error); // Log error for debugging
    next(error); // Pass the error to the next middleware (error handler)
  }
};

// DELETE /api/members/:id
export const deleteMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;

  // Validate if the ID is provided and is a valid MongoDB ObjectId
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid member ID' });
    return;
  }

  try {
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      res.status(404).json({ message: 'Member not found' });
      return;
    }

    // Return a 204 No Content status indicating successful deletion
    res.status(204).send();
  } catch (error) {
    console.error(error); // Log the error for debugging
    next(error); // Pass the error to the next middleware (error handler)
  }
};
