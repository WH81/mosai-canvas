import { Request, Response } from 'express';
import * as socialLinksService from '../services/social-links.service';

export const createSocialLinks = async (req: Request, res: Response) => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const created = await socialLinksService.createSocialLinks(bandId, req.body);
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: 'Error creating social links', error });
  }
};

export const updateSocialLinks = async (req: Request, res: Response) => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const updated = await socialLinksService.updateSocialLinks(bandId, req.body);
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating social links', error });
  }
};
