import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext-fixed'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { Plus, Calendar, Star, User } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const { user, profile, supabaseAvailable, signOut } = useAuth()

  useEffect(() => {
    if (user && supabaseAvailable) {
      initializeDashboard()
    } else {
      setLoading(false)
    }
  }, [user, supabaseAvailable])

  const initializeDashboard = async () => {
    try {
      // If no profile exists, create one
      if (!profile && supabaseAvailable) {
        await createUserProfile()
      }
      
      // Load user events
      await fetchUserEvents()
    } catch (error) {
      console.error('Dashboard initialization error:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const createUserProfile = async () => {
    setProfileLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email.split('@')[0],
          }
        ])
        .select()

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        throw error
      }
      
      toast.success('Profile created successfully!')
    } catch (error) {
      console.error('Error creating profile:', error)
      toast.error('Profile creation failed, but you can still use the app')
    } finally {
      setProfileLoading(false)
    }
  }

  const fetchUserEvents = async () => {
    if (!supabaseAvailable) return

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load your events')
      setEvents([])
    }
  }

  const deleteEvent = async (eventId) => {
    if (!supabaseAvailable) {
      toast.error('Database not available')
      return
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      setEvents(events.filter(event => event.id !== eventId))
      toast.success('Event deleted successfully')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
        <div className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please Log In</h1>
          <p className="mb-4">You need to be logged in to access your dashboard.</p>
          <Link 
            to="/login" 
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold glow-text">
                Welcome back, {profile?.full_name || user.email?.split('@')[0]}!
              </h1>
              <p className="text-white/70 mt-2">
                Manage your saved events and memories
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {profileLoading && (
                <div className="flex items-center space-x-2 text-white/70">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">Setting up profile...</span>
                </div>
              )}
              <Link
                to="/search"
                className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Add Event</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="text-blue-400" size={24} />
              <div>
                <h3 className="text-lg font-semibold">Total Events</h3>
                <p className="text-2xl font-bold text-blue-400">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <Star className="text-yellow-400" size={24} />
              <div>
                <h3 className="text-lg font-semibold">Average Rating</h3>
                <p className="text-2xl font-bold text-yellow-400">
                  {events.length > 0 
                    ? (events.reduce((sum, event) => sum + parseFloat(event.rating || 0), 0) / events.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center space-x-3">
              <User className="text-green-400" size={24} />
              <div>
                <h3 className="text-lg font-semibold">Account Status</h3>
                <p className="text-2xl font-bold text-green-400">
                  {supabaseAvailable ? 'Connected' : 'Demo Mode'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Events</h2>
            {!supabaseAvailable && (
              <div className="text-sm text-orange-300 bg-orange-500/20 px-3 py-1 rounded-lg">
                Demo Mode - Database not available
              </div>
            )}
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No events yet</h3>
              <p className="text-white/70 mb-4">
                Start building your event collection by searching for concerts and events!
              </p>
              <Link
                to="/search"
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg inline-flex items-center space-x-2 transition-colors"
              >
                <Plus size={20} />
                <span>Find Events</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="glass-card p-4 hover:bg-white/5 transition-colors">
                  <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                  <p className="text-white/70 mb-2">{event.venue}</p>
                  <p className="text-white/70 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400" />
                      <span className="text-yellow-400">{event.rating}/10</span>
                    </div>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}