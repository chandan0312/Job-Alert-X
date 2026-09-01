import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Plus,
  Filter,
  Pencil,
  Trash2,
  ExternalLink,
  Briefcase,
  Ticket,
  Award,
  FileText,
  Layers,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchJobs, deleteJob } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { jobs as seedJobs, categories, kindLabels } from '../data/seed.js'

const KIND_ICON = {
  job: Briefcase,
  'admit-card': Ticket,
  result: Award,
  'answer-key': FileText,
  syllabus: Layers,
}

export default function AdminPosts() {
  const { token } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedKind, setSelectedKind] = useState('all')
  const [selectedCat, setSelectedCat] = useState('all')
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const limit = 10

  const loadPosts = async () => {
    setLoading(true)
    try {
      const data = await fetchJobs({ limit: 100 })
      if (Array.isArray(data) && data.length > 0) {
        setPosts(data)
      } else {
        setPosts(seedJobs)
      }
    } catch (err) {
      console.warn('Using seed fallback for posts table:', err)
      setPosts(seedJobs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return
    setDeletingId(id)
    try {
      if (token) {
        await deleteJob(token, id)
      }
      setPosts((prev) => prev.filter((p) => p.id !== id))
      setToast('Post deleted successfully.')
      setTimeout(() => setToast(''), 3000)
    } catch (err) {
      alert('Delete failed: ' + (err.message || 'Error'))
    } finally {
      setDeletingId(null)
    }
  }

  // Filtering
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.org && p.org.toLowerCase().includes(search.toLowerCase()))
      const matchKind = selectedKind === 'all' || p.kind === selectedKind
      const matchCat = selectedCat === 'all' || p.category === selectedCat
      return matchSearch && matchKind && matchCat
    })
  }, [posts, search, selectedKind, selectedCat])

  const totalPages = Math.ceil(filtered.length / limit) || 1
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title="Manage Posts | Admin Control Panel" />

      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Manage Notifications</h1>
          <p className="mt-1 text-sm text-slate-400">
            Search, edit, inspect or delete all job postings and government exam records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadPosts}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus size={16} />
            Create Notification
          </Link>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300 animate-fade-in shadow-lg">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-4 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search query */}
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search by title, organisation..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 transition-all focus:border-brand-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Classification / Kind */}
          <div>
            <select
              value={selectedKind}
              onChange={(e) => {
                setSelectedKind(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-xl border border-white/[0.08] bg-[#111827] py-2.5 px-3 text-xs font-medium text-slate-200 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Classifications</option>
              {Object.entries(kindLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <select
              value={selectedCat}
              onChange={(e) => {
                setSelectedCat(e.target.value)
                setPage(1)
              }}
              className="w-full rounded-xl border border-white/[0.08] bg-[#111827] py-2.5 px-3 text-xs font-medium text-slate-200 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.fullName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11.5px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 pl-5 pr-3">Notification / Department</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Type</th>
                <th className="px-4 py-3.5">Vacancies</th>
                <th className="px-4 py-3.5">Posted On</th>
                <th className="px-4 py-3.5">Views</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    No posts matched your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((post) => {
                  const Icon = KIND_ICON[post.kind] || FileText
                  return (
                    <tr key={post.id} className="group transition-colors hover:bg-white/[0.02]">
                      {/* Title & Org */}
                      <td className="py-4 pl-5 pr-3 max-w-[320px]">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300 group-hover:bg-brand-600/20 group-hover:text-brand-300 transition-colors">
                            <Icon size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-bold text-white group-hover:text-orange-400 transition-colors">
                              {post.title}
                            </p>
                            <p className="truncate text-[11px] text-slate-500">{post.org}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-bold uppercase text-slate-300">
                          {post.category}
                        </span>
                      </td>

                      {/* Kind / Type */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-300">
                          {kindLabels[post.kind] || post.kind}
                        </span>
                      </td>

                      {/* Vacancies */}
                      <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-200 tabular-nums">
                        {post.vacancies ? post.vacancies.toLocaleString('en-IN') : '—'}
                      </td>

                      {/* Posted On */}
                      <td className="px-4 py-4 whitespace-nowrap text-slate-400">
                        {post.postedOn || post.postedAt || 'Recent'}
                      </td>

                      {/* Views */}
                      <td className="px-4 py-4 whitespace-nowrap font-bold text-slate-300 tabular-nums">
                        {(post.views || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <Link
                            to={`/job/${post.id}`}
                            target="_blank"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                            title="View post live"
                          >
                            <ExternalLink size={15} />
                          </Link>
                          <Link
                            to={`/admin/posts/${post.id}`}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-brand-600/20 hover:text-brand-300"
                            title="Edit notification"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(post.id, post.title)}
                            disabled={deletingId === post.id}
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-300 disabled:opacity-50"
                            title="Delete notification"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row text-xs text-slate-400">
          <p>
            Showing <span className="font-semibold text-white">{(page - 1) * limit + 1}</span> to{' '}
            <span className="font-semibold text-white">{Math.min(page * limit, filtered.length)}</span> of{' '}
            <span className="font-semibold text-white">{filtered.length}</span> results
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
            <span className="px-2 font-bold text-white">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
