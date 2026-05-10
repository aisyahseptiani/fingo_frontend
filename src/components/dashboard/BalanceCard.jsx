// components/dashboard/BalanceCard.jsx
import { formatRupiah } from '../../utils/formatCurrency'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function BalanceCard({ balance, income, expense }) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
      <p className="text-blue-100 text-sm mb-1">Total Saldo</p>
      <p className="text-3xl font-bold mb-5">{formatRupiah(balance)}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={14} className="text-green-300" />
            <span className="text-blue-100 text-xs">Pemasukan</span>
          </div>
          <p className="font-semibold text-sm">{formatRupiah(income)}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown size={14} className="text-red-300" />
            <span className="text-blue-100 text-xs">Pengeluaran</span>
          </div>
          <p className="font-semibold text-sm">{formatRupiah(expense)}</p>
        </div>
      </div>
    </div>
  )
}