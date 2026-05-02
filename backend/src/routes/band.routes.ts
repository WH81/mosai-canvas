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
  deleteStreamingLinksForBand
} from '../controllers/band.controller';

const router = express.Router();

// Band CRUD
router.post('/', createBand);
router.get('/', getAllBands);

// ⭐ Social Links CRUD for a band
router.get('/:bandId/social-links', getSocialLinksByBand);
router.post('/:bandId/social-links', createSocialLinksForBand);
router.put('/:bandId/social-links', updateSocialLinksForBand);
router.delete('/:bandId/social-links', deleteSocialLinksForBand);

// ⭐ Streaming Links CRUD for a band
router.get('/:bandId/streaming-links', getStreamingLinksByBand);
router.post('/:bandId/streaming-links', createStreamingLinksForBand);
router.put('/:bandId/streaming-links', updateStreamingLinksForBand);
router.delete('/:bandId/streaming-links', deleteStreamingLinksForBand);

// ⭐ These MUST come AFTER the social/streaming routes
router.put('/:id', updateBand);
router.delete('/:id', deleteBand);

// ⭐ Slug route MUST be last
router.get('/:slug', getBandBySlug);

export default router;
