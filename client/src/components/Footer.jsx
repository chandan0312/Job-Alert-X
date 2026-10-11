import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Send,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  MessageCircle,
  ExternalLink,
} from 'lucide-react'
import SarkariEmblem from './SarkariEmblem.jsx'

const CATEGORY_LINKS = [
  { label: 'SSC Exams', to: '/category/ssc' },
  { label: 'UPSC & Civil Services', to: '/category/upsc' },
  { label: 'Banking & IBPS', to: '/category/banking' },
  { label: 'Railways (RRB)', to: '/category/railway' },
  { label: 'Defence & Police', to: '/category/defence' },
  { label: 'Teaching & TET', to: '/category/teaching' },
  { label: 'All Exam Categories', to: '/exams' },
]

const QUICK_LINKS = [
  { label: 'Latest Jobs', to: '/latest/job', badge: 'Hot' },
  { label: 'Articles & Career Guides', to: '/articles', badge: 'New' },
  { label: 'Admit Cards', to: '/latest/admit-card' },
  { label: 'Exam Results', to: '/latest/result' },
  { label: 'Answer Keys', to: '/latest/answer-key' },
  { label: 'Syllabus & Pattern', to: '/latest/syllabus' },
  { label: 'All Exam Categories', to: '/exams' },
]

const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Feedback & Suggestions', to: '/feedback' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Disclaimer', to: '/disclaimer' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 pt-2 pb-6">
      {/* Main Footer Card — always dark navy for authority/credibility feel */}
      <div
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl"
        style={{
          background: 'linear-gradient(140deg, var(--brand-dark) 0%, #0c1e2e 50%, #0f2a3a 100%)',
          border: '1px solid rgba(174, 208, 201, 0.12)',
        }}
      >
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full blur-3xl opacity-15"
          style={{ background: 'var(--brand-primary)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-10"
          style={{ background: 'var(--brand-teal)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 p-5 sm:p-6 lg:px-8 lg:py-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">

            {/* === BRAND + CONTACT (5 cols) === */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                {/* Brand */}
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01]"
                  aria-label="Job Alert X Homepage"
                >
                  <SarkariEmblem size={34} />
                  <div className="flex flex-col">
                    <div className="flex items-center text-[18px] font-black tracking-wider leading-none text-white">
                      <span>JOB</span>
                      <span style={{ color: 'var(--brand-flame)' }} className="ml-1">ALERT</span>
                      <span style={{ color: 'var(--brand-teal)' }} className="ml-1">X</span>
                    </div>
                    <span
                      className="mt-0.5 text-[9px] font-bold tracking-[0.14em] uppercase"
                      style={{ color: 'rgba(174, 208, 201, 0.6)' }}
                    >
                      Govt Job Alerts &amp; Exams Portal
                    </span>
                  </div>
                </Link>

                {/* Bio */}
                <p className="mt-3 max-w-sm text-xs leading-relaxed" style={{ color: 'rgba(174,208,201,0.65)' }}>
                  Instant, 100% verified government job notifications, admit cards, results, and syllabus updates across India.
                </p>

                {/* Contact pills */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href="mailto:jobalerx365@gmail.com"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(174,208,201,0.8)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(174,208,201,0.8)' }}
                  >
                    <Mail size={12} style={{ color: 'var(--brand-flame)' }} />
                    <span>jobalerx365@gmail.com</span>
                  </a>
                  <a
                    href="tel:8789862771"
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(174,208,201,0.8)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(27,111,129,0.5)'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(174,208,201,0.8)' }}
                  >
                    <Phone size={12} style={{ color: 'var(--brand-teal)' }} />
                    <span>+91 8789862771</span>
                  </a>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {[
                  { href: 'https://t.me/jobalertx', label: 'Telegram', icon: <Send size={13} /> },
                  { href: 'https://youtube.com/@jobalertx', label: 'YouTube', icon: <Youtube size={14} /> },
                  { href: 'https://whatsapp.com/channel/jobalertx', label: 'WhatsApp', icon: <MessageCircle size={13} /> },
                  { href: 'https://twitter.com/jobalertx', label: 'Twitter / X', icon: <Twitter size={13} /> },
                  { href: 'https://linkedin.com/company/jobalertx', label: 'LinkedIn', icon: <Linkedin size={13} /> },
                ].map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(174,208,201,0.6)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(27,111,129,0.15)'; e.currentTarget.style.color = 'var(--brand-teal)'; e.currentTarget.style.borderColor = 'rgba(174,208,201,0.25)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(174,208,201,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* === NAV LINK COLUMNS (7 cols) === */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--brand-flame)' }} />
                  Categories
                </h3>
                <ul className="space-y-2">
                  {CATEGORY_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-xs transition-colors inline-block hover:translate-x-0.5"
                        style={{ color: 'rgba(174,208,201,0.65)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-flame)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(174,208,201,0.65)' }}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--brand-teal)' }} />
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  {QUICK_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="inline-flex items-center gap-1.5 text-xs transition-colors hover:translate-x-0.5"
                        style={{ color: 'rgba(174,208,201,0.65)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--brand-teal)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(174,208,201,0.65)' }}
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span
                            className="rounded px-1 text-[9px] font-bold"
                            style={{
                              background: 'rgba(249,115,22,0.15)',
                              color: 'var(--brand-flame)',
                              border: '1px solid rgba(249,115,22,0.25)',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'rgba(174,208,201,0.5)' }} />
                  Company
                </h3>
                <ul className="space-y-2">
                  {COMPANY_LINKS.map((item) => (
                    <li key={item.label}>
                      {item.isExternal ? (
                        <a
                          href={item.to}
                          className="inline-flex items-center gap-1 text-xs transition-colors hover:translate-x-0.5"
                          style={{ color: 'rgba(174,208,201,0.65)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(174,208,201,0.65)' }}
                        >
                          <span>{item.label}</span>
                          <ExternalLink size={10} className="opacity-60" />
                        </a>
                      ) : (
                        <Link
                          to={item.to}
                          className="text-xs transition-colors inline-block hover:translate-x-0.5"
                          style={{ color: 'rgba(174,208,201,0.65)' }}
                          onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(174,208,201,0.65)' }}
                        >
                          {item.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* === BOTTOM BAR === */}
          <div
            className="mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)', color: 'rgba(174,208,201,0.5)' }}
          >
            {/* Copyright */}
            <div className="text-center md:text-left">
              <span>© {currentYear} </span>
              <span className="font-bold text-white">Job Alert X</span>
              <span>. All rights reserved.</span>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {['Privacy', 'Terms', 'Disclaimer', 'About', 'Contact'].map((item, i, arr) => (
                <span key={item} className="flex items-center gap-3 sm:gap-4">
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="transition-colors hover:text-white"
                    style={{ color: 'rgba(174,208,201,0.5)' }}
                  >
                    {item}
                  </Link>
                  {i < arr.length - 1 && (
                    <span style={{ color: 'rgba(255,255,255,0.12)' }}>•</span>
                  )}
                </span>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                style={{
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.15)',
                  color: '#6ee7b7',
                }}
              >
                <ShieldCheck size={11} />
                <span>100% Free</span>
              </div>
              <div
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                style={{
                  background: 'rgba(249,115,22,0.08)',
                  border: '1px solid rgba(249,115,22,0.15)',
                  color: '#fbbf24',
                }}
              >
                <CheckCircle2 size={11} />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
