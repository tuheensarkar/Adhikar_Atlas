"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'

// Enhanced TypeScript interfaces
interface StateProperties {
  name: string
  code: string
  tribalPopulation: number
  totalPopulation: number
  tribalPercentage: number
  fraClaimsCount: number
  districts: number
  forestCover: number
}

interface StateGeoJSON {
  type: 'Feature'
  properties: StateProperties
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
}

interface StateLayerProps {
  onStateClick?: (state: StateProperties) => void
  onStateHover?: (state: StateProperties | null) => void
  className?: string
}

// Focused India states GeoJSON data - Priority states for FRA implementation
const indiaStatesGeoJSON: StateGeoJSON[] = [
  {
    type: 'Feature',
    properties: {
      name: 'Madhya Pradesh',
      code: 'MP',
      tribalPopulation: 15316784,
      totalPopulation: 85358965,
      tribalPercentage: 21.09,
      fraClaimsCount: 2287,
      districts: 55,
      forestCover: 25.15
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [74.029, 21.082], [76.234, 20.932], [78.912, 21.168], [81.643, 22.305],
        [82.654, 24.215], [81.987, 25.312], [80.156, 26.034], [78.234, 26.187],
        [76.345, 25.832], [74.892, 24.743], [73.987, 23.156], [74.029, 21.082]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Odisha',
      code: 'OR',
      tribalPopulation: 9590756,
      totalPopulation: 45429399,
      tribalPercentage: 22.85,
      fraClaimsCount: 1342,
      districts: 30,
      forestCover: 33.16
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [81.338, 17.780], [82.211, 17.836], [83.101, 18.302], [83.892, 18.302], 
        [84.341, 18.795], [85.095, 19.565], [85.605, 20.097], [86.089, 20.736], 
        [86.797, 21.004], [86.814, 21.993], [86.237, 22.147], [85.221, 22.127], 
        [84.681, 21.993], [84.395, 21.719], [84.007, 21.545], [83.771, 21.177], 
        [83.370, 20.756], [82.667, 20.324], [82.419, 19.874], [81.896, 19.565], 
        [81.522, 19.177], [81.111, 18.795], [80.781, 18.271], [81.338, 17.780]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Telangana',
      code: 'TG',
      tribalPopulation: 3504543,
      totalPopulation: 39362732,
      tribalPercentage: 9.34,
      fraClaimsCount: 645,
      districts: 33,
      forestCover: 24.0
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.234, 15.234], [79.987, 15.567], [81.234, 17.456], [80.456, 19.234],
        [78.789, 19.567], [77.456, 18.234], [77.234, 15.234]
      ]]
    }
  },
  {
    type: 'Feature',
    properties: {
      name: 'Tripura',
      code: 'TR',
      tribalPopulation: 1166813,
      totalPopulation: 4169794,
      tribalPercentage: 31.78,
      fraClaimsCount: 234,
      districts: 8,
      forestCover: 73.68
    },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [91.234, 22.567], [92.456, 22.789], [92.789, 24.234], [92.234, 24.567],
        [91.567, 24.234], [91.234, 23.456], [91.234, 22.567]
      ]]
    }
  }
]

// Enhanced color coding function for states based on tribal percentage
const getStateColor = (tribalPercentage: number): string => {
  if (tribalPercentage >= 80) return '#7f1d1d' // Very dark red for 80%+
  if (tribalPercentage >= 25) return '#dc2626' // Dark red for 25%+
  if (tribalPercentage >= 15) return '#ef4444' // Medium red for 15%+
  if (tribalPercentage >= 10) return '#f59e0b' // Orange for 10-15%
  if (tribalPercentage >= 5) return '#eab308'  // Yellow for 5-10%
  return '#22c55e' // Green for <5%
}

// Calculate polygon centroid
const calculatePolygonCentroid = (coordinates: number[][]): [number, number] => {
  let totalArea = 0
  let centroidLat = 0
  let centroidLng = 0

  const points = coordinates
  const n = points.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const [lng1, lat1] = points[i]
    const [lng2, lat2] = points[j]
    
    const crossProduct = lng1 * lat2 - lng2 * lat1
    totalArea += crossProduct
    centroidLat += (lat1 + lat2) * crossProduct
    centroidLng += (lng1 + lng2) * crossProduct
  }

  totalArea *= 0.5
  centroidLat /= (6 * totalArea)
  centroidLng /= (6 * totalArea)

  return [centroidLat, centroidLng]
}

