// ---------------------------------------------------------------------------
// AdminArticleForm.jsx — Article Creator & Editor for Job Alert X Admin
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  Save,
  ArrowLeft,
  Eye,
  Sparkles,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  BookOpen,
  Compass,
  FileText,
  Download,
  GraduationCap,
  ShieldCheck,
  Award,
  Globe,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getArticleBySlug, createArticle, updateArticle, uploadImage } from '../services/api.js'
import BlogRichEditor from '../components/BlogRichEditor.jsx'
import SEOHead from '../components/SEOHead.jsx'

const CATEGORY_OPTIONS = [
  { value: 'job-guide', label: 'Job & Career Guides' },
  { value: 'how-to-apply', label: 'How to Apply (Online Application)' },
  { value: 'how-to-download', label: 'How to Download (Admit Cards / Slips)' },
  { value: 'strategy', label: 'Exam Strategy & Study Plans' },
  { value: 'syllabus', label: 'Syllabus & Exam Pattern Breakdown' },
  { value: 'result', label: 'Results & Cut-off Analysis' },
  { value: 'documentation', label: 'Document Verification (DV) Checklist' },
  { value: 'general', label: 'General Advice & Recruitment News' },
]

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function AdminArticleForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { token } = useAuth()

  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'job-guide',
    excerpt: '',
    content: '',
    coverImage: '',
    author: 'Job Alert X Editorial Team',
    authorRole: 'Recruitment & Career Expert',
    readTime: '5 min read',
    tags: '',
    status: 'published',
    featured: false,
    metaTitle: '',
    metaDescription: '',
  })

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      getArticleBySlug(id)
        .then((res) => {
          const art = res?.article
          if (art) {
            setFormData({
              title: art.title || '',
              slug: art.slug || '',
              category: art.category || 'job-guide',
              excerpt: art.excerpt || '',
              content: art.content || '',
              coverImage: art.coverImage || '',
              author: art.author || 'Job Alert X Editorial Team',
              authorRole: art.authorRole || 'Recruitment & Career Expert',
              readTime: art.readTime || '5 min read',
              tags: Array.isArray(art.tags) ? art.tags.join(', ') : '',
              status: art.status || 'published',
              featured: Boolean(art.featured),
              metaTitle: art.metaTitle || '',
              metaDescription: art.metaDescription || '',
            })
            setSlugManuallyEdited(true)
          }
        })
        .catch((err) => {
          setErrorMessage(err.message || 'Failed to load article')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id, isEdit])

  // Handle title change and auto-slug
  const handleTitleChange = (val) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: slugManuallyEdited ? prev.slug : slugify(val),
    }))
  }

  // Handle image upload for cover
  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    setErrorMessage('')
    try {
      const res = await uploadImage(token, file)
      if (res?.url) {
        setFormData((prev) => ({ ...prev, coverImage: res.url }))
        setSuccessMessage('Cover image uploaded successfully.')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to upload cover image')
    } finally {
      setIsUploadingCover(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setErrorMessage('Please provide an article title.')
      return
    }

    setSubmitting(true)
    setErrorMessage('')
    setSuccessMessage('')

    const payload = {
      ...formData,
      title: formData.title.trim(),
      slug: slugify(formData.slug || formData.title),
      tags: formData.tags
        ? formData.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    }

    try {
      if (isEdit) {
        await updateArticle(token, id, payload)
        setSuccessMessage('Article updated successfully!')
      } else {
        await createArticle(token, payload)
        setSuccessMessage('Article created and published successfully!')
      }
      setTimeout(() => {
        navigate('/admin/articles')
      }, 1200)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save article')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
        Loading article details...
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <SEOHead title={`${isEdit ? 'Edit Article' : 'Write New Article'} — Job Alert X Admin`} noIndex />

      {/* Top breadcrumb & action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/articles"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0d1428] text-slate-400 hover:text-white transition-colors"
            title="Back to Articles List"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-white">
              {isEdit ? 'Edit Article' : 'Write New Article & Blog'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Publish candidate guides, preparation tips, and official exam walkthroughs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {formData.slug && (
            <Link
              to={`/article/${formData.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0d1428] px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink size={14} />
              <span>Preview</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span>{submitting ? 'Saving...' : isEdit ? 'Update Article' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Feedback alerts */}
      {successMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs font-bold text-emerald-400">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs font-bold text-red-400">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Details */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <BookOpen size={16} />
            <span>Article Title &amp; Category</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. How to Apply for SSC CGL 2026: Complete Step-by-Step Registration Guide"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:bg-white/[0.06]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Article Category / Topic <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1428] px-3.5 py-2.5 text-xs font-medium text-slate-200 outline-none focus:border-orange-500"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  URL Slug <span className="text-slate-500 font-normal">(Auto-generated or custom)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setSlugManuallyEdited(true)
                    setFormData({ ...formData, slug: slugify(e.target.value) })
                  }}
                  placeholder="how-to-apply-ssc-cgl-2026"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Excerpt & Cover Image */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <ImageIcon size={16} />
            <span>Summary &amp; Cover Image</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Excerpt / Summary <span className="text-slate-500 font-normal">(Used in card previews &amp; search engines)</span>
              </label>
              <textarea
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief 2-3 sentence overview explaining what candidates will learn in this guide..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 leading-relaxed"
              />
            </div>

            {/* Cover Image URL + Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Cover Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/images/article-cover.jpg"
                  className="w-full flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                />

                <label className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-[#0d1428] px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
                  <UploadCloud size={16} className="text-orange-400" />
                  <span>{isUploadingCover ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Cover Preview */}
              {formData.coverImage && (
                <div className="mt-2 relative max-w-sm rounded-xl overflow-hidden border border-white/10 aspect-[16/9]">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="absolute top-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-[10px] font-bold text-red-400 hover:bg-black"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Rich Content Editor */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
              <FileText size={16} />
              <span>Article Content (Rich Editor)</span>
            </h2>
            <span className="text-[11px] text-slate-400">
              Supports headings, tables, callout blocks, checklists &amp; images
            </span>
          </div>

          <BlogRichEditor
            value={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
            token={token}
          />
        </div>

        {/* Section 4: Author, Tags & Publishing Meta */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <Tag size={16} />
            <span>Author, Tags &amp; Visibility</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Author Name
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500"
              />
            </div>

            {/* Author Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Author Role / Designation
              </label>
              <input
                type="text"
                value={formData.authorRole}
                onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500"
              />
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                placeholder="5 min read"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Keywords / Tags <span className="text-slate-500 font-normal">(Comma-separated)</span>
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="SSC CGL, How to Apply, OTR Registration, Live Photo, Step by Step"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500"
            />
          </div>

          {/* Status & Featured Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div>
                <p className="text-xs font-bold text-white">Publishing Status</p>
                <p className="text-[11px] text-slate-400">
                  {formData.status === 'published' ? 'Live on the website' : 'Saved as private draft'}
                </p>
              </div>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-lg border border-white/10 bg-[#0d1428] px-3 py-1.5 text-xs font-bold text-slate-200 outline-none"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div>
                <p className="text-xs font-bold text-white">Hero Spotlight (Featured)</p>
                <p className="text-[11px] text-slate-400">Show in the prominent Hero banner on /articles</p>
              </div>
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded accent-orange-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Section 5: SEO Meta Tags */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1e] p-5 sm:p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2">
            <Globe size={16} />
            <span>Search Engine Optimization (SEO)</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Meta Title <span className="text-slate-500 font-normal">(Optional — defaults to Article Title)</span>
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="e.g. How to Apply for SSC CGL 2026 — Step-by-Step Registration Guide"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Meta Description <span className="text-slate-500 font-normal">(Optional — defaults to Excerpt)</span>
              </label>
              <textarea
                rows={2}
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="Clear, search-friendly description (150-160 characters)..."
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/admin/articles"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50"
          >
            <Save size={16} />
            <span>{submitting ? 'Saving...' : isEdit ? 'Update & Save Changes' : 'Publish Article Now'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
