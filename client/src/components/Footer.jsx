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
  { label: 'All State PSCs', to: '/exams' },
]

const QUICK_LINKS = [
  { label: 'Latest Jobs', to: '/latest/job', badge: 'Hot' },
  { label: 'Admit Cards', to: '/latest/admit-card' },
  { label: 'Exam Results', to: '/latest/result' },
  { label: 'Answer Keys', to: '/latest/answer-key' },
  { label: 'Syllabus & Pattern', to: '/latest/syllabus' },
  { label: 'All Exam Categories', to: '/exams' },
  { label: 'Job Search Portal', to: '/search' },
]

const COMPANY_LINKS = [
  { label: 'About Us', to: '/exams' },
  { label: 'Feedback & Suggestions', to: '/feedback' },
  { label: 'Help & Contact Support', to: 'mailto:jobalerx365@gmail.com', isExternal: true },
  { label: 'Privacy Policy', to: '/exams' },
  { label: 'Terms of Service', to: '/exams' },
  { label: 'Disclaimer', to: '/exams' },
  { label: 'Admin Portal', to: '/admin' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 pt-2 pb-6">
      {/* Compact Floating Card Design */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#070c1a] shadow-xl text-slate-300">
        {/* Subtle Ambient Glow */}
        <div
          className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-500/10 via-purple-600/10 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-tl from-sky-500/10 via-indigo-500/10 to-transparent blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 p-5 sm:p-6 lg:px-8 lg:py-6">
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* === LEFT BRAND & CONTACT INFO (5 Cols) === */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                {/* Brand Logo & Title */}
                <Link
                  to="/"
                  className="group inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.01]"
                  aria-label="Job Alert X Homepage"
                >
                  <SarkariEmblem size={34} />
                  <div className="flex flex-col">
                    <div className="flex items-center text-[18px] font-black tracking-wider leading-none text-white">
                      <span>JOB</span>
                      <span className="text-orange-400 ml-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                        ALERT
                      </span>
                      <span className="ml-1 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
                        X
                      </span>
                    </div>
                    <span className="mt-0.5 text-[9px] font-bold tracking-[0.14em] uppercase text-slate-400">
                      Govt Job Alerts &amp; Exams Portal
                    </span>
                  </div>
                </Link>

                {/* Brief bio */}
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-400">
                  Instant, 100% verified government job notifications, admit cards, results, and syllabus updates across India.
                </p>

                {/* Compact Contact Pills */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href="mailto:jobalerx365@gmail.com"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-slate-300 hover:border-orange-500/40 hover:text-white transition-colors"
                  >
                    <Mail size={12} className="text-orange-400" />
                    <span>jobalerx365@gmail.com</span>
                  </a>
                  <a
                    href="tel:8789862771"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-slate-300 hover:border-purple-500/40 hover:text-white transition-colors"
                  >
                    <Phone size={12} className="text-purple-400" />
                    <span>+91 8789862771</span>
                  </a>
                </div>
              </div>

              {/* Social Channels Row */}
              <div className="flex items-center gap-1.5 pt-0.5">
                {[
                  { href: 'https://t.me', label: 'Telegram', icon: <Send size={13} /> },
                  { href: 'https://youtube.com', label: 'YouTube', icon: <Youtube size={14} /> },
                  { href: 'https://whatsapp.com', label: 'WhatsApp', icon: <MessageCircle size={13} /> },
                  { href: 'https://twitter.com', label: 'Twitter', icon: <Twitter size={13} /> },
                  { href: 'https://linkedin.com', label: 'LinkedIn', icon: <Linkedin size={13} /> },
                  { href: 'https://github.com', label: 'GitHub', icon: <Github size={13} /> },
                ].map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* === RIGHT 3 COLUMNS OF NAVIGATION LINKS (7 Cols) === */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
              
              {/* Column 1: Exam Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                  Categories
                </h3>
                <ul className="space-y-1.5">
                  {CATEGORY_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="text-xs text-slate-400 hover:text-orange-400 transition-colors inline-block hover:translate-x-0.5"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Quick Links */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  Quick Links
                </h3>
                <ul className="space-y-1.5">
                  {QUICK_LINKS.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-purple-400 transition-colors hover:translate-x-0.5"
                      >
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="rounded px-1 py-0.2 text-[9px] font-bold border bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Company & Help */}
              <div className="col-span-2 sm:col-span-1">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Company &amp; Info
                </h3>
                <ul className="space-y-1.5">
                  {COMPANY_LINKS.map((item) => (
                    <li key={item.label}>
                      {item.isExternal ? (
                        <a
                          href={item.to}
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 transition-colors hover:translate-x-0.5"
                        >
                          <span>{item.label}</span>
                          <ExternalLink size={10} className="opacity-60" />
                        </a>
                      ) : (
                        <Link
                          to={item.to}
                          className="text-xs text-slate-400 hover:text-indigo-300 transition-colors inline-block hover:translate-x-0.5"
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

          {/* === BOTTOM ROW === */}
          <div className="mt-5 pt-3.5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs border-t border-white/[0.08] text-slate-400">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <span>© {currentYear} </span>
              <span className="font-bold text-white">Job Alert X</span>
              <span>. All rights reserved.</span>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-slate-400">
              <Link to="/exams" className="transition-colors hover:text-slate-200">Privacy</Link>
              <span className="text-slate-700">•</span>
              <Link to="/exams" className="transition-colors hover:text-slate-200">Terms</Link>
              <span className="text-slate-700">•</span>
              <Link to="/exams" className="transition-colors hover:text-slate-200">Disclaimer</Link>
              <span className="text-slate-700">•</span>
              <Link to="/feedback" className="transition-colors hover:text-slate-200">Help &amp; Feedback</Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-300">
                <ShieldCheck size={11} className="text-emerald-400" />
                <span>100% Free</span>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-slate-300">
                <CheckCircle2 size={11} className="text-orange-400" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
