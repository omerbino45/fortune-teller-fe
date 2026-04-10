import { useState } from 'react'

interface Props {
  factors: string[]
  onChange: (factors: string[]) => void
}

export default function FactorsList({ factors, onChange }: Props) {
  const [input, setInput] = useState('')

  const add = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    onChange([...factors, trimmed])
    setInput('')
  }

  const remove = (i: number) => {
    onChange(factors.filter((_, idx) => idx !== i))
  }

  return (
    <div className="glass-card rounded-2xl px-5 py-4">
      <label className="text-sm font-semibold text-tx1 mb-3 block">
        פקטורים <span className="text-tx3 font-light">(אופציונלי)</span>
      </label>

      {factors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {factors.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'var(--filter-inactive-bg)', color: 'var(--primary)' }}
            >
              {f}
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-4 h-4 flex items-center justify-center rounded-full transition leading-none"
                style={{ background: 'var(--in-bord)', color: 'var(--primary)' }}
                aria-label="הסר גורם"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {factors.length === 0 && (
        <p className="text-tx3 text-xs mb-3 font-light">לא נוספו גורמים עדיין</p>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="הוסף גורם…"
          className="input-dark flex-1 !rounded-xl !px-3 !py-2.5 !text-sm"
          style={{ fontSize: '16px' }}
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="w-10 h-10 text-white rounded-xl text-lg font-bold transition disabled:opacity-40"
          style={{ background: input.trim() ? 'var(--primary)' : 'var(--in-bord)' }}
        >
          +
        </button>
      </div>
    </div>
  )
}
