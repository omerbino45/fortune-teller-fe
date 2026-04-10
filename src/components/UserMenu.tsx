import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuthStore()
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
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-[#C084FC]"
        style={{ background: 'rgba(155,111,214,0.25)', border: '1px solid rgba(155,111,214,0.4)' }}
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-12 z-20 rounded-2xl shadow-2xl py-2 w-48"
            style={{
              background: 'rgba(20, 12, 45, 0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            <div className="px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-sm font-semibold text-[#EDE9FE]">{user?.name}</p>
              <p className="text-xs text-[#5B4F7A]">@{user?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-right px-4 py-3 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              התנתקות
            </button>
          </div>
        </>
      )}
    </div>
  )
}
