// ---------------------------------------------------------------------------
// Entrypoint — connect to MariaDB, then start listening.
// ---------------------------------------------------------------------------

import { env, assertSecureConfig } from './config/env.js'
import { closeDatabase } from './config/db.js'
import { initDb } from './models/index.js'
import { createApp } from './app.js'

async function start() {
  assertSecureConfig()

  // Creates the database if missing and syncs tables with alter: true so
  // new model columns (like googleId, avatar) are automatically added to MySQL.
  await initDb({ sync: true, alter: true })
  console.log(`[db] connected to ${env.db.name} at ${env.db.host}:${env.db.port}`)

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
