"use client"

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMap, useMapEvents, GeoJSON } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import type { GeoFeature, Village, MapLayer } from '@/types'
import { getTribalPopulationColor } from '@/services/geoDataService'
import { ZOOM_THRESHOLDS } from '@/lib/geoOptimization'
// import { MapLegend } from './MapLegend' // Removed per user request
import { MapCompass } from './MapCompass'
import { BasemapSelector, BasemapType } from './BasemapSelector'
import { AnalyticsOverlay } from './AnalyticsOverlay'
import { MapStyles } from './MapStyles'
import { StateLayer } from './StateLayer'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface InteractiveMapProps {
  center: [number, number]
  zoom: number
  layers: MapLayer[]
  geoFeatures: { [layerId: string]: GeoFeature[] }
  selectedVillage?: Village | null
  onFeatureClick?: (feature: GeoFeature) => void
  onMapClick?: (latlng: L.LatLng) => void
  onDistrictClick?: (district: string) => void
  onBoundsChange?: (bounds: [[number, number], [number, number]]) => void
  className?: string
}

// Component to handle map events with bounds tracking
function MapEventHandler({ 
  onMapClick, 
  onBoundsChange 
}: { 
  onMapClick?: (latlng: L.LatLng) => void
  onBoundsChange?: (bounds: [[number, number], [number, number]]) => void
}) {
  const map = useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng)
      }
    },
    moveend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds()
        const southwest = bounds.getSouthWest()
        const northeast = bounds.getNorthEast()
        onBoundsChange([
          [southwest.lat, southwest.lng],
          [northeast.lat, northeast.lng]
        ])
      }
    },
    zoomend: () => {
      if (onBoundsChange) {
        const bounds = map.getBounds()
        const southwest = bounds.getSouthWest()
        const northeast = bounds.getNorthEast()
        onBoundsChange([
          [southwest.lat, southwest.lng],
          [northeast.lat, northeast.lng]
        ])
      }
    }
  })
  return null
}

// Component to handle map view updates
function MapViewController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

// Custom icon for different feature types
const createCustomIcon = (color: string, type: 'settlement' | 'claim' | 'water' | 'forest') => {
  const iconHtml = type === 'settlement' 
    ? `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
    : type === 'claim'
    ? `<div style="background-color: ${color}; width: 15px; height: 15px; border-radius: 2px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
    : `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 1px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>`

  return new L.DivIcon({
    html: iconHtml,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
    className: 'custom-div-icon'
  })
}

