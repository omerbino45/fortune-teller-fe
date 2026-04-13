import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './store/themeStore' // apply persisted theme before first render
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import NewWorryPage from './pages/NewWorryPage'
import WorryDetailPage from './pages/WorryDetailPage'
import StatisticsPage from './pages/StatisticsPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import ArchivePage from './pages/ArchivePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  return token ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/worries/new" element={<ProtectedRoute><NewWorryPage /></ProtectedRoute>} />
        <Route path="/worries/:id" element={<ProtectedRoute><WorryDetailPage /></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><StatisticsPage /></ProtectedRoute>} />
        <Route path="/archive" element={<ProtectedRoute><ArchivePage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
