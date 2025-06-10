import { Router } from 'express';
import {
  createMailingListEntry,
  getAllMailingListEntries,
  getMailingListEntryById,
  updateMailingListEntry,
  deleteMailingListEntry
} from '../controllers/mailing-list.controller';

const router: Router = Router();

router.post('/', createMailingListEntry);
router.get('/', getAllMailingListEntries);
router.get('/:id', getMailingListEntryById);
router.put('/:id', updateMailingListEntry);
router.delete('/:id', deleteMailingListEntry);

export default router;
