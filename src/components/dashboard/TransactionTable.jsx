// components/dashboard/TransactionTable.jsx
import { Link } from 'react-router-dom'
import { formatRupiah } from '../../utils/formatCurrency'
import { formatDateShort } from '../../utils/formatDate'

const CATEGORY_COLORS = {
  Makanan:      'bg-red-100 text-red-600',
  Transportasi: 'bg-blue-100 text-blue-600',
  Hiburan:      'bg-yellow-100 text-yellow-600',
  Pemasukan:    'bg-green-100 text-green-700',
  Belanja:      'bg-purple-100 text-purple-600',
  Lainnya:      'bg-gray-100 text-gray-600',
}

export default function TransactionTable({ transactions = [], isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900">Transaksi Terbaru</h2>
        <Link to="/transactions" className="text-sm text-[#22c55e] font-semibold hover:underline flex items-center gap-1">
          Lihat Semua →
        </Link>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 tracking-wider uppercase">Keterangan</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 tracking-wider uppercase">Kategori</th>
              <th className="text-left px-3 py-3 text-xs font-semibold text-gray-400 tracking-wider uppercase">Tanggal</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 tracking-wider uppercase">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-3.5 font-medium text-gray-800">{trx.description}</td>
                <td className="px-3 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLORS[trx.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {trx.category}
                  </span>
                </td>
                <td className="px-3 py-3.5 text-gray-400">{formatDateShort(trx.date)}</td>
                <td className={`px-5 py-3.5 text-right font-semibold ${trx.type === 'income' ? 'text-[#22c55e]' : 'text-red-500'}`}>
                  {trx.type === 'income' ? '+' : '-'}{formatRupiah(trx.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!transactions.length && (
          <p className="text-center text-gray-400 text-sm py-8">Belum ada transaksi</p>
        )}
      </div>
    </div>
  )
}