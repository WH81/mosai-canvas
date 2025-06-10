import { Router } from 'express';
import {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour
} from '../controllers/tour.controller';

const router: Router = Router();

router.post('/', createTour);
router.get('/', getAllTours);
router.get('/:id', getTourById);
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);

export default router;