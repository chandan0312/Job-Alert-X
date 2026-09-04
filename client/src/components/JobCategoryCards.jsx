import { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Landmark,
  Banknote,
  TrainFront,
  Scale,
  ShieldCheck,
  Siren,
  GraduationCap,
  Building2,
} from 'lucide-react'

// 8 major government categories with vibrant distinct gradients and glowing accents
const CATEGORIES = [
  {
    slug: 'ssc',
    name: 'SSC Exams',
    info: 'CGL, CHSL, MTS & GD',
    vacancies: '17,727+ Posts',
    badge: '17k+ Posts',
    icon: Landmark,
    gradient: 'bg-gradient-to-b from-[#1d4ed8] via-[#1e3a8a] to-[#091124]',
    border: 'border-blue-400/40 hover:border-blue-300',
    iconBg: 'bg-blue-400/25 text-blue-100 border border-blue-300/30',
    badgeBg: 'bg-blue-400/20 text-blue-100 border border-blue-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(37,99,235,0.55)]',
  },
  {
    slug: 'banking',
    name: 'Banking Jobs',
    info: 'IBPS, SBI, RBI & PO',
    vacancies: '12,244+ Posts',
    badge: '12k+ Posts',
    icon: Banknote,
    gradient: 'bg-gradient-to-b from-[#be123c] via-[#881337] to-[#1a040b]',
    border: 'border-rose-400/40 hover:border-rose-300',
    iconBg: 'bg-rose-400/25 text-rose-100 border border-rose-300/30',
    badgeBg: 'bg-rose-400/20 text-rose-100 border border-rose-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(225,29,72,0.55)]',
  },
  {
    slug: 'railway',
    name: 'Railway Jobs',
    info: 'RRB NTPC, ALP & Gr. D',
    vacancies: '8,500+ Posts',
    badge: '8.5k+ Posts',
    icon: TrainFront,
    gradient: 'bg-gradient-to-b from-[#c2410c] via-[#9a3412] to-[#1f0902]',
    border: 'border-amber-400/40 hover:border-amber-300',
    iconBg: 'bg-amber-400/25 text-amber-100 border border-amber-300/30',
    badgeBg: 'bg-amber-400/20 text-amber-100 border border-amber-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(234,88,12,0.55)]',
  },
  {
    slug: 'upsc',
    name: 'UPSC Civil',
    info: 'IAS, IFS, NDA & CDS',
    vacancies: '1,200+ Posts',
    badge: '1.2k+ Posts',
    icon: Scale,
    gradient: 'bg-gradient-to-b from-[#7e22ce] via-[#581c87] to-[#160526]',
    border: 'border-purple-400/40 hover:border-purple-300',
    iconBg: 'bg-purple-400/25 text-purple-100 border border-purple-300/30',
    badgeBg: 'bg-purple-400/20 text-purple-100 border border-purple-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(168,85,247,0.55)]',
  },
  {
    slug: 'defence',
    name: 'Defence & Army',
    info: 'Army, Navy, Air Force',
    vacancies: '4,500+ Posts',
    badge: '4.5k+ Posts',
    icon: ShieldCheck,
    gradient: 'bg-gradient-to-b from-[#047857] via-[#064e3b] to-[#021c13]',
    border: 'border-emerald-400/40 hover:border-emerald-300',
    iconBg: 'bg-emerald-400/25 text-emerald-100 border border-emerald-300/30',
    badgeBg: 'bg-emerald-400/20 text-emerald-100 border border-emerald-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(16,185,129,0.55)]',
  },
  {
    slug: 'police',
    name: 'Police Recruitment',
    info: 'State Police, SI, Constable',
    vacancies: '9,800+ Posts',
    badge: '9.8k+ Posts',
    icon: Siren,
    gradient: 'bg-gradient-to-b from-[#0284c7] via-[#075985] to-[#041c2c]',
    border: 'border-sky-400/40 hover:border-sky-300',
    iconBg: 'bg-sky-400/25 text-sky-100 border border-sky-300/30',
    badgeBg: 'bg-sky-400/20 text-sky-100 border border-sky-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(14,165,233,0.55)]',
  },
  {
    slug: 'teaching',
    name: 'Teaching Jobs',
    info: 'CTET, KVS, NVS & UGC',
    vacancies: '6,200+ Posts',
    badge: '6.2k+ Posts',
    icon: GraduationCap,
    gradient: 'bg-gradient-to-b from-[#0f766e] via-[#115e59] to-[#042421]',
    border: 'border-teal-400/40 hover:border-teal-300',
    iconBg: 'bg-teal-400/25 text-teal-100 border border-teal-300/30',
    badgeBg: 'bg-teal-400/20 text-teal-100 border border-teal-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(20,184,166,0.55)]',
  },
  {
    slug: 'other',
    name: 'State PSC & PSUs',
    info: 'BPSC, UPPSC, ISRO, DRDO',
    vacancies: '26,800+ Posts',
    badge: '26k+ Posts',
    icon: Building2,
    gradient: 'bg-gradient-to-b from-[#854d0e] via-[#713f12] to-[#1e1003]',
    border: 'border-yellow-400/40 hover:border-yellow-300',
    iconBg: 'bg-yellow-400/25 text-yellow-100 border border-yellow-300/30',
    badgeBg: 'bg-yellow-400/20 text-yellow-100 border border-yellow-300/30',
    glow: 'hover:shadow-[0_14px_32px_-6px_rgba(234,179,8,0.55)]',
  },
]

