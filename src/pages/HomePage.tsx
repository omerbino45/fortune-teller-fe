import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { worriesApi } from '../api'
import { useAuthStore } from '../store/authStore'
import type { Worry } from '../types'
import BottomNav from '../components/BottomNav'
import WorryCard from '../components/WorryCard'
import UserMenu from '../components/UserMenu'

export default function HomePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [worries, setWorries] = useState<Worry[]>([])
  const [search, setSearch] = useState('')
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
    const q = search.toLowerCase()
    return !q || w.title.toLowerCase().includes(q) || (w.description ?? '').toLowerCase().includes(q)
  })

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Purple header */}
      <div className="bg-[#7C3AED] pt-14 pb-8 px-5 rounded-b-[32px]">
        <div className="flex items-center justify-between mb-5">
          <div className="w-8 h-8" /> {/* spacer */}
          <UserMenu />
        </div>
        <h1 className="text-white text-2xl font-bold">
          Hello, {user?.name ?? '…'} 👋
        </h1>
        <p className="text-purple-200 text-sm mt-0.5">How are you feeling today?</p>

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
            placeholder="Search worries…"
            className="w-full bg-white rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-700 outline-none"
          />
        </div>
      </div>

      {/* Filter bubbles */}
      <div className="px-5 pt-5 flex gap-2">
        <button className="bg-[#7C3AED] text-white text-xs font-semibold px-4 py-1.5 rounded-full">
          All
        </button>
      </div>

      {/* List */}
      <div className="flex-1 px-5 pt-4 pb-28 space-y-3">
        {loading ? (
          <div className="text-center text-gray-400 text-sm pt-12">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center pt-16">
            <div className="text-5xl mb-4">🔮</div>
            <p className="text-gray-500 font-medium">No worries yet</p>
            <p className="text-gray-400 text-sm mt-1">Tap + to record your first one</p>
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
        className="fixed bottom-24 right-5 w-14 h-14 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition z-10"
      >
        +
      </button>

      <BottomNav active="home" />
    </div>
  )
}
