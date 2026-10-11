import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react'
import { getJobs } from '../services/api.js'

const MONTH_MAP = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
]

/**
 * Robust date parser supporting Indian and standard formats:
 * - DD-MM-YYYY / DD/MM/YYYY (e.g. '15-10-2026')
 * - DD Mon YYYY / DD Month YYYY (e.g. '29 Sept 2026', '28 Jul 2026')
 * - YYYY-MM-DD
 * - ISO / standard date strings
 */
function parseDateRobust(val) {
  if (!val || typeof val !== 'string') return null
  const s = val.trim()

  // Match DD-MM-YYYY or DD/MM/YYYY
  const ddmmyyyy = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/)
  if (ddmmyyyy) {
    const day = parseInt(ddmmyyyy[1], 10)
    const month = parseInt(ddmmyyyy[2], 10) - 1
    const year = parseInt(ddmmyyyy[3], 10)
    const d = new Date(year, month, day, 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }

  // Match DD Mon YYYY e.g. "28 Jul 2026", "29 Sept 2026", "7 Oct 2026"
  const ddMonYear = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s*,?\s*(\d{4})$/)
  if (ddMonYear) {
    const day = parseInt(ddMonYear[1], 10)
    const mKey = ddMonYear[2].toLowerCase()
    if (MONTH_MAP[mKey] !== undefined) {
      const d = new Date(parseInt(ddMonYear[3], 10), MONTH_MAP[mKey], day, 23, 59, 59)
      if (!isNaN(d.getTime())) return d
    }
  }

  // Match YYYY-MM-DD
  const yyyymmdd = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (yyyymmdd) {
    const year = parseInt(yyyymmdd[1], 10)
    const month = parseInt(yyyymmdd[2], 10) - 1
    const day = parseInt(yyyymmdd[3], 10)
    const d = new Date(year, month, day, 23, 59, 59)
    if (!isNaN(d.getTime())) return d
  }

  // Standard Date parse fallback
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

/**
 * Format deadline date to match "29 Sept 2026" style.
 */
function formatDeadlineDisplay(parsedDate, rawDateStr) {
  if (parsedDate && !isNaN(parsedDate.getTime())) {
    const day = parsedDate.getDate()
    const month = MONTH_NAMES[parsedDate.getMonth()]
    const year = parsedDate.getFullYear()
    return `${day} ${month} ${year}`
  }
  return rawDateStr || 'Ending Soon'
}

/**
 * Extract raw deadline string and parsed Date from a job object.
 */
function getDeadlineInfo(job) {
  let rawDateStr = ''

  if (Array.isArray(job.importantDates)) {
    const entry = job.importantDates.find((item) => {
      const lbl = String(item?.label || '').toLowerCase()
      return (
        lbl.includes('last date') ||
        lbl.includes('close') ||
        lbl.includes('end date') ||
        lbl.includes('closing') ||
        lbl.includes('apply end') ||
        lbl.includes('registration end')
      )
    })
    if (entry && entry.value) {
      rawDateStr = entry.value
    } else {
      const fallback = job.importantDates.find((item) => {
        const lbl = String(item?.label || '').toLowerCase()
        return lbl.includes('last') || lbl.includes('end')
      })
      if (fallback?.value) rawDateStr = fallback.value
    }
  }

  if (!rawDateStr && job.endDate) rawDateStr = job.endDate
  if (!rawDateStr && job.lastDate) rawDateStr = job.lastDate

  const parsed = parseDateRobust(rawDateStr)
  return {
    rawDateStr: rawDateStr || '',
    parsedDate: parsed,
  }
}

/**
 * Zero-layout-shift Skeleton Loader for 5 rows
 */
function AttentionSkeleton() {
  return (
    <div className="divide-y divide-hairline animate-pulse" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between px-4 sm:px-5 py-3.5 gap-3">
          <div className="flex-1 space-y-1.5">
            <div className="h-4 bg-subtle/90 rounded w-4/5" />
            <div className="h-3 bg-subtle/60 rounded w-1/2" />
          </div>
          <div className="h-7 w-24 rounded-lg bg-rose-500/10 shrink-0" />
        </div>
      ))}
    </div>
  )
}

