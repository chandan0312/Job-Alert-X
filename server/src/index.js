// ---------------------------------------------------------------------------
// Entrypoint — connect to MariaDB/SQLite, then start listening.
// ---------------------------------------------------------------------------
// Performance & reliability hardening:
//  - keep-alive timeout set to 65s (> typical LB/proxy 60s) to avoid 502s
//  - headers timeout to prevent slow-header DoS
//  - graceful drain: stop accepting new connections on SIGTERM, drain
//    existing ones before exit so no request is mid-flight dropped
//  - max connections set to 1024 to handle traffic spikes
// ---------------------------------------------------------------------------

import { env, assertSecureConfig } from './config/env.js'
import { closeDatabase } from './config/db.js'
import { initDb } from './models/index.js'
import { createApp } from './app.js'

async function start() {
  assertSecureConfig()

  // Creates the database if missing and syncs tables.
  // Note: alter is disabled to avoid "Too many keys specified" error during ALTER TABLE
  // operations with complex schemas like the User model.
  await initDb({ sync: true, alter: false })
  console.log(`[db] connected to ${env.db.name} at ${env.db.host}:${env.db.port}`)

  // Safely ensure new columns exist without breaking existing tables
  try {
    const { sequelize } = await import('./models/index.js')
    const qi = sequelize.getQueryInterface()
    const desc = await qi.describeTable('jobs').catch(() => ({}))
    if (desc && !desc.inTicker) {
      await qi.addColumn('jobs', 'inTicker', {
        type: sequelize.Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      console.log('[db] added inTicker column to jobs table')
    }
    if (desc && !desc.detailedDescription) {
      await qi.addColumn('jobs', 'detailedDescription', {
        type: sequelize.Sequelize.DataTypes.TEXT,
        allowNull: true,
      })
      console.log('[db] added detailedDescription column to jobs table')
    }
    if (desc && !desc.applyUrl) {
      await qi.addColumn('jobs', 'applyUrl', {
        type: sequelize.Sequelize.DataTypes.STRING(1000),
        allowNull: true,
      })
      console.log('[db] added applyUrl column to jobs table')
    }
    if (desc && !desc.notificationPdfUrl) {
      await qi.addColumn('jobs', 'notificationPdfUrl', {
        type: sequelize.Sequelize.DataTypes.STRING(1000),
        allowNull: true,
      })
      console.log('[db] added notificationPdfUrl column to jobs table')
    }
    if (desc && !desc.officialWebsiteUrl) {
      await qi.addColumn('jobs', 'officialWebsiteUrl', {
        type: sequelize.Sequelize.DataTypes.STRING(1000),
        allowNull: true,
      })
      console.log('[db] added officialWebsiteUrl column to jobs table')
    }
    if (desc && !desc.salary) {
      await qi.addColumn('jobs', 'salary', {
        type: sequelize.Sequelize.DataTypes.STRING(500),
        allowNull: true,
      })
      console.log('[db] added salary column to jobs table')
    }
  } catch (err) {
    console.warn('[db] column check notice:', err.message)
  }

  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`[api] Job Alert X API listening on http://localhost:${env.port}`)
    console.log(`[api] endpoint index: http://localhost:${env.port}/api`)
    console.log(`[api] CORS origin(s): ${env.clientOrigin}`)
  })

  // ── HTTP server performance tuning ──────────────────────────────────────
  // 65s keep-alive is just above typical load-balancer 60s idle timeout,
  // preventing unexpected 502s on long-lived connections.
  server.keepAliveTimeout    = 65_000   // ms
  server.headersTimeout      = 70_000   // ms (must be > keepAliveTimeout)
  server.maxConnections      = 1_024    // concurrent TCP connections cap
  server.timeout             = 0        // disable per-connection idle timeout (keep-alive handles it)

  // ── Graceful shutdown ────────────────────────────────────────────────────
  let shuttingDown = false

  const shutdown = async (signal) => {
    if (shuttingDown) return
    shuttingDown = true
    console.log(`\n[api] ${signal} received — draining connections…`)

    // Stop accepting new connections; wait for in-flight requests to finish
    server.close(async () => {
      console.log('[api] all connections drained — closing database')
      await closeDatabase().catch(() => {})
      console.log('[api] shutdown complete')
      process.exit(0)
    })

    // Force-exit after 15s if drain takes too long
    setTimeout(() => {
      console.error('[api] shutdown timeout — forcing exit')
      process.exit(1)
    }, 15_000).unref()
  }

  process.on('SIGINT',  () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))

  // ── Unhandled rejection safety net ──────────────────────────────────────
  process.on('unhandledRejection', (reason) => {
    console.error('[api] unhandledRejection:', reason)
    // Do NOT exit — log and continue; let the per-request error handler deal with it
  })

  process.on('uncaughtException', (error) => {
    console.error('[api] uncaughtException:', error)
    // Uncaught exceptions leave the process in an unknown state — exit and let pm2/docker restart
    shutdown('uncaughtException')
  })
}

start().catch(async (error) => {
  console.error('[api] failed to start:', error.message)
  await closeDatabase().catch(() => {})
  process.exit(1)
})