// Enhanced GeoJSON layer component with zoom-based rendering and error handling
function EnhancedGeoJSONLayer({ 
  layerId, 
  features, 
  color, 
  visible, 
  opacity,
  currentZoom,
  onFeatureClick 
}: { 
  layerId: string
  features: GeoFeature[]
  color: string
  visible: boolean
  opacity: number
  currentZoom: number
  onFeatureClick?: (feature: GeoFeature) => void 
}) {
  if (!visible || features.length === 0) return null

  const shouldShowLayer = useCallback(() => {
    if (layerId === 'state_boundaries') {
      return true
    }
    if (layerId === 'settlements') {
      return currentZoom >= ZOOM_THRESHOLDS.VILLAGE_LEVEL
    }
    return true
  }, [layerId, currentZoom])

  if (!shouldShowLayer()) return null

  // Validate and filter features with proper geometry
  const validFeatures = features.filter(feature => {
    if (!feature.geometry || !feature.geometry.coordinates) {
      console.warn(`Invalid geometry for feature ${feature.id}:`, feature)
      return false
    }
    
    // Validate coordinate structure
    const coords = feature.geometry.coordinates
    if (feature.type === 'Point') {
      return Array.isArray(coords) && coords.length === 2 && 
             typeof coords[0] === 'number' && typeof coords[1] === 'number'
    }
    
    if (feature.type === 'Polygon') {
      return Array.isArray(coords) && coords.length > 0 && 
             Array.isArray(coords[0]) && coords[0].length > 0
    }
    
    return true
  })

  if (validFeatures.length === 0) {
    console.warn(`No valid features for layer ${layerId}`)
    return null
  }

  const getFeatureStyle = useCallback((feature: any) => {
    const geoFeature = feature as GeoFeature
    const baseStyle = {
      fillOpacity: opacity / 100 * 0.6,
      opacity: opacity / 100 * 0.8,
      weight: layerId === 'state_boundaries' ? 2 : layerId === 'district_boundaries' ? 1 : 1.5
    }

    if (layerId === 'state_boundaries' || layerId === 'district_boundaries') {
      const tribalPercentage = geoFeature.properties?.tribalPercentage || 0
      return {
        ...baseStyle,
        fillColor: getTribalPopulationColor(tribalPercentage),
        color: '#333333'
      }
    }

    return {
      ...baseStyle,
      fillColor: geoFeature.properties?.color || color,
      color: geoFeature.properties?.color || color
    }
  }, [layerId, opacity, color])

  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const featureData = feature as GeoFeature
    
    // Enhanced tooltip for better UX
    if (layerId === 'state_boundaries') {
      const name = featureData.properties?.name || 'Unknown'
      const tribalPercentage = featureData.properties?.tribalPercentage || 0
      const population = featureData.properties?.population || 0
      
      layer.bindTooltip(
        `<div class="map-tooltip">
          <div class="font-semibold text-sm">${name}</div>
          <div class="text-xs text-gray-600">
            Population: ${(population / 1000000).toFixed(1)}M<br/>
            Tribal: ${tribalPercentage.toFixed(1)}%
          </div>
        </div>`,
        {
          permanent: false,
          direction: 'top',
          className: 'custom-tooltip',
          opacity: 0.9
        }
      )
    }

    // Enhanced popup with better styling
    const popupContent = createEnhancedPopup(featureData, layerId)
    layer.bindPopup(popupContent, {
      maxWidth: 400,
      className: 'custom-popup'
    })

    // Enhanced hover effects
    layer.on({
      mouseover: (e) => {
        const target = e.target
        target.setStyle({
          weight: 3,
          fillOpacity: Math.min((opacity / 100 * 0.8), 0.8),
          color: '#007bff'
        })
        target.bringToFront()
      },
      mouseout: (e) => {
        const target = e.target
        target.setStyle(getFeatureStyle(featureData))
      },
      click: () => {
        if (onFeatureClick) {
          onFeatureClick(featureData)
        }
      }
    })
  }, [layerId, opacity, getFeatureStyle, onFeatureClick])

  // Convert features to proper GeoJSON format
  const geoJsonData = {
    type: 'FeatureCollection' as const,
    features: validFeatures.map(feature => ({
      type: 'Feature' as const,
      geometry: feature.geometry,
      properties: feature.properties
    }))
  }

  return (
    <GeoJSON
      key={`${layerId}-${validFeatures.length}-${currentZoom}`}
      data={geoJsonData}
      style={getFeatureStyle}
      onEachFeature={onEachFeature}
    />
  )
}

