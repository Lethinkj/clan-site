import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { Sparkles, KeyRound } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Discord OAuth Configuration
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI
const DISCORD_RETURN_PATH_KEY = 'discord_oauth_return_to'

export default function Login() {
  const { theme } = useTheme() // Unused but kept for context if needed
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [discordLoading, setDiscordLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [handledDiscordCode, setHandledDiscordCode] = useState<string | null>(null)

  // Handle Discord callback
  useEffect(() => {
    const code = searchParams.get('code')
    if (code && !handledDiscordCode) {
      setHandledDiscordCode(code)
      const returnTo = sessionStorage.getItem(DISCORD_RETURN_PATH_KEY)
      const targetPath = returnTo && returnTo !== '/login' ? returnTo : '/newbase'
      navigate(`${targetPath}?code=${code}`, { replace: true })
    }
  }, [searchParams, handledDiscordCode, navigate])

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

  // Discord Login Handler
  const handleDiscordLogin = () => {
    if (!DISCORD_CLIENT_ID || !DISCORD_REDIRECT_URI) {
      setError('Discord configuration missing. Add VITE_DISCORD_CLIENT_ID and VITE_DISCORD_REDIRECT_URI to .env')
      return
    }

    sessionStorage.setItem(
      DISCORD_RETURN_PATH_KEY,
      `${window.location.pathname}${window.location.search}`
    )

    const discordAuthUrl = new URL('https://discord.com/api/oauth2/authorize')
    discordAuthUrl.searchParams.append('client_id', DISCORD_CLIENT_ID)
    discordAuthUrl.searchParams.append('redirect_uri', DISCORD_REDIRECT_URI)
    discordAuthUrl.searchParams.append('response_type', 'code')
    discordAuthUrl.searchParams.append('scope', 'identify email')
    discordAuthUrl.searchParams.append('prompt', 'consent')

    window.location.href = discordAuthUrl.toString()
  }

  if (searchParams.get('code')) {
    // Just a basic fallback in case the effect hasn't routed them yet
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0d1117]">
        <Sparkles size={48} className="text-amber-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full relative z-20">
        <div className="border-2 border-amber-500/30 bg-slate-950/90 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.2)] relative group">

          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-purple-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              <KeyRound className="text-amber-400" size={32} />
            </div>
            <h2 className="text-3xl font-cinzel font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              Guild Gate
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-cinzel tracking-wider">Restricted Access</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border-2 border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 relative z-10">
              <span className="text-red-400 text-lg">⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-widest pl-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/90 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/30 transition-all font-lato"
                placeholder="mage@aura.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-widest pl-1">Passphrase</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-900/90 border-2 border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/70 focus:ring-2 focus:ring-amber-500/30 transition-all font-lato"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || discordLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles size={16} className="animate-spin" /> Unlocking...
                </span>
              ) : (
                'Enter Realm'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-slate-950/90 text-slate-400 font-cinzel">Or</span>
              </div>
            </div>

            {/* Discord Login Button */}
            <button
              type="button"
              onClick={handleDiscordLogin}
              disabled={loading || discordLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {discordLoading ? (
                <>
                  <Sparkles size={16} className="animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.491c-1.923-.9-3.954-1.406-6.083-1.431-.275-.038-.541.042-.689.135-.6.324-.598.325-.698.385-.245.135-1.678.813-1.678.813.3-.091.586-.182.889-.27.319-.087.615-.177.905-.245 1.816-.369 3.598-.309 5.205.236.418.14.957.314 1.466.573-1.022-.635-2.679-1.42-4.618-1.42-.393 0-.779.046-1.155.135-.077.014-.155.028-.231.043-.414.077-.828.155-1.242.232.378-.108.757-.216 1.135-.324 1.834-.477 3.636-.356 5.343.24z" />
                    <path d="M4.692 6.846c.915-1.049 2.118-1.971 3.511-2.511.108 1.562.906 2.969 2.079 4.018-.975-.261-1.922-.654-2.822-1.191-.36-.227-.703-.479-1.019-.776-.233-.209-.448-.43-.648-.659-.027.077-.053.15-.08.23-.322.896-.28 1.97.183 2.868.1.19.21.37.33.54-.22-.056-.438-.12-.653-.19-.943-.313-1.78-.814-2.388-1.467-.23-.249-.431-.52-.604-.806-.141-.228-.265-.468-.369-.715-.151-.375-.237-.778-.217-1.176.01-.19.036-.378.075-.562z" />
                  </svg>
                  Login with Discord
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
