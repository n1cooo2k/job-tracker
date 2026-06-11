import { Routes, Route, Navigate } from 'react-router-dom'
import { isConfigured } from './lib/supabase'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import SetupNotice from './components/SetupNotice'
import AuthPage from './pages/Auth'

export default function App() {
  if (!isConfigured) return <SetupNotice />

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="grid min-h-screen place-items-center text-ink-300">
                Job board coming soon
              </div>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
