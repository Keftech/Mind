export default function NextBestStep({ label, reason, actionLabel, onAction }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-[color:var(--color-line)] bg-[color:var(--color-accent-soft)] p-5">
      <p className="font-mono text-xs uppercase tracking-wide text-[color:var(--color-accent)]">
        Next best step
      </p>
      <p className="mt-2 font-display text-lg text-[color:var(--color-ink)]">
        {label}
      </p>
      {reason && (
        <p className="mt-1 text-sm text-[color:var(--color-ink-soft)]">{reason}</p>
      )}
      <button
        onClick={onAction}
        className="mt-4 rounded-full bg-[color:var(--color-accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
      >
        {actionLabel}
      </button>
    </div>
  );
}