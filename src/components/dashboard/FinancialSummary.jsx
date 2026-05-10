// components/dashboard/FinancialSummary.jsx
import { formatRupiah } from '../../utils/formatCurrency'
import { formatDateShort } from '../../utils/formatDate'
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

export default function FinancialSummary({ transactions = [] }) {
  if (!transactions.length) {
    return (
      <p className="text-sm text-gray-400 text-center py-6">
        Belum ada transaksi
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((trx) => (
        <div key={trx.id} className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${trx.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
            {trx.type === 'income'
              ? <ArrowUpCircle size={18} className="text-green-600" />
              : <ArrowDownCircle size={18} className="text-red-500" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{trx.description}</p>
            <p className="text-xs text-gray-400">{formatDateShort(trx.date)} · {trx.category}</p>
          </div>
          <span className={`text-sm font-semibold shrink-0 ${trx.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
            {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
          </span>
        </div>
      ))}
    </div>
  )
}