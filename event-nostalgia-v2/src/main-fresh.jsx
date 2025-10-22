import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext-robust.jsx'
import { supabase } from './services/supabase.js'
import LoginPage from './pages/LoginPage.jsx'
import './index.css'

function FreshStart() {
  useEffect(() => {
    // Force logout and clear all auth state
    const clearAuthState = async () => {
      try {
        // Sign out from Supabase
        await supabase.auth.signOut()
        
        // Clear local storage
        localStorage.clear()
        sessionStorage.clear()
        
        // Clear any auth cookies
        document.cookie.split(";").forEach(function(c) { 
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        })
        
        console.log('Auth state cleared successfully')
      } catch (error) {
        console.log('Clearing auth state:', error)
      }
    }
    
    clearAuthState()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <div className="glass-card p-8 text-center">
          <h1 className="text-3xl font-bold glow-text mb-4">🆕 Fresh Start</h1>
          <p className="text-white/70 mb-6">All previous authentication has been cleared.</p>
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg">
              <p className="text-green-300 font-bold">✅ Auth State Cleared</p>
              <p className="text-sm text-green-200">You can now create a new account</p>
            </div>
            <LoginPage />
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FreshStart />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)