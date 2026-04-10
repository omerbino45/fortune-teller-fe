import { useState } from 'react'
import { worriesApi } from '../api'
import type { Worry } from '../types'
import SliderField from './SliderField'

interface Props {
  worryId: string
  onResolved: (worry: Worry) => void
  onDismiss: () => void
}

export default function ResolveSheet({ worryId, onResolved, onDismiss }: Props) {
  const [outcome, setOutcome] = useState('')
  const [postLevel, setPostLevel] = useState(50)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleConfirm = async () => {
    if (!outcome.trim()) { setError('אנא תאר מה שקרה בפועל.'); return }
    try {
      setSaving(true)
      setError('')
      const updated = await worriesApi.patch(worryId, {
        actualOutcome: outcome,
        postAnxietyLevel: postLevel,
      })
      onResolved(updated)
    } catch {
      setError('שמירה נכשלה. אנא נסה שוב.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-20"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onDismiss}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] rounded-t-[28px] z-30 px-6 pt-4 pb-10 shadow-2xl"
        style={{
          background: 'rgba(15, 8, 35, 0.97)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderBottom: 'none',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.2)' }} />

        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'rgba(110,231,183,0.2)' }}>✅</div>
          <h2 className="text-xl font-bold text-[#EDE9FE]">סיום דאגה</h2>
        </div>
        <p className="text-[#9B8EC4] text-sm mb-6 mr-12">תעד מה שקרה בפועל</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-4"
            style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-[#EDE9FE] mb-1.5 block">תוצאה בפועל *</label>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              rows={3}
              className="input-dark !rounded-2xl resize-none"
              placeholder="מה שקרה באמת…"
            />
          </div>

          <SliderField
            label="כמה אתה חרד עכשיו?"
            value={postLevel}
            onChange={setPostLevel}
          />

          <button
            onClick={handleConfirm}
            disabled={saving}
            className="w-full text-white font-semibold rounded-2xl py-4 text-sm transition disabled:opacity-60"
            style={{ background: '#22c55e', boxShadow: '0 0 16px rgba(34,197,94,0.4)' }}
          >
            {saving ? 'שומר…' : 'אישור סיום'}
          </button>
        </div>
      </div>
    </>
  )
}
