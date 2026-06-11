import { useEffect, useState } from 'react'
import { STATUSES } from '../utils/stats'
import { CloseIcon } from './icons'

function todayIso() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const emptyForm = {
  company: '',
  role: '',
  country: '',
  city: '',
  salary_range: '',
  application_date: todayIso(),
  status: 'Applied',
  notes: '',
  job_url: '',
}

export default function JobFormModal({ job, onSave, onClose }) {
  const isEdit = Boolean(job?.id)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setForm({
        company: job.company ?? '',
        role: job.role ?? '',
        country: job.country ?? '',
        city: job.city ?? '',
        salary_range: job.salary_range ?? '',
        application_date: job.application_date ?? todayIso(),
        status: job.status ?? 'Applied',
        notes: job.notes ?? '',
        job_url: job.job_url ?? '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [job, isEdit])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await onSave(form, job?.id ?? null)
      onClose()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-lg p-6 pop" role="dialog" aria-modal="true">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold">
              {isEdit ? 'Edit application' : 'New application'}
            </h2>
            <p className="mt-0.5 text-sm text-ink-300">
              {isEdit ? `Update ${job.company} — ${job.role}` : 'Log a job you just applied to.'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-white/[0.06] hover:text-ink-100">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                COMPANY *
              </label>
              <input className="field" required placeholder="Acme Inc." value={form.company} onChange={set('company')} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                ROLE *
              </label>
              <input className="field" required placeholder="Frontend Engineer" value={form.role} onChange={set('role')} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                COUNTRY
              </label>
              <input className="field" placeholder="Mexico" value={form.country} onChange={set('country')} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                CITY
              </label>
              <input className="field" placeholder="CDMX" value={form.city} onChange={set('city')} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                SALARY RANGE
              </label>
              <input className="field" placeholder="$60k – $80k" value={form.salary_range} onChange={set('salary_range')} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                APPLICATION DATE
              </label>
              <input className="field" type="date" required value={form.application_date} onChange={set('application_date')} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                STATUS
              </label>
              <select className="field" value={form.status} onChange={set('status')}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
                JOB URL
              </label>
              <input className="field" type="url" placeholder="https://…" value={form.job_url} onChange={set('job_url')} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
              NOTES
            </label>
            <textarea
              className="field min-h-20 resize-y"
              placeholder="Referral from María, follow up next week…"
              value={form.notes}
              onChange={set('notes')}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rejected/30 bg-rejected/10 px-3.5 py-2.5 text-sm text-rejected">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={busy} className="btn-primary">
              {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
