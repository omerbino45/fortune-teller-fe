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
        <div className="text-5xl mb-4">📬</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">בדוק את האימייל שלך</h1>
        <p className="text-gray-500 text-sm mb-6">
          אם הכתובת קיימת במערכת, שלחנו הוראות לאיפוס הסיסמה.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#7C3AED] text-white font-semibold rounded-2xl px-8 py-3 text-sm"
        >
          חזרה לכניסה
        </button>
      </div>
    )
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="bg-[#7C3AED] pt-6 pb-6 px-5 rounded-b-[32px]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{transform:'scaleX(-1)'}}>
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold">שכחתי סיסמה</h1>
        </div>
      </div>

      <div className="flex-1 px-6 pt-8">
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          הזן את כתובת האימייל שלך ונשלח לך קישור לאיפוס הסיסמה.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">אימייל</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-base outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="alex@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition mt-2"
          >
            {isSubmitting ? 'שולח…' : 'שלח קישור לאיפוס'}
          </button>
        </form>
      </div>
    </div>
  )
}
