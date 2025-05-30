import { Request, Response, RequestHandler } from 'express';
import { Types } from 'mongoose';
import { Band } from '../models/band.model';
import { StreamingLinks } from '../models/streaming-links.model';
import { SocialLinks } from '../models/social-links.model';

// Create a new band
export const createBand: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const band = new Band(req.body);
    const savedBand = await band.save();
    res.status(201).json(savedBand);
  } catch (err) {
    res.status(500).json({ message: 'Error creating band', error: err });
  }
};

// Get all bands
export const getAllBands: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bands = await Band.find();
    res.json(bands);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bands', error: err });
  }
};

// Get band by slug
export const getBandBySlug: RequestHandler<{ slug: string }> = async (
  req: Request<{ slug: string }>,
  res: Response
): Promise<void> => {
  try {
    const { slug } = req.params;
    const band = await Band.findOne({ slug }).populate('streamingLinks').populate('socialLinks');
    if (!band) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }
    res.json(band);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching band', error: err });
  }
};

// Update a band
export const updateBand: RequestHandler<{ id: string }> = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedBand = await Band.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBand) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }
    res.json(updatedBand);
  } catch (err) {
    res.status(500).json({ message: 'Error updating band', error: err });
  }
};

// Delete a band
export const deleteBand: RequestHandler<{ id: string }> = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedBand = await Band.findByIdAndDelete(id);
    if (!deletedBand) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }
    res.json({ message: 'Band deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting band', error: err });
  }
};

// Upsert streaming links
export const upsertStreamingLinks: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  if (!Types.ObjectId.isValid(bandId)) {
    res.status(400).json({ message: 'Invalid band ID' });
    return;
  }

  const data = { ...req.body, band: bandId };
  if (data.memberId == null) delete data.memberId;

  try {
    let streamingLinks = await StreamingLinks.findOne({ band: bandId });

    if (streamingLinks) {
      streamingLinks.set(data);
    } else {
      streamingLinks = new StreamingLinks(data);
    }

    await streamingLinks.save();

    const band = await Band.findById(bandId);
    if (!band) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }

    band.streamingLinks = streamingLinks._id as Types.ObjectId;
    await band.save();

    res.status(200).json(streamingLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error saving streaming links', error: err });
  }
};

// Upsert social links
export const upsertSocialLinks: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;

  if (!Types.ObjectId.isValid(bandId)) {
    res.status(400).json({ message: 'Invalid band ID' });
    return;
  }

  const data = { ...req.body, band: bandId };

  try {
    const socialLinks = await SocialLinks.findOneAndUpdate(
      { band: bandId },
      data,
      { new: true, upsert: true }
    );    

    await socialLinks.save();

    const band = await Band.findById(bandId);
    if (!band) {
      res.status(404).json({ message: 'Band not found' });
      return;
    }

    band.socialLinks = socialLinks._id as Types.ObjectId;
    await band.save();

    res.status(200).json(socialLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error saving social links', error: err });
  }
};
