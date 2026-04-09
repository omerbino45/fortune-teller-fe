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
  if (v <= 20) return '#6EE7B7'   // pastel green
  if (v <= 40) return '#93C5FD'   // pastel blue
  if (v <= 60) return '#FCD34D'   // pastel yellow
  if (v <= 80) return '#FDBA74'   // pastel orange
  return '#FCA5A5'                 // pastel red
}

function CircleMeter({ value }: { value: number }) {
  const r = 18
  const size = 48
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - value / 100)
  const color = heatColor(value)

  return (
    <div className="relative shrink-0 w-12 h-12">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        {/* Fill */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      {/* Number in centre */}
      <span
        className="absolute inset-0 flex items-center justify-center text-[11px] font-bold"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  )
}

export default function WorryCard({ worry, onClick }: { worry: Worry; onClick: () => void }) {
  const isResolved = worry.status === 'Resolved'

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl overflow-hidden flex shadow-sm active:scale-[0.98] transition-transform"
    >
      {/* Text content */}
      <div className="flex-1 min-w-0 px-4 py-4">
        <div className="flex items-center gap-2">
          <p className="text-gray-800 font-semibold text-sm truncate min-w-0 text-right">{worry.title}</p>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isResolved ? 'bg-[#A7F3D0] text-[#065F46]' : 'bg-[#FED7AA] text-[#9A3412]'
          }`}>
            {isResolved ? 'נפתר' : 'פעיל'}
          </span>
        </div>

        {worry.description && (
          <p className="text-gray-400 text-xs mt-1.5 line-clamp-2 leading-relaxed text-right">
            {worry.description}
          </p>
        )}

        <p className="text-gray-300 text-[11px] mt-2 text-right">{relativeDate(worry.createdAt)}</p>
      </div>

      {/* Circle meter — trailing (left) side in RTL */}
      <div className="flex items-center px-3">
        <CircleMeter value={isResolved && worry.postAnxietyLevel != null ? worry.postAnxietyLevel : worry.preAnxietyLevel} />
      </div>
    </button>
  )
}
