import express from 'express';

import {
  getAbout,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout,
} from '../controllers/about.controller';

import { validateAbout } from '../middleware/validate-about';
import { authenticateAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/*
 * Public read endpoints.
 *
 * The public website needs to retrieve About content.
 */
router.get('/', getAbout);

router.get('/:id', getAboutById);

/*
 * Protected write endpoints.
 *
 * Authentication happens BEFORE validation and controller
 * execution.
 */
router.post(
  '/',
  authenticateAdmin,
  validateAbout,
  createAbout
);

router.put(
  '/:id',
  authenticateAdmin,
  validateAbout,
  updateAbout
);

router.delete(
  '/:id',
  authenticateAdmin,
  deleteAbout
);

export default router;