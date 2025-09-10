// API Route for GIS Feature Data

import { NextRequest, NextResponse } from 'next/server'
import type { GeoFeature, APIResponse } from '@/types'
import { mockGeoFeatures } from '@/services/mockData'

export async function GET(
  request: NextRequest,
  { params }: { params: { layerId: string } }
): Promise<NextResponse<APIResponse<GeoFeature[]>>> {
  try {
    const { layerId } = params

    if (!layerId) {
      return NextResponse.json({
        success: false,
        error: 'Layer ID is required'
      }, { status: 400 })
    }

    // Simulate data fetch delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // In a real implementation, fetch from PostGIS/GeoServer
    // const features = await geoServer.getFeatures(layerId, {
    //   bbox: searchParams.get('bbox'),
    //   crs: searchParams.get('crs') || 'EPSG:4326'
    // })

    const features = mockGeoFeatures[layerId] || []

    // Apply any query filters
    const { searchParams } = new URL(request.url)
    const bbox = searchParams.get('bbox')
    const limit = parseInt(searchParams.get('limit') || '100')

    let filteredFeatures = features

    // Apply bounding box filter if provided
    if (bbox) {
      const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number)
      filteredFeatures = features.filter(feature => {
        if (feature.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates as [number, number]
          return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat
        }
        return true // Include other geometry types for now
      })
    }

    // Apply limit
    filteredFeatures = filteredFeatures.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filteredFeatures,
      message: `Retrieved ${filteredFeatures.length} features for layer ${layerId}`
    })

  } catch (error) {
    console.error('Error fetching GIS features:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch GIS features'
    }, { status: 500 })
  }
}

// POST endpoint for creating new features (for admin use)
export async function POST(
  request: NextRequest,
  { params }: { params: { layerId: string } }
): Promise<NextResponse<APIResponse<GeoFeature>>> {
  try {
    const { layerId } = params
    const featureData = await request.json()

    if (!layerId) {
      return NextResponse.json({
        success: false,
        error: 'Layer ID is required'
      }, { status: 400 })
    }

    // Validate GeoJSON structure
    if (!featureData.geometry || !featureData.properties) {
      return NextResponse.json({
        success: false,
        error: 'Invalid GeoJSON feature structure'
      }, { status: 400 })
    }

    const newFeature: GeoFeature = {
      id: `feature_${Date.now()}`,
      type: featureData.geometry.type,
      geometry: featureData.geometry,
      properties: featureData.properties
    }

    // In a real implementation, save to PostGIS database
    // await geoDatabase.insertFeature(layerId, newFeature)

    return NextResponse.json({
      success: true,
      data: newFeature,
      message: 'Feature created successfully'
    })

  } catch (error) {
    console.error('Error creating GIS feature:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create GIS feature'
    }, { status: 500 })
  }
}