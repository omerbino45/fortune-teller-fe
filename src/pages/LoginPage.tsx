import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../api'
import { useAuthStore } from '../store/authStore'

const schema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      setError('')
      const res = await authApi.login(data)
      setAuth(res.token, { userId: res.userId, username: res.username, name: res.name })
      navigate('/home')
    } catch {
      setError('Invalid username or password.')
    }
  }

  return (
    <div className="app-shell flex flex-col min-h-dvh">
      {/* Header */}
      <div className="bg-[#7C3AED] pt-16 pb-12 px-6 rounded-b-[32px]">
        <div className="text-white text-3xl font-bold tracking-tight">Fortune Teller</div>
        <div className="text-purple-200 text-sm mt-1">Know your future. Face your fears.</div>
      </div>

      {/* Form card */}
      <div className="flex-1 px-6 pt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
        <p className="text-gray-500 text-sm mb-8">Sign in to your account</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Username</label>
            <input
              {...register('username')}
              autoCapitalize="none"
              autoCorrect="off"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
              placeholder="your_username"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-60 text-white font-semibold rounded-2xl py-4 text-sm transition mt-2"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#7C3AED] font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
