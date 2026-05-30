// hooks/useUserSetup.js
import { useQuery } from '@tanstack/react-query'
import { getBudgets } from '../services/budgetService'

export function useUserSetup() {
  const budgets = useQuery({ queryKey: ['budgets'], queryFn: getBudgets })

  const hasBudget = (budgets.data?.length ?? 0) > 0
  const hasIncome = localStorage.getItem('income_predictor_setup') === 'true'

  return {
    hasBudget,
    hasIncome,
    isLoading: budgets.isLoading,
  }
}