export default function JobCategoryCards() {
  const sliderRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (!sliderRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current
    setCanScrollLeft(scrollLeft > 10)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10)
  }

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return
    checkScroll()
    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  const scroll = (direction) => {
    if (!sliderRef.current) return
    const containerWidth = sliderRef.current.clientWidth
    const offset = direction === 'left' ? -containerWidth * 0.8 : containerWidth * 0.8
    sliderRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <div className="space-y-3">
      {/* ── Header: Title & Slider Controls ── */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            <Sparkles size={14} />
          </span>
          <h2 className="text-sm sm:text-base font-extrabold tracking-tight text-ink">
            Top Job Categories
          </h2>
          <span className="text-[11px] font-semibold text-ink-muted hidden sm:inline">
            • Explore major government recruitment sectors
          </span>
        </div>

        {/* Previous / Next Slider Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous Category"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-muted transition-all hover:bg-subtle hover:text-ink disabled:opacity-30 disabled:pointer-events-none shadow-2xs active:scale-90"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Next Category"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-hairline bg-surface text-ink-muted transition-all hover:bg-subtle hover:text-ink disabled:opacity-30 disabled:pointer-events-none shadow-2xs active:scale-90"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* ── 1-Row Slider: Exactly 5 Cards Visible Properly on Desktop, Smooth Touch Scroll on Mobile ── */}
      <div
        ref={sliderRef}
        className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2.5 px-0.5"
        style={{ scrollbarWidth: 'none' }}
      >
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          return (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className={`group relative flex h-[210px] sm:h-[225px] w-[165px] sm:w-[180px] md:w-[calc((100%-4*12px)/5)] shrink-0 snap-start flex-col justify-between rounded-2xl border ${cat.border} ${cat.gradient} p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 ${cat.glow}`}
            >
              {/* Top Row: Category Icon + Vacancy Badge */}
              <div className="flex items-start justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl shadow-xs transition-transform duration-300 group-hover:scale-110 ${cat.iconBg}`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold shadow-xs ${cat.badgeBg}`}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Middle Row: Category Name + Info Subtitle */}
              <div className="min-w-0 mt-2">
                <h3 className="truncate text-[14px] sm:text-[15px] font-black tracking-tight text-white transition-colors group-hover:text-white">
                  {cat.name}
                </h3>
                <p className="truncate text-[11.5px] font-medium text-white/80 mt-0.5">
                  {cat.info}
                </p>
              </div>

              {/* Bottom Row: Frosted Glass Explore Now Button */}
              <div
                className="mt-3 flex items-center justify-between rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-xs font-bold text-white shadow-xs backdrop-blur-md transition-all duration-200 group-hover:bg-white/25 group-hover:border-white/35"
              >
                <span>Explore Now</span>
                <ChevronRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
