import { useState } from 'react'
import { Menu, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'
import { useLocation } from 'react-router-dom'
import MobileDrawer from './MobileDrawer'
import fingoLogo from '../../assets/images/fingo-logo.png'

export default function MobileHeader() {
  const [open, setOpen] = useState(false)
  const { unreadCount } = useNotifications()

  return (
    <>
      <header className="bg-white border-b border-gray-100 h-14 flex items-center justify-between px-4 shadow-sm">

        {/* Kiri: logo + nama */}
        <div className="flex items-center gap-2.5">
          <img
            src={fingoLogo}
            alt="Fingo"
            className="w-8 h-8 rounded-xl object-cover"
          />
          <div>
            <p className="font-black text-sm leading-none">
              <span className="text-gray-900">Fin</span>
              <span className="text-[#22c55e]">go</span>
            </p>
            <p className="text-[9px] text-gray-400 leading-none mt-0.5">
              Smart Finance
            </p>
          </div>
        </div>

        {/* Kanan: bell + hamburger */}
        <div className="flex items-center gap-1">
          <Link
            to="/notifications"
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors relative"
          >
            <Bell size={19} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 border border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Link>

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