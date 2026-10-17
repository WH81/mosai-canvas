import express from 'express';

import {
  createBand,
  getAllBands,
  getBandBySlug,
  updateBand,
  deleteBand,

  getSocialLinksByBand,
  createSocialLinksForBand,
  updateSocialLinksForBand,
  deleteSocialLinksForBand,

  getStreamingLinksByBand,
  createStreamingLinksForBand,
  updateStreamingLinksForBand,
  deleteStreamingLinksForBand,
} from '../controllers/band.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';

import { validateBandId } from '../middleware/validate-band-id';
import { validateSocialLinks } from '../middleware/validate-social-links';
import { validateStreamingLinks } from '../middleware/validate-streaming-links';

const router = express.Router();

// ============================================================
// BAND CRUD
// ============================================================

router.get(
  '/',
  getAllBands
);

router.post(
  '/',
  authenticateAdmin,
  validateBandId,
  createBand
);

router.put(
  '/:id',
  authenticateAdmin,
  validateBandId,
  updateBand
);

router.delete(
  '/:id',
  authenticateAdmin,
  deleteBand
);

// ============================================================
// BAND SOCIAL LINKS
// ============================================================

router.get(
  '/:bandId/social-links',
  getSocialLinksByBand
);

router.post(
  '/:bandId/social-links',
  authenticateAdmin,
  validateSocialLinks,
  createSocialLinksForBand
);

router.put(
  '/:bandId/social-links',
  authenticateAdmin,
  validateSocialLinks,
  updateSocialLinksForBand
);

router.delete(
  '/:bandId/social-links',
  authenticateAdmin,
  deleteSocialLinksForBand
);

// ============================================================
// BAND STREAMING LINKS
// ============================================================

router.get(
  '/:bandId/streaming-links',
  getStreamingLinksByBand
);

router.post(
  '/:bandId/streaming-links',
  authenticateAdmin,
  validateStreamingLinks,
  createStreamingLinksForBand
);

router.put(
  '/:bandId/streaming-links',
  authenticateAdmin,
  validateStreamingLinks,
  updateStreamingLinksForBand
);

router.delete(
  '/:bandId/streaming-links',
  authenticateAdmin,
  deleteStreamingLinksForBand
);

// ============================================================
// BAND BY SLUG
// ============================================================

router.get(
  '/:slug',
  getBandBySlug
);

export default router;