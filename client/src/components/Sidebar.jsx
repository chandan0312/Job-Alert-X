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
  X,
  ChevronsLeft,
  ChevronsRight,
  Newspaper,
} from 'lucide-react'

const MENU = [
  { to: '/', label: 'Discover', icon: Home, end: true, color: 'var(--brand-primary)' },
  { to: '/latest/job', label: 'Latest Jobs', icon: Briefcase, color: '#10b981' },
  { to: '/exams', label: 'All Exams', icon: ClipboardList, color: '#8b5cf6' },
  { to: '/articles', label: 'Articles & Blogs', icon: Newspaper, color: 'var(--brand-gold)' },
  { to: '/latest/admit-card', label: 'Admit Card', icon: Ticket, color: '#f43f5e' },
  { to: '/latest/result', label: 'Results', icon: Award, color: '#06b6d4' },
  { to: '/latest/answer-key', label: 'Answer Keys', icon: KeyRound, color: '#a855f7' },
  { to: '/latest/syllabus', label: 'Syllabus', icon: BookOpen, color: '#ec4899' },
]

const LIBRARY = [
  { to: '/recent', label: 'Recent Jobs', icon: History, color: '#14b8a6', nofollow: true },
  { to: '/bookmarked', label: 'Bookmarked', icon: Bookmark, color: 'var(--brand-flame)', nofollow: true },
  { to: '/saved', label: 'Saved Searches', icon: Search, color: '#a78bfa', nofollow: true },
]

const ACCOUNT = [
  { to: '/profile', label: 'Profile', icon: User, color: 'var(--brand-primary)', nofollow: true },
  { to: '/feedback', label: 'Feedback', icon: MessageSquarePlus, color: 'var(--brand-flame)', nofollow: true },
  { to: '/settings', label: 'Settings', icon: Settings, color: 'var(--text-muted)', nofollow: true },
  { to: '/logout', label: 'Logout', icon: LogOut, color: 'var(--danger)', nofollow: true },
]

function NavItem({ item, onNavigate, collapsed }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      rel={item.nofollow ? 'nofollow' : undefined}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          'group relative flex items-center rounded-xl transition-all duration-200',
          collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2',
          isActive
            ? 'sidebar-nav-active font-bold before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3px] before:rounded-r-full before:bg-[var(--brand-primary)]'
            : 'sidebar-nav-hover',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon tile */}
          <span
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
              isActive
                ? 'text-white shadow-sm'
                : ''
            }`}
            style={
              isActive
                ? {
                    background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-dark))',
                    boxShadow: '0 2px 8px rgba(27, 111, 129, 0.35)',
                  }
                : {
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                  }
            }
          >
            <Icon
              size={16}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ color: isActive ? '#ffffff' : item.color }}
              className="transition-colors"
            />
          </span>

          {!collapsed && (
            <span
              className="truncate text-xs font-medium transition-colors"
              style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-2)' }}
            >
              {item.label}
            </span>
          )}

          {/* Badge */}
          {!collapsed && item.badge && (
            <span className="ml-auto inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          )}
          {collapsed && item.badge && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white">
              {item.badge}
            </span>
          )}

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
  if (collapsed) {
    return (
      <div
        className="mx-auto my-3 h-px w-8"
        style={{ background: 'var(--border)' }}
      />
    )
  }
  return (
    <p
      className="px-3 pb-1.5 pt-4 text-[10px] font-bold tracking-widest uppercase"
      style={{ color: 'var(--text-muted)' }}
    >
      {children}
    </p>
  )
}

export default function Sidebar({
  open = false,
  onClose = () => {},
  collapsed = false,
  onToggleCollapse = () => {},
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-30 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'var(--overlay)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`sidebar-transition sidebar-bg fixed top-[72px] bottom-0 left-0 z-30 flex flex-col transition-all duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: open ? '260px' : collapsed ? '72px' : '260px' }}
        aria-label="Primary navigation"
      >
        {/* Mobile close header */}
        <div
          className="flex items-center justify-between px-4 py-3 lg:hidden"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Navigation
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable nav */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-2 ${
            collapsed && !open ? 'px-2' : 'px-2.5'
          }`}
          aria-label="Main navigation"
        >
          <SectionLabel collapsed={collapsed && !open}>Menu</SectionLabel>
          <div className="space-y-0.5">
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
          <div className="space-y-0.5">
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
          <div className="space-y-0.5">
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

        {/* Collapse toggle — desktop only */}
        <div
          className="hidden p-2.5 lg:block"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <button
            type="button"
            onClick={onToggleCollapse}
            className={`flex w-full items-center rounded-xl px-2.5 py-2 text-xs font-medium transition-colors hover:bg-[var(--surface-2)] ${
              collapsed ? 'justify-center' : 'gap-3'
            }`}
            style={{ color: 'var(--text-muted)' }}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            {!collapsed && (
              <span style={{ color: 'var(--text-2)' }}>Collapse Menu</span>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}