// Create custom label icon for states
const createStateLabelIcon = (state: StateProperties): L.DivIcon => {
  const color = getStateColor(state.tribalPercentage)
  
  return L.divIcon({
    html: `
      <div style="
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid #333;
        border-radius: 6px;
        padding: 4px 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        min-width: 80px;
        backdrop-filter: blur(2px);
      ">
        <div style="
          font-size: 12px;
          font-weight: bold;
          color: #1f2937;
          line-height: 1.2;
        ">${state.name}</div>
        <div style="
          font-size: 10px;
          color: ${color};
          font-weight: 600;
          margin-top: 2px;
        ">${state.tribalPercentage.toFixed(1)}%</div>
      </div>
    `,
    className: 'state-label-icon',
    iconSize: [80, 40],
    iconAnchor: [40, 20]
  })
}

export const StateLayer: React.FC<StateLayerProps> = ({
  onStateClick,
  onStateHover,
  className = ""
}) => {
  const map = useMap()
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [labelMarkers, setLabelMarkers] = useState<L.Marker[]>([])

  // Calculate centroids and create data for states
  const stateData = useMemo(() => {
    return indiaStatesGeoJSON.map(state => {
      const centroid = calculatePolygonCentroid(state.geometry.coordinates[0])
      const color = getStateColor(state.properties.tribalPercentage)
      
      return {
        ...state,
        centroid,
        color
      }
    })
  }, [])

  // Fit map view to all polygons on mount
  useEffect(() => {
    if (map && stateData.length > 0) {
      const group = new L.FeatureGroup()
      
      stateData.forEach(state => {
        const coords = state.geometry.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number])
        const polygon = L.polygon(coords)
        group.addLayer(polygon)
      })
      
      map.fitBounds(group.getBounds(), { padding: [20, 20] })
    }
  }, [map, stateData])

  // Create and manage label markers for states
  useEffect(() => {
    if (!map) return

    // Clear existing markers
    labelMarkers.forEach(marker => map.removeLayer(marker))

    // Create new markers for states
    const newMarkers = stateData.map(state => {
      const marker = L.marker(state.centroid, {
        icon: createStateLabelIcon(state.properties),
        interactive: false
      }).addTo(map)
      
      return marker
    })

    setLabelMarkers(newMarkers)

    // Cleanup
    return () => {
      newMarkers.forEach(marker => map.removeLayer(marker))
    }
  }, [map, stateData])

  return (
    <>
      {/* State Polygons */}
      {stateData.map((state, index) => {
        const positions = state.geometry.coordinates[0].map(([lng, lat]) => [lat, lng] as [number, number])
        const isHovered = hoveredState === state.properties.code

        return (
          <Polygon
            key={`state-${state.properties.code}-${index}`}
            positions={positions}
            pathOptions={{
              fillColor: state.color,
              fillOpacity: 0.3,
              color: isHovered ? '#007bff' : '#333',
              weight: isHovered ? 3 : 1.5,
              opacity: 1,
              className: `state-polygon ${isHovered ? 'state-hovered' : ''}`
            }}
            eventHandlers={{
              mouseover: (e) => {
                setHoveredState(state.properties.code)
                if (onStateHover) {
                  onStateHover(state.properties)
                }
                
                // Show tooltip
                const layer = e.target
                layer.bindTooltip(
                  `<div class="font-semibold">${state.properties.name}</div>
                   <div class="text-sm">Tribal Population: ${state.properties.tribalPercentage.toFixed(1)}%</div>
                   <div class="text-sm">FRA Claims: ${state.properties.fraClaimsCount.toLocaleString()}</div>`,
                  {
                    permanent: false,
                    direction: 'top',
                    className: 'custom-tooltip'
                  }
                ).openTooltip()
              },
              mouseout: () => {
                setHoveredState(null)
                if (onStateHover) {
                  onStateHover(null)
                }
              },
              click: () => {
                if (onStateClick) {
                  onStateClick(state.properties)
                }
                
                // Zoom to state
                const bounds = L.latLngBounds(positions)
                map.fitBounds(bounds, { padding: [20, 20] })
              }
            }}
          />
        )
      })}
      
      {/* Custom CSS for tooltips and styling */}
      <style jsx global>{`
        .custom-tooltip {
          background: rgba(0, 0, 0, 0.8) !important;
          border: none !important;
          border-radius: 6px !important;
          color: white !important;
          font-size: 12px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3) !important;
        }
        
        .custom-tooltip:before {
          border-top-color: rgba(0, 0, 0, 0.8) !important;
        }
        
        .state-polygon {
          transition: all 0.2s ease-in-out;
        }
        
        .state-hovered {
          filter: brightness(1.1);
        }
        
        .state-label-icon {
          pointer-events: none;
        }
      `}</style>
    </>
  )
}

export default StateLayer