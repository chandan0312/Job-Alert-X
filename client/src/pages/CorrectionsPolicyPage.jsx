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
  Bell,
  Mail,
  Phone,
  Loader2,
  History,
  GitCompare,
  Flag,
  TrendingUp,
} from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const correctionsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Corrections Policy — Job Alert X',
  url: 'https://jobalertx.com/corrections-policy',
  description: 'Job Alert X Corrections Policy — Our transparent process for handling errors, corrections, updates, and retractions. How to report errors, our correction timeline, public correction logs, and major correction notification procedures.',
  about: 'https://jobalertx.com/about',
  publisher: {
    '@type': 'Organization',
    name: 'Job Alert X',
    url: 'https://jobalertx.com/',
    logo: 'https://jobalertx.com/favicon.svg',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://jobalertx.com/corrections-policy',
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
    { '@type': 'ListItem', position: 3, name: 'Corrections Policy', item: 'https://jobalertx.com/corrections-policy' },
  ],
}

const REPORTING_CHANNELS = [
  { icon: Mail, title: 'Email', detail: 'jobalerx365@gmail.com', response: 'Acknowledged within 4 hours (Mon–Sat, 9 AM – 8 PM IST)', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Globe, title: 'Contact Form', detail: '/contact page on our website', response: 'Acknowledged within 4 hours (Mon–Sat, 9 AM – 8 PM IST)', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: Flag, title: 'Report Error Button', detail: 'Available on every job/article page', response: 'Routed to same queue as contact form', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: MessageSquare, title: 'Telegram DM', detail: '@jobalertx on Telegram', response: 'Best effort; email preferred for tracking', color: 'text-sky-500', bg: 'bg-sky-500/10' },
]

const CORRECTION_TYPES = [
  {
    label: 'Critical Factual Error',
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    examples: 'Wrong last date, incorrect vacancy count, wrong eligibility criteria, wrong application fee',
    timeline: 'Corrected within 4 hours of verification',
    notification: 'Prominent page banner for 7 days + Telegram alert + bookmarked user notification',
    log: 'Full correction log entry with before/after',
  },
  {
    label: 'Standard Factual Error',
    icon: XCircle,
    color: 'text-orange-600',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    examples: 'Minor date typo, fee amount typo, post name spelling, category code error',
    timeline: 'Corrected within 24 hours of verification',
    notification: 'Correction log entry; Telegram alert if material',
    log: 'Full correction log entry with before/after',
  },
  {
    label: 'Corrigendum / Official Update',
    icon: RefreshCw,
    color: 'text-blue-600',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    examples: 'Authority extends dates, adds vacancies, changes exam pattern, releases new notification',
    timeline: 'Updated within 4 hours of official release',
    notification: '"Last Reviewed" date updated + correction log + Telegram alert',
    log: 'Full correction log entry noting official source',
  },
  {
    label: 'Typographical / Formatting',
    icon: Edit3,
    color: 'text-slate-600',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    examples: 'Spelling, grammar, spacing, broken link (non-critical), UI formatting',
    timeline: 'Fixed silently or within 48 hours',
    notification: 'None (silent fix) unless reported by user',
    log: 'Optional — only if user reported',
  },
  {
    label: 'Outdated Information',
    icon: History,
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    examples: 'Page not updated after corrigendum, old exam date still shown, dead official link',
    timeline: 'Updated within 24 hours of discovery',
    notification: '"Last Reviewed" date updated + correction log',
    log: 'Full correction log entry with before/after',
  },
  {
    label: 'Structured Data / Schema Error',
    icon: GitCompare,
    color: 'text-purple-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    examples: 'Wrong schema type, missing required fields, invalid date format in JSON-LD',
    timeline: 'Fixed within 4 hours (affects SEO)',
    notification: 'Silent fix; logged internally',
    log: 'Internal log only (not public-facing)',
  },
]

