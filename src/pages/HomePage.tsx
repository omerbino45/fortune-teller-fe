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

  const activeCount = worries.filter(w => w.status === 'Active').length
  const resolvedCount = worries.filter(w => w.status === 'Resolved').length

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div
        className="pt-6 pb-8 px-5 rounded-b-[32px]"
        style={{ background: 'linear-gradient(160deg, #1E0A4F 0%, #0A0818 100%)' }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">שלום, {user?.name ?? '…'} 👋</h1>
          <UserMenu />
        </div>
        <p className="text-[#9B8EC4] text-sm mt-0.5">
          {worries.length === 0
            ? 'איך אתה מרגיש היום?'
            : `${activeCount} פעילות · ${resolvedCount} נפתרו`}
        </p>

        {/* Search */}
        <div className="mt-5 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש דאגות…"
            className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm text-[#EDE9FE] outline-none"
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        </div>
      </div>

      {/* Filter bubbles */}
      <div className="px-5 pt-5 flex gap-2 flex-wrap">
        {(['All', 'Active', 'Resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition`}
            style={filter === f
              ? { background: '#9B6FD6', color: 'white', boxShadow: '0 0 10px rgba(155,111,214,0.4)' }
              : { background: 'rgba(255,255,255,0.07)', color: '#9B8EC4', border: '1px solid rgba(255,255,255,0.12)' }
            }
          >
            {f === 'All' ? 'הכל' : f === 'Active' ? 'פעיל' : 'נפתר'}
          </button>
        ))}
        <DateFilterBubble value={dateRange} onChange={setDateRange} />
      </div>

      {/* List */}
      <div className="flex-1 px-5 pt-4 pb-28 space-y-3">
        {loading ? (
          <div className="text-center text-[#5B4F7A] text-sm pt-12">טוען…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center pt-16 animate-fade-up">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-[#9B8EC4] font-medium">אין דאגות עדיין</p>
            <p className="text-[#5B4F7A] text-sm mt-1">לחץ + כדי להוסיף את הראשונה</p>
          </div>
        ) : (
          filtered.map((w, i) => (
            <WorryCard key={w.id} worry={w} index={i} onClick={() => navigate(`/worries/${w.id}`)} />
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/worries/new')}
        className="fixed bottom-24 left-5 w-14 h-14 text-white rounded-full flex items-center justify-center text-2xl z-10 active:scale-95 transition-transform"
        style={{
          background: '#9B6FD6',
          boxShadow: '0 0 20px 6px rgba(155,111,214,0.5)',
        }}
      >
        +
      </button>

      <BottomNav active="home" />
    </div>
  )
}
