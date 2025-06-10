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
router.post('/', createBand);
router.get('/', getAllBands);
router.get('/:slug', getBandBySlug);
router.put('/:id', updateBand);
router.delete('/:id', deleteBand);

// Social Links CRUD for a band
router.get('/:bandId/social-links', getSocialLinksByBand);
router.post('/:bandId/social-links', createSocialLinksForBand);
router.put('/:bandId/social-links', updateSocialLinksForBand);
router.delete('/:bandId/social-links', deleteSocialLinksForBand);

// Streaming Links CRUD for a band
router.get('/:bandId/streaming-links', getStreamingLinksByBand);
router.post('/:bandId/streaming-links', createStreamingLinksForBand);
router.put('/:bandId/streaming-links', updateStreamingLinksForBand);
router.delete('/:bandId/streaming-links', deleteStreamingLinksForBand);


export default router;
