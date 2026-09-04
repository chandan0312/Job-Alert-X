import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CalendarDays,
  Briefcase,
  GraduationCap,
} from 'lucide-react'
import BrandIcon from './BrandIcon.jsx'

/**
 * Derive the "Start Date" from a job's importantDates array —
 * looks for the Application Begin label.
 */
function getStartDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('begin') ||
      r.label?.toLowerCase().includes('start') ||
      r.label?.toLowerCase().includes('open')
  )
  return d?.value || job.postedOn || job.postedAt || '—'
}

/**
 * Derive the "End Date" — last date to apply.
 */
function getEndDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label?.toLowerCase().includes('last date') ||
      r.label?.toLowerCase().includes('close') ||
      r.label?.toLowerCase().includes('end date')
  )
  return d?.value || '—'
}

/**
 * Known organization abbreviations for common Indian govt exam bodies
 */
const ORG_ABBREVIATIONS = {
  'staff selection commission': 'SSC',
  'institute of banking personnel selection': 'IBPS',
  'railway recruitment board': 'RRB',
  'railway recruitment cell': 'RRC',
  'union public service commission': 'UPSC',
  'reserve bank of india': 'RBI',
  'state bank of india': 'SBI',
  'bank of baroda': 'BOB',
  'bank of india': 'BOI',
  'central bank of india': 'Central Bank',
  'punjab national bank': 'PNB',
  'indian overseas bank': 'IOB',
  'tamilnad mercantile bank': 'TMB',
  'south indian bank': 'SIB',
  'securities and exchange board of india': 'SEBI',
  'central board of secondary education': 'CBSE',
  'national testing agency': 'NTA',
  'border security force': 'BSF',
  'central reserve police force': 'CRPF',
  'central industrial security force': 'CISF',
  'indo-tibetan border police': 'ITBP',
  'sashastra seema bal': 'SSB',
  'defence research and development organisation': 'DRDO',
  'indian space research organisation': 'ISRO',
  'uttar pradesh public service commission': 'UPPSC',
  'bihar public service commission': 'BPSC',
  'rajasthan public service commission': 'RPSC',
  'madhya pradesh public service commission': 'MPPSC',
  'delhi subordinate services selection board': 'DSSSB',
}

/**
 * Return a short, clean organization name
 */
export function getShortOrg(job) {
  if (job.orgShort && job.orgShort.trim().length > 0 && job.orgShort.trim().length <= 16) {
    return job.orgShort.trim()
  }
  const org = (job.org || '').trim()
  const lower = org.toLowerCase()
  if (ORG_ABBREVIATIONS[lower]) {
    return ORG_ABBREVIATIONS[lower]
  }
  for (const [key, abbr] of Object.entries(ORG_ABBREVIATIONS)) {
    if (lower.includes(key)) {
      return abbr
    }
  }
  if (org.length > 24) {
    return `${org.slice(0, 22)}…`
  }
  return org
}

/**
 * Clean & shorten job title for compact table display
 */
export function getShortTitle(job) {
  let title = (job.title || '').trim()
  if (!title) return 'Notification'

  // If title begins with full organization name, strip it to avoid redundancy
  const orgName = (job.org || '').trim()
  if (orgName && title.toLowerCase().startsWith(orgName.toLowerCase())) {
    const stripped = title.slice(orgName.length).trim().replace(/^[-–—:\s]+/, '')
    if (stripped.length >= 14) {
      title = stripped
    }
  }

  // Remove boilerplate suffixes and application noise
  title = title
    .replace(/\s*-\s*Apply Online.*$/i, '')
    .replace(/\s*Apply Online for.*$/i, '')
    .replace(/\s*Online Application Form.*$/i, '')
    .replace(/\s*Online Form.*$/i, '')
    .replace(/\s*Centralized Employment Notice.*$/i, '')
    .replace(/\s*Advt No[\s\S]*$/i, '')
    .replace(/\s*Recruitment \d{4}\s*$/i, '')
    .trim()

  // Clean trailing dashes or commas
  title = title.replace(/[-–—,;:]+$/, '').trim()

  // Keep title concise (≤ 48 chars)
  if (title.length > 46) {
    return `${title.slice(0, 44)}…`
  }
  return title
}

