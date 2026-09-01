// ---------------------------------------------------------------------------
// Seeder — creates the schema and loads the reference dataset.
// ---------------------------------------------------------------------------
//   npm run seed          upsert everything (safe to re-run; keeps extra rows)
//   npm run seed:reset    wipe the seeded tables first (drops admin-created posts)
// ---------------------------------------------------------------------------

import { env } from '../config/env.js'
import { closeDatabase } from '../config/db.js'
import {
  initDb,
  Job,
  Category,
  Recruiter,
  Course,
  NowPlaying,
  User,
  NOW_PLAYING_ID,
} from '../models/index.js'
import { categories, recruiters, popularCourses, nowPlaying, jobs } from './seedData.js'

const force = process.argv.includes('--force')

/** Every column except the primary key — the update list for ON DUPLICATE KEY. */
function updatableColumns(model, primaryKey) {
  return Object.keys(model.getAttributes()).filter((column) => column !== primaryKey)
}

/**
 * Jobs carry human-written "posted" strings rather than real dates, so give each
 * row a synthetic createdAt that descends in seedData order. "Newest first"
 * queries then return exactly the order the frontend's seed array had, and
 * /api/jobs/recent surfaces the top of that list.
 */
function withOrderedTimestamps(rows) {
  const base = Date.now()
  return rows.map((row, index) => {
    const stamp = new Date(base - index * 60_000)
    return { ...row, createdAt: stamp, updatedAt: stamp }
  })
}

async function seedTable(model, rows, primaryKey, label) {
  if (force) await model.destroy({ where: {}, truncate: true })
  await model.bulkCreate(rows, {
    updateOnDuplicate: updatableColumns(model, primaryKey),
    validate: true,
  })
  const count = await model.count()
  console.log(`  ${label.padEnd(14)} ${String(rows.length).padStart(3)} upserted  (${count} total)`)
}

async function seedAdmin() {
  const email = env.admin.email.trim().toLowerCase()
  const existing = await User.findOne({ where: { email } })

  if (existing) {
    if (force) {
      existing.set('password', env.admin.password)
      await existing.save()
      console.log(`  admin          password reset for ${email}`)
    } else {
      console.log(`  admin          ${email} already exists (left untouched)`)
    }
    return
  }

  await User.create({
    email,
    name: env.admin.name,
    role: 'admin',
    password: env.admin.password,
  })
  console.log(`  admin          created ${email}`)
}

async function main() {
  console.log(
    `\nSarkariFynx seeder -> ${env.db.user}@${env.db.host}:${env.db.port}/${env.db.name}` +
      `${force ? '  [--force: wiping seeded tables]' : ''}\n`
  )

  // alter:true lets an existing database pick up model changes without a manual
  // migration. Fine for development; use real migrations in production.
  await initDb({ sync: true, alter: true })
  console.log('  schema         synced\n')

  await seedTable(Category, categories, 'slug', 'categories')
  await seedTable(Recruiter, recruiters, 'id', 'recruiters')
  await seedTable(Course, popularCourses, 'id', 'courses')
  await seedTable(Job, withOrderedTimestamps(jobs), 'id', 'jobs')

  await NowPlaying.upsert({ ...nowPlaying, id: NOW_PLAYING_ID })
  console.log(`  now_playing      1 upserted`)

  await seedAdmin()

  console.log('\nDone. Start the API with:  npm run dev\n')
}

main()
  .then(async () => {
    await closeDatabase()
    process.exit(0)
  })
  .catch(async (error) => {
    console.error('\nSeed failed:', error.message)
    if (error.errors?.length) {
      for (const item of error.errors) console.error(`  - ${item.path}: ${item.message}`)
    }
    await closeDatabase().catch(() => {})
    process.exit(1)
  })
