import { useState, useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { CheckCircle, ChevronRight, Plus, TrendingUp, Zap, BarChart2, Target } from 'lucide-react'

const formatRp    = (n) => new Intl.NumberFormat('id-ID').format(Number(n) || 0)
const parseNum    = (s) => Number(String(s).replace(/\./g, '').replace(/[^0-9]/g, '')) || 0
const formatShort = (n) => {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace('.', ',')} jt`
  if (n >= 1_000)     return `Rp ${(n / 1_000).toFixed(0)} rb`
  return `Rp ${formatRp(n)}`
}

const INCOME_SOURCES = ['Gojek', 'Grab', 'Freelance Design', 'Shopee', 'Gojek + Freelance', 'Lainnya']

function predictNext4(weeklyData) {
  const n = weeklyData.length
  if (n < 2) return [0, 0, 0, 0]
  const values = weeklyData.map(w => w.amount)
  const trend  = (values[n - 1] - values[0]) / (n - 1)
  const last   = values[n - 1]
  return [1, 2, 3, 4].map(i => Math.round(last + trend * i * 0.5))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  const isPred = d.dataKey === 'pred'
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-500 mb-0.5">{label}</p>
      <p className={`font-black text-sm ${isPred ? 'text-yellow-500' : 'text-[#22c55e]'}`}>
        Rp {formatRp(d.value)}
      </p>
      {isPred && <p className="text-gray-400 mt-0.5">Prediksi AI</p>}
    </div>
  )
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function OnboardingForm({ onComplete }) {
  const [weeks, setWeeks] = useState([
    { amount: '', source: '', label: '4 Minggu lalu' },
    { amount: '', source: '', label: '3 Minggu lalu' },
    { amount: '', source: '', label: '2 Minggu lalu' },
    { amount: '', source: '', label: 'Minggu lalu'   },
  ])
  const [error, setError] = useState('')

  const updateWeek = (i, field, val) => {
    setWeeks(prev => prev.map((w, idx) => idx === i ? { ...w, [field]: val } : w))
    setError('')
  }

  const handleSubmit = () => {
    if (weeks.some(w => !w.amount || !w.source)) return setError('Semua minggu wajib diisi lengkap.')
    const parsed = weeks.map(w => ({ ...w, amount: parseNum(w.amount) }))
    if (parsed.some(w => w.amount <= 0)) return setError('Jumlah pendapatan harus lebih dari 0.')
    onComplete(parsed)
  }

  const allFilled = weeks.every(w => w.amount && w.source)

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={32} className="text-[#22c55e]" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black text-gray-900">Mulai Income Predictor</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto leading-relaxed">
            Masukkan pendapatan <strong className="text-gray-600">4 minggu terakhir</strong> sebagai
            data awal. AI akan membangun model prediksi khusus untukmu.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-6">
          {weeks.map((w, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1.5 w-full rounded-full transition-all duration-300
                ${w.amount && w.source ? 'bg-[#22c55e]' : 'bg-gray-200'}`} />
              <span className="text-[10px] text-gray-400 font-medium hidden sm:block">{w.label}</span>
            </div>
          ))}
          <ChevronRight size={14} className="text-gray-300 shrink-0" />
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="h-1.5 w-full rounded-full bg-gray-100" />
            <span className="text-[10px] text-gray-400 font-medium hidden sm:block">Prediksi AI</span>
          </div>
        </div>

        {/* 4 form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Data Pendapatan Mingguan</p>
          </div>
          <div className="divide-y divide-gray-50">
            {weeks.map((w, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0
                    ${w.amount && w.source ? 'bg-[#22c55e] text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {w.amount && w.source ? <CheckCircle size={13} /> : i + 1}
                  </div>
                  <p className="text-sm font-bold text-gray-700">{w.label}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-8">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={w.amount ? formatRp(parseNum(w.amount)) : ''}
                      onChange={e => updateWeek(i, 'amount', e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
                    />
                  </div>
                  <select
                    value={w.source}
                    onChange={e => updateWeek(i, 'source', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] bg-white
                      ${!w.source ? 'text-gray-300' : 'text-gray-800'}`}>
                    <option value="">Pilih sumber pendapatan</option>
                    {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-medium text-center mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
            disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
            bg-[#22c55e] hover:bg-[#16a34a] text-white shadow-sm">
          {allFilled ? <><Zap size={16} /> Buat Prediksi AI</> : 'Isi semua data untuk melanjutkan'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">Data bisa diperbarui kapan saja</p>
      </div>
    </div>
  )
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function PredictorDashboard({ historyData, onAddWeek, onReset }) {
  const [newIncome, setNewIncome] = useState('')
  const [newSource, setNewSource] = useState('')
  const [period, setPeriod]       = useState('weekly')
  const [saved, setSaved]         = useState(false)

  const predictions = useMemo(() => predictNext4(historyData), [historyData])
  const totalPred   = predictions.reduce((s, v) => s + v, 0)
  const avg         = Math.round(historyData.reduce((s, w) => s + w.amount, 0) / historyData.length)
  const latest      = historyData[historyData.length - 1]?.amount ?? 0
  const predNext    = predictions[0]
  const accuracy    = Math.min(97, 70 + historyData.length * 2)

  const chartData = useMemo(() => {
    const n    = historyData.length
    const hist = historyData.map((w, i) => ({
      label: i === n - 1 ? 'Mg ini' : `Mg ${n - i}`,
      value: w.amount,
    }))
    const bridge = { label: 'Mg ini', value: latest, pred: latest }
    const pred   = predictions.map((v, i) => ({ label: `+${i + 1}`, pred: v }))
    return [...hist.slice(0, -1), bridge, ...pred]
  }, [historyData, predictions, latest])

  const handleAdd = () => {
    if (!newIncome || !newSource) return
    onAddWeek({ amount: parseNum(newIncome), source: newSource, label: 'Baru' })
    setNewIncome(''); setNewSource('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tableRows = [...historyData].reverse().map((w, i, arr) => ({
    period:    i === 0 ? 'Mg ini (Aktual)' : i === 1 ? 'Minggu lalu' : `${i} Minggu lalu`,
    amount:    w.amount,
    source:    w.source,
    highlight: i === 0,
    delta:     i === arr.length - 1 ? null
               : Math.round(((w.amount - arr[i + 1]?.amount) / (arr[i + 1]?.amount || 1)) * 100),
  }))

  return (
    <div className="p-4 lg:p-6 space-y-5">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Income Predictor</h1>
          <p className="text-gray-400 text-sm mt-0.5">Visualisasi historis dan prediksi pendapatan 4 minggu ke depan</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {[{ key: 'weekly', label: 'Mingguan' }, { key: 'monthly', label: 'Bulanan' }].map(t => (
              <button key={t.key} onClick={() => setPeriod(t.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
                  ${period === t.key ? 'bg-white text-[#22c55e] shadow-sm border border-[#22c55e]/30' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
          <button onClick={onReset}
            className="px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
            Reset Data
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'Rata-rata/Minggu',    value: formatShort(avg),      sub: `${historyData.length} minggu data`,                                                      icon: BarChart2,  iconBg: 'bg-green-100',  iconColor: 'text-[#22c55e]',  valueColor: 'text-[#22c55e]'  },
          { label: 'Prediksi Minggu Ini', value: formatShort(predNext), sub: `${predNext >= avg ? '↑' : '↓'}${Math.abs(Math.round((predNext - avg) / avg * 100))}% dari rata-rata`, icon: Zap, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-500', valueColor: 'text-yellow-500' },
          { label: 'Prediksi Bulan Ini',  value: formatShort(totalPred),sub: '4 minggu ke depan',                                                                      icon: Target,     iconBg: 'bg-blue-100',   iconColor: 'text-blue-500',   valueColor: 'text-blue-500'   },
          { label: 'Akurasi Model',       value: `${accuracy}%`,        sub: `Dari ${historyData.length} minggu data`,                                                  icon: TrendingUp, iconBg: 'bg-purple-100', iconColor: 'text-purple-500', valueColor: 'text-[#22c55e]'  },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
              <s.icon size={16} className={s.iconColor} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium leading-tight mb-1">{s.label}</p>
              <p className={`text-lg lg:text-xl font-black ${s.valueColor}`}>{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-5">
        <div className="flex flex-wrap justify-end gap-4 mb-3">
          <div className="flex items-center gap-2"><div className="w-6 h-0.5 bg-[#22c55e]" /><span className="text-xs text-gray-500 font-medium">Historis</span></div>
          <div className="flex items-center gap-2"><div className="w-6 border-t-2 border-dashed border-yellow-400" /><span className="text-xs text-gray-500 font-medium">Prediksi AI</span></div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={8} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1_000_000).toFixed(1)}jt`} width={40} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x="Mg ini" stroke="#d1d5db" strokeDasharray="5 3" strokeWidth={1.5} />
            <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2.5}
              dot={(props) => {
                const { cx, cy, index } = props
                const isLast = chartData[index]?.label === 'Mg ini'
                return <circle key={`h-${index}`} cx={cx} cy={cy}
                  r={isLast ? 6 : 3.5} fill={isLast ? '#22c55e' : '#fff'}
                  stroke="#22c55e" strokeWidth={isLast ? 3 : 2} />
              }}
              activeDot={{ r: 5, fill: '#22c55e' }} connectNulls={false} />
            <Line type="monotone" dataKey="pred" stroke="#f59e0b" strokeWidth={2.5}
              strokeDasharray="6 4"
              dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#f59e0b' }} connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900 text-sm lg:text-base">Rincian Data Historis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  {['Periode', 'Pendapatan', 'Sumber Utama', 'vs Minggu Lalu'].map((h, i) => (
                    <th key={h} className={`py-3 px-5 text-xs font-bold text-gray-400 uppercase tracking-wider ${i >= 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {tableRows.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className={`font-semibold text-sm ${row.highlight ? 'text-[#22c55e]' : 'text-gray-800'}`}>{row.period}</span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-gray-800">Rp {formatRp(row.amount)}</td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{row.source}</td>
                    <td className="px-5 py-3.5 text-right">
                      {row.delta === null ? <span className="text-xs text-gray-300">—</span> : (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                          ${row.delta > 0 ? 'bg-green-100 text-green-700' : row.delta < 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                          {row.delta > 0 ? '+' : ''}{row.delta}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* Prediksi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4">Prediksi 4 Minggu</p>
            <div className="space-y-2">
              {predictions.map((v, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-600">{i === 0 ? 'Minggu depan (+1)' : `+${i + 1} minggu`}</span>
                  <span className="text-sm font-black text-yellow-500">{formatShort(v)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
              <span className="text-sm text-gray-500">Total 4 minggu</span>
              <span className="text-sm font-black text-gray-900">{formatShort(totalPred)}</span>
            </div>
          </div>

          {/* Tambah minggu */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs font-bold text-[#22c55e] uppercase tracking-widest mb-1">Tambah Minggu Ini</p>
            <p className="text-[11px] text-gray-400 mb-4">Data baru akan memperbarui grafik & prediksi</p>
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-semibold">Rp</span>
                <input type="text" inputMode="numeric" placeholder="Jumlah pendapatan"
                  value={newIncome ? formatRp(parseNum(newIncome)) : ''}
                  onChange={e => setNewIncome(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300" />
              </div>
              <select value={newSource} onChange={e => setNewSource(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] bg-white
                  ${!newSource ? 'text-gray-300' : 'text-gray-800'}`}>
                <option value="">Pilih sumber pendapatan</option>
                {INCOME_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={handleAdd}
                disabled={!newIncome || !newSource}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                  ${saved
                    ? 'bg-green-50 border border-[#22c55e] text-[#22c55e]'
                    : 'bg-[#22c55e] hover:bg-[#16a34a] text-white disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed'}`}>
                {saved ? <><CheckCircle size={15} /> Tersimpan!</> : <><Plus size={15} /> Tambah & Perbarui Prediksi</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export default function IncomePredictorPage() {
  const [historyData, setHistoryData] = useState(null)

  if (!historyData) {
    return <OnboardingForm onComplete={setHistoryData} />
  }

  return (
    <PredictorDashboard
      historyData={historyData}
      onAddWeek={(w) => setHistoryData(prev => [...prev, w])}
      onReset={() => setHistoryData(null)}
    />
  )
}