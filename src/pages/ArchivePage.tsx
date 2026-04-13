import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { worriesApi } from '../api'
import type { Worry } from '../types'
import BottomNav from '../components/BottomNav'
import WorryCard from '../components/WorryCard'

export default function ArchivePage() {
  const navigate = useNavigate()

  const { data: worries = [], isLoading } = useQuery<Worry[]>({
    queryKey: ['worries'],
    queryFn: worriesApi.getAll,
  })

  const archived = [...worries]
    .filter(w => w.isArchived)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="pt-6 pb-8 px-5 rounded-b-[32px]" style={{ background: 'var(--header-grad)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white/80 active:opacity-60 transition-opacity"
            aria-label="חזור"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold">ארכיון</h1>
            {!isLoading && archived.length > 0 && (
              <p className="text-white/60 text-sm font-light">{archived.length} דאגות</p>
            )}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-5 pt-5 pb-28 space-y-3">
        {isLoading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : archived.length === 0 ? (
          <div className="text-center pt-16">
            <div className="text-5xl mb-4">📦</div>
            <p className="font-semibold" style={{ color: 'var(--tx-1)' }}>הארכיון ריק</p>
            <p className="text-sm mt-1 font-light" style={{ color: 'var(--tx-3)' }}>דאגות שתארכן יופיעו כאן</p>
          </div>
        ) : (
          <AnimatePresence>
            {archived.map((w, i) => (
              <motion.div
                key={w.id}
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
