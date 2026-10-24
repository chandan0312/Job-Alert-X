import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import JobCategoryCards from '../components/JobCategoryCards.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import HomeArticlesSection from '../components/HomeArticlesSection.jsx'
import AttentionCard from '../components/AttentionCard.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getTrending, getRecentlyPosted, getJobsByCategory, getArchivedJobs } from '../services/api.js'
import { Clock, Sparkles, Archive } from 'lucide-react'


function TableSkeleton({ rows = 3 }) {
  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4 space-y-3 animate-pulse shadow-xs" aria-hidden="true">
      <div className="h-4 bg-subtle/80 rounded w-1/4 mb-3" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-hairline/60 last:border-b-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-subtle/90 shrink-0" />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="h-3.5 bg-subtle/90 rounded w-3/5" />
              <div className="h-2.5 bg-subtle/60 rounded w-1/3" />
            </div>
          </div>
          <div className="h-7 w-20 rounded-lg bg-subtle/70 shrink-0" />
        </div>
      ))}
    </div>
  )
}

function ComingSoonBlock({ icon: Icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-hairline bg-subtle/40 py-10 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-600/15 dark:text-brand-300">
        <Icon size={20} />
      </span>
      <p className="text-[13.5px] font-semibold text-ink">Coming Soon</p>
      <p className="text-[12px] text-ink-muted">
        No active {label} yet — new notifications are added daily.
      </p>
    </div>
  )
}

const CATEGORY_CONFIG = [
  { key: 'jpsc', title: 'JPSC Recruitment 2026', viewAllTo: '/category/jpsc', viewAllText: 'View All JPSC Jobs' },
  { key: 'jssc', title: 'JSSC Recruitment 2026', viewAllTo: '/category/jssc', viewAllText: 'View All JSSC Jobs' },
  { key: 'rojgar-mela', title: 'Rojgar Mela & Camps', viewAllTo: '/category/rojgar-mela', viewAllText: 'View All Rojgar Mela' },
  { key: 'private', title: 'Private Sector Jobs', viewAllTo: '/category/private', viewAllText: 'View All Private Jobs' },
  { key: 'banking', title: 'Bank Jobs', viewAllTo: '/category/banking', viewAllText: 'View All Bank Jobs' },
  { key: 'ssc', title: 'SSC Jobs', viewAllTo: '/category/ssc', viewAllText: 'View All SSC Jobs' },
  { key: 'railway', title: 'Railway Jobs', viewAllTo: '/category/railway', viewAllText: 'View All Railway Jobs' },
  { key: 'defence', title: 'Defence Jobs', viewAllTo: '/category/defence', viewAllText: 'View All Defence Jobs' },
  { key: 'upsc', title: 'UPSC Jobs', viewAllTo: '/category/upsc', viewAllText: 'View All UPSC Jobs' },
]

