import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calculator,
  GraduationCap,
  FileCheck,
  ClipboardList,
  Search,
  Filter,
  MapPin,
  Award,
  BookOpen,
  Calendar,
  Target,
  Users,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Settings,
  HelpCircle,
  Sparkles,
} from 'lucide-react'
import SEOHead from '../components/SEOHead.jsx'
import AgeCalculator from '../components/tools/AgeCalculator.jsx'
import EligibilityChecker from '../components/tools/EligibilityChecker.jsx'
import FeeDatesSummary from '../components/tools/FeeDatesSummary.jsx'
import DocumentChecklist from '../components/tools/DocumentChecklist.jsx'
import { Skeleton } from '../components/Skeleton.jsx'
import { getJobs, getCategories } from '../services/api.js'

const TOOL_CATEGORIES = [
  {
    id: 'calculators',
    label: 'Calculators',
    icon: Calculator,
    color: 'brand',
    tools: [
      { id: 'age-calculator', label: 'Age Calculator', desc: 'Calculate exact age as on reference date for govt job eligibility', icon: Calendar, component: 'AgeCalculator' },
    ]
  },
  {
    id: 'eligibility',
    label: 'Eligibility & Qualifications',
    icon: GraduationCap,
    color: 'emerald',
    tools: [
      { id: 'eligibility-checker', label: 'Eligibility Checker', desc: 'Check if your qualification matches recruitment requirements', icon: GraduationCap, component: 'EligibilityChecker' },
      { id: 'qualification-finder', label: 'Qualification Finder', desc: 'Find recruitments matching your educational qualification', icon: Search, component: 'QualificationFinder' },
    ]
  },
  {
    id: 'application',
    label: 'Application Aids',
    icon: FileCheck,
    color: 'orange',
    tools: [
      { id: 'fee-dates-summary', label: 'Fee & Dates Summary', desc: 'Quick reference for application fees and important dates', icon: CreditCard, component: 'FeeDatesSummary' },
      { id: 'document-checklist', label: 'Document Checklist', desc: 'Interactive checklist for required application documents', icon: FileCheck, component: 'DocumentChecklist' },
      { id: 'application-guide', label: 'Application Process Guide', desc: 'Step-by-step guide for online application process', icon: ClipboardList, component: 'ApplicationGuide' },
    ]
  },
  {
    id: 'search',
    label: 'Search & Discovery',
    icon: Filter,
    color: 'purple',
    tools: [
      { id: 'state-search', label: 'State-wise Job Search', desc: 'Find government jobs by state/UT', icon: MapPin, component: 'StateSearch' },
      { id: 'category-filters', label: 'Category Filters', desc: 'Filter jobs by category (SSC, Banking, Railway, UPSC, etc.)', icon: Filter, component: 'CategoryFilters' },
      { id: 'qualification-search', label: 'Qualification-wise Search', desc: 'Search jobs by educational qualification', icon: Award, component: 'QualificationSearch' },
      { id: 'notification-compare', label: 'Notification Comparison', desc: 'Compare multiple recruitment notifications side by side', icon: ClipboardList, component: 'NotificationCompare' },
    ]
  },
  {
    id: 'tracking',
    label: 'Tracking & Updates',
    icon: Target,
    color: 'rose',
    tools: [
      { id: 'admit-card-tracker', label: 'Admit Card Tracker', desc: 'Track admit card release dates and download links', icon: Calendar, component: 'AdmitCardTracker' },
      { id: 'result-tracker', label: 'Result & Cutoff Tracker', desc: 'Monitor result announcements and cutoff marks', icon: TrendingUp, component: 'ResultTracker' },
      { id: 'answer-key-tracker', label: 'Answer Key Tracker', desc: 'Track answer key releases and objection windows', icon: HelpCircle, component: 'AnswerKeyTracker' },
    ]
  },
  {
    id: 'resources',
    label: 'Preparation Resources',
    icon: BookOpen,
    color: 'blue',
    tools: [
      { id: 'exam-prep-resources', label: 'Exam Preparation Resources', desc: 'Syllabus, previous papers, study material links', icon: BookOpen, component: 'ExamPrepResources' },
      { id: 'career-guidance', label: 'Career Guidance', desc: 'Government job career paths, promotion, salary info', icon: Target, component: 'CareerGuidance' },
      { id: 'syllabus-breakdown', label: 'Syllabus Breakdown', desc: 'Detailed syllabus analysis for major exams', icon: ClipboardList, component: 'SyllabusBreakdown' },
    ]
  },
]

// Placeholder components for tools not yet implemented
function CreditCard({ size = 18, className }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
}

