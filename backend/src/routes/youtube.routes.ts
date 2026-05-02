import { Router } from 'express';
import { YouTubeController } from '../controllers/youtube.controller';

const router = Router();

router.get('/band/:bandSlug', YouTubeController.getBandVideos);

export default router;