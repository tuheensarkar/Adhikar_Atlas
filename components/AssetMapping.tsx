"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TreePine, 
  Droplets, 
  Home, 
  Mountain, 
  Satellite, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Layers,
  Download,
  RefreshCw,
  Zap,
  Eye,
  Calendar,
  Users,
  Square,
  X
} from "lucide-react"

interface AssetData {
  id: string
  name: string
  type: 'forest' | 'water' | 'settlement' | 'agriculture'
  area: number
  coordinates: [number, number]
  status: 'healthy' | 'degraded' | 'critical' | 'restored'
  lastUpdated: string
  claims: number
  households: number
  threats: string[]
  conservation: number
}

interface AnalysisMetrics {
  totalArea: number
  forestCover: number
  waterBodies: number
  settlements: number
  agriculture: number
  degradation: number
  conservation: number
  threats: number
}

const mockAssets: AssetData[] = [
  {
    id: '1',
    name: 'Badwani Forest Block',
    type: 'forest',
    area: 1250.5,
    coordinates: [75.234, 21.876],
    status: 'healthy',
    lastUpdated: '2024-01-15',
    claims: 45,
    households: 120,
    threats: ['Mining pressure', 'Encroachment'],
    conservation: 85
  },
  {
    id: '2',
    name: 'Narmada River Section',
    type: 'water',
    area: 89.3,
    coordinates: [75.456, 21.789],
    status: 'degraded',
    lastUpdated: '2024-01-14',
    claims: 12,
    households: 45,
    threats: ['Pollution', 'Sand mining'],
    conservation: 45
  },
  {
    id: '3',
    name: 'Bhil Community Settlement',
    type: 'settlement',
    area: 25.7,
    coordinates: [75.345, 21.923],
    status: 'healthy',
    lastUpdated: '2024-01-16',
    claims: 78,
    households: 156,
    threats: ['Infrastructure needs'],
    conservation: 78
  },
  {
    id: '4',
    name: 'Traditional Agriculture Zone',
    type: 'agriculture',
    area: 345.2,
    coordinates: [75.567, 21.654],
    status: 'critical',
    lastUpdated: '2024-01-13',
    claims: 23,
    households: 89,
    threats: ['Soil degradation', 'Water scarcity', 'Climate change'],
    conservation: 35
  }
]

const analysisMetrics: AnalysisMetrics = {
  totalArea: 15420.7,
  forestCover: 11250.3,
  waterBodies: 892.4,
  settlements: 234.6,
  agriculture: 3043.4,
  degradation: 1245.8,
  conservation: 12890.5,
  threats: 23
}

const threatAnalysis = [
  { threat: 'Deforestation', severity: 'High', affected: 1250, trend: '+12%' },
  { threat: 'Water Pollution', severity: 'Medium', affected: 450, trend: '+8%' },
  { threat: 'Encroachment', severity: 'High', affected: 890, trend: '+15%' },
  { threat: 'Mining Pressure', severity: 'Critical', affected: 2340, trend: '+25%' },
  { threat: 'Climate Impact', severity: 'Medium', affected: 5670, trend: '+7%' }
]

const conservationProjects = [
  { name: 'Forest Restoration Program', area: 450, progress: 78, status: 'active' },
  { name: 'Watershed Management', area: 230, progress: 65, status: 'active' },
  { name: 'Tribal Livelihood Support', households: 340, progress: 92, status: 'completed' },
  { name: 'Biodiversity Conservation', area: 1200, progress: 45, status: 'planning' }
]

