"use client"

import React, { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { 
  Map, 
  Satellite, 
  Layers, 
  MapPin, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Download, 
  Filter,
  TreePine,
  Home,
  Droplets,
  Mountain,
  Users,
  Info,
  Settings,
  X,
  ChevronDown,
  Eye,
  EyeOff
} from "lucide-react"

interface LayerConfig {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  opacity: number
  color: string
  category: 'base' | 'fra' | 'satellite' | 'analysis'
}

interface MapRegion {
  id: string
  name: string
  state: string
  coordinates: [number, number]
  claimCount: number
  area: number
  status: 'active' | 'processing' | 'completed'
}

const mockRegions: MapRegion[] = [
  { id: '1', name: 'Badwani Forest Area', state: 'MP', coordinates: [75.234, 21.876], claimCount: 245, area: 1250, status: 'active' },
  { id: '2', name: 'Kendujhar Reserve', state: 'Odisha', coordinates: [85.567, 21.234], claimCount: 189, area: 890, status: 'processing' },
  { id: '3', name: 'Warangal District', state: 'Telangana', coordinates: [79.456, 18.123], claimCount: 156, area: 675, status: 'completed' },
  { id: '4', name: 'Dhalai Forest', state: 'Tripura', coordinates: [91.789, 23.567], claimCount: 98, area: 456, status: 'active' },
]

const defaultLayers: LayerConfig[] = [
  {
    id: 'satellite',
    name: 'Satellite Imagery',
    description: 'High-resolution satellite imagery from ISRO',
    icon: <Satellite className="w-4 h-4" />,
    enabled: true,
    opacity: 100,
    color: '#3b82f6',
    category: 'base'
  },
  {
    id: 'forest',
    name: 'Forest Cover',
    description: 'Forest Survey of India data',
    icon: <TreePine className="w-4 h-4" />,
    enabled: true,
    opacity: 80,
    color: '#22c55e',
    category: 'analysis'
  },
  {
    id: 'settlements',
    name: 'Tribal Settlements',
    description: 'Identified tribal habitations',
    icon: <Home className="w-4 h-4" />,
    enabled: true,
    opacity: 90,
    color: '#f59e0b',
    category: 'fra'
  },
  {
    id: 'water',
    name: 'Water Bodies',
    description: 'Rivers, lakes, and water sources',
    icon: <Droplets className="w-4 h-4" />,
    enabled: false,
    opacity: 70,
    color: '#06b6d4',
    category: 'analysis'
  },
  {
    id: 'claims',
    name: 'FRA Claims',
    description: 'Forest rights claim boundaries',
    icon: <MapPin className="w-4 h-4" />,
    enabled: true,
    opacity: 85,
    color: '#8b5cf6',
    category: 'fra'
  },
  {
    id: 'elevation',
    name: 'Elevation Model',
    description: 'Digital elevation data',
    icon: <Mountain className="w-4 h-4" />,
    enabled: false,
    opacity: 60,
    color: '#84cc16',
    category: 'base'
  }
]

export function WebGIS() {
  const [layers, setLayers] = useState<LayerConfig[]>(defaultLayers)
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(null)
  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [zoomLevel, setZoomLevel] = useState(10)
  const [mapMode, setMapMode] = useState<'satellite' | 'terrain' | 'hybrid'>('satellite')
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate map initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const toggleLayer = (layerId: string) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
    ))
  }

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ))
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1))
  }

  const handleRegionClick = (region: MapRegion) => {
    setSelectedRegion(region)
  }

  const exportMap = () => {
    // Simulate map export
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      // Trigger download
    }, 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            WebGIS & Satellite Analysis
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Interactive mapping platform with satellite imagery analysis for Forest Rights Act implementation
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <Button variant="outline" size="sm" onClick={exportMap} disabled={isLoading}>
            <Download className="w-4 h-4 mr-2" />
            Export Map
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Map Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search regions, villages, or coordinates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Map Mode:</span>
              <select 
                value={mapMode}
                onChange={(e) => setMapMode(e.target.value as typeof mapMode)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Zoom:</span>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono px-2 py-1 bg-gray-100 rounded">{zoomLevel}</span>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
            >
              <Layers className="w-4 h-4 mr-2" />
              Layers
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Layer Control Panel */}
        {isLayerPanelOpen && (
          <Card className="lg:col-span-1 max-h-[800px] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Map Layers
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsLayerPanelOpen(false)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Manage data layers and visualization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Layer Categories */}
              {['base', 'fra', 'satellite', 'analysis'].map(category => {
                const categoryLayers = layers.filter(layer => layer.category === category)
                const categoryNames = {
                  'base': 'Base Layers',
                  'fra': 'FRA Data',
                  'satellite': 'Satellite Data', 
                  'analysis': 'Analysis Layers'
                }
                
                return (
                  <div key={category} className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                      {categoryNames[category as keyof typeof categoryNames]}
                    </h4>
                    <div className="space-y-3">
                      {categoryLayers.map(layer => (
                        <div 
                          key={layer.id} 
                          className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: layer.color }}
                              />
                              {layer.icon}
                              <span className="text-sm font-medium">{layer.name}</span>
                            </div>
                            <Switch
                              checked={layer.enabled}
                              onCheckedChange={() => toggleLayer(layer.id)}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{layer.description}</p>
                          {layer.enabled && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">Opacity</span>
                                <span className="text-xs font-medium">{layer.opacity}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={layer.opacity}
                                onChange={(e) => updateLayerOpacity(layer.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* Quick Actions */}
              <div className="space-y-3 pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset View
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Filter className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Layer Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Map Area */}
        <Card className={`${isLayerPanelOpen ? 'lg:col-span-3' : 'lg:col-span-4'} relative`}>
          <CardContent className="p-0">
            <div 
              ref={mapRef}
              className="relative h-[600px] bg-gradient-to-br from-blue-100 via-green-50 to-blue-100 rounded-lg overflow-hidden"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <Map className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-gray-600">Loading satellite imagery...</p>
                    <Progress value={75} className="w-48 mt-2" />
                  </div>
                </div>
              )}

              {/* Simulated Map Interface */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Map className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive WebGIS Map</h3>
                    <p className="text-gray-600 max-w-md">
                      Satellite imagery integration with ISRO data sources, forest cover analysis, 
                      and FRA claim boundary visualization
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">CARTOSAT-3</Badge>
                    <Badge variant="secondary">Forest Survey</Badge>
                    <Badge variant="secondary">Real-time</Badge>
                  </div>
                </div>
              </div>

              {/* Region Markers */}
              {mockRegions.map((region, index) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className="absolute w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg hover:scale-110 transition-transform animate-pulse"
                  style={{
                    left: `${25 + index * 15}%`,
                    top: `${30 + index * 10}%`,
                  }}
                  title={region.name}
                />
              ))}

              {/* Map Controls Overlay */}
              <div className="absolute top-4 right-4 space-y-2">
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur">
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>

              {/* Scale Bar */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg">
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-16 h-0.5 bg-gray-600"></div>
                  <span>5 km</span>
                </div>
              </div>

              {/* Coordinates Display */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg">
                <div className="text-xs font-mono text-gray-600">
                  21.8765°N, 75.2345°E
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region Information Panel */}
      {selectedRegion && (
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {selectedRegion.name}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedRegion(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Detailed analysis and FRA claim information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedRegion.claimCount}</div>
                <div className="text-sm text-gray-600">Active Claims</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedRegion.area}</div>
                <div className="text-sm text-gray-600">Area (hectares)</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedRegion.state}</div>
                <div className="text-sm text-gray-600">State</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Badge 
                  variant={selectedRegion.status === 'completed' ? 'default' : 
                          selectedRegion.status === 'processing' ? 'secondary' : 'outline'}
                  className="text-sm"
                >
                  {selectedRegion.status}
                </Badge>
                <div className="text-sm text-gray-600 mt-1">Status</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Satellite Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Forest Cover</span>
                    <span className="text-sm font-medium">85.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Water Bodies</span>
                    <span className="text-sm font-medium">12.1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Settlements</span>
                    <span className="text-sm font-medium">2.6%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">FRA Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Approved Claims</span>
                    <span className="text-sm font-medium">178 (72.7%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending Review</span>
                    <span className="text-sm font-medium">45 (18.4%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Documentation Needed</span>
                    <span className="text-sm font-medium">22 (8.9%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Satellite Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Satellite Coverage",
            value: "99.8%", 
            subtitle: "ISRO CARTOSAT-3",
            icon: <Satellite className="w-6 h-6" />,
            color: "blue"
          },
          {
            title: "Forest Areas Mapped",
            value: "2,45,678",
            subtitle: "hectares analyzed",
            icon: <TreePine className="w-6 h-6" />,
            color: "green"
          },
          {
            title: "Tribal Settlements",
            value: "1,890",
            subtitle: "settlements identified",
            icon: <Users className="w-6 h-6" />,
            color: "orange"
          },
          {
            title: "Data Accuracy",
            value: "96.7%",
            subtitle: "ground truth validation",
            icon: <Info className="w-6 h-6" />,
            color: "purple"
          }
        ].map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100 text-${stat.color}-600`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}