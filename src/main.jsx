import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext-clean.jsx'
import { supabase } from './services/supabase.js'
import App from './App.jsx'
import './index.css'

function AppWithFreshStart() {
  const [authCleared, setAuthCleared] = useState(false)

  useEffect(() => {
    // Force logout and clear all auth state once
    const clearAuthState = async () => {
      try {
        await supabase.auth.signOut()
        localStorage.clear()
        sessionStorage.clear()
        
        // Clear any auth cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        })
        
        console.log('Auth state cleared')
        setAuthCleared(true)
      } catch (error) {
        console.log('Clearing auth state:', error)
        setAuthCleared(true) // Continue anyway
      }
    }
    
    clearAuthState()
  }, [])

  if (!authCleared) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Clearing authentication...</p>
        </div>
      </div>
    )
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/Full-Stack-Event-Management-System">
      <AuthProvider>
        <AppWithFreshStart />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)