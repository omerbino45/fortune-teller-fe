import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { worriesApi } from '../api'
import type { Worry } from '../types'
import AnxietyBar from '../components/AnxietyBar'
import SliderField from '../components/SliderField'
import FactorsList from '../components/FactorsList'
import ResolveSheet from '../components/ResolveSheet'
import DeleteConfirmSheet from '../components/DeleteConfirmSheet'

export default function WorryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showResolve, setShowResolve] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [archiving, setArchiving] = useState(false)

  const [editing, setEditing]                   = useState(false)
  const [editTitle, setEditTitle]               = useState('')
  const [editDescription, setEditDescription]   = useState('')
  const [editFactors, setEditFactors]           = useState<string[]>([])
  const [editAssurance, setEditAssurance]       = useState(50)
  const [editActualOutcome, setEditActualOutcome] = useState('')
  const [editPostAnxiety, setEditPostAnxiety]   = useState(50)
  const [saving, setSaving]     = useState(false)
  const [saveError, setSaveError] = useState('')

  const { data: worry, isLoading: loading } = useQuery<Worry>({
    queryKey: ['worry', id],
    queryFn: () => worriesApi.getById(id!),
    enabled: !!id,
    initialData: () => {
      const list = queryClient.getQueryData<Worry[]>(['worries'])
      return list?.find(w => w.id === id)
    },
  })

  const startEditing = () => {
    if (!worry) return
    setEditTitle(worry.title)
    setEditDescription(worry.description ?? '')
    setEditFactors([...worry.factors])
    setEditAssurance(worry.assurance)
    setEditActualOutcome(worry.actualOutcome ?? '')
    setEditPostAnxiety(worry.postAnxietyLevel ?? 50)
    setSaveError('')
    setEditing(true)
  }

  const cancelEditing = () => { setEditing(false); setSaveError('') }

  const updateCaches = (updated: Worry) => {
    queryClient.setQueryData(['worry', id], updated)
    queryClient.setQueryData<Worry[]>(['worries'], (old = []) =>
      old.map(w => w.id === id ? updated : w)
    )
  }

  const saveEdits = async () => {
    if (!worry) return
    if (!editTitle.trim()) { setSaveError('כותרת נדרשת.'); return }
    try {
      setSaving(true); setSaveError('')
      const patch: Record<string, unknown> = {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
        factors: editFactors,
        assurance: editAssurance,
      }
      if (worry.status === 'Resolved') {
        patch.actualOutcome = editActualOutcome.trim() || null
        patch.postAnxietyLevel = editPostAnxiety
      }
      const updated = await worriesApi.patch(worry.id, patch)
      updateCaches(updated); setEditing(false)
    } catch {
      setSaveError('שמירה נכשלה. אנא נסה שוב.')
    } finally {
      setSaving(false)
    }
  }

  const onResolved = (updated: Worry) => { updateCaches(updated); setShowResolve(false) }

  const toggleArchive = async () => {
    if (!worry) return
    try {
      setArchiving(true)
      const updated = await worriesApi.patch(worry.id, { isArchived: !worry.isArchived })
      updateCaches(updated)
      if (!worry.isArchived) navigate(-1)
    } finally {
      setArchiving(false)
    }
  }

  const onDeleted = () => {
    queryClient.setQueryData<Worry[]>(['worries'], (old = []) => old.filter(w => w.id !== id))
    queryClient.removeQueries({ queryKey: ['worry', id] })
    navigate(-1)
  }

  if (loading) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-tx3 text-sm font-light">טוען…</p>
    </div>
  )

  if (!worry) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-tx2 text-sm">הדאגה לא נמצאה.</p>
    </div>
  )

  const isResolved = worry.status === 'Resolved'

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="pt-6 pb-6 px-5 rounded-b-[32px]" style={{ background: 'var(--header-grad)' }}>
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform:'scaleX(-1)'}}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          {editing ? (
            <button onClick={cancelEditing}
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-white/70"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              ביטול
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition"
                style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div
                    className="absolute left-0 top-11 z-20 rounded-2xl shadow-2xl py-2 w-44"
                    style={{
                      background: 'var(--dropdown-bg)',
                      border: '1px solid var(--dropdown-bord)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                    }}
                  >
                    <button
                      onClick={() => { setMenuOpen(false); startEditing() }}
                      className="w-full text-right px-4 py-3 text-sm font-medium transition hover:bg-[var(--in-bg)]"
                      style={{ color: 'var(--tx-1)' }}
                    >
                      עריכה
                    </button>
                    <div style={{ borderTop: '1px solid var(--divider)' }} />
                    <button
                      onClick={() => { setMenuOpen(false); toggleArchive() }}
                      disabled={archiving}
                      className="w-full text-right px-4 py-3 text-sm font-medium transition hover:bg-[var(--in-bg)]"
                      style={{ color: 'var(--tx-2)' }}
                    >
                      {worry.isArchived ? 'הוצא מהארכיון' : 'העבר לארכיון'}
                    </button>
                    <div style={{ borderTop: '1px solid var(--divider)' }} />
                    <button
                      onClick={() => { setMenuOpen(false); setShowDelete(true) }}
                      className="w-full text-right px-4 py-3 text-sm font-medium transition hover:bg-[var(--in-bg)]"
                      style={{ color: 'var(--error-color)' }}
                    >
                      מחיקה
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="mt-3">
          {editing ? (
            <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} maxLength={50}
              className="w-full font-bold text-2xl tracking-tight rounded-xl px-3 py-2 outline-none"
              style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }} />
          ) : (
            <h1 className="text-white text-2xl font-bold tracking-tight line-clamp-2"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}>
              {worry.title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-white/40 text-xs font-light">{new Date(worry.createdAt).toLocaleDateString()}</p>
          <span className="text-xs font-semibold px-3 py-0.5 rounded-full"
            style={{
              background: isResolved ? 'rgba(196, 181, 253, 0.22)' : 'rgba(252, 165, 165, 0.25)',
              color: isResolved ? '#C4B5FD' : '#FCA5A5',
            }}>
            {isResolved ? 'נפתר' : 'פעיל'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-5">
        {saveError && (
          <div className="text-sm rounded-xl px-4 py-3"
            style={{ background: 'var(--error-bg)', border: '1px solid var(--error-bord)', color: 'var(--error-color)' }}>
            {saveError}
          </div>
        )}

        <A i={0}>
          {editing ? (
            <div className="glass-card rounded-2xl px-5 py-4">
              <label className="text-xs font-semibold text-tx3 uppercase tracking-wide mb-2 block">📝 תיאור</label>
              <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                rows={3} className="input-dark !rounded-xl resize-none" placeholder="הקשר נוסף…" />
            </div>
          ) : (
            worry.description && (
              <Section label="תיאור" icon="📝">
                <p className="text-tx1 text-sm leading-relaxed font-light">{worry.description}</p>
              </Section>
            )
          )}
        </A>

        <A i={1}>
          {editing ? (
            <FactorsList factors={editFactors} onChange={setEditFactors} />
          ) : (
            worry.factors.length > 0 && (
              <Section label="פקטורים" icon="🏷️">
                <div className="flex flex-wrap gap-2">
                  {worry.factors.map((f, i) => (
                    <span key={i} className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ background: 'var(--filter-inactive-bg)', color: 'var(--primary)' }}>
                      {f}
                    </span>
                  ))}
                </div>
              </Section>
            )
          )}
        </A>

        <A i={2}>
          <Section label="חרדה בעת יצירה" icon="⚡">
            <AnxietyBar value={worry.preAnxietyLevel} />
          </Section>
        </A>

        <A i={3}>
          <Section label="נבואה" icon="🔮">
            <p className="text-tx1 text-sm leading-relaxed font-light">{worry.prophecy}</p>
          </Section>
        </A>

        <A i={4}>
          {editing ? (
            <SliderField label="ביטחון בנבואה" value={editAssurance} onChange={setEditAssurance} />
          ) : (
            <Section label="ביטחון בנבואה" icon="🎯">
              <AnxietyBar value={worry.assurance} />
            </Section>
          )}
        </A>

        {isResolved && (
          <>
            <A i={5}>
              {editing ? (
                <div className="glass-card rounded-2xl px-5 py-4">
                  <label className="text-xs font-semibold text-tx3 uppercase tracking-wide mb-2 block">✅ תוצאה בפועל</label>
                  <textarea value={editActualOutcome} onChange={(e) => setEditActualOutcome(e.target.value)}
                    rows={3} className="input-dark !rounded-xl resize-none" placeholder="מה קרה בפועל…" />
                </div>
              ) : (
                <Section label="תוצאה בפועל" icon="✅">
                  <p className="text-tx1 text-sm leading-relaxed font-light">{worry.actualOutcome}</p>
                </Section>
              )}
            </A>
            <A i={6}>
              {editing ? (
                <SliderField label="רמת חרדה לאחר מכן" value={editPostAnxiety} onChange={setEditPostAnxiety} />
              ) : (
                <Section label="חרדה אחרי האירוע" icon="📉">
                  <AnxietyBar value={worry.postAnxietyLevel!} />
                </Section>
              )}
            </A>
          </>
        )}
      </div>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, var(--bg) 60%, transparent)' }}
      >
        {editing ? (
          <button onClick={saveEdits} disabled={saving} className="btn-primary w-full py-4 text-sm">
            {saving ? 'שומר…' : 'שמור שינויים'}
          </button>
        ) : !isResolved ? (
          <button onClick={() => setShowResolve(true)} className="btn-primary w-full py-4 text-sm">
            סיים דאגה
          </button>
        ) : null}
      </div>

      {showResolve && worry && (
        <ResolveSheet worryId={worry.id} onResolved={onResolved} onDismiss={() => setShowResolve(false)} />
      )}

      {showDelete && worry && (
        <DeleteConfirmSheet worryId={worry.id} onDeleted={onDeleted} onDismiss={() => setShowDelete(false)} />
      )}
    </div>
  )
}

function A({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: i * 0.06 }}
    >
      {children}
    </motion.div>
  )
}

function Section({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4">
      <p className="text-xs font-semibold text-tx3 uppercase tracking-wide mb-2">
        {icon && <span className="ml-1.5">{icon}</span>}{label}
      </p>
      {children}
    </div>
  )
}
