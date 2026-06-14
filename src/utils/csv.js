const COLUMNS = [
  'company',
  'role',
  'country',
  'city',
  'salary_range',
  'application_date',
  'status',
  'source',
  'notes',
  'job_url',
  'created_at',
]

function escapeCell(value) {
  const text = String(value ?? '')
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Serialize rows to CSV text (header + CRLF rows). Pure and unit-testable. */
export function rowsToCsv(rows) {
  return [
    COLUMNS.join(','),
    ...rows.map((row) => COLUMNS.map((col) => escapeCell(row[col])).join(',')),
  ].join('\r\n')
}

export function exportToCsv(rows, filename = 'job-applications.csv') {
  const bom = String.fromCharCode(0xfeff) // so Excel detects UTF-8
  const blob = new Blob([bom + rowsToCsv(rows)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
