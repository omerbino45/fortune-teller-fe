import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const { isDark, toggle } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm text-white"
        style={{ background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.35)' }}
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-12 z-20 rounded-2xl shadow-2xl py-2 w-52"
            style={{
              background: 'var(--dropdown-bg)',
              border: '1px solid var(--dropdown-bord)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* User info */}
            <div className="px-4 py-2.5" style={{ borderBottom: '1px solid var(--divider)' }}>
              <p className="text-sm font-semibold text-tx1">{user?.name}</p>
              <p className="text-xs text-tx3">@{user?.username}</p>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="w-full text-right px-4 py-3 text-sm text-tx2 flex items-center justify-between transition hover:bg-[var(--in-bg)]"
            >
              <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              <span>{isDark ? 'מצב יום' : 'מצב לילה'}</span>
            </button>

            <div style={{ borderTop: '1px solid var(--divider)' }} />

            <button
              onClick={handleLogout}
              className="w-full text-right px-4 py-3 text-sm transition"
              style={{ color: 'var(--error-color)' }}
            >
              התנתקות
            </button>
          </div>
        </>
      )}
    </div>
  )
}
