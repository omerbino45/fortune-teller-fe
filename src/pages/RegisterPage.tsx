import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'

const schema = z.object({
  name: z.string().min(1, 'שם נדרש').max(100),
  username: z.string().min(2, 'לפחות 2 תווים').max(50).regex(/^\S+$/, 'ללא רווחים'),
  email: z.string().min(1, 'אימייל נדרש').email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'לפחות 6 תווים'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await authApi.register({
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email,
      })
      setPendingEmail(res.email)
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'משהו השתבש. אנא נסה שוב.')
    }
  }

  if (pendingEmail) {
    return (
      <div className="app-shell flex flex-col min-h-dvh">
        <div
          className="pt-6 pb-10 px-6 rounded-b-[40px] flex flex-col items-center text-center"
          style={{ background: 'linear-gradient(160deg, #2A0F6E 0%, #0D0520 100%)' }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            📬
          </div>
          <div className="text-white text-2xl font-bold tracking-tight">בדוק את האימייל שלך</div>
          <div className="text-[#9B8EC4] text-sm mt-1">שלחנו קישור אימות לכתובת שלך</div>
        </div>

        <div className="flex-1 px-6 pt-8 text-center">
          <div className="glass-card rounded-2xl px-5 py-5 mb-6">
            <p className="text-[#9B8EC4] text-sm leading-relaxed">שלחנו אימייל לאישור ל:</p>
            <p className="text-[#EDE9FE] font-semibold mt-1 text-base" dir="ltr">{pendingEmail}</p>
          </div>

          <p className="text-[#9B8EC4] text-sm leading-relaxed">
            לחץ על הקישור באימייל כדי לאמת את החשבון ולהיכנס לאפליקציה.
          </p>
          <p className="text-[#5B4F7A] text-xs mt-3">לא קיבלת? בדוק את תיקיית הספאם.</p>

          <p className="text-center text-sm text-[#5B4F7A] mt-10">
            כבר יש לך חשבון?{' '}
            <button onClick={() => navigate('/login')} className="text-[#9B6FD6] font-semibold">
              כניסה
            </button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div
        className="pt-6 pb-10 px-6 rounded-b-[40px] flex flex-col items-center text-center"
        style={{ background: 'linear-gradient(160deg, #2A0F6E 0%, #0D0520 100%)' }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
        >
          🔮
        </div>
        <div className="text-white text-2xl font-bold tracking-tight">Fortune Teller</div>
        <div className="text-[#9B8EC4] text-sm mt-1">התחל את המסע שלך היום.</div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-7 pb-8">
        <h2 className="text-2xl font-bold text-[#EDE9FE] mb-1">יצירת חשבון</h2>
        <p className="text-[#5B4F7A] text-sm mb-6">זה לוקח רק דקה</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-5"
            style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', color: '#FCA5A5' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">שמך</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input {...register('name')} className="input-dark !pr-10" placeholder="אלכס" />
            </div>
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">שם משתמש</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input {...register('username')} autoCapitalize="none" autoCorrect="off" dir="ltr" className="input-dark !pr-10" placeholder="alex_42" />
            </div>
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">אימייל</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input {...register('email')} type="email" autoCapitalize="none" autoCorrect="off" dir="ltr" className="input-dark !pr-10" placeholder="alex@example.com" />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">סיסמה</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input {...register('password')} type="password" dir="ltr" className="input-dark !pr-10" placeholder="••••••••" />
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm password */}
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
            {isSubmitting ? 'יוצר חשבון…' : 'יצירת חשבון'}
          </button>
        </form>

        <p className="text-center text-sm text-[#5B4F7A] mt-7">
          כבר יש לך חשבון?{' '}
          <Link to="/login" className="text-[#9B6FD6] font-semibold">כניסה</Link>
        </p>
      </div>
    </div>
  )
}
