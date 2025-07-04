import { Request, Response, NextFunction } from 'express';
import * as streamingLinksService from '../services/streaming-links.service';

export const createStreamingLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const created = await streamingLinksService.createStreamingLinks(bandId, req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error); // Let Express handle with global error middleware
  }
};

export const updateStreamingLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const updated = await streamingLinksService.updateStreamingLinks(bandId, req.body);
    if (!updated) {
      res.status(404).json({ message: 'Streaming links not found for the given band.' });
      return;
    }
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getStreamingLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const links = await streamingLinksService.getStreamingLinks(bandId);
    if (!links) {
      res.status(404).json({ message: 'Streaming links not found for the given band.' });
      return;
    }
    res.status(200).json(links);
  } catch (error) {
    next(error);
  }
};

export const deleteStreamingLinks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const bandId = req.params.bandId;
  if (!bandId) {
    res.status(400).json({ message: 'Band ID is required' });
    return;
  }

  try {
    const deleted = await streamingLinksService.deleteStreamingLinks(bandId);
    if (!deleted) {
      res.status(404).json({ message: 'Streaming links not found for the given band.' });
      return;
    }
    res.status(200).json({ message: 'Streaming links deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
