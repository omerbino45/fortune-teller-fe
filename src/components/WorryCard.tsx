import type { Worry } from '../types'

export default function WorryCard({ worry, onClick }: { worry: Worry; onClick: () => void }) {
  const isResolved = worry.status === 'Resolved'

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white rounded-2xl px-5 py-4 flex items-start justify-between gap-3 active:scale-[0.98] transition"
    >
      <div className="flex-1 min-w-0">
        <p className="text-gray-800 font-semibold text-sm truncate">{worry.title}</p>
        {worry.description && (
          <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{worry.description}</p>
        )}
        <p className="text-gray-300 text-xs mt-1.5">
          {new Date(worry.createdAt).toLocaleDateString()}
        </p>
      </div>

      <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full mt-0.5 ${
        isResolved
          ? 'bg-emerald-100 text-emerald-700'
          : 'bg-orange-100 text-orange-600'
      }`}>
        {isResolved ? 'Resolved' : 'Active'}
      </span>
    </button>
  )
}
