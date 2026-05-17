import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import MobileDrawer from './MobileDrawer'

const PAGE_TITLES = {
  '/':                 'Dashboard',
  '/transactions/add': 'Catat Transaksi',
  '/transactions':     'Riwayat',
  '/budget':           'Budget Planner',
  '/ai/assistant':     'AI Assistant',
  '/ai/impulse':       'Impulsive Detector',
  '/ai/predictor':     'Income Predictor',
  '/notifications':    'Notifikasi',
  '/profile':          'Profil',
  '/settings':         'Pengaturan',
}

export default function MobileHeader() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const title = PAGE_TITLES[pathname] ?? 'Fingo'

  return (
    <>
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between shadow-sm">
        <button onClick={() => setOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Menu size={20} className="text-gray-700" />
        </button>

        <div className="flex items-center gap-2">
          {/* Logo text */}
          <span className="text-lg font-black">
            <span className="text-gray-900">Fin</span>
            <span className="text-[#22c55e]">go</span>
          </span>
        </div>

        <Link to="/notifications"
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </Link>
      </header>

      <MobileDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}