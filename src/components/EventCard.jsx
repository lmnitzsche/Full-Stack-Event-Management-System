import React from 'react'
import { Star, Calendar, MapPin, ExternalLink, Check } from 'lucide-react'
import { format } from 'date-fns'

export default function EventCard({ event, onRate, onDelete, showActions = true, userRating, isSaved = false }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch {
      return dateString
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      concert: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      festival: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      sports: 'bg-green-500/20 text-green-300 border-green-500/30',
      theater: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      film: 'bg-red-500/20 text-red-300 border-red-500/30',
      comedy: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      family: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      other: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[category] || colors.other
  }

  return (
    <div className="glass-card p-6 hover:scale-105 transition-all duration-300">
      {event.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img 
            src={event.image} 
            alt={event.name}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-white line-clamp-2">
            {event.name}
          </h3>
          {event.url && (
            <a 
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>

        <div className="flex items-center space-x-4 text-sm text-white/70">
          <div className="flex items-center space-x-1">
            <Calendar size={16} />
            <span>{formatDate(event.date)}</span>
            {event.time && <span>• {event.time}</span>}
          </div>
        </div>

        <div className="flex items-center space-x-1 text-sm text-white/70">
          <MapPin size={16} />
          <span>{event.venue}</span>
          {event.city && <span>• {event.city}</span>}
          {event.state && <span>, {event.state}</span>}
        </div>

        {event.category && (
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(event.category)}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        )}

        {event.genre && (
          <p className="text-sm text-white/60">
            Genre: {event.genre}
          </p>
        )}

        {event.description && (
          <p className="text-sm text-white/70 line-clamp-3">
            {event.description}
          </p>
        )}

        {userRating && (
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-yellow-400 font-medium">{userRating}/10</span>
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-between pt-4">
            {onRate && (
              isSaved ? (
                <button
                  disabled
                  className="bg-green-600 text-white px-4 py-2 text-sm flex items-center space-x-2 rounded-lg cursor-not-allowed opacity-80"
                >
                  <Check size={16} />
                  <span>Saved</span>
                </button>
              ) : (
                <button
                  onClick={() => onRate(event)}
                  className="btn-primary px-4 py-2 text-sm flex items-center space-x-2"
                >
                  <Calendar size={16} />
                  <span>Save to Dashboard</span>
                </button>
              )
            )}
            
            {onDelete && (
              <button
                onClick={() => onDelete(event)}
                className="text-red-400 hover:text-red-300 text-sm transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        )}

        {event.priceRanges && (
          <div className="text-xs text-white/60 pt-2 border-t border-white/10">
            Price: ${event.priceRanges[0]?.min} - ${event.priceRanges[0]?.max}
          </div>
        )}
      </div>
    </div>
  )
}