import { useState, useEffect } from 'react'
import { FileCheck, FileText, AlertTriangle, CheckCircle, Download, Copy, Save, Trash2, Plus } from 'lucide-react'

/**
 * DocumentChecklist — Interactive checklist for required documents during application
 * Supports custom documents from job data + common government job documents
 */
export default function DocumentChecklist({ job, isStandalone = false }) {
  const [documents, setDocuments] = useState(() => {
    // Initialize from job data if available
    if (job?.requiredDocuments?.length) {
      return job.requiredDocuments.map((doc, idx) => ({
        id: `job-${idx}`,
        name: doc.document,
        description: doc.description,
        mandatory: doc.mandatory !== false,
        format: doc.format,
        sizeLimit: doc.sizeLimit,
        completed: false,
        source: 'job'
      }))
    }
    // Default common government job documents
    return defaultDocuments.map((doc, idx) => ({ ...doc, id: `default-${idx}` }))
  })

  const [customDocName, setCustomDocName] = useState('')
  const [customDocDesc, setCustomDocDesc] = useState('')
  const [customDocMandatory, setCustomDocMandatory] = useState(true)
  const [showCustomForm, setShowCustomForm] = useState(false)

  const defaultDocuments = [
    { name: 'Recent Passport Size Photograph', description: 'White background, 80% face visibility, JPG/JPEG, 20-50 KB', mandatory: true, format: 'JPG/JPEG', sizeLimit: '20-50 KB' },
    { name: 'Signature', description: 'Black/blue ink on white paper, JPG/JPEG, 10-20 KB', mandatory: true, format: 'JPG/JPEG', sizeLimit: '10-20 KB' },
    { name: 'Left Thumb Impression', description: 'Blue/black ink, clear impression, JPG/JPEG, 20-50 KB', mandatory: true, format: 'JPG/JPEG', sizeLimit: '20-50 KB' },
    { name: '10th / Matriculation Certificate', description: 'For date of birth proof, PDF, up to 500 KB', mandatory: true, format: 'PDF', sizeLimit: '500 KB' },
    { name: '12th / Intermediate Certificate', description: 'Marksheet or passing certificate, PDF, up to 500 KB', mandatory: true, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Graduation Degree / Provisional Certificate', description: 'Final degree or provisional, PDF, up to 500 KB', mandatory: true, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Graduation Marksheets (All Years/Semesters)', description: 'Consolidated or semester-wise, PDF, up to 500 KB', mandatory: true, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Caste / Category Certificate (SC/ST/OBC/EWS)', description: 'Valid format as per notification, PDF, up to 500 KB', mandatory: false, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'PwD Certificate (if applicable)', description: 'As per government format, PDF, up to 500 KB', mandatory: false, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Domicile / Residence Certificate', description: 'State-specific format, PDF, up to 500 KB', mandatory: false, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Ex-Servicemen / Discharge Certificate', description: 'For ex-servicemen category, PDF, up to 500 KB', mandatory: false, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'No Objection Certificate (NOC)', description: 'For government employees, PDF, up to 500 KB', mandatory: false, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Identity Proof (Aadhaar / PAN / Voter ID)', description: 'Valid government ID, PDF/JPG, up to 500 KB', mandatory: true, format: 'PDF/JPG', sizeLimit: '500 KB' },
    { name: 'Application Fee Payment Receipt', description: 'Online payment challan/receipt, PDF, up to 500 KB', mandatory: true, format: 'PDF', sizeLimit: '500 KB' },
    { name: 'Printed Application Form', description: 'Final submitted form printout, PDF, up to 500 KB', mandatory: true, format: 'PDF', sizeLimit: '500 KB' },
  ]

  const toggleDocument = (id) => {
    setDocuments(prev => prev.map(doc =>
      doc.id === id ? { ...doc, completed: !doc.completed } : doc
    ))
  }

  const addCustomDocument = () => {
    if (!customDocName.trim()) return
    setDocuments(prev => [...prev, {
      id: `custom-${Date.now()}`,
      name: customDocName.trim(),
      description: customDocDesc.trim(),
      mandatory: customDocMandatory,
      completed: false,
      source: 'custom'
    }])
    setCustomDocName('')
    setCustomDocDesc('')
    setCustomDocMandatory(true)
    setShowCustomForm(false)
  }

  const removeDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id))
  }

  const completedCount = documents.filter(d => d.completed).length
  const mandatoryCount = documents.filter(d => d.mandatory).length
  const mandatoryCompleted = documents.filter(d => d.mandatory && d.completed).length

  const exportChecklist = () => {
    const content = `Document Checklist for ${job?.title || 'Government Job Application'}
Organization: ${job?.org || 'Not specified'}
Generated: ${new Date().toLocaleDateString('en-IN')}

${documents.map((doc, idx) =>
  `${idx + 1}. [${doc.completed ? '✓' : ' '}] ${doc.name}${doc.mandatory ? ' (MANDATORY)' : ' (Optional)'}${doc.description ? ` - ${doc.description}` : ''}${doc.format ? ` [${doc.format}]` : ''}${doc.sizeLimit ? ` [${doc.sizeLimit}]` : ''}`
).join('\n')}

---
Summary: ${completedCount}/${documents.length} documents ready
Mandatory: ${mandatoryCompleted}/${mandatoryCount} completed

Always verify exact requirements from the official notification PDF.
`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `document-checklist-${job?.id || 'govt-job'}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyChecklist = () => {
    const content = documents.map((doc, idx) =>
      `${idx + 1}. [${doc.completed ? '✓' : ' '}] ${doc.name}${doc.mandatory ? ' (MANDATORY)' : ''}`
    ).join('\n')
    navigator.clipboard.writeText(content)
  }

  const renderChecklist = () => (
    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`flex items-start gap-3 rounded-lg p-3 transition-all ${
            doc.completed ? 'bg-emerald-500/5 border border-emerald-500/20' :
            doc.mandatory ? 'bg-amber-500/5 border border-amber-500/20' :
            'bg-subtle/30 border border-hairline'
          }`}
        >
          <input
            type="checkbox"
            checked={doc.completed}
            onChange={() => toggleDocument(doc.id)}
            className="mt-1 shrink-0 h-5 w-5 rounded border-hairline text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-[13px] font-medium ${doc.completed ? 'line-through text-ink-muted' : doc.mandatory ? 'text-ink' : 'text-ink-soft'}`}>
                {doc.name}
              </p>
              {doc.mandatory && (
                <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[9px] font-bold text-red-600">MANDATORY</span>
              )}
              {doc.source === 'custom' && (
                <span className="rounded bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-medium text-purple-600">Custom</span>
              )}
            </div>
            {(doc.description || doc.format || doc.sizeLimit) && (
              <p className="mt-1 text-[11px] text-ink-muted flex flex-wrap gap-3">
                {doc.description && <span>{doc.description}</span>}
                {doc.format && <span className="font-mono bg-brand-500/10 px-1.5 py-0.5 rounded text-[10px] text-brand-600">{doc.format}</span>}
                {doc.sizeLimit && <span className="font-mono bg-slate-500/10 px-1.5 py-0.5 rounded text-[10px] text-slate-600">{doc.sizeLimit}</span>}
              </p>
            )}
          </div>
          <button
            onClick={() => removeDocument(doc.id)}
            className="shrink-0 opacity-0 group-hover:opacity-100 text-ink-faint hover:text-red-500 transition-opacity"
            title="Remove document"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
    </div>
  )

  if (isStandalone) {
    return (
      <section className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-hairline pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
              <FileCheck size={18} />
            </span>
            <h2 className="text-[15px] font-bold text-ink">Document Checklist</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={copyChecklist} className="btn-ghost text-xs" title="Copy checklist">
              <Copy size={14} /> Copy
            </button>
            <button onClick={exportChecklist} className="btn-ghost text-xs" title="Download checklist">
              <Download size={14} /> Download
            </button>
          </div>
        </div>

        <p className="mb-4 text-[13px] text-ink-muted">
          Track your document preparation for <strong>{job?.title || 'government job application'}</strong>.
          Mark documents as ready, add custom ones, and export your progress.
        </p>

        {/* Progress Summary */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
            <p className="text-2xl font-black text-emerald-600">{completedCount}</p>
            <p className="text-[11px] text-emerald-700">Ready</p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-center">
            <p className="text-2xl font-black text-amber-600">{mandatoryCount - mandatoryCompleted}</p>
            <p className="text-[11px] text-amber-700">Mandatory Pending</p>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-3 text-center">
            <p className="text-2xl font-black text-blue-600">{documents.length}</p>
            <p className="text-[11px] text-blue-700">Total Documents</p>
          </div>
          <div className="rounded-xl border border-brand-500/30 bg-brand-500/10 p-3 text-center">
            <p className="text-2xl font-black text-brand-600">{Math.round((completedCount / documents.length) * 100)}%</p>
            <p className="text-[11px] text-brand-700">Complete</p>
          </div>
        </div>

        {/* Custom Document Form */}
        <div className="mb-4">
          <button
            onClick={() => setShowCustomForm(!showCustomForm)}
            className="btn-ghost text-xs flex items-center gap-1.5"
          >
            <Plus size={14} /> {showCustomForm ? 'Cancel' : 'Add Custom Document'}
          </button>

          {showCustomForm && (
            <div className="mt-3 space-y-3 rounded-lg border border-brand-500/30 bg-brand-500/10 p-3">
              <input
                type="text"
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                placeholder="Document name (e.g., Experience Certificate)"
                className="input-field w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-[13px] text-ink"
              />
              <input
                type="text"
                value={customDocDesc}
                onChange={(e) => setCustomDocDesc(e.target.value)}
                placeholder="Description / format / size requirements"
                className="input-field w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-[13px] text-ink"
              />
              <label className="flex items-center gap-2 text-[12px] text-ink-soft">
                <input
                  type="checkbox"
                  checked={customDocMandatory}
                  onChange={(e) => setCustomDocMandatory(e.target.checked)}
                  className="h-4 w-4 rounded border-hairline text-brand-600"
                />
                Mandatory document
              </label>
              <button onClick={addCustomDocument} className="btn-primary text-xs w-full sm:w-auto">
                <Plus size={12} className="mr-1" /> Add Document
              </button>
            </div>
          )}
        </div>

        {/* Checklist */}
        <div className="border-t border-hairline pt-4">
          {documents.length > 0 ? (
            renderChecklist()
          ) : (
            <p className="text-center text-ink-muted py-8">No documents configured</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={copyChecklist} className="btn-ghost text-xs">
            <Copy size={13} className="mr-1" /> Copy Checklist
          </button>
          <button onClick={exportChecklist} className="btn-primary text-xs">
            <Download size={13} className="mr-1" /> Download as Text
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-hairline bg-subtle/30 p-3 text-[11px] text-ink-muted">
          <strong className="text-ink">Important Notes:</strong>
          <ul className="mt-1.5 list-disc list-inside space-y-1">
            <li>Always verify exact document requirements from the official notification PDF</li>
            <li>Scan documents in the specified format (PDF/JPG) and size limits</li>
            <li>Keep original documents and multiple photocopies for document verification stage</li>
            <li>Caste/category certificates must be in the prescribed format and validity period</li>
            <li>Photograph and signature must match the specifications exactly</li>
            <li>This checklist is for preparation tracking only — not an official document</li>
          </ul>
        </div>
      </section>
    )
  }

  // Compact version for sidebar/widget
  return (
    <section className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck size={15} className="text-brand-600" />
          <h3 className="text-[13px] font-bold text-ink">Document Checklist</h3>
        </div>
        <span className={`text-[11px] font-bold ${mandatoryCompleted === mandatoryCount ? 'text-emerald-600' : 'text-amber-600'}`}>
          {mandatoryCompleted}/{mandatoryCount} Mandatory
        </span>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {documents.slice(0, 10).map((doc) => (
          <div
            key={doc.id}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] transition-colors ${
              doc.completed ? 'bg-emerald-500/10 text-emerald-700' :
              doc.mandatory ? 'bg-amber-500/10 text-amber-700' :
              'bg-subtle/30 text-ink-soft'
            }`}
          >
            <input
              type="checkbox"
              checked={doc.completed}
              onChange={() => toggleDocument(doc.id)}
              className="h-4 w-4 rounded border-hairline text-brand-600"
            />
            <span className={`truncate ${doc.completed ? 'line-through' : ''}`}>
              {doc.name} {doc.mandatory && '(*)'}
            </span>
          </div>
        ))}
        {documents.length > 10 && (
          <p className="text-center text-[11px] text-ink-muted">+{documents.length - 10} more documents</p>
        )}
      </div>

      <div className="flex gap-2 pt-2 border-t border-hairline">
        <button onClick={copyChecklist} className="btn-ghost text-xs flex-1">
          <Copy size={12} className="mr-1" /> Copy
        </button>
        <button onClick={exportChecklist} className="btn-primary text-xs flex-1">
          <Download size={12} className="mr-1" /> Export
        </button>
      </div>
    </section>
  )
}