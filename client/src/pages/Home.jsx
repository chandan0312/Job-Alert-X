import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import JobCategoryCards from '../components/JobCategoryCards.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { getTrending, getRecentlyPosted, getJobsByCategory } from '../services/api.js'
import { Clock, Sparkles, Landmark, Scale, TrainFront, Shield, Building2 } from 'lucide-react'

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

export default function Home() {
  const [trending, setTrending] = useState(null)
  const [recentlyPosted, setRecentlyPosted] = useState(null)
  const [bankJobs, setBankJobs] = useState(null)
  const [sscJobs, setSscJobs] = useState(null)
  const [railwayJobs, setRailwayJobs] = useState(null)
  const [defenceJobs, setDefenceJobs] = useState(null)
  const [upscJobs, setUpscJobs] = useState(null)

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

    // 3. Bank Jobs (3 latest recruitment jobs)
    getJobsByCategory('banking', 3, 'job')
      .then((data) => active && setBankJobs(data || []))
      .catch(() => active && setBankJobs([]))

    // 4. SSC Jobs (3 latest recruitment jobs)
    getJobsByCategory('ssc', 3, 'job')
      .then((data) => active && setSscJobs(data || []))
      .catch(() => active && setSscJobs([]))

    // 5. Railway Jobs (3 latest recruitment jobs)
    getJobsByCategory('railway', 3, 'job')
      .then((data) => active && setRailwayJobs(data || []))
      .catch(() => active && setRailwayJobs([]))

    // 6. Defence Jobs (3 latest recruitment jobs)
    getJobsByCategory('defence', 3, 'job')
      .then((data) => active && setDefenceJobs(data || []))
      .catch(() => active && setDefenceJobs([]))

    // 7. UPSC Jobs (3 latest recruitment jobs)
    getJobsByCategory('upsc', 3, 'job')
      .then((data) => active && setUpscJobs(data || []))
      .catch(() => active && setUpscJobs([]))

    return () => { active = false }
  }, [])

  const homeSchemas = [
    {
      '@type': 'WebSite',
      name: 'Job Alert X',
      url: 'https://jobalertx.com/',
      description: 'India\'s #1 Govt Jobs Notification and Sarkari Result Portal',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jobalertx.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
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
        title="Job Alert X — #1 Sarkari Result, Latest Govt Jobs, Admit Card & Answer Key"
        description="Get instant Sarkari Result, Latest Govt Jobs 2026, Online Application Forms, Admit Cards, Answer Keys, and Exam Notifications for SSC, Railway RRB, Banking IBPS, Police, Defence and UPSC."
        keywords="sarkari result, latest govt jobs, sarkari exam, sarkari naukri, govt jobs 2026, free job alert, online application form, admit card 2026, answer key, ssc cgl, railway rrb, ibps po, up police, upsc 2026"
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
                  Latest Govt Jobs, Sarkari Naukri, Exams &amp; Results
                </span>
                <span className="mx-2 hidden text-hairline md:inline font-light" aria-hidden="true">|</span>
                <span className="block text-xs sm:text-sm font-bold text-ink-muted mt-0.5 md:mt-0 md:inline tracking-normal">
                  सरकारी नौकरी, भर्ती, परीक्षा एवं रिजल्ट
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
            <div className="flex h-48 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : trending.length === 0 ? (
            <ComingSoonBlock icon={Sparkles} label="trending posts" />
          ) : (
            <HeroBanner slides={trending} />
          )}
        </section>

        {/* 2. Job Categories in Professional Cards */}
        <section>
          <JobCategoryCards />
        </section>

        {/* 3. Recently Posted Jobs (5 latest) */}
        <section>
          <SectionHeader title="Recently Posted Jobs" viewAllTo="/latest/job" />
          {recentlyPosted === null ? (
            <div className="flex h-32 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : recentlyPosted.length === 0 ? (
            <ComingSoonBlock icon={Clock} label="recent jobs" />
          ) : (
            <RecentJobsTable jobs={recentlyPosted} viewAllTo="/latest/job" viewAllText="View All Latest Jobs" />
          )}
        </section>

        {/* 3. Bank Jobs (3 latest) */}
        <section>
          <SectionHeader title="Bank Jobs" viewAllTo="/category/banking" />
          {bankJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : bankJobs.length === 0 ? (
            <ComingSoonBlock icon={Landmark} label="bank notifications" />
          ) : (
            <RecentJobsTable jobs={bankJobs} viewAllTo="/category/banking" viewAllText="View All Bank Jobs" />
          )}
        </section>

        {/* 4. SSC Jobs (3 latest) */}
        <section>
          <SectionHeader title="SSC Jobs" viewAllTo="/category/ssc" />
          {sscJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : sscJobs.length === 0 ? (
            <ComingSoonBlock icon={Building2} label="SSC notifications" />
          ) : (
            <RecentJobsTable jobs={sscJobs} viewAllTo="/category/ssc" viewAllText="View All SSC Jobs" />
          )}
        </section>

        {/* 5. Railway Jobs (3 latest) */}
        <section>
          <SectionHeader title="Railway Jobs" viewAllTo="/category/railway" />
          {railwayJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : railwayJobs.length === 0 ? (
            <ComingSoonBlock icon={TrainFront} label="railway notifications" />
          ) : (
            <RecentJobsTable jobs={railwayJobs} viewAllTo="/category/railway" viewAllText="View All Railway Jobs" />
          )}
        </section>

        {/* 6. Defence Jobs (3 latest) */}
        <section>
          <SectionHeader title="Defence Jobs" viewAllTo="/category/defence" />
          {defenceJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : defenceJobs.length === 0 ? (
            <ComingSoonBlock icon={Shield} label="defence notifications" />
          ) : (
            <RecentJobsTable jobs={defenceJobs} viewAllTo="/category/defence" viewAllText="View All Defence Jobs" />
          )}
        </section>

        {/* 7. UPSC Jobs (3 latest) */}
        <section>
          <SectionHeader title="UPSC Jobs" viewAllTo="/category/upsc" />
          {upscJobs === null ? (
            <div className="flex h-28 items-center justify-center text-[14px] text-ink-muted">
              Loading…
            </div>
          ) : upscJobs.length === 0 ? (
            <ComingSoonBlock icon={Scale} label="UPSC notifications" />
          ) : (
            <RecentJobsTable jobs={upscJobs} viewAllTo="/category/upsc" viewAllText="View All UPSC Jobs" />
          )}
        </section>
      </main>

      {/* Right rail */}
      <aside className="min-w-0">
        <RightSidebar />
      </aside>
    </div>
  )
}
