import SectionHeader from '../components/SectionHeader.jsx'
import HeroBanner from '../components/HeroBanner.jsx'
import RecentJobsTable from '../components/RecentJobsTable.jsx'
import PopularCard from '../components/PopularCard.jsx'
import RightSidebar from '../components/RightSidebar.jsx'
import SEOHead from '../components/SEOHead.jsx'
import { trending, recentlyPosted, popularCourses } from '../data/seed.js'

export default function Home() {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_336px]">
      <SEOHead
        title="Latest Govt Jobs, Sarkari Results, Admit Cards & Answer Keys"
        description="Check latest Sarkari Naukri, Online Application Forms, SSC, Railway, UPSC, Banking, Defence, Teaching jobs, Admit Cards, and Results on Job Alert X."
        canonical="https://sarkarifynx.in/"
      />

      {/* Main column */}
      <main className="min-w-0 space-y-9">
        {/* Trending / hero */}
        <section>
          <SectionHeader title="Trending This Week" />
          <HeroBanner slides={trending} />
        </section>

        {/* Recently posted — tabular view */}
        <section>
          <SectionHeader title="Recently Posted Jobs" viewAllTo="/latest/job" />
          <RecentJobsTable jobs={recentlyPosted} viewAllTo="/latest/job" />
        </section>

        {/* Most popular */}
        <section>
          <SectionHeader title="Most Popular" viewAllTo="/exams" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {popularCourses.map((course) => (
              <PopularCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      </main>

      {/* Right rail */}
      <aside className="min-w-0">
        <RightSidebar />
      </aside>
    </div>
  )
}
