// Performance Optimization Utilities for GeoJSON Processing
import type { GeoFeature, MapLayer } from '@/types'
import { simplify } from '@turf/simplify'
import { bbox } from '@turf/bbox'

// Configuration for different zoom levels
export const ZOOM_THRESHOLDS = {
  STATE_LEVEL: 6,
  DISTRICT_LEVEL: 7,
  VILLAGE_LEVEL: 10,
  DETAILED_LEVEL: 12
} as const

// Simplification tolerances for different zoom levels
export const SIMPLIFICATION_CONFIG = {
  [ZOOM_THRESHOLDS.STATE_LEVEL]: { tolerance: 0.01, highQuality: false },
  [ZOOM_THRESHOLDS.DISTRICT_LEVEL]: { tolerance: 0.005, highQuality: false },
  [ZOOM_THRESHOLDS.VILLAGE_LEVEL]: { tolerance: 0.002, highQuality: true },
  [ZOOM_THRESHOLDS.DETAILED_LEVEL]: { tolerance: 0.001, highQuality: true }
} as const

type SimplificationConfig = {
  tolerance: number
  highQuality: boolean
}

// Multi-level cache for processed geometries
class GeometryCache {
  private cache = new Map<string, GeoFeature[]>()
  private timestamps = new Map<string, number>()
  private readonly maxAge = 5 * 60 * 1000 // 5 minutes
  private readonly maxSize = 100 // Maximum number of cached entries

  private generateCacheKey(layerId: string, zoomLevel: number, bounds?: [[number, number], [number, number]]): string {
    const zoomKey = Math.floor(zoomLevel)
    const boundsKey = bounds ? `_${bounds[0][0]}_${bounds[0][1]}_${bounds[1][0]}_${bounds[1][1]}` : ''
    return `${layerId}_${zoomKey}${boundsKey}`
  }

  get(layerId: string, zoomLevel: number, bounds?: [[number, number], [number, number]]): GeoFeature[] | null {
    const key = this.generateCacheKey(layerId, zoomLevel, bounds)
    const now = Date.now()
    
    if (this.cache.has(key)) {
      const timestamp = this.timestamps.get(key)!
      if (now - timestamp < this.maxAge) {
        return this.cache.get(key)!
      } else {
        // Remove expired entry
        this.cache.delete(key)
        this.timestamps.delete(key)
      }
    }
    
    return null
  }

  set(layerId: string, zoomLevel: number, features: GeoFeature[], bounds?: [[number, number], [number, number]]): void {
    const key = this.generateCacheKey(layerId, zoomLevel, bounds)
    const now = Date.now()
    
    // If cache is at max size, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      let oldestKey = ''
      let oldestTime = now
      
      for (const [cacheKey, timestamp] of this.timestamps.entries()) {
        if (timestamp < oldestTime) {
          oldestTime = timestamp
          oldestKey = cacheKey
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey)
        this.timestamps.delete(oldestKey)
      }
    }
    
    this.cache.set(key, features)
    this.timestamps.set(key, now)
  }

  clear(): void {
    this.cache.clear()
    this.timestamps.clear()
  }

  getStats(): { size: number; maxSize: number; hitRate?: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    }
  }
}

// Global cache instance
export const geometryCache = new GeometryCache()

// Optimize geometry for given zoom level
export const optimizeGeometry = (feature: GeoFeature, zoomLevel: number): GeoFeature => {
  // Skip optimization for point features
  if (feature.type === 'Point') {
    return feature
  }

  // Get simplification config for zoom level
  let config: SimplificationConfig = SIMPLIFICATION_CONFIG[ZOOM_THRESHOLDS.DETAILED_LEVEL]
  
  if (zoomLevel <= ZOOM_THRESHOLDS.STATE_LEVEL) {
    config = SIMPLIFICATION_CONFIG[ZOOM_THRESHOLDS.STATE_LEVEL]
  } else if (zoomLevel <= ZOOM_THRESHOLDS.DISTRICT_LEVEL) {
    config = SIMPLIFICATION_CONFIG[ZOOM_THRESHOLDS.DISTRICT_LEVEL]
  } else if (zoomLevel <= ZOOM_THRESHOLDS.VILLAGE_LEVEL) {
    config = SIMPLIFICATION_CONFIG[ZOOM_THRESHOLDS.VILLAGE_LEVEL]
  }

  try {
    const turfFeature = feature as any
    const simplified = simplify(turfFeature, config)
    
    return {
      ...feature,
      geometry: simplified.geometry
    }
  } catch (error) {
    console.warn('Failed to simplify geometry for feature:', feature.id, error)
    return feature
  }
}

// Batch optimize multiple features
export const optimizeFeatures = (features: GeoFeature[], zoomLevel: number): GeoFeature[] => {
  return features.map(feature => optimizeGeometry(feature, zoomLevel))
}

