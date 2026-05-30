// components/layout/Sidebar.jsx
import { NavLink, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard, Plus, ClockIcon, Zap,
  TrendingUp, Wallet, MessageSquare, Settings, LogOut, Bell
} from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useAuth'
import { useNotifications } from '../../context/NotificationContext'
import fingoLogo from '../../assets/images/fingo-logo.png'

const MENU_UTAMA = [
  { path: '/',             label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/transactions/add', label: 'Catat Transaksi', icon: Plus },
  { path: '/transactions', label: 'Riwayat',         icon: ClockIcon },
]

const ANALITIK = [
  { path: '/ai/impulse',   label: 'Implusive Detector', icon: Zap },
  { path: '/ai/predictor', label: 'Income Predictor',   icon: TrendingUp },
  { path: '/budget',       label: 'Budget Planner',     icon: Wallet },
  { path: '/ai/assistant', label: 'AI Assistant',       icon: MessageSquare },
  { path: '/settings',     label: 'Pengaturan',         icon: Settings },
]

export default function Sidebar() {
  const { user } = useAuthContext()
  const { mutate: logout } = useLogout()
  const { unreadCount } = useNotifications()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
    ${isActive
      ? 'bg-[#22c55e]/15 text-[#22c55e] font-semibold'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <aside className="w-56 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img src={fingoLogo} alt="Fingo" className="w-10 h-10 rounded-xl object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-black text-lg leading-none">
              <span className="text-gray-900">Fin</span>
              <span className="text-[#22c55e]">go</span>
            </div>
            <div className="text-[10px] text-gray-400 tracking-widest uppercase">Smart Finance App</div>
          </div>
          <Link
            to="/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors shrink-0"
            title="Notifikasi"
          >
            <Bell size={18} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[15px] h-[15px] bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center px-0.5 border-2 border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {/* Menu utama */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 mb-2">Menu Utama</p>
          <div className="space-y-0.5">
            {MENU_UTAMA.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} end className={linkClass}>
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Analitik */}
        <div>
          <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 mb-2">Analitik</p>
          <div className="space-y-0.5">
            {ANALITIK.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} to={path} className={linkClass}>
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-2 py-2 rounded-xl transition-colors
            ${isActive ? 'bg-[#22c55e]/10' : 'hover:bg-gray-100'}`
          }
        >
          {user?.image ? (
            <img src={user.image} alt={user?.name || "Avatar"} className="w-9 h-9 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? 'Pengguna'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email ?? 'Tidak ada email'}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  )
}