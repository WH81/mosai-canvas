import express from 'express';
import {
  getMembersByBand,
  getMemberById,
  createMember,
  createMembersBatch,
  updateMember,
  deleteMember
} from '../controllers/member.controller';

const router = express.Router();

router.get('/band/:bandSlug', getMembersByBand);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.post('/batch', createMembersBatch);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
