// GeoJSON Data Service for India Boundaries and Geographic Data
// FOCUSED ON 4 PRIORITY STATES: Madhya Pradesh, Odisha, Telangana, Tripura
// This reduces visual clutter and improves user experience
import type { GeoFeature } from '@/types'
import { simplify } from '@turf/simplify'
import { bbox } from '@turf/bbox'
import { featureCollection } from '@turf/helpers'

// Census 2011 data for Indian states with tribal population statistics
export interface StateData {
  name: string
  code: string
  population: number
  tribalPopulation: number
  tribalPercentage: number
  forestCover: number
  districts: number
  fraClaimsCount: number
  center: [number, number]
  color: string
  priority: 'high' | 'medium' | 'low'
}



// Realistic India State Boundaries (simplified coordinates for performance)
// Focused on 4 priority states: Madhya Pradesh, Odisha, Telangana, Tripura
export const indiaStatesGeoJSON: GeoFeature[] = [
  {
    id: 'state_odisha',
    type: 'Polygon',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [81.338745, 17.780335], [82.211494, 17.835695], [83.100586, 18.302009], 
        [83.891602, 18.302009], [84.341431, 18.795189], [85.094604, 19.565430], 
        [85.605469, 20.097207], [86.088867, 20.735566], [86.797485, 21.003576], 
        [86.813965, 21.993244], [86.236572, 22.146708], [85.220947, 22.126506], 
        [84.681396, 21.993244], [84.395142, 21.718680], [84.006958, 21.544566], 
        [83.770752, 21.176729], [83.369751, 20.756114], [82.666626, 20.323678], 
        [82.419434, 19.873768], [81.895752, 19.565430], [81.522217, 19.176563], 
        [81.111450, 18.795189], [80.781250, 18.271086], [81.338745, 17.780335]
      ]]
    },
    properties: {
      name: 'Odisha',
      code: 'OR',
      population: 45429399,
      tribalPopulation: 9590756,
      tribalPercentage: 22.85,
      forestCover: 33.16,
      districts: 30,
      fraClaimsCount: 1342,
      color: '#ef4444',
      priority: 'high',
      labelPosition: [20.9517, 85.0985]
    }
  },
  {
    id: 'state_mp',
    type: 'Polygon',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [74.044189, 21.062317], [75.476074, 21.022442], [76.870117, 21.062317], 
        [78.058472, 21.227414], [79.615479, 21.717171], [80.561523, 22.278931], 
        [81.254883, 22.907680], [81.859131, 23.553917], [81.936035, 24.206890], 
        [81.991577, 24.991295], [81.386719, 25.778407], [80.770264, 26.297018], 
        [79.859619, 26.705801], [79.013672, 26.705801], [78.090820, 26.529430], 
        [77.167969, 25.958045], [76.278076, 25.482951], [75.344238, 24.949024], 
        [74.729004, 24.266997], [74.212646, 23.453309], [74.044189, 22.715390], 
        [74.060669, 21.062317]
      ]]
    },
    properties: {
      name: 'Madhya Pradesh',
      code: 'MP',
      population: 85358965,
      tribalPopulation: 15316784,
      tribalPercentage: 21.09,
      forestCover: 25.15,
      districts: 55,
      fraClaimsCount: 2287,
      color: '#ef4444',
      priority: 'high',
      labelPosition: [22.9734, 78.6569]
    }
  },
  {
    id: 'state_telangana',
    type: 'Polygon',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [77.309570, 15.822042], [79.001465, 16.074016], [80.089111, 16.570120], 
        [80.781250, 17.623937], [80.539551, 18.771916], [79.749756, 19.624134], 
        [78.618164, 19.773577], [77.771606, 19.444176], [77.265625, 18.438178], 
        [77.309570, 15.822042]
      ]]
    },
    properties: {
      name: 'Telangana',
      code: 'TG',
      population: 39362732,
      tribalPopulation: 3504543,
      tribalPercentage: 9.34,
      forestCover: 24.0,
      districts: 33,
      fraClaimsCount: 645,
      color: '#eab308',
      priority: 'medium',
      labelPosition: [18.1124, 79.0193]
    }
  },
  {
    id: 'state_tripura',
    type: 'Polygon',
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [91.366699, 23.083055], [92.297363, 23.083055], [92.297363, 24.500447], 
        [91.970215, 24.471954], [91.747070, 24.266997], [91.659668, 23.994285], 
        [91.553711, 23.718710], [91.427612, 23.563987], [91.366699, 23.083055]
      ]]
    },
    properties: {
      name: 'Tripura',
      code: 'TR',
      population: 4169794,
      tribalPopulation: 1166813,
      tribalPercentage: 31.8,
      forestCover: 73.68,
      districts: 8,
      fraClaimsCount: 287,
      color: '#dc2626',
      priority: 'high',
      labelPosition: [23.9408, 91.9882]
    }
  }
]



