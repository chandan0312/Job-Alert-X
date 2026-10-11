// ---------------------------------------------------------------------------
// /api/articles
// ---------------------------------------------------------------------------

import { Router } from 'express'
import * as articles from '../controllers/articleController.js'
import { authRequired } from '../middleware/auth.js'
import { cacheResponse, invalidateCache } from '../middleware/cache.js'

const router = Router()

// Middleware to invalidate cache on any admin mutation
const bustCache = (req, res, next) => {
  invalidateCache()
  next()
}

// Static segments precede dynamic /:slug
router.get('/categories', cacheResponse(60_000), articles.listCategories)
router.get('/admin/all', authRequired, articles.adminList)

// Public endpoints
router.get('/', cacheResponse(15_000), articles.list)
router.get('/:slug', cacheResponse(15_000), articles.bySlugOrId)

// Admin mutations
router.post('/', authRequired, bustCache, articles.create)
router.put('/:id', authRequired, bustCache, articles.update)
router.patch('/:id', authRequired, bustCache, articles.update)
router.delete('/:id', authRequired, bustCache, articles.remove)

export default router
