import { useState, useEffect, useMemo } from 'react'
import {
  MessageSquare,
  Search,
  Filter,
  Star,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  X,
  Mail,
  User,
  Calendar,
  Lightbulb,
  Bug,
  Sparkles,
  HelpCircle,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchFeedbacks, updateFeedbackStatus, deleteFeedback } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'

const TYPE_ICONS = {
  suggestion: { icon: Lightbulb, color: '#f59e0b', label: 'Suggestion' },
  feedback: { icon: Sparkles, color: '#6d70f0', label: 'Feedback' },
  bug_report: { icon: Bug, color: '#ef4444', label: 'Bug Report' },
  feature_request: { icon: MessageSquare, color: '#10b981', label: 'Feature Request' },
  other: { icon: HelpCircle, color: '#06b6d4', label: 'Other' },
}

export default function AdminFeedback() {
  const { token } = useAuth()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [toast, setToast] = useState('')
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadFeedbacks = async () => {
    if (!token) {
      setError('Your session has expired. Please sign in again.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await fetchFeedbacks(token, { limit: 100 })
      setFeedbacks(data.feedbacks || [])
    } catch (err) {
      setFeedbacks([])
      setError(
        err.status === 403
          ? 'Your account does not have permission to view feedback submissions.'
          : err.message || 'Could not load feedback submissions.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFeedbacks()
  }, [token])

  const handleStatusChange = async (id, newStatus) => {
    setError('')
    try {
      await updateFeedbackStatus(token, id, newStatus)
      setFeedbacks((prev) =>
        prev.map((fb) => (fb.id === id ? { ...fb, status: newStatus } : fb))
      )
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback((prev) => ({ ...prev, status: newStatus }))
      }
      setToast(`Marked as ${newStatus}`)
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setError(`Failed to update status: ${err.message}`)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback permanently?')) return
    setDeletingId(id)
    setError('')
    try {
      await deleteFeedback(token, id)
      setFeedbacks((prev) => prev.filter((fb) => fb.id !== id))
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(null)
      }
      setToast('Feedback removed.')
      setTimeout(() => setToast(''), 2500)
    } catch (err) {
      setError(`Delete failed: ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchSearch =
        !search.trim() ||
        fb.name.toLowerCase().includes(search.toLowerCase()) ||
        fb.email.toLowerCase().includes(search.toLowerCase()) ||
        fb.subject.toLowerCase().includes(search.toLowerCase()) ||
        fb.message.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || fb.status === statusFilter
      const matchType = typeFilter === 'all' || fb.type === typeFilter
      return matchSearch && matchStatus && matchType
    })
  }, [feedbacks, search, statusFilter, typeFilter])

  const counts = useMemo(() => {
    return {
      total: feedbacks.length,
      new: feedbacks.filter((f) => f.status === 'new').length,
      reviewed: feedbacks.filter((f) => f.status === 'reviewed').length,
      resolved: feedbacks.filter((f) => f.status === 'resolved').length,
    }
  }, [feedbacks])

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title="User Feedback & Suggestions | Admin" />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            User Feedback &amp; Suggestions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Review recommendations, bug reports, and student suggestions stored in the database.
          </p>
        </div>

        <button
          type="button"
          onClick={loadFeedbacks}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Submissions
        </button>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300 animate-fade-in shadow-lg">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300 animate-fade-in shadow-lg">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-4 shadow-lg">
          <p className="text-xs text-slate-400 font-medium">Total Feedback</p>
          <p className="mt-1 text-2xl font-black text-white">{counts.total}</p>
        </div>
        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 shadow-lg">
          <p className="text-xs text-orange-400 font-medium">New Submissions</p>
          <p className="mt-1 text-2xl font-black text-orange-300">{counts.new}</p>
        </div>
        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 shadow-lg">
          <p className="text-xs text-indigo-400 font-medium">Reviewed</p>
          <p className="mt-1 text-2xl font-black text-indigo-300">{counts.reviewed}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-lg">
          <p className="text-xs text-emerald-400 font-medium">Resolved</p>
          <p className="mt-1 text-2xl font-black text-emerald-300">{counts.resolved}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-4 shadow-xl backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback by name, email, subject..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-600 focus:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#111827] py-2.5 px-3 text-xs font-medium text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="new">New ({counts.new})</option>
              <option value="reviewed">Reviewed ({counts.reviewed})</option>
              <option value="resolved">Resolved ({counts.resolved})</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#111827] py-2.5 px-3 text-xs font-medium text-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="suggestion">Suggestions</option>
              <option value="feedback">General Feedback</option>
              <option value="bug_report">Bug Reports</option>
              <option value="feature_request">Feature Requests</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback Table / List */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11.5px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 pl-5 pr-3">User &amp; Contact</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Subject &amp; Snippet</th>
                <th className="px-4 py-3.5">Rating</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="py-3.5 pl-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    No feedback records match the current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const typeObj = TYPE_ICONS[item.type] || TYPE_ICONS.suggestion
                  const Icon = typeObj.icon
                  return (
                    <tr key={item.id} className="group transition-colors hover:bg-white/[0.02]">
                      <td className="py-4 pl-5 pr-3 whitespace-nowrap">
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-[11px] text-slate-400">{item.email}</p>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold"
                          style={{ backgroundColor: `${typeObj.color}15`, color: typeObj.color }}
                        >
                          <Icon size={13} />
                          {typeObj.label}
                        </span>
                      </td>

                      <td className="px-4 py-4 max-w-[280px]">
                        <p className="font-bold text-white truncate">{item.subject}</p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.message}</p>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-0.5 text-amber-400">
                          {Array.from({ length: item.rating || 5 }).map((_, i) => (
                            <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider ${
                            item.status === 'new'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : item.status === 'reviewed'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-4 pl-3 pr-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedFeedback(item)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            title="Read Full Feedback"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors disabled:opacity-50"
                            title="Delete"
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
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#050814]/80 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedFeedback(null)}
          />

          <div className="relative z-10 w-full max-w-[600px] overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0d1326] shadow-2xl backdrop-blur-2xl animate-fade-in">
            <div className="border-b border-white/[0.08] bg-gradient-to-r from-[#101833] to-[#172044] px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Feedback Details #{selectedFeedback.id}</h3>
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
                <div>
                  <h4 className="text-base font-extrabold text-white">{selectedFeedback.subject}</h4>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User size={13} /> {selectedFeedback.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Mail size={13} /> {selectedFeedback.email}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: selectedFeedback.rating || 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 mb-1">Message Content:</p>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {selectedFeedback.message}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/[0.06] pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Update Status:</span>
                  {['new', 'reviewed', 'resolved'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(selectedFeedback.id, s)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase transition-all ${
                        selectedFeedback.status === s
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(selectedFeedback.id)}
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