// Create enhanced popup content
function createEnhancedPopup(feature: GeoFeature, layerId: string): string {
  const { properties } = feature
  const name = properties.name || 'Unknown'
  
  if (layerId === 'state_boundaries') {
    const population = properties.population || 0
    const tribalPopulation = properties.tribalPopulation || 0
    return `
      <div class="enhanced-popup state-popup">
        <div class="popup-header">
          <h3 class="popup-title">${name}</h3>
          <span class="popup-badge">${properties.code || ''}</span>
        </div>
        <div class="popup-stats">
          <div class="stat-item">
            <span class="stat-label">Population</span>
            <span class="stat-value">${(population / 1000000).toFixed(1)}M</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tribal Population</span>
            <span class="stat-value">${(tribalPopulation / 1000000).toFixed(1)}M</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tribal %</span>
            <span class="stat-value tribal-percentage">${properties.tribalPercentage?.toFixed(1) || '0.0'}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Forest Cover</span>
            <span class="stat-value">${properties.forestCover?.toFixed(1) || '0.0'}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Districts</span>
            <span class="stat-value">${properties.districts || 0}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">FRA Priority</span>
            <span class="stat-value priority-${properties.priority || 'low'}">${properties.priority || 'low'}</span>
          </div>
        </div>
      </div>
    `
  }
  
  if (layerId === 'district_boundaries') {
    const population = properties.population || 0
    return `
      <div class="enhanced-popup district-popup">
        <div class="popup-header">
          <h3 class="popup-title">${name}</h3>
          <span class="popup-badge">${properties.state || ''}</span>
        </div>
        <div class="popup-stats">
          <div class="stat-item">
            <span class="stat-label">Population</span>
            <span class="stat-value">${(population / 1000).toFixed(1)}K</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Tribal %</span>
            <span class="stat-value tribal-percentage">${properties.tribalPercentage?.toFixed(1) || '0.0'}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Forest Cover</span>
            <span class="stat-value">${properties.forestCover?.toFixed(1) || '0.0'}%</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">FRA Claims</span>
            <span class="stat-value">${properties.fraClaimsCount || 0}</span>
          </div>
        </div>
      </div>
    `
  }
  
  // Default popup for other features
  const stats = Object.entries(properties)
    .filter(([key]) => key !== 'name')
    .map(([key, value]) => `
      <div class="stat-item">
        <span class="stat-label">${key.replace(/([A-Z])/g, ' $1').trim()}</span>
        <span class="stat-value">${value}</span>
      </div>
    `).join('')
    
  return `
    <div class="enhanced-popup default-popup">
      <div class="popup-header">
        <h3 class="popup-title">${name}</h3>
      </div>
      <div class="popup-stats">${stats}</div>
    </div>
  `
}

