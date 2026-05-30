import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bell, ChevronRight, ArrowUpCircle, ArrowDownCircle, CheckCircle,
} from 'lucide-react'
import { useGetTransactions, useAddTransaction, useGetTransactionSummary } from '../../hooks/useTransactions'

const EXPENSE_CATEGORIES = [
  'Makanan',
  'Transportasi',
  'Hiburan',
  'Belanja',
  'Pendidikan',
  'Kesehatan',
  'Tagihan',
  'Lain-lain',
]

const INCOME_CATEGORIES = [
  'Gaji',
  'Freelance',
  'Investasi',
  'Bonus',
  'Lainnya',
]

const PAYMENT_METHODS = [
  'Tunai',
  'Gopay/E-wallet',
  'Transfer Bank',
  'Kartu Debit',
  'Kartu Kredit',
]

const formatRp = n =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n)

/* =========================
   FORM CONTENT
========================= */
function FormContent({
  type,
  setType,
  selectedCategory,
  setSelectedCategory,
  form,
  setForm,
  categories,
  onSimpan,
  saved,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
      <h2 className="font-bold text-gray-900 text-lg">
        Input Transaksi Baru
      </h2>

      {/* Toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {['expense', 'income'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t)
              setSelectedCategory(t === 'expense' ? 'Makanan' : 'Gaji')
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${
                type === t
                  ? 'bg-[#22c55e] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
          </button>
        ))}
      </div>

      {/* Kategori */}
      <div>
        <label className="block text-sm text-gray-500 mb-2">
          Pilih Kategori
        </label>

        <div className="grid grid-cols-4 gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`py-2 px-1 rounded-xl text-xs font-medium border transition-all
                ${
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
        <label className="block text-sm text-gray-500 mb-1.5">
          Keterangan
        </label>

        <input
          type="text"
          placeholder="Contoh: Makan siang..."
          value={form.description}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              description: e.target.value,
            }))
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
        />
      </div>

      {/* Jumlah */}
      <div>
        <label className="block text-sm text-gray-500 mb-1.5">
          Jumlah (Rp)
        </label>

        <input
          type="number"
          placeholder="0"
          value={form.amount}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              amount: e.target.value,
            }))
          }
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
        />
      </div>

      {/* Tanggal + Metode */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-500 mb-1.5">
            Tanggal
          </label>

          <input
            type="text"
            value={form.date}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                date: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1.5">
            Metode Bayar
          </label>

          <select
            value={form.paymentMethod}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                paymentMethod: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] bg-white"
          >
            {PAYMENT_METHODS.map(method => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onSimpan}
          className={`flex-1 py-3.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2
            ${saved
              ? 'bg-green-50 border border-[#22c55e] text-[#22c55e]'
              : 'bg-[#22c55e] hover:bg-[#16a34a] text-white'
            }`}
        >
          {saved ? <><CheckCircle size={16} /> Tersimpan!</> : 'Simpan'}
        </button>
      </div>
    </div>
  )
}

