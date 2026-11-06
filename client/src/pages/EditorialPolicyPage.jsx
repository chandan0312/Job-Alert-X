import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Users,
  Clock,
  Globe,
  Mail,
  Phone,
  CheckCircle2,
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
} from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const editorialSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Editorial Policy — Job Alert X',
  url: 'https://jobalertx.com/editorial-policy',
  description: 'Job Alert X Editorial Policy — Our commitment to accuracy, independence, transparency, and editorial integrity in government job information. Learn about our content creation process, verification standards, correction policy, and author guidelines.',
  about: 'https://jobalertx.com/about',
  publisher: {
    '@type': 'Organization',
    name: 'Job Alert X',
    url: 'https://jobalertx.com/',
    logo: 'https://jobalertx.com/favicon.svg',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://jobalertx.com/editorial-policy',
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
    { '@type': 'ListItem', position: 3, name: 'Editorial Policy', item: 'https://jobalertx.com/editorial-policy' },
  ],
}

const EDITORIAL_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Accuracy First',
    desc: 'Every fact is verified against the official government notification PDF before publication. We prioritize correctness over speed.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Scale,
    title: 'Editorial Independence',
    desc: 'We are not affiliated with any government body, recruiting authority, coaching institute, or commercial entity. Our content is unbiased.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Eye,
    title: 'Transparency',
    desc: 'We clearly label official sources, distinguish our summaries from government text, and disclose our verification process on every page.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Lock,
    title: 'Accountability',
    desc: 'We maintain a public corrections log, respond to error reports within 24 hours, and update "Last Reviewed" dates on all content.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: BadgeCheck,
    title: 'User-First Focus',
    desc: 'Every guide, FAQ, and breakdown is written for the candidate — not for SEO or ad revenue. We explain complex rules in plain language.',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
  {
    icon: BookMarked,
    title: 'Continuous Improvement',
    desc: 'We regularly audit our content, incorporate user feedback, and update processes to meet evolving government notification standards.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
]

const CONTENT_TYPES = [
  {
    icon: FileCheck,
    title: 'Recruitment Notifications',
    desc: 'Official job postings sourced from government websites, verified against the notification PDF, with original summaries and guides.',
    color: 'text-blue-500',
  },
  {
    icon: BookOpen,
    title: 'Step-by-Step Application Guides',
    desc: 'Original walkthroughs written from candidate perspective — screenshots, form field explanations, payment steps, common errors to avoid.',
    color: 'text-emerald-500',
  },
  {
    icon: Search,
    title: 'Eligibility Breakdowns',
    desc: 'Detailed analysis of age limits, educational qualifications, category relaxations, experience requirements — mapped to official criteria.',
    color: 'text-purple-500',
  },
  {
    icon: RefreshCw,
    title: 'Admit Card / Result Updates',
    desc: 'Timely alerts when authorities release admit cards, results, answer keys, cutoffs — with direct download links to official portals.',
    color: 'text-orange-500',
  },
  {
    icon: Newspaper,
    title: 'Career Guidance Articles',
    desc: 'Original long-form content: exam strategies, syllabus analysis, preparation resources, career path comparisons — written by domain experts.',
    color: 'text-teal-500',
  },
  {
    icon: BadgeCheck,
    title: 'Free Tools & Calculators',
    desc: 'Interactive utilities (age calculator, eligibility checker, fee summary, document checklist) built to solve real candidate problems.',
    color: 'text-rose-500',
  },
]

const VERIFICATION_STEPS = [
  { step: 1, title: 'Source Identification', desc: 'Locate the official notification on the recruiting authority\'s website (e.g., ssc.nic.in, upsc.gov.in, rrbcdg.gov.in, ibps.in, state PSC portals).', icon: Search },
  { step: 2, title: 'PDF Download & Archive', desc: 'Download the official notification PDF and store it in our secured archive for reference and audit trail.', icon: FileCheck },
  { step: 3, title: 'Fact Extraction', desc: 'Extract all critical data: vacancy count, post names, pay scale, age limit (with relaxations), educational qualification, application fee, important dates, selection stages.', icon: BookOpen },
  { step: 4, title: 'Cross-Reference Check', desc: 'Cross-reference extracted data with previous notifications for the same recruitment (if any), official website announcements, and press releases.', icon: RefreshCw },
  { step: 5, title: 'Original Summary Writing', desc: 'Write plain-language summary, FAQ, eligibility guide, and application steps — never copy-paste government legalese. Include "Source: [Official Website Name + URL]" on every page.', icon: Edit3 },
  { step: 6, title: 'Internal Review', desc: 'Second team member verifies all facts against the archived PDF before publication. Checklist includes: vacancy numbers, dates, fees, age limits, qualification codes, official URLs.', icon: BadgeCheck },
  { step: 7, title: 'Publish with Schema', desc: 'Deploy with JobPosting/Article structured data, canonical URLs, "Last Reviewed" timestamp, and official source attribution prominently displayed.', icon: Globe },
  { step: 8, title: 'Ongoing Monitoring', desc: 'Track the recruitment for corrigenda, date extensions, admit card releases, result announcements. Update page and "Last Reviewed" date on every change.', icon: Clock },
]