// Performance optimization: Simplify geometries based on zoom level with validation
export const simplifyGeometry = (feature: GeoFeature, zoomLevel: number): GeoFeature => {
  // Validate feature structure
  if (!feature || !feature.geometry || !feature.geometry.coordinates) {
    console.warn('Invalid feature for simplification:', feature)
    return feature
  }
  
  const tolerance = zoomLevel < 6 ? 0.01 : zoomLevel < 8 ? 0.005 : 0.001
  
  try {
    // Validate coordinates structure before simplification
    const coords = feature.geometry.coordinates
    if (feature.type === 'Polygon') {
      if (!Array.isArray(coords) || coords.length === 0 || !Array.isArray(coords[0])) {
        console.warn('Invalid polygon coordinates:', coords)
        return feature
      }
    }
    
    // Create a proper GeoJSON Feature for Turf.js
    const turfFeature = {
      type: 'Feature' as const,
      geometry: feature.geometry as any, // Type assertion for Turf.js compatibility
      properties: feature.properties
    }
    
    const simplified = simplify(turfFeature, { tolerance, highQuality: false })
    
    // Ensure we have a Feature with geometry before accessing
    if (simplified.type === 'Feature' && simplified.geometry) {
      return {
        ...feature,
        geometry: simplified.geometry as any // Type assertion back to our custom type
      }
    }
    
    return feature
  } catch (error) {
    console.warn('Failed to simplify geometry:', error)
    return feature
  }
}

// Get appropriate layer data based on zoom level with validation
export const getLayerDataForZoom = (layerId: string, zoomLevel: number): GeoFeature[] => {
  let features: GeoFeature[] = []
  
  switch (layerId) {
    case 'state_boundaries':
      features = indiaStatesGeoJSON
      break
    
    default:
      return []
  }
  
  // Validate and filter features
  return features
    .filter(feature => {
      if (!feature || !feature.geometry || !feature.geometry.coordinates) {
        console.warn(`Invalid feature in ${layerId}:`, feature)
        return false
      }
      return true
    })
    .map(f => simplifyGeometry(f, zoomLevel))
}

// Color coding function for tribal population percentage
export const getTribalPopulationColor = (tribalPercentage: number): string => {
  if (tribalPercentage >= 80) return '#7f1d1d' // Very High - Dark red
  if (tribalPercentage >= 25) return '#dc2626' // High - Red  
  if (tribalPercentage >= 15) return '#ef4444' // Med-High - Medium red
  if (tribalPercentage >= 10) return '#f59e0b' // Medium - Orange
  if (tribalPercentage >= 5) return '#eab308'  // Low-Med - Yellow
  return '#22c55e' // Low - Green
}

// Get bounding box for a set of features
export const getFeaturesBounds = (features: GeoFeature[]): [[number, number], [number, number]] | null => {
  if (features.length === 0) return null
  
  try {
    // Convert GeoFeature objects to proper GeoJSON Feature objects
    const turfFeatures = features.map(feature => ({
      type: 'Feature' as const,
      geometry: feature.geometry as any, // Type assertion for Turf.js compatibility
      properties: feature.properties
    }))
    const collection = featureCollection(turfFeatures)
    const bounds = bbox(collection)
    
    // Convert bbox to Leaflet bounds format: [[south, west], [north, east]]
    return [
      [bounds[1], bounds[0]], // [lat, lng] for southwest
      [bounds[3], bounds[2]]  // [lat, lng] for northeast
    ]
  } catch (error) {
    console.warn('Failed to calculate bounds:', error)
    return null
  }
}

// Cache for processed geometries
const geometryCache = new Map<string, GeoFeature[]>()

export const getCachedLayerData = (layerId: string, zoomLevel: number): GeoFeature[] => {
  const cacheKey = `${layerId}_${Math.floor(zoomLevel)}`
  
  if (geometryCache.has(cacheKey)) {
    return geometryCache.get(cacheKey)!
  }
  
  const data = getLayerDataForZoom(layerId, zoomLevel)
  geometryCache.set(cacheKey, data)
  
  return data
}

// Clear cache when needed
export const clearGeometryCache = () => {
  geometryCache.clear()
}