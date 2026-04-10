import { useState } from 'react'
import type { Worry } from '../types'

function relativeDate(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000)
  if (diff === 0) return 'היום'
  if (diff === 1) return 'אתמול'
  if (diff < 7) return `לפני ${diff} ימים`
  if (diff < 30) return `לפני ${Math.floor(diff / 7)} שבועות`
  return new Date(dateStr).toLocaleDateString('he-IL')
}

function heatColor(v: number): string {
  if (v <= 20) return '#6EE7B7'
  if (v <= 40) return '#93C5FD'
  if (v <= 60) return '#FCD34D'
  if (v <= 80) return '#FDBA74'
  return '#FCA5A5'
}

// Option E: top eyebrow gradient strip
function statusGradient(isResolved: boolean): string {
  return isResolved
    ? 'linear-gradient(90deg, #6EE7B7, #10B981)'
    : 'linear-gradient(90deg, #FDBA74, #F59E0B)'
}

function CircleMeter({ value }: { value: number }) {
  const r = 18, size = 48, cx = size / 2, cy = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - value / 100)
  const color = heatColor(value)

  return (
    <div className="relative shrink-0 w-12 h-12">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--circle-track)" strokeWidth="4" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

export default function WorryCard({ worry, onClick, index = 0 }: {
  worry: Worry
  onClick: () => void
  index?: number
}) {
  const [hovered, setHovered] = useState(false)
  const isResolved = worry.status === 'Resolved'
  const displayValue = isResolved && worry.postAnxietyLevel != null
    ? worry.postAnxietyLevel
    : worry.preAnxietyLevel
  const glowColor = heatColor(displayValue)
  const stagger = index < 4 ? `stagger-${index + 1}` : ''

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-full glass-card rounded-2xl overflow-hidden flex active:scale-[0.98] animate-fade-up ${stagger}`}
      style={{
        boxShadow: hovered
          ? `0 0 28px 6px ${glowColor}55`
          : 'var(--card-shadow)',
        transition: 'box-shadow 0.25s ease, transform 0.1s',
      }}
    >
      {/* Option E — top eyebrow status strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: statusGradient(isResolved) }}
      />

      {/* Text content */}
      <div className="flex-1 min-w-0 px-4 pt-5 pb-4">
        <div className="flex items-center gap-2">
          <p className="text-tx1 font-semibold text-sm truncate min-w-0 text-right">{worry.title}</p>
          <span
            className="shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              background: isResolved ? 'var(--chip-resolved-bg)' : 'var(--chip-active-bg)',
              color: isResolved ? 'var(--chip-resolved-color)' : 'var(--chip-active-color)',
            }}
          >
            {isResolved ? 'נפתר' : 'פעיל'}
          </span>
        </div>

        {worry.description && (
          <p className="text-tx3 text-xs mt-1.5 line-clamp-2 leading-relaxed text-right font-light">
            {worry.description}
          </p>
        )}

        <p className="text-tx3 text-[11px] mt-2 text-right" style={{ fontWeight: 200 }}>
          {relativeDate(worry.createdAt)}
        </p>
      </div>

      {/* Circle meter */}
      <div className="flex items-center px-3 pt-3">
        <CircleMeter value={displayValue} />
      </div>
    </button>
  )
}
