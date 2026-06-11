import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { isConfigured } from './lib/supabase'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import SetupNotice from './components/SetupNotice'
import AuthPage from './pages/Auth'
import Board from './pages/Board'

// Lazy-loaded so Recharts stays out of the main bundle
const Dashboard = lazy(() => import('./pages/Dashboard'))

export default function App() {
  if (!isConfigured) return <SetupNotice />

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Board />} />
          <Route
            path="dashboard"
            element={
              <Suspense
                fallback={
                  <div className="card grid h-64 place-items-center">
                    <div className="spinner" />
                  </div>
                }
              >
                <Dashboard />
              </Suspense>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
