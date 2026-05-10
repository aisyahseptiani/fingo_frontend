// hooks/useBudget.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/budgetService'

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  })
}

export function useCreateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createBudget,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}

export function useUpdateBudget() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets'] }),
  })
}