export default function AttentionCard({ viewAllTo = '/category/all' }) {
  const [closingJobs, setClosingJobs] = useState(null)

  useEffect(() => {
    let active = true

    // Fetch up to 50 items to find the best upcoming deadlines
    getJobs({ limit: 50 })
      .then((data) => {
        if (!active) return
        const list = Array.isArray(data) ? data : []
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const processed = []
        for (const job of list) {
          const { rawDateStr, parsedDate } = getDeadlineInfo(job)
          if (!rawDateStr && !parsedDate) continue

          const diffDays = parsedDate
            ? Math.ceil((parsedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
            : null

          processed.push({
            ...job,
            displayLastDate: formatDeadlineDisplay(parsedDate, rawDateStr),
            parsedDate,
            diffDays,
          })
        }

        // 1. Separate upcoming deadlines (diffDays >= 0) sorted soonest first
        const upcoming = processed
          .filter((j) => j.diffDays !== null && j.diffDays >= 0)
          .sort((a, b) => a.diffDays - b.diffDays)

        if (upcoming.length >= 5) {
          setClosingJobs(upcoming.slice(0, 5))
        } else {
          const combined = [...upcoming]
          for (const item of processed) {
            if (!combined.some((c) => c.id === item.id)) {
              combined.push(item)
            }
            if (combined.length >= 5) break
          }
          if (combined.length < 5) {
            for (const j of list) {
              if (!combined.some((c) => c.id === j.id)) {
                const { rawDateStr, parsedDate } = getDeadlineInfo(j)
                combined.push({
                  ...j,
                  displayLastDate: formatDeadlineDisplay(parsedDate, rawDateStr || 'Ending Soon'),
                })
              }
              if (combined.length >= 5) break
            }
          }
          setClosingJobs(combined.slice(0, 5))
        }
      })
      .catch(() => active && setClosingJobs([]))

    return () => {
      active = false
    }
  }, [])

  return (
    <section
      className="card overflow-hidden border-rose-200/70 dark:border-rose-900/40 shadow-xs transition-shadow duration-200 hover:shadow-md will-change-transform"
      aria-labelledby="attention-card-heading"
    >
      {/* ── Card Header ── */}
      <div className="flex items-center justify-between border-b border-hairline px-4 sm:px-5 py-3 bg-gradient-to-r from-rose-50/70 via-transparent to-transparent dark:from-rose-950/20 text-ink">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 border border-rose-200/80 dark:border-rose-900/50 shadow-2xs shrink-0">
            <AlertTriangle size={17} className="stroke-[2.2]" aria-hidden="true" />
          </span>
          <div className="flex items-center gap-2">
            <h2 id="attention-card-heading" className="text-sm sm:text-base font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
              Attention
            </h2>
            <span className="inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">
              Ending Soon
            </span>
          </div>
        </div>
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
        </span>
      </div>

      {/* ── Table Header (JOB TITLE | LAST DATE) ── */}
      <div className="flex items-center justify-between border-b border-hairline px-4 sm:px-5 py-2.5 bg-slate-50/50 dark:bg-subtle/20 text-[11px] sm:text-xs font-extrabold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
        <span>JOB TITLE</span>
        <span className="text-right">LAST DATE</span>
      </div>

      {/* ── Content ── */}
      {closingJobs === null ? (
        <AttentionSkeleton />
      ) : closingJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center px-4">
          <AlertTriangle size={26} className="text-ink-faint" />
          <p className="text-[13px] font-semibold text-ink">No Urgent Deadlines</p>
          <p className="text-[12px] text-ink-muted">All active application windows are currently on schedule.</p>
        </div>
      ) : (
        <>
          {/* ── Tabular List (Top 5) ── */}
          <div className="divide-y divide-hairline">
            {closingJobs.map((job) => (
              <div
                key={job.id}
                className="group flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 transition-colors duration-150 hover:bg-rose-50/40 dark:hover:bg-rose-950/20"
              >
                {/* Job Title */}
                <div className="flex-1 min-w-0 pr-1">
                  <Link
                    to={`/job/${job.id}`}
                    className="block font-bold text-[13.5px] sm:text-[14px] leading-snug text-slate-800 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors"
                    title={job.title}
                  >
                    {job.title}
                  </Link>
                </div>

                {/* Last Date Badge */}
                <div className="shrink-0">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap shadow-2xs">
                    <Clock size={13} className="shrink-0 text-rose-500 stroke-[2.2]" aria-hidden="true" />
                    <span>{job.displayLastDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Card Footer ── */}
          <div className="border-t border-hairline py-3 px-4 text-center">
            <Link
              to={viewAllTo}
              className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors"
            >
              View All Deadlines
              <ArrowRight size={14} className="stroke-[2.5]" aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

