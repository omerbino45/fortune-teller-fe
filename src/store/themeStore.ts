import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const next = !get().isDark
        document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light')
        set({ isDark: next })
      },
    }),
    { name: 'ft-theme' }
  )
)

// Apply persisted theme before first render (no flash)
;(() => {
  try {
    const raw = localStorage.getItem('ft-theme')
    const isDark = raw ? JSON.parse(raw)?.state?.isDark : false
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  } catch {
    document.documentElement.setAttribute('data-theme', 'light')
  }
})()
