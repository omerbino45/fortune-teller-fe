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
        Factors <span className="text-gray-400 font-normal">(optional)</span>
      </label>

      {factors.length === 0 ? (
        <p className="text-gray-400 text-xs mb-3">No factors added yet</p>
      ) : (
        <ul className="space-y-2 mb-3">
          {factors.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-[#7C3AED] text-sm">•</span>
              <span className="flex-1 text-gray-700 text-sm">{f}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 text-sm font-bold transition"
                aria-label="Remove factor"
              >
                −
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Add a factor…"
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
