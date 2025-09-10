"use client"

import React from 'react'
import { Navigation } from 'lucide-react'

interface MapCompassProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onResetBearing?: () => void
}

export function MapCompass({ 
  className = "", 
  size = 'md',
  onResetBearing
}: MapCompassProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={onResetBearing}
        className={`
          ${sizeClasses[size]} 
          bg-white/95 backdrop-blur-sm 
          border border-gray-200 
          rounded-full 
          shadow-lg hover:shadow-xl 
          transition-all duration-200 
          flex items-center justify-center 
          text-gray-700 hover:text-gray-900
          hover:scale-105
          group
        `}
        title="Reset map orientation to North"
        aria-label="Compass - Click to reset map orientation"
      >
        <Navigation 
          className={`${iconSizes[size]} transition-transform duration-200 group-hover:scale-110`} 
        />
      </button>
      
      {/* North indicator */}
      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 -translate-y-full">
        <div className="text-xs font-bold text-gray-700 bg-white/90 px-1 rounded shadow-sm">
          N
        </div>
      </div>
    </div>
  )
}