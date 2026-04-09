import { useNavigate } from 'react-router-dom'

type Tab = 'home' | 'statistics'

export default function BottomNav({ active }: { active: Tab }) {
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 flex z-10 pb-safe">
      <NavItem
        label="בית"
        active={active === 'home'}
        onClick={() => navigate('/home')}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill={active === 'home' ? '#7C3AED' : 'none'} stroke={active === 'home' ? '#7C3AED' : '#9CA3AF'} strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        }
      />
      <NavItem
        label="סטטיסטיקה"
        active={active === 'statistics'}
        onClick={() => navigate('/statistics')}
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active === 'statistics' ? '#7C3AED' : '#9CA3AF'} strokeWidth="2">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        }
      />
    </nav>
  )
}

function NavItem({ label, active, onClick, icon }: { label: string; active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex flex-col items-center gap-1 py-3 transition"
    >
      <div className="relative flex flex-col items-center">
        {active && (
          <span className="absolute -top-2 w-1 h-1 rounded-full bg-[#7C3AED]" />
        )}
        {icon}
      </div>
      <span className={`text-xs font-medium ${active ? 'text-[#7C3AED]' : 'text-gray-400'}`}>{label}</span>
    </button>
  )
}
