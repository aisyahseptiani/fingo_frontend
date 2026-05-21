import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import MobileDrawer from './MobileDrawer'
import fingoLogo from '../../assets/images/fingo-logo.png'

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
      <header className="bg-white border-b border-gray-100 h-14 flex items-center px-4 shadow-sm">

        {/* Kiri: logo + nama app */}
        <div className="flex items-center gap-2.5 flex-1">
          <img
            src={fingoLogo}
            alt="Fingo"
            className="w-8 h-8 rounded-xl object-cover"
          />
          <div>
            <span className="font-black text-base leading-none">
              <span className="text-gray-900">Fin</span>
              <span className="text-[#22c55e]">go</span>
            </span>
            <p className="text-[9px] text-gray-400 leading-none tracking-widest uppercase mt-0.5">
              Smart Finance
            </p>
          </div>
        </div>

        {/* Kanan: hamburger */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-700" />
          </button>
        </div>

      </header>

      <MobileDrawer isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}