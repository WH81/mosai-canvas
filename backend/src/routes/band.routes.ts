import express from 'express';
import {
  createBand,
  getAllBands,
  getBandBySlug,
  updateBand,
  deleteBand,
  upsertStreamingLinks,
  upsertSocialLinks
} from '../controllers/band.controller';

const router = express.Router();
router.post('/', createBand);
router.get('/', getAllBands);
router.get('/:slug', getBandBySlug);
router.put('/:id', updateBand);
router.delete('/:id', deleteBand);

router.post('/:bandId/streaming-links', upsertStreamingLinks);
router.post('/:bandId/social-links', upsertSocialLinks);

export default router;
