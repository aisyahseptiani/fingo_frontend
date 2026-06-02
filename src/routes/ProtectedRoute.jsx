// routes/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuthContext()
  const { pathname } = useLocation()

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', user?.id],
    queryFn: async () => {
      const { data } = await api.get('/user/profile')
      return data
    },
    enabled: !!user
  })

  if (isLoading || (user && profileLoading)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  // Check if profile is completed (phone is required)
  const isProfileComplete = profile?.phone ? true : false
  if (!isProfileComplete && pathname !== '/settings') {
    return <Navigate to="/settings" replace />
  }

  return <Outlet />
}