/**
 * Return the shortest accurate eligibility string for card/table views.
 * Priority: eligibilityShort (pre-computed ≤28-char label) → category fallback.
 */
function bestEligibility(job) {
  if (job.eligibilityShort) return job.eligibilityShort
  if (job.eligibility) {
    return job.eligibility.length > 30 ? `${job.eligibility.slice(0, 28)}…` : job.eligibility
  }
  // Category-based fallback if eligibility is missing
  const cat = (job.category || '').toLowerCase()
  if (cat === 'railway')  return '10th / ITI / Diploma'
  if (cat === 'police')   return '12th Pass'
  if (cat === 'defence')  return '10+2 / PCM'
  if (cat === 'teaching') return 'B.Ed / Post Graduate'
  if (cat === 'banking')  return 'Degree / Graduate'
  if (cat === 'ssc')      return '10th / 12th / Graduate'
  if (cat === 'upsc')     return 'Bachelor Degree'
  return 'Graduation'
}

export default function RecentJobsTable({
  jobs = [],
  viewAllTo = '/latest/job',
  viewAllText = 'View All Jobs',
  showFooter = true,
}) {
  return (
    <div className="rjt-wrapper">
      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="rjt-table">
          <thead>
            <tr className="rjt-head-row">
              <th className="rjt-th rjt-th-job">
                <span className="rjt-th-inner"><Briefcase size={13} /> Job / Org</span>
              </th>
              <th className="rjt-th">
                <span className="rjt-th-inner"><CalendarDays size={13} /> Start Date</span>
              </th>
              <th className="rjt-th">
                <span className="rjt-th-inner"><CalendarDays size={13} /> End Date</span>
              </th>
              <th className="rjt-th">
                <span className="rjt-th-inner">Posts</span>
              </th>
              <th className="rjt-th">
                <span className="rjt-th-inner"><GraduationCap size={13} /> Eligibility</span>
              </th>
              <th className="rjt-th rjt-th-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-ink-muted">
                  No active notifications available yet.
                </td>
              </tr>
            ) : (
              jobs.map((job, idx) => (
                <tr key={job.id} className={`rjt-row ${idx % 2 === 1 ? 'rjt-row-alt' : ''}`}>
                  {/* Job / Org */}
                  <td className="rjt-td rjt-td-job">
                    <div className="rjt-job-cell">
                      <BrandIcon icon={job.logo?.icon || 'landmark'} color={job.logo?.color || '#5558e6'} size={34} square />
                      <div className="rjt-job-info">
                        <Link to={`/job/${job.id}`} className="rjt-job-title" title={job.title}>
                          {getShortTitle(job)}
                        </Link>
                        <span className="rjt-job-org" title={job.org}>
                          {getShortOrg(job)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="rjt-td rjt-date">{getStartDate(job)}</td>

                  {/* End Date */}
                  <td className="rjt-td rjt-date rjt-date-end">{getEndDate(job)}</td>

                  {/* Posts / Vacancies */}
                  <td className="rjt-td">
                    {job.vacancies ? (
                      <span className="rjt-vacancies">
                        {Number(job.vacancies).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="rjt-vacancies-na">—</span>
                    )}
                  </td>

                  {/* Eligibility */}
                  <td className="rjt-td rjt-eligibility">
                    {bestEligibility(job)}
                  </td>

                  {/* Action */}
                  <td className="rjt-td rjt-td-center">
                    <Link
                      to={`/job/${job.id}`}
                      className="rjt-apply-btn"
                      aria-label={`Apply for ${job.title}`}
                    >
                      Apply Now
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── View All footer ── */}
      {showFooter && viewAllTo && jobs.length > 0 && (
        <div className="rjt-footer">
          <Link to={viewAllTo} className="rjt-view-all">
            {viewAllText}
            <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </div>
  )
}
