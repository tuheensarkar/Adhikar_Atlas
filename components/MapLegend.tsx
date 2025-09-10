"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapLayer } from '@/types'
import { 
  Home, 
  MapPin, 
  Droplets, 
  TreePine,
  Mountain,
  Eye,
  EyeOff 
} from 'lucide-react'

interface MapLegendProps {
  layers: MapLayer[]
  className?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

interface LegendItem {
  id: string
  name: string
  color: string
  symbol: 'circle' | 'square' | 'polygon' | 'line'
  icon: React.ReactNode
  description: string
  visible: boolean
  count?: number
}

const getLegendItems = (layers: MapLayer[]): LegendItem[] => {
  const items: LegendItem[] = []
  
  layers.forEach(layer => {
    switch (layer.id) {
      case 'state_boundaries':
        items.push({
          id: layer.id,
          name: 'State Boundaries',
          color: '#6b7280',
          symbol: 'polygon',
          icon: <MapPin className="w-3 h-3" />,
          description: 'Indian state boundaries with tribal population density',
          visible: layer.visible,
          count: 6
        })
        break
      case 'settlements':
        items.push({
          id: layer.id,
          name: 'Tribal Settlements',
          color: '#f59e0b',
          symbol: 'circle',
          icon: <Home className="w-3 h-3" />,
          description: 'Identified tribal habitations and villages',
          visible: layer.visible,
          count: 3
        })
        break
      case 'fra_claims':
        items.push({
          id: layer.id,
          name: 'FRA Claim Boundaries',
          color: '#8b5cf6',
          symbol: 'polygon',
          icon: <MapPin className="w-3 h-3" />,
          description: 'Forest rights claim boundaries and status',
          visible: layer.visible,
          count: 1
        })
        break
      case 'forest_cover':
        items.push({
          id: layer.id,
          name: 'Forest Cover',
          color: '#22c55e',
          symbol: 'polygon',
          icon: <TreePine className="w-3 h-3" />,
          description: 'Forest Survey of India data layer',
          visible: layer.visible
        })
        break
      case 'water_bodies':
        items.push({
          id: layer.id,
          name: 'Water Bodies',
          color: '#06b6d4',
          symbol: 'polygon',
          icon: <Droplets className="w-3 h-3" />,
          description: 'Rivers, lakes, and water sources',
          visible: layer.visible
        })
        break
      case 'elevation':
        items.push({
          id: layer.id,
          name: 'Terrain Elevation',
          color: '#84cc16',
          symbol: 'polygon',
          icon: <Mountain className="w-4 h-4" />,
          description: 'Digital elevation model and topography',
          visible: layer.visible
        })
        break
      case 'satellite':
        items.push({
          id: layer.id,
          name: 'Satellite Imagery',
          color: '#3b82f6',
          symbol: 'square',
          icon: <Mountain className="w-4 h-4" />,
          description: 'High-resolution satellite imagery from ISRO',
          visible: layer.visible
        })
        break
    }
  })
  
  return items
}

const getSymbolElement = (symbol: LegendItem['symbol'], color: string) => {
  switch (symbol) {
    case 'circle':
      return (
        <div 
          className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
          style={{ backgroundColor: color }}
        />
      )
    case 'square':
      return (
        <div 
          className="w-4 h-4 border-2 border-white shadow-sm"
          style={{ backgroundColor: color }}
        />
      )
    case 'polygon':
      return (
        <div 
          className="w-4 h-3 border-2 border-white shadow-sm clip-polygon"
          style={{ backgroundColor: color }}
        />
      )
    case 'line':
      return (
        <div 
          className="w-4 h-1 rounded-sm"
          style={{ backgroundColor: color }}
        />
      )
    default:
      return null
  }
}

const getStatusBadge = (visible: boolean, count?: number) => {
  if (!visible) {
    return (
      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 px-2 py-1 border-gray-200">
        <EyeOff className="w-3 h-3 mr-1" />
        Hidden
      </Badge>
    )
  }
  
  if (count !== undefined) {
    return (
      <Badge variant="default" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 border-blue-200">
        <Eye className="w-3 h-3 mr-1" />
        {count} features
      </Badge>
    )
  }
  
  return (
    <Badge variant="default" className="text-xs bg-green-100 text-green-700 px-2 py-1 border-green-200">
      <Eye className="w-3 h-3 mr-1" />
      Visible
    </Badge>
  )
}

export function MapLegend({ 
  layers, 
  className = "", 
  isMinimized = false, 
  onToggleMinimize 
}: MapLegendProps) {
  const legendItems = getLegendItems(layers)
  const visibleItems = legendItems.filter(item => item.visible)
  
  if (isMinimized) {
    return (
      <Card className={`bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg max-w-xs ${className}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold text-gray-700">Legend</div>
              <Badge variant="outline" className="text-xs px-2 py-1">
                {visibleItems.length} layers
              </Badge>
            </div>
            <button
              onClick={onToggleMinimize}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Expand Legend"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {visibleItems.slice(0, 4).map(item => (
              <div key={item.id} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                {getSymbolElement(item.symbol, item.color)}
                <span className="text-xs text-gray-600 font-medium">
                  {item.name.split(' ')[0]}
                </span>
              </div>
            ))}
            {visibleItems.length > 4 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">+{visibleItems.length - 4} more</span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg max-w-80 ${className}`}>
      <CardHeader className="pb-3 px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Legend
          </CardTitle>
          {onToggleMinimize && (
            <button
              onClick={onToggleMinimize}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Minimize Legend"
            >
              <EyeOff className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 pb-4 space-y-3">
        {legendItems.map(item => (
          <div 
            key={item.id} 
            className={`flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all duration-200 ${
              item.visible ? 'bg-gray-50 border border-gray-100' : 'bg-gray-25 opacity-60 border border-gray-100'
            }`}
          >
            <div className="flex items-center gap-2 flex-shrink-0">
              {getSymbolElement(item.symbol, item.color)}
              <div className="text-gray-600">
                {item.icon}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </h4>
                <div className="ml-2 flex-shrink-0">
                  {getStatusBadge(item.visible, item.count)}
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
        
        {/* State Color Coding Legend */}
        {layers.some(layer => layer.id === 'state_boundaries' && layer.visible) && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              State Color Coding
            </h4>
            <p className="text-xs text-blue-700 mb-3">Based on tribal population density</p>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-red-900 border border-white shadow-sm rounded-sm"></div>
                  <span className="text-sm text-gray-700">Very High</span>
                </div>
                <span className="text-xs text-gray-500">&gt;25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-red-600 border border-white shadow-sm rounded-sm"></div>
                  <span className="text-sm text-gray-700">High</span>
                </div>
                <span className="text-xs text-gray-500">15-25%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-orange-500 border border-white shadow-sm rounded-sm"></div>
                  <span className="text-sm text-gray-700">Medium</span>
                </div>
                <span className="text-xs text-gray-500">5-15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-green-500 border border-white shadow-sm rounded-sm"></div>
                  <span className="text-sm text-gray-700">Low</span>
                </div>
                <span className="text-xs text-gray-500">&lt;5%</span>
              </div>
            </div>
          </div>
        )}
        
        {legendItems.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No layers available</p>
          </div>
        )}
        
        {/* Legend Footer */}
        <div className="pt-3 mt-3 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <span className="font-medium">Total Features: {legendItems.reduce((sum, item) => sum + (item.count || 0), 0)}</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Live Data</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}