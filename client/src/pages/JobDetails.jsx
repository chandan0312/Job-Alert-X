import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Eye,
  Users,
  Briefcase,
  CalendarDays,
  Download,
  ExternalLink,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import TableView from '../components/TableView.jsx'
import CategoryBox from '../components/CategoryBox.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getJobById, getJobsByCategory, getKindLabel, getCategories } from '../services/api.js'

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-hairline bg-surface px-3.5 py-2.5">
      <Icon size={17} className="text-brand-600" />
      <div className="leading-tight">
        <p className="text-[13px] font-bold text-ink">{value}</p>
        <p className="text-[11px] text-ink-faint">{label}</p>
      </div>
    </div>
  )
}

export default function JobDetails() {
  const { id } = useParams()
  const [job, setJob] = useState(undefined) // undefined = loading, null = not found
  const [related, setRelated] = useState([])
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
    setJob(undefined)
    getJobById(id)
      .then((data) => {
        if (!active) return
        setJob(data || null)
        if (data) {
          getJobsByCategory(data.category)
            .then((list) => {
              if (active) setRelated((list || []).filter((j) => j.id !== data.id).slice(0, 6))
            })
            .catch(() => {})
        }
      })
      .catch(() => active && setJob(null))
    return () => {
      active = false
    }
  }, [id])

  if (job === undefined) {
    return (
      <div className="flex h-64 items-center justify-center text-[14px] text-ink-muted">
        Loading post…
      </div>
    )
  }

  if (job === null) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center">
        <h1 className="text-lg font-bold text-ink">Post not found</h1>
        <p className="mt-2 text-[13px] text-ink-muted">
          The post you’re looking for doesn’t exist or may have been removed.
        </p>
        <Link to="/" className="btn-primary mt-5">
          <ArrowLeft size={16} /> Back to Discover
        </Link>
      </div>
    )
  }

  const category = categories.find((c) => c.slug === job.category)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.shortInfo || job.tagline || job.title,
    identifier: {
      '@type': 'PropertyValue',
      name: job.org,
      value: job.id,
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: job.org,
    },
    datePosted: new Date().toISOString().split('T')[0],
    totalJobOpenings: job.vacancies || 1,
  }

  return (
    <div className="animate-fade-in">
      <SEOHead
        title={`${job.title} — ${job.org}`}
        description={`${job.title} by ${job.org}. Check eligibility criteria, total vacancies (${job.vacancies || 'N/A'}), online application form, admit card and results on Job Alert X.`}
        canonical={`https://jobalertx.com/job/${job.id}`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-[12.5px] text-ink-faint">
        <Link to="/" className="hover:text-brand-600">Discover</Link>
        <ChevronRight size={13} />
        <Link to={`/category/${job.category}`} className="hover:text-brand-600">
          {category?.name || 'Category'}
        </Link>
        <ChevronRight size={13} />
        <span className="text-ink-muted">{job.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main */}
        <main className="min-w-0 space-y-5">
          {/* Header card */}
          <header className="card p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <BrandIcon icon={job.logo.icon} color={job.logo.color} size={60} />
              <div className="min-w-0 flex-1">
                <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-600/15 dark:text-brand-200">
                  {getKindLabel(job.kind)}
                </span>
                <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight text-ink">
                  {job.title}
                </h1>
                <p className="mt-1 text-[14px] text-ink-muted">{job.org}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat icon={Eye} label="Views" value={job.views?.toLocaleString('en-IN')} />
              {job.applications ? (
                <Stat icon={Users} label="Applications" value={job.applications.toLocaleString('en-IN')} />
              ) : null}
              {job.vacancies ? (
                <Stat icon={Briefcase} label="Total Posts" value={job.vacancies.toLocaleString('en-IN')} />
              ) : null}
              <Stat icon={CalendarDays} label="Posted" value={job.postedOn} />
            </div>
          </header>

          {/* Overview */}
          {job.shortInfo && (
            <section className="card p-5 sm:p-6">
              <h2 className="mb-2 text-[15px] font-bold text-ink">Overview</h2>
              <p className="text-[14px] leading-relaxed text-ink-soft">{job.shortInfo}</p>
            </section>
          )}

          {/* Dates + fee */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {job.importantDates?.length ? (
              <TableView title="Important Dates" rows={job.importantDates} />
            ) : null}
            {job.fee?.length ? <TableView title="Application Fee" rows={job.fee} /> : null}
          </div>

          {/* Age limit */}
          {job.ageLimit && (
            <TableView
              title="Age Limit"
              rows={[
                { label: 'Minimum Age', value: `${job.ageLimit.min} years` },
                { label: 'Maximum Age', value: `${job.ageLimit.max} years` },
                { label: 'Note', value: job.ageLimit.note },
              ]}
            />
          )}

          {/* Vacancy / posts */}
          {job.posts?.length ? (
            <TableView
              title="Vacancy Details"
              columns={[
                { key: 'name', label: 'Post Name' },
                { key: 'total', label: 'Total Posts' },
                { key: 'eligibility', label: 'Eligibility' },
              ]}
              rows={job.posts}
            />
          ) : null}

          {/* Eligibility */}
          {job.eligibility && (
            <section className="card p-5 sm:p-6">
              <h2 className="mb-2 text-[15px] font-bold text-ink">Eligibility</h2>
              <p className="text-[14px] leading-relaxed text-ink-soft">{job.eligibility}</p>
            </section>
          )}
        </main>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-5">
          {/* Important links */}
          <section className="card p-5">
            <h2 className="mb-3 text-[14px] font-bold text-ink">Important Links</h2>
            <div className="space-y-2.5">
              {job.links?.map((link) => {
                const Icon = link.label.toLowerCase().includes('download')
                  ? Download
                  : link.label.toLowerCase().includes('website')
                  ? ExternalLink
                  : ArrowRight
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => e.preventDefault()}
                    className={link.primary ? 'btn-primary w-full' : 'btn-ghost w-full'}
                  >
                    {link.label}
                    <Icon size={16} />
                  </a>
                )
              })}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-ink-faint">
              Links are for demonstration. Always apply via the official website.
            </p>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <CategoryBox
              title={`More in ${category?.name || 'this category'}`}
              icon={category?.icon}
              color={category?.color}
              items={related}
              viewAllTo={`/category/${job.category}`}
            />
          )}
        </aside>
      </div>
    </div>
  )
}
