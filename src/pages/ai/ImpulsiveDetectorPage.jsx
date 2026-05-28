import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationContext'
import { useTransactionContext } from '../../context/TransactionContext'
import { Bell, CheckCircle } from 'lucide-react'

const CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan', 'Belanja', 'Pendidikan', 'Kesehatan', 'Tagihan', 'Lain-lain']

const RISK_LEVEL = {
  Tinggi:  'bg-red-100 text-red-600',
  Sedang:  'bg-yellow-100 text-yellow-600',
  Rendah:  'bg-green-100 text-green-600',
}

export default function ImpulsiveDetectorPage() {
  const [form, setForm] = useState({ description: '', amount: '', category: '', reason: '' })
  const [planned, setPlanned] = useState(null) // null | 'no' | 'yes'
  const [analyzed, setAnalyzed]   = useState(false)
  const [saved, setSaved]         = useState(false)
  const { addNotification }       = useNotifications()
  const { addTransaction } = useTransactionContext()
  const [isPending, setIsPending] = useState(false)
  const navigate                  = useNavigate()

  const handleAnalyze = () => {
    if (!form.description || !form.amount) return
    setAnalyzed(true)

    // Otomatis kirim hasil analisis ke notifikasi
    addNotification({
      id: `impulse_${form.description}_${form.amount}`,
      type: 'ai_impulse',
      title: `Transaksi "${form.description}" terdeteksi impulsif`,
      message: `Skor impulsif 65% — Pertimbangkan menunggu 3 hari sebelum membeli. Sisa budget belanjamu hanya Rp 150.000.`,
      source: 'Impulsive Detector',
    })
  }

  const handleCatat = () => {
    setIsPending(true)
    addTransaction({
      type:        'expense',
      description: form.description,
      amount:      Number(form.amount),
      category:    form.category || 'Lain-lain',
      method:      'Tunai',
      isImpulsive: planned === 'no',
    })
    setTimeout(() => {
      setIsPending(false)
      setSaved(true)
      addNotification({
        id:      `impulse_saved_${Date.now()}`,
        type:    'ai_impulse',
        title:   `Transaksi "${form.description}" berhasil dicatat`,
        message: `Rp ${Number(form.amount).toLocaleString('id-ID')} telah ditambahkan ke riwayat transaksi.`,
        source:  'Impulsive Detector',
      })
      setTimeout(() => navigate('/transactions'), 1500)
    }, 800)
  }

  return (
    <div className="px-4 py-4 lg:px-6 lg:py-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Implusive Detector</h1>
          <p className="text-gray-400 text-sm mt-0.5">Cek apakah pengeluaranmu termasuk implusive dengan analisis AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

        {/* Form kiri */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-gray-900 text-lg">Input Transaksi untuk di Analisis</h2>

          {/* Nama transaksi */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Nama / Keterangan Transaksi</label>
            <input
              type="text"
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
              placeholder="Contoh: Beli sepatu Nike..."
            />
          </div>

          {/* Jumlah + Kategori */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Jumlah (Rp)</label>
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1.5">Kategori</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 bg-white"
              >
                <option value="">Pilih kategori</option>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Alasan pembelian */}
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Alasan pembelian</label>
            <textarea
              rows={3}
              value={form.reason}
              onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300 resize-none"
              placeholder="Lihat di feed instagram tertarik karna sedang diskon 30%"
            />
          </div>

          {/* Sudah direncanakan? */}
          <div>
            <label className="block text-sm text-gray-500 mb-2">Apakah kamu sudah merencanakan ini sebelumnya?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlanned('no')}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  planned === 'no'
                    ? 'bg-red-50 border-red-300 text-red-500'
                    : 'border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'
                }`}
              >
                Tidak, spontan
              </button>
              <button
                onClick={() => setPlanned('yes')}
                className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                  planned === 'yes'
                    ? 'bg-green-50 border-[#22c55e] text-[#22c55e]'
                    : 'border-gray-200 text-gray-500 hover:border-green-200 hover:text-green-500'
                }`}
              >
                Ya, sudah plan
              </button>
            </div>
          </div>

          {/* Tombol analisis */}
          <button
            onClick={handleAnalyze}
            className="w-full py-4 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl transition-colors text-sm"
          >
            Analisis Sekarang
          </button>
        </div>

        {/* Panel kanan — hasil analisis */}
        <div className="space-y-4">

          {/* Hasil analisis AI */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-900 mb-4">Hasil Analisis AI</h2>
            <div className="flex items-center gap-4">
              {/* Donut score */}
              <div className="relative shrink-0" style={{ width: 80, height: 80 }}>
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0f0f0" strokeWidth="3.5" />
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke={analyzed ? '#f59e0b' : '#e5e7eb'} strokeWidth="3.5"
                    strokeDasharray={`${analyzed ? 65 : 0} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-black text-gray-900">{analyzed ? '65%' : '--'}</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">
                  {analyzed ? '65%' : '--'}{' '}
                  <span className="text-sm font-medium text-gray-400">Skor implusif</span>
                </p>
                {analyzed && (
                  <>
                    <p className="text-yellow-500 font-bold text-sm mt-0.5">PERLU PERTIMBANGAN</p>
                    <p className="text-xs text-gray-400 mt-1">Transaksi ini memiliki indikasi implusif yang cukup tinggi</p>
                  </>
                )}
                {!analyzed && (
                  <p className="text-gray-400 text-sm">Isi form dan klik analisis</p>
                )}
              </div>
            </div>
          </div>

          {/* Faktor resiko */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Faktor Resiko</h2>
            <div className="space-y-3">
              {[
                { label: 'Pembelian tidak terencana', level: 'Tinggi' },
                { label: 'Dipicu media sosial', level: 'Sedang' },
                { label: 'Jumlah vs budget tersedia', level: 'Sedang' },
                { label: 'Urgensi kebutuhan', level: 'Rendah' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{r.label}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${RISK_LEVEL[r.level]}`}>
                    {r.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Saran AI */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
              <span className="font-bold text-sm text-yellow-500 uppercase tracking-wide">Saran AI</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Pertimbangkan menunggu hingga sebelum membeli. Jika merasa perlu setelah 3 hari, pembelian ini kemungkinan bukan implusif.
              Saat ini sisa budget belanja kamu hanya <strong>Rp 150.000</strong>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAnalyzed(false)}
                className="py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              {saved ? (
                <div className="py-3 rounded-xl bg-green-50 border border-[#22c55e] text-[#22c55e] text-sm font-bold flex items-center justify-center gap-2">
                  <CheckCircle size={15} /> Tersimpan!
                </div>
              ) : (
                <button
                  onClick={handleCatat}
                  disabled={isPending}
                  className="py-3 rounded-xl bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  {isPending && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  Catat Transaksi
                </button>
              )}
            </div>
          </div>

          {/* Riwayat implusif bulan ini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Riwayat Implusif Bulan Ini</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-3xl font-black text-red-500">3</p>
                <p className="text-xs text-gray-400 mt-1">Implusif</p>
              </div>
              <div>
                <p className="text-3xl font-black text-yellow-500">5</p>
                <p className="text-xs text-gray-400 mt-1">Perlu perhatian</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#22c55e]">40</p>
                <p className="text-xs text-gray-400 mt-1">Aman</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}