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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" onClick={onDismiss} />

      {/* Sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white rounded-t-[28px] z-30 px-6 pt-4 pb-10 shadow-2xl">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-lg">✅</div>
          <h2 className="text-xl font-bold text-gray-800">סיום דאגה</h2>
        </div>
        <p className="text-gray-500 text-sm mb-6 mr-12">תעד מה שקרה בפועל</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">תוצאה בפועל *</label>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-base text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition resize-none"
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
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition"
          >
            {saving ? 'שומר…' : 'אישור סיום'}
          </button>
        </div>
      </div>
    </>
  )
}
