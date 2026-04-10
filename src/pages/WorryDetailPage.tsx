import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { worriesApi } from '../api'
import type { Worry } from '../types'
import AnxietyBar from '../components/AnxietyBar'
import SliderField from '../components/SliderField'
import FactorsList from '../components/FactorsList'
import ResolveSheet from '../components/ResolveSheet'
import ProphecyReveal from '../components/ProphecyReveal'

export default function WorryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [worry, setWorry] = useState<Worry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResolve, setShowResolve] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editFactors, setEditFactors] = useState<string[]>([])
  const [editAssurance, setEditAssurance] = useState(50)
  const [editActualOutcome, setEditActualOutcome] = useState('')
  const [editPostAnxiety, setEditPostAnxiety] = useState(50)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    if (!id) return
    worriesApi.getById(id)
      .then(setWorry)
      .finally(() => setLoading(false))
  }, [id])

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

  const cancelEditing = () => {
    setEditing(false)
    setSaveError('')
  }

  const saveEdits = async () => {
    if (!worry) return
    if (!editTitle.trim()) { setSaveError('כותרת נדרשת.'); return }
    try {
      setSaving(true)
      setSaveError('')
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
      setWorry(updated)
      setEditing(false)
    } catch {
      setSaveError('שמירה נכשלה. אנא נסה שוב.')
    } finally {
      setSaving(false)
    }
  }

  const onResolved = (updated: Worry) => {
    setWorry(updated)
    setShowResolve(false)
  }

  if (loading) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-[#5B4F7A] text-sm">טוען…</p>
    </div>
  )

  if (!worry) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-[#9B8EC4] text-sm">הדאגה לא נמצאה.</p>
    </div>
  )

  const isResolved = worry.status === 'Resolved'

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div
        className="pt-6 pb-6 px-5 rounded-b-[32px]"
        style={{ background: 'linear-gradient(160deg, #1E0A4F 0%, #0A0818 100%)' }}
      >
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform:'scaleX(-1)'}}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          {!editing ? (
            <button
              onClick={startEditing}
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-[#C084FC]"
              style={{ background: 'rgba(155,111,214,0.2)', border: '1px solid rgba(155,111,214,0.3)' }}
            >
              עריכה
            </button>
          ) : (
            <button
              onClick={cancelEditing}
              className="text-xs font-semibold px-4 py-1.5 rounded-full text-[#9B8EC4]"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              ביטול
            </button>
          )}
        </div>

        <div className="mt-3">
          {editing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={50}
              className="w-full font-bold text-xl rounded-xl px-3 py-2 outline-none"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: 'white',
              }}
            />
          ) : (
            <h1 className="text-white text-xl font-bold line-clamp-2">{worry.title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-white/40 text-xs">{new Date(worry.createdAt).toLocaleDateString()}</p>
          <span className={`text-xs font-semibold px-3 py-0.5 rounded-full ${
            isResolved
              ? 'bg-[rgba(110,231,183,0.2)] text-[#6EE7B7]'
              : 'bg-[rgba(253,186,116,0.2)] text-[#FDBA74]'
          }`}>
            {isResolved ? 'נפתר' : 'פעיל'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-5">
        {saveError && (
          <div className="text-sm rounded-xl px-4 py-3"
            style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
            {saveError}
          </div>
        )}

        {/* Description */}
        {editing ? (
          <div className="glass-card rounded-2xl px-5 py-4">
            <label className="text-xs font-semibold text-[#5B4F7A] uppercase tracking-wide mb-2 block">📝 תיאור</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="input-dark resize-none !rounded-xl"
              placeholder="הקשר נוסף…"
            />
          </div>
        ) : (
          worry.description && (
            <Section label="תיאור" icon="📝">
              <p className="text-[#EDE9FE] text-sm leading-relaxed">{worry.description}</p>
            </Section>
          )
        )}

        {/* Factors */}
        {editing ? (
          <FactorsList factors={editFactors} onChange={setEditFactors} />
        ) : (
          worry.factors.length > 0 && (
            <Section label="פקטורים" icon="🏷️">
              <div className="flex flex-wrap gap-2">
                {worry.factors.map((f, i) => (
                  <span key={i}
                    className="text-xs font-medium px-3 py-1.5 rounded-full text-[#C084FC]"
                    style={{ background: 'rgba(155,111,214,0.25)' }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </Section>
          )
        )}

        {/* Anxiety level */}
        <Section label="חרדה בעת יצירה" icon="⚡">
          <AnxietyBar value={worry.preAnxietyLevel} />
        </Section>

        {/* Prophecy — with reveal animation */}
        <Section label="נבואה" icon="🔮">
          <ProphecyReveal>
            <p className="text-[#EDE9FE] text-sm leading-relaxed">{worry.prophecy}</p>
          </ProphecyReveal>
        </Section>

        {/* Confidence */}
        {editing ? (
          <SliderField label="ביטחון בנבואה" value={editAssurance} onChange={setEditAssurance} />
        ) : (
          <Section label="ביטחון בנבואה" icon="🎯">
            <AnxietyBar value={worry.assurance} />
          </Section>
        )}

        {/* Resolved fields */}
        {isResolved && (
          <>
            {editing ? (
              <>
                <div className="glass-card rounded-2xl px-5 py-4">
                  <label className="text-xs font-semibold text-[#5B4F7A] uppercase tracking-wide mb-2 block">✅ תוצאה בפועל</label>
                  <textarea
                    value={editActualOutcome}
                    onChange={(e) => setEditActualOutcome(e.target.value)}
                    rows={3}
                    className="input-dark resize-none !rounded-xl"
                    placeholder="מה קרה בפועל…"
                  />
                </div>
                <SliderField label="רמת חרדה לאחר מכן" value={editPostAnxiety} onChange={setEditPostAnxiety} />
              </>
            ) : (
              <>
                <Section label="תוצאה בפועל" icon="✅">
                  <p className="text-[#EDE9FE] text-sm leading-relaxed">{worry.actualOutcome}</p>
                </Section>
                <Section label="חרדה אחרי האירוע" icon="📉">
                  <AnxietyBar value={worry.postAnxietyLevel!} />
                </Section>
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom action bar */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(to top, #0A0818 60%, transparent)' }}
      >
        {editing ? (
          <button
            onClick={saveEdits}
            disabled={saving}
            className="btn-primary w-full py-4 text-sm"
          >
            {saving ? 'שומר…' : 'שמור שינויים'}
          </button>
        ) : !isResolved ? (
          <button
            onClick={() => setShowResolve(true)}
            className="btn-primary w-full py-4 text-sm"
          >
            סיים דאגה
          </button>
        ) : null}
      </div>

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

function Section({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="glass-card rounded-2xl px-5 py-4">
      <p className="text-xs font-semibold text-[#5B4F7A] uppercase tracking-wide mb-2">
        {icon && <span className="ml-1.5">{icon}</span>}{label}
      </p>
      {children}
    </div>
  )
}
