import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export const useGetGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data } = await api.get('/goals')
      return data
    },
  })
}

export const useAddGoal = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (goalData) => {
      const { data } = await api.post('/goals', goalData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
    },
  })
}
