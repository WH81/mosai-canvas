// src/routes/streaming-players.routes.ts
import { Router } from 'express';
import {
  upsertStreamingPlayer,
  updateStreamingPlayerById,
  getStreamingPlayers,
  deleteStreamingPlayerById,
} from '../controllers/streaming-players.controller';

const router = Router();

router.post('/', upsertStreamingPlayer as any);
router.get('/', getStreamingPlayers as any);
router.put('/:id', updateStreamingPlayerById as any);
router.delete('/:id', deleteStreamingPlayerById as any);

export default router;
