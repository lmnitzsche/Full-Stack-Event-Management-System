import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext-clean'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { Plus, Calendar, Star, User, Edit3, Check, X, ArrowUpDown } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [sortBy, setSortBy] = useState('date-desc') // 'date-desc', 'date-asc', 'rating-desc', 'rating-asc', 'name-asc'
  const [editingRating, setEditingRating] = useState(null)
  const { user, profile, supabaseAvailable, signOut } = useAuth()

  useEffect(() => {
    if (user && supabaseAvailable) {
      initializeDashboard()
    } else {
      setLoading(false)
    }
  }, [user, supabaseAvailable])

  // Re-sort events when sort option changes
  useEffect(() => {
    fetchUserEvents()
  }, [sortBy])

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
      
      // Profile created silently - no need to notify user
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

      if (error) throw error
      
      // Sort events based on current sort option
      const sortedEvents = sortEvents(data || [], sortBy)
      setEvents(sortedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load your events')
      setEvents([])
    }
  }

  const sortEvents = (eventsArray, sortOption) => {
    const sorted = [...eventsArray]
    
    switch (sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date) - new Date(b.date))
      case 'rating-desc':
        return sorted.sort((a, b) => (b.rating || 1) - (a.rating || 1))
      case 'rating-asc':
        return sorted.sort((a, b) => (a.rating || 1) - (b.rating || 1))
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy)
    setEvents(prevEvents => sortEvents(prevEvents, newSortBy))
  }

  const updateEventRating = async (eventId, newRating) => {
    if (!supabaseAvailable) {
      toast.error('Database not available')
      return
    }

    try {
      const { error } = await supabase
        .from('events')
        .update({ rating: newRating })
        .eq('id', eventId)

      if (error) throw error

      // Update local state
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, rating: newRating }
            : event
        )
      )

      toast.success('Rating updated!')
      setEditingRating(null)
    } catch (error) {
      console.error('Error updating rating:', error)
      toast.error('Failed to update rating')
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
                Welcome back, {profile?.full_name || user?.user_metadata?.full_name || user.email?.split('@')[0]}!
              </h1>
              <p className="text-white/70 mt-2">
                Manage your upcoming events and plans
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
                    ? (events.reduce((sum, event) => sum + parseFloat(event.rating || 1), 0) / events.length).toFixed(1)
                    : '1.0'
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold">Your Events</h2>
            <div className="flex items-center space-x-4">
              {events.length > 0 && (
                <div className="flex items-center space-x-2">
                  <ArrowUpDown size={16} className="text-white/50" />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="date-desc" className="bg-slate-800">Newest First</option>
                    <option value="date-asc" className="bg-slate-800">Oldest First</option>
                    <option value="rating-desc" className="bg-slate-800">Highest Rated</option>
                    <option value="rating-asc" className="bg-slate-800">Lowest Rated</option>
                    <option value="name-asc" className="bg-slate-800">Name (A-Z)</option>
                  </select>
                </div>
              )}
              {!supabaseAvailable && (
                <div className="text-sm text-orange-300 bg-orange-500/20 px-3 py-1 rounded-lg">
                  Demo Mode - Database not available
                </div>
              )}
            </div>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No events yet</h3>
              <p className="text-white/70 mb-4">
                Start planning your next adventure by searching for upcoming events!
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
                  {event.description && (
                    <p className="text-white/60 text-sm mb-3 line-clamp-2">{event.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-4">
                    {/* Editable Rating */}
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-400" />
                      {editingRating === event.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            step="0.1"
                            defaultValue={event.rating || 1}
                            className="w-16 px-2 py-1 text-sm bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseFloat(e.target.value)
                                if (value >= 1 && value <= 10) {
                                  updateEventRating(event.id, value)
                                }
                              }
                              if (e.key === 'Escape') {
                                setEditingRating(null)
                              }
                            }}
                            autoFocus
                            onBlur={(e) => {
                              const value = parseFloat(e.target.value)
                              if (value >= 1 && value <= 10) {
                                updateEventRating(event.id, value)
                              } else {
                                setEditingRating(null)
                              }
                            }}
                          />
                          <button
                            onClick={() => setEditingRating(null)}
                            className="text-white/50 hover:text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">{event.rating || 1}/10</span>
                          <button
                            onClick={() => setEditingRating(event.id)}
                            className="text-white/50 hover:text-white ml-2"
                          >
                            <Edit3 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      disabled={editingRating === event.id}
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