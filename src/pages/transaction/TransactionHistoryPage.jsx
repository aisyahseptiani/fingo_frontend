import { useState } from 'react'
import { Bell, Search, ChevronLeft, ChevronRight } from 'lucide-react'

const ALL_TRANSACTIONS = [
  { id: 1, description: 'Beli sayuran',      method: 'Tunai',        category: 'Makanan',      date: '22 Apr', amount: 203000,  type: 'expense', isImpulsive: false },
  { id: 2, description: 'Grab',              method: 'Gopay',        category: 'Transportasi', date: '21 Apr', amount: 15000,   type: 'expense', isImpulsive: false },
  { id: 3, description: 'Freelance Project', method: 'Transfer Bank', category: 'Pemasukan',   date: '20 Apr', amount: 800000,  type: 'income',  isImpulsive: false },
  { id: 4, description: 'Makan siang',       method: 'Tunai',        category: 'Makanan',      date: '19 Apr', amount: 35000,   type: 'expense', isImpulsive: false },
  { id: 5, description: 'Netflix',           method: 'Gopay',        category: 'Hiburan',      date: '18 Apr', amount: 54000,   type: 'expense', isImpulsive: true  },
  { id: 6, description: 'Transfer Gojek',    method: 'Transfer Bank', category: 'Pemasukan',   date: '18 Apr', amount: 1100000, type: 'income',  isImpulsive: false },
]

const FILTERS = ['Semua', 'Pemasukan', 'Pengeluaran', 'Makanan', 'Transport', 'Hiburan', 'Tagihan', 'Kesehatan', 'Pendidikan', 'Lainnya', 'Implusif']

const CATEGORY_COLORS = {
  Makanan: 'bg-green-100 text-green-700', Transportasi: 'bg-blue-100 text-blue-700',
  Hiburan: 'bg-yellow-100 text-yellow-700', Pemasukan: 'bg-green-100 text-green-700',
  Belanja: 'bg-purple-100 text-purple-700', Lainnya: 'bg-gray-100 text-gray-600',
}

const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export default function TransactionHistoryPage() {
  const [search, setSearch]           = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [activePeriod, setActivePeriod] = useState('Minggu ini')

  const filtered = ALL_TRANSACTIONS.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
    if (activeFilter === 'Semua')       return matchSearch
    if (activeFilter === 'Pemasukan')  return matchSearch && t.type === 'income'
    if (activeFilter === 'Pengeluaran') return matchSearch && t.type === 'expense'
    if (activeFilter === 'Implusif')   return matchSearch && t.isImpulsive
    return matchSearch && t.category.toLowerCase().includes(activeFilter.toLowerCase())
  })

  const FilterChips = () => (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTERS.map(f => (
        <button key={f} onClick={() => setActiveFilter(f)}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
            ${activeFilter === f
              ? f === 'Implusif' ? 'bg-red-500 border-red-500 text-white' : 'bg-[#22c55e] border-[#22c55e] text-white'
              : f === 'Implusif' ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}>
          {f}
        </button>
      ))}
    </div>
  )

  return (
    <div>
      {/* ── DESKTOP ── */}
      <div className="hidden lg:block p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Riwayat Transaksi</h1>
            <p className="text-gray-400 text-sm mt-0.5">Semua catatan pemasukan & pengeluaran kamu</p>
          </div>
          <button className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm">
            <Bell size={18} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Pemasukan bulan ini', value: 4200000, sub: '12 Transaksi', subColor: 'text-[#22c55e]', border: 'border-l-[#22c55e]' },
            { label: 'Total Pengeluaran bulan ini', value: 1750000, sub: '36 Transaksi', subColor: 'text-red-500', border: 'border-l-red-500' },
            { label: 'Sisa Saldo', value: 2450000, sub: 'Net Positif', subColor: 'text-[#22c55e]', border: 'border-l-blue-500' },
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.border} p-5 shadow-sm`}>
              <p className="text-sm text-gray-400 mb-1">{s.label}</p>
              <p className="text-2xl font-black text-gray-900">{formatRp(s.value)}</p>
              <p className={`text-xs font-semibold mt-1 ${s.subColor}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input type="text" placeholder="Cari transaksi..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300" />
          {['Minggu ini', 'Bulan ini'].map(p => (
            <button key={p} onClick={() => setActivePeriod(p)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                ${activePeriod === p ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {p}
            </button>
          ))}
        </div>

        <FilterChips />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">April 2026</h2>
            <span className="text-sm text-gray-400">Menampilkan {filtered.length} dari {ALL_TRANSACTIONS.length} transaksi</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Keterangan', 'Kategori', 'Tanggal', 'Jumlah', 'Aksi'].map((h, i) => (
                    <th key={h} className={`py-3 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(trx => (
                  <tr key={trx.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">{trx.description}</p>
                      <p className="text-xs text-gray-400">{trx.method}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[trx.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {trx.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-sm">{trx.date}</td>
                    <td className={`px-4 py-4 text-right font-bold ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
                      {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="text-xs text-gray-400 hover:text-gray-600">edit / hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <span className="text-sm text-gray-400">Halaman 1 dari 6 halaman</span>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">Sebelumnya</button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">Selanjutnya</button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <div className="lg:hidden px-4 py-4 pb-24 space-y-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-400 text-sm">Semua catatan pemasukan & pengeluaran kamu</p>
        </div>

        {/* Stat cards 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-[#22c55e] p-3.5 shadow-sm">
            <p className="text-xs text-gray-400">Pemasukan</p>
            <p className="text-base font-black text-gray-900 mt-0.5">{formatRp(4200000)}</p>
            <p className="text-[10px] text-[#22c55e] font-semibold mt-0.5">12 Transaksi</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-red-500 p-3.5 shadow-sm">
            <p className="text-xs text-gray-400">Pengeluaran</p>
            <p className="text-base font-black text-gray-900 mt-0.5">{formatRp(1750000)}</p>
            <p className="text-[10px] text-red-500 font-semibold mt-0.5">36 Transaksi</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-blue-500 p-3.5 shadow-sm col-span-2">
            <p className="text-xs text-gray-400">Sisa Saldo</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{formatRp(2450000)}</p>
            <p className="text-[10px] text-[#22c55e] font-semibold mt-0.5">Net Positif</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari transaksi..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300" />
        </div>

        {/* Period toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {['Minggu ini', 'Bulan ini'].map(p => (
            <button key={p} onClick={() => setActivePeriod(p)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all
                ${activePeriod === p ? 'bg-white text-[#22c55e] shadow-sm' : 'text-gray-500'}`}>
              {p}
            </button>
          ))}
        </div>

        {/* Filter chips scroll */}
        <FilterChips />

        {/* List transaksi mobile */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">April 2026</h2>
            <span className="text-xs text-gray-400">{filtered.length} transaksi</span>
          </div>
          <div className="divide-y divide-gray-50">
            {filtered.map(trx => (
              <div key={trx.id} className="flex items-center gap-3 px-4 py-3.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                  ${trx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                  {trx.type === 'income' ? '↑' : '↓'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800 truncate">{trx.description}</p>
                    {trx.isImpulsive && (
                      <span className="shrink-0 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">Implusif</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[trx.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {trx.category}
                    </span>
                    <span className="text-xs text-gray-400">{trx.date} · {trx.method}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold shrink-0 ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
                  {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination mobile */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">Hal. 1 dari 6</span>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <ChevronLeft size={15} className="text-gray-500" />
              </button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
                <ChevronRight size={15} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}