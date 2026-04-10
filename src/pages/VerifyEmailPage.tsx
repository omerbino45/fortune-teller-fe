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
  const [resendUsername, setResendUsername] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [resendDone, setResendDone] = useState(false)
  const [resendError, setResendError] = useState('')
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
          <h1 className="text-xl font-bold text-[#EDE9FE] mb-2">מאמת את האימייל…</h1>
          <p className="text-[#5B4F7A] text-sm">אנא המתן</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-5xl mb-4 animate-fade-up">✅</div>
          <h1 className="text-xl font-bold text-[#EDE9FE] mb-2 animate-fade-up stagger-1">האימייל אומת בהצלחה!</h1>
          <p className="text-[#9B8EC4] text-sm animate-fade-up stagger-2">מועבר לאפליקציה…</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-5xl mb-4 animate-fade-up">{isExpired ? '⏰' : '❌'}</div>
          <h1 className="text-xl font-bold text-[#EDE9FE] mb-2 animate-fade-up stagger-1">
            {isExpired ? 'הקישור פג תוקף' : 'אימות נכשל'}
          </h1>
          <p className="text-[#9B8EC4] text-sm mb-6 animate-fade-up stagger-2">{errorMessage}</p>

          {isExpired && !resendDone && (
            <div className="w-full max-w-xs text-right mb-4 animate-fade-up stagger-3">
              <p className="text-sm text-[#9B8EC4] mb-3">שלח קישור חדש — הזן את שם המשתמש שלך:</p>
              <input
                value={resendUsername}
                onChange={(e) => setResendUsername(e.target.value)}
                dir="ltr"
                autoCapitalize="none"
                placeholder="username"
                className="input-dark mb-2"
              />
              {resendError && <p className="text-red-400 text-xs mb-2">{resendError}</p>}
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="btn-primary w-full py-3 text-sm"
              >
                {resendLoading ? 'שולח…' : 'שלח קישור חדש'}
              </button>
            </div>
          )}

          {resendDone && (
            <p className="text-[#6EE7B7] text-sm mb-4 animate-fade-up">✅ בדוק את תיבת הדואר שלך לקישור חדש.</p>
          )}

          <button
            onClick={() => navigate('/login')}
            className="text-[#9B6FD6] font-semibold text-sm underline animate-fade-up"
          >
            חזרה לכניסה
          </button>
        </>
      )}
    </div>
  )
}
