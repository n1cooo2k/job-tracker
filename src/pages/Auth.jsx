import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoMark } from '../components/icons'

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login'
  const { session, signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const [busy, setBusy] = useState(false)

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setNotice(null)
    setBusy(true)
    try {
      if (isLogin) {
        const { error: err } = await signIn(email, password)
        if (err) throw err
        navigate('/', { replace: true })
      } else {
        const { data, error: err } = await signUp(email, password)
        if (err) throw err
        if (data.session) {
          navigate('/', { replace: true })
        } else {
          setNotice('Account created. Check your inbox to confirm your email, then log in.')
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center rise">
          <LogoMark size={44} />
          <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-1.5 text-sm text-ink-300">
            {isLogin
              ? 'Log in to keep your job hunt on track.'
              : 'Start tracking every application in one place.'}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card mt-7 space-y-4 p-6 rise"
          style={{ animationDelay: '80ms' }}
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
              EMAIL
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="field"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold tracking-wide text-ink-300">
              PASSWORD
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-rejected/30 bg-rejected/10 px-3.5 py-2.5 text-sm text-rejected pop">
              {error}
            </p>
          )}
          {notice && (
            <p className="rounded-xl border border-offer/30 bg-offer/10 px-3.5 py-2.5 text-sm text-offer pop">
              {notice}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <p
          className="mt-5 text-center text-sm text-ink-300 rise"
          style={{ animationDelay: '160ms' }}
        >
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <Link
            to={isLogin ? '/signup' : '/login'}
            className="font-semibold text-accent-400 hover:text-accent-300"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </div>
    </div>
  )
}
