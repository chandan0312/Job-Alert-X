import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Briefcase,
  Ticket,
  Award,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchJobById, createJob, updateJob } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { categories, kindLabels, jobs as seedJobs } from '../data/seed.js'

const DEFAULT_FORM = {
  title: '',
  org: '',
  orgShort: '',
  category: 'ssc',
  kind: 'job',
  tagline: '',
  shortInfo: '',
  eligibility: '',
  vacancies: '',
  postedOn: '',
  featured: false,
  importantDates: [
    { label: 'Application Start', value: 'Today' },
    { label: 'Last Date to Apply', value: '30 Days' },
  ],
  fee: [
    { label: 'General / OBC / EWS', value: '₹100' },
    { label: 'SC / ST / PH', value: '₹0' },
  ],
  ageLimit: { min: 18, max: 30, note: 'Age relaxation as per rules.' },
  posts: [{ name: '', total: '', eligibility: '' }],
  links: [{ label: 'Apply Online', href: '#', primary: true }],
}

export default function AdminPostForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewTab, setPreviewTab] = useState(false)

  useEffect(() => {
    if (!isEdit) return
    setLoading(true)
    fetchJobById(id)
      .then((data) => {
        if (data) {
          setForm({
            ...DEFAULT_FORM,
            ...data,
            vacancies: data.vacancies ? String(data.vacancies) : '',
            importantDates: Array.isArray(data.importantDates) && data.importantDates.length ? data.importantDates : DEFAULT_FORM.importantDates,
            fee: Array.isArray(data.fee) && data.fee.length ? data.fee : DEFAULT_FORM.fee,
            ageLimit: data.ageLimit || DEFAULT_FORM.ageLimit,
            posts: Array.isArray(data.posts) && data.posts.length ? data.posts : DEFAULT_FORM.posts,
            links: Array.isArray(data.links) && data.links.length ? data.links : DEFAULT_FORM.links,
          })
        }
      })
      .catch(() => {
        // Fallback to seed
        const fallback = seedJobs.find((j) => j.id === id)
        if (fallback) setForm({ ...DEFAULT_FORM, ...fallback })
      })
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const setField = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // Dynamic Array Handlers
  const handleArrayChange = (arrayKey, index, field, value) => {
    setForm((prev) => {
      const list = [...prev[arrayKey]]
      list[index] = { ...list[index], [field]: value }
      return { ...prev, [arrayKey]: list }
    })
  }

  const handleArrayAdd = (arrayKey, emptyObj) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: [...prev[arrayKey], emptyObj],
    }))
  }

  const handleArrayRemove = (arrayKey, index) => {
    setForm((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.org.trim()) {
      setError('Please provide at least a post Title and Organisation.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      vacancies: form.vacancies ? Number(form.vacancies) : undefined,
    }

    try {
      if (isEdit) {
        await updateJob(token, id, payload)
        setSuccess('Notification updated successfully!')
      } else {
        await createJob(token, payload)
        setSuccess('Notification created and published live!')
      }
      setTimeout(() => navigate('/admin/posts'), 1500)
    } catch (err) {
      setError(err.message || 'Operation failed. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SEOHead title={`${isEdit ? 'Edit Post' : 'Create New Post'} | Admin`} />

      {/* Top action bar */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/posts"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {isEdit ? 'Edit Notification' : 'Create Notification'}
            </h1>
            <p className="mt-0.5 text-xs text-slate-400">
              {isEdit ? `Updating post ID: ${id}` : 'Fill in the official details to publish live on the portal.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewTab(!previewTab)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Eye size={15} />
            {previewTab ? 'Hide Preview' : 'Live Preview'}
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 disabled:opacity-60"
          >
            <Save size={16} />
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Publish Live'}
          </button>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3.5 text-xs font-medium text-emerald-300 animate-fade-in shadow-lg">
          <CheckCircle2 size={16} />
          {success}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3.5 text-xs font-medium text-red-300 animate-fade-in">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Main Grid: Form + Optional Live Preview */}
      <div className={`grid grid-cols-1 gap-6 ${previewTab ? 'lg:grid-cols-2' : ''}`}>
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1: Basic Information */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-white/[0.06] pb-3">
              <Sparkles size={16} className="text-orange-400" />
              General Details
            </h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Notification Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={setField('title')}
                placeholder="e.g. SSC CGL 2026 Recruitment Online Form"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Organisation / Board *</label>
                <input
                  type="text"
                  required
                  value={form.org}
                  onChange={setField('org')}
                  placeholder="e.g. Staff Selection Commission"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Short Name</label>
                <input
                  type="text"
                  value={form.orgShort || ''}
                  onChange={setField('orgShort')}
                  placeholder="e.g. SSC"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={form.category}
                  onChange={setField('category')}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#111827] px-3.5 py-2.5 text-xs font-medium text-slate-200 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name} — {c.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Classification Type</label>
                <select
                  value={form.kind}
                  onChange={setField('kind')}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#111827] px-3.5 py-2.5 text-xs font-medium text-slate-200 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  {Object.entries(kindLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Total Vacancies</label>
                <input
                  type="number"
                  value={form.vacancies}
                  onChange={setField('vacancies')}
                  placeholder="e.g. 17727"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">Posted On String</label>
                <input
                  type="text"
                  value={form.postedOn || ''}
                  onChange={setField('postedOn')}
                  placeholder="e.g. 24 Aug 2026"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Tagline / Highlight</label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={setField('tagline')}
                placeholder="e.g. 17,727 Posts Available — Apply Online Now"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-300">Short Summary / Info</label>
              <textarea
                rows={3}
                value={form.shortInfo || ''}
                onChange={setField('shortInfo')}
                placeholder="Brief summary of eligibility, vacancies, and key dates shown on the post page..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured-checkbox"
                checked={form.featured || false}
                onChange={setField('featured')}
                className="h-4 w-4 rounded border-white/20 bg-white/10 text-orange-500 focus:ring-orange-400"
              />
              <label htmlFor="featured-checkbox" className="text-xs font-semibold text-slate-300 cursor-pointer">
                Feature on Homepage Carousel ("Trending This Week")
              </label>
            </div>
          </div>

          {/* Card 2: Important Dates */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-sm font-bold text-white">Important Dates</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('importantDates', { label: '', value: '' })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
              >
                <Plus size={14} /> Add Date
              </button>
            </div>

            {form.importantDates.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleArrayChange('importantDates', idx, 'label', e.target.value)}
                  placeholder="Date Label (e.g. Admit Card Available)"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleArrayChange('importantDates', idx, 'value', e.target.value)}
                  placeholder="Value (e.g. 15 Sep 2026)"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('importantDates', idx)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Card 3: Application Fee */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-sm font-bold text-white">Application Fee</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('fee', { label: '', value: '' })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
              >
                <Plus size={14} /> Add Category Fee
              </button>
            </div>

            {form.fee.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleArrayChange('fee', idx, 'label', e.target.value)}
                  placeholder="Fee Category (e.g. SC / ST / PH)"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleArrayChange('fee', idx, 'value', e.target.value)}
                  placeholder="Amount (e.g. ₹0 / Exempted)"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('fee', idx)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Card 4: Official Important Links */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-sm font-bold text-white">Official Links</h2>
              <button
                type="button"
                onClick={() => handleArrayAdd('links', { label: '', href: '#', primary: false })}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-400 hover:text-brand-300"
              >
                <Plus size={14} /> Add Link
              </button>
            </div>

            {form.links.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleArrayChange('links', idx, 'label', e.target.value)}
                  placeholder="Link Title (e.g. Apply Online)"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => handleArrayChange('links', idx, 'href', e.target.value)}
                  placeholder="URL Destination"
                  className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => handleArrayRemove('links', idx)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-red-500/20 hover:text-red-300"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              to="/admin/posts"
              className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:brightness-110 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? 'Saving…' : isEdit ? 'Update Notification' : 'Publish Notification'}
            </button>
          </div>
        </form>

        {/* Live Card Preview Column */}
        {previewTab && (
          <div className="space-y-4">
            <div className="sticky top-24 rounded-2xl border border-white/[0.08] bg-[#0d1326]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl">
              <h2 className="text-sm font-bold text-white flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <span>Live Card Preview</span>
                <span className="text-[11px] text-orange-400 font-semibold">Real-time render</span>
              </h2>

              <div className="rounded-2xl border border-white/[0.08] bg-[#111628] p-5 shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10.5px] font-bold text-slate-300 uppercase">
                      {form.category} • {kindLabels[form.kind] || form.kind}
                    </span>
                    <h3 className="mt-2 text-base font-extrabold text-white">{form.title || 'Untitled Notification'}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{form.org || 'Organisation Name'}</p>
                  </div>
                  {form.vacancies && (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">Vacancies</span>
                      <span className="text-base font-extrabold text-orange-400 tabular-nums">
                        {Number(form.vacancies).toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}
                </div>

                {form.shortInfo && (
                  <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-2 border-t border-white/[0.04] pt-3">
                    {form.shortInfo}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                  <span className="text-[11px] text-slate-500">Posted: {form.postedOn || 'Just now'}</span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    Apply Online
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
