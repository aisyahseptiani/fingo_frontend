import { useState } from 'react'
import { ArrowLeft, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'

const formatRp = (n) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0
}).format(n)

const ACTIVITY_SCORES = [
  { label: 'Konsistensi Pemasukan',  percent: 95, color: 'bg-[#22c55e]'  },
  { label: 'Kepatuhan Budget',       percent: 88, color: 'bg-[#22c55e]'  },
  { label: 'Kontrol Implusif',       percent: 72, color: 'bg-yellow-400' },
  { label: 'Progres Target',         percent: 80, color: 'bg-blue-500'   },
  { label: 'Keteraturan Pencatatan', percent: 93, color: 'bg-[#22c55e]'  },
]

const TARGETS = [
  { label: 'Dana Darurat 6 bulan',      percent: 34, current: 8400000, goal: 25000000, est: 'Est. Des 2026',     color: 'bg-blue-500',    textColor: 'text-blue-500'    },
  { label: 'Laptop Baru untuk Kerja',   percent: 75, current: 6000000, goal: 8000000,  est: '🔥 Hampir selesai!', color: 'bg-[#22c55e]',   textColor: 'text-[#22c55e]'  },
  { label: 'Liburan ke Jepang',         percent: 21, current: 3200000, goal: 15000000, est: 'Target: Mar 2027',  color: 'bg-yellow-400',  textColor: 'text-yellow-500'  },
  { label: 'Mulai Investasi Reksa Dana',percent: 10, current: 500000,  goal: 5000000,  est: 'Target: Jun 2026', color: 'bg-orange-400',  textColor: 'text-orange-500'  },
]

const STAT_CARDS = [
  { value: 'Rp 4.2 jt',  label: 'Rata-rata pemasukan/Bulan', sub: '↑ Naik 12% dari 3 bulan lalu', subColor: 'text-[#22c55e]', valueColor: 'text-[#22c55e]'  },
  { value: 'Rp 12.4 jt', label: 'Total Tabungan Terkumpul',  sub: 'Sejak April 2025',              subColor: 'text-blue-500',  valueColor: 'text-blue-500'   },
  { value: '287',         label: 'Total Transaksi Dicatat',   sub: 'Rata-rata 24/bulan',            subColor: 'text-gray-400',  valueColor: 'text-gray-900'   },
  { value: '12',          label: 'Bulan Streak Aktif',        sub: 'Konsisten tanpa jeda',          subColor: 'text-gray-400',  valueColor: 'text-[#22c55e]'  },
]

