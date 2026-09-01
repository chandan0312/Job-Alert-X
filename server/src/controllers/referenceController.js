// ---------------------------------------------------------------------------
// Reference-data controllers: categories, recruiters, courses, now-playing.
// ---------------------------------------------------------------------------
// These back the right-hand rail and the "Most Popular" row. Each maps to one
// mock function in `client/src/services/api.js`.
// ---------------------------------------------------------------------------

import { Category, Recruiter, Course, NowPlaying, NOW_PLAYING_ID } from '../models/index.js'
import { serialize } from '../utils/serialize.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { notFoundError } from '../middleware/error.js'

/** GET /api/categories — mirrors getCategories(). Ordered by vacancy volume. */
export const listCategories = asyncHandler(async (req, res) => {
  const rows = await Category.findAll({
    order: [
      ['jobs', 'DESC'],
      ['name', 'ASC'],
    ],
  })
  res.json(serialize(rows))
})

/** GET /api/categories/:slug */
export const categoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findByPk(String(req.params.slug).toLowerCase())
  if (!category) throw notFoundError(`No category found with slug "${req.params.slug}"`)
  res.json(serialize(category))
})

/** GET /api/recruiters — mirrors getRecruiters(). */
export const listRecruiters = asyncHandler(async (req, res) => {
  const rows = await Recruiter.findAll({ order: [['name', 'ASC']] })
  res.json(serialize(rows))
})

/** GET /api/courses — mirrors getPopularCourses(). */
export const listCourses = asyncHandler(async (req, res) => {
  const rows = await Course.findAll({ order: [['createdAt', 'ASC']] })
  res.json(serialize(rows))
})

/**
 * GET /api/now-playing — mirrors getNowPlaying().
 * Singleton row; returns null when the seed has not been run.
 */
export const getNowPlaying = asyncHandler(async (req, res) => {
  const row = await NowPlaying.findByPk(NOW_PLAYING_ID)
  res.json(row ? serialize(row, { omit: ['id'] }) : null)
})

export default {
  listCategories,
  categoryBySlug,
  listRecruiters,
  listCourses,
  getNowPlaying,
}
