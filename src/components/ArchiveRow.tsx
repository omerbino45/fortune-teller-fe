export default function ArchiveRow({ count, onClick }: { count: number; onClick: () => void }) {
  if (count === 0) return null

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-1 cursor-pointer active:scale-[0.98] active:opacity-60"
      style={{
        height: '44px',
        transition: 'opacity 150ms ease-out, transform 150ms ease-out',
        borderTop: '1px solid var(--divider)',
        borderBottom: '1px solid var(--divider)',
      }}
      aria-label={`ארכיון, ${count} דאגות`}
    >
      {/* Right: icon + label */}
      <div className="flex items-center gap-2" style={{ color: 'var(--tx-2)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="5" rx="2"/>
          <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"/>
          <path d="M10 13h4"/>
        </svg>
        <span className="text-sm font-light" style={{ color: 'var(--tx-2)' }}>ארכיון</span>
      </div>

      {/* Left: count badge + chevron */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            border: '1px solid var(--bord)',
            color: 'var(--tx-2)',
            lineHeight: '1.4',
          }}
        >
          {count}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--tx-3)' }}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>
    </button>
  )
}
