import express from 'express';
import {
  createStreamingLinks,
  updateStreamingLinks,
  getStreamingLinks,
  deleteStreamingLinks,
} from '../controllers/streaming-links.controller';

const router = express.Router();

router.post('/:bandId', createStreamingLinks);
router.put('/:bandId', updateStreamingLinks);
router.get('/:bandId', getStreamingLinks);
router.delete('/:bandId', deleteStreamingLinks);

export default router;
