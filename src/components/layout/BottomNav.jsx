import { NavLink } from 'react-router-dom'
import { Home, ArrowLeftRight, PieChart, Bot, User } from 'lucide-react'

const NAV = [
  { path: '/',             label: 'Beranda',   icon: Home },
  { path: '/transactions', label: 'Transaksi', icon: ArrowLeftRight },
  { path: '/budget',       label: 'Anggaran',  icon: PieChart },
  { path: '/ai/assistant', label: 'AI',        icon: Bot },
  { path: '/profile',      label: 'Profil',    icon: User },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex z-40 safe-area-inset-bottom">
      {NAV.map(({ path, label, icon: Icon }) => (
        <NavLink key={path} to={path} end={path === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[56px]
            ${isActive ? 'text-[#22c55e]' : 'text-gray-400'}`
          }>
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-[#22c55e]/10' : ''}`}>
                <Icon size={20} />
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}