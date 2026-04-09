import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  name: z.string().min(1, 'שם נדרש').max(100),
  username: z.string().min(2, 'לפחות 2 תווים').max(50).regex(/^\S+$/, 'ללא רווחים'),
  password: z.string().min(6, 'לפחות 6 תווים'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'הסיסמאות אינן תואמות',
  path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await authApi.register({ username: data.username, password: data.password, name: data.name })
      setAuth(res.token, { userId: res.userId, username: res.username, name: res.name })
      navigate('/home')
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'משהו השתבש. אנא נסה שוב.')
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="bg-[#7C3AED] pt-14 pb-10 px-6 rounded-b-[40px] flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg">
          🔮
        </div>
        <div className="text-white text-2xl font-bold tracking-tight">Fortune Teller</div>
        <div className="text-purple-200 text-sm mt-1">התחל את המסע שלך היום.</div>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pt-7 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">יצירת חשבון</h2>
        <p className="text-gray-400 text-sm mb-6">זה לוקח רק דקה</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">שמך</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                {...register('name')}
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="אלכס"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

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
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="alex_42"
              />
            </div>
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">סיסמה</label>
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
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">אימות סיסמה</label>
            <div className="relative">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                {...register('confirmPassword')}
                type="password"
                dir="ltr"
                className="w-full bg-white border border-gray-200 rounded-2xl pr-10 pl-4 py-3.5 text-gray-800 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition mt-2"
          >
            {isSubmitting ? 'יוצר חשבון…' : 'יצירת חשבון'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-7">
          כבר יש לך חשבון?{' '}
          <Link to="/login" className="text-[#7C3AED] font-semibold">
            כניסה
          </Link>
        </p>
      </div>
    </div>
  )
}
