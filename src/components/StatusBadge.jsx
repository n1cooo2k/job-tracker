const styles = {
  Applied: 'text-applied border-applied/30 bg-applied/10',
  Interview: 'text-interview border-interview/30 bg-interview/10',
  Offer: 'text-offer border-offer/30 bg-offer/10',
  Rejected: 'text-rejected border-rejected/30 bg-rejected/10',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? 'text-ink-300 border-hairline bg-surface-1'
      }`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
