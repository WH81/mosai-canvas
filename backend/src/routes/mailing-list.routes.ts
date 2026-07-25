import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  createMailingListEntry,
  unsubscribeEntry,
  getAllMailingListEntries,
  getMailingListEntryById,
  updateMailingListEntry,
  deleteMailingListEntry,
} from '../controllers/mailing-list.controller';

const router: Router = Router();

/**
 * Rate limiter for subscribe endpoint.
 * Max 5 attempts per IP per 15 minutes.
 * Prevents abuse and spam subscriptions.
 */
const subscribeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Too many subscription attempts. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', subscribeLimiter, createMailingListEntry);
router.post('/unsubscribe', subscribeLimiter, unsubscribeEntry);
router.get('/', getAllMailingListEntries);
router.get('/:id', getMailingListEntryById);
router.put('/:id', updateMailingListEntry);
router.delete('/:id', deleteMailingListEntry);

export default router;