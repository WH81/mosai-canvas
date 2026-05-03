import { Router } from 'express';
import {
  getTopTracks,
  getDiscography,
  getProfile,
} from '../controllers/spotify.controller';
 
const router = Router();
 
/**
 * GET /api/spotify/top-tracks/:bandId
 * Query params: ?market=US&bandName=Wailing+Canvas (bandName used as fallback)
 */
router.get('/top-tracks/:bandId', getTopTracks as any);
 
/**
 * GET /api/spotify/discography/:bandId
 * Query params: ?market=US&bandName=Wailing+Canvas
 */
router.get('/discography/:bandId', getDiscography as any);
 
/**
 * GET /api/spotify/profile/:bandId
 * Query params: ?bandName=Wailing+Canvas (used as fallback if no artist ID stored)
 */
router.get('/profile/:bandId', getProfile as any);
 
export default router;
 