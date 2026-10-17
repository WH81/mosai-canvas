import { Router } from 'express';

import {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
} from '../controllers/tour.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateTour } from '../middleware/validate-tour';

const router: Router = Router();

/*
 * Public read endpoints.
 */
router.get('/', getAllTours);

router.get('/:id', getTourById);

/*
 * Protected administrator write endpoints.
 *
 * Authentication runs first.
 * Validation runs second.
 * Controller runs last.
 */
router.post(
  '/',
  authenticateAdmin,
  validateTour,
  createTour
);

router.put(
  '/:id',
  authenticateAdmin,
  validateTour,
  updateTour
);

router.delete(
  '/:id',
  authenticateAdmin,
  deleteTour
);

export default router;