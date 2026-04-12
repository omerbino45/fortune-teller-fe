import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
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
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'All' | 'Active' | 'Resolved'>('All')
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null })

  const { data: worries = [], isLoading: loading } = useQuery<Worry[]>({
    queryKey: ['worries'],
    queryFn: worriesApi.getAll,
  })

  const sorted = [...worries].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const filtered = sorted.filter((w) => {
    if (filter !== 'All' && w.status !== filter) return false
    if (dateRange.from && new Date(w.createdAt) < dateRange.from) return false
    if (dateRange.to) {
      const end = new Date(dateRange.to)
      end.setHours(23, 59, 59, 999)
      if (new Date(w.createdAt) > end) return false
    }
    const q = search.toLowerCase()
    return !q || w.title.toLowerCase().includes(q) || (w.description ?? '').toLowerCase().includes(q)
  })

  const activeCount   = worries.filter(w => w.status === 'Active').length
  const resolvedCount = worries.filter(w => w.status === 'Resolved').length

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="pt-6 pb-8 px-5 rounded-b-[32px]" style={{ background: 'var(--header-grad)' }}>
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">שלום, {user?.name ?? '…'} 👋</h1>
          <UserMenu />
        </div>
        <p className="text-white/60 text-sm mt-0.5 font-light">
          {worries.length === 0 ? 'איך אתה מרגיש היום?' : `${activeCount} פעילות · ${resolvedCount} נפתרו`}
        </p>

        {/* Search */}
        <div className="mt-5 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש דאגות…"
            className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm outline-none font-light"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Filter bubbles */}
      <div className="px-5 pt-5 flex gap-2 flex-wrap">
        {(['All', 'Active', 'Resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-xs font-semibold px-4 py-1.5 rounded-full transition"
            style={filter === f
              ? { background: 'var(--primary)', color: 'white', boxShadow: '0 0 10px var(--primary-glow)' }
              : { background: 'var(--filter-inactive-bg)', color: 'var(--filter-inactive-color)', border: '1px solid var(--bord)' }
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
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <div className="text-center pt-16 animate-fade-up">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-tx1 font-semibold">אין דאגות עדיין</p>
            <p className="text-tx3 text-sm mt-1 font-light">לחץ + כדי להוסיף את הראשונה</p>
          </div>
        ) : (
          <AnimatePresence>
            {filtered.map((w, i) => (
              <motion.div
                key={w.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: i < 4 ? i * 0.04 : 0 }}
              >
                <WorryCard worry={w} onClick={() => navigate(`/worries/${w.id}`)} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/worries/new')}
        className="fixed bottom-24 left-5 w-14 h-14 text-white rounded-full flex items-center justify-center text-2xl z-10 active:scale-95 transition-transform"
        style={{ background: 'var(--primary)', boxShadow: '0 0 20px 6px var(--primary-glow)' }}
      >
        +
      </button>

      <BottomNav active="home" />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex h-[80px] relative animate-pulse">
      <div className="absolute top-0 right-0 bottom-0 w-[3px]" style={{ background: 'var(--in-bord)' }} />
      <div className="flex-1 px-4 py-4 space-y-2.5">
        <div className="h-3.5 rounded-full w-3/4" style={{ background: 'var(--in-bord)' }} />
        <div className="h-2.5 rounded-full w-1/2" style={{ background: 'var(--in-bord)' }} />
        <div className="h-2 rounded-full w-1/4" style={{ background: 'var(--in-bord)' }} />
      </div>
      <div className="flex items-center pl-3 pr-5 pt-3">
        <div className="w-12 h-12 rounded-full" style={{ background: 'var(--in-bord)' }} />
      </div>
    </div>
  )
}
