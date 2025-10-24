import React, { useState, useEffect } from 'react'
import { TicketmasterAPI, mockEvents } from '../services/eventApi'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext-clean'
import SearchBar from '../components/SearchBar'
import EventCard from '../components/EventCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, AlertCircle, MapPin } from 'lucide-react'

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)
  const [lastSearchParams, setLastSearchParams] = useState(null)
  const [useApiKey, setUseApiKey] = useState(false)
  const [savedEvents, setSavedEvents] = useState(new Set())
  const [apiStatus, setApiStatus] = useState('working') // 'working', 'rate-limited', 'error'
  const { user } = useAuth()

  // Check if API key is available
  useEffect(() => {
    const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY
    setUseApiKey(apiKey && apiKey !== 'your_ticketmaster_api_key_here')
  }, [])

  // Load user's saved events to track which ones are already saved
  useEffect(() => {
    if (user) {
      loadSavedEvents()
    }
  }, [user])

  const loadSavedEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('event_id')
        .eq('user_id', user.id)

      if (error) throw error

      const savedEventIds = new Set(data.map(event => event.event_id))
      setSavedEvents(savedEventIds)
    } catch (error) {
      console.error('Error loading saved events:', error)
    }
  }

  const handleSearch = async (searchParams, page = 0) => {
    setLoading(true)
    setLastSearchParams(searchParams)
    setCurrentPage(page)

    try {
      let results
      
      if (useApiKey) {
        // Use real Ticketmaster API
        const additionalParams = {}
        
        // Map category to Ticketmaster classificationName
        if (searchParams.category) {
          additionalParams.classificationName = searchParams.category
        }

        // Only show events from today onwards
        const today = new Date()
        const todayISO = today.toISOString().split('.')[0] + 'Z'
        additionalParams.startDateTime = todayISO
        
        const response = await TicketmasterAPI.searchEvents(
          searchParams.query,
          searchParams.location,
          21,
          page,
          additionalParams
        )
        
        results = {
          events: response.events
            .map(event => TicketmasterAPI.transformEvent(event))
            .filter(event => {
              // Filter out events without URLs and past events
              const hasUrl = event.url && event.url.trim() !== ''
              const eventDate = new Date(event.date)
              const isUpcoming = eventDate >= today
              return hasUrl && isUpcoming
            }),
          totalPages: response.totalPages,
          totalElements: response.totalElements
        }
      } else {
        // Use mock data for demo
        const filteredMockEvents = mockEvents.filter(event => {
          const matchesSearch = event.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchParams.query.toLowerCase()) ||
            (event.genre && event.genre.toLowerCase().includes(searchParams.query.toLowerCase()))
          
          const hasValidUrl = event.url && event.url.trim() !== ''
          
          return matchesSearch && hasValidUrl
        })
        
        results = {
          events: filteredMockEvents,
          totalPages: 1,
          totalElements: filteredMockEvents.length
        }
      }

      setSearchResults(results.events)
      setTotalPages(results.totalPages)
      setTotalResults(results.totalElements)
      setApiStatus('working') // Reset status on successful search
      
      if (results.events.length === 0) {
        toast('No events found. Try different search terms.', { icon: '🔍' })
      }
    } catch (error) {
      console.error('Search error:', error)
      
      // Update API status based on error type
      if (error.message.includes('Rate limit exceeded')) {
        setApiStatus('rate-limited')
        toast.error('⏱️ Too many API requests. Please wait a few minutes and try again.')
      } else if (error.message.includes('quota exceeded')) {
        setApiStatus('rate-limited')
        toast.error('📊 Daily API quota reached. Using cached results instead.')
      } else if (error.message.includes('API key invalid')) {
        setApiStatus('error')
        toast.error('🔑 API configuration issue. Contact support.')
      } else {
        setApiStatus('error')
        toast.error('🔍 Search temporarily unavailable. Showing sample events instead.')
      }
      
      // Fallback to mock data if API fails
      if (useApiKey) {
        console.log('Falling back to mock data due to API error')
        const filteredMockEvents = mockEvents.filter(event => 
          event.name.toLowerCase().includes(searchParams.query.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchParams.query.toLowerCase())
        )
        setSearchResults(filteredMockEvents)
        setTotalPages(1)
        setTotalResults(filteredMockEvents.length)
      }
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (lastSearchParams && newPage >= 0 && newPage < totalPages) {
      handleSearch(lastSearchParams, newPage)
    }
  }

  const handleAddEvent = async (event) => {
    try {
      const eventData = {
        user_id: user.id,
        event_id: event.id,
        name: event.name,
        venue: event.venue,
        date: event.date,
        description: `${event.genre ? `Genre: ${event.genre}` : ''}${event.city ? ` • Location: ${event.city}` : ''}${event.state ? `, ${event.state}` : ''}`,
        rating: 5, // Default rating for saved events
        category: event.category || 'other',
        api_data: event.apiData || event
      }

      const { error } = await supabase
        .from('events')
        .insert([eventData])

      if (error) throw error

      // Update saved events state
      setSavedEvents(prev => new Set([...prev, event.id]))
      toast.success('Event saved to your dashboard!')
    } catch (error) {
      console.error('Error adding event:', error)
      if (error.code === '23505') {
        toast.error('You have already saved this event.')
      } else {
        toast.error('Failed to save event. Please try again.')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Discover the Galaxy of Events</h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Use the Force to find events across the galaxy. Add them to your collection to continue your journey toward mastery.
        </p>
      </div>

      {!useApiKey && (
        <div className="glass-card p-4 border-yellow-500/30 bg-yellow-500/10">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-yellow-400 mt-0.5" size={20} />
            <div className="space-y-2">
              <p className="text-yellow-200 font-medium">Demo Mode</p>
              <p className="text-yellow-200/80 text-sm">
                You're currently viewing mock data. To search real events, add your Ticketmaster API key to the environment variables.
                Get your free API key at <a href="https://developer.ticketmaster.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-100">developer.ticketmaster.com</a>
              </p>
            </div>
          </div>
        </div>
      )}

      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* City Suggestions */}
      <div className="glass-card p-4">
        <div className="flex items-center space-x-3 mb-3">
          <MapPin size={18} className="text-white/50" />
          <span className="text-white/70 font-medium">Popular Cities:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Los Angeles, CA', 'New York, NY', 'Boston, MA', 'Chicago, IL', 'St. Louis, MO', 'Cincinnati, OH', 'Tampa, FL', 'Austin, TX', 'Houston, TX', 'Nashville, TN'].map((city) => (
            <button
              key={city}
              onClick={() => handleSearch({ query: '', location: city, category: '' })}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-sm text-white/80 hover:text-white transition-colors"
              disabled={loading}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {loading && <LoadingSpinner />}

      {searchResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-white/70">
              Found {totalResults.toLocaleString()} events
              {lastSearchParams?.query && ` for "${lastSearchParams.query}"`}
            </p>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0 || loading}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                
                <span className="text-white/70">
                  Page {currentPage + 1} of {totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1 || loading}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((event, index) => (
              <EventCard
                key={`${event.id}-${index}`}
                event={event}
                onRate={handleAddEvent}
                showActions={true}
                isSaved={savedEvents.has(event.id)}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && searchResults.length === 0 && lastSearchParams && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">
            No events found. Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  )
}