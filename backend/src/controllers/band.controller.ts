import { Request, Response, NextFunction } from 'express';
import Band from '../models/band.model';
import Member from '../models/member.model';
import SocialLinks from '../models/social-links.model';
import mongoose from 'mongoose';

// GET /api/bands
export const getAllBands = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bands = await Band.find().populate('socialLinks');
    res.json(bands);
  } catch (error) {
    return next(error);
  }
};

// GET /api/bands/:slug
export const getBandBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const band = await Band.findOne({ slug }).populate('socialLinks');

    if (!band) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }

    res.json(band);
  } catch (error) {
    next(error);
  }
};

// GET /api/bands/:slug/members
export const getBandWithMembers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { slug } = req.params;
    const band = await Band.findOne({ slug }).populate('socialLinks');

    if (!band) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }

    const members = await Member.find({ band: band.name }).populate('socialLinks');
    res.json({ band, members });
  } catch (error) {
    return next(error);
  }
};

// POST /api/bands
export const createBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, slug, description, image, socialLinks } = req.body;

  try {
    const bandExists = await Band.findOne({ slug });
    if (bandExists) {
      res.status(400).json({ message: 'Band with that slug already exists' });
      return;
    }

    let socialLinksId = undefined;

    if (socialLinks && typeof socialLinks === 'object' && !mongoose.Types.ObjectId.isValid(socialLinks)) {
      const newLinks = new SocialLinks({ ...socialLinks });
      const savedLinks = await newLinks.save();
      socialLinksId = savedLinks._id;
    } else if (mongoose.Types.ObjectId.isValid(socialLinks)) {
      socialLinksId = socialLinks;
    }

    const newBand = new Band({ name, slug, description, image, socialLinks: socialLinksId });
    const savedBand = await newBand.save();
    res.status(201).json(savedBand);
  } catch (error) {
    return next(error);
  }
};

// PUT /api/bands/:id
export const updateBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { name, slug, description, image, socialLinks } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: 'Invalid Band ID' });
    return;
  }

  try {
    let socialLinksId = undefined;

    if (socialLinks && typeof socialLinks === 'object' && !mongoose.Types.ObjectId.isValid(socialLinks)) {
      const newLinks = new SocialLinks({ ...socialLinks });
      const savedLinks = await newLinks.save();
      socialLinksId = savedLinks._id;
    } else if (mongoose.Types.ObjectId.isValid(socialLinks)) {
      socialLinksId = socialLinks;
    }

    const updatedBand = await Band.findByIdAndUpdate(
      id,
      { name, slug, description, image, socialLinks: socialLinksId },
      { new: true }
    );

    if (!updatedBand) {
      res.status(404).json({ message: 'Band not found' });
      return;
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
    return;
  }

  try {
    const deletedBand = await Band.findByIdAndDelete(id);

    if (!deletedBand) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
