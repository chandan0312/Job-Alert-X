// ---------------------------------------------------------------------------
// Job controller — powers every post-related read plus admin CRUD.
// ---------------------------------------------------------------------------
// Each read mirrors one function in `client/src/services/api.js`:
//   list   -> getJobs / getJobsByCategory / getJobsByKind
//   byId   -> getJobById
//   trending -> getTrending
//   recent -> getRecentlyPosted
//   search -> searchJobs
// ---------------------------------------------------------------------------

import { Op } from 'sequelize'
import { Job, Category, JOB_KINDS } from '../models/index.js'
import { serialize } from '../utils/serialize.js'
import { slugify, uniqueSlug } from '../utils/slugify.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { badRequest, notFoundError } from '../middleware/error.js'

const DEFAULT_RECENT_LIMIT = 5
const MAX_LIMIT = 100

// Newest first. `id` breaks ties so pagination is deterministic when several
// rows share a createdAt (as the seeded batch nearly does).
const NEWEST_FIRST = [
  ['createdAt', 'DESC'],
  ['id', 'ASC'],
]

/** Parse and clamp a `?limit=` value. Returns undefined when absent. */
function parseLimit(raw, fallback) {
  if (raw === undefined || raw === '') return fallback
  const value = Number.parseInt(raw, 10)
  if (Number.isNaN(value) || value < 1) {
    throw badRequest('`limit` must be a positive integer')
  }
  return Math.min(value, MAX_LIMIT)
}

/** Interpret common truthy/falsy query spellings. */
function parseBool(raw) {
  if (raw === undefined || raw === '') return undefined
  const value = String(raw).toLowerCase()
  if (['1', 'true', 'yes'].includes(value)) return true
  if (['0', 'false', 'no'].includes(value)) return false
  return undefined
}

/** Fields a free-text query is matched against (mirrors the mock's searchJobs). */
const SEARCHABLE = ['title', 'org', 'orgShort', 'category', 'tagline']

function searchClause(query) {
  const term = `%${query}%`
  return { [Op.or]: SEARCHABLE.map((field) => ({ [field]: { [Op.like]: term } })) }
}

/**
 * GET /api/jobs
 * Query: ?category= &kind= &featured= &q= &limit= &offset=
 */
export const list = asyncHandler(async (req, res) => {
  const { category, kind, featured, inTicker, q, limit, offset } = req.query

  const where = {}
  if (category) where.category = String(category).toLowerCase()

  if (kind) {
    const value = String(kind).toLowerCase()
    if (!JOB_KINDS.includes(value)) {
      throw badRequest(`Unknown kind "${kind}". Expected one of: ${JOB_KINDS.join(', ')}`)
    }
    where.kind = value
  }

  const isFeatured = parseBool(featured)
  if (isFeatured !== undefined) where.featured = isFeatured

  const isInTicker = parseBool(inTicker)
  if (isInTicker !== undefined) where.inTicker = isInTicker

  const trimmed = String(q ?? '').trim()
  if (trimmed) Object.assign(where, searchClause(trimmed))

  const rows = await Job.findAll({
    where,
    order: NEWEST_FIRST,
    limit: parseLimit(limit, undefined),
    offset: offset ? Number.parseInt(offset, 10) || 0 : undefined,
  })

  res.json(serialize(rows))
})

/** GET /api/jobs/trending — featured posts for the home-page hero carousel. */
export const trending = asyncHandler(async (req, res) => {
  const rows = await Job.findAll({
    where: { featured: true },
    order: NEWEST_FIRST,
    limit: parseLimit(req.query.limit, undefined),
  })
  res.json(serialize(rows))
})

/** GET /api/jobs/ticker — posts displayed in the moving header marquee ticker. */
export const ticker = asyncHandler(async (req, res) => {
  let rows = await Job.findAll({
    where: { inTicker: true },
    order: NEWEST_FIRST,
    limit: parseLimit(req.query.limit, 10),
  })
  // Fallback to featured or recent if none marked as inTicker yet
  if (rows.length === 0) {
    rows = await Job.findAll({
      where: { featured: true },
      order: NEWEST_FIRST,
      limit: parseLimit(req.query.limit, 10),
    })
  }
  if (rows.length === 0) {
    rows = await Job.findAll({
      order: NEWEST_FIRST,
      limit: parseLimit(req.query.limit, 10),
    })
  }
  res.json(serialize(rows))
})

/** GET /api/jobs/recent — "Recently Posted Jobs" strip. */
export const recent = asyncHandler(async (req, res) => {
  const rows = await Job.findAll({
    where: { kind: 'job' },
    order: NEWEST_FIRST,
    limit: parseLimit(req.query.limit, DEFAULT_RECENT_LIMIT),
  })
  res.json(serialize(rows))
})

/** GET /api/search?q= — free-text search across all post kinds. */
export const search = asyncHandler(async (req, res) => {
  const query = String(req.query.q ?? '').trim()

  // The mock returns [] for an empty query rather than the full dataset; keep that.
  if (!query) return res.json([])

  const rows = await Job.findAll({
    where: searchClause(query),
    order: NEWEST_FIRST,
    limit: parseLimit(req.query.limit, undefined),
  })
  res.json(serialize(rows))
})

/** GET /api/jobs/:id — one post by slug. */
export const byId = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (!job) throw notFoundError(`No post found with id "${req.params.id}"`)
  res.json(serialize(job))
})

/**
 * POST /api/jobs/:id/view — increment the view counter.
 * Atomic so concurrent readers cannot clobber each other's increment.
 */
export const registerView = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (!job) throw notFoundError(`No post found with id "${req.params.id}"`)

  await job.increment('views', { by: 1 })
  await job.reload()
  res.json({ id: job.id, views: job.views })
})

