import { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export interface DateRange {
  from: Date | null
  to: Date | null
}

interface Props {
  value: DateRange
  onChange: (range: DateRange) => void
}

const DAYS   = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']
const MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר']
const PRESETS = [
  { label: 'יום אחרון',  days: 1  },
  { label: 'שבוע אחרון', days: 7  },
  { label: 'חודש אחרון', days: 30 },
  { label: '3 חודשים',   days: 90 },
]

function sod(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()) }
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function inRange(d: Date, from: Date | null, to: Date | null) {
  return !!from && !!to && d >= from && d <= to
}
function fmt(d: Date) { return `${d.getDate()}/${d.getMonth() + 1}` }

export default function DateFilterBubble({ value, onChange }: Props) {
  const [open, setOpen]           = useState(false)
  const [draft, setDraft]         = useState<DateRange>(value)
  const [step, setStep]           = useState<'from' | 'to'>('from')
  const [viewYear, setViewYear]   = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
  const containerRef = useRef<HTMLDivElement>(null)

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

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDow    = new Date(viewYear, viewMonth, 1).getDay()
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
      setDraft({ from: clicked, to: null }); setStep('to')
    } else {
      const range = clicked < draft.from
        ? { from: clicked, to: draft.from }
        : { from: draft.from, to: clicked }
      setDraft(range); setStep('from')
    }
  }

  const applyPreset = (days: number) => {
    const to = sod(new Date())
    const from = sod(new Date())
    from.setDate(from.getDate() - days)
    const range = { from, to }
    setDraft(range); onChange(range); setOpen(false)
  }

  const apply = () => { onChange(draft); setOpen(false) }
  const clear = () => {
    const empty = { from: null, to: null }
    setDraft(empty); onChange(empty); setOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => { setDraft(value); setStep('from'); setOpen(o => !o) }}
        className="whitespace-nowrap text-xs font-semibold px-4 py-1.5 rounded-full transition flex items-center gap-1"
        style={isActive
          ? { background: 'var(--primary)', color: 'white', boxShadow: '0 0 10px var(--primary-glow)' }
          : { background: 'var(--filter-inactive-bg)', color: 'var(--filter-inactive-color)', border: '1px solid var(--bord)' }
        }
      >
        {label}
      </button>

      <AnimatePresence>
      {open && (
        <motion.div
          dir="ltr"
          className="absolute top-10 left-0 z-50 rounded-2xl shadow-2xl p-4 w-72"
          initial={{ opacity: 0, scale: 0.95, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -6 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            background: 'var(--dropdown-bg)',
            border: '1px solid var(--dropdown-bord)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
          }}
        >
          <p className="text-[11px] text-tx3 text-center mb-3" dir="rtl">
            {step === 'from' ? 'בחר תאריך התחלה' : 'בחר תאריך סיום'}
          </p>

          <div dir="rtl" className="grid grid-cols-2 gap-1.5 mb-4">
            {PRESETS.map(p => (
              <button
                key={p.label}
                onClick={() => applyPreset(p.days)}
                dir="rtl"
                className="text-xs font-medium px-3 py-1.5 rounded-full transition text-center"
                style={{ background: 'var(--filter-inactive-bg)', color: 'var(--primary)' }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--divider)' }} className="my-3" />

          <div className="flex items-center justify-between mb-2 px-1">
            <button onClick={prevMonth} className="p-1 text-tx3 hover:text-tx1 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <span className="text-sm font-semibold text-tx1">{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-1 text-tx3 hover:text-tx1 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-tx3 py-1">{d}</div>
            ))}
          </div>

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
                  className="text-xs h-8 w-full rounded-lg font-medium transition"
                  style={
                    isFrom || isTo
                      ? { background: 'var(--primary)', color: 'white' }
                      : ranged
                      ? { background: 'var(--filter-inactive-bg)', color: 'var(--primary)' }
                      : { color: 'var(--tx-2)' }
                  }
                >
                  {day}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={clear}
              className="flex-1 py-2.5 text-xs font-semibold rounded-xl transition text-tx2"
              style={{ border: '1px solid var(--bord)' }}
            >
              נקה
            </button>
            <button
              onClick={apply}
              disabled={!draft.from}
              className="flex-1 py-2.5 text-xs font-semibold text-white rounded-xl disabled:opacity-40 transition"
              style={{ background: 'var(--primary)' }}
            >
              החל
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