export default function ProfilePage() {
  const navigate    = useNavigate()
  const { user, logout } = useAuthContext()

  return (
    <div className="px-4 py-4 lg:px-6 lg:py-6 pb-24 lg:pb-6 space-y-4 lg:space-y-5">

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 lg:gap-3 min-w-0">
          <button onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors shrink-0">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-tight">
              Profil Akun
            </h1>
            <p className="text-gray-400 text-xs lg:text-sm truncate">
              Informasi, pencapaian & kesehatan keuanganmu
            </p>
          </div>
        </div>
        <button onClick={logout}
          className="px-3 py-2 lg:px-4 rounded-xl border border-red-200 text-red-500 text-xs lg:text-sm font-semibold hover:bg-red-50 transition-colors shrink-0">
          Logout
        </button>
      </div>

      {/* ── PROFILE CARD ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">

        {/* Desktop layout */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="w-28 h-28 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center text-4xl font-black text-gray-300">
            {user?.name?.charAt(0) ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-gray-900">{user?.name ?? 'Aisyah Septiani'}</h2>
            <p className="text-[#22c55e] font-semibold text-sm mt-0.5">
              {user?.jobType ?? 'Gig Worker'} & Freelance UI/UX Designer
            </p>
            <p className="text-gray-400 text-sm mt-1">Pekanbaru, Riau · Bergabung sejak 2025</p>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full border border-[#22c55e] text-[#22c55e] text-xs font-semibold">
              ✓ Pengguna Terverifikasi
            </span>
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeDasharray="87 100" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900">87</span>
                <span className="text-[10px] text-gray-400">Skor</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Kesehatan Keuangan</p>
            <p className="text-xs text-[#22c55e] font-semibold">↑ Sangat Baik</p>
            <p className="text-[10px] text-gray-400">+5 dari bulan lalu</p>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden">
          {/* Baris atas: avatar + info + skor */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center text-2xl font-black text-gray-300">
              {user?.name?.charAt(0) ?? 'A'}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                {user?.name ?? 'Aisyah Septiani'}
              </h2>
              <p className="text-[#22c55e] font-semibold text-xs mt-0.5">
                {user?.jobType ?? 'Gig Worker'} & Freelance UI/UX Designer
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Pekanbaru, Riau · Bergabung 2025
              </p>
            </div>

            {/* Skor kecil */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.5"
                    strokeDasharray="87 100" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-gray-900">87</span>
                  <span className="text-[9px] text-gray-400">Skor</span>
                </div>
              </div>
              <p className="text-[10px] text-[#22c55e] font-semibold mt-1">Sangat Baik</p>
            </div>
          </div>

          {/* Badge verifikasi */}
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#22c55e] text-[#22c55e] text-xs font-semibold">
              ✓ Pengguna Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ──
          Desktop: 4 kolom
          Mobile: 2x2 grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {STAT_CARDS.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 lg:p-5">
            <p className={`text-xl lg:text-2xl font-black ${s.valueColor}`}>{s.value}</p>
            <p className="text-xs lg:text-sm text-gray-500 mt-1 leading-tight">{s.label}</p>
            <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── AKTIVITAS + TARGET ──
          Desktop: 2 kolom
          Mobile: stack */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">

        {/* Aktivitas Keuangan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
          <h2 className="font-bold text-gray-900 mb-0.5 text-sm lg:text-base">
            Aktivitas Keuangan
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
            Breakdown Skor 87
          </p>
          <div className="space-y-3 lg:space-y-4">
            {ACTIVITY_SCORES.map((a, i) => {
              const textColor = a.color === 'bg-[#22c55e]'
                ? 'text-[#22c55e]'
                : a.color === 'bg-yellow-400'
                  ? 'text-yellow-500'
                  : 'text-blue-500'
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 text-xs lg:text-sm">• {a.label}</span>
                    <span className={`font-bold text-xs lg:text-sm ${textColor}`}>
                      {a.percent}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-2 rounded-full ${a.color} transition-all`}
                      style={{ width: `${a.percent}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Target Keuangan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm lg:text-base">Target Keuangan</h2>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] text-xs font-semibold rounded-xl hover:bg-[#22c55e]/20 transition-colors shrink-0">
              <Plus size={12} /> Tambah
            </button>
          </div>

          <div className="space-y-3 lg:space-y-4">
            {TARGETS.map((t, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-1 gap-2">
                  <p className="text-xs lg:text-sm font-semibold text-gray-800 leading-tight">
                    {t.label}
                  </p>
                  <span className={`text-xs lg:text-sm font-bold shrink-0 ${t.textColor}`}>
                    {t.percent}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div className={`h-1.5 rounded-full ${t.color}`}
                    style={{ width: `${t.percent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] lg:text-xs text-gray-400">
                  <span>
                    {formatRp(t.current)}{' '}
                    <span className="hidden sm:inline">dari {formatRp(t.goal)}</span>
                  </span>
                  <span className={t.est.includes('🔥') ? 'text-orange-500 font-semibold' : ''}>
                    {t.est}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Saran AI */}
          <div className="mt-4 lg:mt-5 p-3 lg:p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              Saran AI untuk Target
            </p>
            <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
              Dengan pola pemasukanmu yang naik, tambahkan{' '}
              <strong>Rp 300.000/bulan</strong> ke dana darurat. Target laptop bisa tercapai{' '}
              <strong>bulan Juni</strong> — 2 bulan lebih cepat dari rencana!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}