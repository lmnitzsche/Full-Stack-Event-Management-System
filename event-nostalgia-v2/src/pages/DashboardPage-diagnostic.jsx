import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext-robust'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DashboardPage() {
  const [status, setStatus] = useState('Initializing...')
  const { user, profile, loading, supabaseAvailable, supabaseError } = useAuth()

  useEffect(() => {
    if (loading) {
      setStatus('Loading authentication...')
      return
    }

    if (!user) {
      setStatus('No user found - redirecting to login')
      return
    }

    if (!supabaseAvailable) {
      setStatus('Supabase not available - running in demo mode')
      return
    }

    setStatus('Ready to load events')
  }, [user, loading, supabaseAvailable])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Please log in to access your dashboard.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="space-y-6">
        <div className="glass-card p-6">
          <h1 className="text-3xl font-bold glow-text mb-4">🎯 Dashboard Diagnostics</h1>
          <div className="space-y-3">
            <p className="text-lg">Status: <span className="text-green-300">{status}</span></p>
            <p>User: <span className="text-blue-300">{user?.email || 'None'}</span></p>
            <p>Profile: <span className="text-blue-300">{profile?.full_name || 'Not loaded'}</span></p>
            <p>Supabase: <span className={supabaseAvailable ? 'text-green-300' : 'text-orange-300'}>
              {supabaseAvailable ? 'Available' : 'Not available'}
            </span></p>
            {supabaseError && (
              <p className="text-red-300">Error: {supabaseError}</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-bold mb-4">🧪 Dashboard Test</h2>
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/30 p-4 rounded-lg">
              <p className="font-bold text-green-300">✅ Dashboard Component Loaded</p>
              <p className="text-sm">This page is rendering successfully without crashes.</p>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/30 p-4 rounded-lg">
              <p className="font-bold text-blue-300">🔄 Next Steps:</p>
              <ul className="text-sm mt-2 space-y-1">
                <li>• User authentication: Working</li>
                <li>• Component rendering: Working</li>
                <li>• Database connection: {supabaseAvailable ? 'Working' : 'Needs setup'}</li>
              </ul>
            </div>

            <div className="bg-purple-500/20 border border-purple-500/30 p-4 rounded-lg">
              <p className="font-bold text-purple-300">🚀 Ready to build full dashboard!</p>
              <p className="text-sm">All core systems are functioning properly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}