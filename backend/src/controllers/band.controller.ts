import { Request, Response, RequestHandler } from 'express';
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
export const getAllBands: RequestHandler = async (_req, res): Promise<void> => {
  try {
    const bands = await Band.find()
      .populate('socialLinks')
      .populate('streamingLinks');
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
    const band = await Band.findOne({ slug }).populate('socialLinks').populate('streamingLinks');
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
    const updatedBand = await Band.findByIdAndUpdate(id, req.body, { new: true })
      .populate('socialLinks')
      .populate('streamingLinks');

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

// ===== Social Links CRUD for Band =====

export const getSocialLinksByBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const socialLinks = await SocialLinks.findOne({ band: bandId });
    if (!socialLinks) {
      res.status(404).json({ message: 'Social links not found for this band' });
      return;
    }
    res.json(socialLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching social links', error: err });
  }
};

export const createSocialLinksForBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const existing = await SocialLinks.findOne({ band: bandId });
    if (existing) {
      res.status(400).json({ message: 'Social links already exist for this band, use PUT to update' });
      return;
    }
    const socialLinks = new SocialLinks({ ...req.body, band: bandId });
    await socialLinks.save();
    await Band.findByIdAndUpdate(bandId, { socialLinks: socialLinks._id });
    res.status(201).json(socialLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error creating social links', error: err });
  }
};

export const updateSocialLinksForBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const socialLinks = await SocialLinks.findOneAndUpdate(
      { band: bandId },
      req.body,
      { new: true }
    );
    if (!socialLinks) {
      res.status(404).json({ message: 'Social links not found for this band' });
      return;
    }
    res.json(socialLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error updating social links', error: err });
  }
};

export const deleteSocialLinksForBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const deleted = await SocialLinks.findOneAndDelete({ band: bandId });
    if (!deleted) {
      res.status(404).json({ message: 'Social links not found for this band' });
      return;
    }
    await Band.findByIdAndUpdate(bandId, { $unset: { socialLinks: 1 } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting social links', error: err });
  }
};

// ===== Streaming Links CRUD for Band =====

export const getStreamingLinksByBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const streamingLinks = await StreamingLinks.findOne({ band: bandId });
    if (!streamingLinks) {
      res.status(404).json({ message: 'Streaming links not found for this band' });
      return;
    }
    res.json(streamingLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching streaming links', error: err });
  }
};

export const createStreamingLinksForBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const existing = await StreamingLinks.findOne({ band: bandId });
    if (existing) {
      res.status(400).json({ message: 'Streaming links already exist for this band, use PUT to update' });
      return;
    }

    const streamingLinks = new StreamingLinks({ ...req.body, band: bandId });
    await streamingLinks.save();

    await Band.findByIdAndUpdate(bandId, { streamingLinks: streamingLinks._id });
    res.status(201).json(streamingLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error creating streaming links', error: err });
  }
};

export const updateStreamingLinksForBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const streamingLinks = await StreamingLinks.findOneAndUpdate(
      { band: bandId },
      req.body,
      { new: true }
    );
    if (!streamingLinks) {
      res.status(404).json({ message: 'Streaming links not found for this band' });
      return;
    }
    res.json(streamingLinks);
  } catch (err) {
    res.status(500).json({ message: 'Error updating streaming links', error: err });
  }
};

export const deleteStreamingLinksForBand: RequestHandler<{ bandId: string }> = async (
  req: Request<{ bandId: string }>,
  res: Response
): Promise<void> => {
  const { bandId } = req.params;
  try {
    const deleted = await StreamingLinks.findOneAndDelete({ band: bandId });
    if (!deleted) {
      res.status(404).json({ message: 'Streaming links not found for this band' });
      return;
    }
    await Band.findByIdAndUpdate(bandId, { $unset: { streamingLinks: 1 } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Error deleting streaming links', error: err });
  }
};

