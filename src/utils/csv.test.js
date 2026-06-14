import { describe, it, expect } from 'vitest'
import { rowsToCsv } from './csv'

const HEADER =
  'company,role,country,city,salary_range,application_date,status,source,notes,job_url,created_at'

describe('rowsToCsv', () => {
  it('emits just the header row when there are no rows', () => {
    expect(rowsToCsv([])).toBe(HEADER)
  })

  it('writes columns in the fixed schema order', () => {
    const csv = rowsToCsv([
      { company: 'Acme', role: 'Dev', country: 'Mexico', status: 'Applied' },
    ])
    const [header, line] = csv.split('\r\n')
    expect(header).toBe(HEADER)
    // company,role,country,(city empty),...,status in 7th position
    expect(line.startsWith('Acme,Dev,Mexico,,')).toBe(true)
    expect(line.split(',')[6]).toBe('Applied')
  })

  it('joins rows with CRLF', () => {
    const csv = rowsToCsv([{ company: 'A' }, { company: 'B' }])
    expect(csv.split('\r\n')).toHaveLength(3) // header + 2 rows
  })

  it('renders null and undefined fields as empty cells', () => {
    const csv = rowsToCsv([{ company: 'Acme', notes: null, job_url: undefined }])
    const line = csv.split('\r\n')[1]
    expect(line).toBe('Acme,,,,,,,,,,')
  })

  it('quotes and escapes values containing commas, quotes or newlines', () => {
    const csv = rowsToCsv([
      { company: 'Doe, Inc', role: 'Say "hi"', notes: 'line1\nline2' },
    ])
    const line = csv.split('\r\n')[1]
    expect(line).toContain('"Doe, Inc"')
    expect(line).toContain('"Say ""hi"""')
    expect(line).toContain('"line1\nline2"')
  })

  it('does not quote plain values', () => {
    const csv = rowsToCsv([{ company: 'Acme' }])
    expect(csv.split('\r\n')[1].startsWith('Acme,')).toBe(true)
  })
})
