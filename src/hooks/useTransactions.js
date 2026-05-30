import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useGetTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data } = await api.get('/transactions')
      return data
    },
  })
}

export const useGetTransactionSummary = () => {
  return useQuery({
    queryKey: ['transactionSummary'],
    queryFn: async () => {
      const { data } = await api.get('/transactions/summary')
      return data
    },
  })
}

export const useAddTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (transactionData) => {
      const payload = { ...transactionData, note: transactionData.description }
      delete payload.description
      const { data } = await api.post('/transactions', payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...transactionData }) => {
      const payload = { ...transactionData, note: transactionData.description }
      delete payload.description
      const { data } = await api.put(`/transactions/${id}`, payload)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/transactions/${id}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
