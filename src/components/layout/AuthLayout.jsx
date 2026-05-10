// components/layout/AuthLayout.jsx  ← VERSI FINAL
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Panel kiri */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1C3829] relative overflow-hidden flex-col items-center justify-center p-12">
        {/* Lingkaran dekoratif */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full border-[40px] border-white/10 pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-40px] w-56 h-56 rounded-full border-[30px] border-white/10 pointer-events-none" />
        <div className="absolute top-[35%] right-[-60px] w-48 h-48 rounded-full border-[25px] border-white/10 pointer-events-none" />

        {/* Konten logo */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-[#243d2f] rounded-2xl px-6 py-5 flex items-center gap-5 shadow-xl mb-8">
            <div className="w-16 h-16 rounded-xl bg-[#22c55e]/20 flex items-center justify-center text-5xl select-none">
              🐸
            </div>
            <div className="text-left">
              <div className="text-3xl font-black leading-none mb-1">
                <span className="text-white">Fin</span><span className="text-[#22c55e]">go</span>
              </div>
              <div className="text-white/90 font-semibold text-xs tracking-[0.2em] uppercase">Smart Finance App</div>
            </div>
          </div>
          {/* Tagline placeholder - diisi per page via id */}
          <div id="auth-tagline" />
        </div>
      </div>

      {/* Panel kanan */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white min-h-screen">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}