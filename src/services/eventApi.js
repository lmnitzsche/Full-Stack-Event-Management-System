// Ticketmaster Discovery API Service
const TICKETMASTER_API_BASE = 'https://app.ticketmaster.com/discovery/v2'
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY

export class TicketmasterAPI {
  static async searchEvents(query, location = '', size = 20, page = 0, additionalParams = {}) {
    try {
      const params = new URLSearchParams({
        apikey: API_KEY,
        size: size.toString(),
        page: page.toString(),
        sort: additionalParams.sort || 'date,desc' // Default to newest first
      })
      
      // Add keyword if provided
      if (query && query.trim()) {
        params.append('keyword', query.trim())
      }
      
      // Add location if provided
      if (location && location.trim()) {
        params.append('city', location.trim())
      }
      
      // Add date range for historical search
      if (additionalParams.startDateTime) {
        params.append('startDateTime', additionalParams.startDateTime)
      } else {
        // Default to search from 20 years ago to allow historical events
        const twentyYearsAgo = new Date()
        twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20)
        // Format without milliseconds: YYYY-MM-DDTHH:mm:ssZ (Ticketmaster requirement)
        const formattedDate = twentyYearsAgo.toISOString().split('.')[0] + 'Z'
        params.append('startDateTime', formattedDate)
      }
      
      if (additionalParams.endDateTime) {
        params.append('endDateTime', additionalParams.endDateTime)
      }
      
      // Add category filter
      if (additionalParams.classificationName) {
        params.append('classificationName', additionalParams.classificationName)
      }
      
      const response = await fetch(`${TICKETMASTER_API_BASE}/events.json?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return {
        events: data._embedded?.events || [],
        totalPages: data.page?.totalPages || 1,
        totalElements: data.page?.totalElements || 0
      }
    } catch (error) {
      console.error('Error searching events:', error)
      throw error
    }
  }
  
  static async getEventDetails(eventId) {
    try {
      const response = await fetch(`${TICKETMASTER_API_BASE}/events/${eventId}.json?apikey=${API_KEY}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching event details:', error)
      throw error
    }
  }
  
  static async searchVenues(query, location = '', size = 20) {
    try {
      const params = new URLSearchParams({
        apikey: API_KEY,
        keyword: query,
        size: size.toString()
      })
      
      if (location) {
        params.append('city', location)
      }
      
      const response = await fetch(`${TICKETMASTER_API_BASE}/venues.json?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data._embedded?.venues || []
    } catch (error) {
      console.error('Error searching venues:', error)
      throw error
    }
  }
  
  // Transform Ticketmaster event to our format
  static transformEvent(tmEvent) {
    const venue = tmEvent._embedded?.venues?.[0]
    const classification = tmEvent.classifications?.[0]
    
    return {
      id: tmEvent.id,
      name: tmEvent.name,
      date: tmEvent.dates?.start?.localDate,
      time: tmEvent.dates?.start?.localTime,
      venue: venue?.name || 'Unknown Venue',
      city: venue?.city?.name,
      state: venue?.state?.stateCode,
      category: this.mapCategory(classification?.segment?.name),
      genre: classification?.genre?.name,
      image: tmEvent.images?.find(img => img.width >= 640)?.url || tmEvent.images?.[0]?.url,
      url: tmEvent.url,
      priceRanges: tmEvent.priceRanges,
      apiData: tmEvent
    }
  }
  
  static mapCategory(segmentName) {
    const categoryMap = {
      'Music': 'concert',
      'Sports': 'sports',
      'Arts & Theatre': 'theater',
      'Film': 'film',
      'Comedy': 'comedy',
      'Family': 'family',
      'Miscellaneous': 'concert' // Map Miscellaneous to concert as fallback
    }
    return categoryMap[segmentName] || 'concert' // Default to concert for unknown categories
  }
}

// Backup/Alternative API services for when Ticketmaster is unavailable
export class EventbriteAPI {
  static async searchEvents(query, location = '', size = 20) {
    // Implementation for Eventbrite API
    // This would require OAuth setup
    console.log('Eventbrite API not implemented yet')
    return { events: [], totalPages: 0, totalElements: 0 }
  }
}

// Mock data for development/fallback
export const mockEvents = [
  {
    id: 'mock-1',
    name: 'Summer Music Festival 2024',
    date: '2024-07-15',
    venue: 'Central Park',
    city: 'New York',
    state: 'NY',
    category: 'festival',
    genre: 'Rock',
    image: 'https://via.placeholder.com/640x360?text=Summer+Music+Festival'
  },
  {
    id: 'mock-2',
    name: 'Broadway Show - Hamilton',
    date: '2024-08-20',
    venue: 'Richard Rodgers Theatre',
    city: 'New York',
    state: 'NY',
    category: 'theater',
    genre: 'Musical',
    image: 'https://via.placeholder.com/640x360?text=Hamilton'
  },
  {
    id: 'mock-3',
    name: 'NBA Finals Game 7',
    date: '2024-06-18',
    venue: 'Madison Square Garden',
    city: 'New York',
    state: 'NY',
    category: 'sports',
    genre: 'Basketball',
    image: 'https://via.placeholder.com/640x360?text=NBA+Finals'
  }
]