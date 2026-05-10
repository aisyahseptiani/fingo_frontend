// services/aiService.js
import api from './api'

export const sendChatMessage = async (message) => {
  const { data } = await api.post('/ai/chat', { message })
  return data // { reply }
}

export const detectImpulsive = async (transactionId) => {
  const { data } = await api.post('/ai/impulse-check', { transactionId })
  return data // { isImpulsive, reason, score }
}

export const predictIncome = async () => {
  const { data } = await api.get('/ai/income-prediction')
  return data // { predicted, confidence, chart }
}