// Custom hooks for WebGIS functionality with performance optimization

import { useState, useCallback, useEffect } from 'react'
import type { MapLayer, GeoFeature, Village } from '@/types'
import { mockGeoFeatures, mockVillages, getOptimizedLayerData } from '@/services/mockData'
import { 
  getOptimizedLayerData as getOptimizedData, 
  ZOOM_THRESHOLDS,
  geometryCache,
  measurePerformance,
  preloadLayerData
} from '@/lib/geoOptimization'
import { indiaStatesGeoJSON } from '@/services/geoDataService'

interface MapState {
  center: [number, number]
  zoom: number
  bounds?: [[number, number], [number, number]]
}

const defaultLayers: MapLayer[] = [
  {
    id: 'satellite',
    name: 'Satellite Imagery',
    description: 'High-resolution satellite imagery from ISRO CARTOSAT',
    visible: true,
    opacity: 100,
    color: '#3b82f6',
    category: 'satellite',
    type: 'raster',
    minZoom: 1,
    maxZoom: 18
  },
  {
    id: 'state_boundaries',
    name: 'State Boundaries',
    description: 'Indian state boundaries with tribal population density color coding',
    visible: true,
    opacity: 75,
    color: '#6b7280',
    category: 'base',
    type: 'vector',
    zoomThreshold: ZOOM_THRESHOLDS.STATE_LEVEL,
    maxZoom: ZOOM_THRESHOLDS.DISTRICT_LEVEL,
    style: {
      fillOpacity: 0.6,
      color: '#333333',
      weight: 2,
      opacity: 0.8
    }
  },
  {
    id: 'forest_cover',
    name: 'Forest Cover',
    description: 'Forest Survey of India data layer',
    visible: true,
    opacity: 80,
    color: '#059669',
    category: 'fra',
    type: 'vector',
    style: {
      fillOpacity: 0.4,
      color: '#065f46',
      weight: 1
    }
  },
  {
    id: 'settlements',
    name: 'Tribal Settlements',
    description: 'Identified tribal habitations and villages',
    visible: true,
    opacity: 90,
    color: '#f59e0b',
    category: 'fra',
    type: 'vector',
    minZoom: ZOOM_THRESHOLDS.VILLAGE_LEVEL
  },
  {
    id: 'water_bodies',
    name: 'Water Bodies',
    description: 'Rivers, lakes, and water sources',
    visible: false,
    opacity: 70,
    color: '#06b6d4',
    category: 'analysis',
    type: 'vector',
    minZoom: ZOOM_THRESHOLDS.DISTRICT_LEVEL
  },
  {
    id: 'fra_claims',
    name: 'FRA Claim Boundaries',
    description: 'Forest rights claim boundaries and status',
    visible: true,
    opacity: 85,
    color: '#8b5cf6',
    category: 'fra',
    type: 'vector',
    minZoom: ZOOM_THRESHOLDS.VILLAGE_LEVEL
  },
  {
    id: 'elevation',
    name: 'Digital Elevation Model',
    description: 'Terrain elevation and topographic data',
    visible: false,
    opacity: 60,
    color: '#84cc16',
    category: 'base',
    type: 'raster'
  }
]

