import { Router } from 'express';

import {
  createSocialLinksForBand,
  updateSocialLinksForBand,
  deleteSocialLinksForBand,
  getSocialLinksForBand,
  createSocialLinksForMember,
  updateSocialLinksForMember,
  deleteSocialLinksForMember,
  getSocialLinksForMember,
} from '../controllers/social-links.controller';

import { authenticateAdmin } from '../middleware/auth.middleware';
import { validateSocialLinks } from '../middleware/validate-social-links';

const router = Router();

// ============================================================
// BAND SOCIAL LINKS
// ============================================================

router.get(
  '/band/:bandId',
  getSocialLinksForBand
);

router.post(
  '/band/:bandId',
  authenticateAdmin,
  validateSocialLinks,
  createSocialLinksForBand
);

router.put(
  '/band/:bandId',
  authenticateAdmin,
  validateSocialLinks,
  updateSocialLinksForBand
);

router.delete(
  '/band/:bandId',
  authenticateAdmin,
  deleteSocialLinksForBand
);

// ============================================================
// MEMBER SOCIAL LINKS
// ============================================================

router.get(
  '/member/:memberId',
  getSocialLinksForMember
);

router.post(
  '/member/:memberId',
  authenticateAdmin,
  validateSocialLinks,
  createSocialLinksForMember
);

router.put(
  '/member/:memberId',
  authenticateAdmin,
  validateSocialLinks,
  updateSocialLinksForMember
);

router.delete(
  '/member/:memberId',
  authenticateAdmin,
  deleteSocialLinksForMember
);

export default router;