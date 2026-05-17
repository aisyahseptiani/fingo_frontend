// pages/dashboard/DashboardPage.jsx
import { Bell, Plus, ChevronRight, TrendingUp, TrendingDown, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useDashboard } from '../../hooks/useDashboard'
import { formatRupiah } from '../../utils/formatCurrency'
import { formatDateShort } from '../../utils/formatDate'
import StatCard from '../../components/dashboard/StatCard'
import TransactionTable from '../../components/dashboard/TransactionTable'
import BudgetDonutChart from '../../components/dashboard/BudgetDonutChart'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const DUMMY_WEEKLY = [
  { week: 'Mg 1', income: 2000000, expense: 800000  },
  { week: 'Mg 2', income: 1500000, expense: 600000  },
  { week: 'Mg 3', income: 3000000, expense: 1200000 },
  { week: 'Mg 4', income: 800000,  expense: 400000  },
  { week: 'Pred.', income: 1100000, expense: 500000 },
]

export default function DashboardPage() {
  const { user } = useAuthContext()
  const { data, isLoading } = useDashboard()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 11) return 'Selamat pagi'
    if (h < 15) return 'Selamat siang'
    if (h < 18) return 'Selamat sore'
    return 'Selamat malam'
  }

  return (
    <div>
      {/* ════════════════════════════════════════
          DESKTOP — persis sama seperti kode asli
      ════════════════════════════════════════ */}
      <div className="hidden lg:block px-6 py-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {greeting()}, {user?.name?.split(' ')[0] ?? 'Aisyah'}
            </p>
          </div>
          <Link to="/notifications"
            className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
            <Bell size={18} />
          </Link>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Saldo Tersedia"
            value={isLoading ? '...' : formatRupiah(data?.balance)}
            subtitle="Bulan April 2026" subtitleColor="text-[#22c55e]" borderColor="border-l-[#22c55e]" />
          <StatCard title="Pemasukan Bulan ini"
            value={isLoading ? '...' : formatRupiah(data?.income)}
            subtitle="+12% dari bulan lalu" subtitleColor="text-blue-500" borderColor="border-l-blue-500" />
          <StatCard title="Pengeluaran Bulan ini"
            value={isLoading ? '...' : formatRupiah(data?.expense)}
            subtitle="68% budget terpakai" subtitleColor="text-red-500" borderColor="border-l-red-500" />
          <StatCard title="Transaksi Implusif"
            value={isLoading ? '...' : `${data?.impulsiveCount ?? 3}x`}
            subtitle="↑ 1 dari bulan lalu" subtitleColor="text-amber-500" borderColor="border-l-amber-500" />
        </div>

        {/* Baris tengah */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
          <TransactionTable transactions={data?.recentTransactions ?? []} isLoading={isLoading} />
          <div className="space-y-4">
            <BudgetDonutChart data={data?.expenseByCategory ?? []} total={data?.expense ?? 0} />
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold text-[#22c55e] tracking-widest uppercase mb-1">Prediksi Income Minggu Ini</p>
              <p className="text-2xl font-black text-gray-900">{formatRupiah(data?.incomePrediction ?? 1100000)}</p>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">
                Historis: Rp 980.000/minggu <span className="text-[#22c55e] font-semibold">↑ +12%</span>
              </p>
              <div className="h-1.5 bg-gray-100 rounded-full mb-4">
                <div className="h-1.5 bg-[#22c55e] rounded-full w-3/4" />
              </div>
              <Link to="/ai/predictor">
                <button className="w-full py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold rounded-xl transition-colors">
                  Lihat Detail
                </button>
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                <span className="font-bold text-sm text-gray-900">Saran AI</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                Budget hiburanmu sudah <strong>55% terpakai.</strong>{' '}
                Kurangi pengeluaran akhir bulan dan alihkan ke tabungan <strong>Rp 200.000</strong> di bulan depan.
              </p>
              <Link to="/ai/assistant">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                  <span>💬</span> Tanya AI
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data?.weeklyChart ?? DUMMY_WEEKLY}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => formatRupiah(v)} />
              <Legend formatter={(val) =>
                <span className="text-xs text-gray-500">{val === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
              } />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#colorIncome)" name="income" dot={false} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpense)" name="expense" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════════
          MOBILE — elemen & warna identik desktop
      ════════════════════════════════════════ */}
      <div className="lg:hidden px-4 py-4 space-y-4 pb-24">

        {/* Greeting */}
        <div>
          <h1 className="text-xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            {greeting()}, {user?.name?.split(' ')[0] ?? 'Aisyah'}
          </p>
        </div>

        {/* 4 stat cards 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-[#22c55e] p-3.5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Saldo Tersedia</p>
            <p className="text-base font-black text-gray-900 leading-tight">{isLoading ? '...' : formatRupiah(data?.balance)}</p>
            <p className="text-[10px] text-[#22c55e] font-semibold mt-1">Bulan April 2026</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-blue-500 p-3.5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Pemasukan</p>
            <p className="text-base font-black text-gray-900 leading-tight">{isLoading ? '...' : formatRupiah(data?.income)}</p>
            <p className="text-[10px] text-blue-500 font-semibold mt-1">+12% bulan lalu</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-red-500 p-3.5 shadow-sm">
            <p className="text-xs text-gray-400 mb-1">Pengeluaran</p>
            <p className="text-base font-black text-gray-900 leading-tight">{isLoading ? '...' : formatRupiah(data?.expense)}</p>
            <p className="text-[10px] text-red-500 font-semibold mt-1">68% budget terpakai</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-amber-500 p-3.5 shadow-sm">
            <div className="flex items-center gap-1 mb-1">
              <Zap size={11} className="text-amber-500" />
              <p className="text-xs text-gray-400">Implusif</p>
            </div>
            <p className="text-base font-black text-gray-900 leading-tight">{data?.impulsiveCount ?? 3}x</p>
            <p className="text-[10px] text-amber-500 font-semibold mt-1">↑ 1 dari bulan lalu</p>
          </div>
        </div>

        {/* Transaksi terbaru */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Transaksi Terbaru</h2>
            <Link to="/transactions"
              className="text-xs text-[#22c55e] flex items-center gap-0.5 font-semibold hover:underline">
              Lihat Semua <ChevronRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {(data?.recentTransactions ?? []).slice(0, 4).map(trx => (
              <div key={trx.id} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                  ${trx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                  {trx.type === 'income' ? '↑' : '↓'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{trx.description}</p>
                  <p className="text-xs text-gray-400">{trx.category}</p>
                </div>
                <span className={`text-sm font-bold shrink-0 ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
                  {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut chart */}
        <BudgetDonutChart data={data?.expenseByCategory ?? []} total={data?.expense ?? 0} />

        {/* Prediksi income */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-[10px] font-bold text-[#22c55e] tracking-widest uppercase mb-1">
            Prediksi Income Minggu Ini
          </p>
          <p className="text-2xl font-black text-gray-900">
            {formatRupiah(data?.incomePrediction ?? 1100000)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">
            Historis: Rp 980.000/minggu{' '}
            <span className="text-[#22c55e] font-semibold">↑ +12%</span>
          </p>
          <div className="h-1.5 bg-gray-100 rounded-full mb-4">
            <div className="h-1.5 bg-[#22c55e] rounded-full w-3/4" />
          </div>
          <Link to="/ai/predictor">
            <button className="w-full py-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold rounded-xl transition-colors">
              Lihat Detail
            </button>
          </Link>
        </div>

        {/* Saran AI */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-sm" />
            <span className="font-bold text-sm text-gray-900">Saran AI</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            Budget hiburanmu sudah <strong>55% terpakai.</strong>{' '}
            Kurangi pengeluaran akhir bulan dan alihkan ke tabungan{' '}
            <strong>Rp 200.000</strong> di bulan depan.
          </p>
          <Link to="/ai/assistant">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors w-full justify-center">
              <span>💬</span> Tanya AI
            </button>
          </Link>
        </div>

        {/* Area chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-4 mb-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#22c55e]" />
              <span>Pemasukan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-red-400" />
              <span>Pengeluaran</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={data?.weeklyChart ?? DUMMY_WEEKLY}>
              <defs>
                <linearGradient id="mIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="mExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip formatter={(v) => formatRupiah(v)} />
              <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} fill="url(#mIncome)" name="income" dot={false} />
              <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fill="url(#mExpense)" name="expense" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}