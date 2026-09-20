// ---------------------------------------------------------------------------
// AdminArticles.jsx — Admin Dashboard for Managing Articles & Career Blogs
// ---------------------------------------------------------------------------

import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Filter,
  Check,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchAdminArticles, deleteArticle, updateArticle } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { CATEGORY_BADGES } from '../data/articleConstants.js'

export default function AdminArticles() {
  const { token } = useAuth()
  const [articles, setArticles] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setActionError('')

    try {
      const res = await fetchAdminArticles(token)
      setArticles(res?.articles || [])
      setStats(res?.stats || { total: 0, published: 0, drafts: 0, totalViews: 0 })
    } catch (err) {
      setActionError(err.message || 'Failed to fetch articles')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [token])

  const handleDelete = async (id) => {
    setIsDeleting(true)
    try {
      await deleteArticle(token, id)
      setArticles((prev) => prev.filter((a) => a.id !== id))
      setDeleteConfirmId(null)
      setActionSuccess('Article deleted successfully.')
      setTimeout(() => setActionSuccess(''), 3000)
    } catch (err) {
      setActionError(err.message || 'Failed to delete article')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    try {
      await updateArticle(token, article.id, { status: newStatus })
      setArticles((prev) =>
        prev.map((a) => (a.id === article.id ? { ...a, status: newStatus } : a))
      )
      setActionSuccess(`Article status updated to ${newStatus}.`)
      setTimeout(() => setActionSuccess(''), 3000)
    } catch (err) {
      setActionError(err.message || 'Failed to update article status')
    }
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (categoryFilter !== 'all' && art.category !== categoryFilter) return false
      if (statusFilter !== 'all' && art.status !== statusFilter) return false
      if (search.trim()) {
        const query = search.toLowerCase()
        const matchTitle = art.title?.toLowerCase().includes(query)
        const matchAuthor = art.author?.toLowerCase().includes(query)
        const matchSlug = art.slug?.toLowerCase().includes(query)
        if (!matchTitle && !matchAuthor && !matchSlug) return false
      }
      return true
    })
  }, [articles, categoryFilter, statusFilter, search])

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <SEOHead title="Manage Articles — Job Alert X Admin" noIndex />

      {/* Top action header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">Manage Articles &amp; Blogs</h1>
            <span className="rounded-full bg-orange-500/20 text-orange-400 px-2.5 py-0.5 text-xs font-bold border border-orange-500/30">
              {stats.total} Total
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, publish, and manage candidate guides, preparation tips, how-to-apply tutorials, and syllabus documents.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0d1428] px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/articles/new"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-bold text-emerald-400">
          <CheckCircle2 size={16} />
          <span>{actionSuccess}</span>
        </div>
      )}
      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-bold text-red-400">
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-4 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Articles</p>
          <p className="mt-1 text-2xl font-black text-white">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-4 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Published</p>
          <p className="mt-1 text-2xl font-black text-emerald-400">{stats.published}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-4 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Drafts</p>
          <p className="mt-1 text-2xl font-black text-amber-400">{stats.drafts}</p>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-4 shadow-md">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Total Reads / Views</p>
          <p className="mt-1 text-2xl font-black text-cyan-400">
            {Number(stats.totalViews || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#080d1e] p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title, author, or slug..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white/[0.08]"
          />
        </div>

        {/* Category & Status Selectors */}
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by Category"
            className="rounded-xl border border-white/10 bg-[#0d1428] px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-orange-500"
          >
            <option value="all">All Categories</option>
            <option value="job-guide">Job Guides</option>
            <option value="how-to-apply">How to Apply</option>
            <option value="how-to-download">How to Download</option>
            <option value="strategy">Exam Strategy</option>
            <option value="syllabus">Syllabus</option>
            <option value="result">Results &amp; Cut-off</option>
            <option value="documentation">Documentation</option>
            <option value="general">General</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="rounded-xl border border-white/10 bg-[#0d1428] px-3 py-2 text-xs font-semibold text-slate-300 outline-none focus:border-orange-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#080d1e] shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading articles...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <BookOpen size={32} className="mx-auto text-slate-500" />
            <p className="text-sm font-bold text-white">No articles found</p>
            <p className="text-xs text-slate-400">
              {search || categoryFilter !== 'all' ? 'Try adjusting your filters.' : 'Click "Write New Article" to publish your first post.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="border-b border-white/[0.08] bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">Article Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredArticles.map((art) => {
                  const badge = CATEGORY_BADGES[art.category] || {
                    label: art.category,
                    bg: 'bg-white/10 text-white border-white/20',
                  }
                  const isPublished = art.status === 'published'

                  return (
                    <tr key={art.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Title & Cover */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {art.coverImage ? (
                            <img
                              src={art.coverImage}
                              alt=""
                              className="h-10 w-14 rounded-lg object-cover border border-white/10 shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-white/5 text-slate-500 border border-white/10 shrink-0">
                              <BookOpen size={16} />
                            </div>
                          )}
                          <div className="min-w-0 max-w-sm sm:max-w-md">
                            <p className="font-bold text-white line-clamp-1">{art.title}</p>
                            <p className="text-[10.5px] text-slate-400 truncate">
                              /{art.slug} • by {art.author}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(art)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold transition-all ${
                            isPublished
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <span className="capitalize">{art.status}</span>
                        </button>
                      </td>

                      {/* Views */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-300">
                          <Eye size={12} className="text-slate-500" />
                          {Number(art.views || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 whitespace-nowrap text-[11px] text-slate-400">
                        {new Date(art.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/article/${art.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="View Live Article"
                          >
                            <ExternalLink size={15} />
                          </Link>

                          <Link
                            to={`/admin/articles/${art.id}`}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-orange-400 transition-colors"
                            title="Edit Article"
                          >
                            <Edit size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(art.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1428] p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Article?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this article? This action cannot be undone and will remove it from the website.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={isDeleting}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="rounded-xl bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-bold text-white transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
