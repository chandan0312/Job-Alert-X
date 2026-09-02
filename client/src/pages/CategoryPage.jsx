import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layers, Search } from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getJobsByCategory, getJobsByKind, getKindLabel, getCategories } from '../services/api.js'

// Static kind labels used for facet chips (matches server /api/kinds)
const KIND_LABELS = {
  job: 'Latest Jobs',
  'admit-card': 'Admit Cards',
  result: 'Results',
  'answer-key': 'Answer Keys',
  syllabus: 'Syllabus',
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors ${
        active
          ? 'bg-brand-600 text-white'
          : 'border border-hairline bg-surface text-ink-soft hover:bg-subtle'
      }`}
    >
      {children}
    </button>
  )
}

export default function CategoryPage() {
  const { slug, kind } = useParams()
  const mode = slug ? 'category' : 'kind'

  const [jobs, setJobs] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])

  // Load categories for metadata (name, icon, color)
  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => active && setCategories(data || []))
      .catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    setJobs(null)
    setFilter('all')
    setSearch('')
    const load = mode === 'category' ? getJobsByCategory(slug) : getJobsByKind(kind)
    load
      .then((data) => active && setJobs(data || []))
      .catch(() => active && setJobs([]))
    return () => {
      active = false
    }
  }, [slug, kind, mode])

  const category = categories.find((c) => c.slug === slug)

  // Header content
  const heading =
    mode === 'category'
      ? { title: category?.name || slug?.toUpperCase(), subtitle: category?.fullName || 'Latest notifications in this category', icon: category?.icon, color: category?.color || '#5558e6' }
      : { title: KIND_LABELS[kind] || 'Latest Posts', subtitle: 'Freshly published notifications across all departments', icon: null, color: '#5558e6' }

  // Sub-filter facet: in category mode we filter by kind; in kind mode by category.
  const facets = useMemo(() => {
    if (!jobs) return []
    if (mode === 'category') {
      const present = [...new Set(jobs.map((j) => j.kind).filter(Boolean))]
      return present.map((k) => ({ value: k, label: KIND_LABELS[k] || k }))
    }
    const present = [...new Set(jobs.map((j) => j.category).filter(Boolean))]
    return present.map((c) => ({ value: c, label: categories.find((x) => x.slug === c)?.name || c }))
  }, [jobs, mode, categories])

  const visible = useMemo(() => {
    if (!jobs) return []
    let list = jobs
    if (filter !== 'all') {
      list = list.filter((j) => (mode === 'category' ? j.kind === filter : j.category === filter))
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter((j) =>
        j.title?.toLowerCase().includes(q) ||
        j.org?.toLowerCase().includes(q) ||
        j.orgShort?.toLowerCase().includes(q)
      )
    }
    return list
  }, [jobs, filter, mode, search])

  return (
    <div className="animate-fade-in space-y-6">
      <SEOHead
        title={`${heading.title} — ${heading.subtitle}`}
        description={`Browse latest ${heading.title} notifications, exam dates, eligibility criteria, online application links and results on Job Alert X.`}
        canonical={`https://jobalertx.com/${mode === 'category' ? `category/${slug}` : `latest/${kind}`}`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {heading.icon ? (
            <BrandIcon icon={heading.icon} color={heading.color} size={52} square />
          ) : (
            <span
              className="flex h-[52px] w-[52px] items-center justify-center rounded-xl text-white shadow-sm"
              style={{ background: `linear-gradient(135deg, ${heading.color}, #3a3ca5)` }}
            >
              <Layers size={24} />
            </span>
          )}
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">{heading.title}</h1>
            <p className="text-[13.5px] text-ink-muted">{heading.subtitle}</p>
          </div>
        </div>

        {/* Search within page */}
        {jobs && jobs.length > 0 && (
          <div className="relative w-full sm:w-72">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by title, org..."
              className="w-full rounded-xl border border-hairline bg-surface py-2 pl-9 pr-3.5 text-xs text-ink placeholder:text-ink-faint focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        )}
      </div>

      {/* Filters */}
      {facets.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>
            All{jobs ? ` (${jobs.length})` : ''}
          </Chip>
          {facets.map((f) => (
            <Chip key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </div>
      )}

      {/* Results in Professional Tabular Format */}
      {jobs === null ? (
        <div className="flex h-48 items-center justify-center text-[14px] text-ink-muted">Loading posts…</div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-subtle/40 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
            <Layers size={22} />
          </span>
          <p className="text-[15px] font-semibold text-ink">Coming Soon</p>
          <p className="text-[13px] text-ink-muted">
            No posts found in this section yet — new notifications are added daily.
          </p>
        </div>
      ) : (
        <RecentJobsTable jobs={visible} showFooter={false} />
      )}
    </div>
  )
}
