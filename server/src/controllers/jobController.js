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
const MAX_LIMIT = 1000

// Newest / most recently updated first. `id` breaks ties so pagination is deterministic.
const NEWEST_FIRST = [
  ['updatedAt', 'DESC'],
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
  let rows = await Job.findAll({
    where: { featured: true, kind: 'job' },
    order: NEWEST_FIRST,
    limit: parseLimit(req.query.limit, undefined),
  })
  if (rows.length === 0) {
    rows = await Job.findAll({
      where: { kind: 'job' },
      order: NEWEST_FIRST,
      limit: parseLimit(req.query.limit, 6),
    })
  }
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
  'eligibilityShort',
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
  'salary',
  'location',
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

/** DELETE /api/jobs/bulk  (admin) — Delete multiple posts at once. */
export const bulkRemove = asyncHandler(async (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids) || ids.length === 0) {
    throw badRequest('`ids` must be a non-empty array of post IDs')
  }
  const deleted = await Job.destroy({ where: { id: { [Op.in]: ids } } })
  res.json({ deleted })
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


// ---------------------------------------------------------------------------
// Archive - jobs whose application last date has passed
// ---------------------------------------------------------------------------

const MONTH_MAP = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
  apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
  aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
}

function parseDateRobust(val) {
  if (!val || typeof val !== 'string') return null
  const s = val.trim()
  const ddmmyyyy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (ddmmyyyy) {
    const d = new Date(parseInt(ddmmyyyy[3], 10), parseInt(ddmmyyyy[2], 10) - 1, parseInt(ddmmyyyy[1], 10), 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }
  const ddMonYear = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s*,?\s*(\d{4})$/)
  if (ddMonYear) {
    const mKey = ddMonYear[2].toLowerCase()
    if (MONTH_MAP[mKey] !== undefined) {
      const d = new Date(parseInt(ddMonYear[3], 10), MONTH_MAP[mKey], parseInt(ddMonYear[1], 10), 23, 59, 59)
      if (!isNaN(d.getTime())) return d
    }
  }
  const yyyymmdd = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (yyyymmdd) {
    const d = new Date(parseInt(yyyymmdd[1], 10), parseInt(yyyymmdd[2], 10) - 1, parseInt(yyyymmdd[3], 10), 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function getLastDateFromJob(job) {
  let rawDateStr = ''
  const dates = job.importantDates
  if (Array.isArray(dates)) {
    const entry = dates.find((item) => {
      const lbl = String(item?.label || '').toLowerCase()
      return lbl.includes('last date') || lbl.includes('close') || lbl.includes('end date') || lbl.includes('closing') || lbl.includes('apply end') || lbl.includes('registration end')
    })
    if (entry?.value) rawDateStr = entry.value
    if (!rawDateStr) {
      const fallback = dates.find((item) => {
        const lbl = String(item?.label || '').toLowerCase()
        return lbl.includes('last') || lbl.includes('end')
      })
      if (fallback?.value) rawDateStr = fallback.value
    }
  }
  if (!rawDateStr && job.endDate) rawDateStr = job.endDate
  if (!rawDateStr && job.lastDate) rawDateStr = job.lastDate
  return parseDateRobust(rawDateStr)
}

/** GET /api/jobs/archive - jobs whose application last date has passed. */
export const archive = asyncHandler(async (req, res) => {
  const rows = await Job.findAll({
    where: { importantDates: { [Op.not]: null } },
    order: NEWEST_FIRST,
  })

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const expired = []
  for (const row of rows) {
    const plain = row.get({ plain: true })
    const lastDate = getLastDateFromJob(plain)
    if (lastDate && lastDate < now) {
      expired.push(plain)
    }
  }

  expired.sort((a, b) => {
    const da = getLastDateFromJob(a)
    const db = getLastDateFromJob(b)
    return (db?.getTime() || 0) - (da?.getTime() || 0)
  })

  const limit = parseLimit(req.query.limit, undefined)
  const result = limit ? expired.slice(0, limit) : expired
  res.json(serialize(result))
})
export default { list, trending, ticker, recent, search, byId, registerView, create, update, remove, bulkRemove, stats, archive }

