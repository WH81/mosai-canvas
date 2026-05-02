import { Router } from 'express';
import * as ReleaseController from '../controllers/release.controller';

const router = Router();

router.get('/', ReleaseController.getAllReleases); // GET /api/releases
router.post('/', ReleaseController.createRelease); // POST /api/releases
router.put('/:id', ReleaseController.updateRelease); // PUT /api/releases/:id
router.delete('/:id', ReleaseController.deleteRelease); // DELETE /api/releases/:id

export default router;
