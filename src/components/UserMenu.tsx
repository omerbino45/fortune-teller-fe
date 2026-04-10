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
            className="absolute left-0 top-12 z-20 rounded-2xl shadow-2xl py-2 w-56"
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
            </div>

            {/* Theme toggle — pill */}
            <button
              onClick={toggle}
              className="w-full flex items-center gap-3 px-4 py-3 transition"
              style={{ direction: 'ltr' }}
            >
              {/* Pill */}
              <div
                className="relative shrink-0 rounded-full"
                style={{
                  width: 52,
                  height: 28,
                  background: isDark ? '#1E0A4F' : 'var(--primary)',
                  transition: 'background 0.3s',
                  border: isDark ? '1px solid rgba(155,111,214,0.4)' : '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {/* Thumb */}
                <div
                  className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm flex items-center justify-center text-[13px]"
                  style={{
                    left: isDark ? 3 : 27,
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {isDark ? '🌙' : '☀️'}
                </div>
              </div>
              {/* Label */}
              <span className="text-sm font-medium text-tx1" style={{ direction: 'rtl' }}>
                {isDark ? 'מצב לילה' : 'מצב יום'}
              </span>
            </button>

            <div style={{ borderTop: '1px solid var(--divider)' }} />

            <button
              onClick={handleLogout}
              className="w-full text-right px-4 py-3 text-sm transition hover:bg-[var(--in-bg)]"
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
