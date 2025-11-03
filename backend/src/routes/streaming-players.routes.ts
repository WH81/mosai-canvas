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





// const router = Router();

// // Create a new streaming player
// router.post('/', async (req: Request, res: Response) => {
//   try {
//     await createStreamingPlayers(req, res);
//   } catch (error) {
//     res.status(500).send({ error: 'An error occurred while creating the streaming player.' });
//   }
// });

// // Get all streaming players (optionally by bandId query: /?bandId=xxx)
// router.get('/', async (req: Request, res: Response) => {
//   try {
//     await getStreamingPlayers(req, res);
//   } catch (error) {
//     res.status(500).send({ error: 'An error occurred while fetching the streaming players.' });
//   }
// });

// // Update a streaming player by ID
// router.put('/:id', async (req: Request, res: Response) => {
//   try {
//     await updateStreamingPlayers(req, res);
//   } catch (error) {
//     res.status(500).send({ error: 'An error occurred while updating the streaming player.' });
//   }
// });

// // Delete a streaming player by ID
// router.delete('/:id', async (req: Request, res: Response) => {
//   try {
//     await deleteStreamingPlayers(req, res);
//   } catch (error) {
//     res.status(500).send({ error: 'An error occurred while deleting the streaming player.' });
//   }
// });

// export default router;
