import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../contexts/AuthContext-robust'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { Users, Calendar, Trash2, Shield, ShieldOff } from 'lucide-react'

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth()
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('users')

  useEffect(() => {
    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin])

  if (authLoading) {
    return <LoadingSpinner />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (usersError) throw usersError

      // Fetch all events with user info
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          profiles (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (eventsError) throw eventsError

      setUsers(usersData || [])
      setEvents(eventsData || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', userId)

      if (error) throw error

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_admin: !currentStatus }
          : user
      ))

      toast.success(`User ${!currentStatus ? 'promoted to' : 'removed from'} admin`)
    } catch (error) {
      console.error('Error toggling admin status:', error)
      toast.error('Failed to update user status')
    }
  }

  const deleteUser = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to delete user ${userEmail}? This will also delete all their events.`)) {
      try {
        // Delete user's events first (due to foreign key constraints)
        const { error: eventsError } = await supabase
          .from('events')
          .delete()
          .eq('user_id', userId)

        if (eventsError) throw eventsError

        // Then delete the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId)

        if (profileError) throw profileError

        setUsers(prev => prev.filter(user => user.id !== userId))
        setEvents(prev => prev.filter(event => event.user_id !== userId))
        
        toast.success('User deleted successfully')
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  const deleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const { error } = await supabase
          .from('events')
          .delete()
          .eq('id', eventId)

        if (error) throw error

        setEvents(prev => prev.filter(event => event.id !== eventId))
        toast.success('Event deleted successfully')
      } catch (error) {
        console.error('Error deleting event:', error)
        toast.error('Failed to delete event')
      }
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-white/70">
          Manage users and events across the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-6 text-center space-y-2">
          <Users className="w-8 h-8 text-blue-400 mx-auto" />
          <p className="text-2xl font-bold text-white">{users.length}</p>
          <p className="text-white/70">Total Users</p>
        </div>
        
        <div className="glass-card p-6 text-center space-y-2">
          <Calendar className="w-8 h-8 text-purple-400 mx-auto" />
          <p className="text-2xl font-bold text-white">{events.length}</p>
          <p className="text-white/70">Total Events</p>
        </div>
        
        <div className="glass-card p-6 text-center space-y-2">
          <Shield className="w-8 h-8 text-green-400 mx-auto" />
          <p className="text-2xl font-bold text-white">
            {users.filter(u => u.is_admin).length}
          </p>
          <p className="text-white/70">Administrators</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="glass-card">
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'events'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-white/70 hover:text-white'
            }`}
          >
            Events ({events.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">User Management</h3>
              
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="pb-3 text-white/70">User</th>
                        <th className="pb-3 text-white/70">Email</th>
                        <th className="pb-3 text-white/70">Status</th>
                        <th className="pb-3 text-white/70">Joined</th>
                        <th className="pb-3 text-white/70">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-white/5">
                          <td className="py-3 text-white">
                            {user.full_name || 'Unknown'}
                          </td>
                          <td className="py-3 text-white/70">{user.email}</td>
                          <td className="py-3">
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                              user.is_admin 
                                ? 'bg-red-500/20 text-red-300' 
                                : 'bg-green-500/20 text-green-300'
                            }`}>
                              {user.is_admin ? <Shield size={12} /> : <Users size={12} />}
                              <span>{user.is_admin ? 'Admin' : 'User'}</span>
                            </span>
                          </td>
                          <td className="py-3 text-white/70">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                                className={`p-1 rounded hover:bg-white/10 transition-colors ${
                                  user.is_admin ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'
                                }`}
                                title={user.is_admin ? 'Remove admin' : 'Make admin'}
                              >
                                {user.is_admin ? <ShieldOff size={16} /> : <Shield size={16} />}
                              </button>
                              
                              <button
                                onClick={() => deleteUser(user.id, user.email)}
                                className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                                title="Delete user"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-white/70">No users found.</p>
              )}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Event Management</h3>
              
              {events.length > 0 ? (
                <div className="space-y-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-white/5 rounded-lg p-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="text-white font-medium">{event.name}</h4>
                          <p className="text-white/70 text-sm">
                            {event.venue} • {event.date} • Rating: {event.rating}/10
                          </p>
                          <p className="text-white/50 text-xs">
                            Added by: {event.profiles?.full_name || event.profiles?.email}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="p-2 rounded text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                          title="Delete event"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No events found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}