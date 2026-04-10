import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'

const schema = z.object({
  name: z.string().min(1, 'שם נדרש').max(100),
  email: z.string().min(1, 'אימייל נדרש').email('כתובת אימייל לא תקינה'),
  password: z.string().min(6, 'לפחות 6 תווים'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

const iconUser = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const iconLock = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)
const iconMail = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

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
      const res = await authApi.register({ password: data.password, name: data.name, email: data.email })
      setPendingEmail(res.email)
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'משהו השתבש. אנא נסה שוב.')
    }
  }

  if (pendingEmail) {
    return (
      <div className="app-shell flex flex-col min-h-dvh">
        <div className="pt-6 pb-10 px-6 rounded-b-[40px] flex flex-col items-center text-center"
          style={{ background: 'var(--header-auth-grad)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
            style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>📬</div>
          <div className="text-white text-2xl font-bold">בדוק את האימייל שלך</div>
          <div className="text-white/60 text-sm mt-1 font-light">שלחנו קישור אימות לכתובת שלך</div>
        </div>
        <div className="flex-1 px-6 pt-8 text-center">
          <div className="glass-card rounded-2xl px-5 py-5 mb-6">
            <p className="text-tx2 text-sm font-light">שלחנו אימייל לאישור ל:</p>
            <p className="text-tx1 font-semibold mt-1 text-base" dir="ltr">{pendingEmail}</p>
          </div>
          <p className="text-tx2 text-sm leading-relaxed font-light">
            לחץ על הקישור באימייל כדי לאמת את החשבון ולהיכנס לאפליקציה.
          </p>
          <p className="text-tx3 text-xs mt-3 font-light">לא קיבלת? בדוק את תיקיית הספאם.</p>
          <p className="text-center text-sm text-tx3 mt-10 font-light">
            כבר יש לך חשבון?{' '}
            <button onClick={() => navigate('/login')} className="font-semibold" style={{ color: 'var(--primary)' }}>כניסה</button>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      <div className="pt-6 pb-10 px-6 rounded-b-[40px] flex flex-col items-center text-center"
        style={{ background: 'var(--header-auth-grad)' }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg"
          style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}>🔮</div>
        <div className="text-white text-2xl font-bold">Fortune Teller</div>
        <div className="text-white/60 text-sm mt-1 font-light">התחל את המסע שלך היום.</div>
      </div>

      <div className="flex-1 px-6 pt-7 pb-8">
        <h2 className="text-2xl font-bold text-tx1 mb-1">יצירת חשבון</h2>
        <p className="text-tx3 text-sm mb-6 font-light">זה לוקח רק דקה</p>

        {error && (
          <div className="text-sm rounded-xl px-4 py-3 mb-5"
            style={{ background: 'var(--error-bg)', border: '1px solid var(--error-bord)', color: 'var(--error-color)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { label: 'שמך', name: 'name' as const, icon: iconUser, placeholder: 'אלכס' },
            { label: 'אימייל', name: 'email' as const, icon: iconMail, placeholder: 'alex@example.com', type: 'email', dir: 'ltr' as const },
            { label: 'סיסמה', name: 'password' as const, icon: iconLock, placeholder: '••••••••', type: 'password', dir: 'ltr' as const },
            { label: 'אימות סיסמה', name: 'confirmPassword' as const, icon: iconLock, placeholder: '••••••••', type: 'password', dir: 'ltr' as const },
          ].map(({ label, name, icon, placeholder, type, dir }) => (
            <div key={name}>
              <label className="text-sm font-semibold text-tx2 mb-1.5 block">{label}</label>
              <div className="relative">
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-tx3">{icon}</span>
                <input {...register(name)} type={type} dir={dir} autoCapitalize="none" autoCorrect={type ? 'off' : undefined}
                  className="input-dark !pr-10" placeholder={placeholder} />
              </div>
              {errors[name] && <p className="text-xs mt-1" style={{ color: 'var(--error-color)' }}>{errors[name]?.message}</p>}
            </div>
          ))}

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-4 text-sm mt-2">
            {isSubmitting ? 'יוצר חשבון…' : 'יצירת חשבון'}
          </button>
        </form>

        <p className="text-center text-sm text-tx3 mt-7 font-light">
          כבר יש לך חשבון?{' '}
          <Link to="/login" className="font-semibold" style={{ color: 'var(--primary)' }}>כניסה</Link>
        </p>
      </div>
    </div>
  )
}
