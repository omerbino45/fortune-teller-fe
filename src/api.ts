import axios from 'axios'
import type { AuthResponse, RegisterResponse, Worry } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5212/api',
})

// Inject JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ft_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ft_token')
      localStorage.removeItem('ft_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  register: (data: { password: string; name: string; email: string }) =>
    api.post<RegisterResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  verifyEmail: (token: string) =>
    api.get<AuthResponse>(`/auth/verify-email?token=${encodeURIComponent(token)}`).then((r) => r.data),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, newPassword: string) =>
    api.post<AuthResponse>('/auth/reset-password', { token, newPassword }).then((r) => r.data),

  resendVerification: (email: string) =>
    api.post<{ message: string }>('/auth/resend-verification', { email }).then((r) => r.data),
}

// Worries
export const worriesApi = {
  getAll: () =>
    api.get<Worry[]>('/worries').then((r) => r.data),

  getById: (id: string) =>
    api.get<Worry>(`/worries/${id}`).then((r) => r.data),

  create: (data: {
    title: string
    prophecy: string
    preAnxietyLevel: number
    assurance: number
    description?: string
    factors?: string[]
  }) => api.post<Worry>('/worries', data).then((r) => r.data),

  patch: (id: string, data: Partial<{
    title: string
    description: string | null
    factors: string[]
    assurance: number
    actualOutcome: string
    postAnxietyLevel: number
    isArchived: boolean
  }>) => api.patch<Worry>(`/worries/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/worries/${id}`),
}
