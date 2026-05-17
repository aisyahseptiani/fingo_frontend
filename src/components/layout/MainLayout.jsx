import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isFullHeight = pathname === '/ai/assistant'

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:flex lg:shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-40">
          <MobileHeader />
        </div>

        <main className={`flex-1 ${isFullHeight ? 'overflow-hidden h-screen' : 'overflow-y-auto'}`}>
          <div className={isFullHeight ? 'h-full' : 'pb-20 lg:pb-0'}>
            <Outlet />
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  )
}