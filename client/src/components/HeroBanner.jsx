import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Eye,
  Users,
  ArrowRight,
  Bookmark,
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

function formatCount(n) {
  return `${n.toLocaleString('en-IN')}+`
}

// The rotating government-seal-style emblem on the right of the banner.
function Emblem({ job }) {
  const Icon = EMBLEM_ICONS[job.logo.icon] || Landmark
  const color = job.logo.color
  return (
    <div className="relative flex h-64 w-64 items-center justify-center">
      {/* soft radial glow */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40"
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 62%)` }}
      />
      {/* dashed orbit rings */}
      <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-6 rounded-full border border-white/10" />
      <div className="absolute inset-12 rounded-full border border-dashed border-white/10" />
      {/* orbiting dots */}
      <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-white/70" />
      <span className="absolute right-2 top-1/2 h-2 w-2 rounded-full bg-white/40" />
      <span className="absolute bottom-3 left-6 h-1.5 w-1.5 rounded-full bg-white/30" />
      {/* central seal */}
      <div
        className="relative flex h-32 w-32 items-center justify-center rounded-full text-white shadow-2xl ring-4 ring-white/10"
        style={{ background: `linear-gradient(145deg, ${color}, rgba(0,0,0,0.55))` }}
      >
        <div className="absolute inset-1.5 rounded-full border-2 border-dotted border-white/40" />
        <Icon size={52} strokeWidth={1.75} />
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
      {/* Main Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1329] via-[#101b3b] to-[#1e1738] text-white shadow-xl border border-white/10">
        {/* faint grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '26px 26px',
          }}
        />

        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:gap-4">
          {/* Text Content */}
          <div className="max-w-lg animate-fade-in" key={job.id}>
            {/* Category tag */}
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-300 border border-orange-500/30">
                <Flame size={13} className="text-orange-400" aria-hidden="true" />
                Featured Opening
              </span>
              <span className="text-xs font-medium text-slate-400">
                Slide {index + 1} of {count}
              </span>
            </div>

            <h1 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-4xl text-white">
              {job.title}
            </h1>
            <p className="mt-1.5 text-sm font-medium text-slate-300">{job.org}</p>

            <div className="mt-4 flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Eye size={16} className="text-cyan-400" />
                {formatCount(job.views)} Views
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Users size={16} className="text-emerald-400" />
                {formatCount(job.applications || 0)} Applications
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/job/${job.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-transform hover:-translate-y-0.5 hover:brightness-110"
              >
                Apply Online
                <ArrowRight size={16} />
              </Link>
              <Link
                to={`/job/${job.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <Bookmark size={16} />
                View Details
              </Link>
            </div>
          </div>

          {/* Emblem */}
          <div className="hidden shrink-0 justify-center md:flex">
            <Emblem job={job} />
          </div>
        </div>

        {/* Carousel Arrow Buttons (Overlaid on banner edges on desktop) */}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white border border-white/20 opacity-80 backdrop-blur-md shadow-md transition-all hover:scale-110 hover:opacity-100 hover:bg-slate-900"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/80 text-white border border-white/20 opacity-80 backdrop-blur-md shadow-md transition-all hover:scale-110 hover:opacity-100 hover:bg-slate-900"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Highly-Visible Carousel Navigation Dots & Controls Below Banner */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-between px-1">
          {/* Previous Text / Chevron */}
          <button
            type="button"
            onClick={prev}
            className="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          {/* Big, Clear, Clickable Carousel Dots */}
          <div className="flex items-center gap-2.5 rounded-full bg-surface border border-hairline px-4 py-2 shadow-sm">
            {slides.map((s, i) => {
              const isActive = i === index
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}: ${s.title}`}
                  aria-current={isActive}
                  title={`Go to: ${s.title}`}
                  className="group/dot relative flex items-center justify-center py-1 transition-all"
                >
                  <span
                    className={`block h-3 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-8 bg-gradient-to-r from-orange-500 to-amber-500 shadow-md shadow-orange-500/40 ring-2 ring-orange-400/50'
                        : 'w-3 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 hover:scale-125'
                    }`}
                  />
                  {/* Tooltip on hover */}
                  <span
                    role="tooltip"
                    className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover/dot:opacity-100 z-20"
                  >
                    {s.title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Next Text / Chevron */}
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
