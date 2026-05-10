// components/dashboard/BudgetDonutChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatRupiah } from '../../utils/formatCurrency'

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']

export default function BudgetDonutChart({ data = [], total }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-bold text-gray-900 mb-4">Budget per kategori</h2>
      <div className="flex items-center gap-4">
        {/* Donut - beri ukuran eksplisit */}
        <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={3}
                dataKey="amount"
                nameKey="category"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatRupiah(v)} />
            </PieChart>
          </ResponsiveContainer>
          {/* Label tengah */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] text-gray-400 leading-none">Total</p>
            <p className="text-xs font-black text-gray-900 leading-tight">
              {formatRupiah(total)}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 flex-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-gray-600">{item.category}</span>
              </div>
              <span className="font-semibold text-gray-800">{item.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}