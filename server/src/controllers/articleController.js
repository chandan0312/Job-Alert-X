// ---------------------------------------------------------------------------
// Article Controller — Powers articles/blog public discovery and admin publishing
// ---------------------------------------------------------------------------

import { Op } from 'sequelize'
import { Article, ARTICLE_CATEGORIES, ARTICLE_CATEGORY_LABELS } from '../models/index.js'
import { slugify, uniqueSlug } from '../utils/slugify.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { badRequest, notFoundError } from '../middleware/error.js'

const DEFAULT_LIMIT = 12
const MAX_LIMIT = 50

/** Calculate estimated read time based on word count. */
function estimateReadTime(text) {
  if (!text) return '3 min read'
  const clean = text.replace(/<[^>]*>/g, ' ')
  const words = clean.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}

/**
 * GET /api/articles/categories
 * Returns supported article categories with display labels
 */
export const listCategories = asyncHandler(async (req, res) => {
  res.json({
    categories: ARTICLE_CATEGORIES,
    labels: ARTICLE_CATEGORY_LABELS,
  })
})

/**
 * GET /api/articles
 * Public queryable list of published articles
 * Query params: ?category= &q= &tag= &featured= &limit= &offset=
 */
export const list = asyncHandler(async (req, res) => {
  const where = { status: 'published' }

  if (req.query.category && req.query.category !== 'all') {
    where.category = req.query.category
  }

  if (req.query.featured !== undefined && req.query.featured !== '') {
    where.featured = ['1', 'true', 'yes'].includes(String(req.query.featured).toLowerCase())
  }

  if (req.query.q && req.query.q.trim()) {
    const term = `%${req.query.q.trim()}%`
    where[Op.or] = [
      { title: { [Op.like]: term } },
      { excerpt: { [Op.like]: term } },
      { author: { [Op.like]: term } },
    ]
  }

  const limit = Math.min(
    Math.max(1, Number.parseInt(req.query.limit, 10) || DEFAULT_LIMIT),
    MAX_LIMIT
  )
  const offset = Math.max(0, Number.parseInt(req.query.offset, 10) || 0)

  const { rows, count } = await Article.findAndCountAll({
    where,
    order: [
      ['featured', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    limit,
    offset,
    attributes: [
      'id',
      'title',
      'slug',
      'category',
      'excerpt',
      'coverImage',
      'author',
      'authorRole',
      'readTime',
      'tags',
      'status',
      'featured',
      'views',
      'createdAt',
      'updatedAt',
    ],
  })

  res.json({
    articles: rows,
    total: count,
    limit,
    offset,
    hasMore: offset + rows.length < count,
  })
})

/**
 * GET /api/articles/:slug
 * Retrieve full article by slug or ID and fetch related articles
 */
export const bySlugOrId = asyncHandler(async (req, res) => {
  const { slug } = req.params

  const article = await Article.findOne({
    where: {
      [Op.or]: [{ slug }, { id: slug }],
    },
  })

  if (!article) {
    throw notFoundError(`Article "${slug}" not found`)
  }

  // Increment views count asynchronously without blocking
  article.increment('views', { by: 1 }).catch(() => {})

  // Fetch 3 related published articles
  const related = await Article.findAll({
    where: {
      id: { [Op.ne]: article.id },
      status: 'published',
      [Op.or]: [
        { category: article.category },
        { featured: true },
      ],
    },
    order: [['createdAt', 'DESC']],
    limit: 3,
    attributes: [
      'id',
      'title',
      'slug',
      'category',
      'excerpt',
      'coverImage',
      'author',
      'readTime',
      'views',
      'createdAt',
    ],
  })

  res.json({
    article,
    related,
  })
})

/**
 * GET /api/articles/admin/all (Admin only)
 * Retrieve all articles (drafts + published) with admin dashboard stats
 */
export const adminList = asyncHandler(async (req, res) => {
  const { rows, count } = await Article.findAndCountAll({
    order: [
      ['updatedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
  })

  let totalViews = 0
  let publishedCount = 0
  let draftCount = 0

  rows.forEach((art) => {
    totalViews += art.views || 0
    if (art.status === 'published') publishedCount++
    else draftCount++
  })

  res.json({
    articles: rows,
    stats: {
      total: count,
      published: publishedCount,
      drafts: draftCount,
      totalViews,
    },
  })
})

/**
 * POST /api/articles (Admin only)
 * Create a new article
 */
export const create = asyncHandler(async (req, res) => {
  const body = req.body || {}

  if (!body.title || !body.title.trim()) {
    throw badRequest('Title is required')
  }

  const baseSlug = slugify(body.slug || body.title)
  const finalSlug = await uniqueSlug(baseSlug, async (candidate) => {
    const existing = await Article.findOne({ where: { slug: candidate } })
    return !existing
  })

  const readTime = body.readTime || estimateReadTime((body.content || '') + ' ' + (body.excerpt || ''))

  const article = await Article.create({
    id: finalSlug,
    title: body.title.trim(),
    slug: finalSlug,
    category: body.category || 'job-guide',
    excerpt: body.excerpt?.trim() || '',
    content: body.content || '',
    coverImage: body.coverImage || null,
    author: body.author?.trim() || 'Job Alert X Team',
    authorRole: body.authorRole?.trim() || 'Recruitment & Career Expert',
    readTime,
    tags: Array.isArray(body.tags) ? body.tags : (body.tags ? String(body.tags).split(',').map((t) => t.trim()).filter(Boolean) : []),
    status: body.status === 'draft' ? 'draft' : 'published',
    featured: Boolean(body.featured),
    views: 0,
    metaTitle: body.metaTitle?.trim() || body.title.trim(),
    metaDescription: body.metaDescription?.trim() || body.excerpt?.trim() || null,
  })

  res.status(201).json(article)
})

/**
 * PUT /api/articles/:id (Admin only)
 * Update an existing article
 */
export const update = asyncHandler(async (req, res) => {
  const { id } = req.params
  const body = req.body || {}

  const article = await Article.findByPk(id)
  if (!article) {
    throw notFoundError(`Article "${id}" not found`)
  }

  // Handle slug change if requested
  if (body.slug && body.slug !== article.slug) {
    const newBaseSlug = slugify(body.slug)
    const finalSlug = await uniqueSlug(newBaseSlug, async (candidate) => {
      if (candidate === article.slug) return true
      const existing = await Article.findOne({ where: { slug: candidate } })
      return !existing
    })
    article.slug = finalSlug
  }

  if (body.title !== undefined) article.title = body.title.trim()
  if (body.category !== undefined) article.category = body.category
  if (body.excerpt !== undefined) article.excerpt = body.excerpt.trim()
  if (body.content !== undefined) {
    article.content = body.content
    if (!body.readTime) {
      article.readTime = estimateReadTime(body.content + ' ' + (article.excerpt || ''))
    }
  }
  if (body.coverImage !== undefined) article.coverImage = body.coverImage
  if (body.author !== undefined) article.author = body.author.trim()
  if (body.authorRole !== undefined) article.authorRole = body.authorRole.trim()
  if (body.readTime !== undefined) article.readTime = body.readTime
  if (body.tags !== undefined) {
    article.tags = Array.isArray(body.tags)
      ? body.tags
      : String(body.tags).split(',').map((t) => t.trim()).filter(Boolean)
  }
  if (body.status !== undefined) article.status = body.status === 'draft' ? 'draft' : 'published'
  if (body.featured !== undefined) article.featured = Boolean(body.featured)
  if (body.metaTitle !== undefined) article.metaTitle = body.metaTitle.trim()
  if (body.metaDescription !== undefined) article.metaDescription = body.metaDescription.trim()

  await article.save()
  res.json(article)
})

/**
 * DELETE /api/articles/:id (Admin only)
 * Delete an article
 */
export const remove = asyncHandler(async (req, res) => {
  const { id } = req.params
  const article = await Article.findByPk(id)
  if (!article) {
    throw notFoundError(`Article "${id}" not found`)
  }

  await article.destroy()
  res.status(204).end()
})