export function InteractiveMap({
  center,
  zoom,
  layers,
  geoFeatures,
  selectedVillage,
  onFeatureClick,
  onMapClick,
  onDistrictClick,
  onBoundsChange,
  className = ""
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const [currentBasemap, setCurrentBasemap] = useState<BasemapType>('satellite')
  // const [isLegendMinimized, setIsLegendMinimized] = useState(false) // Removed per user request
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  // Handle district clicks for analytics
  const handleDistrictClick = (district: string) => {
    setSelectedDistrict(district)
    setShowAnalytics(true)
    if (onDistrictClick) {
      onDistrictClick(district)
    }
  }

  // Get basemap tile layer configuration
  const getBasemapTileLayer = () => {
    switch (currentBasemap) {
      case 'street':
        return (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )
      case 'terrain':
        return (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        )
      case 'hybrid':
        return (
          <>
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              opacity={0.6}
            />
          </>
        )
      case 'satellite':
      default:
        return (
          <TileLayer
            attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        )
    }
  }

  return (
    <div className={`relative ${className}`}>
      <MapStyles />
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        ref={mapRef}
        zoomControl={false}
        maxBounds={[
          [6.4627, 68.1097],   // Southwest corner of India
          [35.5137, 97.4152]   // Northeast corner of India  
        ]}
        minZoom={4}
        maxZoom={18}
      >
        {/* Dynamic Basemap Layer */}
        {getBasemapTileLayer()}

        {/* Enhanced India State Boundaries Layer */}
        <StateLayer 
          onStateClick={(state) => {
            console.log('State clicked:', state)
            if (onDistrictClick) {
              onDistrictClick(state.name)
            }
          }}
          onStateHover={(state) => {
            console.log('State hovered:', state)
          }}
        />

        {/* Marker Clustering for settlements */}
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          removeOutsideVisibleBounds={true}
          animate={true}
          animateAddingMarkers={true}
        >
          {/* Render GeoFeatures for visible layers with clustering */}
          {layers.filter(layer => layer.visible && layer.id === 'settlements').map(layer => {
            const layerFeatures = geoFeatures[layer.id] || []
            return layerFeatures.map((feature, index) => {
              if (feature.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
                const [lng, lat] = feature.geometry.coordinates as [number, number]
                const featureType = 'settlement'
                
                return (
                  <Marker
                    key={`${layer.id}_${feature.id}_${index}`}
                    position={[lat, lng]}
                    icon={createCustomIcon(layer.color, featureType)}
                    opacity={layer.opacity / 100}
                    eventHandlers={{
                      click: () => {
                        if (onFeatureClick) {
                          onFeatureClick(feature)
                        }
                        // Auto-open analytics if clicking on settlement
                        if (feature.properties.village) {
                          handleDistrictClick(feature.properties.village)
                        }
                      }
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="min-w-64 max-w-xs">
                        <div className="border-b border-gray-200 pb-2 mb-3">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }}></div>
                            {feature.properties.name || `${layer.id} Feature`}
                          </h3>
                          {feature.properties.village && (
                            <p className="text-sm text-gray-600 mt-1">{feature.properties.village}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(feature.properties).map(([key, value]) => {
                            if (key === 'name') return null
                            return (
                              <div key={key} className="space-y-1">
                                <span className="text-gray-600 capitalize text-xs">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <div className="font-medium text-gray-900">
                                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => handleDistrictClick(feature.properties.village || 'Unknown')}
                            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            View District Analytics
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              }
              return null
            })
          })}
        </MarkerClusterGroup>

        {/* Enhanced GeoJSON Layers with zoom-based rendering and fallback */}
        {layers.filter(layer => layer.visible && ['state_boundaries', 'fra_claims', 'water_bodies', 'forest_cover'].includes(layer.id)).map(layer => {
          const layerFeatures = geoFeatures[layer.id] || []
          
          // Use fallback polygon rendering for problematic layers
          if (layer.id === 'state_boundaries') {
            return (
              <React.Fragment key={layer.id}>
                {layerFeatures.map((feature, index) => {
                  if (feature.type === 'Polygon' && feature.geometry.coordinates) {
                    try {
                      const coords = feature.geometry.coordinates[0] as [number, number][]
                      if (!coords || coords.length === 0) return null
                      
                      const positions: [number, number][] = coords.map(([lng, lat]) => [lat, lng])
                      const featureColor = getTribalPopulationColor(feature.properties?.tribalPercentage || 0)
                      
                      return (
                        <Polygon
                          key={`${layer.id}_${feature.id}_${index}`}
                          positions={positions}
                          pathOptions={{
                            color: '#333333',
                            fillColor: featureColor,
                            fillOpacity: (layer.opacity / 100) * 0.6,
                            weight: layer.id === 'state_boundaries' ? 2 : 1,
                            opacity: layer.opacity / 100 * 0.8
                          }}
                          eventHandlers={{
                            click: () => {
                              if (onFeatureClick) {
                                onFeatureClick(feature)
                              }
                            },
                            mouseover: (e) => {
                              const target = e.target
                              target.setStyle({
                                weight: 3,
                                fillOpacity: Math.min((layer.opacity / 100 * 0.8), 0.8),
                                color: '#007bff'
                              })
                            },
                            mouseout: (e) => {
                              const target = e.target
                              target.setStyle({
                                weight: layer.id === 'state_boundaries' ? 2 : 1,
                                fillOpacity: (layer.opacity / 100) * 0.6,
                                color: '#333333'
                              })
                            }
                          }}
                        >
                          <Tooltip>
                            <div className="text-sm font-semibold">{feature.properties?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-600">
                              {feature.properties?.tribalPercentage ? 
                                `Tribal: ${feature.properties.tribalPercentage.toFixed(1)}%` : 
                                'No data'
                              }
                            </div>
                          </Tooltip>
                          <Popup>
                            <div className="min-w-64">
                              <h3 className="font-bold text-lg mb-2">{feature.properties?.name || 'Unknown'}</h3>
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {feature.properties?.population && (
                                  <div>
                                    <span className="text-gray-600">Population:</span>
                                    <div className="font-semibold">{(feature.properties.population / 1000000).toFixed(1)}M</div>
                                  </div>
                                )}
                                {feature.properties?.tribalPercentage && (
                                  <div>
                                    <span className="text-gray-600">Tribal %:</span>
                                    <div className="font-semibold">{feature.properties.tribalPercentage.toFixed(1)}%</div>
                                  </div>
                                )}
                                {feature.properties?.forestCover && (
                                  <div>
                                    <span className="text-gray-600">Forest Cover:</span>
                                    <div className="font-semibold">{feature.properties.forestCover.toFixed(1)}%</div>
                                  </div>
                                )}
                                {feature.properties?.districts && (
                                  <div>
                                    <span className="text-gray-600">Districts:</span>
                                    <div className="font-semibold">{feature.properties.districts}</div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Popup>
                        </Polygon>
                      )
                    } catch (error) {
                      console.error(`Error rendering polygon for ${feature.id}:`, error)
                      return null
                    }
                  }
                  return null
                })}
              </React.Fragment>
            )
          }
          
          // Use enhanced GeoJSON component for other layers
          return (
            <EnhancedGeoJSONLayer
              key={layer.id}
              layerId={layer.id}
              features={layerFeatures}
              color={layer.color}
              visible={layer.visible}
              opacity={layer.opacity}
              currentZoom={zoom}
              onFeatureClick={onFeatureClick}
            />
          )
        })}

        {/* Selected Village Marker */}
        {selectedVillage && (
          <Marker
            position={[selectedVillage.coordinates[0], selectedVillage.coordinates[1]]}
            icon={createCustomIcon('#ef4444', 'settlement')}
          >
            <Popup>
              <div className="min-w-48">
                <h3 className="font-semibold text-sm mb-2">{selectedVillage.name}</h3>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">District:</span>
                    <span className="font-medium">{selectedVillage.district}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">State:</span>
                    <span className="font-medium">{selectedVillage.state}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population:</span>
                    <span className="font-medium">{selectedVillage.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tribal Pop:</span>
                    <span className="font-medium">{selectedVillage.tribalPopulation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Forest Cover:</span>
                    <span className="font-medium">{selectedVillage.forestCover}%</span>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Map Event Handler with bounds tracking */}
        <MapEventHandler onMapClick={onMapClick} onBoundsChange={onBoundsChange} />
        
        {/* Map View Controller */}
        <MapViewController center={center} zoom={zoom} />
      </MapContainer>

      {/* Map Legend - Removed per user request */}
      {/* <MapLegend 
        layers={layers}
        isMinimized={isLegendMinimized}
        onToggleMinimize={() => setIsLegendMinimized(!isLegendMinimized)}
        className="absolute bottom-4 left-4 z-[1000]"
      /> */}

      {/* Basemap Selector */}
      <BasemapSelector
        currentBasemap={currentBasemap}
        onBasemapChange={setCurrentBasemap}
        isCompact={true}
        className="absolute top-4 left-4 z-[1000]"
      />

      {/* Compass */}
      <MapCompass 
        className="absolute top-20 left-4 z-[1000]"
        onResetBearing={() => {
          // Reset map orientation to North
          if (mapRef.current) {
            mapRef.current.setView(center, zoom)
          }
        }}
      />

      {/* Enhanced Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] space-y-2">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-105"
          title="Zoom In"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-105"
          title="Zoom Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
          </svg>
        </button>
        <button
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="w-10 h-10 bg-white/95 backdrop-blur border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-105"
          title="Toggle Analytics"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </button>
      </div>

      {/* Enhanced Scale Bar */}
      <div className="absolute bottom-4 right-32 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg border border-gray-200 shadow-lg">
        <div className="flex items-center space-x-2 text-xs">
          <div className="w-16 h-0.5 bg-gray-600"></div>
          <span className="font-mono">{zoom >= 14 ? '1 km' : zoom >= 10 ? '5 km' : '10 km'}</span>
        </div>
      </div>

      {/* Enhanced Coordinates Display */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur px-3 py-2 rounded-lg border border-gray-200 shadow-lg">
        <div className="text-xs font-mono text-gray-600 space-y-1">
          <div>Lat: {center[0].toFixed(4)}°</div>
          <div>Lng: {center[1].toFixed(4)}°</div>
        </div>
      </div>

      {/* Analytics Overlay */}
      <AnalyticsOverlay
        selectedDistrict={selectedDistrict || undefined}
        selectedVillage={selectedVillage}
        isVisible={showAnalytics}
        onClose={() => {
          setShowAnalytics(false)
          setSelectedDistrict(null)
        }}
      />
    </div>
  )
}