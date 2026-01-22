import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, hashPassword, verifyPassword } from '../lib/supabase'

interface AuthUser {
  email: string
  username: string
  isAdmin: boolean
  isModerator: boolean
}

interface AuthContextType {
  user: AuthUser | null
  isAdmin: boolean
  isModerator: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isModerator, setIsModerator] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      const userData = JSON.parse(storedUser) as AuthUser
      setUser(userData)
      setIsAdmin(userData.isAdmin)
      setIsModerator(userData.isModerator || userData.isAdmin)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check user in moderators table (includes admin)
      const { data: moderator, error } = await supabase
        .from('moderators')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !moderator) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Verify password
      if (!verifyPassword(email, password, moderator.password_hash)) {
        return { success: false, error: 'Invalid email or password' }
      }

      const userData: AuthUser = {
        email: moderator.email,
        username: moderator.username,
        isAdmin: moderator.is_admin,
        isModerator: true
      }
      setUser(userData)
      setIsAdmin(moderator.is_admin)
      setIsModerator(true)
      localStorage.setItem('auth_user', JSON.stringify(userData))
      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not logged in' }
    }

    try {
      // Verify current password
      const { data: moderator, error: fetchError } = await supabase
        .from('moderators')
        .select('*')
        .eq('email', user.email)
        .single()

      if (fetchError || !moderator) {
        return { success: false, error: 'User not found' }
      }

      if (!verifyPassword(user.email, currentPassword, moderator.password_hash)) {
        return { success: false, error: 'Current password is incorrect' }
      }

      // Update password
      const { error: updateError } = await supabase
        .from('moderators')
        .update({ password_hash: hashPassword(user.email, newPassword) })
        .eq('email', user.email)

      if (updateError) {
        return { success: false, error: 'Failed to update password' }
      }

      return { success: true }
    } catch (error) {
      console.error('Change password error:', error)
      return { success: false, error: 'An error occurred' }
    }
  }

  const signOut = () => {
    setUser(null)
    setIsAdmin(false)
    setIsModerator(false)
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, isModerator, loading, signIn, signOut, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
