// ---------------------------------------------------------------------------
// /api/jobs
// ---------------------------------------------------------------------------

import { Router } from 'express'
import * as jobs from '../controllers/jobController.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

// Static segments must precede `/:id`, otherwise Express would match
// "trending" as an id and return 404.
router.get('/trending', jobs.trending)
router.get('/recent', jobs.recent)
router.get('/stats', jobs.stats)

router.get('/', jobs.list)
router.get('/:id', jobs.byId)
router.post('/:id/view', jobs.registerView)

// --- Admin (JWT required) ---
router.post('/', authRequired, jobs.create)
router.put('/:id', authRequired, jobs.update)
router.patch('/:id', authRequired, jobs.update)
router.delete('/:id', authRequired, jobs.remove)

export default router
