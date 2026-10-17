import express from 'express';

import {
  getCarouselItems,
  getCarouselItemById,
  createCarouselItem,
  updateCarouselItem,
  reorderCarouselItems,
  deleteCarouselItem,
} from '../controllers/carousel.controller';

import {
  validateCarouselItem,
  validateCarouselOrder,
} from '../middleware/validate-carousel-item';

import {
  authenticateAdmin,
} from '../middleware/auth.middleware';

const router =
  express.Router();

/**
 * PUBLIC
 */
router.get(
  '/',
  getCarouselItems
);

/**
 * IMPORTANT:
 * /order must appear before /:id.
 */
router.put(
  '/order',
  authenticateAdmin,
  validateCarouselOrder,
  reorderCarouselItems
);

/**
 * ADMIN
 */
router.post(
  '/',
  authenticateAdmin,
  validateCarouselItem,
  createCarouselItem
);

/**
 * ADMIN
 */
router.put(
  '/:id',
  authenticateAdmin,
  validateCarouselItem,
  updateCarouselItem
);

/**
 * ADMIN
 */
router.delete(
  '/:id',
  authenticateAdmin,
  deleteCarouselItem
);

/**
 * PUBLIC
 */
router.get(
  '/:id',
  getCarouselItemById
);

export default router;