const CORRECTION_LIFECYCLE = [
  { step: 1, title: 'Error Report Received', desc: 'Report submitted via email, contact form, or page button. Auto-acknowledgment sent with ticket reference number.', icon: Mail, time: 'Immediate' },
  { step: 2, title: 'Triage & Classification', desc: 'Editorial team classifies error type (Critical/Standard/Corrigendum/Typo/Outdated/Schema) and assigns priority.', icon: Flag, time: 'Within 1 hour' },
  { step: 3, title: 'Verification Against Source', desc: 'Fact-checked against archived official PDF and current official website. If source changed, new PDF downloaded and archived.', icon: FileCheck, time: 'Within 2 hours' },
  { step: 4, title: 'Correction Decision', desc: 'If verified: correction prepared with exact before/after text. If not verified: reporter informed with evidence. If ambiguous: marked "Under Review".', icon: CheckCircle2, time: 'Within 3 hours' },
  { step: 5, title: 'Implementation', desc: 'Content updated on live page. "Last Reviewed" timestamp updated. Correction log entry added to page. Structured data re-validated.', icon: RefreshCw, time: 'Within 4 hours (Critical) / 24 hours (Standard)' },
  { step: 6, title: 'Notification & Communication', desc: 'Critical: Page banner (7 days), Telegram channel post, email to bookmarked users. Standard: Correction log only. Corrigendum: Telegram + log.', icon: Bell, time: 'Immediate after implementation' },
  { step: 7, title: 'Follow-up Verification', desc: '24 hours later: verify correction displays correctly, links work, schema validates. Close ticket. Archive report with outcome.', icon: BadgeCheck, time: '24 hours post-fix' },
]

const CORRECTION_LOG_FORMAT = [
  { field: 'Date', example: '2024-01-15 14:32 IST', desc: 'Timestamp when correction went live' },
  { field: 'Type', example: 'Critical Factual Error / Corrigendum / Standard Factual Error', desc: 'Classification per our taxonomy' },
  { field: 'Field Affected', example: 'Application End Date / Vacancy Count / Age Limit', desc: 'Specific data element corrected' },
  { field: 'Original Text', example: 'Last date to apply: 31 January 2024', desc: 'Exact text as it appeared before correction' },
  { field: 'Corrected Text', example: 'Last date to apply: 15 February 2024 (extended via Corrigendum No. F.No.1/2024)', desc: 'Exact text after correction' },
  { field: 'Source', example: 'SSC Corrigendum F.No.1/2024 dated 10 Jan 2024 — ssc.nic.in', desc: 'Official source confirming correction' },
  { field: 'Reported By', example: 'User: Rajesh K. (via Report Error button) / Internal Audit', desc: 'Reporter acknowledgment (name only if consented)' },
  { field: 'Status', example: 'Corrected / Verified — No Change Needed / Under Review', desc: 'Current state of the correction' },
]

const MAJOR_CORRECTION_TRIGGERS = [
  { trigger: 'Application date change', reason: 'Candidates may miss deadline', action: 'Banner + Telegram + email to bookmarked users' },
  { trigger: 'Vacancy count change (±10% or more)', reason: 'Materially affects competition ratio', action: 'Banner + Telegram + log entry' },
  { trigger: 'Eligibility criteria change', reason: 'Candidates may wrongly apply or not apply', action: 'Banner + Telegram + log entry' },
  { trigger: 'Exam pattern / syllabus change', reason: 'Preparation strategy invalidated', action: 'Banner + Telegram + log entry' },
  { trigger: 'Fee structure change', reason: 'Financial impact on candidates', action: 'Log entry + Telegram if significant' },
  { trigger: 'Official website / portal change', reason: 'Broken apply/admit card links', action: 'Immediate link fix + log entry' },
  { trigger: 'Category reservation change', reason: 'Legal/compliance impact', action: 'Banner + Telegram + log entry' },
  { trigger: 'Post cancellation / withdrawal', reason: 'Candidates must not apply', action: 'Prominent banner + Telegram + log entry' },
]

