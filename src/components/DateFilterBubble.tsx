import { useState, useRef, useEffect } from 'react'

export interface DateRange {
  from: Date | null
  to: Date | null
}

interface Props {
  value: DateRange
  onChange: (range: DateRange) => void
}

const DAYS    = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']   // Sun → Sat
const MONTHS  = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']

const PRESETS = [
  { label: 'יום אחרון',   days: 1   },
  { label: 'שבוע אחרון',  days: 7   },
  { label: 'חודש אחרון',  days: 30  },
  { label: '3 חודשים',    days: 90  },
]

function sod(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function inRange(d: Date, from: Date | null, to: Date | null) {
  return !!from && !!to && d >= from && d <= to
}
function fmt(d: Date) {
  return `${d.getDate()}/${d.getMonth() + 1}`
}

export default function DateFilterBubble({ value, onChange }: Props) {
  const [open, setOpen]           = useState(false)
  const [draft, setDraft]         = useState<DateRange>(value)
  const [step, setStep]           = useState<'from' | 'to'>('from')
  const [viewYear, setViewYear]   = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const isActive = !!(value.from || value.to)

  const label = value.from && value.to
    ? `${fmt(value.from)} – ${fmt(value.to)}`
    : value.from ? `מ-${fmt(value.from)}` : 'תאריך'

  // Calendar cells
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay()  // 0=Sun
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prevMonth = () => viewMonth === 0
    ? (setViewMonth(11), setViewYear(y => y - 1))
    : setViewMonth(m => m - 1)
  const nextMonth = () => viewMonth === 11
    ? (setViewMonth(0), setViewYear(y => y + 1))
    : setViewMonth(m => m + 1)

  const pickDay = (day: number) => {
    const clicked = sod(new Date(viewYear, viewMonth, day))
    if (step === 'from' || !draft.from) {
      setDraft({ from: clicked, to: null })
      setStep('to')
    } else {
      const range = clicked < draft.from
        ? { from: clicked, to: draft.from }
        : { from: draft.from, to: clicked }
      setDraft(range)
      setStep('from')
    }
  }

  const applyPreset = (days: number) => {
    const to   = sod(new Date())
    const from = sod(new Date())
    from.setDate(from.getDate() - days)
    const range = { from, to }
    setDraft(range)
    onChange(range)
    setOpen(false)
  }

  const apply = () => { onChange(draft); setOpen(false) }

  const clear = () => {
    const empty = { from: null, to: null }
    setDraft(empty)
    onChange(empty)
    setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      {/* Bubble */}
      <button
        onClick={() => { setDraft(value); setStep('from'); setOpen(o => !o) }}
        className={`whitespace-nowrap text-xs font-semibold px-4 py-1.5 rounded-full transition flex items-center gap-1 ${
          isActive
            ? 'bg-[#7C3AED] text-white'
            : 'bg-white text-gray-500 border border-gray-200'
        }`}
      >
        {label}
      </button>

      {/* Popover — ltr so calendar renders correctly */}
      {open && (
        <div
          dir="ltr"
          className="absolute top-10 left-0 z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 w-72"
        >
          {/* Hint */}
          <p className="text-[11px] text-gray-400 text-center mb-3" dir="rtl">
            {step === 'from' ? 'בחר תאריך התחלה' : 'בחר תאריך סיום'}
          </p>

          {/* Quick presets */}
          <div dir="rtl" className="grid grid-cols-2 gap-1.5 mb-4">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.days)}
                dir="rtl"
                className="text-xs bg-[#EDE9FE] text-[#7C3AED] font-medium px-3 py-1.5 rounded-full hover:bg-[#DDD6FE] transition text-center"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 my-3" />

          {/* Month nav */}
          <div className="flex items-center justify-between mb-2 px-1">
            <button onClick={prevMonth} className="p-1 text-gray-400 hover:text-gray-700 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="p-1 text-gray-400 hover:text-gray-700 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Day-of-week headers (Sun → Sat) */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, i) => {
              if (!day) return <div key={i} />
              const date  = sod(new Date(viewYear, viewMonth, day))
              const isFrom = draft.from && sameDay(date, draft.from)
              const isTo   = draft.to   && sameDay(date, draft.to)
              const ranged = inRange(date, draft.from, draft.to)

              return (
                <button
                  key={i}
                  onClick={() => pickDay(day)}
                  className={`text-xs h-8 w-full rounded-lg font-medium transition ${
                    isFrom || isTo
                      ? 'bg-[#7C3AED] text-white'
                      : ranged
                      ? 'bg-[#EDE9FE] text-[#7C3AED]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={clear}
              className="flex-1 py-2.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              נקה
            </button>
            <button
              onClick={apply}
              disabled={!draft.from}
              className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#7C3AED] rounded-xl disabled:opacity-40 hover:bg-[#6D28D9] transition"
            >
              החל
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
