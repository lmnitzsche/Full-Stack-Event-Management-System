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
      // Test Supabase connection
      const { data, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      setSupabaseAvailable(true)
      
      // Set initial user
      if (data.session?.user) {
        setUser(data.session.user)
        await fetchProfile(data.session.user.id)
      }
      
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth event:', event)
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
          // No profile found, create one
          await createProfile(userId)
        } else {
          throw error
        }
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Try to create profile as fallback
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
        if (error.code !== '23505') { // Ignore duplicate key errors
          throw error
        }
        // If duplicate, try to fetch the existing profile
        const { data: existingData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (existingData) {
          setProfile(existingData)
        }
      } else {
        setProfile(data)
        toast.success('Profile created successfully!')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Profile creation failed, but you can still use the app')
    }
  }

  const signUp = async (email, password, fullName) => {
    if (!supabaseAvailable) {
      toast.error('Database not available')
      return { data: null, error: { message: 'Supabase not available' } }
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
      
      if (data.user && !data.session) {
        toast.success('Check your email for the confirmation link!')
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    if (!supabaseAvailable) {
      toast.error('Database not available')
      return { data: null, error: { message: 'Supabase not available' } }
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      if (supabaseAvailable) {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
      }
      
      // Clear state regardless
      setUser(null)
      setProfile(null)
      
      // Clear local storage
      localStorage.clear()
      sessionStorage.clear()
      
      toast.success('Logged out successfully')
      
      // Force page refresh to ensure clean state
      window.location.href = '/Event-Nostalgia/'
      
    } catch (error) {
      console.error('Sign out error:', error)
      // Force logout anyway
      setUser(null)
      setProfile(null)
      localStorage.clear()
      sessionStorage.clear()
      window.location.href = '/Event-Nostalgia/'
    }
  }

  const updateProfile = async (updates) => {
    if (!supabaseAvailable || !user) {
      toast.error('Cannot update profile - not authenticated')
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
      toast.success('Profile updated successfully!')
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
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