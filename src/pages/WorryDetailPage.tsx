import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { worriesApi } from '../api'
import type { Worry } from '../types'
import AnxietyBar from '../components/AnxietyBar'
import SliderField from '../components/SliderField'
import FactorsList from '../components/FactorsList'
import ResolveSheet from '../components/ResolveSheet'

export default function WorryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [worry, setWorry] = useState<Worry | null>(null)
  const [loading, setLoading] = useState(true)
  const [showResolve, setShowResolve] = useState(false)

  // Edit mode state
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
      <p className="text-gray-400 text-sm">טוען…</p>
    </div>
  )

  if (!worry) return (
    <div className="app-shell flex items-center justify-center min-h-dvh">
      <p className="text-gray-500 text-sm">הדאגה לא נמצאה.</p>
    </div>
  )

  const isResolved = worry.status === 'Resolved'

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header — always purple */}
      <div className="bg-[#7C3AED] pt-6 pb-6 px-5 rounded-b-[32px]">
        {/* Row 1: back ← ——————————————————— → Edit / Cancel */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform:'scaleX(-1)'}}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>

          {!editing ? (
            <button
              onClick={startEditing}
              className="bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold px-4 py-1.5 rounded-full"
            >
              עריכה
            </button>
          ) : (
            <button
              onClick={cancelEditing}
              className="bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold px-4 py-1.5 rounded-full"
            >
              ביטול
            </button>
          )}
        </div>

        {/* Row 2: title */}
        <div className="mt-3">
          {editing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={50}
              className="w-full bg-white/20 text-white placeholder-white/50 font-bold text-xl rounded-xl px-3 py-2 outline-none border border-white/30 focus:border-white"
            />
          ) : (
            <h1 className="text-white text-xl font-bold line-clamp-2">{worry.title}</h1>
          )}
        </div>

        {/* Row 3: date + status badge */}
        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-white/60 text-xs">{new Date(worry.createdAt).toLocaleDateString()}</p>
          <span className={`text-xs font-semibold px-3 py-0.5 rounded-full ${isResolved ? 'bg-[#A7F3D0] text-[#065F46]' : 'bg-[#FED7AA] text-[#9A3412]'}`}>
            {isResolved ? 'נפתר' : 'פעיל'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-32 space-y-5">
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {saveError}
          </div>
        )}

        {/* 2. Description — editable */}
        {editing ? (
          <div className="bg-white rounded-2xl px-5 py-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">📝 תיאור</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-100 transition resize-none"
              placeholder="הקשר נוסף…"
            />
          </div>
        ) : (
          worry.description && (
            <Section label="תיאור" icon="📝">
              <p className="text-gray-700 text-sm leading-relaxed">{worry.description}</p>
            </Section>
          )
        )}

        {/* 3. Factors — editable */}
        {editing ? (
          <FactorsList factors={editFactors} onChange={setEditFactors} />
        ) : (
          worry.factors.length > 0 && (
            <Section label="פקטורים" icon="🏷️">
              <div className="flex flex-wrap gap-2">
                {worry.factors.map((f, i) => (
                  <span key={i} className="bg-[#EDE9FE] text-[#7C3AED] text-xs font-medium px-3 py-1.5 rounded-full">
                    {f}
                  </span>
                ))}
              </div>
            </Section>
          )
        )}

        {/* 4. Anxiety level — always read-only */}
        <Section label="חרדה בעת יצירה" icon="⚡">
          <AnxietyBar value={worry.preAnxietyLevel}  />
        </Section>

        {/* 5. Prophecy — always read-only */}
        <Section label="נבואה" icon="🔮">
          <p className="text-gray-700 text-sm leading-relaxed">{worry.prophecy}</p>
        </Section>

        {/* 6. Confidence — editable */}
        {editing ? (
          <SliderField
            label="ביטחון בנבואה"
            value={editAssurance}
            onChange={setEditAssurance}
          />
        ) : (
          <Section label="ביטחון בנבואה" icon="🎯">
            <AnxietyBar value={worry.assurance}  />
          </Section>
        )}

        {/* 7 & 8. Actual outcome + Post-anxiety (resolved only) */}
        {isResolved && (
          <>
            {editing ? (
              <>
                <div className="bg-white rounded-2xl px-5 py-4">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">✅ תוצאה בפועל</label>
                  <textarea
                    value={editActualOutcome}
                    onChange={(e) => setEditActualOutcome(e.target.value)}
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-base text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-purple-100 transition resize-none"
                    placeholder="מה קרה בפועל…"
                  />
                </div>
                <SliderField
                  label="רמת חרדה לאחר מכן"
                  value={editPostAnxiety}
                  onChange={setEditPostAnxiety}
                />
              </>
            ) : (
              <>
                <Section label="תוצאה בפועל" icon="✅">
                  <p className="text-gray-700 text-sm leading-relaxed">{worry.actualOutcome}</p>
                </Section>
                <Section label="חרדה אחרי האירוע" icon="📉">
                  <AnxietyBar value={worry.postAnxietyLevel!}  />
                </Section>
              </>
            )}

          </>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] px-5 pb-8 pt-4 bg-gradient-to-t from-[#F5F3FF] via-[#F5F3FF] to-transparent">
        {editing ? (
          <button
            onClick={saveEdits}
            disabled={saving}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition"
          >
            {saving ? 'שומר…' : 'שמור שינויים'}
          </button>
        ) : !isResolved ? (
          <button
            onClick={() => setShowResolve(true)}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold rounded-2xl py-4 text-sm transition"
          >
            סיים דאגה
          </button>
        ) : null}
      </div>

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

function Section({ label, icon, children }: { label: string; icon?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {icon && <span className="ml-1.5">{icon}</span>}{label}
      </p>
      {children}
    </div>
  )
}
