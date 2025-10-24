import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

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
  const [loading, setLoading] = useState(true)
  const [supabaseAvailable, setSupabaseAvailable] = useState(false)
  const [supabaseError, setSupabaseError] = useState(null)

  useEffect(() => {
    initializeSupabase()
  }, [])

  const initializeSupabase = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      setSupabaseAvailable(true)
      
      if (data.session?.user) {
        setUser(data.session.user)
        await fetchProfile(data.session.user.id)
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        }
      )
      
      setLoading(false)
      return () => subscription.unsubscribe()
      
    } catch (error) {
      console.warn('Supabase initialization failed:', error.message)
      setSupabaseError(error.message)
      setSupabaseAvailable(false)
      setLoading(false)
    }
  }

  const fetchProfile = async (userId) => {
    if (!supabaseAvailable) return
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          await createProfile(userId)
        } else {
          console.error('Profile fetch error:', error)
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      await createProfile(userId)
    }
  }

  const createProfile = async (userId) => {
    if (!supabaseAvailable || !user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          }
        ])
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          // Duplicate key, fetch existing
          const { data: existingData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()
          
          if (existingData) setProfile(existingData)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      // Don't show error toast, just continue
    }
  }

  const signUp = async (email, password, fullName) => {
    if (!supabaseAvailable) {
      return { data: null, error: { message: 'Database not available' } }
    }
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) throw error

      // Check if the signup was successful but user already exists
      // Supabase returns the user object even for existing users, but with different properties
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        // User exists but no new identity was created (email already registered)
        return { 
          data: null, 
          error: { message: 'An account with this email already exists. Please use a different email or try logging in.' } 
        }
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    if (!supabaseAvailable) {
      return { data: null, error: { message: 'Database not available' } }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      if (supabaseAvailable) {
        await supabase.auth.signOut()
      }
      
      setUser(null)
      setProfile(null)
      localStorage.clear()
      sessionStorage.clear()
      
      // Force refresh to ensure clean state
      window.location.href = '/Full-Stack-Event-Management-System/'
      
    } catch (error) {
      // Force logout anyway
      setUser(null)
      setProfile(null)
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/Full-Stack-Event-Management-System/'
    }
  }

  const updateProfile = async (updates) => {
    if (!supabaseAvailable || !user) {
      return { error: { message: 'Not authenticated' } }
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isAdmin: profile?.is_admin || false,
    supabaseAvailable,
    supabaseError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}