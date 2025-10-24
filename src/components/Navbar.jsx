import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext-clean'
import { Github, Linkedin, User, LogOut, Settings, Search, Home } from 'lucide-react'

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="glass-card border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold glow-text">
              Ticket Padawan
            </h1>
          </Link>

          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <div className="hidden md:flex items-center space-x-3">
              <a 
                href="https://www.linkedin.com/in/logan-nitzsche" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a 
                href="https://github.com/lmnitzsche" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
              >
                <Github size={20} />
              </a>
            </div>

            {/* Navigation Links */}
            {user && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/dashboard') 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Home size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                
                <Link
                  to="/search"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/search') 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Search size={18} />
                  <span className="hidden sm:inline">Search Events</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin') 
                        ? 'bg-red-500/20 text-red-300' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Settings size={18} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                )}
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-1 text-white/70 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}