// Filter features by bounds
export const filterFeaturesByBounds = (
  features: GeoFeature[], 
  bounds: [[number, number], [number, number]]
): GeoFeature[] => {
  const [southwest, northeast] = bounds
  
  return features.filter(feature => {
    try {
      if (feature.type === 'Point') {
        const [lng, lat] = feature.geometry.coordinates as [number, number]
        return lng >= southwest[1] && lng <= northeast[1] && 
               lat >= southwest[0] && lat <= northeast[0]
      }
      
      // For polygons, check if any coordinate is within bounds
      if (feature.type === 'Polygon') {
        const coordinates = feature.geometry.coordinates as number[][][]
        for (const ring of coordinates) {
          for (const [lng, lat] of ring) {
            if (lng >= southwest[1] && lng <= northeast[1] && 
                lat >= southwest[0] && lat <= northeast[0]) {
              return true
            }
          }
        }
      }
      
      return false
    } catch (error) {
      console.warn('Error filtering feature by bounds:', feature.id, error)
      return true // Include feature if filtering fails
    }
  })
}

// Get optimized layer data with caching
export const getOptimizedLayerData = (
  layerId: string, 
  zoomLevel: number, 
  sourceFeatures: GeoFeature[],
  bounds?: [[number, number], [number, number]]
): GeoFeature[] => {
  // Check cache first
  const cached = geometryCache.get(layerId, zoomLevel, bounds)
  if (cached) {
    return cached
  }

  let features = [...sourceFeatures]

  // Apply bounds filtering if provided
  if (bounds) {
    features = filterFeaturesByBounds(features, bounds)
  }

  // Apply zoom-based layer visibility rules
  if (layerId === 'settlements' && zoomLevel < ZOOM_THRESHOLDS.VILLAGE_LEVEL) {
    features = [] // Hide settlements until village zoom
  }

  // Optimize geometries
  features = optimizeFeatures(features, zoomLevel)

  // Cache the result
  geometryCache.set(layerId, zoomLevel, features, bounds)

  return features
}

// Preload and cache data for better performance
export const preloadLayerData = async (
  layerId: string, 
  zoomLevels: number[], 
  sourceFeatures: GeoFeature[]
): Promise<void> => {
  const promises = zoomLevels.map(async (zoom) => {
    // Use setTimeout to avoid blocking the main thread
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Store the result to ensure caching happens
        const _cachedData = getOptimizedLayerData(layerId, zoom, sourceFeatures)
        resolve()
      }, 0)
    })
  })

  await Promise.all(promises)
}

// Calculate feature density for adaptive rendering
export const calculateFeatureDensity = (
  features: GeoFeature[], 
  bounds: [[number, number], [number, number]]
): number => {
  const boundsArea = Math.abs(
    (bounds[1][0] - bounds[0][0]) * (bounds[1][1] - bounds[0][1])
  )
  
  return features.length / boundsArea
}

// Adaptive feature loading based on density
export const getAdaptiveFeatures = (
  features: GeoFeature[], 
  zoomLevel: number,
  bounds: [[number, number], [number, number]],
  maxDensity: number = 100
): GeoFeature[] => {
  const filteredFeatures = filterFeaturesByBounds(features, bounds)
  const density = calculateFeatureDensity(filteredFeatures, bounds)
  
  if (density <= maxDensity) {
    return optimizeFeatures(filteredFeatures, zoomLevel)
  }
  
  // If density is too high, sample features
  const sampleRatio = maxDensity / density
  const sampledFeatures = filteredFeatures.filter((_, index) => 
    Math.random() < sampleRatio
  )
  
  return optimizeFeatures(sampledFeatures, zoomLevel)
}

// Performance monitoring
export interface PerformanceMetrics {
  cacheHitRate: number
  averageProcessingTime: number
  totalFeatures: number
  visibleFeatures: number
}

class PerformanceMonitor {
  private processingTimes: number[] = []
  private cacheHits = 0
  private cacheRequests = 0

  recordProcessingTime(time: number): void {
    this.processingTimes.push(time)
    // Keep only recent measurements
    if (this.processingTimes.length > 100) {
      this.processingTimes = this.processingTimes.slice(-50)
    }
  }

  recordCacheHit(): void {
    this.cacheHits++
    this.cacheRequests++
  }

  recordCacheMiss(): void {
    this.cacheRequests++
  }

  getMetrics(): PerformanceMetrics {
    const avgTime = this.processingTimes.length > 0 
      ? this.processingTimes.reduce((a, b) => a + b) / this.processingTimes.length 
      : 0

    return {
      cacheHitRate: this.cacheRequests > 0 ? this.cacheHits / this.cacheRequests : 0,
      averageProcessingTime: avgTime,
      totalFeatures: 0,
      visibleFeatures: 0
    }
  }

  reset(): void {
    this.processingTimes = []
    this.cacheHits = 0
    this.cacheRequests = 0
  }
}

export const performanceMonitor = new PerformanceMonitor()

// Utility to measure function execution time
export const measurePerformance = <T>(
  fn: () => T, 
  name?: string
): { result: T; time: number } => {
  const start = performance.now()
  const result = fn()
  const time = performance.now() - start
  
  performanceMonitor.recordProcessingTime(time)
  
  if (name && time > 100) { // Log slow operations
    console.warn(`Slow operation "${name}" took ${time.toFixed(2)}ms`)
  }
  
  return { result, time }
}

// Clear all caches
export const clearAllCaches = (): void => {
  geometryCache.clear()
  performanceMonitor.reset()
}