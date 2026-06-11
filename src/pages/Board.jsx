import { useMemo, useState } from 'react'
import { useApplications } from '../hooks/useApplications'
import { STATUSES, formatDate } from '../utils/stats'
import StatusBadge from '../components/StatusBadge'
import JobFormModal from '../components/JobFormModal'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  PlusIcon,
  SearchIcon,
  PencilIcon,
  TrashIcon,
  ExternalIcon,
  MapPinIcon,
  CalendarIcon,
  InboxIcon,
} from '../components/icons'

function location(row) {
  return [row.city, row.country].filter(Boolean).join(', ') || '—'
}

export default function Board() {
  const { rows, loading, error, save, remove } = useApplications()

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [countryFilter, setCountryFilter] = useState('All')
  const [modal, setModal] = useState(null) // null | 'new' | row object
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const countries = useMemo(
    () => [...new Set(rows.map((r) => r.country?.trim()).filter(Boolean))].sort(),
    [rows],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilter !== 'All' && row.status !== statusFilter) return false
      if (countryFilter !== 'All' && row.country?.trim() !== countryFilter) return false
      if (!q) return true
      return [row.company, row.role, row.city, row.country, row.notes]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q))
    })
  }, [rows, query, statusFilter, countryFilter])

  async function handleDelete() {
    setDeleting(true)
    try {
      await remove(deleteTarget.id)
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 rise">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Job Board</h1>
          <p className="mt-1 text-sm text-ink-300">
            {rows.length} application{rows.length === 1 ? '' : 's'} tracked
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setModal('new')} className="btn-primary">
            <PlusIcon size={16} />
            Add application
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="mt-6 flex flex-wrap gap-3 rise" style={{ animationDelay: '70ms' }}>
        <div className="relative min-w-52 flex-1">
          <SearchIcon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            className="field pl-10"
            placeholder="Search company, role, city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="field w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="All">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select
          className="field w-auto"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          aria-label="Filter by country"
        >
          <option value="All">All countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-rejected/30 bg-rejected/10 px-4 py-3 text-sm text-rejected">
          {error}
        </p>
      )}

      {/* Content */}
      <div className="mt-6 rise" style={{ animationDelay: '140ms' }}>
        {loading ? (
          <div className="card grid h-48 place-items-center">
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="card grid place-items-center px-6 py-16 text-center">
            <InboxIcon size={36} className="text-ink-500" />
            <p className="mt-4 font-display font-semibold text-ink-200">
              {rows.length === 0 ? 'No applications yet' : 'Nothing matches your filters'}
            </p>
            <p className="mt-1 max-w-xs text-sm text-ink-400">
              {rows.length === 0
                ? 'Add your first job application and start building momentum.'
                : 'Try a different search term or clear the filters.'}
            </p>
            {rows.length === 0 && (
              <button onClick={() => setModal('new')} className="btn-primary mt-6">
                <PlusIcon size={16} />
                Add your first application
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="card hidden overflow-hidden lg:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-left text-xs tracking-wide text-ink-400">
                    <th className="px-5 py-3.5 font-semibold">COMPANY / ROLE</th>
                    <th className="px-4 py-3.5 font-semibold">LOCATION</th>
                    <th className="px-4 py-3.5 font-semibold">SALARY</th>
                    <th className="px-4 py-3.5 font-semibold">APPLIED</th>
                    <th className="px-4 py-3.5 font-semibold">STATUS</th>
                    <th className="px-4 py-3.5 text-right font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row) => (
                    <tr key={row.id} className="border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.025]">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-ink-100">{row.company}</p>
                        <p className="mt-0.5 text-xs text-ink-300">{row.role}</p>
                      </td>
                      <td className="px-4 py-3.5 text-ink-200">{location(row)}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-ink-200">
                        {row.salary_range || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-ink-200">{formatDate(row.application_date)}</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-1">
                          {row.job_url && (
                            <a
                              href={row.job_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Open job posting"
                              className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-accent-300"
                            >
                              <ExternalIcon size={15} />
                            </a>
                          )}
                          <button
                            onClick={() => setModal(row)}
                            title="Edit"
                            className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-ink-100"
                          >
                            <PencilIcon size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(row)}
                            title="Delete"
                            className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-rejected"
                          >
                            <TrashIcon size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile / tablet cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
              {filtered.map((row) => (
                <div key={row.id} className="card flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-display font-semibold">{row.company}</p>
                      <p className="mt-0.5 truncate text-sm text-ink-300">{row.role}</p>
                    </div>
                    <StatusBadge status={row.status} />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-300">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinIcon size={13} /> {location(row)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarIcon size={13} /> {formatDate(row.application_date)}
                    </span>
                    {row.salary_range && <span className="font-mono">{row.salary_range}</span>}
                  </div>
                  {row.notes && <p className="line-clamp-2 text-xs text-ink-400">{row.notes}</p>}
                  <div className="mt-auto flex justify-end gap-1 border-t border-white/[0.05] pt-2">
                    {row.job_url && (
                      <a
                        href={row.job_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-accent-300"
                      >
                        <ExternalIcon size={15} />
                      </a>
                    )}
                    <button onClick={() => setModal(row)} className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-ink-100">
                      <PencilIcon size={15} />
                    </button>
                    <button onClick={() => setDeleteTarget(row)} className="rounded-lg p-2 text-ink-400 transition hover:bg-white/[0.06] hover:text-rejected">
                      <TrashIcon size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {modal && (
        <JobFormModal
          job={modal === 'new' ? null : modal}
          onSave={save}
          onClose={() => setModal(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete application?"
          message={`This will permanently remove ${deleteTarget.company} — ${deleteTarget.role} from your tracker.`}
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
