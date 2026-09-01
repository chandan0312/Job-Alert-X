import { NavLink } from 'react-router-dom'
import {
  Home,
  Briefcase,
  ClipboardList,
  Ticket,
  Award,
  KeyRound,
  BookOpen,
  History,
  Bookmark,
  Search,
  User,
  MessageSquarePlus,
  Settings,
  LogOut,
  SunMedium,
  MoonStar,
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext.jsx'

const MENU = [
  { to: '/', label: 'Discover', icon: Home, end: true, color: '#3b82f6' },          // blue
  { to: '/latest/job', label: 'Latest Jobs', icon: Briefcase, color: '#10b981' },    // emerald
  { to: '/exams', label: 'All Exams', icon: ClipboardList, color: '#8b5cf6' },       // violet
  { to: '/latest/admit-card', label: 'Admit Card', icon: Ticket, color: '#f43f5e' }, // rose
  { to: '/latest/result', label: 'Results', icon: Award, color: '#f59e0b' },         // amber
  { to: '/latest/answer-key', label: 'Answer Keys', icon: KeyRound, color: '#06b6d4' }, // cyan
  { to: '/latest/syllabus', label: 'Syllabus', icon: BookOpen, color: '#ec4899' },   // pink
]

const LIBRARY = [
  { to: '/recent', label: 'Recent Jobs', icon: History, color: '#14b8a6' },    // teal
  { to: '/bookmarked', label: 'Bookmarked', icon: Bookmark, color: '#f97316' }, // orange
  { to: '/saved', label: 'Saved Searches', icon: Search, color: '#a78bfa' },   // purple
]

const ACCOUNT = [
  { to: '/profile', label: 'Profile', icon: User, color: '#60a5fa' },                  // light blue
  { to: '/feedback', label: 'Feedback', icon: MessageSquarePlus, color: '#fb923c' },   // orange
  { to: '/settings', label: 'Settings', icon: Settings, color: '#94a3b8' },            // slate
  { to: '/logout', label: 'Logout', icon: LogOut, color: '#ef4444' },                  // red
]

function NavItem({ item, onNavigate, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-xl transition-all duration-200',
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
          isActive
            ? 'bg-gradient-to-r from-orange-500/20 to-orange-500/5 text-white font-bold before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-orange-500 before:shadow-[0_0_8px_#f97316]'
            : 'text-slate-400 hover:bg-white/[0.07] hover:text-slate-200',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Colorful icon — uses item.color always, brightens on active */}
          <span
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/40 ring-2 ring-orange-400/40'
                : 'bg-white/[0.05] border border-white/[0.06] group-hover:bg-white/[0.1]'
            }`}
          >
            <Icon
              size={17}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ color: isActive ? '#ffffff' : item.color }}
              className="transition-colors"
            />
          </span>
          {!collapsed && (
            <span className={`truncate text-xs ${isActive ? 'text-white font-bold' : 'font-medium text-slate-300 group-hover:text-white'}`}>
              {item.label}
            </span>
          )}
          {!collapsed && item.badge ? (
            <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          ) : null}
          {collapsed && item.badge ? (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {item.badge}
            </span>
          ) : null}
          {/* Tooltip when collapsed */}
          {collapsed && (
            <span className="sidebar-tooltip z-50">{item.label}</span>
          )}
        </>
      )}
    </NavLink>
  )
}

function SectionLabel({ children, collapsed }) {
  if (collapsed) return <div className="mx-auto my-2.5 h-px w-6 bg-white/10" />
  return <p className="eyebrow px-3 pb-1.5 pt-4 !text-slate-400 font-semibold tracking-wider text-[10px] uppercase">{children}</p>
}

export default function Sidebar({
  open = false,
  onClose = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
}) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Left Sidebar Menu (Always Dark, below the fixed top header) */}
      <aside
        className={`sidebar-transition fixed top-[72px] bottom-0 left-0 z-30 flex flex-col border-r border-white/[0.08] bg-[#080d1e] shadow-xl transition-colors duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: open ? '260px' : collapsed ? '72px' : '260px' }}
      >
        {/* Mobile close header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable nav list */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-2 ${
            collapsed && !open ? 'px-2' : 'px-3'
          }`}
        >
          <SectionLabel collapsed={collapsed && !open}>Menu</SectionLabel>
          <div className="space-y-1">
            {MENU.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={collapsed && !open}
              />
            ))}
          </div>

          <SectionLabel collapsed={collapsed && !open}>Library</SectionLabel>
          <div className="space-y-1">
            {LIBRARY.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={collapsed && !open}
              />
            ))}
          </div>

          <SectionLabel collapsed={collapsed && !open}>Account</SectionLabel>
          <div className="space-y-1">
            {ACCOUNT.map((item) => (
              <NavItem
                key={item.to}
                item={item}
                onNavigate={onClose}
                collapsed={collapsed && !open}
              />
            ))}
          </div>
        </nav>

        {/* Theme toggle inside sidebar */}
        <div className="border-t border-white/[0.08] p-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex w-full items-center rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-white/[0.07] ${
              collapsed && !open ? 'justify-center' : 'gap-3'
            }`}
            aria-pressed={!isDark}
          >
            {isDark ? (
              <MoonStar size={18} className="flex-shrink-0 text-indigo-400" />
            ) : (
              <SunMedium size={18} className="flex-shrink-0 text-amber-400" />
            )}
            {(!collapsed || open) && (
              <>
                <span className="text-[13px] font-medium text-slate-300">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
                <span
                  className={`ml-auto inline-flex h-5 w-10 items-center rounded-full p-0.5 transition-colors ${
                    isDark ? 'bg-slate-700' : 'bg-orange-500'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      isDark ? 'translate-x-0' : 'translate-x-5'
                    }`}
                  />
                </span>
              </>
            )}
          </button>
        </div>

        {/* Collapse toggle — desktop only */}
        <div className="hidden border-t border-white/[0.08] p-2.5 lg:block">
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex w-full items-center rounded-xl px-2.5 py-2 text-slate-400 transition-colors hover:bg-white/[0.07] hover:text-slate-200 ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && (
              <span className="text-[13px] font-medium text-slate-300">Collapse Menu</span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
