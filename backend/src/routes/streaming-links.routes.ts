import express from 'express';

import {
  createStreamingLinksForBand,
  updateStreamingLinksForBand,
  getStreamingLinksForBand,
  deleteStreamingLinksForBand,
  createStreamingLinksForMember,
  updateStreamingLinksForMember,
  getStreamingLinksForMember,
  deleteStreamingLinksForMember,
} from '../controllers/streaming-links.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateStreamingLinks } from '../middleware/validate-streaming-links';

const router = express.Router();

// ============================================================
// BAND STREAMING LINKS
// ============================================================

router.get(
  '/band/:bandId',
  getStreamingLinksForBand
);

router.post(
  '/band/:bandId',
  authenticateAdmin,
  validateStreamingLinks,
  createStreamingLinksForBand
);

router.put(
  '/band/:bandId',
  authenticateAdmin,
  validateStreamingLinks,
  updateStreamingLinksForBand
);

router.delete(
  '/band/:bandId',
  authenticateAdmin,
  deleteStreamingLinksForBand
);

// ============================================================
// MEMBER STREAMING LINKS
// ============================================================

router.get(
  '/member/:memberId',
  getStreamingLinksForMember
);

router.post(
  '/member/:memberId',
  authenticateAdmin,
  validateStreamingLinks,
  createStreamingLinksForMember
);

router.put(
  '/member/:memberId',
  authenticateAdmin,
  validateStreamingLinks,
  updateStreamingLinksForMember
);

router.delete(
  '/member/:memberId',
  authenticateAdmin,
  deleteStreamingLinksForMember
);

export default router;