import { useState, useMemo } from 'react'
import { GraduationCap, Award, CheckCircle, XCircle, HelpCircle, Search } from 'lucide-react'

/**
 * EligibilityChecker — Helps candidates quickly check if they meet educational qualification requirements
 * Supports matching against common qualification patterns
 */
export default function EligibilityChecker({ job, isStandalone = false }) {
  const [userQualification, setUserQualification] = useState('')
  const [userCategory, setUserCategory] = useState('general')
  const [result, setResult] = useState(null)

  // Common qualification categories
  const qualificationOptions = [
    { value: '10th', label: '10th Pass / Matriculation / SSC' },
    { value: '12th', label: '12th Pass / HSC / Intermediate' },
    { value: 'diploma', label: 'Diploma (Engineering/Technical)' },
    { value: 'iti', label: 'ITI / NCVT / SCVT' },
    { value: 'graduate', label: 'Any Graduate (BA, BSc, BCom, etc.)' },
    { value: 'btech', label: 'B.Tech / B.E. (Engineering)' },
    { value: 'bsc', label: 'B.Sc (Science)' },
    { value: 'bcom', label: 'B.Com (Commerce)' },
    { value: 'mba', label: 'MBA / PGDM' },
    { value: 'mca', label: 'MCA' },
    { value: 'msc', label: 'M.Sc (Science)' },
    { value: 'ma', label: 'M.A (Arts)' },
    { value: 'mcom', label: 'M.Com (Commerce)' },
    { value: 'mtech', label: 'M.Tech / M.E. (Engineering)' },
    { value: 'phd', label: 'Ph.D / Doctorate' },
    { value: 'ca', label: 'CA / CS / CMA' },
    { value: 'llb', label: 'LLB / Law Graduate' },
    { value: 'bed', label: 'B.Ed / Teaching' },
    { value: 'med', label: 'M.Ed / Master of Education' },
    { value: 'mbbs', label: 'MBBS / Medical' },
    { value: 'mdms', label: 'MD / MS / PG Medical' },
  ]

  // Category options for relaxation
  const categoryOptions = [
    { value: 'general', label: 'General / UR', relaxation: 0 },
    { value: 'ews', label: 'EWS', relaxation: 0 },
    { value: 'obc', label: 'OBC (NCL)', relaxation: 3 },
    { value: 'sc', label: 'SC', relaxation: 5 },
    { value: 'st', label: 'ST', relaxation: 5 },
    { value: 'pwd', label: 'PwD', relaxation: 10 },
    { value: 'exservicemen', label: 'Ex-Servicemen', relaxation: 3 },
  ]

  // Parse job eligibility requirements
  const jobRequirements = useMemo(() => {
    if (!job?.eligibility && !job?.eligibilityShort && !job?.posts?.length) return null

    const allText = [
      job?.eligibility,
      job?.eligibilityShort,
      ...(job?.posts?.map(p => p.eligibility) || []),
      ...(job?.posts?.map(p => p.name) || [])
    ].filter(Boolean).join(' ').toLowerCase()

    // Extract qualification patterns
    const foundQuals = []
    const patterns = [
      { pattern: /\b(10th|10\s*th|matric|ssc|class\s*10)\b/i, key: '10th', label: '10th Pass' },
      { pattern: /\b(12th|12\s*th|hsc|intermediate|class\s*12)\b/i, key: '12th', label: '12th Pass' },
      { pattern: /\bdiploma\b/i, key: 'diploma', label: 'Diploma' },
      { pattern: /\b(iti|n\.?c\.?v\.?t|s\.?c\.?v\.?t)\b/i, key: 'iti', label: 'ITI' },
      { pattern: /\b(any\s*graduate|graduate|graduation|degree)\b/i, key: 'graduate', label: 'Any Graduate' },
      { pattern: /\b(b\.?tech|b\.?e\.?|bachelor\s*of\s*technology|bachelor\s*of\s*engineering)\b/i, key: 'btech', label: 'B.Tech / B.E.' },
      { pattern: /\b(b\.?sc|bachelor\s*of\s*science)\b/i, key: 'bsc', label: 'B.Sc' },
      { pattern: /\b(b\.?com|bachelor\s*of\s*commerce)\b/i, key: 'bcom', label: 'B.Com' },
      { pattern: /\b(mba|pgdm)\b/i, key: 'mba', label: 'MBA / PGDM' },
      { pattern: /\b(mca|master\s*of\s*computer\s*application)\b/i, key: 'mca', label: 'MCA' },
      { pattern: /\b(m\.?sc|master\s*of\s*science)\b/i, key: 'msc', label: 'M.Sc' },
      { pattern: /\b(m\.?a|master\s*of\s*arts)\b/i, key: 'ma', label: 'M.A' },
      { pattern: /\b(m\.?com|master\s*of\s*commerce)\b/i, key: 'mcom', label: 'M.Com' },
      { pattern: /\b(m\.?tech|m\.?e\.?|master\s*of\s*technology|master\s*of\s*engineering)\b/i, key: 'mtech', label: 'M.Tech / M.E.' },
      { pattern: /\b(ph\.?d|doctorate)\b/i, key: 'phd', label: 'Ph.D' },
      { pattern: /\b(ca|cs|cma|chartered\s*accountant|company\s*secretary|cost\s*accountant)\b/i, key: 'ca', label: 'CA / CS / CMA' },
      { pattern: /\b(llb|law\s*graduate|bachelor\s*of\s*law)\b/i, key: 'llb', label: 'LLB' },
      { pattern: /\b(b\.?ed|bachelor\s*of\s*education)\b/i, key: 'bed', label: 'B.Ed' },
      { pattern: /\b(m\.?ed|master\s*of\s*education)\b/i, key: 'med', label: 'M.Ed' },
      { pattern: /\b(mbbs|bachelor\s*of\s*medicine)\b/i, key: 'mbbs', label: 'MBBS' },
      { pattern: /\b(md|ms|dm|m\.?ch|pg\s*medical)\b/i, key: 'mdms', label: 'MD / MS / PG Medical' },
    ]

    patterns.forEach(({ pattern, key, label }) => {
      if (pattern.test(allText)) {
        foundQuals.push({ key, label })
      }
    })

    // Check for "or" / "and" logic
    const hasOr = /\bor\b/i.test(allText)
    const hasAnd = /\band\b/i.test(allText)

    return {
      text: job?.eligibility || job?.eligibilityShort || '',
      qualifications: foundQuals,
      logic: hasAnd ? 'and' : hasOr ? 'or' : 'or', // default to OR if not specified
      rawText: allText
    }
  }, [job])

  const checkEligibility = () => {
    if (!userQualification) {
      setResult({ matched: false, message: 'Please select your qualification' })
      return
    }

    if (!jobRequirements) {
      setResult({
        matched: null,
        message: 'No eligibility criteria found in this notification. Please check the official notification.'
      })
      return
    }

    const userQualKey = userQualification
    const userQualLabel = qualificationOptions.find(q => q.value === userQualification)?.label || userQualification

    // Hierarchy: higher qualifications include lower ones in some cases
    const qualificationHierarchy = {
      'phd': ['phd', 'mdms', 'mtech', 'msc', 'mcom', 'ma', 'mca', 'mba', 'mcom', 'btech', 'bsc', 'bcom', 'graduate', 'ca', 'llb'],
      'mdms': ['mdms', 'mbbs'],
      'mtech': ['mtech', 'btech'],
      'msc': ['msc', 'bsc', 'graduate'],
      'mcom': ['mcom', 'bcom', 'graduate'],
      'ma': ['ma', 'graduate'],
      'mca': ['mca', 'bca', 'graduate'],
      'mba': ['mba', 'graduate'],
      'ca': ['ca', 'bcom', 'graduate'],
      'llb': ['llb', 'graduate'],
      'bed': ['bed', 'graduate'],
      'med': ['med', 'bed', 'graduate'],
      'mbbs': ['mbbs'],
      'btech': ['btech', 'diploma'],
      'bsc': ['bsc', 'graduate'],
      'bcom': ['bcom', 'graduate'],
      'graduate': ['graduate', '12th'],
      'diploma': ['diploma', '10th', 'iti'],
      'iti': ['iti', '10th'],
      '12th': ['12th', '10th'],
      '10th': ['10th'],
    }

    const acceptedQuals = qualificationHierarchy[userQualKey] || [userQualKey]
    const matched = jobRequirements.qualifications.some(req => acceptedQuals.includes(req.key))

    const categoryRelaxation = categoryOptions.find(c => c.value === userCategory)?.relaxation || 0

    setResult({
      matched,
      userQualification: userQualLabel,
      userCategory: categoryOptions.find(c => c.value === userCategory)?.label || userCategory,
      requiredQuals: jobRequirements.qualifications.map(q => q.label).join(', ') || 'Check official notification',
      logic: jobRequirements.logic,
      relaxationNote: categoryRelaxation > 0 ? `Age relaxation: +${categoryRelaxation} years for ${categoryOptions.find(c => c.value === userCategory)?.label}` : 'No age relaxation for General category',
      message: matched
        ? `✅ You MAY be eligible! Your qualification (${userQualLabel}) matches the requirement.`
        : `⚠️ Your qualification (${userQualLabel}) may not match the stated requirement (${jobRequirements.qualifications.map(q => q.label).join(' / ') || 'Check official notification'}). Please verify from official notification.`
    })
  }

  if (isStandalone && !jobRequirements) {
    return (
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 text-orange-600">
          <HelpCircle size={16} />
          <span className="font-medium">Select a recruitment notification to check eligibility</span>
        </div>
      </div>
    )
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
          <GraduationCap size={18} />
        </span>
        <h2 className="text-[15px] font-bold text-ink">Eligibility Checker</h2>
      </div>

      <p className="mb-4 text-[13px] text-ink-muted">
        Check if your educational qualification matches the requirements for this recruitment.
        Select your highest qualification and category for accurate assessment.
      </p>

      {jobRequirements && (
        <div className="mb-4 p-3 rounded-lg border border-brand-500/30 bg-brand-500/10">
          <p className="text-[12px] font-semibold text-brand-600 mb-1">Notification Requirements:</p>
          <p className="text-[13px] text-ink">{jobRequirements.qualifications.length > 0
            ? jobRequirements.qualifications.map(q => q.label).join(' / ')
            : jobRequirements.text || 'Check official notification'
          }</p>
          <p className="text-[11px] text-brand-600 mt-1">Logic: {jobRequirements.logic.toUpperCase()} (any one of the above typically sufficient)</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block mb-1.5 text-[13px] font-medium text-ink">Your Highest Qualification *</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={16} />
            <select
              value={userQualification}
              onChange={(e) => setUserQualification(e.target.value)}
              className="input-field w-full pl-10 pr-10 rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[14px] text-ink appearance-none cursor-pointer"
            >
              <option value="">Select your qualification</option>
              {qualificationOptions.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block mb-1.5 text-[13px] font-medium text-ink">Your Category (for age relaxation)</label>
          <select
            value={userCategory}
            onChange={(e) => setUserCategory(e.target.value)}
            className="input-field w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[14px] text-ink appearance-none cursor-pointer"
          >
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>{c.label}{c.relaxation ? ` (+${c.relaxation} yrs)` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={checkEligibility}
        className="btn-primary w-full sm:w-auto"
        disabled={!userQualification}
      >
        <GraduationCap size={16} className="mr-2" />
        Check Eligibility
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <div
            className={`rounded-xl p-4 flex items-start gap-3 ${
              result.matched === true ? 'bg-emerald-500/10 border border-emerald-500/30' :
              result.matched === false ? 'bg-amber-500/10 border border-amber-500/30' :
              'bg-blue-500/10 border border-blue-500/30'
            }`}
          >
            <div className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-lg ${
              result.matched === true ? 'bg-emerald-500 text-white' :
              result.matched === false ? 'bg-amber-500 text-white' :
              'bg-blue-500 text-white'
            }`}>
              {result.matched === true ? <CheckCircle size={18} /> : result.matched === false ? <XCircle size={18} /> : <HelpCircle size={18} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[13px] font-semibold ${result.matched === true ? 'text-emerald-700' : result.matched === false ? 'text-amber-700' : 'text-blue-700'}`}>
                {result.matched === true ? 'Likely Eligible' : result.matched === false ? 'May Not Be Eligible' : 'Unable to Determine'}
              </p>
              <p className="mt-1 text-[13px] text-ink-soft">{result.message}</p>
            </div>
          </div>

          {result.matched !== null && (
            <div className="rounded-lg border border-hairline bg-subtle/30 p-3 text-[12px] text-ink-soft">
              <p><strong>Your Qualification:</strong> {result.userQualification}</p>
              <p><strong>Your Category:</strong> {result.userCategory}</p>
              <p><strong>Required:</strong> {result.requiredQuals}</p>
              <p><strong>{result.relaxationNote}</strong></p>
            </div>
          )}

          <div className="rounded-xl border border-hairline bg-subtle/30 p-3 text-[11px] text-ink-muted">
            <strong className="text-ink">⚠️ Important Disclaimer:</strong>
            <ul className="mt-1.5 list-disc list-inside space-y-1">
              <li>This is an automated check based on parsed notification text — not an official determination</li>
              <li>Some posts require specific specializations (e.g., B.Tech in Civil, Electrical, Mechanical)</li>
              <li>Equivalent qualifications may be accepted — check the official notification</li>
              <li>Final eligibility is determined by the recruiting authority during document verification</li>
              <li>Always verify from the official notification PDF before applying</li>
            </ul>
          </div>
        </div>
      )}

      {!jobRequirements && isStandalone && (
        <div className="mt-4 rounded-xl border border-hairline bg-subtle/30 p-3 text-[11px] text-ink-muted">
          <strong className="text-ink">No eligibility data available</strong> for the current notification.
          Please check the official notification PDF for complete eligibility criteria.
        </div>
      )}
    </section>
  )
}