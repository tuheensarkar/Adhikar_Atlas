"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet'
import L from 'leaflet'
import html2canvas from 'html2canvas'
import { Download, MapPin, Eye, EyeOff, X } from 'lucide-react'

// TypeScript interfaces
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

interface DistrictProperties {
  name: string
  stateCode: string
  stateName: string
  tribalPopulation: number
  totalPopulation: number
  tribalPercentage: number
  fraClaimsCount: number
  rejectionPercentage: number
  eligibleSchemes: string[]
  area: number
  priority: 'very_high' | 'high' | 'medium'
}

interface FRAData {
  district: string
  state: string
  tribalPercentage: number
  fraClaimsCount: number
  rejectionPercentage: number
  eligibleSchemes: string[]
  pendingClaims: number
  approvedClaims: number
}

interface EnhancedMapProps {
  center?: [number, number]
  zoom?: number
  onDistrictClick?: (data: FRAData) => void
  className?: string
}

// Enhanced color coding for tribal percentage
const getTribalColor = (tribalPercentage: number): string => {
  if (tribalPercentage >= 80) return '#7f1d1d'
  if (tribalPercentage >= 25) return '#dc2626'
  if (tribalPercentage >= 15) return '#ef4444'
  if (tribalPercentage >= 10) return '#f59e0b'
  if (tribalPercentage >= 5) return '#eab308'
  return '#22c55e'
}

// Mock data for states and districts
const statesData = [
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    tribalPopulation: 15316784,
    totalPopulation: 85358965,
    tribalPercentage: 21.09,
    fraClaimsCount: 2287,
    districts: 55,
    forestCover: 25.15,
    coordinates: [[74.029, 21.082], [76.234, 20.932], [78.912, 21.168], [81.643, 22.305], [82.654, 24.215], [81.987, 25.312], [80.156, 26.034], [78.234, 26.187], [76.345, 25.832], [74.892, 24.743], [73.987, 23.156], [74.029, 21.082]]
  },
  {
    name: 'Odisha',
    code: 'OR',
    tribalPopulation: 9590756,
    totalPopulation: 45429399,
    tribalPercentage: 22.85,
    fraClaimsCount: 1342,
    districts: 30,
    forestCover: 33.16,
    coordinates: [[84.329, 17.779], [85.102, 17.654], [86.527, 18.241], [87.021, 19.445], [87.463, 20.743], [86.984, 21.495], [85.613, 22.347], [84.675, 21.943], [83.985, 21.206], [83.342, 20.316], [83.645, 19.284], [84.234, 18.302], [84.329, 17.779]]
  },
  {
    name: 'Telangana',
    code: 'TG',
    tribalPopulation: 3504543,
    totalPopulation: 39362732,
    tribalPercentage: 9.34,
    fraClaimsCount: 645,
    districts: 33,
    forestCover: 24.0,
    coordinates: [[77.234, 15.234], [79.987, 15.567], [81.234, 17.456], [80.456, 19.234], [78.789, 19.567], [77.456, 18.234], [77.234, 15.234]]
  },
  {
    name: 'Tripura',
    code: 'TR',
    tribalPopulation: 1166813,
    totalPopulation: 4169794,
    tribalPercentage: 31.78,
    fraClaimsCount: 234,
    districts: 8,
    forestCover: 73.68,
    coordinates: [[91.234, 22.567], [92.456, 22.789], [92.789, 24.234], [92.234, 24.567], [91.567, 24.234], [91.234, 23.456], [91.234, 22.567]]
  }
]

const districtsData = [
  {
    name: 'Jhabua',
    stateCode: 'MP',
    stateName: 'Madhya Pradesh',
    tribalPopulation: 868679,
    totalPopulation: 1025048,
    tribalPercentage: 87.6,
    fraClaimsCount: 156,
    rejectionPercentage: 12.5,
    eligibleSchemes: ['PM-KISAN', 'MGNREGA', 'DAJGUA'],
    area: 6782,
    priority: 'very_high' as const,
    coordinates: [[74.2, 22.3], [74.8, 22.2], [75.1, 22.7], [74.9, 23.1], [74.5, 23.2], [74.1, 22.9], [74.0, 22.5], [74.2, 22.3]]
  },
  {
    name: 'Mayurbhanj',
    stateCode: 'OR',
    stateName: 'Odisha',
    tribalPopulation: 1479576,
    totalPopulation: 2519738,
    tribalPercentage: 58.7,
    fraClaimsCount: 287,
    rejectionPercentage: 8.3,
    eligibleSchemes: ['PM-KISAN', 'Jal Jeevan Mission', 'DAJGUA'],
    area: 10418,
    priority: 'high' as const,
    coordinates: [[85.8, 21.3], [86.8, 21.1], [87.2, 22.1], [86.9, 22.6], [86.3, 22.7], [85.7, 22.3], [85.5, 21.8], [85.8, 21.3]]
  },
  {
    name: 'Adilabad',
    stateCode: 'TG',
    stateName: 'Telangana',
    tribalPopulation: 461553,
    totalPopulation: 708972,
    tribalPercentage: 17.08,
    fraClaimsCount: 89,
    rejectionPercentage: 15.7,
    eligibleSchemes: ['MGNREGA', 'PM-KISAN'],
    area: 16128,
    priority: 'medium' as const,
    coordinates: [[78.5, 18.8], [79.3, 18.6], [79.7, 19.4], [79.4, 19.9], [78.9, 20.0], [78.4, 19.6], [78.2, 19.1], [78.5, 18.8]]
  },
  {
    name: 'Dhalai',
    stateCode: 'TR',
    stateName: 'Tripura',
    tribalPopulation: 235689,
    totalPopulation: 378230,
    tribalPercentage: 62.3,
    fraClaimsCount: 67,
    rejectionPercentage: 6.2,
    eligibleSchemes: ['DAJGUA', 'Jal Jeevan Mission', 'MGNREGA'],
    area: 2523,
    priority: 'high' as const,
    coordinates: [[91.6, 23.8], [92.1, 23.7], [92.3, 24.2], [92.0, 24.5], [91.7, 24.4], [91.5, 24.1], [91.4, 23.9], [91.6, 23.8]]
  }
]

