// services/transactionService.js
import api from './api'

export const getTransactions = async (params) => {
  const { data } = await api.get('/transactions', { params })
  return data // { transactions, total, page }
}

export const createTransaction = async (payload) => {
  const { data } = await api.post('/transactions', payload)
  return data
}

export const updateTransaction = async ({ id, ...payload }) => {
  const { data } = await api.put(`/transactions/${id}`, payload)
  return data
}

export const deleteTransaction = async (id) => {
  await api.delete(`/transactions/${id}`)
}