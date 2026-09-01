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
      r.label.toLowerCase().includes('begin') ||
      r.label.toLowerCase().includes('start') ||
      r.label.toLowerCase().includes('open')
  )
  return d?.value || job.postedOn || '—'
}

/**
 * Derive the "End Date" — last date to apply.
 */
function getEndDate(job) {
  const d = job.importantDates?.find(
    (r) =>
      r.label.toLowerCase().includes('last date') ||
      r.label.toLowerCase().includes('close') ||
      r.label.toLowerCase().includes('end date')
  )
  return d?.value || '—'
}

/**
 * Return the shortest accurate eligibility string for card/table views.
 * Priority: eligibilityShort (pre-computed ≤28-char label) → category fallback.
 */
function bestEligibility(job) {
  if (job.eligibilityShort) return job.eligibilityShort
  // Category-based fallback if eligibilityShort is missing
  const cat = (job.category || '').toLowerCase()
  if (cat === 'railway')  return '10th / ITI / Diploma'
  if (cat === 'police')   return '12th Pass'
  if (cat === 'defence')  return '10+2 / PCM'
  if (cat === 'teaching') return 'B.Ed / Post Graduate'
  return 'Graduation'
}

export default function RecentJobsTable({ jobs = [], viewAllTo = '/latest/job' }) {
  return (
    <div className="rjt-wrapper">
      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="rjt-table">
          <thead>
            <tr className="rjt-head-row">
              <th className="rjt-th rjt-th-job">
                <span className="rjt-th-inner"><Briefcase size={13} /> Job / Organization</span>
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
            {jobs.map((job, idx) => (
              <tr key={job.id} className={`rjt-row ${idx % 2 === 1 ? 'rjt-row-alt' : ''}`}>
                {/* Job / Org */}
                <td className="rjt-td rjt-td-job">
                  <div className="rjt-job-cell">
                    <BrandIcon icon={job.logo.icon} color={job.logo.color} size={36} square />
                    <div className="rjt-job-info">
                      <Link to={`/job/${job.id}`} className="rjt-job-title">
                        {job.title}
                      </Link>
                      <span className="rjt-job-org" title={job.org}>{job.org}</span>
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
                      {job.vacancies.toLocaleString('en-IN')}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* ── View All footer ── */}
      <div className="rjt-footer">
        <Link to={viewAllTo} className="rjt-view-all">
          View All Jobs
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </div>
  )
}
