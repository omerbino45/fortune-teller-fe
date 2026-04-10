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
      <div
        className="fixed inset-0 z-20"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onDismiss}
      />
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] rounded-t-[28px] z-30 px-6 pt-4 pb-10 shadow-2xl"
        style={{
          background: 'var(--sheet-bg)',
          border: '1px solid var(--bord)',
          borderBottom: 'none',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          transition: 'background 0.25s ease',
        }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--bord)' }} />

        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'rgba(16,185,129,0.15)' }}>✅</div>
          <h2 className="text-xl font-bold text-tx1">סיום דאגה</h2>
        </div>
        <p className="text-tx2 text-sm mb-6 mr-12 font-light">תעד מה שקרה בפועל</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-4"
            style={{ background: 'var(--error-bg)', border: '1px solid var(--error-bord)', color: 'var(--error-color)' }}>
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-tx1 mb-1.5 block">תוצאה בפועל *</label>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              rows={3}
              className="input-dark !rounded-2xl resize-none"
              placeholder="מה שקרה באמת…"
            />
          </div>

          <SliderField label="כמה אתה חרד עכשיו?" value={postLevel} onChange={setPostLevel} />

          <button
            onClick={handleConfirm}
            disabled={saving}
            className="w-full text-white font-semibold rounded-2xl py-4 text-sm transition disabled:opacity-60"
            style={{ background: '#16a34a', boxShadow: '0 0 16px rgba(22,163,74,0.35)' }}
          >
            {saving ? 'שומר…' : 'אישור סיום'}
          </button>
        </div>
      </div>
    </>
  )
}
