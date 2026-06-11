export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink-950/80 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="card w-full max-w-sm p-6 pop" role="alertdialog" aria-modal="true">
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rejected/90 px-4 py-2.5 font-display text-sm font-semibold text-white transition hover:bg-rejected active:scale-[0.98] disabled:opacity-50"
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