// Columns an admin may set. Anything else in the body is ignored rather than
// silently persisted.
const WRITABLE = [
  'title',
  'org',
  'orgShort',
  'category',
  'kind',
  'tagline',
  'shortInfo',
  'detailedDescription',
  'applyUrl',
  'notificationPdfUrl',
  'officialWebsiteUrl',
  'eligibility',
  'postedAt',
  'postedOn',
  'views',
  'applications',
  'vacancies',
  'featured',
  'inTicker',
  'logo',
  'importantDates',
  'fee',
  'ageLimit',
  'posts',
  'links',
]

function pickWritable(body) {
  const payload = {}
  for (const key of WRITABLE) {
    if (body[key] !== undefined) payload[key] = body[key]
  }
  return payload
}

/** Blank strings from HTML form inputs should clear a column, not store ''. */
function normaliseNumbers(payload) {
  for (const key of ['views', 'applications', 'vacancies']) {
    if (payload[key] === '' || payload[key] === null) {
      payload[key] = null
      continue
    }
    if (payload[key] !== undefined) {
      const value = Number(payload[key])
      if (Number.isNaN(value)) throw badRequest(`\`${key}\` must be a number`)
      payload[key] = value
    }
  }
  return payload
}

/**
 * POST /api/jobs  (admin)
 *
 * Mirrors the record-building in `client/src/pages/AdminDashboard.jsx`: the slug
 * is derived from the title when not supplied, and the logo falls back to the
 * chosen category's icon/colour so cards always render with a badge.
 */
export const create = asyncHandler(async (req, res) => {
  const payload = normaliseNumbers(pickWritable(req.body))

  if (!String(payload.title ?? '').trim()) throw badRequest('`title` is required')
  if (!String(payload.org ?? '').trim()) throw badRequest('`org` is required')

  const requested = req.body.id ? slugify(req.body.id) : slugify(payload.title)
  const id = await uniqueSlug(requested, async (candidate) => {
    const existing = await Job.findByPk(candidate, { attributes: ['id'] })
    return Boolean(existing)
  })

  if (!payload.logo) {
    const category = await Category.findByPk(payload.category || 'ssc')
    payload.logo = {
      icon: category?.icon || 'landmark',
      color: category?.color || '#5558e6',
    }
  }

  payload.postedAt ??= 'Just now'
  payload.postedOn ??= 'Just now'
  payload.views ??= 0
  if (!payload.links || payload.links.length === 0) {
    const generatedLinks = []
    if (payload.applyUrl) {
      generatedLinks.push({ label: 'Apply Online', href: payload.applyUrl, primary: true })
    }
    if (payload.notificationPdfUrl) {
      generatedLinks.push({ label: 'Download Notification (PDF)', href: payload.notificationPdfUrl, primary: false })
    }
    if (payload.officialWebsiteUrl) {
      generatedLinks.push({ label: 'Official Website', href: payload.officialWebsiteUrl, primary: false })
    }
    payload.links = generatedLinks.length > 0 ? generatedLinks : [{ label: 'Apply Online', href: '#', primary: true }]
  }

  const job = await Job.create({ ...payload, id })
  res.status(201).json(serialize(job))
})

/** PUT /api/jobs/:id  (admin) */
export const update = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id)
  if (!job) throw notFoundError(`No post found with id "${req.params.id}"`)

  const payload = normaliseNumbers(pickWritable(req.body))
  if (payload.title !== undefined && !String(payload.title).trim()) {
    throw badRequest('`title` cannot be empty')
  }
  if (payload.org !== undefined && !String(payload.org).trim()) {
    throw badRequest('`org` cannot be empty')
  }

  // If applyUrl / notificationPdfUrl / officialWebsiteUrl were updated and links wasn't explicitly provided, sync links
  if (!payload.links && (payload.applyUrl !== undefined || payload.notificationPdfUrl !== undefined || payload.officialWebsiteUrl !== undefined)) {
    const apply = payload.applyUrl !== undefined ? payload.applyUrl : job.applyUrl
    const pdf = payload.notificationPdfUrl !== undefined ? payload.notificationPdfUrl : job.notificationPdfUrl
    const site = payload.officialWebsiteUrl !== undefined ? payload.officialWebsiteUrl : job.officialWebsiteUrl

    const generatedLinks = []
    if (apply) generatedLinks.push({ label: 'Apply Online', href: apply, primary: true })
    if (pdf) generatedLinks.push({ label: 'Download Notification (PDF)', href: pdf, primary: false })
    if (site) generatedLinks.push({ label: 'Official Website', href: site, primary: false })
    if (generatedLinks.length > 0) {
      payload.links = generatedLinks
    }
  }

  await job.update(payload)
  res.json(serialize(job))
})

/** DELETE /api/jobs/:id  (admin) */
export const remove = asyncHandler(async (req, res) => {
  const deleted = await Job.destroy({ where: { id: req.params.id } })
  if (!deleted) throw notFoundError(`No post found with id "${req.params.id}"`)
  res.status(204).end()
})

/** GET /api/jobs/stats — counts for the admin dashboard tiles. */
export const stats = asyncHandler(async (req, res) => {
  const grouped = await Job.findAll({
    attributes: ['kind', [Job.sequelize.fn('COUNT', Job.sequelize.col('id')), 'count']],
    group: ['kind'],
    raw: true,
  })

  const byKind = Object.fromEntries(JOB_KINDS.map((kind) => [kind, 0]))
  let total = 0
  for (const row of grouped) {
    const count = Number(row.count) || 0
    byKind[row.kind] = count
    total += count
  }

  res.json({ total, byKind })
})

export default { list, trending, ticker, recent, search, byId, registerView, create, update, remove, stats }
