import React from 'react'

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🎉 Event Nostalgia v2 - Test</h1>
      <p>If you see this, React is working!</p>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px'
      }}>
        <h2>Environment Check:</h2>
        <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✅ Found' : '❌ Missing'}</p>
        <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Found' : '❌ Missing'}</p>
        <p>Ticketmaster Key: {import.meta.env.VITE_TICKETMASTER_API_KEY ? '✅ Found' : '❌ Missing'}</p>
      </div>
    </div>
  )
}

export default App