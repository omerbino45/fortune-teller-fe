import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
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
        // Auto-redirect after 2s
        setTimeout(() => navigate('/home'), 2000)
      })
      .catch((err) => {
        setErrorMessage(err.response?.data?.error ?? 'אימות נכשל.')
        setStatus('error')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">אימות נכשל</h1>
          <p className="text-gray-500 text-sm mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#7C3AED] text-white font-semibold rounded-2xl px-8 py-3 text-sm"
          >
            חזרה לכניסה
          </button>
        </>
      )}
    </div>
  )
}
