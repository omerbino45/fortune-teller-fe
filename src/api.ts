import axios from 'axios'
import type { AuthResponse, Worry } from './types'

const api = axios.create({
  baseURL: 'http://localhost:5212/api',
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
  register: (data: { username: string; password: string; name: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { username: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
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
  }>) => api.patch<Worry>(`/worries/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/worries/${id}`),
}