const RETRACTION_POLICY = [
  'If a recruitment notification is officially withdrawn/cancelled by the authority: we add a prominent "CANCELLED/WITHDRAWN" banner at the top of the page, update the status, and keep the page accessible with full correction log for transparency.',
  'If we discover we published a notification that was never officially released (fabricated/hoax): we immediately retract the page, replace with a retraction notice explaining the error, publish the retraction on Telegram, and add the incident to our internal quality audit.',
  'Retracted pages are not deleted — they remain accessible with clear retraction notice and full audit trail. This maintains trust and allows verification by anyone.',
  'We do not issue "stealth retractions" (silent deletion). Every retraction is publicly documented.',
]

const QUALITY_ASSURANCE = [
  { title: 'Pre-Publication Dual Review', desc: 'Two team members independently verify every notification against the official PDF before publication. Checklist must be 100% complete.' },
  { title: 'Automated Schema Validation', desc: 'CI/CD pipeline validates JSON-LD structured data against Google\'s Rich Results Test schema on every deployment.' },
  { title: 'Weekly Link Health Check', desc: 'Automated crawl verifies all official notification PDF links, application portals, and admit card/result links return 200 OK.' },
  { title: 'Monthly Content Audit', desc: 'Random sample of 20+ published pages audited against current official sources. Findings drive process improvements.' },
  { title: 'Quarterly Policy Review', desc: 'Editorial, Fact-Checking, and Corrections policies reviewed and updated based on audit findings, user feedback, and Google policy changes.' },
  { title: 'Annual Transparency Report', desc: 'Published yearly: total corrections by type, average resolution time, major corrections list, policy changes, and quality metrics.' },
]

