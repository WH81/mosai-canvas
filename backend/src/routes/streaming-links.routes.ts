import express from 'express';
import {
  createStreamingLinks,
  updateStreamingLinks,
  getStreamingLinks,
  deleteStreamingLinks,
} from '../controllers/streaming-links.controller';

const router = express.Router();

router.get('/band/:bandId', getStreamingLinks);
router.post('/band/:bandId', createStreamingLinks);
router.put('/band/:bandId', updateStreamingLinks);
router.delete('/band/:bandId', deleteStreamingLinks);

export default router;
