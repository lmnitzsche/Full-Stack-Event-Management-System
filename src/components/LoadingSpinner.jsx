import React from 'react'

export default function LoadingSpinner({ size = 'large' }) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-white/20 border-t-blue-500`}></div>
    </div>
  )
}