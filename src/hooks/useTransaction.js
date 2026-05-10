// hooks/useTransaction.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTransactions, createTransaction,
  updateTransaction, deleteTransaction,
} from '../services/transactionService'

export function useTransactions(params) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => getTransactions(params),
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
  })
}