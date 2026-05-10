// hooks/useDashboard.js
import { useQuery } from '@tanstack/react-query'

const DUMMY = {
  balance: 2450000,
  income: 4200000,
  expense: 1750000,
  impulsiveCount: 3,
  incomePrediction: 1100000,
  recentTransactions: [
    { id: 1, description: 'Beli sayuran',      category: 'Makanan',      type: 'expense', amount: 203000, date: '2026-04-22' },
    { id: 2, description: 'Grab',               category: 'Transportasi', type: 'expense', amount: 15000,  date: '2026-04-21' },
    { id: 3, description: 'Freelance Project',  category: 'Pemasukan',    type: 'income',  amount: 800000, date: '2026-04-20' },
    { id: 4, description: 'Makan siang',        category: 'Makanan',      type: 'expense', amount: 35000,  date: '2026-04-19' },
    { id: 5, description: 'Netflix subcription',category: 'Hiburan',      type: 'expense', amount: 54000,  date: '2026-04-18' },
    { id: 6, description: 'Transfer Gojek',     category: 'Pemasukan',    type: 'income',  amount: 1100000,date: '2026-04-18' },
  ],
  expenseByCategory: [
    { category: 'Makanan',      amount: 700000,  percent: 40 },
    { category: 'Transportasi', amount: 350000,  percent: 20 },
    { category: 'Hiburan',      amount: 227500,  percent: 13 },
    { category: 'Lainnya',      amount: 472500,  percent: 27 },
  ],
  weeklyChart: [
    { week: 'Mg 1', income: 2000000, expense: 800000  },
    { week: 'Mg 2', income: 1500000, expense: 600000  },
    { week: 'Mg 3', income: 3000000, expense: 1200000 },
    { week: 'Mg 4', income: 800000,  expense: 400000  },
    { week: 'Pred.', income: 1100000, expense: 500000 },
  ],
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => Promise.resolve(DUMMY),
  })
}