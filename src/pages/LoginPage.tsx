import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  username: z.string().min(1, 'שם משתמש נדרש'),
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
      setError('')
      setEmailNotVerified(false)
      const res = await authApi.login(data)
      setAuth(res.token, {
        userId: res.userId,
        username: res.username,
        name: res.name,
        isEmailVerified: res.isEmailVerified,
      })
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
      await authApi.resendVerification(getValues('username'))
      setResendSuccess(true)
    } catch (err: any) {
      // Rate-limit hit — show the BE message
      setError(err.response?.data?.error ?? 'שליחה נכשלה. נסה שוב.')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="bg-[#7C3AED] pt-6 pb-14 px-6 rounded-b-[40px] flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
          🔮
        </div>
        <div className="text-white text-2xl font-bold tracking-tight">Fortune Teller</div>
        <div className="text-purple-200 text-sm mt-1">הכר את עתידך. התמודד עם הפחדים שלך.</div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">ברוך שובך</h2>
        <p className="text-gray-400 text-sm mb-7">היכנס לחשבון שלך</p>

        {error && (
          <div className={`border text-sm rounded-xl px-4 py-3 mb-5 ${emailNotVerified ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
            <p>{error}</p>
            {emailNotVerified && !resendSuccess && (
              <button
                onClick={handleResendVerification}
                disabled={resendLoading}
                className="mt-2 text-[#7C3AED] font-semibold text-xs underline"
              >
                {resendLoading ? 'שולח…' : 'שלח אימייל אימות מחדש'}
              </button>
            )}
            {resendSuccess && (
              <p className="mt-2 text-xs text-amber-600">בדוק את תיבת הדואר שלך לקישור חדש.</p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">שם משתמש</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                {...register('username')}
                autoCapitalize="none"
                autoCorrect="off"
                dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-base outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="username"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-700">סיסמה</label>
              <Link to="/forgot-password" className="text-xs text-[#7C3AED] font-medium">
                שכחת סיסמה?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                {...register('password')}
                type="password"
                dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-base outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition mt-2"
          >
            {isSubmitting ? 'מתחבר…' : 'כניסה'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          אין לך חשבון?{' '}
          <Link to="/register" className="text-[#7C3AED] font-semibold">
            הרשמה
          </Link>
        </p>
      </div>
    </div>
  )
}
