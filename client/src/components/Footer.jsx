import { Link } from 'react-router-dom'

const COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Latest Jobs', to: '/latest/job' },
      { label: 'Admit Cards', to: '/latest/admit-card' },
      { label: 'Results', to: '/latest/result' },
      { label: 'Answer Keys', to: '/latest/answer-key' },
      { label: 'Syllabus', to: '/latest/syllabus' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'SSC', to: '/category/ssc' },
      { label: 'UPSC', to: '/category/upsc' },
      { label: 'Banking', to: '/category/banking' },
      { label: 'Railway', to: '/category/railway' },
      { label: 'Defence', to: '/category/defence' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/exams' },
      { label: 'Contact', to: '/exams' },
      { label: 'Privacy Policy', to: '/exams' },
      { label: 'Disclaimer', to: '/exams' },
      { label: 'Admin', to: '/admin' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-hairline bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 10 L12 5 L20 10" />
                  <line x1="3.5" y1="19" x2="20.5" y2="19" />
                  <line x1="7" y1="11" x2="7" y2="18" />
                  <line x1="11" y1="11" x2="11" y2="18" />
                  <line x1="15" y1="11" x2="15" y2="18" />
                  <line x1="18" y1="11" x2="18" y2="18" />
                </svg>
              </span>
              <span className="text-[16px] font-extrabold tracking-tight text-ink">
                Job Alert <span className="text-purple-500">X</span>
              </span>
            </div>
            <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-ink-muted">
              One place for the latest government job notifications, admit cards, results and exam
              updates across India.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow mb-3">{col.title}</h2>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[13px] text-ink-muted transition-colors hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-col gap-2 border-t border-hairline pt-6 text-[12px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Job Alert X. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">
            Disclaimer: This is a demo portal. Always verify details on the official government
            website before applying.
          </p>
        </div>
      </div>
    </footer>
  )
}
