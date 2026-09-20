// ---------------------------------------------------------------------------
// articleConstants.js — Shared constants & badge styling for Articles
// ---------------------------------------------------------------------------

export const ARTICLE_CATEGORIES = [
  { id: 'all', label: 'All Articles' },
  { id: 'how-to-apply', label: 'How to Apply' },
  { id: 'how-to-download', label: 'How to Download' },
  { id: 'strategy', label: 'Exam Strategy' },
  { id: 'syllabus', label: 'Syllabus Breakdown' },
  { id: 'result', label: 'Results & Cut-off' },
  { id: 'documentation', label: 'Document Verification' },
  { id: 'job-guide', label: 'Job & Career Guides' },
]

export const CATEGORY_BADGES = {
  'how-to-apply': { label: 'How to Apply', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  'how-to-download': { label: 'How to Download', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  strategy: { label: 'Strategy & Tips', bg: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
  syllabus: { label: 'Syllabus', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  result: { label: 'Result & Cut-off', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  documentation: { label: 'Documentation', bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  'job-guide': { label: 'Job Guide', bg: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
  general: { label: 'Career Guide', bg: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
}
