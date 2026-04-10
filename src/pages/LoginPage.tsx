import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  email: z.string().min(1, 'אימייל נדרש').email('כתובת אימייל לא תקינה'),
  password: z.string().min(1, 'סיסמה נדרשת'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState('')
  const [emailNotVerified, setEmailNotVerified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError(''); setEmailNotVerified(false)
      const res = await authApi.login(data)
      setAuth(res.token, { userId: res.userId, name: res.name, isEmailVerified: res.isEmailVerified })
      navigate('/home')
    } catch (err: any) {
      if (err.response?.status === 403 && err.response?.data?.code === 'EMAIL_NOT_VERIFIED') {
        setEmailNotVerified(true)
        setError('עליך לאמת את כתובת האימייל שלך לפני הכניסה.')
      } else {
        setEmailNotVerified(false)
        setError(err.response?.data?.error ?? 'שם משתמש או סיסמה שגויים.')
      }
    }
  }

  const handleResendVerification = async () => {
    try {
      setResendLoading(true)
      await authApi.resendVerification(getValues('email'))
      setResendSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'שליחה נכשלה. נסה שוב.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div
        className="pt-6 pb-14 px-6 rounded-b-[40px] flex flex-col items-center text-center"
        style={{ background: 'var(--header-auth-grad)' }}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>
          🔮
        </div>
        <div className="text-white text-2xl font-bold">Fortune Teller</div>
        <div className="text-white/60 text-sm mt-1 font-light">הכר את עתידך. התמודד עם הפחדים שלך.</div>
      </div>

      <div className="flex-1 px-6 pt-8">
        <h2 className="text-2xl font-bold text-tx1 mb-1">ברוך שובך</h2>
        <p className="text-tx3 text-sm mb-7 font-light">היכנס לחשבון שלך</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-5"
            style={emailNotVerified
              ? { background: 'var(--amber-bg)', border: '1px solid var(--amber-bord)', color: 'var(--amber-color)' }
              : { background: 'var(--error-bg)', border: '1px solid var(--error-bord)', color: 'var(--error-color)' }
            }
          >
            <p>{error}</p>
            {emailNotVerified && !resendSuccess && (
              <button onClick={handleResendVerification} disabled={resendLoading}
                className="mt-2 font-semibold text-xs underline" style={{ color: 'var(--amber-color)' }}>
                {resendLoading ? 'שולח…' : 'שלח אימייל אימות מחדש'}
              </button>
            )}
            {resendSuccess && <p className="mt-2 text-xs">בדוק את תיבת הדואר שלך לקישור חדש.</p>}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-tx2 mb-1.5 block">אימייל</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-tx3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input {...register('email')} type="email" autoCapitalize="none" autoCorrect="off" dir="ltr" className="input-dark !pr-10" placeholder="alex@example.com" />
            </div>
            {errors.email && <p className="text-xs mt-1" style={{ color: 'var(--error-color)' }}>{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-tx2">סיסמה</label>
              <Link to="/forgot-password" className="text-xs font-medium" style={{ color: 'var(--primary)' }}>שכחת סיסמה?</Link>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-tx3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input {...register('password')} type="password" dir="ltr" className="input-dark !pr-10" placeholder="••••••••" />
            </div>
            {errors.password && <p className="text-xs mt-1" style={{ color: 'var(--error-color)' }}>{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-sm mt-2">
            {isSubmitting ? 'מתחבר…' : 'כניסה'}
          </button>
        </form>

        <p className="text-center text-sm text-tx3 mt-8 font-light">
          אין לך חשבון?{' '}
          <Link to="/register" className="font-semibold" style={{ color: 'var(--primary)' }}>הרשמה</Link>
        </p>
      </div>
    </div>
  )
}
