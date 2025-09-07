"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  IndianRupee, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Lightbulb,
  BarChart3,
  MapPin,
  Download,
  RefreshCw,
  Zap,
  Award,
  Home,
  Droplets,
  Tractor,
  Heart,
  ChevronRight,
  Filter
} from "lucide-react"

interface Scheme {
  id: string
  name: string
  ministry: string
  category: 'livelihood' | 'infrastructure' | 'welfare' | 'agriculture'
  eligibility: number
  budget: number
  coverage: number
  benefits: string[]
  status: 'recommended' | 'eligible' | 'applied' | 'approved'
  aiScore: number
  priority: 'high' | 'medium' | 'low'
  impact: string
}

const mockSchemes: Scheme[] = [
  {
    id: 'pmkisan',
    name: 'PM-KISAN',
    ministry: 'Ministry of Agriculture',
    category: 'agriculture',
    eligibility: 95,
    budget: 75000,
    coverage: 85,
    benefits: ['₹6,000 annual income support', 'Direct benefit transfer', 'Crop insurance linkage'],
    status: 'recommended',
    aiScore: 94,
    priority: 'high',
    impact: 'Direct income enhancement for farming families'
  },
  {
    id: 'jaljeevan',
    name: 'Jal Jeevan Mission',
    ministry: 'Ministry of Jal Shakti',
    category: 'infrastructure',
    eligibility: 88,
    budget: 125000,
    coverage: 62,
    benefits: ['Piped water supply', 'Water quality testing', 'Community participation'],
    status: 'eligible',
    aiScore: 91,
    priority: 'high',
    impact: 'Improved health and sanitation outcomes'
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA',
    ministry: 'Ministry of Rural Development',
    category: 'livelihood',
    eligibility: 92,
    budget: 95000,
    coverage: 78,
    benefits: ['100 days guaranteed employment', 'Skill development', 'Asset creation'],
    status: 'applied',
    aiScore: 89,
    priority: 'medium',
    impact: 'Employment generation and rural asset creation'
  },
  {
    id: 'dajgua',
    name: 'DAJGUA',
    ministry: 'Ministry of Tribal Affairs',
    category: 'welfare',
    eligibility: 97,
    budget: 180000,
    coverage: 45,
    benefits: ['Infrastructure development', 'Livelihood support', 'Skill training'],
    status: 'recommended',
    aiScore: 96,
    priority: 'high',
    impact: 'Comprehensive tribal area development'
  }
]

const aiRecommendations = [
  {
    type: 'convergence',
    title: 'Multi-Scheme Convergence Opportunity',
    description: 'Link PM-KISAN with Jal Jeevan Mission for enhanced agricultural productivity',
    impact: 'High',
    beneficiaries: 1250,
    investment: '₹15.2 Cr'
  },
  {
    type: 'optimization',
    title: 'MGNREGA Asset Optimization',
    description: 'Focus on water conservation structures to maximize dual benefits',
    impact: 'Medium',
    beneficiaries: 890,
    investment: '₹8.7 Cr'
  },
  {
    type: 'targeting',
    title: 'Precision Targeting Enhancement',
    description: 'Use satellite data for better scheme targeting and monitoring',
    impact: 'High',
    beneficiaries: 2340,
    investment: '₹3.5 Cr'
  }
]

