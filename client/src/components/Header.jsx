import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu,
  Sun,
  MoonStar,
  MessageSquarePlus,
  User,
  Flame,
  ArrowRight,
  BookOpen,
  Search,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getTickerJobs } from '../services/api.js'
import SarkariEmblem from './SarkariEmblem.jsx'
import TextLoop from '@/components/ui/text-loop'

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [ref, onOutside])
}

export default function Header({ onMenuClick = () => {} }) {
  const { isDark, toggleTheme } = useTheme()
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  const [userOpen, setUserOpen] = useState(false)
  const [tickerItems, setTickerItems] = useState([])
  const userRef = useRef(null)

  useClickOutside(userRef, () => setUserOpen(false))

  useEffect(() => {
    let active = true
    getTickerJobs()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) setTickerItems(data)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <header
      className="header-light fixed top-0 left-0 right-0 z-50 h-[72px]"
      role="banner"
    >
      <div className="mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-3 px-3 sm:px-5">

        {/* === LEFT: BRAND === */}
        <div className="flex shrink-0 items-center gap-2.5">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-2)] transition-colors hover:bg-[var(--brand-primary)] hover:text-white hover:border-transparent lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="group/brand flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.015]"
            aria-label="Job Alert X — Home"
          >
            <SarkariEmblem size={42} />

            <div className="flex flex-col">
              <div className="flex items-center text-lg sm:text-xl font-black tracking-wider leading-none">
                <span style={{ color: 'var(--text)' }}>JOB</span>
                <span
                  className="ml-1.5"
                  style={{ color: 'var(--brand-flame)' }}
                >
                  ALERT
                </span>
                <span
                  className="ml-1"
                  style={{ color: 'var(--brand-primary)' }}
                >
                  X
                </span>
              </div>
              <div className="mt-1 flex items-center h-[18px]">
                <span className="sr-only">
                  Latest Govt Jobs, Sarkari Results, Exams, Admit Cards, Answer Keys &amp; Alerts | सरकारी नौकरी
                </span>
                <TextLoop
                  staticText="Govt"
                  rotatingTexts={[
                    'Jobs & Alerts',
                    'सरकारी नौकरी',
                    'Exams & Results',
                    'भर्ती व परिणाम',
                    'Admit Cards',
                  ]}
                  interval={2500}
                  className="text-[10.5px] sm:text-xs font-bold tracking-wider leading-none"
                  staticTextClassName="text-slate-600 dark:text-slate-300 font-bold mr-1.5 leading-none"
                  rotatingTextClassName="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-400 dark:from-orange-400 dark:via-amber-300 dark:to-yellow-400 bg-clip-text text-transparent font-extrabold leading-none"
                  backgroundClassName="hidden"
                  cursorClassName="w-[1.5px] bg-orange-500 dark:bg-orange-400 h-[1em]"
                />
              </div>
            </div>
          </Link>
        </div>

        {/* === CENTER: LIVE TICKER === */}
        <div className="hidden min-w-0 flex-1 items-center md:flex px-4 lg:px-6">
          <div
            className="relative flex h-10 w-full items-center overflow-hidden rounded-full pl-1.5 pr-4"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Flame badge */}
            <div
              className="relative z-10 flex shrink-0 h-7 w-7 items-center justify-center rounded-full text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)' }}
              aria-hidden="true"
            >
              <Flame size={15} className="animate-pulse" />
            </div>

            {/* Left fade */}
            <div
              className="pointer-events-none absolute left-9 top-0 bottom-0 z-10 w-5"
              style={{ background: 'linear-gradient(to right, var(--surface-2), transparent)' }}
              aria-hidden="true"
            />

            {/* Ticker track */}
            <div className="flex overflow-hidden w-full cursor-pointer select-none">
              <div className="animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none flex items-center gap-6 py-1">
                {/* Pass 1 */}
                {tickerItems.map((item, idx) => {
                  const badge = item.badge || item.orgShort || item.category?.toUpperCase() || 'LIVE'
                  const highlight = item.highlight || (item.vacancies ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts` : 'Apply Now')
                  return (
                    <Link
                      key={`t1-${item.id || idx}`}
                      to={`/job/${item.id}`}
                      className="group/item flex shrink-0 items-center gap-2 text-xs transition-colors"
                      style={{ color: 'var(--text-2)' }}
                    >
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          color: 'var(--brand-flame)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                        }}
                      >
                        {badge}
                      </span>
                      <span
                        className="font-semibold group-hover/item:underline underline-offset-2 transition-colors group-hover/item:text-[color:var(--brand-flame)]"
                      >
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold" style={{ color: 'var(--brand-primary)' }}>
                        [{highlight}]
                        <ArrowRight size={11} className="transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mx-1.5" style={{ color: 'var(--border-strong)' }} aria-hidden="true">•</span>
                    </Link>
                  )
                })}
                {/* Pass 2 (seamless loop) */}
                {tickerItems.map((item, idx) => {
                  const badge = item.badge || item.orgShort || item.category?.toUpperCase() || 'LIVE'
                  const highlight = item.highlight || (item.vacancies ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts` : 'Apply Now')
                  return (
                    <Link
                      key={`t2-${item.id || idx}`}
                      to={`/job/${item.id}`}
                      className="group/item flex shrink-0 items-center gap-2 text-xs transition-colors"
                      style={{ color: 'var(--text-2)' }}
                    >
                      <span
                        className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          color: 'var(--brand-flame)',
                          border: '1px solid rgba(249, 115, 22, 0.2)',
                        }}
                      >
                        {badge}
                      </span>
                      <span className="font-semibold group-hover/item:underline underline-offset-2 transition-colors group-hover/item:text-[color:var(--brand-flame)]">
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold" style={{ color: 'var(--brand-primary)' }}>
                        [{highlight}]
                        <ArrowRight size={11} className="transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="mx-1.5" style={{ color: 'var(--border-strong)' }} aria-hidden="true">•</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT: UTILITIES === */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* Articles */}
          <Link
            to="/articles"
            className="group flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
            }}
            title="Career Articles & Exam Guides"
          >
            <BookOpen
              size={16}
              className="transition-colors"
              style={{ color: 'var(--brand-primary)' }}
            />
            <span className="hidden font-bold md:inline" style={{ color: 'var(--text)' }}>Guides</span>
          </Link>

          {/* Search */}
          <Link
            to="/search"
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
            }}
            aria-label="Search jobs"
            title="Search"
          >
            <Search size={16} />
          </Link>

          {/* Feedback */}
          <Link
            to="/feedback"
            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:border-[color:var(--brand-flame)] hover:text-[color:var(--brand-flame)]"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
            aria-label="Send Feedback"
            title="Feedback"
          >
            <MessageSquarePlus size={16} />
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-all"
            style={{
              background: 'var(--surface-2)',
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
            }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun size={16} style={{ color: 'var(--brand-gold)' }} />
              : <MoonStar size={16} style={{ color: 'var(--brand-primary)' }} />
            }
          </button>

          {/* User Account */}
          <div ref={userRef} className="relative">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setUserOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white transition-all hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
                  boxShadow: '0 2px 12px rgba(27, 111, 129, 0.30)',
                }}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <User size={15} />
                )}
                <span className="hidden max-w-[80px] truncate sm:inline">{user?.name?.split(' ')[0] || 'Account'}</span>
                <ChevronDown size={13} className={`transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-white transition-all hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #f59e0b)',
                  boxShadow: '0 2px 12px rgba(249, 115, 22, 0.28)',
                }}
              >
                <User size={15} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Dropdown */}
            {userOpen && isAuthenticated && (
              <div
                className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl p-1.5 shadow-2xl z-50 animate-fade-in"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                {/* User info */}
                <div className="px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text)' }}>{user?.name || 'User'}</p>
                    <span
                      className="rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
                      style={{
                        background: 'rgba(27, 111, 129, 0.12)',
                        color: 'var(--brand-primary)',
                        border: '1px solid rgba(27, 111, 129, 0.2)',
                      }}
                    >
                      {user?.role || 'Member'}
                    </span>
                  </div>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
                </div>
                <div className="my-1 h-px" style={{ background: 'var(--border)' }} />
                {[
                  { to: '/profile', label: 'Your Profile' },
                  { to: '/bookmarked', label: 'Bookmarked Jobs' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    rel="nofollow"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center rounded-lg px-3 py-2 text-[13px] font-medium transition-colors"
                    style={{ color: 'var(--text-2)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-2)' }}
                  >
                    {label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    rel="nofollow"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors"
                    style={{ color: 'var(--brand-flame)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249, 115, 22, 0.08)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '' }}
                  >
                    <span>Admin Control Panel</span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: 'var(--brand-flame)', boxShadow: '0 0 6px var(--brand-flame)' }}
                    />
                  </Link>
                )}
                <div className="my-1 h-px" style={{ background: 'var(--border)' }} />
                <button
                  type="button"
                  onClick={() => { setUserOpen(false); logout() }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors"
                  style={{ color: 'var(--danger)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--danger-bg)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '' }}
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  )
}
