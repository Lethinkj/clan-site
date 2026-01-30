import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Sparkles, KeyRound, Scroll } from 'lucide-react'

export default function Login() {
  const { theme } = useTheme() // Unused but kept for context if needed
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
      setError(result.error || 'The gates remain closed. Verify your credentials.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="border border-amber-500/20 bg-black/40 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] relative group">

          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-purple-600/20 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-amber-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <KeyRound className="text-amber-500" size={32} />
            </div>
            <h2 className="text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
              Guild Gate
            </h2>
            <p className="text-slate-500 text-sm mt-2 font-cinzel tracking-wider">Restricted Access</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
              <span className="text-red-500">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest pl-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-amber-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-lato"
                placeholder="mage@aura.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-500/80 uppercase tracking-widest pl-1">Passphrase</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-lg text-amber-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-lato"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} className="animate-spin" /> Unlocking...
                </span>
              ) : (
                'Enter Realm'
              )}
            </button>
          </form>

          < div className="mt-8 pt-6 border-t border-white/5 text-center relative z-10">
            <p className="text-xs text-slate-500 mb-4 font-lato">
              Only Guild Managers and High Council members make pass beyond this point.
            </p>
            <Link
              to="/add-member"
              className="inline-flex items-center gap-2 text-sm text-amber-500/70 hover:text-amber-400 transition-colors font-cinzel tracking-wide"
            >
              <Scroll size={14} />
              Summon New Member
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
