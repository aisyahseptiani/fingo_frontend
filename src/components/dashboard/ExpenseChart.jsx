// components/dashboard/ExpenseChart.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatRupiah } from '../../utils/formatCurrency'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#f97316', '#6b7280']

export default function ExpenseChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
        Belum ada data pengeluaran
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="amount"
          nameKey="category"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatRupiah(value)} />
        <Legend
          formatter={(value) => <span className="text-xs text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}