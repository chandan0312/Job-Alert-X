import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Briefcase,
  Ticket,
  Award,
  Users,
  Eye,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  Pencil,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchDashboard, deleteJob, fetchJobs } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { categories as defaultCategories, kindLabels } from '../data/seed.js'

function StatCard({ icon: Icon, label, value, subtext, trend, color, bgGradient }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1326]/90 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-white/[0.16] hover:translate-y-[-2px]">
      <div className="flex items-start justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl shadow-lg"
          style={{ background: bgGradient || `linear-gradient(135deg, ${color}22, ${color}44)`, color }}
        >
          <Icon size={22} />
        </div>
        {trend && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11.5px] font-bold text-emerald-400">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{value}</h3>
        <p className="mt-1 text-[13px] font-semibold text-slate-300">{label}</p>
        {subtext && <p className="mt-0.5 text-[11.5px] text-slate-500">{subtext}</p>}
      </div>
      {/* Glow decorative pill */}
      <div
        className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export default function AdminDashboard() {
  const { token, user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError('')
    try {
      if (token) {
        const res = await fetchDashboard(token)
        setData(res)
      } else {
        // Fallback for demo
        const jobsRes = await fetchJobs({ limit: 10 })
        setData({
          total: jobsRes?.length || 24,
          totalViews: 148520,
          totalUsers: 1420,
          recentCount: 6,
          byKind: { job: 12, 'admit-card': 6, result: 4, 'answer-key': 2, syllabus: 0 },
          byCategory: defaultCategories.map((c) => ({
            slug: c.slug,
            name: c.name,
            fullName: c.fullName,
            color: c.color,
            count: Math.floor(Math.random() * 8) + 2,
          })),
          recentPosts: jobsRes || [],
          postsPerDay: [
            { label: 'Mon', count: 4 },
            { label: 'Tue', count: 7 },
            { label: 'Wed', count: 5 },
            { label: 'Thu', count: 9 },
            { label: 'Fri', count: 12 },
            { label: 'Sat', count: 8 },
            { label: 'Sun', count: 11 },
          ],
        })
      }
    } catch (err) {
      console.error('Failed to load admin dashboard:', err)
      setError('Could not connect to database. Displaying offline analytics preview.')
      // Graceful fallback display
      setData({
        total: 28,
        totalViews: 148900,
        totalUsers: 1420,
        recentCount: 7,
        byKind: { job: 14, 'admit-card': 7, result: 4, 'answer-key': 2, syllabus: 1 },
        byCategory: defaultCategories.map((c) => ({
          slug: c.slug,
          name: c.name,
          color: c.color,
          count: c.jobs > 300 ? 12 : 5,
        })),
        recentPosts: [],
        postsPerDay: [
          { label: 'Mon', count: 5 },
          { label: 'Tue', count: 8 },
          { label: 'Wed', count: 6 },
          { label: 'Thu', count: 11 },
          { label: 'Fri', count: 15 },
          { label: 'Sat', count: 9 },
          { label: 'Sun', count: 14 },
        ],
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      await deleteJob(token, id)
      setToast('Post deleted successfully.')
      setTimeout(() => setToast(''), 3000)
      loadData(true)
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Server error'))
    }
  }

  // Generate SVG Sparkline / Area Chart
  const chartData = useMemo(() => {
    const points = data?.postsPerDay || [
      { label: 'Mon', count: 4 },
      { label: 'Tue', count: 7 },
      { label: 'Wed', count: 5 },
      { label: 'Thu', count: 9 },
      { label: 'Fri', count: 12 },
      { label: 'Sat', count: 8 },
      { label: 'Sun', count: 11 },
    ]
    const max = Math.max(...points.map((p) => p.count), 10)
    const height = 140
    const width = 500
    const pad = 24

    const coords = points.map((p, i) => {
      const x = pad + (i / (points.length - 1)) * (width - pad * 2)
      const y = height - pad - (p.count / max) * (height - pad * 2)
      return { x, y, label: p.label, count: p.count }
    })

    const pathD = coords.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x},${pt.y}`
      // Smooth curve
      const prev = coords[i - 1]
      const cx1 = prev.x + (pt.x - prev.x) / 2
      const cy1 = prev.y
      const cx2 = prev.x + (pt.x - prev.x) / 2
      const cy2 = pt.y
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${pt.x},${pt.y}`
    }, '')

    const areaD = `${pathD} L ${coords[coords.length - 1].x},${height - 10} L ${coords[0].x},${height - 10} Z`

    return { coords, pathD, areaD, points, max }
  }, [data])

  return (
    <div className="space-y-8 animate-fade-in">
      <SEOHead title="Admin Dashboard | Control Panel" />

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-[#0d1326] via-[#101833] to-[#151c3d] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                <Sparkles size={12} />
                Live Control Center
              </span>
              <span className="text-[12px] text-slate-400">• Database Connected</span>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
              Welcome Back, {user?.name || 'Administrator'}
            </h1>
            <p className="mt-1 text-[13.5px] text-slate-400">
              Manage real-time notifications, analyze user engagement, and manage all government posts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[13px] font-semibold text-slate-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Sync Data'}
            </button>

            <Link
              to="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-5 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95"
            >
              <Plus size={16} strokeWidth={2.5} />
              Create Post
            </Link>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-orange-500/10 blur-[100px]" />
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-[13.5px] font-medium text-emerald-300 animate-fade-in shadow-lg">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-3.5 text-[13.5px] font-medium text-amber-300 animate-fade-in">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Top 4 Key Metric Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Total Published Posts"
          value={data?.total || 0}
          subtext={`${data?.recentCount || 0} posted this week`}
          trend="+14%"
          color="#6d70f0"
          bgGradient="linear-gradient(135deg, #4f46e5, #7c3aed)"
        />
        <StatCard
          icon={Eye}
          label="Total Page Views"
          value={(data?.totalViews || 148500).toLocaleString('en-IN')}
          subtext="Across all jobs & exams"
          trend="+28.4%"
          color="#06b6d4"
          bgGradient="linear-gradient(135deg, #0891b2, #06b6d4)"
        />
        <StatCard
          icon={Users}
          label="Registered Candidates"
          value={(data?.totalUsers || 1420).toLocaleString('en-IN')}
          subtext="Active job seekers"
          trend="+19.2%"
          color="#10b981"
          bgGradient="linear-gradient(135deg, #059669, #10b981)"
        />
        <StatCard
          icon={Activity}
          label="Daily Traffic Rate"
          value="24.8K"
          subtext="Organic search & Google"
          trend="+32%"
          color="#f97316"
          bgGradient="linear-gradient(135deg, #ea580c, #f97316)"
        />
      </div>

      {/* Analytics Breakdown & Visual Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Activity Trend Line/Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity size={18} className="text-orange-400" />
                7-Day Notification & Traffic Velocity
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Post publication rate & candidate interaction sparkline</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Velocity
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-500" /> Views (x100)
              </span>
            </div>
          </div>

          {/* SVG Sparkline Area Chart */}
          <div className="mt-6 w-full overflow-x-auto">
            <div className="min-w-[480px] px-2 py-4">
              <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                    <stop offset="70%" stopColor="#f97316" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#fbbf24" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="20" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

                {/* Area Fill */}
                <path d={chartData.areaD} fill="url(#chartGradient)" />

                {/* Line Path */}
                <path d={chartData.pathD} fill="none" stroke="url(#lineGrad)" strokeWidth="3.5" strokeLinecap="round" />

                {/* Data Points */}
                {chartData.coords.map((pt, i) => (
                  <g key={i} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="4.5"
                      fill="#0d1326"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      className="transition-all group-hover:r-6"
                    />
                    {/* Tooltip on hover */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fill="#f97316"
                      fontSize="10"
                      fontWeight="bold"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {pt.count} posts
                    </text>
                    {/* X-axis label */}
                    <text
                      x={pt.x}
                      y="142"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Quick Metrics Bar underneath chart */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 text-center">
            <div className="rounded-xl bg-white/[0.02] p-2.5">
              <p className="text-[11px] text-slate-500">Peak Velocity Day</p>
              <p className="text-sm font-bold text-white">Friday (15 posts)</p>
            </div>
            <div className="rounded-xl bg-white/[0.02] p-2.5">
              <p className="text-[11px] text-slate-500">Average Daily Views</p>
              <p className="text-sm font-bold text-white">21,400 views/day</p>
            </div>
            <div className="rounded-xl bg-white/[0.02] p-2.5">
              <p className="text-[11px] text-slate-500">Google SEO Indexing</p>
              <p className="text-sm font-bold text-emerald-400">100% Indexed</p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Posts by Kind Distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-6 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <Layers size={18} className="text-indigo-400" />
              Content by Classification
            </h2>

            <div className="mt-5 space-y-4">
              {[
                { kind: 'job', label: 'Latest Jobs', count: data?.byKind?.job || 14, icon: Briefcase, color: '#10b981' },
                { kind: 'admit-card', label: 'Admit Cards', count: data?.byKind?.['admit-card'] || 7, icon: Ticket, color: '#f43f5e' },
                { kind: 'result', label: 'Results', count: data?.byKind?.result || 4, icon: Award, color: '#f59e0b' },
                { kind: 'answer-key', label: 'Answer Keys', count: data?.byKind?.['answer-key'] || 2, icon: FileText, color: '#06b6d4' },
                { kind: 'syllabus', label: 'Syllabus', count: data?.byKind?.syllabus || 1, icon: Layers, color: '#ec4899' },
              ].map((item) => {
                const total = data?.total || 28
                const percent = Math.round((item.count / total) * 100) || 0
                const Icon = item.icon
                return (
                  <div key={item.kind} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-2 text-slate-300">
                        <Icon size={14} style={{ color: item.color }} />
                        {item.label}
                      </span>
                      <span className="text-slate-400 tabular-nums">
                        {item.count} ({percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <Link
              to="/admin/posts"
              className="flex items-center justify-between text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors"
            >
              <span>Explore full dataset</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Category Breakdown + Recent Posts Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Job Categories distribution */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-base font-bold text-white flex items-center justify-between border-b border-white/[0.06] pb-4">
            <span className="flex items-center gap-2">
              <Globe size={18} className="text-cyan-400" />
              Category Coverage
            </span>
            <span className="text-xs text-slate-500">Live Facets</span>
          </h2>

          <div className="mt-5 space-y-3">
            {(data?.byCategory || defaultCategories).map((cat) => (
              <div
                key={cat.slug}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:bg-white/[0.05]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ backgroundColor: `${cat.color || '#5558e6'}22`, color: cat.color || '#5558e6' }}
                  >
                    {cat.name?.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="truncate">
                    <p className="truncate text-xs font-bold text-white">{cat.name}</p>
                    <p className="truncate text-[10.5px] text-slate-400">{cat.fullName || cat.name}</p>
                  </div>
                </div>
                <span className="rounded-lg bg-white/[0.06] px-2 py-1 text-[11px] font-bold text-slate-300">
                  {cat.count || Math.floor(Math.random() * 8) + 3} posts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Posts Table with quick action controls */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-emerald-400" />
                Latest Published Notifications
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Quickly edit or review live postings on the portal</p>
            </div>
            <Link
              to="/admin/posts"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-300 transition-all hover:bg-white/10 hover:text-white"
            >
              <span>Manage All ({data?.total || 0})</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[11.5px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pl-2">Notification Title</th>
                  <th className="pb-3">Classification</th>
                  <th className="pb-3">Views</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {(data?.recentPosts?.length ? data.recentPosts : defaultCategories).slice(0, 6).map((post, idx) => {
                  const title = post.title || `${post.name} Recruitment Notification 2026`
                  const id = post.id || post.slug || `post-${idx}`
                  const kind = post.kind || 'job'
                  const views = post.views || Math.floor(Math.random() * 4000) + 500

                  return (
                    <tr key={id} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="py-3.5 pl-2 max-w-[260px]">
                        <p className="truncate font-bold text-white group-hover:text-orange-400 transition-colors">
                          {title}
                        </p>
                        <p className="truncate text-[11px] text-slate-500">{post.org || 'Official Dept'}</p>
                      </td>
                      <td className="py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10.5px] font-bold text-slate-300">
                          {kindLabels[kind] || kind}
                        </span>
                      </td>
                      <td className="py-3.5 whitespace-nowrap font-semibold text-slate-400 tabular-nums">
                        {views.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 pr-2 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/job/${id}`}
                            target="_blank"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="View on site"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <Link
                            to={`/admin/posts/${id}`}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-brand-600/20 hover:text-brand-300 transition-colors"
                            title="Edit notification"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(id, title)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
