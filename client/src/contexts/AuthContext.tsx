
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService, type User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  signUp: (email: string, password: string, metadata?: { full_name?: string, role?: string }) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user and listen for auth changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signUp = async (email: string, password: string, metadata?: { full_name?: string, role?: string }) => {
    await authService.signUp(email, password, metadata)
  }

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password)
  }

  const signOut = async () => {
    await authService.signOut()
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
