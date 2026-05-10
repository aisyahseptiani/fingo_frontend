// routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import MainLayout from '../components/layout/MainLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Auth pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Dashboard
import DashboardPage from '../pages/dashboard/DashboardPage'

// Transaction
import TransactionHistoryPage from '../pages/transaction/TransactionHistoryPage'
import AddTransactionPage from '../pages/transaction/AddTransactionPage'

// Budget
import BudgetPlannerPage from '../pages/budget/BudgetPlannerPage'

// AI
import AIAssistantPage from '../pages/ai/AIAssistantPage'
import ImpulsiveDetectorPage from '../pages/ai/ImpulsiveDetectorPage'
import IncomePredictorPage from '../pages/ai/IncomePredictorPage'

// Notification
import NotificationPage from '../pages/notification/NotificationPage'

// Profile
import ProfilePage from '../pages/profile/ProfilePage'
import SettingsPage from '../pages/profile/SettingsPage'

// 404
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public: redirect ke "/" kalau sudah login */}
      <Route element={<AuthLayout />}>
        <Route element={<PublicRoute />}>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected: redirect ke "/login" kalau belum login */}
      <Route element={<MainLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/"                element={<DashboardPage />} />
          <Route path="/transactions"    element={<TransactionHistoryPage />} />
          <Route path="/transactions/add" element={<AddTransactionPage />} />
          <Route path="/budget"          element={<BudgetPlannerPage />} />
          <Route path="/ai/assistant"    element={<AIAssistantPage />} />
          <Route path="/ai/impulse"      element={<ImpulsiveDetectorPage />} />
          <Route path="/ai/predictor"    element={<IncomePredictorPage />} />
          <Route path="/notifications"   element={<NotificationPage />} />
          <Route path="/profile"         element={<ProfilePage />} />
          <Route path="/settings"        element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}