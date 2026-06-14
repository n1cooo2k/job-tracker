import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import {
  STATUSES,
  SOURCES,
  parseDate,
  formatDate,
  daysSince,
  needsFollowUp,
  FOLLOW_UP_DAYS,
  headlineStats,
  statusData,
  sourceData,
  topCountries,
  weeklyData,
  monthlyData,
} from './stats'

// Pin "today" so date-relative helpers are deterministic.
const TODAY = new Date(2026, 5, 13) // 2026-06-13 local

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(TODAY)
})
afterAll(() => vi.useRealTimers())

// Build a 'YYYY-MM-DD' string for N days before TODAY.
function daysAgo(n) {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  const pad = (x) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const row = (over = {}) => ({
  status: 'Applied',
  application_date: daysAgo(1),
  country: 'Mexico',
  source: 'LinkedIn',
  ...over,
})

describe('parseDate', () => {
  it('parses YYYY-MM-DD in local time', () => {
    const d = parseDate('2026-06-13')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(5)
    expect(d.getDate()).toBe(13)
  })

  it('returns null for empty input', () => {
    expect(parseDate('')).toBeNull()
    expect(parseDate(null)).toBeNull()
  })
})

describe('formatDate', () => {
  it('formats a date as "Mon D, YYYY"', () => {
    expect(formatDate('2026-06-13')).toBe('Jun 13, 2026')
  })

  it('returns an em dash for missing dates', () => {
    expect(formatDate(null)).toBe('—')
  })
})

describe('daysSince', () => {
  it('counts whole days back from today', () => {
    expect(daysSince(daysAgo(10))).toBe(10)
    expect(daysSince(daysAgo(0))).toBe(0)
  })

  it('returns 0 for future or missing dates', () => {
    expect(daysSince('2099-01-01')).toBe(0)
    expect(daysSince(null)).toBe(0)
  })
})

describe('needsFollowUp', () => {
  it('flags unresolved applications past the threshold', () => {
    expect(needsFollowUp(row({ status: 'Applied', application_date: daysAgo(FOLLOW_UP_DAYS) }))).toBe(true)
    expect(needsFollowUp(row({ status: 'Interview', application_date: daysAgo(30) }))).toBe(true)
  })

  it('ignores recent applications', () => {
    expect(needsFollowUp(row({ status: 'Applied', application_date: daysAgo(5) }))).toBe(false)
  })

  it('ignores resolved applications regardless of age', () => {
    expect(needsFollowUp(row({ status: 'Offer', application_date: daysAgo(60) }))).toBe(false)
    expect(needsFollowUp(row({ status: 'Rejected', application_date: daysAgo(60) }))).toBe(false)
  })
})

describe('headlineStats', () => {
  it('computes counts and rates from a known set', () => {
    const rows = [
      row({ status: 'Applied' }),
      row({ status: 'Applied' }),
      row({ status: 'Interview' }),
      row({ status: 'Offer' }),
      row({ status: 'Rejected' }),
    ]
    const s = headlineStats(rows)
    expect(s.total).toBe(5)
    expect(s.offers).toBe(1)
    expect(s.inProgress).toBe(3) // 2 Applied + 1 Interview
    expect(s.responseRate).toBe(60) // 3 of 5 moved beyond Applied
    expect(s.conversionRate).toBe(50) // 1 offer of (1 interview + 1 offer)
  })

  it('returns zeros for an empty set', () => {
    const s = headlineStats([])
    expect(s).toMatchObject({ total: 0, offers: 0, inProgress: 0, responseRate: 0, conversionRate: 0 })
  })
})

describe('statusData', () => {
  it('counts each status and drops empty buckets', () => {
    const data = statusData([row({ status: 'Applied' }), row({ status: 'Offer' })])
    expect(data).toEqual([
      { name: 'Applied', value: 1 },
      { name: 'Offer', value: 1 },
    ])
  })

  it('keeps the canonical status order', () => {
    const data = statusData(STATUSES.map((status) => row({ status })))
    expect(data.map((d) => d.name)).toEqual(STATUSES)
  })
})

describe('sourceData', () => {
  it('counts sources in descending order', () => {
    const rows = [
      row({ source: 'LinkedIn' }),
      row({ source: 'LinkedIn' }),
      row({ source: 'Indeed' }),
    ]
    expect(sourceData(rows)).toEqual([
      { source: 'LinkedIn', count: 2 },
      { source: 'Indeed', count: 1 },
    ])
  })

  it('buckets missing sources under "Unknown"', () => {
    const data = sourceData([row({ source: null }), row({ source: '' })])
    expect(data).toEqual([{ source: 'Unknown', count: 2 }])
  })

  it('only lists known sources from the SOURCES list when set', () => {
    const data = sourceData([row({ source: 'Referral' })])
    expect(SOURCES).toContain(data[0].source)
  })
})

describe('topCountries', () => {
  it('ranks countries by count and respects the limit', () => {
    const rows = [
      row({ country: 'Mexico' }),
      row({ country: 'Mexico' }),
      row({ country: 'USA' }),
      row({ country: '  ' }), // blank ignored
      row({ country: null }),
    ]
    const data = topCountries(rows, 1)
    expect(data).toEqual([{ country: 'Mexico', count: 2 }])
  })
})

describe('weeklyData', () => {
  it('returns the requested number of buckets, oldest first', () => {
    const data = weeklyData([], 12)
    expect(data).toHaveLength(12)
  })

  it('counts only applications within the window', () => {
    const rows = [row({ application_date: daysAgo(2) }), row({ application_date: daysAgo(400) })]
    const total = weeklyData(rows, 12).reduce((sum, b) => sum + b.count, 0)
    expect(total).toBe(1) // the 400-day-old one falls outside 12 weeks
  })
})

describe('monthlyData', () => {
  it('is empty when there are no dated rows', () => {
    expect(monthlyData([])).toEqual([])
  })

  it('spans from the first application to today and counts every row', () => {
    const rows = [row({ application_date: daysAgo(40) }), row({ application_date: daysAgo(1) })]
    const data = monthlyData(rows)
    expect(data.length).toBeGreaterThanOrEqual(2)
    expect(data.reduce((sum, b) => sum + b.count, 0)).toBe(2)
  })
})
