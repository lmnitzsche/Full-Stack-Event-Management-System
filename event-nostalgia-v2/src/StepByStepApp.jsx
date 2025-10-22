import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext-fixed'

// Import components one by one for testing
import HomePage from './pages/HomePage'
import SearchPage from './pages/SearchPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import Navbar from './components/Navbar'

const components = [
  { name: 'Navbar', component: Navbar, test: () => <Navbar /> },
  { name: 'HomePage', component: HomePage, test: () => <HomePage /> },
  { name: 'SearchPage', component: SearchPage, test: () => <SearchPage /> },
  { name: 'ProfilePage', component: ProfilePage, test: () => <ProfilePage /> },
  { name: 'LoginPage', component: LoginPage, test: () => <LoginPage /> }
]

function StepByStepApp() {
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState(null)
  const { user, loading, supabaseAvailable } = useAuth()

  const testComponent = (index) => {
    setError(null)
    setCurrentStep(index)
  }

  const TestComponent = currentStep >= 0 && currentStep < components.length 
    ? components[currentStep].component 
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold glow-text mb-4">🧪 Component Testing Lab</h1>
        <p className="text-white/70 mb-8">Testing each component individually to find issues</p>
        
        {/* Status Panel */}
        <div className="glass-card p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              Auth: {loading ? 'Loading...' : supabaseAvailable ? '✅ Connected' : '⚠️ Demo Mode'}
            </div>
            <div>
              User: {user ? `✅ ${user.email}` : '❌ Not logged in'}
            </div>
            <div>
              Status: {error ? `❌ ${error}` : '✅ No errors'}
            </div>
          </div>
        </div>

        {/* Component Selector */}
        <div className="glass-card p-4 mb-8">
          <h3 className="text-xl font-bold mb-4">Select Component to Test:</h3>
          <div className="flex flex-wrap gap-2">
            {components.map((comp, index) => (
              <button
                key={comp.name}
                onClick={() => testComponent(index)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentStep === index
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {comp.name}
              </button>
            ))}
            <button
              onClick={() => setCurrentStep(-1)}
              className="px-4 py-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-300"
            >
              Test Full Routes
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="glass-card p-4 mb-8 bg-red-500/20 border-red-500/30">
            <h3 className="text-xl font-bold text-red-300 mb-2">Error Found:</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Component Display Area */}
        <div className="glass-card p-4">
          {currentStep === -1 ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Full App Routes Test</h3>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          ) : TestComponent ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Testing: {components[currentStep].name}</h3>
              <ErrorBoundary 
                onError={(error) => setError(error.message)}
                componentName={components[currentStep].name}
              >
                <TestComponent />
              </ErrorBoundary>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>Select a component above to test it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error in ${this.props.componentName}:`, error, errorInfo)
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
          <h4 className="font-bold text-red-300 mb-2">Component Error:</h4>
          <p className="text-red-200">{this.state.error?.message || 'Unknown error'}</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default StepByStepApp