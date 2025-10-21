import React, { createContext, useContext, useEffect, useState } from 'react'

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
  const [supabaseError, setSupabaseError] = useState(null)
  const [supabase, setSupabase] = useState(null)

  useEffect(() => {
    // Try to initialize Supabase
    const initializeSupabase = async () => {
      try {
        // Dynamic import to handle potential errors
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey || 
            supabaseUrl === 'your_supabase_project_url_here' ||
            supabaseAnonKey === 'your_supabase_anon_key_here') {
          throw new Error('Supabase credentials not configured')
        }
        
        const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
        
        // Test the connection
        const { data, error } = await supabaseClient.auth.getSession()
        if (error && error.message.includes('Invalid')) {
          throw new Error('Invalid Supabase credentials')
        }
        
        setSupabase(supabaseClient)
        setUser(data?.session?.user ?? null)
        
        // Listen for auth changes
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
          async (event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
              await fetchProfile(session.user.id, supabaseClient)
            } else {
              setProfile(null)
            }
          }
        )
        
        return () => subscription.unsubscribe()
      } catch (error) {
        console.warn('Supabase initialization failed:', error.message)
        setSupabaseError(error.message)
        setSupabase(null)
      } finally {
        setLoading(false)
      }
    }

    initializeSupabase()
  }, [])

  const fetchProfile = async (userId, supabaseClient) => {
    if (!supabaseClient) return
    
    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signUp = async (email, password, fullName) => {
    if (!supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase not available. Running in demo mode.' } 
      }
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
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signIn = async (email, password) => {
    if (!supabase) {
      return { 
        data: null, 
        error: { message: 'Supabase not available. Running in demo mode.' } 
      }
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
    if (!supabase) {
      setUser(null)
      setProfile(null)
      return
    }
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates) => {
    if (!supabase || !user) {
      return { 
        data: null, 
        error: { message: 'Supabase not available or user not logged in.' } 
      }
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
    supabaseAvailable: !!supabase,
    supabaseError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}