import { useState } from 'react'
import { Bell } from 'lucide-react'

const ALL_TRANSACTIONS = [
  { id: 1, description: 'Beli sayuran', method: 'Tunai', category: 'Makanan', date: '22 Apr', amount: 203000, type: 'expense', isImpulsive: false },
  { id: 2, description: 'Grab', method: 'Gopay', category: 'Transportasi', date: '21 Apr', amount: 15000, type: 'expense', isImpulsive: false },
  { id: 3, description: 'Freelance Project', method: 'Transfer Bank', category: 'Pemasukan', date: '20 Apr', amount: 800000, type: 'income', isImpulsive: false },
  { id: 4, description: 'Makan siang', method: 'Tunai', category: 'Makanan', date: '19 Apr', amount: 35000, type: 'expense', isImpulsive: false },
  { id: 5, description: 'Netflix subciption', method: 'Gopay', category: 'Hiburan', date: '18 Apr', amount: 54000, type: 'expense', isImpulsive: true },
  { id: 6, description: 'Transfer Gojek', method: 'Transfer Bank', category: 'Pemasukan', date: '18 Apr', amount: 1100000, type: 'income', isImpulsive: false },
]

const FILTERS = ['Semua', 'Pemasukan', 'Pengeluaran', 'Makanan', 'Transport', 'Hiburan', 'Tagihan', 'Kesehatan', 'Pendidikan', 'Lainnya', 'Implusif']

const CATEGORY_COLORS = {
  Makanan: 'bg-green-100 text-green-700',
  Transportasi: 'bg-blue-100 text-blue-700',
  Hiburan: 'bg-yellow-100 text-yellow-700',
  Pemasukan: 'bg-green-100 text-green-700',
  Belanja: 'bg-purple-100 text-purple-700',
  Lainnya: 'bg-gray-100 text-gray-600',
}

const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export default function TransactionHistoryPage() {
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [activePeriod, setActivePeriod] = useState('Minggu ini')

  const filtered = ALL_TRANSACTIONS.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
    if (activeFilter === 'Semua') return matchSearch
    if (activeFilter === 'Pemasukan') return matchSearch && t.type === 'income'
    if (activeFilter === 'Pengeluaran') return matchSearch && t.type === 'expense'
    if (activeFilter === 'Implusif') return matchSearch && t.isImpulsive
    return matchSearch && t.category.toLowerCase().includes(activeFilter.toLowerCase())
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-400 text-sm mt-0.5">Semua catatan pemasukan & pengeluaran kamu</p>
        </div>
        <button className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm">
          <Bell size={18} />
        </button>
      </div>

      {/* Stat cards */}
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

      {/* Search + period */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
        />
        {['Minggu ini', 'Bulan ini'].map(p => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
              activePeriod === p
                ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              activeFilter === f
                ? f === 'Implusif'
                  ? 'bg-red-500 border-red-500 text-white'
                  : 'bg-[#22c55e] border-[#22c55e] text-white'
                : f === 'Implusif'
                  ? 'border-red-200 text-red-500 hover:bg-red-50'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">April 2026</h2>
          <span className="text-sm text-gray-400">Menampilkan {filtered.length} dari {ALL_TRANSACTIONS.length} transaksi</span>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Keterangan</th>
              <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategori</th>
              <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
              <th className="text-right px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Jumlah</th>
              <th className="text-right px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(trx => (
              <tr key={trx.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-gray-800">{trx.description}</p>
                  <p className="text-xs text-gray-400">{trx.method}</p>
                </td>
                <td className="px-3 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[trx.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {trx.category}
                  </span>
                </td>
                <td className="px-3 py-4 text-gray-400 text-sm">{trx.date}</td>
                <td className={`px-3 py-4 text-right font-bold ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
                  {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                    edit / hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <span className="text-sm text-gray-400">Halaman 1 dari 6 halaman</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Sebelumnya
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}