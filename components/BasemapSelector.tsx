"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Satellite, 
  Map, 
  Mountain,
  Globe,
  ChevronDown 
} from 'lucide-react'

export type BasemapType = 'satellite' | 'street' | 'terrain' | 'hybrid'

interface BasemapSelectorProps {
  currentBasemap: BasemapType
  onBasemapChange: (basemap: BasemapType) => void
  className?: string
  isCompact?: boolean
}

interface BasemapOption {
  id: BasemapType
  name: string
  icon: React.ReactNode
  description: string
  preview?: string
}

const basemapOptions: BasemapOption[] = [
  {
    id: 'satellite',
    name: 'Satellite',
    icon: <Satellite className="w-4 h-4" />,
    description: 'High-resolution satellite imagery',
    preview: 'bg-gradient-to-br from-green-400 via-blue-500 to-blue-600'
  },
  {
    id: 'street',
    name: 'Street Map',
    icon: <Map className="w-4 h-4" />,
    description: 'Detailed street and road information',
    preview: 'bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300'
  },
  {
    id: 'terrain',
    name: 'Terrain',
    icon: <Mountain className="w-4 h-4" />,
    description: 'Topographic and elevation data',
    preview: 'bg-gradient-to-br from-yellow-200 via-green-300 to-brown-400'
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    icon: <Globe className="w-4 h-4" />,
    description: 'Satellite with street labels',
    preview: 'bg-gradient-to-br from-green-400 via-blue-400 to-gray-500'
  }
]

export function BasemapSelector({ 
  currentBasemap, 
  onBasemapChange, 
  className = "",
  isCompact = false 
}: BasemapSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const currentOption = basemapOptions.find(option => option.id === currentBasemap)

  if (isCompact) {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          {currentOption?.icon}
          <span className="ml-2 text-xs">{currentOption?.name}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
        
        {isExpanded && (
          <Card className="absolute top-full left-0 mt-2 z-50 min-w-48 bg-white/95 backdrop-blur-sm border-gray-200 shadow-xl">
            <CardContent className="p-2">
              <div className="space-y-1">
                {basemapOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      onBasemapChange(option.id)
                      setIsExpanded(false)
                    }}
                    className={`
                      w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-all duration-200
                      ${option.id === currentBasemap 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    <div className={`w-6 h-6 rounded ${option.preview} flex items-center justify-center`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{option.name}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg ${className}`}>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Base Map</h3>
        <div className="grid grid-cols-2 gap-2">
          {basemapOptions.map(option => (
            <button
              key={option.id}
              onClick={() => onBasemapChange(option.id)}
              className={`
                relative group p-3 rounded-lg border-2 transition-all duration-200
                ${option.id === currentBasemap
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className={`w-full h-12 rounded mb-2 ${option.preview} flex items-center justify-center`}>
                <div className="text-white drop-shadow-md">
                  {option.icon}
                </div>
              </div>
              <div className="text-xs font-medium text-gray-900 text-center">
                {option.name}
              </div>
              <div className="text-xs text-gray-500 text-center mt-1">
                {option.description}
              </div>
              
              {option.id === currentBasemap && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}