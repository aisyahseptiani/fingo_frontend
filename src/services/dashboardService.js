// services/dashboardService.js
import api from './api'

export const getDashboardSummary = async () => {
  const { data } = await api.get('/dashboard/summary')
  return data
  // ekspektasi response:
  // {
  //   balance: 4500000,
  //   income: 8000000,
  //   expense: 3500000,
  //   recentTransactions: [...],
  //   expenseByCategory: [{ category: 'food', amount: 1200000 }, ...]
  // }
}