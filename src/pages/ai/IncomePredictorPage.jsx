import { useState } from 'react'
import { Bell } from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

const formatRp = (n) =>
  new Intl.NumberFormat('id-ID').format(Number(n) || 0)

const WEEKLY_DATA = [
  { label: 'Mg 12', value: 750000 },
  { label: 'Mg 11', value: 820000 },
  { label: 'Mg 10', value: 680000 },
  { label: 'Mg 9', value: 900000 },
  { label: 'Mg 8', value: 870000 },
  { label: 'Mg 7', value: 950000 },
  { label: 'Mg 6', value: 980000 },
  { label: 'Mg 5', value: 1020000 },
  { label: 'Mg 4', value: 850000 },
  { label: 'Mg 3', value: 1120000 },
  { label: 'Mg 2', value: 980000 },
  { label: 'Mg 1', value: 1050000 },
  { label: '+1', pred: 1100000 },
  { label: '+2', pred: 1150000 },
  { label: '+3', pred: 1200000 },
  { label: '+4', pred: 1250000 },
]

const MONTHLY_DATA = [
  { label: 'Bln 6', value: 3200000 },
  { label: 'Bln 5', value: 3800000 },
  { label: 'Bln 4', value: 3500000 },
  { label: 'Bln 3', value: 4100000 },
  { label: 'Bln 2', value: 3900000 },
  { label: 'Bln 1', value: 4200000 },
  { label: '+1', pred: 4400000 },
  { label: '+2', pred: 4600000 },
]

const HISTORY_TABLE = [
  {
    period: 'Mg ini (Aktual)',
    amount: 1050000,
    source: 'Gojek + Freelance',
    vsPred: 7,
    highlight: true,
  },
  {
    period: 'Minggu lalu',
    amount: 980000,
    source: 'Gojek',
    vsPred: 2,
  },
  {
    period: '2 Minggu lalu',
    amount: 1120000,
    source: 'Freelance Design',
    vsPred: -3,
  },
  {
    period: '3 Minggu lalu',
    amount: 850000,
    source: 'Gojek',
    vsPred: -13,
  },
  {
    period: '4 Minggu lalu',
    amount: 1030000,
    source: 'Gojek + Bonus',
    vsPred: 5,
  },
]

const INCOME_SOURCES = [
  'Gojek',
  'Grab',
  'Freelance Design',
  'Shopee',
  'Gojek + Freelance',
  'Lainnya',
]

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null

  const d = payload[0]
  const isPred = d.dataKey === 'pred'

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-semibold text-gray-500 mb-0.5">
        {label}
      </p>

      <p
        className={`font-black text-sm ${
          isPred
            ? 'text-yellow-500'
            : 'text-[#22c55e]'
        }`}
      >
        Rp {formatRp(d.value)}
      </p>

      {isPred && (
        <p className="text-gray-400 mt-0.5">
          Prediksi AI
        </p>
      )}
    </div>
  )
}