export default function Home() {
  const [trending, setTrending] = useState(null)
  const [recentlyPosted, setRecentlyPosted] = useState(null)
  const [categoryJobs, setCategoryJobs] = useState({})
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [archivedJobs, setArchivedJobs] = useState(null)

  useEffect(() => {
    let active = true

    // 1. Trending
    getTrending()
      .then((data) => active && setTrending(data || []))
      .catch(() => active && setTrending([]))

    // 2. 5 Latest Posted Jobs
    getRecentlyPosted(5)
      .then((data) => active && setRecentlyPosted(data || []))
      .catch(() => active && setRecentlyPosted([]))

    // 4. Archived/expired jobs
    getArchivedJobs(5)
      .then((data) => active && setArchivedJobs(data || []))
      .catch(() => active && setArchivedJobs([]))

    // 3. Category Jobs
    Promise.allSettled(
      CATEGORY_CONFIG.map((cat) =>
        getJobsByCategory(cat.key, 3, 'job').then((jobs) => ({ key: cat.key, jobs: jobs || [] }))
      )
    )
      .then((results) => {
        if (!active) return
        const map = {}
        for (const res of results) {
          if (res.status === 'fulfilled' && res.value) {
            map[res.value.key] = res.value.jobs
          }
        }
        setCategoryJobs(map)
        setLoadingCategories(false)
      })
      .catch(() => {
        if (active) setLoadingCategories(false)
      })

    return () => { active = false }
  }, [])

  const homeSchemas = [
    {
      '@type': 'WebSite',
      name: 'Job Alert X',
      url: 'https://jobalertx.com/',
      description: 'Job Alert X 2026 — India\'s #1 Govt Jobs Notification, Sarkari Naukri & Sarkari Result Portal. Latest government job vacancy 2026 across SSC, Railway, Banking, Police, UPSC.',
    },
    {
      '@type': 'Organization',
      name: 'Job Alert X',
      url: 'https://jobalertx.com/',
      logo: 'https://jobalertx.com/favicon.svg',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_336px]">
      <SEOHead
        title="Job Alert X 2026 — Latest Govt Jobs, Sarkari Naukri, Admit Card & Result"
        description="Job Alert X 2026 — Get latest government job vacancy 2026, new recruitment notifications, online application forms, admit cards, results and answer keys for SSC, Railway RRB, Banking IBPS SBI, Police, Defence, UPSC across all states of India."
        keywords="free job alert, free job alert 2026, government job vacancy 2026, new job vacancy 2026, govt job notification 2026, latest govt jobs, latest notification, job notification 2026, new vacancy 2026, govt jobs 2026, sarkari job alert, govt job alert, central govt jobs, latest job notification, free job alert odisha, free job alert punjab, free job alert bihar, free job alert rajasthan, free job alert hp, free job alert cg, free job alert jharkhand, free job alert mp, sarkari naukri, sarkari result 2026, admit card 2026, answer key, 12th pass govt job, forest guard recruitment 2026, free job alert ssc, free job alert railway, defence job alert, nursing job alert, job alert x"
        canonical="https://jobalertx.com/"
        jsonLd={homeSchemas}
      />

      {/* Main column */}
      <main className="min-w-0 space-y-6">
        {/* Creative Professional Headline Banner */}
        <section className="group relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-r from-subtle/80 via-surface to-subtle/80 p-3.5 sm:p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-orange-500/30 hover:shadow-md animate-fade-in">
          {/* Subtle ambient light glow */}
          <div className="pointer-events-none absolute -left-6 -top-6 h-28 w-28 rounded-full bg-orange-500/10 blur-xl transition-opacity group-hover:opacity-100" />
          <div className="pointer-events-none absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-brand-500/10 blur-xl transition-opacity group-hover:opacity-100" />

          <div className="relative flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                  Daily Verified Updates
                </span>
                <span className="text-[11px] text-ink-faint hidden sm:inline">• Central &amp; State Recruitment</span>
              </div>

              <h1 className="text-sm sm:text-base md:text-lg font-extrabold leading-snug tracking-tight text-ink">
                <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-600 dark:from-orange-400 dark:via-amber-300 dark:to-purple-400 bg-clip-text text-transparent font-black">
                  Job Alert X 2026 — Latest Govt Jobs, Sarkari Naukri & New Vacancy
                </span>
                <span className="mx-2 hidden text-hairline md:inline font-light" aria-hidden="true">|</span>
                <span className="block text-xs sm:text-sm font-bold text-ink-muted mt-0.5 md:mt-0 md:inline tracking-normal">
                  सरकारी नौकरी, भर्ती, परीक्षा एवं रिजल्ट 2026
                </span>
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 self-start sm:self-center">
              <span className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-bold bg-brand-50 text-brand-700 dark:bg-brand-600/20 dark:text-brand-300 border border-brand-500/20 shadow-2xs">
                2026 Live Forms
              </span>
            </div>
          </div>
        </section>

        {/* 1. Trending / Hero Carousel */}
        <section>
          <SectionHeader title="Trending This Week" />
          {trending === null ? (
            <div className="h-48 rounded-2xl bg-subtle/70 animate-pulse border border-hairline shadow-xs" aria-hidden="true" />
          ) : trending.length === 0 ? (
            <ComingSoonBlock icon={Sparkles} label="trending posts" />
          ) : (
            <HeroBanner slides={trending} />
          )}
        </section>

        {/* 2. Browse by Category */}
        <section>
          <JobCategoryCards />
        </section>

        {/* 3. Attention Card — visible only on mobile, placed just below hero and browse category */}
        <section className="xl:hidden">
          <AttentionCard />
        </section>

        {/* 4. Recently Posted Jobs (hidden entirely when no jobs available) */}
        {recentlyPosted === null ? (
          <section>
            <SectionHeader title="Recently Posted Jobs" viewAllTo="/latest/job" />
            <TableSkeleton rows={4} />
          </section>
        ) : recentlyPosted.length > 0 ? (
          <section>
            <SectionHeader title="Recently Posted Jobs" viewAllTo="/latest/job" />
            <RecentJobsTable jobs={recentlyPosted} viewAllTo="/latest/job" viewAllText="View All Latest Jobs" />
          </section>
        ) : null}

        {/* 5. Category Job Sections (only shown when jobs exist) */}
        {loadingCategories ? (
          <TableSkeleton rows={3} />
        ) : (
          CATEGORY_CONFIG.filter(
            (cat) => categoryJobs[cat.key] && categoryJobs[cat.key].length > 0
          ).map((cat) => (
            <section key={cat.key}>
              <SectionHeader title={cat.title} viewAllTo={cat.viewAllTo} />
              <RecentJobsTable
                jobs={categoryJobs[cat.key]}
                viewAllTo={cat.viewAllTo}
                viewAllText={cat.viewAllText}
              />
            </section>
          ))
        )}

        {/* 6. Archived / Expired Jobs (only when available) */}
        {archivedJobs !== null && archivedJobs.length > 0 && (
          <section>
            <SectionHeader title="Archived — Last Date Over" viewAllTo="/category/archive" />
            <RecentJobsTable jobs={archivedJobs} viewAllTo="/category/archive" viewAllText="View All Archived Jobs" />
          </section>
        )}

        {/* 7. Career Articles & Guides (at the bottom) */}
        <section>
          <HomeArticlesSection />
        </section>
      </main>

      {/* Right rail */}
      <aside className="min-w-0">
        <RightSidebar />
      </aside>
    </div>
  )
}
