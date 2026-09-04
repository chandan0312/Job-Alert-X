// ---------------------------------------------------------------------------
// Express application.
// ---------------------------------------------------------------------------
// Kept separate from `index.js` (which connects to MariaDB and listens) so the
// app can be imported and exercised without a live database.
// ---------------------------------------------------------------------------

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'

import { env, corsOrigin } from './config/env.js'
import apiRoutes from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')

  // Gzip compression for all JSON and static responses
  app.use(compression())

  app.use(cors({ origin: corsOrigin(), credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(express.urlencoded({ extended: true }))

  if (env.nodeEnv !== 'test') {
    app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
  }

  app.get('/', (req, res) => {
    res.json({
      name: 'Job Fynx API',
      status: 'ok',
      docs: '/api',
    })
  })

  app.use('/api', apiRoutes)

  // Serve uploaded documents statically
  const uploadDir = new URL('../uploads', import.meta.url).pathname
  // Normalize windows leading slash if present in pathname
  const normalizedUploadDir = process.platform === 'win32' && uploadDir.startsWith('/') ? uploadDir.slice(1) : uploadDir
  app.use('/uploads', express.static(normalizedUploadDir))

  // Order matters: 404 for unmatched routes, then the central error handler.
  app.use(notFound)
  app.use(errorHandler)

  return app
}

export default createApp
