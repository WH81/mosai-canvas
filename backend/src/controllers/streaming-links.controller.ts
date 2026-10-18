import { Request, Response, NextFunction } from 'express';

import {
  createStreamingLinksForBand as createBandLinks,
  getStreamingLinksForBand as getBandLinks,
  updateStreamingLinksForBand as updateBandLinks,
  deleteStreamingLinksForBand as deleteBandLinks,
  createStreamingLinksForMember as createMemberLinks,
  getStreamingLinksForMember as getMemberLinks,
  updateStreamingLinksForMember as updateMemberLinks,
  deleteStreamingLinksForMember as deleteMemberLinks,
  StreamingLinksPayload,
} from '../services/streaming-links.service';

// ============================================================
// ROUTE PARAMETER TYPES
// ============================================================

type BandParams = {
  bandId: string;
};

type MemberParams = {
  memberId: string;
};

// ============================================================
// ERROR HANDLING
// ============================================================

const handleError = (
  error: unknown,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof Error) {
    if (error.name === 'NotFoundError') {
      res.status(404).json({
        message: error.message,
      });
      return;
    }

    if (error.name === 'ConflictError') {
      res.status(409).json({
        message: error.message,
      });
      return;
    }

    if (error.message.startsWith('Invalid ')) {
      res.status(400).json({
        message: error.message,
      });
      return;
    }
  }

  next(error);
};

// ============================================================
// BAND
// ============================================================

export const createStreamingLinksForBand = async (
  req: Request<BandParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await createBandLinks(
      req.params.bandId,
      req.body as StreamingLinksPayload
    );

    res.status(201).json(links);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getStreamingLinksForBand = async (
  req: Request<BandParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await getBandLinks(req.params.bandId);

    if (!links) {
      res.status(404).json({
        message: 'Streaming links not found for this band.',
      });
      return;
    }

    res.json(links);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const updateStreamingLinksForBand = async (
  req: Request<BandParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await updateBandLinks(
      req.params.bandId,
      req.body as StreamingLinksPayload
    );

    res.json(links);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const deleteStreamingLinksForBand = async (
  req: Request<BandParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteBandLinks(req.params.bandId);

    res.status(204).send();
  } catch (error) {
    handleError(error, res, next);
  }
};

// ============================================================
// MEMBER
// ============================================================

export const createStreamingLinksForMember = async (
  req: Request<MemberParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await createMemberLinks(
      req.params.memberId,
      req.body as StreamingLinksPayload
    );

    res.status(201).json(links);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const getStreamingLinksForMember = async (
  req: Request<MemberParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await getMemberLinks(req.params.memberId);

    if (!links) {
      res.status(404).json({
        message: 'Streaming links not found for this member.',
      });
      return;
    }

    res.json(links);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const updateStreamingLinksForMember = async (
  req: Request<MemberParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await updateMemberLinks(
      req.params.memberId,
      req.body as StreamingLinksPayload
    );

    res.json(links);
  } catch (error) {
    handleError(error, res, next);
  }
};

export const deleteStreamingLinksForMember = async (
  req: Request<MemberParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteMemberLinks(req.params.memberId);

    res.status(204).send();
  } catch (error) {
    handleError(error, res, next);
  }
};