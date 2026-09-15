// ---------------------------------------------------------------------------
// Reference-data controllers: categories, recruiters, courses, now-playing.
// ---------------------------------------------------------------------------
// These back the right-hand rail and the "Most Popular" row. Each maps to one
// mock function in `client/src/services/api.js`.
// ---------------------------------------------------------------------------

import { Category, Recruiter, Course, NowPlaying, NOW_PLAYING_ID, Job, sequelize } from '../models/index.js'
import { serialize } from '../utils/serialize.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { notFoundError } from '../middleware/error.js'

/** GET /api/categories — mirrors getCategories(). Dynamically computed from DB. */
export const listCategories = asyncHandler(async (req, res) => {
  const [rows, stats] = await Promise.all([
    Category.findAll(),
    Job.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'postsCount'],
        [sequelize.fn('SUM', sequelize.col('vacancies')), 'totalVacancies'],
      ],
      group: ['category'],
    }),
  ])

  const statsMap = {}
  stats.forEach((s) => {
    const c = s.get('category')
    statsMap[c] = {
      postsCount: parseInt(s.get('postsCount'), 10) || 0,
      totalVacancies: parseInt(s.get('totalVacancies'), 10) || 0,
    }
  })

  const enriched = rows.map((r) => {
    const item = serialize(r)
    const st = statsMap[item.slug] || { postsCount: 0, totalVacancies: 0 }
    return {
      ...item,
      postsCount: st.postsCount,
      totalVacancies: st.totalVacancies,
      jobs: st.totalVacancies > 0 ? st.totalVacancies : (st.postsCount > 0 ? st.postsCount : item.jobs),
    }
  })

  // Sort by highest active posts / vacancies in database
  enriched.sort((a, b) => b.postsCount - a.postsCount || b.totalVacancies - a.totalVacancies)

  res.json(enriched)
})

/** GET /api/categories/:slug */
export const categoryBySlug = asyncHandler(async (req, res) => {
  const slug = String(req.params.slug).toLowerCase()
  const category = await Category.findByPk(slug)
  if (!category) throw notFoundError(`No category found with slug "${req.params.slug}"`)

  const stats = await Job.findOne({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'postsCount'],
      [sequelize.fn('SUM', sequelize.col('vacancies')), 'totalVacancies'],
    ],
    where: { category: slug },
  })

  const postsCount = stats ? parseInt(stats.get('postsCount'), 10) || 0 : 0
  const totalVacancies = stats ? parseInt(stats.get('totalVacancies'), 10) || 0 : 0

  const item = serialize(category)
  res.json({
    ...item,
    postsCount,
    totalVacancies,
    jobs: totalVacancies > 0 ? totalVacancies : (postsCount > 0 ? postsCount : item.jobs),
  })
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
