import { Router } from 'express';
import { sendContactMessage } from '../controllers/contact.controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: 'Too many requests, please try again later.'
});

router.post('/contact', limiter, sendContactMessage);

export default router;