// Calculate polygon centroid
const calculateCentroid = (coordinates: number[][]): [number, number] => {
  const x = coordinates.reduce((sum, coord) => sum + coord[1], 0) / coordinates.length
  const y = coordinates.reduce((sum, coord) => sum + coord[0], 0) / coordinates.length
  return [x, y]
}

// Create label icons
const createStateLabel = (name: string): L.DivIcon => {
  return L.divIcon({
    html: `<div style="
      font-size: 14px;
      font-weight: bold;
      color: #000;
      text-align: center;
      text-shadow: 1px 1px 2px rgba(255,255,255,0.8);
      pointer-events: none;
      white-space: nowrap;
    ">${name}</div>`,
    className: 'state-label',
    iconSize: [100, 20],
    iconAnchor: [50, 10]
  })
}

const createDistrictLabel = (name: string, zoom: number): L.DivIcon | null => {
  if (zoom <= 6) return null
  
  return L.divIcon({
    html: `<div style="
      font-size: 11px;
      color: #666;
      text-align: center;
      text-shadow: 1px 1px 1px rgba(255,255,255,0.9);
      pointer-events: none;
      white-space: nowrap;
    ">${name}</div>`,
    className: 'district-label',
    iconSize: [80, 16],
    iconAnchor: [40, 8]
  })
}

