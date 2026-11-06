import { useState, useMemo } from 'react'
import { Calendar, CreditCard, AlertTriangle, CheckCircle, Info } from 'lucide-react'

/**
 * FeeDatesSummary — Extracts and displays fee structure and important dates in a clear, actionable format
 * Works with job data to provide a quick reference card
 */
export default function FeeDatesSummary({ job, isStandalone = false }) {
  const [activeTab, setActiveTab] = useState('dates')

  // Parse and validate dates
  const parseDate = (dateStr) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    return isNaN(d.getTime()) ? null : d
  }

  const formatDate = (dateStr) => {
    const d = parseDate(dateStr)
    return d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : dateStr
  }

  const isPast = (dateStr) => {
    const d = parseDate(dateStr)
    return d ? d < new Date() : false
  }

  const isSoon = (dateStr) => {
    const d = parseDate(dateStr)
    if (!d) return false
    const diff = d - new Date()
    return diff > 0 && diff < 7 * 86400000 // within 7 days
  }

  // Process important dates
  const processedDates = useMemo(() => {
    if (!job?.importantDates?.length) return []
    return job.importantDates.map((date) => ({
      ...date,
      parsed: parseDate(date.value),
      formatted: formatDate(date.value),
      status: isPast(date.value) ? 'past' : isSoon(date.value) ? 'soon' : 'upcoming'
    }))
  }, [job?.importantDates])

  // Process fees
  const processedFees = useMemo(() => {
    if (!job?.fee?.length) return []
    return job.fee.map((fee) => ({
      ...fee,
      isGeneral: fee.label?.toLowerCase().includes('general') || fee.label?.toLowerCase().includes('obc') || fee.label?.toLowerCase().includes('ews'),
      isReserved: fee.label?.toLowerCase().includes('sc') || fee.label?.toLowerCase().includes('st') || fee.label?.toLowerCase().includes('pwd'),
      isMode: fee.label?.toLowerCase().includes('mode') || fee.label?.toLowerCase().includes('payment')
    }))
  }, [job?.fee])

  // Get key dates
  const startDate = processedDates.find(d => d.label?.toLowerCase().includes('begin') || d.label?.toLowerCase().includes('start'))?.formatted
  const lastDate = processedDates.find(d => d.label?.toLowerCase().includes('last') || d.label?.toLowerCase().includes('close') || d.label?.toLowerCase().includes('end'))?.formatted
  const examDate = processedDates.find(d => d.label?.toLowerCase().includes('exam') || d.label?.toLowerCase().includes('test') || d.label?.toLowerCase().includes('cbt'))?.formatted
  const resultDate = processedDates.find(d => d.label?.toLowerCase().includes('result') || d.label?.toLowerCase().includes('merit'))?.formatted

  // Get key fees
  const generalFee = processedFees.find(f => f.isGeneral)?.value
  const reservedFee = processedFees.find(f => f.isReserved)?.value
  const paymentMode = processedFees.find(f => f.isMode)?.value

  if (isStandalone && (!processedDates.length && !processedFees.length)) {
    return (
      <div className="card p-5 sm:p-6">
        <div className="flex items-center gap-2 text-orange-600">
          <Info size={16} />
          <span className="font-medium">No dates or fee data available for this notification</span>
        </div>
      </div>
    )
  }

  const renderDatesTab = () => (
    <div className="space-y-3">
      {processedDates.length > 0 ? (
        processedDates.map((date, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between gap-3 rounded-lg p-3 transition-colors ${
              date.status === 'past' ? 'bg-slate-500/10 border border-slate-500/20' :
              date.status === 'soon' ? 'bg-amber-500/10 border border-amber-500/30' :
              'bg-emerald-500/10 border border-emerald-500/20'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <Calendar
                size={18}
                className={`shrink-0 ${
                  date.status === 'past' ? 'text-slate-500' :
                  date.status === 'soon' ? 'text-amber-500' :
                  'text-emerald-500'
                }`}
              />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink truncate">{date.label}</p>
                <p className="text-[12px] text-ink-muted">{date.formatted}</p>
              </div>
            </div>
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold ${
                date.status === 'past' ? 'bg-slate-500/20 text-slate-600' :
                date.status === 'soon' ? 'bg-amber-500/20 text-amber-600' :
                'bg-emerald-500/20 text-emerald-600'
              }`}
            >
              {date.status === 'past' ? 'ENDED' : date.status === 'soon' ? 'SOON' : 'ACTIVE'}
            </span>
          </div>
        ))
      ) : (
        <p className="text-[13px] text-ink-muted text-center py-4">No important dates available</p>
      )}

      {/* Quick Summary Card */}
      {(startDate || lastDate || examDate) && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
          <h4 className="mb-3 text-[13px] font-bold text-brand-600">Quick Reference</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {startDate && (
              <div className="rounded-lg bg-white/50 p-3 text-center">
                <p className="text-[10px] font-semibold text-brand-600 uppercase tracking-wider">Apply Starts</p>
                <p className="text-[14px] font-bold text-ink">{startDate}</p>
              </div>
            )}
            {lastDate && (
              <div className={`rounded-lg p-3 text-center ${isPast(lastDate) ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">Last Date</p>
                <p className={`text-[14px] font-bold ${isPast(lastDate) ? 'text-red-600' : 'text-amber-600'}`}>{lastDate}</p>
                {isPast(lastDate) && <p className="text-[10px] text-red-600">Application closed</p>}
              </div>
            )}
            {examDate && (
              <div className="rounded-lg bg-white/50 p-3 text-center">
                <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">Exam Date</p>
                <p className="text-[14px] font-bold text-ink">{examDate}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

  const renderFeesTab = () => (
    <div className="space-y-3">
      {processedFees.length > 0 ? (
        processedFees.map((fee, idx) => (
          <div key={idx} className="flex items-center justify-between gap-3 rounded-lg border border-hairline bg-subtle/30 p-3">
            <div className="flex items-center gap-3">
              <CreditCard
                size={18}
                className={fee.isGeneral ? 'text-orange-500' : fee.isReserved ? 'text-emerald-500' : 'text-blue-500'}
              />
              <div>
                <p className="text-[13px] font-medium text-ink">{fee.label}</p>
                <p className="text-[12px] text-ink-muted">{fee.value}</p>
              </div>
            </div>
            {fee.isMode && (
              <span className="shrink-0 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                Payment Mode
              </span>
            )}
          </div>
        ))
      ) : (
        <p className="text-[13px] text-ink-muted text-center py-4">No fee information available</p>
      )}

      {/* Fee Summary */}
      {(generalFee || reservedFee) && (
        <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-4">
          <h4 className="mb-3 text-[13px] font-bold text-brand-600">Fee Summary</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {generalFee && (
              <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider">General / OBC / EWS</p>
                <p className="text-[14px] font-bold text-ink">{generalFee}</p>
              </div>
            )}
            {reservedFee && (
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">SC / ST / PwD</p>
                <p className="text-[14px] font-bold text-ink">{reservedFee}</p>
              </div>
            )}
          </div>
          {paymentMode && (
            <p className="mt-3 text-[12px] text-ink-muted flex items-center gap-1.5">
              <CreditCard size={13} />
              <span>Mode: {paymentMode}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )

  if (isStandalone) {
    return (
      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
            <Calendar size={18} />
          </span>
          <h2 className="text-[15px] font-bold text-ink">Fee & Dates Summary</h2>
        </div>
        <div className="space-y-4">
          <h3 className="text-[13px] font-semibold text-ink">{job?.title || 'Recruitment Notification'}</h3>
          {job?.org && <p className="text-[13px] text-ink-muted">{job.org}</p>}

          <div className="border-t border-hairline pt-4">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveTab('dates')}
                className={`flex-1 rounded-lg px-4 py-2 text-[12px] font-semibold transition-all ${
                  activeTab === 'dates'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface text-ink-soft hover:bg-subtle'
                }`}
              >
                <Calendar size={14} className="inline mr-1" /> Important Dates
              </button>
              <button
                onClick={() => setActiveTab('fees')}
                className={`flex-1 rounded-lg px-4 py-2 text-[12px] font-semibold transition-all ${
                  activeTab === 'fees'
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-surface text-ink-soft hover:bg-subtle'
                }`}
              >
                <CreditCard size={14} className="inline mr-1" /> Application Fee
              </button>
            </div>
            {activeTab === 'dates' ? renderDatesTab() : renderFeesTab()}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-hairline bg-subtle/30 p-3 text-[11px] text-ink-muted">
          <strong className="text-ink">Note:</strong> Always verify exact dates and fee amounts from the official notification PDF before applying. Dates and fees are subject to change via corrigendum.
        </div>
      </section>
    )
  }

  // Compact version for sidebar/widget use
  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Calendar size={15} className="text-brand-600" />
        <h3 className="text-[13px] font-bold text-ink">Quick Dates & Fee</h3>
      </div>

      <div className="space-y-2">
        {lastDate && (
          <div className={`flex items-center justify-between rounded-lg px-3 py-2 text-[12px] ${
            isPast(lastDate) ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'
          }`}>
            <span className="font-medium">Last Date to Apply</span>
            <span className="font-bold">{lastDate}</span>
          </div>
        )}
        {examDate && (
          <div className="flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-[12px] text-blue-600">
            <span className="font-medium">Exam / Test Date</span>
            <span className="font-bold">{examDate}</span>
          </div>
        )}
        {generalFee && (
          <div className="flex items-center justify-between rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-[12px] text-orange-600">
            <span className="font-medium">Fee (Gen/OBC/EWS)</span>
            <span className="font-bold">{generalFee}</span>
          </div>
        )}
        {reservedFee && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[12px] text-emerald-600">
            <span className="font-medium">Fee (SC/ST/PwD)</span>
            <span className="font-bold">{reservedFee}</span>
          </div>
        )}
        {!lastDate && !examDate && !generalFee && !reservedFee && (
          <p className="text-[12px] text-ink-muted text-center py-2">Data not available</p>
        )}
      </div>
    </section>
  )
}