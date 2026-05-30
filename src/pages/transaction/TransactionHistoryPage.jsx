import { useState } from 'react'
import {
  Search, ChevronLeft, ChevronRight, Pencil, Trash2,
  TrendingUp, TrendingDown, Wallet, X, Check, AlertTriangle,
} from 'lucide-react'
import { useGetTransactions, useUpdateTransaction, useDeleteTransaction } from '../../hooks/useTransactions'

const FILTERS = ['Semua', 'Pemasukan', 'Pengeluaran', 'Makanan', 'Transport', 'Hiburan', 'Tagihan', 'Kesehatan', 'Pendidikan', 'Lainnya', 'Implusif']

const EXPENSE_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Pendidikan', 'Kesehatan', 'Tagihan', 'Lain-lain']
const INCOME_CATEGORIES  = ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Lainnya']
const PAYMENT_METHODS    = ['Tunai', 'Gopay/E-wallet', 'Transfer Bank', 'Kartu Debit', 'Kartu Kredit']

const CATEGORY_COLORS = {
  Makanan:      'bg-orange-100 text-orange-700',
  Transportasi: 'bg-blue-100 text-blue-700',
  Hiburan:      'bg-pink-100 text-pink-700',
  Pemasukan:    'bg-green-100 text-green-700',
  Belanja:      'bg-purple-100 text-purple-700',
  Kesehatan:    'bg-red-100 text-red-700',
  Tagihan:      'bg-yellow-100 text-yellow-700',
  Pendidikan:   'bg-cyan-100 text-cyan-700',
  Investasi:    'bg-emerald-100 text-emerald-700',
  'Dana Darurat': 'bg-teal-100 text-teal-700',
  'Lain-lain':  'bg-gray-100 text-gray-600',
  'Lainnya':    'bg-gray-100 text-gray-600',
}

const formatRp = (n) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
}).format(n)

const PER_PAGE = 7

// ── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ trx, onSave, onClose }) {
  const [form, setForm] = useState({
    description:   trx.description,
    amount:        trx.amount,
    category:      trx.category,
    method:        trx.method,
    date:          trx.date,
    type:          trx.type,
  })

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#22c55e]/10 flex items-center justify-center">
              <Pencil size={15} className="text-[#22c55e]" />
            </div>
            <h2 className="font-black text-gray-900 text-base">Edit Transaksi</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
            <X size={17} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="px-5 py-4 space-y-4">
          {/* Tipe */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {['expense', 'income'].map(t => (
              <button key={t} onClick={() => setForm(p => ({ ...p, type: t, category: t === 'expense' ? 'Makanan' : 'Gaji' }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
                  ${form.type === t ? 'bg-[#22c55e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
              </button>
            ))}
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Keterangan</label>
            <input type="text" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10" />
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">Rp</span>
              <input type="number" value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: Number(e.target.value) }))}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10" />
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Kategori</label>
            <div className="grid grid-cols-4 gap-1.5">
              {categories.map(cat => (
                <button key={cat} onClick={() => setForm(p => ({ ...p, category: cat }))}
                  className={`py-1.5 px-1 rounded-lg text-[11px] font-medium border transition-all
                    ${form.category === cat
                      ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Metode + Tanggal */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Metode</label>
              <select value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] bg-white">
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tanggal</label>
              <input type="text" value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e]" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 sm:pb-5 pt-2 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={() => { onSave(form); onClose() }}
            className="flex-1 py-2.5 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] text-white text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
            <Check size={15} /> Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ trx, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-black text-gray-900">Hapus Transaksi?</h2>
            <p className="text-xs text-gray-400 mt-0.5">Tindakan ini tidak bisa dibatalkan</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-5">
          <p className="text-sm font-semibold text-gray-800">{trx.description}</p>
          <p className={`text-sm font-bold mt-0.5 ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
            {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{trx.date} · {trx.method}</p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
            Batal
          </button>
          <button onClick={() => { onConfirm(trx.id); onClose() }}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-1.5">
            <Trash2 size={14} /> Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TransactionHistoryPage() {
  const { data: rawTransactions = [] } = useGetTransactions()
  const { mutate: updateTrx } = useUpdateTransaction()
  const { mutate: deleteTrxMutation } = useDeleteTransaction()

  // Format transaksi agar sesuai dengan UI yang ada
  const transactions = rawTransactions.map(t => ({
    id: t.id,
    description: t.note || t.category,
    amount: t.amount,
    category: t.category,
    type: t.type.toLowerCase(),
    date: new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    method: 'Transfer', // Default method for now
    isImpulsive: false
  }))

  const [search, setSearch]           = useState('')
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [activePeriod, setActivePeriod] = useState('Bulan ini')
  const [page, setPage]               = useState(1)
  const [editTrx, setEditTrx]         = useState(null)
  const [deleteTrx, setDeleteTrx]     = useState(null)

  const filtered = transactions.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
    if (activeFilter === 'Semua')        return matchSearch
    if (activeFilter === 'Pemasukan')    return matchSearch && t.type === 'income'
    if (activeFilter === 'Pengeluaran')  return matchSearch && t.type === 'expense'
    if (activeFilter === 'Implusif')     return matchSearch && t.isImpulsive
    return matchSearch && t.category?.toLowerCase().includes(activeFilter.toLowerCase())
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const saldo        = totalIncome - totalExpense

  const FilterChips = () => (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {FILTERS.map(f => (
        <button key={f} onClick={() => { setActiveFilter(f); setPage(1) }}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
            ${activeFilter === f
              ? f === 'Implusif' ? 'bg-red-500 border-red-500 text-white' : 'bg-[#22c55e] border-[#22c55e] text-white'
              : f === 'Implusif' ? 'border-red-200 text-red-400 hover:bg-red-50' : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}>
          {f}
        </button>
      ))}
    </div>
  )

  const TrxRow = ({ trx, mobile = false }) => (
    mobile ? (
      // ── Mobile card ──
      <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/60 transition-colors">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${trx.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
          {trx.type === 'income'
            ? <TrendingUp size={16} className="text-green-600" />
            : <TrendingDown size={16} className="text-red-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-gray-800 truncate">{trx.description}</p>
            {trx.isImpulsive && (
              <span className="shrink-0 px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full">Impulsif</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[trx.category] ?? 'bg-gray-100 text-gray-600'}`}>
              {trx.category}
            </span>
            <span className="text-[11px] text-gray-400">{trx.date} · {trx.method}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-sm font-bold ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
            {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
          </span>
          <div className="flex gap-1.5">
            <button onClick={() => setEditTrx(trx)}
              className="w-7 h-7 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
              <Pencil size={12} className="text-blue-500" />
            </button>
            <button onClick={() => setDeleteTrx(trx)}
              className="w-7 h-7 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    ) : (
      // ── Desktop row ──
      <tr className="hover:bg-gray-50/60 transition-colors">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0
              ${trx.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              {trx.type === 'income'
                ? <TrendingUp size={14} className="text-green-600" />
                : <TrendingDown size={14} className="text-red-500" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800 text-sm">{trx.description}</p>
                {trx.isImpulsive && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full">Impulsif</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{trx.method}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[trx.category] ?? 'bg-gray-100 text-gray-600'}`}>
            {trx.category}
          </span>
        </td>
        <td className="px-5 py-4 text-sm text-gray-400">{trx.date}</td>
        <td className={`px-5 py-4 text-right font-bold text-sm ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
          {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setEditTrx(trx)}
              className="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
              title="Edit">
              <Pencil size={14} className="text-blue-500" />
            </button>
            <button onClick={() => setDeleteTrx(trx)}
              className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
              title="Hapus">
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </td>
      </tr>
    )
  )

  const Pagination = ({ mobile = false }) => (
    <div className={`flex items-center justify-between border-t border-gray-100 ${mobile ? 'px-4 py-3' : 'px-5 py-4'}`}>
      <span className={`text-gray-400 ${mobile ? 'text-xs' : 'text-sm'}`}>
        {mobile ? `Hal. ${page} dari ${totalPages}` : `Halaman ${page} dari ${totalPages} halaman · ${filtered.length} transaksi`}
      </span>
      <div className="flex gap-2">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
          className={`rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
            ${mobile ? 'w-8 h-8' : 'px-4 py-2 gap-1.5 text-sm text-gray-500'}`}>
          <ChevronLeft size={mobile ? 15 : 14} className="text-gray-500" />
          {!mobile && 'Sebelumnya'}
        </button>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
          className={`rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors
            ${mobile ? 'w-8 h-8' : 'px-4 py-2 gap-1.5 text-sm text-gray-500'}`}>
          {!mobile && 'Selanjutnya'}
          <ChevronRight size={mobile ? 15 : 14} className="text-gray-500" />
        </button>
      </div>
    </div>
  )

  return (
    <div>
      {/* ═══ DESKTOP ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:block p-6 space-y-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-400 text-sm mt-0.5">Semua catatan pemasukan & pengeluaran kamu</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Pemasukan', value: totalIncome,  sub: `${transactions.filter(t=>t.type==='income').length} Transaksi`,  subColor: 'text-[#22c55e]', border: 'border-l-[#22c55e]', icon: TrendingUp,   iconBg: 'bg-green-100',  iconColor: 'text-green-600' },
            { label: 'Total Pengeluaran', value: totalExpense, sub: `${transactions.filter(t=>t.type==='expense').length} Transaksi`, subColor: 'text-red-500',   border: 'border-l-red-500',  icon: TrendingDown, iconBg: 'bg-red-100',    iconColor: 'text-red-500'  },
            { label: 'Sisa Saldo',       value: saldo,        sub: saldo >= 0 ? 'Net Positif' : 'Net Negatif',                       subColor: saldo >= 0 ? 'text-[#22c55e]' : 'text-red-500', border: 'border-l-blue-500', icon: Wallet, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          ].map((s, i) => (
            <div key={i} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.border} p-5 shadow-sm flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">{s.label}</p>
                <p className="text-xl font-black text-gray-900">{formatRp(s.value)}</p>
                <p className={`text-xs font-semibold mt-0.5 ${s.subColor}`}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Period */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari transaksi..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300" />
          </div>
          {['Minggu ini', 'Bulan ini'].map(p => (
            <button key={p} onClick={() => setActivePeriod(p)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all
                ${activePeriod === p ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
              {p}
            </button>
          ))}
        </div>

        <FilterChips />

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Mei 2026</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {filtered.length} transaksi
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Keterangan', 'Kategori', 'Tanggal', 'Jumlah', 'Aksi'].map((h, i) => (
                    <th key={h} className={`py-3 px-5 text-[11px] font-bold text-gray-400 uppercase tracking-wider ${i >= 3 ? 'text-right' : 'text-left'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length > 0
                  ? paginated.map(trx => <TrxRow key={trx.id} trx={trx} />)
                  : (
                    <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                      Tidak ada transaksi ditemukan
                    </td></tr>
                  )
                }
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>

      {/* ═══ MOBILE ════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden px-4 py-4 pb-24 space-y-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">Riwayat Transaksi</h1>
          <p className="text-gray-400 text-sm">Semua catatan pemasukan & pengeluaran kamu</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-[#22c55e] p-3.5 shadow-sm">
            <p className="text-xs text-gray-400">Pemasukan</p>
            <p className="text-base font-black text-gray-900 mt-0.5">{formatRp(totalIncome)}</p>
            <p className="text-[10px] text-[#22c55e] font-semibold mt-0.5">{transactions.filter(t=>t.type==='income').length} Transaksi</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-red-500 p-3.5 shadow-sm">
            <p className="text-xs text-gray-400">Pengeluaran</p>
            <p className="text-base font-black text-gray-900 mt-0.5">{formatRp(totalExpense)}</p>
            <p className="text-[10px] text-red-500 font-semibold mt-0.5">{transactions.filter(t=>t.type==='expense').length} Transaksi</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-blue-500 p-3.5 shadow-sm col-span-2">
            <p className="text-xs text-gray-400">Sisa Saldo</p>
            <p className="text-lg font-black text-gray-900 mt-0.5">{formatRp(saldo)}</p>
            <p className={`text-[10px] font-semibold mt-0.5 ${saldo >= 0 ? 'text-[#22c55e]' : 'text-red-500'}`}>
              {saldo >= 0 ? 'Net Positif' : 'Net Negatif'}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Cari transaksi..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
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

        <FilterChips />

        {/* List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm">Mei 2026</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-medium">{filtered.length} transaksi</span>
          </div>
          <div className="divide-y divide-gray-50">
            {paginated.length > 0
              ? paginated.map(trx => <TrxRow key={trx.id} trx={trx} mobile />)
              : <p className="text-center py-10 text-gray-400 text-sm">Tidak ada transaksi ditemukan</p>
            }
          </div>
          <Pagination mobile />
        </div>
      </div>

      {/* ═══ MODALS ════════════════════════════════════════════════════════════ */}
      {editTrx && (
        <EditModal
          trx={editTrx}
          onSave={(updated) => updateTrx({
            id: editTrx.id,
            amount: updated.amount,
            type: updated.type.toUpperCase(),
            category: updated.category,
            description: updated.description
          })}
          onClose={() => setEditTrx(null)}
        />
      )}
      {deleteTrx && (
        <DeleteModal
          trx={deleteTrx}
          onConfirm={() => deleteTrxMutation(deleteTrx.id)}
          onClose={() => setDeleteTrx(null)}
        />
      )}
    </div>
  )
}