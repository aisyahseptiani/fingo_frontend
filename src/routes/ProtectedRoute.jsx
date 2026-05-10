// routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#22c55e] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Memuat...</p>
        </div>
      </div>
    )
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />
}