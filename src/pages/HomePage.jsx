import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext-clean'
import { Calendar, Star, Search, Shield, Github, Linkedin } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-400" />,
      title: "Discover Real Events",
      description: "Search through millions of real events using the Ticketmaster API. Find concerts, sports events, theater shows, and more."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-400" />,
      title: "Track Your Experiences",
      description: "Add events you've attended to your personal collection. Keep track of all the amazing experiences you've had."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: "Rate & Remember",
      description: "Rate your experiences from 1-10 and build your personal event history. Sort by rating, date, or category to relive your favorites."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Secure & Private",
      description: "Your data is stored securely with Supabase. Only you can see your events and ratings unless you choose to share."
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16">
        <h1 className="text-5xl md:text-7xl font-bold glow-text">
          Event No
          <Link to="/snake" className="hover:animate-pulse inline-block">
            s
          </Link>
          talgia
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          Relive your concert memories and discover new events to attend. Search past shows for nostalgia, 
          upcoming events to plan, and build your personal archive of musical experiences.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {user ? (
            <div className="space-x-4">
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-4">
                Go to Dashboard
              </Link>
              <Link to="/search" className="btn-secondary text-lg px-8 py-4">
                Search Events
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4">
                Get Started
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-8 space-y-4">
            <div className="flex items-center space-x-4">
              {feature.icon}
              <h3 className="text-2xl font-semibold text-white">
                {feature.title}
              </h3>
            </div>
            <p className="text-white/70 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* How it Works */}
      <div className="glass-card p-8 space-y-6">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold text-white">Search Real Events</h3>
            <p className="text-white/70">
              Use our search to find concerts, sports events, theater shows, and festivals from the Ticketmaster database.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold text-white">Add to Collection</h3>
            <p className="text-white/70">
              Add events you've attended to your personal collection with details about your experience.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold text-white">Rate & Relive</h3>
            <p className="text-white/70">
              Rate your experiences, add notes, and sort your collection to easily find your favorite memories.
            </p>
          </div>
        </div>
      </div>

      {/* Easter Egg Hint */}
      <div className="glass-card p-6 text-center">
        <p className="text-white/60 text-sm">
          💡 Hint: Click the 'S' in "Event Nostalgia" for a fun surprise! 🐍
        </p>
      </div>

      {/* Footer */}
      <footer className="text-center space-y-4 py-8 border-t border-white/10">
        <div className="flex justify-center space-x-6">
          <a 
            href="https://www.linkedin.com/in/logan-nitzsche" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
          >
            <Linkedin size={24} />
          </a>
          <a 
            href="https://github.com/lmnitzsche" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors"
          >
            <Github size={24} />
          </a>
        </div>
        <p className="text-white/50 text-sm">
          Built with React, Supabase, and the Ticketmaster Discovery API
        </p>
        <p className="text-white/40 text-xs">
          © {new Date().getFullYear()} Event Nostalgia. Made with ❤️ by Logan Nitzsche
        </p>
      </footer>
    </div>
  )
}