import express from 'express';

import {
  login,
} from '../controllers/auth.controller';

import {
  loginRateLimiter,
} from '../middleware/auth-rate-limit.middleware';

const router =
  express.Router();

router.post(
  '/login',
  loginRateLimiter,
  login
);

export default router;