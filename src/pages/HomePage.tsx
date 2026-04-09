import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { worriesApi } from '../api'
import { useAuthStore } from '../store/authStore'
import type { Worry } from '../types'
import BottomNav from '../components/BottomNav'
import WorryCard from '../components/WorryCard'
import UserMenu from '../components/UserMenu'
import DateFilterBubble, { type DateRange } from '../components/DateFilterBubble'

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [worries, setWorries] = useState<Worry[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Active' | 'Resolved'>('All')
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    worriesApi.getAll()
      .then(setWorries)
      .finally(() => setLoading(false))
  }, [])

  // Sort: Active newest-first, then Resolved
  const sorted = [...worries].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'Active' ? -1 : 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const filtered = sorted.filter((w) => {
    if (filter !== 'All' && w.status !== filter) return false
    if (dateRange.from && new Date(w.createdAt) < dateRange.from) return false
    if (dateRange.to) {
      const endOfDay = new Date(dateRange.to)
      endOfDay.setHours(23, 59, 59, 999)
      if (new Date(w.createdAt) > endOfDay) return false
    }
    const q = search.toLowerCase()
    return !q || w.title.toLowerCase().includes(q) || (w.description ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Purple header */}
      <div className="bg-[#7C3AED] pt-6 pb-8 px-5 rounded-b-[32px]">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">שלום, {user?.name ?? '…'} 👋</h1>
          <UserMenu />
        </div>
        <p className="text-purple-200 text-sm mt-0.5">
          {worries.length === 0
            ? 'איך אתה מרגיש היום?'
            : `${worries.filter(w => w.status === 'Active').length} פעילות · ${worries.filter(w => w.status === 'Resolved').length} נפתרו`}
        </p>

        {/* Search */}
        <div className="mt-5 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש דאגות…"
            className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>

      {/* Filter bubbles */}
      <div className="px-5 pt-5 flex gap-2 flex-wrap">
        {(['All', 'Active', 'Resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition ${
              filter === f
                ? 'bg-[#7C3AED] text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {f === 'All' ? 'הכל' : f === 'Active' ? 'פעיל' : 'נפתר'}
          </button>
        ))}
        <DateFilterBubble value={dateRange} onChange={setDateRange} />
      </div>

      {/* List */}
      <div className="flex-1 px-5 pt-4 pb-28 space-y-3">
        {loading ? (
          <div className="text-center text-gray-400 text-sm pt-12">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center pt-16">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-gray-500 font-medium">אין דאגות עדיין</p>
            <p className="text-gray-400 text-sm mt-1">לחץ + כדי להוסיף את הראשונה</p>
          </div>
        ) : (
          filtered.map((w) => (
            <WorryCard key={w.id} worry={w} onClick={() => navigate(`/worries/${w.id}`)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/worries/new')}
        className="fixed bottom-24 left-5 w-14 h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full shadow-lg ring-4 ring-[#7C3AED]/25 flex items-center justify-center text-2xl transition z-10"
      >
        +
      </button>

      <BottomNav active="home" />
    </div>
  )
}
