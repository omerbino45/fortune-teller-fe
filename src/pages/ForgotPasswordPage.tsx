import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'

const schema = z.object({
  email: z.string().min(1, 'אימייל נדרש').email('כתובת אימייל לא תקינה'),
})
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    await authApi.forgotPassword(data.email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="app-shell flex flex-col min-h-dvh items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4 animate-fade-up">📬</div>
        <h1 className="text-xl font-bold text-[#EDE9FE] mb-2 animate-fade-up stagger-1">בדוק את האימייל שלך</h1>
        <p className="text-[#9B8EC4] text-sm mb-6 animate-fade-up stagger-2">
          אם הכתובת קיימת במערכת, שלחנו הוראות לאיפוס הסיסמה.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="btn-primary px-8 py-3 text-sm animate-fade-up stagger-3"
        >
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
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform:'scaleX(-1)'}}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold">שכחתי סיסמה</h1>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8">
        <p className="text-[#9B8EC4] text-sm mb-6 leading-relaxed">
          הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#9B8EC4] mb-1.5 block">אימייל</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#5B4F7A]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </span>
              <input
                {...register('email')}
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                dir="ltr"
                className="input-dark !pr-10"
                placeholder="alex@example.com"
              />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-4 text-sm mt-2"
          >
            {isSubmitting ? 'שולח…' : 'שלח קישור לאיפוס'}
          </button>
        </form>
      </div>
    </div>
  )
}
