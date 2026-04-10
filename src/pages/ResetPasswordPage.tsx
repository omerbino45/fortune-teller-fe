import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  newPassword: z.string().min(6, 'לפחות 6 תווים'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState('')
  const token = searchParams.get('token') ?? ''

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      if (!token) { setError('קישור לא תקין.'); return }
      const res = await authApi.resetPassword(token, data.newPassword)
      setAuth(res.token, {
        userId: res.userId,
        username: res.username,
        name: res.name,
        isEmailVerified: res.isEmailVerified,
      })
      navigate('/home')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'איפוס נכשל. אנא נסה שוב.')
    }
  }

  if (!token) {
    return (
      <div className="app-shell flex flex-col min-h-dvh items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="text-xl font-bold text-[#EDE9FE] mb-2">קישור לא תקין</h1>
        <button onClick={() => navigate('/login')} className="btn-primary px-8 py-3 text-sm mt-4">
          חזרה לכניסה
        </button>
      </div>
    )
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div
        className="pt-6 pb-6 px-5 rounded-b-[32px]"
        style={{ background: 'linear-gradient(160deg, #1E0A4F 0%, #0D0520 100%)' }}
      >
        <h1 className="text-white text-xl font-bold text-center">הגדרת סיסמה חדשה</h1>
      </div>

      <div className="flex-1 px-6 pt-8">
        <p className="text-[#9B8EC4] text-sm mb-6 leading-relaxed">הזן סיסמה חדשה לחשבון שלך.</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-5"
            style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">סיסמה חדשה</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input {...register('newPassword')} type="password" dir="ltr" className="input-dark !pr-10" placeholder="••••••••" />
            </div>
            {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">אימות סיסמה</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input {...register('confirmPassword')} type="password" dir="ltr" className="input-dark !pr-10" placeholder="••••••••" />
            </div>
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-sm mt-2">
            {isSubmitting ? 'שומר…' : 'שמור סיסמה חדשה'}
          </button>
        </form>
      </div>
    </div>
  )
}