/* =========================
   SUMMARY PANEL
========================= */
function SummaryPanel({ todayTransactions, summary }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-[#22c55e] font-medium mb-1">
            Total Pemasukan
          </p>

          <p className="text-xl font-black text-gray-900">
            {formatRp(summary?.totalIncome || 0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-red-500 font-medium mb-1">
            Total Pengeluaran
          </p>

          <p className="text-xl font-black text-gray-900">
            {formatRp(summary?.totalExpense || 0)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-sm">Hari ini</h3>

          <Link
            to="/transactions"
            className="text-xs text-[#22c55e] font-semibold flex items-center gap-0.5 hover:underline"
          >
            Lihat Semua <ChevronRight size={12} />
          </Link>
        </div>

        <div className="space-y-3">
          {todayTransactions.map(trx => (
            <div
              key={trx.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                    ${
                      trx.type === 'income'
                        ? 'bg-green-100'
                        : 'bg-red-100'
                    }`}
                >
                  {trx.type === 'income' ? (
                    <ArrowUpCircle
                      size={14}
                      className="text-green-600"
                    />
                  ) : (
                    <ArrowDownCircle
                      size={14}
                      className="text-red-500"
                    />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {trx.description}
                  </p>

                  <p className="text-xs text-gray-400">
                    {trx.time} · {trx.method}
                  </p>
                </div>
              </div>

              <span
                className={`text-sm font-bold ${
                  trx.type === 'income'
                    ? 'text-[#22c55e]'
                    : 'text-red-500'
                }`}
              >
                {trx.type === 'income' ? '+' : '-'}
                {formatRp(trx.amount)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 text-xs">
          <span className="text-[#22c55e] font-semibold">
            Pemasukan : +{formatRp(summary?.totalIncome || 0)}
          </span>

          <span className="text-red-500 font-semibold">
            Pengeluaran : -{formatRp(summary?.totalExpense || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* =========================
   MAIN PAGE
========================= */
export default function AddTransactionPage() {
  const navigate = useNavigate()
  const [type, setType]                 = useState('expense')
  const [selectedCategory, setSelectedCategory] = useState('Makanan')
  const [saved, setSaved]               = useState(false)
  const [form, setForm]                 = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Gopay/E-wallet',
  })

  const { data: rawTransactions = [] } = useGetTransactions()
  const { data: summary } = useGetTransactionSummary()
  const { mutate: addTransaction } = useAddTransaction()

  // Ambil transaksi hari ini dari server
  const todayLabel = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  const TODAY_TRANSACTIONS = rawTransactions
    .filter(t => new Date(t.date).toDateString() === new Date().toDateString())
    .map(t => ({
      id: t.id,
      description: t.note || t.category,
      amount: t.amount,
      category: t.category,
      type: t.type.toLowerCase(),
      time: new Date(t.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      method: 'Transfer'
    }))

  const handleSimpan = () => {
    if (!form.description || !form.amount) return
    addTransaction({
      type: type.toUpperCase(),
      description: form.description,
      amount:      Number(form.amount),
      category:    selectedCategory,
      method:      form.paymentMethod,
      date:        form.date,
    })
    setSaved(true)
    setForm({ description: '', amount: '', date: new Date().toISOString().split('T')[0], paymentMethod: 'Gopay/E-wallet' })
    setSelectedCategory(type === 'expense' ? 'Makanan' : 'Gaji')
    setTimeout(() => setSaved(false), 2000)
  }

  const categories =
    type === 'expense'
      ? EXPENSE_CATEGORIES
      : INCOME_CATEGORIES

  return (
    <div>
      {/* DESKTOP */}
      <div className="hidden lg:block p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Catat Transaksi
            </h1>

            <p className="text-gray-400 text-sm mt-0.5">
              Input pemasukan & pengeluaran dengan mudah
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6">
          <FormContent
            type={type}
            setType={setType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            form={form}
            setForm={setForm}
            categories={categories}
            onSimpan={handleSimpan}
            saved={saved}
          />

          <SummaryPanel
            todayTransactions={TODAY_TRANSACTIONS}
            summary={summary}
          />
        </div>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden px-4 py-4 pb-24 space-y-4">
        <div>
          <h1 className="text-xl font-black text-gray-900">
            Catat Transaksi
          </h1>

          <p className="text-gray-400 text-sm">
            Input pemasukan & pengeluaran dengan mudah
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-[#22c55e] p-3.5 shadow-sm">
            <p className="text-xs text-gray-400">
              Total Pemasukan
            </p>

            <p className="text-base font-black text-gray-900 mt-0.5">
              {formatRp(summary?.totalIncome || 0)}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-red-500 p-3.5 shadow-sm">
            <p className="text-xs text-gray-400">
              Total Pengeluaran
            </p>

            <p className="text-base font-black text-gray-900 mt-0.5">
              {formatRp(summary?.totalExpense || 0)}
            </p>
          </div>
        </div>

        {/* Form */}
        <FormContent
            type={type}
            setType={setType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            form={form}
            setForm={setForm}
            categories={categories}
            onSimpan={handleSimpan}
            saved={saved}
          />

        {/* Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-sm">
              Hari ini
            </h3>

            <Link
              to="/transactions"
              className="text-xs text-[#22c55e] font-semibold flex items-center gap-0.5"
            >
              Lihat Semua <ChevronRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {TODAY_TRANSACTIONS.map(trx => (
              <div
                key={trx.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                      ${
                        trx.type === 'income'
                          ? 'bg-green-100'
                          : 'bg-red-100'
                      }`}
                  >
                    {trx.type === 'income' ? (
                      <ArrowUpCircle
                        size={14}
                        className="text-green-600"
                      />
                    ) : (
                      <ArrowDownCircle
                        size={14}
                        className="text-red-500"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {trx.description}
                    </p>

                    <p className="text-xs text-gray-400">
                      {trx.time} · {trx.method}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-sm font-bold ${
                    trx.type === 'income'
                      ? 'text-[#22c55e]'
                      : 'text-red-500'
                  }`}
                >
                  {trx.type === 'income' ? '+' : '-'}
                  {formatRp(trx.amount)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-xs">
            <span className="text-[#22c55e] font-semibold">
              +{formatRp(summary?.totalIncome || 0)}
            </span>

            <span className="text-red-500 font-semibold">
              -{formatRp(summary?.totalExpense || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}