export function DecisionSupport() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [analysisProgress, setAnalysisProgress] = useState(0)

  const filteredSchemes = mockSchemes.filter(scheme => 
    filterCategory === "all" || scheme.category === filterCategory
  ).sort((a, b) => b.aiScore - a.aiScore)

  const runAIAnalysis = () => {
    setIsAnalyzing(true)
    setAnalysisProgress(0)
    
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const getSchemeIcon = (category: string) => {
    switch (category) {
      case 'agriculture': return <Tractor className="w-5 h-5" />
      case 'infrastructure': return <Home className="w-5 h-5" />
      case 'welfare': return <Heart className="w-5 h-5" />
      case 'livelihood': return <Users className="w-5 h-5" />
      default: return <Target className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recommended': return 'text-blue-600 bg-blue-100'
      case 'eligible': return 'text-green-600 bg-green-100'
      case 'applied': return 'text-orange-600 bg-orange-100'
      case 'approved': return 'text-purple-600 bg-purple-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI-Powered Decision Support
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Intelligent government scheme recommendations and convergence opportunities for tribal welfare optimization
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <Button variant="outline" size="sm" onClick={runAIAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Brain className="w-4 h-4 mr-2" />}
            {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Download className="w-4 h-4 mr-2" />
            Export Recommendations
          </Button>
        </div>
      </div>

      {/* AI Analysis Progress */}
      {isAnalyzing && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900">AI Analysis in Progress</h3>
                <p className="text-sm text-purple-700 mb-2">Processing beneficiary data and scheme compatibility...</p>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Beneficiaries",
            value: "95,340",
            change: "+12%",
            icon: <Users className="w-6 h-6" />,
            color: "blue"
          },
          {
            title: "Scheme Coverage",
            value: "68.5%",
            change: "+8.3%",
            icon: <Target className="w-6 h-6" />,
            color: "green"
          },
          {
            title: "Total Benefits",
            value: "₹450 Cr",
            change: "+25%",
            icon: <IndianRupee className="w-6 h-6" />,
            color: "purple"
          },
          {
            title: "AI Accuracy",
            value: "94.7%",
            change: "+2.1%",
            icon: <Brain className="w-6 h-6" />,
            color: "cyan"
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
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="schemes" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Schemes
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>Intelligent insights for scheme optimization and convergence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-purple-100 text-purple-700">{rec.type}</Badge>
                      <Badge variant={rec.impact === 'High' ? 'default' : 'secondary'}>
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-2">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{rec.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Beneficiaries:</span>
                        <span className="font-medium">{rec.beneficiaries.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment:</span>
                        <span className="font-medium">{rec.investment}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheme Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Scheme Performance Matrix
              </CardTitle>
              <CardDescription>Coverage and effectiveness analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Coverage by Category</h4>
                  <div className="space-y-3">
                    {[
                      { category: 'Agriculture', coverage: 85, schemes: 3 },
                      { category: 'Infrastructure', coverage: 62, schemes: 4 },
                      { category: 'Welfare', coverage: 78, schemes: 2 },
                      { category: 'Livelihood', coverage: 71, schemes: 3 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm text-gray-600">{item.coverage}% ({item.schemes} schemes)</span>
                        </div>
                        <Progress value={item.coverage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">AI Score Distribution</h4>
                  <div className="space-y-3">
                    {[
                      { range: '90-100%', count: 2, color: 'green' },
                      { range: '80-89%', count: 2, color: 'blue' },
                      { range: '70-79%', count: 1, color: 'orange' },
                      { range: 'Below 70%', count: 0, color: 'red' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                        <span className="text-sm font-medium">{item.range}</span>
                        <Badge className={`bg-${item.color}-100 text-${item.color}-700`}>
                          {item.count} schemes
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes" className="space-y-6">
          {/* Scheme Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Filter by category:</span>
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="welfare">Welfare</option>
                    <option value="livelihood">Livelihood</option>
                  </select>
                </div>
                <Badge variant="secondary" className="ml-auto">
                  {filteredSchemes.length} schemes available
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Scheme Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {getSchemeIcon(scheme.category)}
                      {scheme.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(scheme.priority)}>
                        {scheme.priority}
                      </Badge>
                      <Badge className={getStatusColor(scheme.status)}>
                        {scheme.status}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{scheme.ministry}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-900">AI Compatibility Score</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={scheme.aiScore} className="w-20 h-2" />
                      <span className="text-sm font-bold text-purple-600">{scheme.aiScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600">Eligibility</div>
                      <div className="font-semibold text-green-600">{scheme.eligibility}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Budget</div>
                      <div className="font-semibold text-blue-600">₹{scheme.budget.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Coverage</div>
                      <div className="font-semibold text-orange-600">{scheme.coverage}%</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold mb-2">Key Benefits:</h5>
                    <div className="space-y-1">
                      {scheme.benefits.slice(0, 3).map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        <Award className="w-4 h-4 inline mr-1" />
                        Impact: {scheme.impact.split(' ').slice(0, 4).join(' ')}...
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Convergence Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Scheme Convergence
                </CardTitle>
                <CardDescription>Opportunities for multi-scheme integration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    schemes: ['PM-KISAN', 'Jal Jeevan Mission'],
                    impact: 'Enhanced agricultural productivity',
                    beneficiaries: 1250,
                    synergy: 95
                  },
                  {
                    schemes: ['MGNREGA', 'DAJGUA'],
                    impact: 'Comprehensive livelihood support',
                    beneficiaries: 890,
                    synergy: 88
                  },
                  {
                    schemes: ['PM Awas', 'Jal Jeevan Mission'],
                    impact: 'Complete housing solutions',
                    beneficiaries: 654,
                    synergy: 82
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-1">
                        {item.schemes.map((scheme, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {scheme}
                          </Badge>
                        ))}
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        {item.synergy}% synergy
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.impact}</p>
                    <div className="text-xs text-gray-500">
                      {item.beneficiaries.toLocaleString()} potential beneficiaries
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Priority Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Priority Actions
                </CardTitle>
                <CardDescription>Immediate recommendations for implementation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    action: 'Accelerate DAJGUA rollout',
                    reason: 'Highest AI compatibility score (96%)',
                    urgency: 'High',
                    timeline: '30 days'
                  },
                  {
                    action: 'Integrate water & agriculture schemes',
                    reason: 'Maximum convergence potential',
                    urgency: 'Medium', 
                    timeline: '60 days'
                  },
                  {
                    action: 'Enhance targeting precision',
                    reason: 'Satellite data integration opportunity',
                    urgency: 'Medium',
                    timeline: '90 days'
                  }
                ].map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">{item.action}</h5>
                      <Badge variant={item.urgency === 'High' ? 'destructive' : 'secondary'}>
                        {item.urgency}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.reason}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      Target timeline: {item.timeline}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}