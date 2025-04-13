import express from 'express';
import {
  createBand,
  getAllBands,
  getBandBySlug,
  updateBand,
  deleteBand
} from '../controllers/band.controller';

const router = express.Router();

// Define the routes
router.post('/', createBand);
router.get('/', getAllBands);
router.get('/:slug', getBandBySlug);
router.put('/:id', updateBand);
router.delete('/:id', deleteBand);

export default router;