export function AssetMapping() {
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [filterType, setFilterType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("area")

  const filteredAssets = mockAssets.filter(asset => 
    filterType === "all" || asset.type === filterType
  ).sort((a, b) => {
    switch (sortBy) {
      case 'area': return b.area - a.area
      case 'claims': return b.claims - a.claims
      case 'status': return a.status.localeCompare(b.status)
      default: return 0
    }
  })

  const runAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'degraded': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      case 'restored': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'forest': return <TreePine className="w-5 h-5" />
      case 'water': return <Droplets className="w-5 h-5" />
      case 'settlement': return <Home className="w-5 h-5" />
      case 'agriculture': return <Mountain className="w-5 h-5" />
      default: return <MapPin className="w-5 h-5" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Asset Mapping & Analysis
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Comprehensive satellite-based analysis of forest, water, settlement, and agricultural assets for FRA implementation
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <Button variant="outline" size="sm" onClick={runAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Satellite className="w-4 h-4 mr-2" />}
            {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Satellite className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Satellite Analysis in Progress</h3>
                <p className="text-sm text-blue-700 mb-2">Processing CARTOSAT-3 imagery and LISS-III data...</p>
                <Progress value={65} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Area Mapped",
            value: `${analysisMetrics.totalArea.toLocaleString()} ha`,
            change: "+5.2%",
            icon: <Square className="w-6 h-6" />,
            color: "blue"
          },
          {
            title: "Forest Coverage",
            value: `${Math.round((analysisMetrics.forestCover / analysisMetrics.totalArea) * 100)}%`,
            change: "+2.1%",
            icon: <TreePine className="w-6 h-6" />,
            color: "green"
          },
          {
            title: "Water Bodies",
            value: `${analysisMetrics.waterBodies.toLocaleString()} ha`,
            change: "-1.5%",
            icon: <Droplets className="w-6 h-6" />,
            color: "cyan"
          },
          {
            title: "Settlements",
            value: `${analysisMetrics.settlements.toLocaleString()} ha`,
            change: "+8.7%",
            icon: <Home className="w-6 h-6" />,
            color: "orange"
          }
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center">
                    <TrendingUp className={`w-3 h-3 mr-1 ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-xs font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-${metric.color}-100 text-${metric.color}-600`}>
                  {metric.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="threats" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Threats
          </TabsTrigger>
          <TabsTrigger value="conservation" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Conservation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Asset Distribution
                </CardTitle>
                <CardDescription>Breakdown of mapped assets by type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Forest Cover', value: analysisMetrics.forestCover, percentage: 73, color: 'green' },
                  { name: 'Agriculture', value: analysisMetrics.agriculture, percentage: 19.7, color: 'yellow' },
                  { name: 'Water Bodies', value: analysisMetrics.waterBodies, percentage: 5.8, color: 'blue' },
                  { name: 'Settlements', value: analysisMetrics.settlements, percentage: 1.5, color: 'orange' }
                ].map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-sm text-gray-600">{item.value.toLocaleString()} ha ({item.percentage}%)</span>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Asset Health Status
                </CardTitle>
                <CardDescription>Current condition of mapped assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { status: 'Healthy', count: 12, percentage: 67, color: 'green' },
                    { status: 'Degraded', count: 4, percentage: 22, color: 'orange' },
                    { status: 'Critical', count: 2, percentage: 11, color: 'red' },
                    { status: 'Restored', count: 0, percentage: 0, color: 'blue' }
                  ].map((item, index) => (
                    <div key={index} className="text-center p-4 rounded-lg border">
                      <div className={`text-2xl font-bold text-${item.color}-600 mb-1`}>{item.count}</div>
                      <div className="text-sm text-gray-600 mb-2">{item.status}</div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Temporal Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Temporal Change Analysis
              </CardTitle>
              <CardDescription>Changes in asset coverage over time (2020-2024)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { period: '2020-2021', forest: '+2.3%', water: '-0.8%', settlement: '+1.2%' },
                  { period: '2021-2022', forest: '+1.8%', water: '-1.2%', settlement: '+2.1%' },
                  { period: '2022-2024', forest: '+0.9%', water: '-0.5%', settlement: '+3.4%' }
                ].map((period, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{period.period}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Forest</span>
                        <span className="text-sm font-medium text-green-600">{period.forest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Water</span>
                        <span className="text-sm font-medium text-red-600">{period.water}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Settlement</span>
                        <span className="text-sm font-medium text-blue-600">{period.settlement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assets" className="space-y-6">
          {/* Asset Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Filter by type:</span>
                  <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Assets</option>
                    <option value="forest">Forest</option>
                    <option value="water">Water</option>
                    <option value="settlement">Settlement</option>
                    <option value="agriculture">Agriculture</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="area">Area</option>
                    <option value="claims">Claims</option>
                    <option value="status">Status</option>
                  </select>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {filteredAssets.length} assets found
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Asset List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAssets.map((asset) => (
              <Card 
                key={asset.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAsset(asset)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getAssetIcon(asset.type)}
                      {asset.name}
                    </CardTitle>
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </div>
                  <CardDescription>Last updated: {asset.lastUpdated}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Area</div>
                      <div className="font-semibold">{asset.area.toLocaleString()} ha</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">FRA Claims</div>
                      <div className="font-semibold">{asset.claims}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Households</div>
                      <div className="font-semibold">{asset.households}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Conservation</div>
                      <div className="font-semibold">{asset.conservation}%</div>
                    </div>
                  </div>
                  
                  {asset.threats.length > 0 && (
                    <div>
                      <div className="text-sm text-gray-600 mb-2">Current Threats:</div>
                      <div className="flex flex-wrap gap-1">
                        {asset.threats.map((threat, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {threat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Threat Analysis
              </CardTitle>
              <CardDescription>Identified threats to forest and tribal assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatAnalysis.map((threat, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{threat.threat}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={threat.severity === 'Critical' ? 'destructive' : 
                                  threat.severity === 'High' ? 'secondary' : 'outline'}
                        >
                          {threat.severity}
                        </Badge>
                        <span className={`text-sm font-medium ${threat.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'}`}>
                          {threat.trend}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Affected area: <span className="font-medium">{threat.affected.toLocaleString()} hectares</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conservation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Conservation Projects
              </CardTitle>
              <CardDescription>Active and planned conservation initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conservationProjects.map((project, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{project.name}</h4>
                      <Badge 
                        variant={project.status === 'completed' ? 'default' : 
                                project.status === 'active' ? 'secondary' : 'outline'}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">
                          {project.area ? 'Area' : 'Households'}
                        </div>
                        <div className="font-medium">
                          {project.area ? `${project.area} ha` : `${project.households} households`}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Progress</div>
                        <div className="font-medium">{project.progress}%</div>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Asset Detail Modal */}
      {selectedAsset && (
        <Card className="fixed inset-4 z-50 overflow-auto bg-white shadow-2xl animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getAssetIcon(selectedAsset.type)}
                {selectedAsset.name}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedAsset(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>Detailed asset analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedAsset.area.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Hectares</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedAsset.claims}</div>
                <div className="text-sm text-gray-600">FRA Claims</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedAsset.households}</div>
                <div className="text-sm text-gray-600">Households</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Conservation Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overall Health</span>
                  <Badge className={getStatusColor(selectedAsset.status)}>
                    {selectedAsset.status}
                  </Badge>
                </div>
                <Progress value={selectedAsset.conservation} className="h-3" />
                <div className="text-sm text-gray-600 text-right">{selectedAsset.conservation}% conserved</div>
              </div>
            </div>

            {selectedAsset.threats.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Identified Threats</h4>
                <div className="space-y-2">
                  {selectedAsset.threats.map((threat, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span className="text-sm">{threat}</span>
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button variant="outline">View on Map</Button>
              <Button>Generate Report</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}