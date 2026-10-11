import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  CalendarClock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Scale,
  Banknote,
  TrainFront,
  ShieldCheck,
  Siren,
  Anchor,
  Flame,
  ExternalLink,
} from 'lucide-react'

const EMBLEM_ICONS = {
  landmark: Landmark,
  scale: Scale,
  banknote: Banknote,
  train: TrainFront,
  shield: ShieldCheck,
  siren: Siren,
  anchor: Anchor,
}

function getPostCount(job) {
  if (job.vacancies) return `${Number(job.vacancies).toLocaleString('en-IN')} Posts`
  if (job.posts && Array.isArray(job.posts) && job.posts.length > 0) {
    const total = job.posts.reduce((acc, p) => acc + (Number(p.total) || 0), 0)
    if (total > 0) return `${total.toLocaleString('en-IN')} Posts`
  }
  return 'Various Posts'
}

function getLastDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('last date') ||
      r.label?.toLowerCase().includes('close') ||
      r.label?.toLowerCase().includes('end date')
  )
  return d?.value || 'Check Details'
}

function Emblem({ job }) {
  const Icon = EMBLEM_ICONS[job.logo?.icon] || Landmark
  const color = job.logo?.color || 'var(--brand-primary)'
  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
      {/* Soft glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-25"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />
      {/* Orbit rings */}
      <div className="absolute inset-0 rounded-full border border-dashed border-white/20" />
      <div className="absolute inset-2 rounded-full border border-white/10" />
      {/* Central seal */}
      <div
        className="relative flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-lg ring-2 ring-white/20"
        style={{ background: `linear-gradient(135deg, ${color}cc, rgba(0,0,0,0.5))` }}
      >
        <Icon size={22} strokeWidth={1.8} />
      </div>
    </div>
  )
}

export default function HeroBanner({ slides = [] }) {
  const [index, setIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const count = slides.length

  const go = useCallback((i) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => setIndex((i) => (i === 0 ? count - 1 : i - 1)), [count])

  useEffect(() => {
    if (count <= 1 || isPaused) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const id = setInterval(next, 5500)
    return () => clearInterval(id)
  }, [count, isPaused, next])

  if (!count) return null
  const job = slides[index]

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Banner Card — dark navy gradient (always dark for visual impact) */}
      <div
        className="relative overflow-hidden rounded-2xl text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, var(--brand-dark) 0%, #0d2035 40%, var(--brand-primary) 100%)',
          border: '1px solid rgba(174, 208, 201, 0.15)',
        }}
      >
        {/* Geometric grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full blur-2xl opacity-20"
          style={{ background: 'var(--brand-teal)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-4 -bottom-4 h-32 w-32 rounded-full blur-2xl opacity-15"
          style={{ background: 'var(--brand-flame)' }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col gap-4 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
          {/* Text Content */}
          <div className="min-w-0 flex-1 animate-fade-in" key={job.id}>
            {/* Tags row */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-extrabold"
                style={{
                  background: 'rgba(249, 115, 22, 0.2)',
                  color: '#fbbf24',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                }}
              >
                <Flame size={12} aria-hidden="true" />
                Trending Opening
              </span>
              <span
                className="rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(174, 208, 201, 0.15)',
                  color: 'var(--brand-teal)',
                  border: '1px solid rgba(174, 208, 201, 0.25)',
                }}
              >
                {job.category}
              </span>
              {job.tagline && (
                <span className="hidden text-xs font-medium text-white/70 truncate max-w-[260px] sm:inline">
                  {job.tagline}
                </span>
              )}
              <span className="text-xs text-white/40 ml-auto mr-8 hidden sm:inline">
                {index + 1} / {count}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-base sm:text-lg font-black leading-snug tracking-tight text-white line-clamp-2">
              <Link to={`/job/${job.id}`} className="hover:text-[color:var(--brand-teal)] transition-colors">
                {job.title}
              </Link>
            </h2>
            <p className="mt-1 text-xs font-medium text-white/60 truncate">{job.org}</p>

            {/* Stats + Actions */}
            <div
              className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                {/* Vacancies */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold shadow-sm"
                  style={{
                    background: 'rgba(232, 181, 0, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(232, 181, 0, 0.25)',
                  }}
                >
                  <Briefcase size={12} className="shrink-0" aria-hidden="true" />
                  {getPostCount(job)}
                </span>

                {/* Last Date */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs shadow-sm"
                  style={{
                    background: 'rgba(248, 113, 113, 0.12)',
                    color: '#fca5a5',
                    border: '1px solid rgba(248, 113, 113, 0.2)',
                  }}
                >
                  <CalendarClock size={12} className="shrink-0" aria-hidden="true" />
                  <span className="font-medium text-white/50">Last Date:</span>
                  <span className="font-bold">{getLastDate(job)}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  to={`/job/${job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20 active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  <ExternalLink size={12} aria-hidden="true" />
                  Details
                </Link>
                <Link
                  to={`/job/${job.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold text-white transition-all hover:brightness-110 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                    boxShadow: '0 2px 10px rgba(249, 115, 22, 0.30)',
                  }}
                >
                  Apply Now
                  <ArrowRight size={12} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* Emblem */}
          <div className="hidden shrink-0 items-center justify-center md:flex pl-4">
            <Emblem job={job} />
          </div>
        </div>

        {/* Arrow Buttons */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-white opacity-0 group-hover/carousel:opacity-100 backdrop-blur-sm shadow-sm transition-all hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(9, 50, 74, 0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full text-white opacity-0 group-hover/carousel:opacity-100 backdrop-blur-sm shadow-sm transition-all hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(9, 50, 74, 0.75)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              aria-label="Next Slide"
            >
              <ChevronRight size={15} />
            </button>
          </>
        )}
      </div>

      {/* Indicator dots */}
      {count > 1 && (
        <div className="mt-2.5 flex items-center justify-center gap-1.5 py-0.5">
          {slides.map((s, i) => {
            const isActive = i === index
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}: ${s.title}`}
                aria-current={isActive}
                className="group/dot relative flex items-center justify-center p-0.5 transition-all"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    isActive ? 'w-6' : 'w-1.5 hover:scale-125'
                  }`}
                  style={{
                    background: isActive
                      ? 'linear-gradient(90deg, var(--brand-primary), var(--brand-flame))'
                      : 'var(--border-strong)',
                  }}
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
