import { Play } from 'lucide-react'

export default function PopularCard({ course }) {
  if (!course) return null
  const [from, to] = course.gradient

  return (
    <div className="card group flex items-center gap-4 p-3.5 transition-all hover:-translate-y-0.5 hover:shadow-cardhover">
      {/* Thumbnail */}
      <div
        className="relative flex h-[68px] w-24 shrink-0 items-end overflow-hidden rounded-xl p-2 text-white"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 15%, #fff 1px, transparent 1.5px)',
            backgroundSize: '14px 14px',
          }}
        />
        <span className="relative rounded bg-black/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide backdrop-blur-sm">
          {course.tag}
        </span>
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-ink group-hover:text-brand-600">
          {course.title}
        </h3>
        <p className="mt-1 text-[12px] text-ink-muted">By {course.author}</p>
      </div>

      {/* Play */}
      <button
        type="button"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-sm transition-transform hover:scale-105 hover:bg-brand-700"
        aria-label={`Play: ${course.title}`}
      >
        <Play size={16} className="ml-0.5" fill="currentColor" />
      </button>
    </div>
  )
}
