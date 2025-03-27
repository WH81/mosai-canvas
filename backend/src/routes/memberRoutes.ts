import express from 'express';
import {
  getMembersByBand,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController';

const router = express.Router();

router.get('/band/:band', getMembersByBand);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;
