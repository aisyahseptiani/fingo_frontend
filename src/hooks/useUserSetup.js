// hooks/useUserSetup.js
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { getBudgets } from '../services/budgetService'

export function useUserSetup() {
  const budgets = useQuery({ queryKey: ['budgets'], queryFn: getBudgets })
  const transactions = useQuery({
    queryKey: ['transactions'], // ← samakan dengan useDashboard
    queryFn: async () => {
      const { data } = await api.get('/transactions')
      return data
    }
  })

  const hasBudget = (budgets.data?.length ?? 0) > 0
  const hasIncome = (transactions.data ?? []).some(
    t => t.type === 'INCOME' || t.type === 'income'
  )

  return {
    hasBudget,
    hasIncome,
    isLoading: budgets.isLoading || transactions.isLoading,
  }
}