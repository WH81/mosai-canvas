import rateLimit from 'express-rate-limit';

/**
 * Limits repeated login attempts from the same IP address.
 *
 * Purpose:
 * - Helps prevent brute-force password attacks.
 * - Applies only to the authentication endpoint.
 *
 * 10 attempts per 15 minutes is reasonable for this
 * private admin application.
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 10,

  standardHeaders: 'draft-7',

  legacyHeaders: false,

  message: {
    message:
      'Too many login attempts. Please try again later.',
  },

  /**
   * Do not count successful requests against the limit.
   *
   * Failed login attempts are what we're primarily interested in.
   */
  skipSuccessfulRequests: true,
});