export default function IncomePredictorPage() {
  const [period, setPeriod] =
    useState('weekly')

  const [newIncome, setNewIncome] =
    useState('')

  const [newSource, setNewSource] =
    useState('')

  const data =
    period === 'weekly'
      ? WEEKLY_DATA
      : MONTHLY_DATA

  const splitIndex =
    data.findIndex(d => d.pred !== undefined) -
    1

  const splitLabel =
    data[splitIndex]?.label ?? 'Mg 1'

  return (
    <div className="p-4 lg:p-6 space-y-5">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Income Predictor
          </h1>

          <p className="text-gray-400 text-sm mt-0.5">
            Visualisasi historis dan periksa
            pendapatan 4 minggu ke depan
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">

          {/* Toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-full sm:w-auto">
            {[
              {
                key: 'weekly',
                label: 'Mingguan',
              },
              {
                key: 'monthly',
                label: 'Bulanan',
              },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setPeriod(t.key)}
                className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  period === t.key
                    ? 'bg-white text-[#22c55e] shadow-sm border border-[#22c55e]/30'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Rata-rata minggu ini',
            value: 'Rp 980 rb',
            sub: '12 minggu terakhir',
            valueColor: 'text-[#22c55e]',
          },
          {
            label: 'Prediksi minggu ini',
            value: 'Rp 1.1 jt',
            sub: '↑+12% dari rata-rata',
            valueColor: 'text-yellow-500',
          },
          {
            label: 'Prediksi bulan ini',
            value: 'Rp 4.4 jt',
            sub: '↑Lebih baik dari biasanya',
            valueColor: 'text-blue-500',
          },
          {
            label: 'Akurasi model',
            value: '87%',
            sub: 'Berdasarkan 12 minggu data',
            valueColor: 'text-[#22c55e]',
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
          >
            <p className="text-xs text-gray-500 font-medium leading-tight mb-1">
              {s.label}
            </p>

            <p
              className={`text-xl lg:text-2xl font-black ${s.valueColor}`}
            >
              {s.value}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 lg:p-5">

        {/* Legend */}
        <div className="flex flex-wrap justify-end gap-4 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-[#22c55e]" />

            <span className="text-xs text-gray-500 font-medium">
              Historis
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-6 border-t-2 border-dashed border-yellow-400" />

            <span className="text-xs text-gray-500 font-medium">
              Prediksi AI
            </span>
          </div>
        </div>

        <div className="w-full">
          <ResponsiveContainer
            width="100%"
            height={320}
          >
            <LineChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f3f4f6"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 11,
                  fill: '#9ca3af',
                }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />

              <YAxis
                tick={{
                  fontSize: 10,
                  fill: '#9ca3af',
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v =>
                  `${(
                    v / 1000000
                  ).toFixed(1)}jt`
                }
                width={40}
                domain={['auto', 'auto']}
              />

              <Tooltip
                content={<CustomTooltip />}
              />

              <ReferenceLine
                x={splitLabel}
                stroke="#d1d5db"
                strokeDasharray="5 3"
                strokeWidth={1.5}
              />

              {/* Historis */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2.5}
                legendType="none"
                dot={(props) => {
                  const {
                    cx,
                    cy,
                    index,
                  } = props

                  const isLast =
                    data[index]?.label ===
                    splitLabel

                  return (
                    <circle
                      key={`dot-h-${index}`}
                      cx={cx}
                      cy={cy}
                      r={isLast ? 6 : 3.5}
                      fill={
                        isLast
                          ? '#22c55e'
                          : '#fff'
                      }
                      stroke="#22c55e"
                      strokeWidth={
                        isLast ? 3 : 2
                      }
                    />
                  )
                }}
                activeDot={{
                  r: 5,
                  fill: '#22c55e',
                }}
                connectNulls={false}
              />

              {/* Prediksi */}
              <Line
                type="monotone"
                dataKey="pred"
                stroke="#f59e0b"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                legendType="none"
                dot={{
                  r: 4,
                  fill: '#f59e0b',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 5,
                  fill: '#f59e0b',
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-5">

        {/* TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-4 lg:px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">
              Rincian Data Historis
            </h2>
          </div>

          {/* MOBILE ONLY SCROLL */}
          <div className="overflow-x-auto lg:overflow-visible">

            <table className="w-full lg:min-w-0 min-w-[720px] text-sm">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">

                  <th className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Periode
                  </th>

                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Pendapatan
                  </th>

                  <th className="text-left px-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Sumber Utama
                  </th>

                  <th className="text-right px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    VS Prediksi
                  </th>

                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">

                {HISTORY_TABLE.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50/60 transition-colors"
                  >

                    <td className="px-6 py-3.5">
                      <span
                        className={`font-semibold text-sm ${
                          row.highlight
                            ? 'text-[#22c55e]'
                            : 'text-gray-800'
                        }`}
                      >
                        {row.period}
                      </span>
                    </td>

                    <td className="px-3 py-3.5 font-medium text-gray-800">
                      Rp {formatRp(row.amount)}
                    </td>

                    <td className="px-3 py-3.5 text-gray-500 text-sm">
                      {row.source}
                    </td>

                    <td className="px-6 py-3.5 text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                          row.vsPred > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {row.vsPred > 0
                          ? '+'
                          : ''}
                        {row.vsPred}%
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-4">

          {/* Prediksi */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4">
              Prediksi 4 Minggu
            </p>

            <div className="space-y-2">
              {[
                {
                  label:
                    'Minggu depan (+1)',
                  value: 1100000,
                },
                {
                  label: '+2 minggu',
                  value: 1150000,
                },
                {
                  label: '+3 minggu',
                  value: 1200000,
                },
                {
                  label: '+4 minggu',
                  value: 1250000,
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-1.5"
                >

                  <span className="text-sm text-gray-600">
                    {p.label}
                  </span>

                  <span className="text-sm font-black text-yellow-500">
                    Rp{' '}
                    {(
                      p.value / 1000000
                    )
                      .toFixed(2)
                      .replace('.', ',')}{' '}
                    jt
                  </span>

                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-3 pt-3">
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Total prediksi 4 minggu :
                </span>

                <span className="text-sm font-black text-gray-900">
                  Rp 4.7 jt
                </span>

              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

            <p className="text-xs font-bold text-[#22c55e] uppercase tracking-widest mb-4">
              Tambah Data Historis
            </p>

            <div className="space-y-3">

              <input
                type="text"
                placeholder="Rp jumlah pendapatan"
                value={newIncome}
                onChange={e =>
                  setNewIncome(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 placeholder:text-gray-300"
              />

              <select
                value={newSource}
                onChange={e =>
                  setNewSource(
                    e.target.value
                  )
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#22c55e] focus:ring-2 focus:ring-[#22c55e]/10 bg-white text-gray-400"
              >
                <option value="">
                  Pilih sumber pendapatan
                </option>

                {INCOME_SOURCES.map(s => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s}
                  </option>
                ))}
              </select>

              <button className="w-full py-3 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold rounded-xl transition-colors text-sm">
                Tambah & Perbarui Prediksi
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}