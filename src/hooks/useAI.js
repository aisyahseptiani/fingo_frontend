// hooks/useAI.js
import { useQuery, useMutation } from '@tanstack/react-query'
import { sendChatMessage, detectImpulsive, predictIncome } from '../services/aiService'

export function useSendChat() {
  return useMutation({ mutationFn: sendChatMessage })
}

export function useImpulsiveDetector(transactionId) {
  return useQuery({
    queryKey: ['impulse', transactionId],
    queryFn: () => detectImpulsive(transactionId),
    enabled: !!transactionId,
  })
}

export function useIncomePredictor() {
  return useQuery({
    queryKey: ['income-prediction'],
    queryFn: predictIncome,
  })
}