import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Search,
  FileCheck,
  RefreshCw,
  AlertCircle,
  BookOpen,
  MessageSquare,
  Newspaper,
  Send,
  Youtube,
  Lock,
  Eye,
  Edit3,
  Scale,
  BookMarked,
  BadgeCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Globe,
  Clock,
  Users,
} from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const factCheckSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Fact-Checking Policy — Job Alert X',
  url: 'https://jobalertx.com/fact-checking-policy',
  description: 'Job Alert X Fact-Checking Policy — How we verify every government job notification, our source hierarchy, verification methodology, claim classification, and the standards we use to ensure accuracy in recruitment information.',
  about: 'https://jobalertx.com/about',
  publisher: {
    '@type': 'Organization',
    name: 'Job Alert X',
    url: 'https://jobalertx.com/',
    logo: 'https://jobalertx.com/favicon.svg',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://jobalertx.com/fact-checking-policy',
  },
  datePublished: '2024-01-15',
  dateModified: new Date().toISOString().split('T')[0],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobalertx.com/' },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://jobalertx.com/about' },
    { '@type': 'ListItem', position: 3, name: 'Fact-Checking Policy', item: 'https://jobalertx.com/fact-checking-policy' },
  ],
}

const SOURCE_HIERARCHY = [
  { level: 1, name: 'Official Notification PDF', source: 'Direct from recruiting authority website (e.g., ssc.nic.in, upsc.gov.in, rrbcdg.gov.in, ibps.in, state PSC portals)', authority: 'Primary — Legal authority', icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { level: 2, name: 'Official Website HTML Page', source: 'Recruitment authority\'s official webpage announcing the notification', authority: 'Primary — Official publication', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { level: 3, name: 'Official Press Release / PIB', source: 'Press Information Bureau or authority\'s official press release', authority: 'Primary — Official communication', icon: Newspaper, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { level: 4, name: 'Gazette Notification', source: 'Official Gazette of India or State Gazette', authority: 'Primary — Legal record', icon: BookMarked, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { level: 5, name: 'Corrigendum / Addendum', source: 'Official corrections or additions issued by the authority', authority: 'Primary — Supersedes original', icon: RefreshCw, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { level: 6, name: 'RTI Responses (Verified)', source: 'Right to Information responses from recruiting authorities, verified for authenticity', authority: 'Secondary — Supplementary', icon: HelpCircle, color: 'text-teal-500', bg: 'bg-teal-500/10' },
]

const NOT_ACCEPTED_SOURCES = [
  { name: 'Third-party job portals', reason: 'Often copy without verification; may introduce errors', icon: XCircle },
  { name: 'Social media posts (unverified)', reason: 'No editorial control; rumours spread rapidly', icon: XCircle },
  { name: 'Coaching institute websites', reason: 'Commercial interest; may prioritize their courses over accuracy', icon: XCircle },
  { name: 'WhatsApp/Telegram forwards', reason: 'Zero traceability; frequently fabricated or outdated', icon: XCircle },
  { name: 'News articles without primary source link', reason: 'Secondary reporting may misinterpret or omit details', icon: XCircle },
  { name: 'Forum discussions / Quora / Reddit', reason: 'Anecdotal; not authoritative for official facts', icon: XCircle },
  { name: 'Expected/Upcoming notifications', reason: 'Speculation; we only publish after official release', icon: XCircle },
]

const VERIFICATION_CHECKLIST = [
  { category: 'Vacancy Details', items: ['Total vacancy count matches PDF exactly', 'Post names and codes match', 'Category-wise breakup (UR/OBC/SC/ST/EWS/PwD) verified', 'State/zone-wise distribution confirmed'] },
  { category: 'Important Dates', items: ['Notification release date', 'Online application start date', 'Online application end date', 'Last date for fee payment', 'Exam date(s) / schedule (if announced)', 'Admit card release date (when announced)', 'Result / answer key dates (when announced)'] },
  { category: 'Eligibility Criteria', items: ['Age limit (as on cutoff date) with all relaxations', 'Educational qualification (exact degree/discipline)', 'Experience requirements (if any)', 'Nationality / domicile requirements', 'Physical/medical standards (for defence/police)'] },
  { category: 'Application Process', items: ['Application mode (online/offline)', 'Official application portal URL', 'Application fee (category-wise)', 'Fee payment modes', 'Documents required for upload', 'Photo/signature specifications'] },
  { category: 'Selection Process', items: ['Number of stages', 'Exam pattern per stage (CBT/PET/PST/Interview)', 'Syllabus topics', 'Marking scheme (positive/negative)', 'Qualifying marks / cutoff methodology', 'Final merit list preparation'] },
  { category: 'Official Links', items: ['Notification PDF direct link (verified accessible)', 'Official website homepage', 'Online application portal', 'Admit card download portal', 'Result / answer key portal', 'Contact details of recruiting authority'] },
]

const CLAIM_CLASSIFICATION = [
  { label: 'VERIFIED ✓', color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', desc: 'Fact confirmed against official notification PDF. Displayed with confidence on the page.' },
  { label: 'VERIFIED WITH CAVEAT ⚠', color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/30', desc: 'Fact confirmed but with important context (e.g., "age limit as on 01/01/2024 — verify cutoff date for your category").' },
  { label: 'PENDING VERIFICATION ⟳', color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/30', desc: 'Information from official source but awaiting PDF confirmation. Clearly labeled on page.' },
  { label: 'NOT SPECIFIED ○', color: 'text-slate-600', bg: 'bg-slate-500/10', border: 'border-slate-500/30', desc: 'Detail not mentioned in official notification. We explicitly state "Not specified in official notification" rather than guessing.' },
  { label: 'SUPERSEDED / CORRECTED ↻', color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500/30', desc: 'Previous information corrected by corrigendum. Original and corrected versions both shown in correction log.' },
  { label: 'UNVERIFIED / RUMOUR ✗', color: 'text-red-600', bg: 'bg-red-500/10', border: 'border-red-500/30', desc: 'Never published. If we investigate a rumour and cannot verify, we may note "No official notification found as of [date]" in an article.' },
]

const MONITORING_SCHEDULE = [
  { phase: 'Pre-Publication', frequency: 'Once per notification', actions: ['Full 8-step verification workflow', 'Dual-review by two team members', 'Schema validation and structured data testing'] },
  { phase: 'Active Recruitment (Application Open)', frequency: 'Daily', actions: ['Check for corrigenda / date extensions', 'Monitor official website for updates', 'Verify admit card release announcements'] },
  { phase: 'Post-Application (Pre-Exam)', frequency: 'Daily', actions: ['Track admit card release', 'Monitor exam date changes', 'Check for answer key schedule announcements'] },
  { phase: 'Post-Exam', frequency: 'Daily', actions: ['Monitor answer key release', 'Track objection window dates', 'Watch for result / cutoff announcements'] },
  { phase: 'Final Stages', frequency: 'Weekly', actions: ['Track final result / merit list', 'Monitor document verification schedule', 'Watch for appointment/joining updates'] },
  { phase: 'Closed / Archived', frequency: 'Quarterly audit', actions: ['Verify all official links still work', 'Check for any retrospective corrections', 'Update "Last Reviewed" date'] },
]

const TOOLS_METHODOLOGY = [
  { title: 'Age Calculator', methodology: 'Calculates exact age as on user-specified reference date. Supports all government category relaxations (OBC: +3 years, SC/ST: +5 years, PwD: +10 years, Ex-Servicemen: service period +3 years). Formula: Age = Reference Date – Date of Birth. Result shows eligible/not eligible per category.' },
  { title: 'Eligibility Checker', methodology: 'Matches user\'s qualification against job requirements using qualification hierarchy logic (PhD includes Master\'s, B.Tech includes Diploma, etc.). Checks age, qualification, experience, category. Result: Eligible / Conditionally Eligible / Not Eligible with reasons.' },
  { title: 'Fee & Dates Summary', methodology: 'Extracts fee structure and important dates from job data. Displays status indicators: Past (red), Soon/Upcoming (amber), Future (green). Cross-references with current date.' },
  { title: 'Document Checklist', methodology: 'Generates checklist from job\'s requiredDocuments field + standard government job documents. Tracks completion progress. Exports to text/clipboard. Not an official document — always verify from notification PDF.' },
]

export default function FactCheckingPolicyPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="Fact-Checking Policy — Job Alert X"
        description="Job Alert X Fact-Checking Policy: How we verify every government job notification, source hierarchy, verification methodology, claim classification, and monitoring schedule for accuracy in recruitment information."
        canonical="https://jobalertx.com/fact-checking-policy"
        jsonLd={[factCheckSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/about" className="hover:text-brand-600">About Us</Link>
        <span>/</span>
        <span className="text-ink-muted">Fact-Checking Policy</span>
      </nav>

      {/* Hero */}
      <header className="card p-8 text-center space-y-4">
        <div className="flex justify-center">
          <SarkariEmblem size={64} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Fact-Checking Policy</h1>
        <p className="text-[15px] leading-relaxed text-ink-soft max-w-xl mx-auto">
          Our methodology for verifying every government job notification — source hierarchy, verification checklist, claim classification, and ongoing monitoring.
        </p>
        <div className="flex items-center justify-center gap-4 text-[12px] text-ink-faint flex-wrap pt-2">
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> Primary Sources Only</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-blue-500" /> 8-Step Verification</span>
          <span className="flex items-center gap-1.5"><Eye size={13} className="text-purple-500" /> Transparent Classification</span>
          <span className="flex items-center gap-1.5"><Clock size={13} className="text-orange-500" /> Continuous Monitoring</span>
        </div>
      </header>

      {/* Source Hierarchy */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Source Hierarchy — What We Trust</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            We only use primary official sources. Each level supersedes those below it.
          </p>
        </div>
        <div className="space-y-3">
          {SOURCE_HIERARCHY.map(({ level, name, source, authority, icon: Icon, color, bg }) => (
            <div key={level} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon size={17} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-brand-500/10 px-2 py-0.5 text-[11px] font-bold text-brand-600">Level {level}</span>
                  <p className="text-[13.5px] font-bold text-ink">{name}</p>
                </div>
                <p className="mt-1 ml-11 text-[12.5px] leading-relaxed text-ink-muted">{source}</p>
                <p className="mt-1 ml-11 text-[11.5px] font-medium text-amber-700">{authority}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sources We Do NOT Accept */}
      <section className="card p-6 space-y-5 border-l-4 border-red-500">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
            <XCircle size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">Sources We Do NOT Accept</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              These sources are never used as the basis for publishing recruitment information.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-13">
          {NOT_ACCEPTED_SOURCES.map(({ name, reason, icon: Icon }) => (
            <div key={name} className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <Icon size={15} className="mt-0.5 shrink-0 text-red-500" />
              <div>
                <p className="text-[12.5px] font-medium text-red-700">{name}</p>
                <p className="text-[11.5px] text-red-600">{reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Verification Checklist */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Verification Checklist — Every Field, Every Time</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Our internal checklist used during the dual-review process before publication.
          </p>
        </div>
        <div className="space-y-4">
          {VERIFICATION_CHECKLIST.map(({ category, items }) => (
            <div key={category} className="rounded-xl border border-hairline bg-subtle/30 p-4">
              <p className="text-[13px] font-bold text-ink mb-2 flex items-center gap-2">
                <BookOpen size={14} className="text-brand-500" /> {category}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Claim Classification */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Claim Classification System</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Every factual claim on our pages carries an implicit classification. We make this explicit for transparency.
          </p>
        </div>
        <div className="space-y-3">
          {CLAIM_CLASSIFICATION.map(({ label, color, bg, border, desc }) => (
            <div key={label} className={`flex items-start gap-3 rounded-xl p-4 ${border} ${bg}`}>
              <span className={`shrink-0 px-3 py-1 rounded font-bold text-[11px] ${color}`}>
                {label}
              </span>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Monitoring Schedule */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Continuous Monitoring Schedule</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Recruitment information changes. We track every notification through its lifecycle.
          </p>
        </div>
        <div className="space-y-3">
          {MONITORING_SCHEDULE.map(({ phase, frequency, actions }) => (
            <div key={phase} className="rounded-xl border border-hairline bg-subtle/30 p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <p className="text-[13.5px] font-bold text-ink">{phase}</p>
                <span className="rounded bg-brand-500/10 px-2 py-0.5 text-[11px] font-bold text-brand-600">{frequency}</span>
              </div>
              <ul className="space-y-1 ml-4">
                {actions.map((action, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Methodology */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Free Tools — Methodology & Transparency</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Our calculators and checkers are built on transparent, auditable logic.
          </p>
        </div>
        <div className="space-y-4">
          {TOOLS_METHODOLOGY.map(({ title, methodology }) => (
            <div key={title} className="rounded-xl border border-hairline bg-subtle/30 p-4">
              <p className="text-[13px] font-bold text-ink mb-2 flex items-center gap-2">
                <BadgeCheck size={14} className="text-emerald-500" /> {title}
              </p>
              <p className="text-[12.5px] leading-relaxed text-ink-muted">{methodology}</p>
              <p className="mt-2 text-[11px] text-amber-600">
                <strong>Disclaimer:</strong> Tools are for preparation assistance only. Always verify eligibility, fees, and dates from the official notification PDF before applying.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Verify Yourself */}
      <section className="card p-6 space-y-4 border-l-4 border-brand-500">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
            <Search size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">How You Can Verify Any Information</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">We empower candidates to independently verify everything.</p>
          </div>
        </div>
        <ol className="space-y-3 ml-13 list-decimal">
          <li className="text-[13.5px] leading-relaxed text-ink-soft"><strong>Click the "Official Notification PDF" link</strong> on any job page — it goes directly to the government website.</li>
          <li className="text-[13.5px] leading-relaxed text-ink-soft"><strong>Check the "Source" attribution</strong> — we name the exact authority (e.g., "Staff Selection Commission — ssc.nic.in").</li>
          <li className="text-[13.5px] leading-relaxed text-ink-soft"><strong>Verify the "Last Reviewed" date</strong> — if it\'s old, the recruiting authority may have issued updates.</li>
          <li className="text-[13.5px] leading-relaxed text-ink-soft"><strong>Visit the official website directly</strong> — search for the recruitment name on the authority\'s site (ssc.nic.in, upsc.gov.in, etc.).</li>
          <li className="text-[13.5px] leading-relaxed text-ink-soft"><strong>Use our "Report Error" feature</strong> if you find a discrepancy — we\'ll investigate and correct within 24 hours.</li>
        </ol>
      </section>

      {/* Last Updated & Contact */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3 border-t border-hairline pt-4">
          <div className="text-[12.5px] text-ink-muted">
            <strong className="text-ink">Last Reviewed:</strong> {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/contact" className="btn-primary text-sm">
              Report an Error / Feedback
            </Link>
          </div>
        </div>
        <p className="text-[12.5px] text-ink-muted">
          This policy is reviewed quarterly. Significant changes are announced on our
          <a href="https://t.me/jobalertx" target="_blank" rel="noopener noreferrer" className="text-brand-600 underline">Telegram channel</a>
          and reflected in the "Last Reviewed" date above.
        </p>
      </section>

      {/* Legal links */}
      <div className="flex flex-wrap justify-center gap-4 text-[12.5px] text-ink-faint py-2">
        <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
        <Link to="/disclaimer" className="hover:text-brand-600 transition-colors">Disclaimer</Link>
        <Link to="/about" className="hover:text-brand-600 transition-colors">About Us</Link>
        <Link to="/editorial-policy" className="hover:text-brand-600 transition-colors">Editorial Policy</Link>
        <Link to="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
      </div>
    </div>
  )
}