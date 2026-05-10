import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'

const EXPENSE_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Pendidikan', 'Kesehatan', 'Tagihan', 'Lain-lain']
const INCOME_CATEGORIES = ['Gaji', 'Freelance', 'Investasi', 'Bonus', 'Lainnya']
const PAYMENT_METHODS = ['Tunai', 'Gopay/E-wallet', 'Transfer Bank', 'Kartu Debit', 'Kartu Kredit']

// Data dummy transaksi hari ini
const TODAY_TRANSACTIONS = [
  { id: 1, description: 'Kopi & sarapan', time: '09:15', method: 'GoPay', amount: 32000, type: 'expense' },
  { id: 2, description: 'Gojek', time: '09:15', method: 'GoPay', amount: 18000, type: 'expense' },
  { id: 3, description: 'Pembayaran desain', time: '09:15', method: 'GoPay', amount: 750000, type: 'income' },
]

export default function AddTransactionPage() {
  const [type, setType] = useState('expense')
  const [selectedCategory, setSelectedCategory] = useState('Makanan')
  const [form, setForm] = useState({
    description: '', amount: '', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('/'), paymentMethod: 'Gopay/E-wallet'
  })

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const totalIncome = TODAY_TRANSACTIONS.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = TODAY_TRANSACTIONS.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Catat Transaksi</h1>
          <p className="text-gray-400 text-sm mt-0.5">Input pemasukan & pengeluaran dengan mudah</p>
        </div>
        <button className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 shadow-sm">
          <Bell size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
        {/* Form kiri */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Input Transaksi Baru</h2>

          {/* Toggle Pengeluaran / Pemasukan */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => { setType('expense'); setSelectedCategory('Makanan') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${type === 'expense' ? 'bg-[#22c55e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => { setType('income'); setSelectedCategory('Gaji') }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${type === 'income' ? 'bg-[#22c55e] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pemasukan
            </button>
          </div>

          {/* Pilih Kategori */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">Pilih Kategori</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all ${
                    selectedCategory === cat
                      ? 'border-[#22c55e] bg-[#22c55e]/10 text-[#22c55e]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Keterangan */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Keterangan</label>
            <input
              type="text"
              placeholder="Contoh: Makan siang, Gaji freelance..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
            />
          </div>

          {/* Jumlah */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Jumlah (Rp)</label>
            <input
              type="number"
              placeholder="0"
              value={form.amount}
              onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
            />
          </div>

          {/* Tanggal + Metode Bayar */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Tanggal</label>
              <input
                type="text"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Metode Bayar</label>
              <select
                value={form.paymentMethod}
                onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 bg-white"
              >
                {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button className="flex-1 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl transition-colors">
              Simpan
            </button>
            <button className="px-5 py-3.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cek implusif
            </button>
          </div>
        </div>

        {/* Panel kanan — ringkasan hari ini */}
        <div className="space-y-4">
          {/* Total cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-[#22c55e] font-medium mb-1">Total Pemasukan</p>
              <p className="text-2xl font-black text-gray-900">{formatRp(4200000)}</p>
              <p className="text-xs text-[#22c55e] font-medium mt-1">12 Transaksi</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-red-500 font-medium mb-1">Total Pengeluaran</p>
              <p className="text-2xl font-black text-gray-900">{formatRp(1750000)}</p>
              <p className="text-xs text-red-500 font-medium mt-1">36 Transaksi</p>
            </div>
          </div>

          {/* Transaksi hari ini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">
                Hari ini, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h3>
              <Link to="/transactions" className="text-sm text-[#22c55e] font-semibold hover:underline">
                Lihat Semua →
              </Link>
            </div>

            <div className="space-y-3">
              {TODAY_TRANSACTIONS.map(trx => (
                <div key={trx.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">• {trx.description}</p>
                    <p className="text-xs text-gray-400">{trx.time} · {trx.method}</p>
                  </div>
                  <span className={`text-sm font-bold ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
                    {trx.type === 'income' ? '+' : '-'}{formatRp(trx.amount)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
              <span className="text-[#22c55e] font-semibold">Pemasukan : +{formatRp(totalIncome)}</span>
              <span className="text-red-500 font-semibold">Pengeluaran : -{formatRp(totalExpense)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}