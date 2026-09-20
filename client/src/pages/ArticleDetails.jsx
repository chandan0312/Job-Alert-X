// ---------------------------------------------------------------------------
// ArticleDetails.jsx — Rich Reader View for Articles & Guides
// ---------------------------------------------------------------------------

import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Clock,
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Check,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  Tag,
  BookOpen,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Send,
  Twitter,
} from 'lucide-react'
import { getArticleBySlug } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import RichContentRenderer from '../components/RichContentRenderer.jsx'
import { CATEGORY_BADGES } from '../data/articleConstants.js'

export default function ArticleDetails() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    getArticleBySlug(slug)
      .then((res) => {
        if (active) {
          setData(res)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Article not found')
          setLoading(false)
        }
      })

    window.scrollTo({ top: 0, behavior: 'instant' })

    return () => {
      active = false
    }
  }, [slug])

  const article = data?.article
  const related = data?.related || []

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = article?.title || 'Govt Job Article'

  const shareWhatsapp = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle} - Read more: ${shareUrl}`)}`
  const shareTelegram = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`
  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 py-8">
        <div className="h-6 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-12 w-3/4 rounded-2xl bg-white/5 animate-pulse" />
        <div className="h-96 rounded-3xl bg-white/5 animate-pulse" />
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <BookOpen size={32} />
        </div>
        <h2 className="text-xl font-bold text-white">Article Not Found</h2>
        <p className="text-sm text-slate-400">
          {error || "The article you are looking for doesn't exist or has been relocated."}
        </p>
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Articles</span>
        </Link>
      </div>
    )
  }

  const badge = CATEGORY_BADGES[article.category] || {
    label: article.category,
    bg: 'bg-white/10 text-white border-white/20',
  }

  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const articleSchema = [
    {
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt || article.metaDescription,
      image: article.coverImage ? [article.coverImage] : undefined,
      datePublished: article.createdAt,
      dateModified: article.updatedAt,
      author: {
        '@type': 'Person',
        name: article.author || 'Job Alert X Team',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Job Alert X',
        logo: 'https://jobalertx.com/favicon.svg',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://jobalertx.com/article/${article.slug}`,
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jobalertx.com/' },
        { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://jobalertx.com/articles' },
        { '@type': 'ListItem', position: 3, name: article.title, item: `https://jobalertx.com/article/${article.slug}` },
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in pb-16">
      <SEOHead
        title={article.metaTitle || `${article.title} — Job Alert X`}
        description={article.metaDescription || article.excerpt}
        keywords={Array.isArray(article.tags) ? article.tags.join(', ') : 'govt job article, job guide, how to apply'}
        canonical={`https://jobalertx.com/article/${article.slug}`}
        jsonLd={articleSchema}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto py-1">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight size={13} className="text-slate-600 shrink-0" />
        <Link to="/articles" className="hover:text-white transition-colors">Articles</Link>
        <ChevronRight size={13} className="text-slate-600 shrink-0" />
        <Link to={`/articles?category=${article.category}`} className="hover:text-orange-400 transition-colors font-medium">
          {badge.label}
        </Link>
        <ChevronRight size={13} className="text-slate-600 shrink-0" />
        <span className="text-slate-200 font-semibold truncate max-w-[240px] sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* Header section */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/articles?category=${article.category}`}
            className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold border backdrop-blur-md transition-opacity hover:opacity-80 ${badge.bg}`}
          >
            {badge.label}
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={14} className="text-orange-400" />
            {article.readTime}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar size={14} className="text-indigo-400" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto">
            <Eye size={14} className="text-emerald-400" />
            {Number(article.views || 0).toLocaleString('en-IN')} views
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal border-l-2 border-orange-500/50 pl-4 py-1">
            {article.excerpt}
          </p>
        )}

        {/* Author info & Quick Share Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-b border-white/[0.08] py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 text-white font-bold text-sm shadow-md">
              {article.author?.charAt(0) || 'J'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white">{article.author}</p>
                <ShieldCheck size={14} className="text-sky-400" title="Verified Editorial Author" />
              </div>
              <p className="text-[11px] text-slate-400">{article.authorRole || 'Recruitment Analyst'}</p>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 mr-1 hidden sm:inline">Share:</span>
            
            <a
              href={shareWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
              title="Share on WhatsApp"
            >
              <MessageCircle size={16} />
            </a>

            <a
              href={shareTelegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0088cc]/20 text-[#0088cc] hover:bg-[#0088cc] hover:text-white transition-colors"
              title="Share on Telegram"
            >
              <Send size={15} />
            </a>

            <a
              href={shareTwitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 hover:bg-sky-500 hover:text-white transition-colors"
              title="Share on X / Twitter"
            >
              <Twitter size={15} />
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              title="Copy Article Link"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} />
                  <span className="text-[11px]">Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Cover Image */}
      {article.coverImage && (
        <div className="relative overflow-hidden rounded-3xl aspect-[16/9] w-full border border-white/10 shadow-2xl">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-transparent to-transparent opacity-40" />
        </div>
      )}

      {/* Main Content Area */}
      <article className="article-content prose prose-invert max-w-none space-y-6 text-slate-200 text-sm sm:text-base leading-relaxed">
        {article.content ? (
          <RichContentRenderer content={article.content} />
        ) : (
          <p className="text-slate-400 italic">No detailed content available for this article.</p>
        )}
      </article>

      {/* Tags Section */}
      {Array.isArray(article.tags) && article.tags.length > 0 && (
        <section className="border-t border-white/[0.08] pt-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Tag size={14} />
            <span>Related Topics &amp; Keywords</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, i) => (
              <Link
                key={i}
                to={`/articles?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-[#0c1224] px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-orange-500/50 hover:text-orange-400 transition-colors"
              >
                <span>#{tag}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Author Bio Box */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c142c] via-[#090e21] to-[#0c142c] p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-orange-500 text-white font-black text-xl shadow-lg">
            {article.author?.charAt(0) || 'J'}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{article.author}</h3>
              <span className="rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 px-2 py-0.5 text-[10px] font-bold">
                Editorial Staff
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Published by the Job Alert X Editorial Desk. We thoroughly verify official recruitment notifications, rules, and government gazettes to ensure accurate candidate guidance.
            </p>
          </div>
        </div>
      </section>

      {/* Related Articles Carousel / Grid */}
      {related.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-orange-400" />
              <span>Related Guides &amp; Articles</span>
            </h2>
            <Link to="/articles" className="text-xs font-bold text-orange-400 hover:underline">
              View All Articles
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((rel) => (
              <Link
                key={rel.id}
                to={`/article/${rel.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090e21] p-4 hover:border-orange-500/40 hover:-translate-y-0.5 transition-all duration-200"
              >
                {rel.coverImage && (
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl mb-3">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                  {rel.title}
                </h4>
                <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{rel.readTime || '5 min read'}</span>
                  <span className="font-semibold text-orange-400 group-hover:translate-x-0.5 transition-transform">
                    Read Guide →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back button */}
      <div className="pt-4 text-center">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Explore More Articles &amp; Guides</span>
        </Link>
      </div>
    </div>
  )
}
