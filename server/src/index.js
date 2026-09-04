// ---------------------------------------------------------------------------
// Entrypoint — connect to MariaDB, then start listening.
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
  } catch (err) {
    console.warn('[db] column check notice:', err.message)
  }

  const app = createApp()
  const server = app.listen(env.port, () => {
    console.log(`[api] Job Fynx API listening on http://localhost:${env.port}`)
    console.log(`[api] endpoint index: http://localhost:${env.port}/api`)
    console.log(`[api] CORS origin(s): ${env.clientOrigin}`)
  })

  const shutdown = async (signal) => {
    console.log(`\n[api] ${signal} received — shutting down`)
    server.close(async () => {
      await closeDatabase().catch(() => {})
      process.exit(0)
    })
    // Don't let a hung connection block the exit forever.
    setTimeout(() => process.exit(1), 10_000).unref()
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
}

start().catch(async (error) => {
  console.error('[api] failed to start:', error.message)
  await closeDatabase().catch(() => {})
  process.exit(1)
})
