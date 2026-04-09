import { create } from 'zustand'

interface AuthUser {
  userId: string
  username: string
  name: string
  isEmailVerified: boolean
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
}

const storedUser = localStorage.getItem('ft_user')
const storedToken = localStorage.getItem('ft_token')

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken,

  setAuth: (token, user) => {
    localStorage.setItem('ft_token', token)
    localStorage.setItem('ft_user', JSON.stringify(user))
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('ft_token')
    localStorage.removeItem('ft_user')
    set({ token: null, user: null })
  },
}))
