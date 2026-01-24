import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'

export default function Login() {
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn(email, password)
    
    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.error || 'Failed to sign in. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className={`border-2 p-8 rounded-2xl backdrop-blur-sm transition-all
          ${theme === 'dark'
            ? 'bg-slate-900/90 border-cyan-400/30 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
            : 'bg-white/90 border-cyan-600/30 shadow-[0_0_30px_rgba(8,145,178,0.1)]'
          }`}>
          <h2 className={`text-3xl font-bold mb-6 text-center ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>Admin Login</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-1
                  ${theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400'
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600'
                  }`}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-3 border rounded-lg transition-all focus:outline-none focus:ring-1
                  ${theme === 'dark'
                    ? 'bg-slate-900 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-cyan-400'
                    : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-cyan-600 focus:ring-cyan-600'
                  }`}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg
                ${theme === 'dark'
                  ? 'bg-cyan-400 text-slate-900 hover:bg-cyan-500 shadow-cyan-500/20 hover:shadow-cyan-500/30'
                  : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-600/20 hover:shadow-cyan-600/30'
                }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 space-y-2">
            <p className={`text-sm text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Only authorized admins and moderators can access the dashboard.
            </p>
            <button
              onClick={() => navigate('/add-member')}
              className={`w-full font-medium py-3 px-6 rounded-lg transition-all border
                ${theme === 'dark'
                  ? 'bg-slate-800/50 border-cyan-400/30 text-cyan-400 hover:bg-slate-800 hover:border-cyan-400/50'
                  : 'bg-slate-50 border-cyan-600/30 text-cyan-600 hover:bg-slate-100 hover:border-cyan-600/50'
                }`}
            >
              Add New Member
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
