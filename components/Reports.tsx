"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Users,
  IndianRupee,
  MapPin,
  TreePine,
  Droplets,
  Home,
  Award,
  RefreshCw,
  Mail,
  Share,
  Settings,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react"

interface ReportData {
  id: string
  title: string
  type: 'summary' | 'detailed' | 'comparative' | 'trend'
  category: 'fra' | 'schemes' | 'assets' | 'beneficiaries'
  status: 'draft' | 'ready' | 'published'
  lastUpdated: string
  size: string
  format: 'PDF' | 'Excel' | 'CSV'
}

const mockReports: ReportData[] = [
  {
    id: '1',
    title: 'FRA Implementation Progress Report Q4 2024',
    type: 'summary',
    category: 'fra',
    status: 'ready',
    lastUpdated: '2024-01-15',
    size: '2.4 MB',
    format: 'PDF'
  },
  {
    id: '2',
    title: 'Scheme Convergence Analysis Report',
    type: 'detailed',
    category: 'schemes',
    status: 'ready',
    lastUpdated: '2024-01-14',
    size: '1.8 MB',
    format: 'Excel'
  },
  {
    id: '3',
    title: 'Asset Mapping Satellite Analysis',
    type: 'comparative',
    category: 'assets',
    status: 'draft',
    lastUpdated: '2024-01-13',
    size: '3.2 MB',
    format: 'PDF'
  },
  {
    id: '4',
    title: 'Beneficiary Impact Assessment',
    type: 'trend',
    category: 'beneficiaries',
    status: 'published',
    lastUpdated: '2024-01-12',
    size: '890 KB',
    format: 'CSV'
  }
]

const analyticsData = {
  totalClaims: 95340,
  approvedClaims: 68745,
  pendingClaims: 18230,
  rejectedClaims: 8365,
  beneficiaries: 87560,
  schemeBenefits: 45000000,
  forestArea: 125000,
  waterBodies: 1850
}

export function Reports() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedPeriod, setSelectedPeriod] = useState("Q4-2024")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isGenerating, setIsGenerating] = useState(false)

  const filteredReports = mockReports.filter(report => 
    filterCategory === "all" || report.category === filterCategory
  )

  const generateReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-orange-600 bg-orange-100'
      case 'published': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fra': return <FileText className="w-4 h-4" />
      case 'schemes': return <Award className="w-4 h-4" />
      case 'assets': return <TreePine className="w-4 h-4" />
      case 'beneficiaries': return <Users className="w-4 h-4" />
      default: return <BarChart3 className="w-4 h-4" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Comprehensive reporting dashboard for FRA implementation, scheme convergence, and tribal welfare analytics
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <Button variant="outline" size="sm" onClick={generateReport} disabled={isGenerating}>
            {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Report Generation Progress */}
      {isGenerating && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Report Generation in Progress</h3>
                <p className="text-sm text-blue-700 mb-2">Compiling data from multiple sources...</p>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total FRA Claims",
            value: analyticsData.totalClaims.toLocaleString(),
            icon: <FileText className="w-6 h-6" />,
            color: "blue",
            change: "+12%"
          },
          {
            title: "Approved Claims",
            value: analyticsData.approvedClaims.toLocaleString(),
            icon: <CheckCircle className="w-6 h-6" />,
            color: "green",
            change: "+18%"
          },
          {
            title: "Beneficiaries",
            value: analyticsData.beneficiaries.toLocaleString(),
            icon: <Users className="w-6 h-6" />,
            color: "purple",
            change: "+15%"
          },
          {
            title: "Scheme Benefits",
            value: `₹${(analyticsData.schemeBenefits / 10000000).toFixed(1)}Cr`,
            icon: <IndianRupee className="w-6 h-6" />,
            color: "orange",
            change: "+25%"
          }
        ].map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">{metric.change}</span>
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

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Executive Summary
              </CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">FRA Claims Progress</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approved</span>
                      <span className="text-sm font-medium">72.1%</span>
                    </div>
                    <Progress value={72.1} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Pending</span>
                      <span className="text-sm font-medium">19.1%</span>
                    </div>
                    <Progress value={19.1} className="h-2" />
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rejected</span>
                      <span className="text-sm font-medium">8.8%</span>
                    </div>
                    <Progress value={8.8} className="h-2" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Asset Coverage</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TreePine className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Forest Area</span>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.forestArea.toLocaleString()} ha</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">Water Bodies</span>
                      </div>
                      <span className="text-sm font-medium">{analyticsData.waterBodies} locations</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Home className="w-4 h-4 text-orange-600" />
                        <span className="text-sm">Settlements</span>
                      </div>
                      <span className="text-sm font-medium">1,245 villages</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Recent Activity</h4>
                  <div className="space-y-3">
                    {[
                      { activity: 'New FRA claims processed', count: 245, time: '2 hours ago' },
                      { activity: 'Reports generated', count: 12, time: '4 hours ago' },
                      { activity: 'Scheme convergence analysis', count: 1, time: '6 hours ago' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.activity}</span>
                        <div className="text-right">
                          <div className="font-medium">{item.count}</div>
                          <div className="text-xs text-gray-500">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Generate reports and perform common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Monthly FRA Report', description: 'Comprehensive claims analysis', icon: <FileText className="w-5 h-5" /> },
                  { title: 'Beneficiary Dashboard', description: 'Household impact metrics', icon: <Users className="w-5 h-5" /> },
                  { title: 'Asset Analysis Report', description: 'Satellite imagery insights', icon: <TreePine className="w-5 h-5" /> }
                ].map((action, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {action.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{action.title}</h4>
                          <p className="text-xs text-gray-600">{action.description}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Generate
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Report Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Period:</span>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Q4-2024">Q4 2024</option>
                    <option value="Q3-2024">Q3 2024</option>
                    <option value="H2-2024">H2 2024</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Category:</span>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="fra">FRA Reports</option>
                    <option value="schemes">Scheme Reports</option>
                    <option value="assets">Asset Reports</option>
                    <option value="beneficiaries">Beneficiary Reports</option>
                  </select>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {filteredReports.length} reports available
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Report List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getCategoryIcon(report.category)}
                      {report.title}
                    </CardTitle>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • Last updated: {report.lastUpdated}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Size: {report.size}</span>
                    <Badge variant="outline">{report.format}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* State-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                State-wise Performance
              </CardTitle>
              <CardDescription>Regional implementation analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { state: 'Madhya Pradesh', claims: 35240, approval: 78, trend: '+12%' },
                  { state: 'Odisha', claims: 28750, approval: 72, trend: '+8%' },
                  { state: 'Telangana', claims: 18960, approval: 85, trend: '+15%' },
                  { state: 'Tripura', claims: 12390, approval: 68, trend: '+5%' }
                ].map((state, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">{state.state}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claims</span>
                        <span className="font-medium">{state.claims.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approval Rate</span>
                        <span className="font-medium">{state.approval}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Growth</span>
                        <span className="font-medium text-green-600">{state.trend}</span>
                      </div>
                    </div>
                    <Progress value={state.approval} className="h-2 mt-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Trend Analysis
              </CardTitle>
              <CardDescription>Monthly progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">+18.5%</div>
                    <div className="text-sm text-gray-600">Claims Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">+25.3%</div>
                    <div className="text-sm text-gray-600">Benefits Disbursed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">+12.8%</div>
                    <div className="text-sm text-gray-600">Asset Coverage</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}