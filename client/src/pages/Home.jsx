import { useEffect, useState } from 'react'
import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
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

    // 3. Bank Jobs (3 latest)
    getJobsByCategory('banking', 3)
      .then((data) => active && setBankJobs(data || []))
      .catch(() => active && setBankJobs([]))

    // 4. SSC Jobs (3 latest)
    getJobsByCategory('ssc', 3)
      .then((data) => active && setSscJobs(data || []))
      .catch(() => active && setSscJobs([]))

    // 5. Railway Jobs (3 latest)
    getJobsByCategory('railway', 3)
      .then((data) => active && setRailwayJobs(data || []))
      .catch(() => active && setRailwayJobs([]))

    // 6. Defence Jobs (3 latest)
    getJobsByCategory('defence', 3)
      .then((data) => active && setDefenceJobs(data || []))
      .catch(() => active && setDefenceJobs([]))

    // 7. UPSC Jobs (3 latest)
    getJobsByCategory('upsc', 3)
      .then((data) => active && setUpscJobs(data || []))
      .catch(() => active && setUpscJobs([]))

    return () => { active = false }
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_336px]">
      <SEOHead
        title="Latest Govt Jobs, Sarkari Results, Admit Cards & Answer Keys"
        description="Check latest Sarkari Naukri, Online Application Forms, SSC, Railway, UPSC, Banking, Defence, Teaching jobs, Admit Cards, and Results on Job Alert X."
        canonical="https://sarkarifynx.in/"
      />

      {/* Main column */}
      <main className="min-w-0 space-y-9">
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

        {/* 2. Recently Posted Jobs (5 latest) */}
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