function PlaceholderTool({ tool, job }) {
  return (
    <div className="card p-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
        <tool.icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{tool.label}</h3>
      <p className="text-ink-muted mb-4">{tool.desc}</p>
      <div className="flex items-center justify-center gap-2 text-[12px] text-amber-600">
        <Settings size={14} />
        <span>Coming Soon — Under Development</span>
      </div>
      <p className="mt-3 text-[11px] text-ink-faint">
        This tool is being built to provide genuine value for government job aspirants.
      </p>
    </div>
  )
}

function QualificationFinder({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[1].tools[1]} job={job} />
}
function ApplicationGuide({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[2].tools[2]} job={job} />
}
function StateSearch({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[3].tools[0]} job={job} />
}
function CategoryFilters({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[3].tools[1]} job={job} />
}
function QualificationSearch({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[3].tools[2]} job={job} />
}
function NotificationCompare({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[3].tools[3]} job={job} />
}
function AdmitCardTracker({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[4].tools[0]} job={job} />
}
function ResultTracker({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[4].tools[1]} job={job} />
}
function AnswerKeyTracker({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[4].tools[2]} job={job} />
}
function ExamPrepResources({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[5].tools[0]} job={job} />
}
function CareerGuidance({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[5].tools[1]} job={job} />
}
function SyllabusBreakdown({ job }) {
  return <PlaceholderTool tool={TOOL_CATEGORIES[5].tools[2]} job={job} />
}

const TOOL_COMPONENTS = {
  AgeCalculator,
  EligibilityChecker,
  FeeDatesSummary,
  DocumentChecklist,
  QualificationFinder,
  ApplicationGuide,
  StateSearch,
  CategoryFilters,
  QualificationSearch,
  NotificationCompare,
  AdmitCardTracker,
  ResultTracker,
  AnswerKeyTracker,
  ExamPrepResources,
  CareerGuidance,
  SyllabusBreakdown,
}