// Collapsible Legend Component
const CollapsibleLegend: React.FC<{ isCollapsed: boolean; onToggle: () => void }> = ({ 
  isCollapsed, 
  onToggle 
}) => (
  <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg shadow-lg">
    <div 
      className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 rounded-t-lg"
      onClick={onToggle}
    >
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-semibold text-gray-800">Tribal Population %</h4>
      </div>
      {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
    </div>
    
    {!isCollapsed && (
      <div className="px-3 pb-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-900 rounded border"></div>
          <span className="text-xs text-gray-700">Very High (≥80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded border"></div>
          <span className="text-xs text-gray-700">High (25–80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded border"></div>
          <span className="text-xs text-gray-700">Med-High (15–25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded border"></div>
          <span className="text-xs text-gray-700">Medium (10–15%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded border"></div>
          <span className="text-xs text-gray-700">Low-Med (5–10%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded border"></div>
          <span className="text-xs text-gray-700">Low (&lt;5%)</span>
        </div>
      </div>
    )}
  </div>
)

// FRA Data Modal
const FRAModal: React.FC<{ 
  data: FRAData | null; 
  onClose: () => void 
}> = ({ data, onClose }) => {
  if (!data) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-[2000] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">FRA Data - {data.district}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-gray-600">State</div>
              <div className="font-semibold">{data.state}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-sm text-gray-600">Tribal %</div>
              <div className="font-semibold">{data.tribalPercentage.toFixed(1)}%</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm text-gray-600">Total Claims</div>
              <div className="font-semibold">{data.fraClaimsCount}</div>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <div className="text-sm text-gray-600">Rejection %</div>
              <div className="font-semibold">{data.rejectionPercentage}%</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-3 rounded">
              <div className="text-sm text-gray-600">Pending</div>
              <div className="font-semibold">{data.pendingClaims}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm text-gray-600">Approved</div>
              <div className="font-semibold">{data.approvedClaims}</div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-gray-600 mb-2">Eligible Schemes</div>
            <div className="flex flex-wrap gap-2">
              {data.eligibleSchemes.map((scheme, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                  {scheme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Map component with zoom tracking
const MapWithLabels: React.FC<{ 
  onZoomChange: (zoom: number) => void;
  onDistrictClick: (data: FRAData) => void;
}> = ({ onZoomChange, onDistrictClick }) => {
  const map = useMap()
  const [zoom, setZoom] = useState(map.getZoom())
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null)

  useEffect(() => {
    const handleZoom = () => {
      const currentZoom = map.getZoom()
      setZoom(currentZoom)
      onZoomChange(currentZoom)
    }

    map.on('zoomend', handleZoom)
    return () => { map.off('zoomend', handleZoom) }
  }, [map, onZoomChange])

  // Add state and district labels
  useEffect(() => {
    const markers: L.Marker[] = []

    // State labels
    statesData.forEach(state => {
      const centroid = calculateCentroid(state.coordinates)
      const marker = L.marker(centroid, {
        icon: createStateLabel(state.name),
        interactive: false
      }).addTo(map)
      markers.push(marker)
    })

    // District labels (zoom dependent)
    if (zoom > 6) {
      districtsData.forEach(district => {
        const centroid = calculateCentroid(district.coordinates)
        const icon = createDistrictLabel(district.name, zoom)
        if (icon) {
          const marker = L.marker(centroid, {
            icon,
            interactive: false
          }).addTo(map)
          markers.push(marker)
        }
      })
    }

    return () => {
      markers.forEach(marker => map.removeLayer(marker))
    }
  }, [map, zoom])

  const handleDistrictClick = (district: any) => {
    const fraData: FRAData = {
      district: district.name,
      state: district.stateName,
      tribalPercentage: district.tribalPercentage,
      fraClaimsCount: district.fraClaimsCount,
      rejectionPercentage: district.rejectionPercentage,
      eligibleSchemes: district.eligibleSchemes,
      pendingClaims: Math.floor(district.fraClaimsCount * (1 - district.rejectionPercentage / 100) * 0.3),
      approvedClaims: Math.floor(district.fraClaimsCount * (1 - district.rejectionPercentage / 100) * 0.7)
    }
    onDistrictClick(fraData)
  }

  return (
    <>
      {/* State Polygons */}
      {statesData.map((state, index) => {
        const positions = state.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
        const isHovered = hoveredPolygon === `state-${state.code}`
        
        return (
          <Polygon
            key={`state-${state.code}`}
            positions={positions}
            pathOptions={{
              fillColor: getTribalColor(state.tribalPercentage),
              fillOpacity: 0.3,
              color: isHovered ? '#007bff' : '#333',
              weight: isHovered ? 3 : 2,
              opacity: 1
            }}
            eventHandlers={{
              mouseover: () => setHoveredPolygon(`state-${state.code}`),
              mouseout: () => setHoveredPolygon(null)
            }}
          />
        )
      })}

      {/* District Polygons */}
      {districtsData.map((district, index) => {
        const positions = district.coordinates.map(([lng, lat]) => [lat, lng] as [number, number])
        const isHovered = hoveredPolygon === `district-${district.name}`
        
        return (
          <Polygon
            key={`district-${district.name}`}
            positions={positions}
            pathOptions={{
              fillColor: getTribalColor(district.tribalPercentage),
              fillOpacity: isHovered ? 0.7 : 0.5,
              color: isHovered ? '#007bff' : '#999',
              weight: isHovered ? 3 : 1,
              opacity: 1
            }}
            eventHandlers={{
              mouseover: () => setHoveredPolygon(`district-${district.name}`),
              mouseout: () => setHoveredPolygon(null),
              click: () => handleDistrictClick(district)
            }}
          />
        )
      })}
    </>
  )
}

// Main Enhanced Map Component
export const EnhancedMap: React.FC<EnhancedMapProps> = ({
  center = [20.5937, 78.9629],
  zoom = 5,
  onDistrictClick,
  className = ""
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [isLegendCollapsed, setIsLegendCollapsed] = useState(false)
  const [selectedFRAData, setSelectedFRAData] = useState<FRAData | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleDistrictClickInternal = (data: FRAData) => {
    setSelectedFRAData(data)
    onDistrictClick?.(data)
  }

  const exportMap = async () => {
    if (!mapRef.current) return
    
    setIsExporting(true)
    try {
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        logging: false,
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight
      })
      
      const link = document.createElement('a')
      link.download = `tribal-population-map-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={mapRef}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full rounded-lg"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        
        <MapWithLabels 
          onZoomChange={setCurrentZoom}
          onDistrictClick={handleDistrictClickInternal}
        />
      </MapContainer>

      {/* Export Button */}
      <button
        onClick={exportMap}
        disabled={isExporting}
        className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm border border-gray-300 rounded-lg p-3 shadow-lg hover:bg-gray-50 disabled:opacity-50"
        title="Export Map"
      >
        <Download className={`w-5 h-5 ${isExporting ? 'animate-pulse' : ''}`} />
      </button>

      {/* Collapsible Legend */}
      <CollapsibleLegend 
        isCollapsed={isLegendCollapsed}
        onToggle={() => setIsLegendCollapsed(!isLegendCollapsed)}
      />

      {/* FRA Data Modal */}
      <FRAModal 
        data={selectedFRAData}
        onClose={() => setSelectedFRAData(null)}
      />

      {/* Custom Styles */}
      <style jsx global>{`
        .state-label, .district-label {
          background: transparent !important;
          border: none !important;
          pointer-events: none !important;
        }
      `}</style>
    </div>
  )
}

export default EnhancedMap