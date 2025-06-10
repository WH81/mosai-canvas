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
  

  const router = Router();
  
  // Band-level social links
  router.post('/band/:bandId', createSocialLinksForBand);
  router.put('/band/:bandId', updateSocialLinksForBand);
  router.delete('/band/:bandId', deleteSocialLinksForBand);
  router.get('/band/:bandId', getSocialLinksForBand);
  
  // Member-level social links
  router.post('/member/:memberId', createSocialLinksForMember);
  router.put('/member/:memberId', updateSocialLinksForMember);
  router.delete('/member/:memberId', deleteSocialLinksForMember);
  router.get('/member/:memberId', getSocialLinksForMember);
  
  export default router;
  