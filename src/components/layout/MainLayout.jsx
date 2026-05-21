import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isChat = pathname === '/ai/assistant'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Sidebar — selalu tampil di desktop */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Konten utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile header — selalu tampil di mobile */}
        <div className="lg:hidden shrink-0">
          <MobileHeader />
        </div>

        {/* Main */}
        <main className={`flex-1 min-h-0 ${isChat ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <Outlet />
        </main>

      </div>
    </div>
  )
}