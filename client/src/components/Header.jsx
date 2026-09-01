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
  ChevronRight,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getTickerJobs } from '../services/api.js'
import SarkariEmblem from './SarkariEmblem.jsx'

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

  // Live job ticker items fetched directly from DB
  useEffect(() => {
    let active = true
    getTickerJobs()
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setTickerItems(data)
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] bg-[#050814]/95 backdrop-blur-md px-2 py-2 sm:px-4 sm:py-2.5 transition-colors duration-200">
      {/* Main Top Header Container (Always Dark) */}
      <div className="relative mx-auto flex h-full w-full max-w-[1600px] items-center justify-between gap-3 rounded-2xl bg-[#080d1e] px-3 sm:px-4 border border-cyan-500/20 shadow-[0_0_20px_rgba(0,180,255,0.08)] backdrop-blur-2xl">
        
        {/* === LEFT: BRAND LOGO + TITLE === */}
        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          {/* Logo & JOB ALERT X Branding */}
          <Link
            to="/"
            className="group/brand flex items-center gap-2.5 sm:gap-3 pr-2 transition-transform duration-200 hover:scale-[1.02]"
            aria-label="Job Alert X Home"
          >
            <SarkariEmblem size={44} />

            <div className="flex flex-col">
              <div className="flex items-center text-[18px] sm:text-[20px] font-black tracking-wider leading-none">
                <span className="text-white">JOB</span>
                <span className="text-orange-500 ml-1.5 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">
                  ALERT
                </span>
                <span className="text-purple-400 ml-1 drop-shadow-[0_0_8px_rgba(192,132,252,0.8)]">
                  X
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em] text-slate-400 mt-1">
                <span>JOBS</span>
                <span className="text-orange-500 text-[8px]">•</span>
                <span>EXAMS</span>
                <span className="text-orange-500 text-[8px]">•</span>
                <span>RESULTS</span>
              </div>
            </div>
          </Link>
        </div>

        {/* === CENTER: SLIDER BOX WITH SLIDING TEXT & FIRE SYMBOL === */}
        <div className="hidden min-w-0 flex-1 items-center md:flex px-3 lg:px-6">
          <div className="relative flex h-11 w-full items-center overflow-hidden rounded-full bg-[#0d1326] border border-white/10 shadow-inner pl-1.5 pr-4">
            
            {/* Left Fire Symbol Badge */}
            <div className="relative z-10 flex shrink-0 items-center justify-center h-8 w-8 rounded-full bg-gradient-to-tr from-orange-600 via-amber-500 to-orange-400 text-white shadow-md shadow-orange-500/30">
              <Flame size={17} className="animate-pulse text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" aria-hidden="true" />
            </div>

            {/* Left Edge Gradient Fade */}
            <div className="pointer-events-none absolute left-10 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-[#0d1326] to-transparent" />

            {/* Right-to-Left Continuous Moving Ticker Track */}
            <div className="flex overflow-hidden w-full cursor-pointer select-none">
              <div className="animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none flex items-center gap-6 py-1">
                {/* Loop 1 */}
                {tickerItems.map((item, idx) => {
                  const badge = item.badge || item.orgShort || item.org || item.category?.toUpperCase() || 'LIVE'
                  const highlight = item.highlight || item.tagline || (item.vacancies ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts` : 'Apply Online')
                  return (
                    <Link
                      key={`t1-${item.id || idx}`}
                      to={`/job/${item.id}`}
                      className="group/item flex shrink-0 items-center gap-2 text-xs text-slate-200 hover:text-orange-400 transition-colors"
                    >
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                        {badge}
                      </span>
                      <span className="font-semibold text-slate-200 group-hover/item:text-orange-400 group-hover/item:underline underline-offset-2">
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-400 group-hover/item:text-orange-300">
                        [{highlight}]
                        <ArrowRight size={12} className="transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="text-slate-600 mx-2" aria-hidden="true">•</span>
                    </Link>
                  )
                })}
                {/* Loop 2 (for continuous smooth scroll) */}
                {tickerItems.map((item, idx) => {
                  const badge = item.badge || item.orgShort || item.org || item.category?.toUpperCase() || 'LIVE'
                  const highlight = item.highlight || item.tagline || (item.vacancies ? `${Number(item.vacancies).toLocaleString('en-IN')} Posts` : 'Apply Online')
                  return (
                    <Link
                      key={`t2-${item.id || idx}`}
                      to={`/job/${item.id}`}
                      className="group/item flex shrink-0 items-center gap-2 text-xs text-slate-200 hover:text-orange-400 transition-colors"
                    >
                      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                        {badge}
                      </span>
                      <span className="font-semibold text-slate-200 group-hover/item:text-orange-400 group-hover/item:underline underline-offset-2">
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-400 group-hover/item:text-orange-300">
                        [{highlight}]
                        <ArrowRight size={12} className="transition-transform group-hover/item:translate-x-0.5" aria-hidden="true" />
                      </span>
                      <span className="text-slate-600 mx-2" aria-hidden="true">•</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* === RIGHT: ACTIONS + THEME TOGGLE + USER PILL === */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Quick Feedback Button */}
          <Link
            to="/feedback"
            className="group flex items-center gap-1.5 rounded-full bg-[#111628] px-3 py-2 text-slate-300 border border-white/10 hover:border-orange-500/40 hover:text-orange-300 transition-all shadow-sm"
            title="Send Feedback or Suggestion"
          >
            <MessageSquarePlus size={17} className="text-orange-400 transition-colors group-hover:text-orange-300" />
            <span className="hidden text-[12px] font-bold lg:inline">Feedback</span>
          </Link>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111628] text-slate-300 border border-white/10 hover:border-amber-400/40 hover:text-amber-400 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {isDark ? <MoonStar size={17} className="text-indigo-400" /> : <Sun size={17} className="text-amber-400" />}
          </button>

          {/* Login / Profile Gradient Pill Button */}
          <div ref={userRef} className="relative">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setUserOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5] px-3.5 py-2 text-[13px] font-bold text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/40 hover:brightness-110 transition-all"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <User size={15} className="text-white" />
                )}
                <span className="max-w-[100px] truncate">{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-3.5 py-2 text-[13px] font-bold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-110 transition-all"
              >
                <User size={15} className="text-white" />
                <span>Sign In</span>
              </Link>
            )}

            {userOpen && isAuthenticated && (
              <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#0d1326] p-2 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
                <div className="px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-bold text-white truncate">{user?.name || 'User'}</p>
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-orange-400">
                      {user?.role || 'Member'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                </div>
                <div className="my-1 h-px bg-white/10" />
                <Link
                  to="/profile"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Your Profile
                </Link>
                <Link
                  to="/bookmarked"
                  onClick={() => setUserOpen(false)}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  Bookmarked Jobs
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setUserOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-semibold text-orange-400 hover:bg-orange-500/20 transition-colors"
                  >
                    <span>Admin Control Panel</span>
                    <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_6px_#f97316]" />
                  </Link>
                )}
                <div className="my-1 h-px bg-white/10" />
                <button
                  type="button"
                  onClick={() => {
                    setUserOpen(false)
                    logout()
                  }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
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
