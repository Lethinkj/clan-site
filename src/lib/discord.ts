/**
 * Discord Authentication Utilities
 * Handles Discord OAuth2 verification and user credential validation
 */

export interface DiscordUser {
  id: string
  username: string
  email: string | null
  avatar: string | null
  discriminator: string
  verified: boolean
  locale?: string
  mfa_enabled: boolean
  premium_type: number
}

export interface DiscordAuthResponse {
  success: boolean
  user?: DiscordUser
  error?: string
  accessToken?: string
}

/**
 * Verify Discord OAuth2 Code
 * Exchanges authorization code for access token and user info
 */
export async function verifyDiscordCode(
  code: string,
  clientId: string,
  clientSecret: string,
  redirectUri: string
): Promise<DiscordAuthResponse> {
  try {
    // Step 1: Exchange code for access token
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        scope: 'identify email',
      }).toString(),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      return {
        success: false,
        error: `Token exchange failed: ${errorData.error_description || 'Unknown error'}`,
      }
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Step 2: Get user info using access token
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })

    if (!userResponse.ok) {
      return {
        success: false,
        error: 'Failed to retrieve Discord user information',
      }
    }

    const discordUser: DiscordUser = await userResponse.json()

    // Step 3: Validate user credentials
    const isValid = validateDiscordUser(discordUser)

    return {
      success: isValid,
      user: discordUser,
      accessToken: accessToken,
      error: isValid ? undefined : 'Discord user validation failed',
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during Discord authentication',
    }
  }
}

/**
 * Validate Discord User Credentials
 * Checks if user has proper Discord account configuration
 */
export function validateDiscordUser(user: DiscordUser): boolean {
  // User must have a valid ID and username
  if (!user.id || !user.username) {
    return false
  }

  // Username must be at least 2 characters
  if (user.username.length < 2) {
    return false
  }

  // Reject invalid usernames (bots, system accounts)
  if (user.username.toLowerCase().includes('bot') && user.discriminator === '0000') {
    return false
  }

  // User account must be verified (optional, based on your requirements)
  // If you want to enforce verified emails, uncomment:
  // if (!user.verified || !user.email) {
  //   return false
  // }

  return true
}

/**
 * Get Discord User from Session
 * Retrieves stored Discord user data from sessionStorage
 */
export function getDiscordUserFromSession(): DiscordUser | null {
  try {
    const storedUser = sessionStorage.getItem('discordUser')
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

/**
 * Clear Discord Session
 * Removes Discord user data from storage
 */
export function clearDiscordSession(): void {
  sessionStorage.removeItem('discordUser')
  localStorage.removeItem('discordAccessToken')
}

/**
 * Check if User is Logged In via Discord
 */
export function isDiscordLoggedIn(): boolean {
  return getDiscordUserFromSession() !== null && localStorage.getItem('discordAccessToken') !== null
}

/**
 * Get Current Discord Access Token
 */
export function getDiscordAccessToken(): string | null {
  return localStorage.getItem('discordAccessToken')
}
