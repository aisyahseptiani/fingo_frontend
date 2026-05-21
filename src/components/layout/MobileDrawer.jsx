import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Plus, ClockIcon, Zap,
  TrendingUp, Wallet, MessageSquare, Settings,
  X, LogOut,
} from 'lucide-react'
import { useAuthContext } from '../../context/AuthContext'
import { useLogout } from '../../hooks/useAuth'
import fingoLogo from '../../assets/images/fingo-logo.png'

const MENU_UTAMA = [
  { path: '/',                 label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/transactions/add', label: 'Catat Transaksi', icon: Plus },
  { path: '/transactions',     label: 'Riwayat',         icon: ClockIcon },
]

const ANALITIK = [
  { path: '/ai/impulse',   label: 'Impulsive Detector', icon: Zap },
  { path: '/ai/predictor', label: 'Income Predictor',   icon: TrendingUp },
  { path: '/budget',       label: 'Budget Planner',     icon: Wallet },
  { path: '/ai/assistant', label: 'AI Assistant',       icon: MessageSquare },
  { path: '/settings',     label: 'Pengaturan',         icon: Settings },
]

export default function MobileDrawer({ isOpen, onClose }) {
  const { user } = useAuthContext()
  const { mutate: logout } = useLogout()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
    ${isActive
      ? 'bg-[#22c55e]/15 text-[#22c55e] font-semibold'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Drawer dari kanan */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 flex flex-col shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img
              src={fingoLogo}
              alt="Fingo"
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div>
              <div className="font-black text-lg leading-none">
                <span className="text-gray-900">Fin</span>
                <span className="text-[#22c55e]">go</span>
              </div>
              <div className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">
                Smart Finance App
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={17} className="text-gray-500" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 mb-2">
              Menu Utama
            </p>
            <div className="space-y-0.5">
              {MENU_UTAMA.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  className={linkClass}
                  onClick={onClose}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase px-3 mb-2">
              Analitik
            </p>
            <div className="space-y-0.5">
              {ANALITIK.map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={linkClass}
                  onClick={onClose}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* User info */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-[#22c55e] flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name ?? 'Pengguna'}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.jobType ?? 'Gig Worker'}
              </p>
            </div>
            <button
              onClick={() => { logout(); onClose() }}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}