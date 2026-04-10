import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [isExpired, setIsExpired] = useState(false)
  const [resendEmail, setResendEmail] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendDone, setResendDone] = useState(false)
  const [resendError, setResendError] = useState('')
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true
    const token = searchParams.get('token')
    if (!token) { setErrorMessage('קישור לא תקין.'); setStatus('error'); return }
    authApi.verifyEmail(token)
      .then((res) => {
        setAuth(res.token, { userId: res.userId, name: res.name, isEmailVerified: res.isEmailVerified })
        setStatus('success')
        setTimeout(() => navigate('/home'), 1500)
      })
      .catch((err) => {
        const msg = err.response?.data?.error ?? 'אימות נכשל.'
        setErrorMessage(msg)
        setIsExpired(msg.includes('פג תוקף'))
        setStatus('error')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async () => {
    if (!resendEmail.trim()) { setResendError('הזן כתובת אימייל.'); return }
    try {
      setResendLoading(true); setResendError('')
      await authApi.resendVerification(resendEmail.trim())
      setResendDone(true)
    } catch (err: any) {
      setResendError(err.response?.data?.error ?? 'שליחה נכשלה.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh items-center justify-center px-6 text-center">
      {status === 'loading' && (
        <>
          <div className="text-5xl mb-4 animate-pulse">🔮</div>
          <h1 className="text-xl font-bold text-tx1 mb-2">מאמת את האימייל…</h1>
          <p className="text-tx3 text-sm font-light">אנא המתן</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-5xl mb-4 animate-fade-up">✅</div>
          <h1 className="text-xl font-bold text-tx1 mb-2 animate-fade-up stagger-1">האימייל אומת בהצלחה!</h1>
          <p className="text-tx2 text-sm animate-fade-up stagger-2 font-light">מועבר לאפליקציה…</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-5xl mb-4 animate-fade-up">{isExpired ? '⏰' : '❌'}</div>
          <h1 className="text-xl font-bold text-tx1 mb-2 animate-fade-up stagger-1">
            {isExpired ? 'הקישור פג תוקף' : 'אימות נכשל'}
          </h1>
          <p className="text-tx2 text-sm mb-6 animate-fade-up stagger-2 font-light">{errorMessage}</p>

          {isExpired && !resendDone && (
            <div className="w-full max-w-xs text-right mb-4 animate-fade-up stagger-3">
              <p className="text-sm text-tx2 mb-3 font-light">שלח קישור חדש — הזן את כתובת האימייל שלך:</p>
              <input value={resendEmail} onChange={(e) => setResendEmail(e.target.value)}
                type="email" dir="ltr" autoCapitalize="none" placeholder="alex@example.com" className="input-dark mb-2" />
              {resendError && <p className="text-xs mb-2" style={{ color: 'var(--error-color)' }}>{resendError}</p>}
              <button onClick={handleResend} disabled={resendLoading} className="btn-primary w-full py-3 text-sm">
                {resendLoading ? 'שולח…' : 'שלח קישור חדש'}
              </button>
            </div>
          )}

          {resendDone && (
            <p className="text-sm mb-4 animate-fade-up" style={{ color: 'var(--chip-resolved-color)' }}>
              ✅ בדוק את תיבת הדואר שלך לקישור חדש.
            </p>
          )}

          <button onClick={() => navigate('/login')} className="text-sm font-semibold underline" style={{ color: 'var(--primary)' }}>
            חזרה לכניסה
          </button>
        </>
      )}
    </div>
  )
}
