import { useState } from 'react'
import { motion } from 'framer-motion'
import { worriesApi } from '../api'

interface Props {
  worryId: string
  onDeleted: () => void
  onDismiss: () => void
}

export default function DeleteConfirmSheet({ worryId, onDeleted, onDismiss }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    try {
      setDeleting(true)
      setError('')
      await worriesApi.delete(worryId)
      onDeleted()
    } catch {
      setError('מחיקה נכשלה. אנא נסה שוב.')
      setDeleting(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-20"
        style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onDismiss}
      />
      <motion.div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] rounded-t-[28px] z-30 px-6 pt-4 pb-10 shadow-2xl"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          background: 'var(--sheet-bg)',
          border: '1px solid var(--bord)',
          borderBottom: 'none',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'var(--bord)' }} />

        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
            style={{ background: 'rgba(220,38,38,0.12)' }}>🗑️</div>
          <h2 className="text-xl font-bold text-tx1">מחיקת דאגה</h2>
        </div>
        <p className="text-tx2 text-sm mb-6 mr-12 font-light">פעולה זו היא בלתי הפיכה</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-4"
            style={{ background: 'var(--error-bg)', border: '1px solid var(--error-bord)', color: 'var(--error-color)' }}>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full text-white font-semibold rounded-2xl py-4 text-sm transition disabled:opacity-60"
            style={{ background: '#DC2626', boxShadow: '0 0 16px rgba(220,38,38,0.3)' }}
          >
            {deleting ? 'מוחק…' : 'מחק דאגה'}
          </button>
          <button
            onClick={onDismiss}
            disabled={deleting}
            className="w-full font-semibold rounded-2xl py-4 text-sm transition"
            style={{ background: 'var(--in-bg)', color: 'var(--tx-2)' }}
          >
            ביטול
          </button>
        </div>
      </motion.div>
    </>
  )
}