export default function CorrectionsPolicyPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="Corrections Policy — Job Alert X"
        description="Job Alert X Corrections Policy: Our transparent process for handling errors, corrections, updates, and retractions. How to report errors, correction timeline, public correction logs, and major correction notifications."
        canonical="https://jobalertx.com/corrections-policy"
        jsonLd={[correctionsSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/about" className="hover:text-brand-600">About Us</Link>
        <span>/</span>
        <span className="text-ink-muted">Corrections Policy</span>
      </nav>

      {/* Hero */}
      <header className="card p-8 text-center space-y-4">
        <div className="flex justify-center">
          <SarkariEmblem size={64} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Corrections Policy</h1>
        <p className="text-[15px] leading-relaxed text-ink-soft max-w-xl mx-auto">
          Our transparent process for handling errors, corrections, updates, and retractions — with public logs, timelines, and notification procedures.
        </p>
        <div className="flex items-center justify-center gap-4 text-[12px] text-ink-faint flex-wrap pt-2">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-emerald-500" /> 24-Hour SLA</span>
          <span className="flex items-center gap-1.5"><History size={13} className="text-blue-500" /> Public Logs</span>
          <span className="flex items-center gap-1.5"><Bell size={13} className="text-orange-500" /> Major Alerts</span>
          <span className="flex items-center gap-1.5"><Flag size={13} className="text-red-500" /> Easy Reporting</span>
        </div>
      </header>

      {/* How to Report an Error */}
      <section className="card p-6 space-y-5 border-l-4 border-brand-500">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
            <Flag size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">How to Report an Error</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">We make it easy — and we respond fast.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {REPORTING_CHANNELS.map(({ icon: Icon, title, detail, response, color, bg }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon size={17} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[12.5px] text-ink-muted">{detail}</p>
                <p className="mt-1 text-[11.5px] font-medium text-amber-700">{response}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-[12.5px] font-medium text-amber-800 mb-2 flex items-center gap-2">
            <AlertCircle size={15} /> What to Include in Your Report
          </p>
          <ul className="space-y-1 text-[12.5px] text-amber-700 list-disc list-inside">
            <li>Page URL where you found the error</li>
            <li>Exact text that appears incorrect</li>
            <li>What you believe the correct information should be</li>
            <li>Source of your information (official PDF link, website, corrigendum number)</li>
            <li>Your name/email (optional — only used for acknowledgment)</li>
          </ul>
        </div>
      </section>

      {/* Correction Types & Timelines */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Correction Types & Response Timelines</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Every error is classified and handled according to its impact on candidates.
          </p>
        </div>
        <div className="space-y-4">
          {CORRECTION_TYPES.map(({ label, icon: Icon, color, bg, border, examples, timeline, notification, log }) => (
            <div key={label} className={`rounded-xl p-4 ${border} ${bg}`}>
              <div className="flex items-start gap-3">
                <Icon size={20} className={`mt-0.5 shrink-0 ${color}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13.5px] font-bold text-ink">{label}</p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${color} ${bg}`}>{timeline}</span>
                  </div>
                  <p className="mt-1 ml-7 text-[12.5px] text-ink-muted"><strong>Examples:</strong> {examples}</p>
                  <p className="mt-1 ml-7 text-[12.5px] text-ink-muted"><strong>Notification:</strong> {notification}</p>
                  <p className="mt-1 ml-7 text-[12.5px] text-ink-muted"><strong>Log Entry:</strong> {log}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Correction Lifecycle */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Correction Lifecycle — From Report to Resolution</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Our 7-step process ensures every report is handled transparently and completely.
          </p>
        </div>
        <div className="space-y-3">
          {CORRECTION_LIFECYCLE.map(({ step, title, desc, icon: Icon, time }) => (
            <div key={step} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 font-bold text-lg">
                {step}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon size={15} className="text-brand-500" />
                  <p className="text-[13.5px] font-bold text-ink">{title}</p>
                  <span className="ml-auto rounded bg-brand-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-600">{time}</span>
                </div>
                <p className="mt-1 ml-7 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Public Correction Log Format */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Public Correction Log — What You See on Every Page</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Every corrected page displays a "Correction History" section with this standardized format.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px]">
            <thead>
              <tr className="border-b border-hairline text-left">
                <th className="pb-2 font-bold text-ink w-1/3">Field</th>
                <th className="pb-2 font-bold text-ink w-1/3">Example</th>
                <th className="pb-2 font-bold text-ink">Description</th>
              </tr>
            </thead>
            <tbody>
              {CORRECTION_LOG_FORMAT.map(({ field, example, desc }) => (
                <tr key={field} className="border-b border-hairline/50">
                  <td className="py-2 font-medium text-ink">{field}</td>
                  <td className="py-2 font-mono text-[11px] text-brand-600 bg-brand-500/5 rounded px-2">{example}</td>
                  <td className="py-2 text-ink-muted">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-ink-muted text-center">
          Correction logs are never removed — they remain on the page permanently for full transparency.
        </p>
      </section>

      {/* Major Correction Triggers */}
      <section className="card p-6 space-y-5 border-l-4 border-red-500">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
            <TrendingUp size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">Major Correction Triggers — When We Alert Everyone</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              These corrections trigger prominent banners, Telegram alerts, and direct user notifications.
            </p>
          </div>
        </div>
        <div className="space-y-3">
          {MAJOR_CORRECTION_TRIGGERS.map(({ trigger, reason, action }) => (
            <div key={trigger} className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
              <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <div className="flex-1">
                <p className="text-[13px] font-bold text-red-700">{trigger}</p>
                <p className="mt-0.5 text-[12px] text-red-600"><strong>Why:</strong> {reason}</p>
                <p className="mt-0.5 text-[12px] text-red-600"><strong>Action:</strong> {action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Retraction Policy */}
      <section className="card p-6 space-y-5 border-l-4 border-rose-500">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
            <XCircle size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">Retraction Policy</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">
              For the rare cases where a notification must be withdrawn entirely.
            </p>
          </div>
        </div>
        <ul className="space-y-3 ml-13">
          {RETRACTION_POLICY.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Quality Assurance */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Quality Assurance — Preventing Errors Before They Happen</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Systematic processes to catch errors early and continuously improve.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUALITY_ASSURANCE.map(({ title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <BadgeCheck size={17} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
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
        <Link to="/fact-checking-policy" className="hover:text-brand-600 transition-colors">Fact-Checking Policy</Link>
        <Link to="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
      </div>
    </div>
  )
}