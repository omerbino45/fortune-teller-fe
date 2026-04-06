import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { worriesApi } from '../api'
import type { Worry } from '../types'
import AnxietyBar from '../components/AnxietyBar'
import ResolveSheet from '../components/ResolveSheet'

export default function WorryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [worry, setWorry] = useState<Worry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResolve, setShowResolve] = useState(false)

  useEffect(() => {
    if (!id) return
    worriesApi.getById(id)
      .then(setWorry)
      .finally(() => setLoading(false))
  }, [id])

  const onResolved = (updated: Worry) => {
    setWorry(updated)
    setShowResolve(false)
  }

  if (loading) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-gray-400 text-sm">Loading…</p>
    </div>
  )

  if (!worry) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-gray-500 text-sm">Worry not found.</p>
    </div>
  )

  const isResolved = worry.status === 'Resolved'
  const reliefDelta = isResolved && worry.postAnxietyLevel !== null
    ? worry.preAnxietyLevel - worry.postAnxietyLevel!
    : null

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className={`pt-14 pb-6 px-5 rounded-b-[32px] ${isResolved ? 'bg-emerald-600' : 'bg-[#7C3AED]'}`}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isResolved ? 'bg-emerald-500 text-white' : 'bg-orange-400 text-white'}`}>
            {worry.status}
          </span>
        </div>
        <h1 className="text-white text-xl font-bold mt-3 line-clamp-2">{worry.title}</h1>
        <p className="text-white/60 text-xs mt-1">{new Date(worry.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-5">
        {/* Prophecy */}
        <Section label="Prophecy">
          <p className="text-gray-700 text-sm">{worry.prophecy}</p>
        </Section>

        {/* Pre-anxiety */}
        <Section label="Anxiety level at creation">
          <AnxietyBar value={worry.preAnxietyLevel} color="#7C3AED" />
        </Section>

        {/* Assurance */}
        <Section label="Confidence it will happen">
          <AnxietyBar value={worry.assurance} color="#F59E0B" />
        </Section>

        {/* Description */}
        {worry.description && (
          <Section label="Context">
            <p className="text-gray-700 text-sm">{worry.description}</p>
          </Section>
        )}

        {/* Factors */}
        {worry.factors.length > 0 && (
          <Section label="Factors">
            <ul className="space-y-1">
              {worry.factors.map((f, i) => (
                <li key={i} className="text-gray-700 text-sm flex gap-2">
                  <span className="text-[#7C3AED]">•</span> {f}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Reality Check (resolved) */}
        {isResolved && (
          <>
            <Section label="Actual outcome">
              <p className="text-gray-700 text-sm">{worry.actualOutcome}</p>
            </Section>

            <Section label="Post-anxiety level">
              <AnxietyBar value={worry.postAnxietyLevel!} color="#10B981" />
            </Section>

            {reliefDelta !== null && (
              <div className={`rounded-2xl px-5 py-4 flex items-center justify-between ${reliefDelta >= 0 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Relief Delta</p>
                  <p className="text-2xl font-bold mt-0.5" style={{ color: reliefDelta >= 0 ? '#10B981' : '#F97316' }}>
                    {reliefDelta >= 0 ? `−${reliefDelta}` : `+${Math.abs(reliefDelta)}`} pts
                  </p>
                </div>
                <span className="text-3xl">{reliefDelta >= 0 ? '😌' : '😰'}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Resolve button */}
      {!isResolved && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4 bg-gradient-to-t from-[#F5F3FF] via-[#F5F3FF] to-transparent">
          <button
            onClick={() => setShowResolve(true)}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-2xl py-4 text-sm transition"
          >
            Resolve this worry
          </button>
        </div>
      )}

      {/* Resolve bottom sheet */}
      {showResolve && worry && (
        <ResolveSheet
          worryId={worry.id}
          onResolved={onResolved}
          onDismiss={() => setShowResolve(false)}
        />
      )}
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{label}</p>
      {children}
    </div>
  )
}