const CORRECTION_POLICY = [
  { title: 'Error Reporting', desc: 'Anyone can report an error via email (jobalerx365@gmail.com), contact form, or the "Report Error" button on each job page. We acknowledge receipt within 4 hours (Mon–Sat, 9 AM – 8 PM IST).' },
  { title: 'Verification & Correction', desc: 'Reported errors are verified against the archived official PDF. If confirmed, we correct the content within 24 hours and add an entry to the page\'s correction log with date, original text, corrected text, and reporter acknowledgment (if they wish to be named).' },
  { title: 'Correction Types', desc: '• Factual errors (vacancy count, dates, fees, age limits): Corrected immediately with log entry.<br/>• Typographical/formatting errors: Fixed silently if no factual impact.<br/>• Outdated information (post corrigendum): Updated with new "Last Reviewed" date and log entry.<br/>• Source URL changes: Updated to new official URL; old URL noted in log if content changed.' },
  { title: 'Major Corrections', desc: 'If a correction materially changes candidate decisions (e.g., wrong last date, incorrect eligibility), we additionally: (1) Add a prominent banner on the page for 7 days, (2) Post update on Telegram channel, (3) Notify subscribers who bookmarked the job.' },
  { title: 'Transparency Log', desc: 'All corrections are publicly viewable on the individual job/article page under a "Correction History" section. We do not silently delete or overwrite content without trace.' },
]

const AUTHOR_GUIDELINES = [
  { icon: Users, title: 'Expertise Requirement', desc: 'Writers must have direct experience with Indian competitive exams (as aspirants, educators, or analysts). Domain knowledge is verified during onboarding.' },
  { icon: BookOpen, title: 'Source-First Writing', desc: 'Every article begins with the official notification PDF. No writing from memory, third-party summaries, or other websites\' content.' },
  { icon: Eye, title: 'Plain Language Standard', desc: 'Target readability: 10th-grade level. Avoid bureaucratic jargon. Explain terms like "corrigendum," "objection window," "document verification," "provisional answer key" inline.' },
  { icon: Scale, title: 'Neutral Tone', desc: 'No promotional language for coaching institutes, test series, or paid services. No opinions presented as facts. Clearly label analysis/opinion pieces.' },
  { icon: BadgeCheck, title: 'Attribution Discipline', desc: 'Always cite: "Source: [Official Body Name] — [Direct URL to Notification PDF/Page]." Never use "as per notification" without a link.' },
  { icon: Lock, title: 'No Fabrication', desc: 'Never invent vacancy numbers, dates, fees, or eligibility criteria. If information is not in the official PDF, write "Not specified in official notification" — do not guess.' },
  { icon: RefreshCw, title: 'Update Responsibility', desc: 'Authors own their pages for the recruitment lifecycle. They monitor for updates and refresh content when authorities release new information.' },
]

const INDEPENDENCE_PLEDGE = [
  'Job Alert X is an independent, privately operated information portal.',
  'We receive no funding, direction, or editorial influence from any government ministry, recruiting authority, public sector undertaking, or state government.',
  'We do not accept paid placement for job notifications. All recruitment coverage decisions are made solely by our editorial team based on candidate demand and public importance.',
  'We do not promote or endorse any coaching institute, test series platform, study material vendor, or paid preparation service. Any such mentions in user-generated content (comments, feedback) are not endorsements.',
  'Advertising (Google AdSense) is programmatically served and does not influence editorial decisions. Ad units are clearly distinguished from editorial content.',
  'Affiliate relationships (if any future) will be disclosed prominently per ASCI and FTC guidelines. Currently, we have no affiliate partnerships.',
]

