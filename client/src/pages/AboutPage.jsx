import { Link } from 'react-router-dom'
import { ShieldCheck, Users, Clock, Globe, Mail, Phone, CheckCircle2 } from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import SarkariEmblem from '../components/SarkariEmblem.jsx'

const STATS = [
  { icon: Globe, label: 'Exams Covered', value: '50+' },
  { icon: Users, label: 'Daily Visitors', value: '10K+' },
  { icon: CheckCircle2, label: 'Verified Notifications', value: '500+' },
  { icon: Clock, label: 'Updates Per Day', value: '20+' },
]

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Job Alert X',
  url: 'https://jobalertx.com/',
  logo: 'https://jobalertx.com/favicon.svg',
  description:
    'Job Alert X is India\'s free government job notification portal covering SSC, UPSC, Railway, Banking, Defence, Police, Teaching and State PSC recruitment notifications, admit cards, results, answer keys, and syllabus.',
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

export default function AboutPage() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-8">
      <SEOHead
        title="About Us — Job Alert X"
        description="Learn about Job Alert X — India's free government job notification portal. We cover SSC, UPSC, Railway, Banking, Defence, Police, Teaching and State PSC recruitment notifications, admit cards, results and syllabus."
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
          India's free government job notification portal — delivering accurate, timely, and
          verified recruitment information to millions of job seekers across every state.
        </p>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-4 text-center space-y-1">
            <Icon size={22} className="mx-auto text-brand-600" />
            <p className="text-xl font-extrabold text-ink">{value}</p>
            <p className="text-[12px] text-ink-muted">{label}</p>
          </div>
        ))}
      </div>

      {/* Mission */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Our Mission</h2>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          Job Alert X was created with a single mission: to ensure every eligible Indian job seeker
          — regardless of location or resources — has equal, instant access to government job
          notifications. We aggregate, verify, and publish recruitment alerts from Central and State
          Government bodies, making it easier for candidates to find, understand, and apply for
          opportunities across India.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-soft">
          All information published on Job Alert X is sourced directly from official government
          notifications, recruitment authorities, and verified public announcements. We always link
          to the official source so candidates can verify details independently.
        </p>
      </section>

      {/* What we cover */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">What We Cover</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'SSC (CGL, CHSL, MTS, CPO, GD)',
            'UPSC Civil Services & Engineering',
            'Railway / RRB (NTPC, Group D, JE)',
            'Banking (IBPS PO/Clerk, SBI, RBI)',
            'Defence (Army, Navy, Air Force)',
            'Police & Central Armed Forces',
            'Teaching (CTET, TET, NVS, KVS)',
            'State PSC & Public Service Exams',
            'Admit Cards & Hall Tickets',
            'Exam Results & Merit Lists',
            'Answer Keys & Objection Windows',
            'Syllabus & Exam Patterns',
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-[13.5px] text-ink-soft">
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Editorial policy */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Editorial & Content Policy</h2>
        <div className="space-y-3 text-[14px] leading-relaxed text-ink-soft">
          <p>
            <strong className="text-ink">Source Verification:</strong> Every recruitment notification
            is sourced from the official government website or official press release before
            publishing.
          </p>
          <p>
            <strong className="text-ink">Accuracy:</strong> We include all critical details —
            vacancy count, eligibility, important dates, application fee, age limit, and selection
            process — as published in the official notification.
          </p>
          <p>
            <strong className="text-ink">Updates:</strong> Pages are updated whenever the
            recruitment authority releases corrigenda, new dates, admit cards, results, or answer
            keys related to the same post.
          </p>
          <p>
            <strong className="text-ink">Corrections:</strong> If you find an error, please{' '}
            <Link to="/contact" className="text-brand-600 underline">contact us</Link>. We correct
            factual errors within 24 hours of being notified.
          </p>
          <p>
            <strong className="text-ink">Independence:</strong> Job Alert X is an independent
            information portal. We are not affiliated with any government body, recruiting
            authority, or coaching institute. We do not charge candidates any fee for accessing
            job information.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-bold text-ink">Contact Us</h2>
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

      {/* Trust */}
      <div className="flex items-center justify-center gap-6 text-[12px] text-ink-faint flex-wrap py-2">
        <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-500" /> 100% Free</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-orange-500" /> Verified Info</span>
        <span className="flex items-center gap-1.5"><Globe size={13} className="text-blue-500" /> All India Coverage</span>
      </div>
    </div>
  )
}
