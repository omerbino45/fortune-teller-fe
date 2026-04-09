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
  // Resend state (shown when token is expired)
  const [resendUsername, setResendUsername] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendDone, setResendDone] = useState(false)
  const [resendError, setResendError] = useState('')
  // Guard against React StrictMode double-firing the effect in development
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const token = searchParams.get('token')
    if (!token) {
      setErrorMessage('קישור לא תקין.')
      setStatus('error')
      return
    }

    authApi.verifyEmail(token)
      .then((res) => {
        setAuth(res.token, {
          userId: res.userId,
          username: res.username,
          name: res.name,
          isEmailVerified: res.isEmailVerified,
        })
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
    if (!resendUsername.trim()) { setResendError('הזן שם משתמש.'); return }
    try {
      setResendLoading(true)
      setResendError('')
      await authApi.resendVerification(resendUsername.trim())
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
          <h1 className="text-xl font-bold text-gray-800 mb-2">מאמת את האימייל…</h1>
          <p className="text-gray-400 text-sm">אנא המתן</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">האימייל אומת בהצלחה!</h1>
          <p className="text-gray-500 text-sm">מועבר לאפליקציה…</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-5xl mb-4">{isExpired ? '⏰' : '❌'}</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            {isExpired ? 'הקישור פג תוקף' : 'אימות נכשל'}
          </h1>
          <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>

          {isExpired && !resendDone && (
            <div className="w-full max-w-xs text-right mb-4">
              <p className="text-sm text-gray-600 mb-3">שלח קישור חדש — הזן את שם המשתמש שלך:</p>
              <input
                value={resendUsername}
                onChange={(e) => setResendUsername(e.target.value)}
                dir="ltr"
                autoCapitalize="none"
                placeholder="username"
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 text-base outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 mb-2"
              />
              {resendError && <p className="text-red-500 text-xs mb-2">{resendError}</p>}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full bg-[#7C3AED] disabled:opacity-60 text-white font-semibold rounded-2xl py-3 text-sm"
              >
                {resendLoading ? 'שולח…' : 'שלח קישור חדש'}
              </button>
            </div>
          )}

          {resendDone && (
            <p className="text-green-600 text-sm mb-4">✅ בדוק את תיבת הדואר שלך לקישור חדש.</p>
          )}

          <button
            onClick={() => navigate('/login')}
            className="text-[#7C3AED] font-semibold text-sm underline"
          >
            חזרה לכניסה
          </button>
        </>
      )}
    </div>
  )
}
