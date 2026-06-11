export const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

export const STATUS_COLORS = {
  Applied: 'var(--color-applied)',
  Interview: 'var(--color-interview)',
  Offer: 'var(--color-offer)',
  Rejected: 'var(--color-rejected)',
}

/** Parse a 'YYYY-MM-DD' date string in local time (avoids UTC off-by-one). */
export function parseDate(value) {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatDate(value) {
  const date = parseDate(value)
  if (!date) return '—'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // Monday start
  return d
}

export function headlineStats(rows) {
  const total = rows.length
  const responded = rows.filter((r) => r.status !== 'Applied').length
  const interviews = rows.filter((r) => r.status === 'Interview').length
  const offers = rows.filter((r) => r.status === 'Offer').length
  const reachedInterview = interviews + offers

  return {
    total,
    offers,
    inProgress: rows.filter((r) => r.status === 'Applied' || r.status === 'Interview').length,
    responseRate: total ? Math.round((responded / total) * 100) : 0,
    conversionRate: reachedInterview ? Math.round((offers / reachedInterview) * 100) : 0,
  }
}

/** Applications per week for the last `weeks` weeks, oldest first. */
export function weeklyData(rows, weeks = 12) {
  const thisWeek = startOfWeek(new Date())
  const buckets = []
  const byKey = new Map()

  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(thisWeek)
    d.setDate(d.getDate() - 7 * i)
    const bucket = {
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: 0,
    }
    buckets.push(bucket)
    byKey.set(d.getTime(), bucket)
  }

  for (const row of rows) {
    const date = parseDate(row.application_date)
    if (!date) continue
    const bucket = byKey.get(startOfWeek(date).getTime())
    if (bucket) bucket.count++
  }

  return buckets
}

export function statusData(rows) {
  return STATUSES.map((status) => ({
    name: status,
    value: rows.filter((r) => r.status === status).length,
  })).filter((s) => s.value > 0)
}

export function topCountries(rows, limit = 6) {
  const counts = new Map()
  for (const row of rows) {
    const country = row.country?.trim()
    if (!country) continue
    counts.set(country, (counts.get(country) ?? 0) + 1)
  }
  return [...counts.entries()]
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

/** Applications per month from the first application to today, gaps filled with 0. */
export function monthlyData(rows) {
  const dates = rows.map((r) => parseDate(r.application_date)).filter(Boolean)
  if (!dates.length) return []

  const first = new Date(Math.min(...dates))
  const cursor = new Date(first.getFullYear(), first.getMonth(), 1)
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), 1)

  const buckets = []
  const byKey = new Map()
  while (cursor <= end) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}`
    const bucket = {
      label: cursor.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      count: 0,
    }
    buckets.push(bucket)
    byKey.set(key, bucket)
    cursor.setMonth(cursor.getMonth() + 1)
  }

  for (const date of dates) {
    const bucket = byKey.get(`${date.getFullYear()}-${date.getMonth()}`)
    if (bucket) bucket.count++
  }

  return buckets
}
