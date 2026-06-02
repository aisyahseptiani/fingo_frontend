import { useState } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'

import { useGetGoals, useAddGoal } from '../../hooks/useGoals'
import { useGetTransactions } from '../../hooks/useTransactions'
import { useDashboard } from '../../hooks/useDashboard'

const formatRp = (n) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0
}).format(n)

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()
  
  const { data: rawGoals = [] } = useGetGoals()
  const { mutate: addGoal } = useAddGoal()
  const { data: transactions = [] } = useGetTransactions()
  const { data: dashboard = {} } = useDashboard()

  const TARGETS = rawGoals.map(g => ({
    label: g.name,
    percent: g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0,
    current: g.currentAmount,
    goal: g.targetAmount,
    est: g.deadline ? `Target: ${new Date(g.deadline).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}` : 'Tidak ada tenggat',
    color: g.color || 'bg-blue-500',
    textColor: 'text-blue-500'
  }))

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
  const totalSavings = totalIncome - totalExpense

  const uniqueMonths = new Set(transactions.map(t => t.date.substring(0, 7))).size || 1
  const avgIncome = Math.round(totalIncome / uniqueMonths)

  const STAT_CARDS = [
    { value: formatRp(avgIncome), label: 'Rata-rata pemasukan/Bulan', sub: 'Berdasarkan riwayat', subColor: 'text-[#22c55e]', valueColor: 'text-[#22c55e]' },
    { value: formatRp(totalSavings), label: 'Total Tabungan Terkumpul', sub: `Dari ${uniqueMonths} bulan aktif`, subColor: 'text-blue-500', valueColor: 'text-blue-500' },
    { value: transactions.length.toString(), label: 'Total Transaksi Dicatat', sub: `Rata-rata ${Math.round(transactions.length / uniqueMonths)}/bulan`, subColor: 'text-gray-400', valueColor: 'text-gray-900' },
    { value: `${uniqueMonths}`, label: 'Bulan Aktif', sub: 'Total bulan pencatatan', subColor: 'text-gray-400', valueColor: 'text-[#22c55e]' },
  ]

  const budgetUsed = dashboard.expense > 0 ? Math.min(Math.round((dashboard.expense / 5000000) * 100), 100) : 0;
  const targetProgress = TARGETS.length > 0 ? Math.round(TARGETS.reduce((sum, t) => sum + t.percent, 0) / TARGETS.length) : 0;

  const ACTIVITY_SCORES = [
    { label: 'Konsistensi Pemasukan',  percent: totalIncome > 0 ? 100 : 0, color: 'bg-[#22c55e]'  },
    { label: 'Kepatuhan Budget',       percent: Math.max(100 - budgetUsed, 0), color: (100 - budgetUsed) > 50 ? 'bg-[#22c55e]' : 'bg-yellow-400'  },
    { label: 'Kontrol Implusif',       percent: dashboard.impulsiveCount > 5 ? 40 : 90, color: dashboard.impulsiveCount > 5 ? 'bg-yellow-400' : 'bg-[#22c55e]' },
    { label: 'Progres Target',         percent: targetProgress, color: 'bg-blue-500'   },
    { label: 'Keteraturan Pencatatan', percent: transactions.length > 0 ? 95 : 0, color: 'bg-[#22c55e]'  },
  ]

  const totalScore = Math.round(ACTIVITY_SCORES.reduce((sum, a) => sum + a.percent, 0) / ACTIVITY_SCORES.length)

  // =========================
  // NEW STATE
  // =========================
  const [showTargetModal, setShowTargetModal] = useState(false)
  const [targetDescription, setTargetDescription] = useState('')
  const [targetAmount, setTargetAmount] = useState('')

  const handleSaveTarget = () => {
    if (!targetDescription || !targetAmount) return

    addGoal({
      name: targetDescription,
      targetAmount: Number(targetAmount)
    })

    // reset form
    setTargetDescription('')
    setTargetAmount('')
    setShowTargetModal(false)
  }

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
          {user?.image ? (
            <img src={user.image} alt={user?.name} className="w-28 h-28 rounded-2xl object-cover shrink-0" />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center text-4xl font-black text-gray-300">
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-black text-gray-900">{user?.name ?? 'Pengguna'}</h2>
            <p className="text-[#22c55e] font-semibold text-sm mt-0.5">
              {user?.email ?? 'Tidak ada email'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Bergabung sejak {new Date(user?.createdAt || Date.now()).getFullYear()}</p>
            <span className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full border border-[#22c55e] text-[#22c55e] text-xs font-semibold">
              ✓ Pengguna Terverifikasi
            </span>
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3"
                  strokeDasharray={`${totalScore} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-gray-900">{totalScore}</span>
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
          <div className="flex items-start gap-4">
            {user?.image ? (
              <img src={user.image} alt={user?.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center text-2xl font-black text-gray-300">
                {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-black text-gray-900 leading-tight">
                {user?.name ?? 'Pengguna'}
              </h2>
              <p className="text-[#22c55e] font-semibold text-xs mt-0.5">
                {user?.email ?? 'Tidak ada email'}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Bergabung {new Date(user?.createdAt || Date.now()).getFullYear()}
              </p>
            </div>

            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22c55e" strokeWidth="3.5"
                    strokeDasharray={`${totalScore} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-gray-900">{totalScore}</span>
                  <span className="text-[9px] text-gray-400">Skor</span>
                </div>
              </div>
              <p className="text-[10px] text-[#22c55e] font-semibold mt-1">Sangat Baik</p>
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#22c55e] text-[#22c55e] text-xs font-semibold">
              ✓ Pengguna Terverifikasi
            </span>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {STAT_CARDS.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 lg:p-5">
            <p className={`text-xl lg:text-2xl font-black ${s.valueColor}`}>{s.value}</p>
            <p className="text-xs lg:text-sm text-gray-500 mt-1 leading-tight">{s.label}</p>
            <p className={`text-xs font-medium mt-1 ${s.subColor}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── AKTIVITAS + TARGET ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">

        {/* Aktivitas Keuangan */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-6">
          <h2 className="font-bold text-gray-900 mb-0.5 text-sm lg:text-base">
            Aktivitas Keuangan
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
            Breakdown Skor {totalScore}
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

            {/* UPDATED BUTTON */}
            <button
              onClick={() => setShowTargetModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e] text-[#22c55e] text-xs font-semibold rounded-xl hover:bg-[#22c55e]/20 transition-colors shrink-0"
            >
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

      {/* ========================================= */}
      {/* MODAL TAMBAH TARGET KEUANGAN */}
      {/* ========================================= */}
      {showTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">

            {/* Header */}
            <div className="flex items-center justify-between px-4 lg:px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base lg:text-lg font-black text-gray-900">
                  Tambah Target
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Buat target keuangan baru
                </p>
              </div>

              <button
                onClick={() => setShowTargetModal(false)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 lg:p-5 space-y-4">

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Target
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Beli Motor Baru"
                  value={targetDescription}
                  onChange={(e) => setTargetDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
                />
              </div>

              {/* Jumlah */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah Target
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 10000000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => setShowTargetModal(false)}
                  className="w-full sm:w-1/2 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>

                <button
                  onClick={handleSaveTarget}
                  className="w-full sm:w-1/2 px-4 py-3 rounded-xl bg-[#22c55e] text-white text-sm font-semibold hover:bg-[#16a34a] transition-colors"
                >
                  Simpan Target
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}