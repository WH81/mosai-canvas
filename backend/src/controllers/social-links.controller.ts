import { Request, Response, NextFunction } from 'express';
import * as socialLinksService from '../services/social-links.service';

// BAND social links handlers

export const createSocialLinksForBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const created = await socialLinksService.createSocialLinksForBand(bandId, req.body);
    if (!created) {
      res.status(400).json({ message: 'Social links already exist for this band' });
      return;
    }
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateSocialLinksForBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const updated = await socialLinksService.updateSocialLinksForBand(bandId, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Social links not found for this band' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getSocialLinksForBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const socialLinks = await socialLinksService.getSocialLinksForBand(bandId);
    if (!socialLinks) {
      res.status(404).json({ message: 'Social links not found for this band' });
      return;
    }
    res.status(200).json(socialLinks);
  } catch (error) {
    next(error);
  }
};

export const deleteSocialLinksForBand = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const deleted = await socialLinksService.deleteSocialLinksForBand(bandId);
    if (!deleted) {
      res.status(404).json({ message: 'Social links not found for this band' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// MEMBER social links handlers

export const createSocialLinksForMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const memberId = req.params.memberId;
  if (!memberId) {
    res.status(400).json({ message: 'Member ID is required' });
    return;
  }

  try {
    const created = await socialLinksService.createSocialLinksForMember(memberId, req.body);
    if (!created) {
      res.status(400).json({ message: 'Social links already exist for this member' });
      return;
    }
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const updateSocialLinksForMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const memberId = req.params.memberId;
  if (!memberId) {
    res.status(400).json({ message: 'Member ID is required' });
    return;
  }

  try {
    const updated = await socialLinksService.updateSocialLinksForMember(memberId, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Social links not found for this member' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getSocialLinksForMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const memberId = req.params.memberId;
  if (!memberId) {
    res.status(400).json({ message: 'Member ID is required' });
    return;
  }

  try {
    const socialLinks = await socialLinksService.getSocialLinksForMember(memberId);
    if (!socialLinks) {
      res.status(404).json({ message: 'Social links not found for this member' });
      return;
    }
    res.status(200).json(socialLinks);
  } catch (error) {
    next(error);
  }
};

export const deleteSocialLinksForMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const memberId = req.params.memberId;
  if (!memberId) {
    res.status(400).json({ message: 'Member ID is required' });
    return;
  }

  try {
    const deleted = await socialLinksService.deleteSocialLinksForMember(memberId);
    if (!deleted) {
      res.status(404).json({ message: 'Social links not found for this member' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
