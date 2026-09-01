import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import BrandIcon from '../components/BrandIcon.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { categories, jobs } from '../data/seed.js'

export default function ExamsPage() {
  return (
    <div className="animate-fade-in">
      <SEOHead
        title="All Government Exams & Categories"
        description="Explore all government exam categories including SSC, UPSC, Railway (RRB), Banking (IBPS), Defence, Police, and Teaching on SarkariFynx."
        canonical="https://sarkarifynx.in/exams"
      />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">All Exams &amp; Categories</h1>
        <p className="text-[13.5px] text-ink-muted">Browse government job categories across every department.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const live = jobs.filter((j) => j.category === c.slug).length
          return (
            <Link
              key={c.slug}
              to={`/category/${c.slug}`}
              className="card group flex items-center gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-cardhover"
            >
              <BrandIcon icon={c.icon} color={c.color} size={52} square />
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold text-ink group-hover:text-brand-600">{c.name}</h2>
                <p className="truncate text-[12.5px] text-ink-muted">{c.fullName}</p>
                <p className="mt-1 text-[12px] font-medium text-ink-faint">
                  {c.jobs} listings · {live} live now
                </p>
              </div>
              <ArrowUpRight size={18} className="shrink-0 text-ink-faint transition-colors group-hover:text-brand-600" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
