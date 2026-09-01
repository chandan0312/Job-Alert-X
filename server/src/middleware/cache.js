// ---------------------------------------------------------------------------
// High-Speed In-Memory Cache Middleware for Express
// ---------------------------------------------------------------------------

const cacheStore = new Map()
const DEFAULT_TTL_MS = 30_000 // 30 seconds

/**
 * Express middleware to cache GET responses in memory.
 * Returns cached response immediately if available and fresh.
 */
export function cacheResponse(ttlMs = DEFAULT_TTL_MS) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') return next()

    const key = req.originalUrl || req.url
    const cached = cacheStore.get(key)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < ttlMs) {
      res.setHeader('X-Cache', 'HIT')
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}, stale-while-revalidate=60`)
      return res.json(cached.body)
    }

    // Intercept res.json to store response in memory
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      // Only cache successful 200 responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          body,
          timestamp: Date.now(),
        })
      }
      res.setHeader('X-Cache', 'MISS')
      res.setHeader('Cache-Control', `public, max-age=${Math.floor(ttlMs / 1000)}, stale-while-revalidate=60`)
      return originalJson(body)
    }

    next()
  }
}

/**
 * Invalidate all cached GET responses when an admin creates/edits/deletes posts.
 */
export function invalidateCache() {
  cacheStore.clear()
}
