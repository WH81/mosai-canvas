import express from 'express';

import {
  getMembersByBand,
  getMemberById,
  createMember,
  createMembersBatch,
  updateMember,
  deleteMember,
} from '../controllers/member.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';

import {
  validateMember,
  validateMemberBatch,
} from '../middleware/validate-member';

const router = express.Router();

// ============================================================
// PUBLIC READ ROUTES
// ============================================================

/**
 * Get all members belonging to a band.
 *
 * Example:
 * GET /api/members/band/mosai-canvas
 *
 * Public endpoint because the public website needs to display
 * band members.
 */
router.get(
  '/band/:bandSlug',
  getMembersByBand
);

/**
 * Get a single member by MongoDB ObjectId.
 *
 * Example:
 * GET /api/members/65f123...
 *
 * Public endpoint because member information is displayed
 * on the public website.
 */
router.get(
  '/:id',
  getMemberById
);

// ============================================================
// ADMIN WRITE ROUTES
// ============================================================

/**
 * Create multiple members.
 *
 * IMPORTANT:
 * /batch must remain BEFORE /:id.
 *
 * Otherwise Express could interpret "batch" as a member ID.
 *
 * Authentication is performed before validation so that an
 * unauthenticated request cannot reach the write operation.
 */
router.post(
  '/batch',
  authenticateAdmin,
  validateMemberBatch,
  createMembersBatch
);

/**
 * Create a single member.
 *
 * Authentication protects the write operation.
 * validateMember prevents unexpected/invalid member data
 * from reaching the controller.
 */
router.post(
  '/',
  authenticateAdmin,
  validateMember,
  createMember
);

/**
 * Update an existing member.
 *
 * Authentication protects the write operation.
 * validateMember validates the request body.
 *
 * The controller performs the additional runtime validation
 * of the member ID and verifies that the referenced band exists.
 */
router.put(
  '/:id',
  authenticateAdmin,
  validateMember,
  updateMember
);

/**
 * Delete an existing member.
 *
 * Authentication protects the destructive operation.
 * The controller validates the member ID before accessing
 * MongoDB.
 */
router.delete(
  '/:id',
  authenticateAdmin,
  deleteMember
);

export default router;