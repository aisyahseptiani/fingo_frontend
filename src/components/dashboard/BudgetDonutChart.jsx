// components/dashboard/BudgetDonutChart.jsx
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { formatRupiah } from '../../utils/formatCurrency'

const GROUP_COLORS = {
  Kebutuhan: '#22c55e',
  Keinginan: '#f59e0b',
  Tabungan:  '#3b82f6',
}

const GROUP_ORDER = ['Kebutuhan', 'Keinginan', 'Tabungan']

export default function BudgetDonutChart({ data = [], total, prefs }) {
  // data now comes as [{category:'Kebutuhan', amount:X, percent:Y}, ...]
  // Sort by predefined order
  const sorted = GROUP_ORDER
    .map(name => data.find(d => d.category === name))
    .filter(Boolean)

  const hasData = sorted.length > 0 && sorted.some(d => d.amount > 0)

  // If no data, show placeholder
  const chartData = hasData
    ? sorted
    : [{ category: 'Belum ada', amount: 1, percent: 100 }]

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-bold text-gray-900 mb-4">Budget per kategori</h2>
      <div className="flex items-center gap-4">
        {/* Donut */}
        <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={hasData ? 3 : 0}
                dataKey="amount"
                nameKey="category"
                stroke="none"
              >
                {chartData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={hasData ? (GROUP_COLORS[entry.category] || '#d1d5db') : '#e5e7eb'}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] text-gray-400 leading-none">Total</p>
            <p className="text-xs font-black text-gray-900 leading-tight">
              {hasData ? formatRupiah(total, prefs) : 'Rp 0'}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2.5 flex-1">
          {hasData ? sorted.map((item) => (
            <div key={item.category} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: GROUP_COLORS[item.category] || '#d1d5db' }}
                />
                <span className="text-gray-600">{item.category}</span>
              </div>
              <span className="font-semibold text-gray-800">{item.percent}%</span>
            </div>
          )) : (
            <p className="text-xs text-gray-400">Belum ada data budget</p>
          )}
        </div>
      </div>
    </div>
  )
}