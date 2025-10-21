import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(false)

  // Simplified auth functions for testing
  const signUp = async (email, password, fullName) => {
    console.log('Sign up called:', { email, fullName })
    return { data: null, error: { message: 'Demo mode - sign up not implemented' } }
  }

  const signIn = async (email, password) => {
    console.log('Sign in called:', { email })
    return { data: null, error: { message: 'Demo mode - sign in not implemented' } }
  }

  const signOut = async () => {
    console.log('Sign out called')
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    console.log('Update profile called:', updates)
    return { data: null, error: { message: 'Demo mode - profile update not implemented' } }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin: false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}