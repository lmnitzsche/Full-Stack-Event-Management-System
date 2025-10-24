import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext-clean'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { ArrowLeft, Calendar, MapPin, ExternalLink, Save, Edit3 } from 'lucide-react'

export default function EventDetailsPage() {
  const { eventId } = useParams()
  const { user, supabaseAvailable } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (eventId && user && supabaseAvailable) {
      fetchEventDetails()
    }
  }, [eventId, user, supabaseAvailable])

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      
      setEvent(data)
      setNotes(data.notes || '')
    } catch (error) {
      console.error('Error fetching event:', error)
      toast.error('Event not found or access denied')
    } finally {
      setLoading(false)
    }
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      const { error } = await supabase
        .from('events')
        .update({ notes })
        .eq('id', eventId)
        .eq('user_id', user.id)

      if (error) throw error

      setEvent(prev => ({ ...prev, notes }))
      setIsEditingNotes(false)
      toast.success('Notes saved successfully!')
    } catch (error) {
      console.error('Error saving notes:', error)
      toast.error('Failed to save notes')
    } finally {
      setSavingNotes(false)
    }
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
        <p className="text-white/70 mb-6">The event you're looking for doesn't exist or you don't have access to it.</p>
        <Link to="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link 
          to="/dashboard" 
          className="text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-3xl font-bold text-white">Event Details</h1>
      </div>

      {/* Event Info */}
      <div className="glass-card p-8 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">{event.name}</h2>
          
          <div className="flex items-center space-x-4 text-white/70">
            <div className="flex items-center space-x-2">
              <Calendar size={18} />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={18} />
              <span>{event.venue}</span>
            </div>
          </div>

          {event.description && (
            <p className="text-white/80">{event.description}</p>
          )}

          {/* Ticketmaster Data */}
          {event.api_data && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Event Information</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {event.api_data.genre && (
                  <div>
                    <span className="text-white/50">Genre:</span>
                    <span className="text-white ml-2">{event.api_data.genre}</span>
                  </div>
                )}
                {event.api_data.city && (
                  <div>
                    <span className="text-white/50">City:</span>
                    <span className="text-white ml-2">{event.api_data.city}, {event.api_data.state}</span>
                  </div>
                )}
                {event.api_data.time && (
                  <div>
                    <span className="text-white/50">Start Time:</span>
                    <span className="text-white ml-2">{event.api_data.time}</span>
                  </div>
                )}
                {event.api_data.priceRanges && event.api_data.priceRanges[0] && (
                  <div>
                    <span className="text-white/50">Price Range:</span>
                    <span className="text-white ml-2">
                      ${event.api_data.priceRanges[0].min} - ${event.api_data.priceRanges[0].max}
                    </span>
                  </div>
                )}
              </div>

              {event.api_data.url && (
                <div className="mt-4">
                  <a
                    href={event.api_data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center space-x-2"
                  >
                    <ExternalLink size={18} />
                    <span>View on Ticketmaster</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Notes</h3>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="btn-secondary px-4 py-2 text-sm flex items-center space-x-2"
            >
              <Edit3 size={16} />
              <span>Edit Notes</span>
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this event..."
              className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex items-center space-x-3">
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="btn-primary px-4 py-2 text-sm flex items-center space-x-2 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingNotes ? 'Saving...' : 'Save Notes'}</span>
              </button>
              <button
                onClick={() => {
                  setIsEditingNotes(false)
                  setNotes(event.notes || '')
                }}
                className="btn-secondary px-4 py-2 text-sm"
                disabled={savingNotes}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="min-h-32">
            {notes ? (
              <p className="text-white/80 whitespace-pre-wrap">{notes}</p>
            ) : (
              <p className="text-white/50 italic">No notes added yet. Click "Edit Notes" to add your thoughts about this event.</p>
            )}
          </div>
        )}
      </div>

      {/* Event Image */}
      {event.api_data?.image && (
        <div className="glass-card p-8">
          <h3 className="text-xl font-semibold text-white mb-4">Event Image</h3>
          <div className="rounded-lg overflow-hidden">
            <img 
              src={event.api_data.image} 
              alt={event.name}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}