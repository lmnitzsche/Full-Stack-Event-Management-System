import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './contexts/AuthContext-clean'
import Navbar from './components/Navbar'
import LoadingSpinner from './components/LoadingSpinner'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import DashboardPage from './pages/DashboardPage'
import SearchPage from './pages/SearchPage'
import AdminPage from './pages/AdminPage'
import ProfilePage from './pages/ProfilePage'
import EventDetailsPage from './pages/EventDetailsPage'
import SnakeGame from './components/SnakeGame'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" /> : <LoginPage />} 
          />
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" /> : <SignUpPage />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <DashboardPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/search" 
            element={user ? <SearchPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <ProfilePage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <AdminPage /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/event/:eventId" 
            element={user ? <EventDetailsPage /> : <Navigate to="/login" />} 
          />
          <Route path="/snake" element={<SnakeGame />} />
        </Routes>
      </main>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        }}
      />
    </div>
  )
}

export default App