export default function ToolsPage() {
  const { search } = useSearchParams()
  const jobId = search.get('job')
  const [job, setJob] = useState(null)
  const [jobLoading, setJobLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('calculators')
  const [activeTool, setActiveTool] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load job if jobId provided
  useEffect(() => {
    if (jobId) {
      setJobLoading(true)
      getJobs({ limit: 1, q: jobId }).then(data => {
        if (data?.length) setJob(data[0])
        setJobLoading(false)
      }).catch(() => setJobLoading(false))
    }
  }, [jobId])

  // Load categories for context
  useEffect(() => {
    getCategories().then(data => setCategories(data || [])).catch(() => {})
  }, [])

  // Auto-select first tool in active category
  useEffect(() => {
    const cat = TOOL_CATEGORIES.find(c => c.id === activeCategory)
    if (cat && cat.tools.length) {
      setActiveTool(cat.tools[0].id)
    }
  }, [activeCategory])

  const CurrentTool = activeTool ? TOOL_COMPONENTS[activeTool] : null

  const filteredTools = TOOL_CATEGORIES.flatMap(cat =>
    cat.tools.filter(t =>
      t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(t => ({ ...t, category: cat.id, categoryLabel: cat.label, categoryColor: cat.color }))
  )

  return (
    <div className="animate-fade-in">
      <SEOHead
        title="Free Tools for Government Job Aspirants — Job Alert X"
        description="Free calculators and tools for govt job preparation: Age calculator, eligibility checker, fee & dates summary, document checklist, state-wise search, qualification finder, admit card/result trackers, and more."
        canonical="https://jobalertx.com/tools"
        keywords="govt job tools, age calculator, eligibility checker, fee calculator, document checklist, sarkari naukri tools, government job preparation"
      />

      {/* Hero Section */}
      <section className="mb-8 rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-600/5 p-6 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
              <Sparkles size={24} />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-ink">Free Tools for Government Job Aspirants</h1>
              <p className="text-sm text-ink-muted">Practical calculators and utilities to simplify your sarkari naukri journey</p>
            </div>
          </div>
          <p className="text-sm text-ink-soft">
            All tools are <strong className="text-ink">free, no login required</strong>, and built specifically for Indian government job aspirants.
            Select a job from the search or use tools standalone with your own data.
          </p>
        </div>
      </section>

      {/* Job Context Banner */}
      {jobLoading ? (
        <div className="mb-6 rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
          <Skeleton.ListItem withIcon={true} lines={2} />
        </div>
      ) : job && (
        <div className="mb-6 rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20 text-brand-600">
                <ClipboardList size={18} />
              </span>
              <div>
                <p className="text-[13px] font-bold text-ink">Active Context: {job.title}</p>
                <p className="text-[12px] text-ink-muted">{job.org} • {job.vacancies || 'Vacancies'} • {job.kind}</p>
              </div>
            </div>
            <Link
              to={`/job/${job.id}`}
              className="btn-ghost text-xs flex items-center gap-1.5"
            >
              <ExternalLink size={12} /> View Full Notification
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar - Categories & Search */}
        <aside className="lg:sticky lg:top-24 space-y-5">
          {/* Search */}
          <div className="card p-4">
            <label className="mb-2 block text-[12px] font-semibold text-ink">Search Tools</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools... (e.g., age, eligibility, fee)"
                className="input-field w-full pl-10 pr-3 rounded-lg border border-hairline bg-surface px-3 py-2 text-[13px] text-ink"
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-[11px] text-brand-600">{filteredTools.length} tool(s) found</p>
            )}
          </div>

          {/* Categories */}
          <div className="card p-3 space-y-1">
            <h3 className="px-2 py-2 text-[11px] font-bold uppercase tracking-wider text-ink-faint">Categories</h3>
            {TOOL_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const toolCount = searchQuery
                ? cat.tools.filter(t =>
                    t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length
                : cat.tools.length

              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setActiveTool(null) }}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? `bg-${cat.color}-500/10 text-${cat.color}-600 border-l-2 border-${cat.color}-500`
                      : 'text-ink-soft hover:bg-subtle hover:text-ink'
                  }`}
                >
                  <Icon size={18} className={`shrink-0 ${activeCategory === cat.id ? `text-${cat.color}-600` : 'text-ink-faint'}`} />
                  <span className="flex-1 truncate">{cat.label}</span>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    activeCategory === cat.id
                      ? `bg-${cat.color}-500 text-white`
                      : 'bg-subtle text-ink-muted'
                  }`}>
                    {toolCount}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Stats */}
          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold uppercase tracking-wider text-ink-faint">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                <p className="text-2xl font-black text-emerald-600">{TOOL_CATEGORIES.flatMap(c => c.tools).length}</p>
                <p className="text-[11px] text-emerald-700">Total Tools</p>
              </div>
              <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-center">
                <p className="text-2xl font-black text-brand-600">100%</p>
                <p className="text-[11px] text-brand-700">Free to Use</p>
              </div>
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-center">
                <p className="text-2xl font-black text-blue-600">No</p>
                <p className="text-[11px] text-blue-700">Login Required</p>
              </div>
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-center">
                <p className="text-2xl font-black text-purple-600">∞</p>
                <p className="text-[11px] text-purple-700">Unlimited Uses</p>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="card p-4">
            <div className="flex items-start gap-3">
              <HelpCircle size={20} className="mt-0.5 shrink-0 text-brand-500" />
              <div className="text-[12px] text-ink-soft space-y-1">
                <p className="font-medium text-ink">How to use these tools</p>
                <p>1. Browse categories on the left</p>
                <p>2. Click a tool to open it</p>
                <p>3. Enter your data or select a job</p>
                <p>4. Get instant results</p>
                <Link to="/contact" className="text-brand-600 underline hover:text-brand-700">Report issues or suggest tools →</Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Tool View */}
        <main className="min-w-0">
          {searchQuery && filteredTools.length === 0 ? (
            <div className="card p-12 text-center">
              <Search size={48} className="mx-auto mb-4 text-ink-faint" />
              <h2 className="text-lg font-bold text-ink mb-2">No tools found</h2>
              <p className="text-ink-muted">Try a different search term or browse categories</p>
            </div>
          ) : activeTool && CurrentTool ? (
            <CurrentTool job={job} isStandalone={!job} />
          ) : (
            <div className="card p-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
                <ToolIcon category={activeCategory} size={32} />
              </div>
              <h2 className="text-xl font-bold text-ink mb-2">Select a Tool</h2>
              <p className="text-ink-muted mb-6">Choose a tool from the sidebar to get started</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-md mx-auto">
                {TOOL_CATEGORIES.find(c => c.id === activeCategory)?.tools.slice(0, 6).map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className="text-left rounded-xl border border-hairline bg-surface p-4 hover:border-brand-500/30 hover:bg-brand-500/5 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <tool.icon size={20} className="mt-0.5 shrink-0 text-brand-500" />
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{tool.label}</p>
                        <p className="text-[12px] text-ink-muted truncate">{tool.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ToolIcon({ category, size = 24 }) {
  const cat = TOOL_CATEGORIES.find(c => c.id === category)
  return cat ? <cat.icon size={size} /> : <Settings size={size} />
}

// Hook for search params (simplified)
function useSearchParams() {
  const [searchParams] = useState(() => new URLSearchParams(window.location.search))
  return { search: searchParams }
}