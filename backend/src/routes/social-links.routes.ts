import express from 'express';
import { createSocialLinks, updateSocialLinks } from '../controllers/social-links.controller';

const router = express.Router();

router.post('/:bandId', createSocialLinks);
router.put('/:bandId', updateSocialLinks);

export default router;
