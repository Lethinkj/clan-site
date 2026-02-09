import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, hashPassword, verifyPassword, QuizUser } from '../lib/supabase'

interface QuizAuthUser {
  id: string
  email: string
  name: string
  isBanned: boolean
}

interface QuizAuthContextType {
  user: QuizAuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, name: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  checkBanStatus: () => Promise<boolean>
}

const QuizAuthContext = createContext<QuizAuthContextType | undefined>(undefined)

export function QuizAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<QuizAuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('quiz_user')
        if (storedUser) {
          const userData = JSON.parse(storedUser) as QuizAuthUser
          setUser(userData)
          console.log('✅ User restored from localStorage:', userData.email)

          // Verify ban status on page load - WAIT for it to complete
          await checkBanStatusForUser(userData.id)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        // On error, keep user logged in anyway
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const checkBanStatusForUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .select('is_banned')
        .eq('id', userId)
        .maybeSingle()  // Use maybeSingle to handle missing users gracefully

      if (error) {
        console.error('Error checking ban status:', error)
        return
      }

      if (!data) {
        // User no longer exists in database, sign out
        console.warn('User not found in database, signing out')
        signOut()
        return
      }

      if (data.is_banned) {
        // User is banned, sign them out
        console.warn('User is banned, signing out')
        signOut()
      }
    } catch (error) {
      console.error('Error checking ban status:', error)
      // Don't sign out on error - keep user logged in
    }
  }

  const checkBanStatus = async (): Promise<boolean> => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('quiz_users')
        .select('is_banned')
        .eq('id', user.id)
        .single()

      if (!error && data) {
        if (data.is_banned) {
          signOut()
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Error checking ban status:', error)
      return false
    }
  }

  const signUp = async (email: string, name: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('quiz_users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        return { success: false, error: 'Email already registered' }
      }

      // Create new user
      const { data: newUser, error } = await supabase
        .from('quiz_users')
        .insert([{
          email,
          name,
          password_hash: hashPassword(email, password),
          is_banned: false
        }])
        .select()
        .single()

      if (error || !newUser) {
        return { success: false, error: 'Failed to create account' }
      }

      const userData: QuizAuthUser = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isBanned: false
      }

      setUser(userData)
      localStorage.setItem('quiz_user', JSON.stringify(userData))

      // Update last_login
      await supabase
        .from('quiz_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', newUser.id)

      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'An error occurred during registration' }
    }
  }

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Check user in quiz_users table
      const { data: quizUser, error } = await supabase
        .from('quiz_users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !quizUser) {
        return { success: false, error: 'Invalid email or password' }
      }

      // Check if user is banned
      if (quizUser.is_banned) {
        return { success: false, error: 'Your account has been banned' }
      }

      // Verify password
      if (!verifyPassword(email, password, quizUser.password_hash)) {
        return { success: false, error: 'Invalid email or password' }
      }

      const userData: QuizAuthUser = {
        id: quizUser.id,
        email: quizUser.email,
        name: quizUser.name,
        isBanned: false
      }

      setUser(userData)
      localStorage.setItem('quiz_user', JSON.stringify(userData))

      // Update last_login
      await supabase
        .from('quiz_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', quizUser.id)

      return { success: true }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'An error occurred during sign in' }
    }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('quiz_user')
  }

  return (
    <QuizAuthContext.Provider value={{ user, loading, signIn, signUp, signOut, checkBanStatus }}>
      {children}
    </QuizAuthContext.Provider>
  )
}

export function useQuizAuth() {
  const context = useContext(QuizAuthContext)
  if (context === undefined) {
    throw new Error('useQuizAuth must be used within a QuizAuthProvider')
  }
  return context
}
