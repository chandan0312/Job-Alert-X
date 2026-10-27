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
} from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Job Alert X',
  url: 'https://jobalertx.com/',
  logo: 'https://jobalertx.com/favicon.svg',
  description:
    "Job Alert X is India's free government job notification portal covering SSC, UPSC, Railway, Banking, Defence, Police, Teaching and State PSC recruitment notifications, admit cards, results, answer keys, and syllabus.",
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'jobalerx365@gmail.com',
    telephone: '+91-8789862771',
    contactType: 'customer support',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://t.me/jobalertx',
    'https://youtube.com/@jobalertx',
    'https://twitter.com/jobalertx',
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobalertx.com/' },
    { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://jobalertx.com/about' },
  ],
}

const HOW_WE_WORK = [
  {
    icon: Search,
    title: 'Source from Official Channels',
    desc: 'Every notification is sourced directly from official government websites, official gazette notifications, or verified press releases — never from third-party rumour sites.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: FileCheck,
    title: 'Verify All Details',
    desc: 'Our editorial team cross-checks vacancy counts, eligibility criteria, important dates, application fees, and age limits against the official notification PDF before publishing.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: BookOpen,
    title: 'Write Original Guides',
    desc: 'We write original, plain-language summaries, step-by-step application guides, and FAQ sections so candidates understand the recruitment — not just see raw data.',
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
  },
  {
    icon: RefreshCw,
    title: 'Update on Changes',
    desc: 'When a recruiting authority issues a corrigendum, extends dates, or releases new documents, we update the page immediately and mark the "Last Reviewed" date.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
  {
    icon: AlertCircle,
    title: 'Correct Errors Fast',
    desc: 'If you find any error on our site, you can report it via email or contact form. We aim to review and correct factual errors within 24 hours of being notified.',
    color: 'text-red-500',
    bg: 'bg-red-500/10',
  },
  {
    icon: MessageSquare,
    title: 'Listen to Our Readers',
    desc: 'User feedback drives our improvements. We regularly review suggestions, error reports, and requests to prioritise which job categories and guides to cover next.',
    color: 'text-teal-500',
    bg: 'bg-teal-500/10',
  },
]

const CATEGORIES_COVERED = [
  'SSC (CGL, CHSL, MTS, CPO, GD)',
  'UPSC Civil Services & Engineering',
  'Railway / RRB (NTPC, Group D, JE)',
  'Banking (IBPS PO/Clerk, SBI, RBI)',
  'Defence (Army, Navy, Air Force)',
  'Police & Central Armed Forces',
  'Teaching (CTET, TET, NVS, KVS)',
  'State PSC & Public Service Exams',
  'JPSC & JSSC Recruitment',
  'Admit Cards & Hall Tickets',
  'Exam Results & Merit Lists',
  'Answer Keys & Objection Windows',
  'Syllabus & Exam Patterns',
  'Rojgar Mela & State Camps',
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="About Us — Job Alert X"
        description="Learn about Job Alert X — India's free government job notification portal. We cover SSC, UPSC, Railway, Banking, Defence, Police, Teaching and State PSC recruitment notifications, admit cards, results and syllabus. Read about our editorial process, verification standards, and team."
        canonical="https://jobalertx.com/about"
        jsonLd={[aboutSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-[12.5px] text-ink-faint flex-wrap">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <span className="text-ink-muted">About Us</span>
      </nav>

      {/* Hero */}
      <header className="card p-8 text-center space-y-4">
        <div className="flex justify-center">
          <SarkariEmblem size={64} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">About Job Alert X</h1>
        <p className="text-[15px] leading-relaxed text-ink-soft max-w-xl mx-auto">
          India's free, independent government job notification portal — delivering accurate,
          timely, and verified recruitment information to job seekers across every state.
        </p>
        <div className="flex items-center justify-center gap-6 text-[12px] text-ink-faint flex-wrap pt-2">
          <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> 100% Free</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-orange-500" /> Verified Info</span>
          <span className="flex items-center gap-1.5"><Globe size={13} className="text-blue-500" /> All India Coverage</span>
          <span className="flex items-center gap-1.5"><Clock size={13} className="text-purple-500" /> Updated Daily</span>
        </div>
      </header>

      {/* Mission */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Our Mission</h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Job Alert X was built with one purpose: to ensure every eligible Indian job seeker —
          regardless of location, internet access, or resources — has equal, instant access to
          government job notifications. We aggregate, verify, and explain recruitment alerts from
          Central and State Government bodies, making it easier for candidates to find, understand,
          and apply for opportunities across India.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Unlike many aggregator sites, we do not simply copy-paste official notifications. We write
          original summaries, step-by-step application guides, FAQs, and eligibility breakdowns in
          plain language — so that even a first-time applicant can navigate the process confidently.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          All information published on Job Alert X is sourced directly from official government
          notifications and recruitment authorities. We always link to the official source so
          candidates can independently verify details before applying.
        </p>
      </section>

      {/* How We Work — Editorial Process */}
      <section className="card p-6 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-ink">How We Work — Our Editorial Process</h2>
          <p className="mt-1 text-[13.5px] text-ink-muted">
            Every page on Job Alert X follows a strict editorial workflow before it goes live.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {HOW_WE_WORK.map(({ icon: Icon, title, desc, color, bg }) => (
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

      {/* What we cover */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">What We Cover</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CATEGORIES_COVERED.map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Editorial Policy */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Editorial & Content Policy</h2>
        <div className="space-y-3 text-[14px] leading-relaxed text-ink-soft">
          <p>
            <strong className="text-ink">Source Verification:</strong> Every recruitment notification
            is sourced from the official government website or official press release before publishing.
            We do not publish unverified rumours or unofficial "expected" notifications.
          </p>
          <p>
            <strong className="text-ink">Accuracy:</strong> We include all critical details —
            vacancy count, eligibility, important dates, application fee, age limit, and selection
            process — as published in the official notification.
          </p>
          <p>
            <strong className="text-ink">Original Writing:</strong> All summaries, guides, FAQs, and
            eligibility breakdowns on Job Alert X are original content written by our editorial team.
            We do not republish official PDFs verbatim — we translate complex government language into
            clear, actionable guidance for candidates.
          </p>
          <p>
            <strong className="text-ink">Updates:</strong> Pages are updated whenever the recruitment
            authority releases corrigenda, new dates, admit cards, results, or answer keys related to
            the same post. The "Last Reviewed" date on each page reflects when we last verified the
            information.
          </p>
          <p>
            <strong className="text-ink">Corrections:</strong> If you find an error, please{' '}
            <Link to="/contact" className="text-brand-600 underline">contact us</Link>. We review and
            correct factual errors within 24 hours of being notified.
          </p>
          <p>
            <strong className="text-ink">Independence:</strong> Job Alert X is an independent
            information portal. We are not affiliated with any government body, recruiting authority,
            or coaching institute. We do not charge candidates any fee for accessing job information.
          </p>
        </div>
      </section>

      {/* Who We Are / Team */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Who We Are</h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Job Alert X is operated by a small, dedicated team of recruitment analysts and writers
          based in India who are passionate about helping job seekers navigate the competitive
          government job landscape. Our team members have personal experience preparing for and
          appearing in competitive government examinations, which informs how we write guides —
          practical, detailed, and candidate-first.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          We launched Job Alert X to solve a problem we experienced ourselves: official recruitment
          notifications are often dense, difficult to navigate, and scattered across dozens of different
          government portals. Our mission is to be the single, reliable source a candidate can trust
          to get accurate, complete information on any government job — without paying a subscription
          or signing up for coaching.
        </p>
      </section>

      {/* Social & Community */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Stay Connected</h2>
        <p className="text-[13.5px] text-ink-soft">
          Follow Job Alert X on our official channels to receive instant notifications whenever a new
          recruitment, admit card, result, or answer key is published.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://t.me/jobalertx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Send size={15} className="text-sky-500" />
            Telegram Channel
          </a>
          <a
            href="https://youtube.com/@jobalertx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Youtube size={15} className="text-red-500" />
            YouTube
          </a>
          <a
            href="https://twitter.com/jobalertx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-semibold text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Newspaper size={15} className="text-ink-muted" />
            X / Twitter
          </a>
        </div>
      </section>

      {/* Contact */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Contact Us</h2>
        <p className="text-[13.5px] text-ink-soft">
          Have a question, found an error, or want to suggest a notification we should cover?
          We respond within 24 hours (Mon–Sat, 9 AM – 8 PM IST).
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:jobalerx365@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Mail size={16} className="text-brand-600" />
            jobalerx365@gmail.com
          </a>
          <a
            href="tel:+918789862771"
            className="inline-flex items-center gap-2 rounded-xl border border-hairline bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink hover:border-brand-500/40 transition-colors"
          >
            <Phone size={16} className="text-purple-500" />
            +91 8789862771
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white hover:brightness-110 transition-all"
          >
            Send a Message
          </Link>
        </div>
      </section>

      {/* Legal links */}
      <div className="flex flex-wrap justify-center gap-4 text-[12.5px] text-ink-faint py-2">
        <Link to="/privacy" className="hover:text-brand-600 transition-colors">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-brand-600 transition-colors">Terms of Service</Link>
        <Link to="/disclaimer" className="hover:text-brand-600 transition-colors">Disclaimer</Link>
        <Link to="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
      </div>
    </div>
  )
}
