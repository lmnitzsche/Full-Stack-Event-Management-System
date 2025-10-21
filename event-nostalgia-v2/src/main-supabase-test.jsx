import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext-robust.jsx'
import { useAuth } from './contexts/AuthContext-robust.jsx'
import './index.css'

function AuthTestComponent() {
  const { user, loading, supabaseAvailable, supabaseError } = useAuth()
  
  return (
    <div className="glass-card p-4">
      <h3 className="font-bold mb-2">🔄 Step 2: Supabase Connection</h3>
      <div className="space-y-2">
        <p className={`text-sm ${supabaseAvailable ? 'text-green-300' : 'text-orange-300'}`}>
          Status: {loading ? 'Testing...' : supabaseAvailable ? '✅ Connected' : '⚠️ Demo Mode'}
        </p>
        <p className="text-sm">User: {user ? `✅ Logged in as ${user.email}` : '❌ Not logged in'}</p>
        {supabaseError && (
          <p className="text-sm text-red-300">Error: {supabaseError}</p>
        )}
        <div className="mt-4 p-2 bg-green-500/20 rounded">
          <p className="text-green-300 font-bold">🎉 Success!</p>
          <p className="text-sm">No white screen = AuthContext is working!</p>
        </div>
      </div>
    </div>
  )
}

function SupabaseConnectionTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <h1 className="text-4xl font-bold glow-text mb-4">🔌 Supabase Connection Test</h1>
      <div className="space-y-4">
        <div className="glass-card p-4">
          <h3 className="font-bold mb-2">✅ Step 1: API Keys Loaded</h3>
          <p className="text-sm">URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Ready' : '❌ Missing'}</p>
          <p className="text-sm">Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Ready' : '❌ Missing'}</p>
        </div>
        
        <AuthTestComponent />
        
        <div className="glass-card p-4 bg-blue-500/20 border-blue-500/30">
          <p className="font-bold">🚀 Ready for full app!</p>
          <p className="text-sm mt-1">If you can see this, we can now test individual components.</p>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SupabaseConnectionTest />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)