import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizAuth } from '../contexts/QuizAuthContext'
import { StarfieldBackground } from '../components/ui/starfield'

export default function QuizAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn, signUp } = useQuizAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!isLogin && !name) {
      setError('Please enter your name')
      setLoading(false)
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
        const result = await signIn(email, password)
        if (result.success) {
          navigate('/quiz/dashboard')
        } else {
          setError(result.error || 'Login failed')
        }
      } else {
        const result = await signUp(email, name, password)
        if (result.success) {
          navigate('/quiz/dashboard')
        } else {
          setError(result.error || 'Registration failed')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <StarfieldBackground />

      <div className="relative z-10 max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2">
            Quiz Arena
          </h2>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to participate' : 'Create an account to get started'}
          </p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2
                         focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2
                           focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg
                         text-white placeholder-gray-500 focus:outline-none focus:ring-2
                         focus:ring-cyan-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required={!isLogin}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg
                           text-white placeholder-gray-500 focus:outline-none focus:ring-2
                           focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600
                       text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600
                       hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500
                       focus:ring-offset-2 focus:ring-offset-gray-900 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}
