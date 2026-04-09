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
    <div className="bg-white rounded-2xl px-5 py-4">
      <label className="text-sm font-semibold text-gray-700 mb-3 block">
        פקטורים <span className="text-gray-400 font-normal">(אופציונלי)</span>
      </label>

      {factors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {factors.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 bg-[#EDE9FE] text-[#7C3AED] text-xs font-medium px-3 py-1.5 rounded-full"
            >
              {f}
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-4 h-4 flex items-center justify-center rounded-full bg-[#7C3AED]/15 hover:bg-[#7C3AED]/30 text-[#7C3AED] transition leading-none"
                aria-label="הסר גורם"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {factors.length === 0 && (
        <p className="text-gray-400 text-xs mb-3">לא נוספו גורמים עדיין</p>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="הוסף גורם…"
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-100 transition"
        />
        <button
          type="button"
          onClick={add}
          disabled={!input.trim()}
          className="w-10 h-10 bg-[#7C3AED] disabled:bg-gray-200 text-white rounded-xl text-lg font-bold transition"
        >
          +
        </button>
      </div>
    </div>
  )
}
