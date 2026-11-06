import { useState, useEffect } from 'react'
import { Calendar, Calculator, AlertTriangle, CheckCircle } from 'lucide-react'

/**
 * AgeCalculator — Calculates candidate age as on a specific date (e.g., last date of application)
 * Uses Indian government age calculation rules (age as on last date of application)
 */
export default function AgeCalculator() {
  const [dob, setDob] = useState('')
  const [referenceDate, setReferenceDate] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Default reference date to today for demo, but user can change
  useEffect(() => {
    if (!referenceDate) {
      const today = new Date().toISOString().split('T')[0]
      setReferenceDate(today)
    }
  }, [referenceDate])

  const calculateAge = () => {
    setError('')
    if (!dob) {
      setError('Please enter your date of birth')
      return
    }
    if (!referenceDate) {
      setError('Please enter the reference date (e.g., last date of application)')
      return
    }

    const birthDate = new Date(dob)
    const refDate = new Date(referenceDate)

    if (isNaN(birthDate.getTime()) || isNaN(refDate.getTime())) {
      setError('Invalid date format')
      return
    }

    if (birthDate > refDate) {
      setError('Date of birth cannot be after the reference date')
      return
    }

    // Calculate age as per Indian government rules
    // Age is completed years as on the reference date
    let years = refDate.getFullYear() - birthDate.getFullYear()
    let months = refDate.getMonth() - birthDate.getMonth()
    let days = refDate.getDate() - birthDate.getDate()

    if (days < 0) {
      months--
      const prevMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 0)
      days += prevMonth.getDate()
    }
    if (months < 0) {
      years--
      months += 12
    }

    // Total days difference for reference
    const diffTime = Math.abs(refDate - birthDate)
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    setResult({
      years,
      months,
      days,
      totalDays,
      isEligible: years >= 18 // default minimum
    })
  }

  const checkEligibility = (minAge, maxAge, relaxationYears = 0) => {
    if (!result) return { eligible: null, message: 'Calculate age first' }
    const effectiveMax = maxAge + relaxationYears
    const eligible = result.years >= minAge && result.years <= effectiveMax
    return {
      eligible,
      message: eligible
        ? `✅ Eligible (Age: ${result.years} years, Required: ${minAge}-${effectiveMax} years)`
        : result.years < minAge
        ? `❌ Not Eligible - Underage (Age: ${result.years} years, Minimum: ${minAge} years)`
        : `❌ Not Eligible - Overage (Age: ${result.years} years, Maximum: ${effectiveMax} years${relaxationYears ? ` + ${relaxationYears} relaxation` : ''})`
    }
  }

  return (
    <section className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
          <Calculator size={18} />
        </span>
        <h2 className="text-[15px] font-bold text-ink">Age Calculator (As on Reference Date)</h2>
      </div>

      <p className="mb-4 text-[13px] text-ink-muted">
        Calculate your exact age as on the last date of application or any reference date.
        Used for government job eligibility where age is calculated as on a specific date.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1.5 text-[13px] font-medium text-ink">Date of Birth *</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="input-field w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-faint"
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block mb-1.5 text-[13px] font-medium text-ink">Reference Date (Last Date to Apply) *</label>
          <input
            type="date"
            value={referenceDate}
            onChange={(e) => setReferenceDate(e.target.value)}
            className="input-field w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-[14px] text-ink placeholder:text-ink-faint"
          />
        </div>
      </div>

      <button
        onClick={calculateAge}
        className="mt-4 w-full sm:w-auto btn-primary"
        disabled={!dob || !referenceDate}
      >
        <Calculator size={16} className="mr-2" />
        Calculate Age
      </button>

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-red-600 text-[13px]">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {result && (
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 mb-2">
              <CheckCircle size={16} />
              <span className="font-bold">Your Age as on {new Date(referenceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-black text-emerald-600">{result.years}</p>
                <p className="text-[11px] text-ink-muted">Years</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-600">{result.months}</p>
                <p className="text-[11px] text-ink-muted">Months</p>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-600">{result.days}</p>
                <p className="text-[11px] text-ink-muted">Days</p>
              </div>
            </div>
            <p className="mt-2 text-[12px] text-ink-muted">Total: {result.totalDays.toLocaleString('en-IN')} days</p>
          </div>

          {/* Quick Eligibility Checker for Common Govt Job Age Limits */}
          <div>
            <h3 className="mb-3 text-[13px] font-semibold text-ink">Quick Eligibility Check (Common Govt Job Age Limits)</h3>
            <div className="space-y-2">
              {[
                { label: 'General (18-30 years)', min: 18, max: 30, relaxation: 0 },
                { label: 'OBC (18-33 years)', min: 18, max: 30, relaxation: 3 },
                { label: 'SC/ST (18-35 years)', min: 18, max: 30, relaxation: 5 },
                { label: 'PwD (18-40 years)', min: 18, max: 30, relaxation: 10 },
                { label: 'Ex-Servicemen (18-35/37 years)', min: 18, max: 30, relaxation: 5 },
              ].map((cat) => {
                const check = checkEligibility(cat.min, cat.max, cat.relaxation)
                return (
                  <div
                    key={cat.label}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] ${
                      check.eligible ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'
                    }`}
                  >
                    <span className="font-medium">{cat.label}</span>
                    <span className="font-semibold">{check.eligible ? '✅ Eligible' : '❌ Not Eligible'}</span>
                  </div>
                )
              })}
            </div>
            <p className="mt-2 text-[11px] text-ink-faint">
              Note: Age limits vary by recruitment. Always check the official notification for exact age criteria and relaxation rules.
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-hairline bg-subtle/30 p-3 text-[11px] text-ink-muted">
        <strong className="text-ink">How Government Age Calculation Works:</strong>
        <ul className="mt-1.5 list-disc list-inside space-y-1">
          <li>Age is calculated in completed years as on the last date of application (or as specified in notification)</li>
          <li>Date of birth as per 10th/Matriculation certificate is considered</li>
          <li>Relaxations: OBC +3 years, SC/ST +5 years, PwD +10 years, Ex-Servicemen +3-5 years</li>
          <li>Some recruitments have upper age limits of 32, 35, 37, 40, 42, 45, 50, 55, or 56 years depending on post</li>
        </ul>
      </div>
    </section>
  )
}