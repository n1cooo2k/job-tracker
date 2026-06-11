import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
