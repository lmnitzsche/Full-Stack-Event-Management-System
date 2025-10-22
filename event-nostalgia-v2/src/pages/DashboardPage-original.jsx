import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext-robust'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { Plus, Calendar, Star, Filter, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('date')
  const [filterCategory, setFilterCategory] = useState('')
  const [stats, setStats] = useState({
    totalEvents: 0,
    averageRating: 0,
    topCategory: ''
  })
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUserEvents()
    }
  }, [user])

  useEffect(() => {
    calculateStats()
  }, [events])

  const fetchUserEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      toast.error('Failed to load your events')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    if (events.length === 0) {
      setStats({ totalEvents: 0, averageRating: 0, topCategory: '' })
      return
    }

    const totalRating = events.reduce((sum, event) => sum + (event.rating || 0), 0)
    const averageRating = totalRating / events.length

    // Find most common category
    const categoryCount = {}
    events.forEach(event => {
      const category = event.category || 'other'
      categoryCount[category] = (categoryCount[category] || 0) + 1
    })
    const topCategory = Object.entries(categoryCount).reduce((a, b) => 
      categoryCount[a[0]] > categoryCount[b[0]] ? a : b
    )?.[0] || ''

    setStats({
      totalEvents: events.length,
      averageRating: Math.round(averageRating * 10) / 10,
      topCategory: topCategory.charAt(0).toUpperCase() + topCategory.slice(1)
    })
  }

  const handleUpdateEvent = async (eventId, updates) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .eq('user_id', user.id)

      if (error) throw error

      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      ))

      toast.success('Event updated successfully!')
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update event')
    }
  }

  const handleDeleteEvent = async (event) => {
    if (window.confirm(`Are you sure you want to remove "${event.name}" from your collection?`)) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', event.id)
          .eq('user_id', user.id)

        if (error) throw error

        setEvents(prev => prev.filter(e => e.id !== event.id))
        toast.success('Event removed from your collection')
      } catch (error) {
        console.error('Error deleting event:', error)
        toast.error('Failed to remove event')
      }
    }
  }

  const handleRateEvent = async (event, rating) => {
    await handleUpdateEvent(event.id, { rating })
  }

  const getFilteredAndSortedEvents = () => {
    let filtered = events

    if (filterCategory) {
      filtered = filtered.filter(event => event.category === filterCategory)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
        default:
          return new Date(b.date) - new Date(a.date)
      }
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const displayEvents = getFilteredAndSortedEvents()

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Welcome back, {profile?.full_name || user.email?.split('@')[0]}!
        </h1>
        <p className="text-white/70">
          Here's your personal collection of events and experiences.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center space-y-2">
          <Calendar className="w-8 h-8 text-blue-400 mx-auto" />
          <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
          <p className="text-white/70">Events Attended</p>
        </div>
        
        <div className="glass-card p-6 text-center space-y-2">
          <Star className="w-8 h-8 text-yellow-400 mx-auto" />
          <p className="text-2xl font-bold text-white">
            {stats.averageRating > 0 ? `${stats.averageRating}/10` : 'N/A'}
          </p>
          <p className="text-white/70">Average Rating</p>
        </div>
        
        <div className="glass-card p-6 text-center space-y-2">
          <Filter className="w-8 h-8 text-purple-400 mx-auto" />
          <p className="text-2xl font-bold text-white">{stats.topCategory || 'N/A'}</p>
          <p className="text-white/70">Top Category</p>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
          <Link
            to="/search"
            className="btn-primary flex items-center space-x-2"
          >
            <Plus size={18} />
            <span>Add New Event</span>
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-white/70">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date" className="bg-slate-800">Date (Newest)</option>
                <option value="rating" className="bg-slate-800">Rating (Highest)</option>
                <option value="name" className="bg-slate-800">Name (A-Z)</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-white/70">Filter:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="bg-slate-800">All Categories</option>
                <option value="concert" className="bg-slate-800">Concerts</option>
                <option value="festival" className="bg-slate-800">Festivals</option>
                <option value="sports" className="bg-slate-800">Sports</option>
                <option value="theater" className="bg-slate-800">Theater</option>
                <option value="other" className="bg-slate-800">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {displayEvents.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userRating={event.rating}
              onRate={handleRateEvent}
              onDelete={handleDeleteEvent}
              showActions={true}
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <Calendar className="w-16 h-16 text-white/30 mx-auto" />
          <h3 className="text-2xl font-semibold text-white">No Events Yet</h3>
          <p className="text-white/70 max-w-md mx-auto">
            Start building your collection by searching for events you've attended and adding them to your personal archive.
          </p>
          <Link to="/search" className="btn-primary inline-flex items-center space-x-2">
            <Plus size={18} />
            <span>Find Your First Event</span>
          </Link>
        </div>
      ) : (
        <div className="glass-card p-8 text-center">
          <p className="text-white/70">
            No events match your current filters. Try adjusting your filter criteria.
          </p>
        </div>
      )}
    </div>
  )
}