import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

// Discord OAuth Configuration
const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID
const DISCORD_REDIRECT_URI = import.meta.env.VITE_DISCORD_REDIRECT_URI
const DISCORD_RETURN_PATH_KEY = 'discord_oauth_return_to'

interface DiscordLoginModalProps {
  isOpen: boolean
  onClose?: () => void
  onLoginSuccess?: () => void
  title?: string
  subtitle?: string
}

export default function DiscordLoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
  title = 'Guild Gate',
  subtitle = 'Restricted Access'
}: DiscordLoginModalProps) {
  const [discordLoading, setDiscordLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const handledCodeRef = useRef<string | null>(null)
  const code = searchParams.get('code')
  const shouldHandleCallback = Boolean(code)

  // Handle Discord callback
  useEffect(() => {
    if (code && handledCodeRef.current !== code) {
      handledCodeRef.current = code
      handleDiscordCallback(code)
    }
  }, [code])

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

  // Handle Discord OAuth Callback
  const handleDiscordCallback = async (code: string) => {
    setDiscordLoading(true)
    setError('')

    try {
      // Exchange code for Discord user info
      const response = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID!,
          client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET || '',
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: DISCORD_REDIRECT_URI!,
          scope: 'identify email',
        }).toString(),
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate with Discord')
      }

      const tokenData = await response.json()
      const accessToken = tokenData.access_token

      // Get user info from Discord
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      })

      if (!userResponse.ok) {
        throw new Error('Failed to get Discord user info')
      }

      const discordUser = await userResponse.json()

      // Store Discord user data
      const discordUserData = {
        id: discordUser.id,
        username: discordUser.username,
        email: discordUser.email,
        avatar: discordUser.avatar,
        discriminator: discordUser.discriminator,
        loginTime: new Date().toISOString(),
      }

      sessionStorage.setItem('discordUser', JSON.stringify(discordUserData))
      localStorage.setItem('discordAccessToken', accessToken)

      console.log('Discord login successful:', discordUserData)

      // Callback on success
      if (onLoginSuccess) {
        onLoginSuccess()
      }

      // Close modal if provided
      if (onClose) {
        onClose()
      }

      // Clean callback query params and return user back to previous page.
      const returnTo = sessionStorage.getItem(DISCORD_RETURN_PATH_KEY)
      sessionStorage.removeItem(DISCORD_RETURN_PATH_KEY)
      const targetPath = returnTo && returnTo !== '/login' ? returnTo : '/newbase'
      navigate(targetPath, { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Discord authentication failed'
      setError(`Discord login failed: ${errorMessage}. Make sure your CLIENT_SECRET is correct.`)
      console.error('Discord auth error:', err)
    } finally {
      setDiscordLoading(false)
    }
  }

  if (!isOpen && !shouldHandleCallback) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      {/* Modal Content */}
      <div className="relative z-10 max-w-md w-full">
        <div className="border-2 border-indigo-500/30 bg-slate-950/95 backdrop-blur-md p-8 rounded-2xl shadow-[0_0_60px_rgba(99,102,241,0.3)] relative group">

          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-1000"></div>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 border-2 border-indigo-500/50 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.491c-1.923-.9-3.954-1.406-6.083-1.431-.275-.038-.541.042-.689.135-.6.324-.598.325-.698.385-.245.135-1.678.813-1.678.813.3-.091.586-.182.889-.27.319-.087.615-.177.905-.245 1.816-.369 3.598-.309 5.205.236.418.14.957.314 1.466.573-1.022-.635-2.679-1.42-4.618-1.42-.393 0-.779.046-1.155.135-.077.014-.155.028-.231.043-.414.077-.828.155-1.242.232.378-.108.757-.216 1.135-.324 1.834-.477 3.636-.356 5.343.24z"/>
                <path d="M4.692 6.846c.915-1.049 2.118-1.971 3.511-2.511.108 1.562.906 2.969 2.079 4.018-.975-.261-1.922-.654-2.822-1.191-.36-.227-.703-.479-1.019-.776-.233-.209-.448-.43-.648-.659-.027.077-.053.15-.08.23-.322.896-.28 1.97.183 2.868.1.19.21.37.33.54-.22-.056-.438-.12-.653-.19-.943-.313-1.78-.814-2.388-1.467-.23-.249-.431-.52-.604-.806-.141-.228-.265-.468-.369-.715-.151-.375-.237-.778-.217-1.176.01-.19.036-.378.075-.562z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-cinzel font-bold text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
              {title}
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-cinzel tracking-wider">{subtitle}</p>
          </div>

          {error && (
            <div className="bg-red-900/30 border-2 border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 relative z-10">
              <span className="text-red-400 text-lg">⚠</span> {error}
            </div>
          )}

          <div className="space-y-4 relative z-10">
            <button
              onClick={handleDiscordLogin}
              disabled={discordLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-cinzel font-bold tracking-wider rounded-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_40px_rgba(79,70,229,0.6)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {discordLoading ? (
                <>
                  <Sparkles size={16} className="animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.491c-1.923-.9-3.954-1.406-6.083-1.431-.275-.038-.541.042-.689.135-.6.324-.598.325-.698.385-.245.135-1.678.813-1.678.813.3-.091.586-.182.889-.27.319-.087.615-.177.905-.245 1.816-.369 3.598-.309 5.205.236.418.14.957.314 1.466.573-1.022-.635-2.679-1.42-4.618-1.42-.393 0-.779.046-1.155.135-.077.014-.155.028-.231.043-.414.077-.828.155-1.242.232.378-.108.757-.216 1.135-.324 1.834-.477 3.636-.356 5.343.24z"/>
                    <path d="M4.692 6.846c.915-1.049 2.118-1.971 3.511-2.511.108 1.562.906 2.969 2.079 4.018-.975-.261-1.922-.654-2.822-1.191-.36-.227-.703-.479-1.019-.776-.233-.209-.448-.43-.648-.659-.027.077-.053.15-.08.23-.322.896-.28 1.97.183 2.868.1.19.21.37.33.54-.22-.056-.438-.12-.653-.19-.943-.313-1.78-.814-2.388-1.467-.23-.249-.431-.52-.604-.806-.141-.228-.265-.468-.369-.715-.151-.375-.237-.778-.217-1.176.01-.19.036-.378.075-.562z"/>
                  </svg>
                  Login with Discord
                </>
              )}
            </button>

            <p className="text-xs text-slate-400 text-center font-cinzel">
              Enter with your Discord credentials to access the guild
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
