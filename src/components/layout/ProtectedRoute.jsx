import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const token = localStorage.getItem('token') // ganti dengan auth context nanti
  return token ? <Outlet /> : <Navigate to="/login" replace />
}