export default function EditorialPolicyPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="Editorial Policy — Job Alert X"
        description="Job Alert X Editorial Policy: Our commitment to accuracy, independence, transparency, and editorial integrity in government job information. Content creation process, verification standards, correction policy, and author guidelines."
        canonical="https://jobalertx.com/editorial-policy"
        jsonLd={[editorialSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link to="/about" className="hover:text-brand-600">About Us</Link>
        <span>/</span>
        <span className="text-ink-muted">Editorial Policy</span>
      </nav>

      {/* Hero */}
      <header className="card p-8 text-center space-y-4">
        <div className="flex justify-center">
          <SarkariEmblem size={64} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">Editorial Policy</h1>
        <p className="text-[15px] leading-relaxed text-ink-soft max-w-xl mx-auto">
          Our commitment to accuracy, independence, transparency, and accountability in every piece of government job information we publish.
        </p>
        <div className="flex items-center justify-center gap-4 text-[12px] text-ink-faint flex-wrap pt-2">
          <span className="flex items-center gap-1.5"><BadgeCheck size={13} className="text-emerald-500" /> Verified Standards</span>
          <span className="flex items-center gap-1.5"><Scale size={13} className="text-blue-500" /> Independent</span>
          <span className="flex items-center gap-1.5"><Eye size={13} className="text-purple-500" /> Transparent</span>
          <span className="flex items-center gap-1.5"><Lock size={13} className="text-orange-500" /> Accountable</span>
        </div>
      </header>

      {/* Editorial Pillars */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Our Editorial Pillars</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Six non-negotiable principles that govern every editorial decision at Job Alert X.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EDITORIAL_PILLARS.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
                <Icon size={17} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content Types We Publish */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Content Types We Publish</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Every content type follows our verification workflow and carries source attribution.
          </p>
        </div>
        <div className="space-y-3">
          {CONTENT_TYPES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 ${color}`}>
                <Icon size={17} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8-Step Verification Workflow */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Our 8-Step Verification Workflow</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Every recruitment notification passes through this process before going live.
          </p>
        </div>
        <div className="space-y-3">
          {VERIFICATION_STEPS.map(({ step, title, desc, icon: Icon }) => (
            <div key={step} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 font-bold text-lg">
                {step}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon size={15} className="text-brand-500" />
                  <p className="text-[13.5px] font-bold text-ink">{title}</p>
                </div>
                <p className="mt-1 ml-7 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Correction Policy */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Correction & Update Policy</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            We treat errors seriously. Our correction process is transparent, fast, and publicly logged.
          </p>
        </div>
        <div className="space-y-4">
          {CORRECTION_POLICY.map(({ title, desc }, idx) => (
            <div key={idx} className="rounded-xl border border-hairline bg-subtle/30 p-4">
              <p className="text-[13.5px] font-bold text-ink mb-2">{title}</p>
              <div className="text-[12.5px] leading-relaxed text-ink-muted" dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          ))}
        </div>
        <div className="rounded-xl border-2 border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-[12.5px] font-medium text-amber-800 mb-2 flex items-center gap-2">
            <AlertCircle size={15} /> Report an Error
          </p>
          <p className="text-[12.5px] text-amber-700 mb-3">
            Found a mistake? Email <a href="mailto:jobalerx365@gmail.com" className="underline hover:text-amber-900">jobalerx365@gmail.com</a> or use the
            <Link to="/contact" className="underline hover:text-amber-900 ml-1">Contact Form</Link>.
            We acknowledge within 4 hours and correct verified errors within 24 hours.
          </p>
        </div>
      </section>

      {/* Author Guidelines */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">Author & Contributor Guidelines</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Standards every writer at Job Alert X follows to maintain quality and trust.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AUTHOR_GUIDELINES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-hairline bg-subtle/30 p-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                <Icon size={17} />
              </span>
              <div>
                <p className="text-[13.5px] font-bold text-ink">{title}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Independence Pledge */}
      <section className="card p-6 space-y-4 border-l-4 border-brand-500">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
            <Scale size={20} />
          </span>
          <div>
            <h2 className="text-xl font-bold text-ink">Editorial Independence Pledge</h2>
            <p className="mt-1 text-[13.5px] text-ink-muted">Our commitment to remain free from external influence.</p>
          </div>
        </div>
        <ul className="space-y-3 ml-13">
          {INDEPENDENCE_PLEDGE.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-soft">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-500" />
              {item}
            </li>
          ))}
        </ul>
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
        <Link to="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
      </div>
    </div>
  )
}