// routes/PublicRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export default function PublicRoute() {
  const { user, isLoading } = useAuthContext()
  if (isLoading) return null
  return user ? <Navigate to="/" replace /> : <Outlet />
}