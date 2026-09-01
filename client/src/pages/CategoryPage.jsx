import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layers } from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import JobCard from '../components/JobCard.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getJobsByCategory, getJobsByKind } from '../services/api.js'
import { categories, kindLabels } from '../data/seed.js'

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

  useEffect(() => {
    let active = true
    setJobs(null)
    setFilter('all')
    const load = mode === 'category' ? getJobsByCategory(slug) : getJobsByKind(kind)
    load.then((data) => active && setJobs(data))
    return () => {
      active = false
    }
  }, [slug, kind, mode])

  const category = categories.find((c) => c.slug === slug)

  // Header content
  const heading =
    mode === 'category'
      ? { title: category?.name || slug, subtitle: category?.fullName || 'Latest posts in this category', icon: category?.icon, color: category?.color }
      : { title: kindLabels[kind] || 'Posts', subtitle: 'Freshly published across all departments', icon: null, color: '#5558e6' }

  // Sub-filter facet: in category mode we filter by kind; in kind mode by category.
  const facets = useMemo(() => {
    if (!jobs) return []
    if (mode === 'category') {
      const present = [...new Set(jobs.map((j) => j.kind))]
      return present.map((k) => ({ value: k, label: kindLabels[k] || k }))
    }
    const present = [...new Set(jobs.map((j) => j.category))]
    return present.map((c) => ({ value: c, label: categories.find((x) => x.slug === c)?.name || c }))
  }, [jobs, mode])

  const visible = useMemo(() => {
    if (!jobs) return []
    if (filter === 'all') return jobs
    return jobs.filter((j) => (mode === 'category' ? j.kind === filter : j.category === filter))
  }, [jobs, filter, mode])

  return (
    <div className="animate-fade-in">
      <SEOHead
        title={`${heading.title} — ${heading.subtitle}`}
        description={`Browse latest ${heading.title} notifications, exam dates, eligibility criteria, online application links and results on SarkariFynx.`}
        canonical={`https://sarkarifynx.in/${mode === 'category' ? `category/${slug}` : `latest/${kind}`}`}
      />

      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        {heading.icon ? (
          <BrandIcon icon={heading.icon} color={heading.color} size={52} square />
        ) : (
          <span
            className="flex h-[52px] w-[52px] items-center justify-center rounded-xl text-white"
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

      {/* Filters */}
      {facets.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
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

      {/* Results */}
      {jobs === null ? (
        <div className="flex h-48 items-center justify-center text-[14px] text-ink-muted">Loading posts…</div>
      ) : visible.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-[15px] font-semibold text-ink">No posts here yet</p>
          <p className="mt-1 text-[13px] text-ink-muted">Check back soon — new notifications are added daily.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map((job) => (
            <JobCard key={job.id} job={job} variant="row" />
          ))}
        </div>
      )}
    </div>
  )
}
