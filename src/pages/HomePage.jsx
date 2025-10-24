import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext-clean'
import { Calendar, Star, Search, Shield, Github, Linkedin } from 'lucide-react'

export default function HomePage() {
  const { user } = useAuth()

  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-400" />,
      title: "Discover the Galaxy",
      description: "Use the Force to search through millions of events across the galaxy using the Ticketmaster API. Find concerts, sports events, theater shows, and more."
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-400" />,
      title: "Plan Your Journey",
      description: "A Padawan must plan ahead. Save upcoming events you want to attend and build your personal collection of future adventures."
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: "Master Organization",
      description: "Organize your planned events by category, date, or personal notes. Track your path to event planning mastery."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Secure & Protected",
      description: "Your data is protected by the strongest encryption this side of the galaxy. Only you can access your event collection."
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16 float-animation">
        <h1 className="text-5xl md:text-7xl font-bold glow-text">
          Ticket Padawan
        </h1>
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
          Master your event planning journey. Discover upcoming events and track what you plan to attend. 
          Search for concerts, sports, theater shows and more, then save them to build your personal event collection.
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
          Your Path to Mastery
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold text-white">Search the Galaxy</h3>
            <p className="text-white/70">
              Use your powers to find upcoming concerts, sports events, theater shows, and festivals from across the galaxy.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold text-white">Build Your Collection</h3>
            <p className="text-white/70">
              Save events to your personal holocron with notes and reminders for your future adventures.
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold text-white">Achieve Mastery</h3>
            <p className="text-white/70">
              Organize and track your planned events. With time and practice, you'll become a true Event Master.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="glass-card p-6 text-center">
        <p className="text-white/60 text-sm">
          🌟 May the force be with your event planning journey! 🌟
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
          © {new Date().getFullYear()} Ticket Padawan. Made with ❤️ by Logan Nitzsche
        </p>
      </footer>
    </div>
  )
}