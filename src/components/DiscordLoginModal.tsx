import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'

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

  // Automatically start Discord login if opened and not handling a callback
  useEffect(() => {
    if (isOpen && !shouldHandleCallback && !error && !discordLoading) {
      handleDiscordLogin()
    }
  }, [isOpen, shouldHandleCallback, error, discordLoading])

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

      // Check if user exists in the database
      const { data: dbUser, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('discord_user_id', discordUser.id)
        .single()

      if (dbError || !dbUser) {
        throw new Error('Access Denied: Your Discord account is not registered in the Aura-7F guild database.')
      }

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

      // Clean callback query params and redirect based on role
      sessionStorage.removeItem(DISCORD_RETURN_PATH_KEY)
      if (dbUser.role && dbUser.role.toLowerCase() === 'captain bash') {
        navigate('/admindashboard', { replace: true })
      } else {
        navigate('/guestdashboard', { replace: true })
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Discord authentication failed'
      setError(errorMessage)
      console.error('Discord auth error:', err)
    } finally {
      setDiscordLoading(false)
    }
  }

  const handleClose = () => {
    if (onClose) onClose()
    if (shouldHandleCallback) {
      navigate(window.location.pathname, { replace: true })
    }
  }

  if (!isOpen && !shouldHandleCallback) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 overflow-hidden bg-black/80 backdrop-blur-sm pointer-events-auto">
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-[3px] border-indigo-950 border-t-indigo-500 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
          {/* Middle Ring */}
          <div className="absolute w-14 h-14 border-[3px] border-purple-950 border-r-purple-500 rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
          {/* Inner Core */}
          <div className="absolute w-6 h-6 bg-indigo-500/20 rounded-full animate-pulse shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
        </div>
        <h2 className="text-2xl font-cinzel font-bold text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)] tracking-widest uppercase mt-4">
          {discordLoading || shouldHandleCallback ? 'Authenticating...' : 'Connecting to Discord...'}
        </h2>
        {error && (
          <div className="bg-red-950/80 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mt-2 text-sm flex flex-col items-center gap-4 max-w-md text-center shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <p><span className="text-red-400 text-lg mr-2">⚠</span>{error}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-red-900/50 hover:bg-red-600/60 border border-red-500/50 rounded-lg text-red-100 font-cinzel font-bold tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
