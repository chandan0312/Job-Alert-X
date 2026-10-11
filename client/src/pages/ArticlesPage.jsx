// ---------------------------------------------------------------------------
// ArticlesPage.jsx — Public Article & Career Blog Hub
// ---------------------------------------------------------------------------

import { useState, useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  BookOpen,
  Search,
  Clock,
  Eye,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileText,
  Compass,
  Download,
  GraduationCap,
  Award,
  ShieldCheck,
  Tag,
  ChevronRight,
} from 'lucide-react'
import { getArticles } from '../services/api.js'
import SEOHead from '../components/SEOHead.jsx'
import { CATEGORY_BADGES } from '../data/articleConstants.js'

const CATEGORY_TABS = [
  { id: 'all', label: 'All Articles', icon: Compass, color: 'from-orange-500 to-amber-500' },
  { id: 'how-to-apply', label: 'How to Apply', icon: FileText, color: 'from-emerald-500 to-teal-500' },
  { id: 'how-to-download', label: 'How to Download', icon: Download, color: 'from-blue-500 to-cyan-500' },
  { id: 'strategy', label: 'Exam Strategy', icon: GraduationCap, color: 'from-purple-500 to-indigo-500' },
  { id: 'syllabus', label: 'Syllabus Breakdown', icon: BookOpen, color: 'from-pink-500 to-rose-500' },
  { id: 'result', label: 'Results & Cut-off', icon: Award, color: 'from-amber-500 to-orange-500' },
  { id: 'documentation', label: 'Document Verification', icon: ShieldCheck, color: 'from-sky-500 to-blue-600' },
  { id: 'job-guide', label: 'Job & Career Guides', icon: Sparkles, color: 'from-violet-500 to-purple-600' },
]

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)

    const params = {}
    if (activeCategory !== 'all') params.category = activeCategory
    if (searchQuery.trim()) params.q = searchQuery.trim()

    getArticles(params)
      .then((res) => {
        if (active) {
          setArticles(res?.articles || [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Failed to load articles')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [activeCategory, searchQuery])

  const setCategory = (cat) => {
    if (cat === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', cat)
    }
    setSearchParams(searchParams)
  }

  // Find the primary featured article
  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0]
  }, [articles])

  // Rest of the articles excluding the top featured hero if on 'all'
  const feedArticles = useMemo(() => {
    if (activeCategory === 'all' && featuredArticle) {
      return articles.filter((a) => a.id !== featuredArticle.id)
    }
    return articles
  }, [articles, activeCategory, featuredArticle])

  const seoSchemas = [
    {
      '@type': 'CollectionPage',
      name: 'Govt Job Articles, Exam Guides, Strategy & Download Instructions',
      url: 'https://jobalertx.com/articles',
      description: 'Expert articles on how to apply online, admit card download steps, document verification checklist, exam strategy and syllabus breakdowns for central and state exams.',
    },
  ]

  return (
    <div className="min-w-0 space-y-8 animate-fade-in pb-12">
      <SEOHead
        title="Articles & Career Guides 2026 — How to Apply, Strategy, Syllabus & Results"
        description="Comprehensive guides on government job applications, step-by-step registration tutorials, admit card downloads, syllabus details, exam preparation strategies, and certificate verification."
        keywords="govt job blog, how to apply online, admit card download, exam strategy, syllabus breakdown, document verification, ssc cgl guide, rrb admit card download"
        canonical="https://jobalertx.com/articles"
        jsonLd={seoSchemas}
      />

      {/* === HEADER HERO BANNER === */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c142c] via-[#080d1e] to-[#120f2e] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-400">
            <Sparkles size={14} />
            <span>Job Alert X Knowledge Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Articles, Guides &amp; <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Preparation Strategies
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Everything you need to successfully navigate government recruitment: step-by-step application walkthroughs, admit card instructions, syllabus blueprints, and document verification checklists.
          </p>

          {/* Instant Search Bar */}
          <div className="pt-2 max-w-xl">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g. How to Apply, Admit Card, OBC Certificate, Syllabus)..."
                className="w-full rounded-2xl border border-white/15 bg-white/[0.07] pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none backdrop-blur-md transition-all focus:border-orange-500 focus:bg-white/[0.1] focus:ring-2 focus:ring-orange-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-xs font-bold text-slate-400 hover:text-white px-2 py-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* === CATEGORY NAVIGATION TABS === */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeCategory === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setCategory(tab.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                    : 'bg-[#0d1428] text-slate-300 border border-white/[0.08] hover:border-orange-500/40 hover:text-white'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* === FEATURED HERO ARTICLE (Shown when on "All" without active search query) === */}
      {activeCategory === 'all' && !searchQuery && featuredArticle && (
        <section className="relative group overflow-hidden rounded-3xl border border-white/10 bg-[#090e21] shadow-xl hover:border-orange-500/30 transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 sm:p-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  <Sparkles size={13} />
                  Featured Spotlight
                </span>
                <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold border ${CATEGORY_BADGES[featuredArticle.category]?.bg || 'bg-white/10 text-white border-white/20'}`}>
                  {CATEGORY_BADGES[featuredArticle.category]?.label || featuredArticle.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={13} />
                  {featuredArticle.readTime}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white group-hover:text-orange-400 transition-colors leading-snug">
                <Link to={`/article/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold">
                    {featuredArticle.author?.charAt(0) || 'J'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{featuredArticle.author}</p>
                    <p className="text-[11px] text-slate-400">{featuredArticle.authorRole || 'Author'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-auto sm:ml-0">
                  <Eye size={14} />
                  <span>{Number(featuredArticle.views || 0).toLocaleString('en-IN')} views</span>
                </div>

                <Link
                  to={`/article/${featuredArticle.slug}`}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-500/30 transition-all hover:gap-3"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 overflow-hidden rounded-2xl aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] relative">
              <img
                src={featuredArticle.coverImage || 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80'}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090e21] via-transparent to-transparent opacity-60" />
            </div>
          </div>
        </section>
      )}

      {/* === ARTICLES GRID === */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              {activeCategory === 'all' ? 'Latest Guides & Articles' : CATEGORY_TABS.find((t) => t.id === activeCategory)?.label}
            </h2>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-bold text-orange-400">
              {feedArticles.length}
            </span>
          </div>

          {searchQuery && (
            <p className="text-xs text-slate-400">
              Showing results for &ldquo;<span className="text-orange-400 font-semibold">{searchQuery}</span>&rdquo;
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-white/[0.03] animate-pulse border border-white/5" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-red-400">
            <p className="font-semibold">{error}</p>
          </div>
        ) : feedArticles.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#0a0f24] py-16 px-4 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-slate-400">
              <Search size={24} />
            </div>
            <h3 className="text-base font-bold text-white">No articles found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find any articles matching your search query or selected category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setCategory('all')
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedArticles.map((article) => {
              const badge = CATEGORY_BADGES[article.category] || {
                label: article.category,
                bg: 'bg-white/10 text-white border-white/20',
              }

              return (
                <article
                  key={article.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#090e21] shadow-lg hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Cover image */}
                  <Link to={`/article/${article.slug}`} className="relative aspect-[16/9] w-full overflow-hidden block">
                    <img
                      src={article.coverImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090e21] via-transparent to-transparent opacity-80" />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-extrabold border backdrop-blur-md ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    {/* Read time */}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10.5px] font-semibold text-slate-200">
                        <Clock size={12} />
                        {article.readTime}
                      </span>
                    </div>
                  </Link>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-[15px] font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                      <Link to={`/article/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">
                      {article.excerpt}
                    </p>

                    {/* Tags preview */}
                    {Array.isArray(article.tags) && article.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center text-[10px] font-medium text-slate-400 bg-white/[0.04] rounded-md px-2 py-0.5"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Card Footer */}
                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11.5px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="h-5 w-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                          {article.author?.charAt(0) || 'J'}
                        </div>
                        <span className="font-semibold text-slate-300 truncate max-w-[120px]">
                          {article.author}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Eye size={13} />
                        <span>{Number(article.views || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