export const useWebGIS = () => {
  const [mapState, setMapState] = useState<MapState>({
    center: [20.5937, 78.9629], // Center of India (lat, lng)
    zoom: 5 // Zoom level to show entire India
  })
  
  const [layers, setLayers] = useState<MapLayer[]>(defaultLayers)
  const [selectedFeature, setSelectedFeature] = useState<GeoFeature | null>(null)
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [geoFeatures, setGeoFeatures] = useState<{ [layerId: string]: GeoFeature[] }>({})
  const [mapBounds, setMapBounds] = useState<[[number, number], [number, number]] | null>(null)

  // Initialize geo features with realistic data
  useEffect(() => {
    const initializeGeoFeatures = async () => {
      setIsLoading(true)
      
      try {
        // Initialize with base data from enhanced mock service
        const initialFeatures = mockGeoFeatures
        
        setGeoFeatures({
          'state_boundaries': indiaStatesGeoJSON,
          ...initialFeatures
        })
        
        // Preload optimized data for common zoom levels
        await preloadLayerData('state_boundaries', [4, 5, 6], indiaStatesGeoJSON)
        
      } catch (error) {
        console.error('Failed to initialize geo features:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeGeoFeatures()
  }, [])

  // Update layer visibility based on zoom level
  useEffect(() => {
    const currentZoom = mapState.zoom || 5
    
    setLayers(prevLayers => 
      prevLayers.map(layer => {
        let shouldBeVisible = layer.visible
        
        // Auto-toggle layers based on zoom thresholds
        if (layer.id === 'state_boundaries') {
          // Always show state boundaries
          shouldBeVisible = layer.visible
        } else if (layer.minZoom && currentZoom < layer.minZoom) {
          shouldBeVisible = false
        } else if (layer.maxZoom && currentZoom > layer.maxZoom) {
          shouldBeVisible = false
        }
        
        return {
          ...layer,
          visible: shouldBeVisible
        }
      })
    )
  }, [mapState.zoom])

  // Toggle layer visibility
  const toggleLayer = useCallback((layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, visible: !layer.visible }
        : layer
    ))
  }, [])

  // Update layer opacity
  const updateLayerOpacity = useCallback((layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId 
        ? { ...layer, opacity }
        : layer
    ))
  }, [])

  // Filter layers by category
  const getLayersByCategory = useCallback((category: MapLayer['category']) => {
    return layers.filter(layer => layer.category === category)
  }, [layers])

  // Get visible layers
  const getVisibleLayers = useCallback(() => {
    return layers.filter(layer => layer.visible)
  }, [layers])

  // Update map state with optimization trigger
  const updateMapState = useCallback((newState: Partial<MapState>) => {
    setMapState(prev => ({ ...prev, ...newState }))
  }, [])

  // Update map bounds
  const updateMapBounds = useCallback((bounds: [[number, number], [number, number]]) => {
    setMapBounds(bounds)
  }, [])

  // Center map on village
  const centerOnVillage = useCallback((village: Village) => {
    setMapState({
      center: village.coordinates,
      zoom: 14
    })
    setSelectedVillage(village)
  }, [])

  // Handle feature click
  const onFeatureClick = useCallback((feature: GeoFeature) => {
    setSelectedFeature(feature)
    
    // If it's a settlement, find and select the village
    if (feature.properties.name) {
      const village = mockVillages.find(v => v.name === feature.properties.name)
      if (village) {
        setSelectedVillage(village)
      }
    }
  }, [])

  // Clear selections
  const clearSelections = useCallback(() => {
    setSelectedFeature(null)
    setSelectedVillage(null)
  }, [])

  // Load features for a specific layer with optimization
  const loadLayerFeatures = useCallback(async (layerId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call delay for demo
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const { result: features, time } = measurePerformance(() => {
        // Get base features for the layer
        let baseFeatures: GeoFeature[] = []
        
        if (layerId === 'state_boundaries') {
          baseFeatures = indiaStatesGeoJSON
        } else {
          baseFeatures = mockGeoFeatures[layerId] || []
        }
        
        // Apply optimization based on current zoom and bounds
        return getOptimizedData(
          layerId, 
          mapState.zoom || 5, 
          baseFeatures,
          mapBounds || undefined
        )
      }, `loadLayerFeatures:${layerId}`)
      
      setGeoFeatures(prev => ({
        ...prev,
        [layerId]: features
      }))
      
      return features
    } catch (error) {
      console.error('Failed to load layer features:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [mapState.zoom, mapBounds])

  // Get optimized features for a layer
  const getLayerFeatures = useCallback((layerId: string): GeoFeature[] => {
    const baseFeatures = geoFeatures[layerId] || []
    
    // Return optimized features based on current zoom and bounds
    return getOptimizedData(
      layerId,
      mapState.zoom || 5,
      baseFeatures,
      mapBounds || undefined
    )
  }, [geoFeatures, mapState.zoom, mapBounds])

  // Get cache statistics for debugging
  const getCacheStats = useCallback(() => {
    return geometryCache.getStats()
  }, [])

  // Search villages by name
  const searchVillages = useCallback((query: string): Village[] => {
    if (!query.trim()) return mockVillages
    
    return mockVillages.filter(village =>
      village.name.toLowerCase().includes(query.toLowerCase()) ||
      village.district.toLowerCase().includes(query.toLowerCase()) ||
      village.state.toLowerCase().includes(query.toLowerCase())
    )
  }, [])

  // Get features within bounds
  const getFeaturesInBounds = useCallback((bounds: [[number, number], [number, number]]): GeoFeature[] => {
    const allFeatures: GeoFeature[] = []
    
    Object.values(geoFeatures).forEach(layerFeatures => {
      allFeatures.push(...layerFeatures)
    })
    
    // Simple bounding box filter for point features
    return allFeatures.filter(feature => {
      if (feature.type === 'Point' && Array.isArray(feature.geometry.coordinates)) {
        const [lng, lat] = feature.geometry.coordinates as [number, number]
        return (
          lng >= bounds[0][1] && lng <= bounds[1][1] &&
          lat >= bounds[0][0] && lat <= bounds[1][0]
        )
      }
      return true // Include all other feature types for now
    })
  }, [geoFeatures])

  // Reset map to default view
  const resetMapView = useCallback(() => {
    setMapState({
      center: [20.5937, 78.9629], // Center of India (lat, lng)
      zoom: 5
    })
    clearSelections()
  }, [clearSelections])

  // Export map data
  const exportMapData = useCallback(async (format: 'geojson' | 'kml' | 'shapefile' = 'geojson') => {
    setIsLoading(true)
    try {
      // Simulate export processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const visibleFeatures: GeoFeature[] = []
      getVisibleLayers().forEach(layer => {
        if (geoFeatures[layer.id]) {
          visibleFeatures.push(...geoFeatures[layer.id])
        }
      })
      
      const exportData = {
        type: 'FeatureCollection',
        features: visibleFeatures,
        metadata: {
          exportDate: new Date().toISOString(),
          format,
          layers: getVisibleLayers().map(l => ({ id: l.id, name: l.name }))
        }
      }
      
      // Create download link
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fra_atlas_map_export_${Date.now()}.${format === 'geojson' ? 'json' : format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      return { success: true, format, featureCount: visibleFeatures.length }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Export failed'
      }
    } finally {
      setIsLoading(false)
    }
  }, [geoFeatures, getVisibleLayers])

  return {
    // State
    mapState,
    layers,
    selectedFeature,
    selectedVillage,
    isLoading,
    geoFeatures,
    mapBounds,
    
    // Layer management
    toggleLayer,
    updateLayerOpacity,
    getLayersByCategory,
    getVisibleLayers,
    loadLayerFeatures,
    getLayerFeatures,
    
    // Map navigation
    updateMapState,
    updateMapBounds,
    centerOnVillage,
    resetMapView,
    
    // Feature interaction
    onFeatureClick,
    clearSelections,
    getFeaturesInBounds,
    
    // Search and export
    searchVillages,
    exportMapData,
    
    // Performance monitoring
    getCacheStats
  }
}