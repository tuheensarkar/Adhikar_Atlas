"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  X,
  Download,
  MapPin,
  IndianRupee
} from 'lucide-react'
import type { Village } from '@/types'

interface DistrictAnalytics {
  districtName: string
  stateName: string
  totalClaims: number
  approvedClaims: number
  pendingClaims: number
  rejectedClaims: number
  totalBeneficiaries: number
  tribalPopulation: number
  forestCoverage: number
  recommendedSchemes: string[]
  estimatedBudget: number
  completionRate: number
}

interface AnalyticsOverlayProps {
  selectedDistrict?: string
  selectedVillage?: Village | null
  isVisible: boolean
  onClose: () => void
  className?: string
}

// Mock analytics data - in real implementation, this would come from API
const getMockAnalytics = (district: string): DistrictAnalytics => {
  const mockData: { [key: string]: DistrictAnalytics } = {
    'Kalahandi': {
      districtName: 'Kalahandi',
      stateName: 'Odisha',
      totalClaims: 1247,
      approvedClaims: 856,
      pendingClaims: 284,
      rejectedClaims: 107,
      totalBeneficiaries: 2340,
      tribalPopulation: 45680,
      forestCoverage: 78.5,
      recommendedSchemes: ['PM-KISAN', 'Jal Jeevan Mission', 'DAJGUA', 'MGNREGA'],
      estimatedBudget: 15600000,
      completionRate: 68.7
    },
    'Khargone': {
      districtName: 'Khargone',
      stateName: 'Madhya Pradesh',
      totalClaims: 967,
      approvedClaims: 634,
      pendingClaims: 298,
      rejectedClaims: 35,
      totalBeneficiaries: 1890,
      tribalPopulation: 32450,
      forestCoverage: 85.2,
      recommendedSchemes: ['PM-KISAN', 'MGNREGA', 'Pradhan Mantri Awas Yojana'],
      estimatedBudget: 12400000,
      completionRate: 65.6
    },
    'Warangal': {
      districtName: 'Warangal',
      stateName: 'Telangana',
      totalClaims: 1534,
      approvedClaims: 1124,
      pendingClaims: 356,
      rejectedClaims: 54,
      totalBeneficiaries: 3220,
      tribalPopulation: 56780,
      forestCoverage: 62.8,
      recommendedSchemes: ['Rythu Bandhu', 'Mission Bhagiratha', 'DAJGUA', 'Jal Jeevan Mission'],
      estimatedBudget: 18900000,
      completionRate: 73.2
    }
  }
  
  return mockData[district] || mockData['Kalahandi']
}

export function AnalyticsOverlay({ 
  selectedDistrict, 
  selectedVillage, 
  isVisible, 
  onClose, 
  className = "" 
}: AnalyticsOverlayProps) {
  if (!isVisible || (!selectedDistrict && !selectedVillage)) {
    return null
  }

  const district = selectedDistrict || selectedVillage?.district || 'Kalahandi'
  const analytics = getMockAnalytics(district)
  
  const approvalRate = (analytics.approvedClaims / analytics.totalClaims) * 100
  const pendingRate = (analytics.pendingClaims / analytics.totalClaims) * 100
  const rejectionRate = (analytics.rejectedClaims / analytics.totalClaims) * 100

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-gray-200 z-50 transform transition-transform duration-300 ${className}`}>
      <div className="h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">District Analytics</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{analytics.districtName}, {analytics.stateName}</span>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Claims</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalClaims.toLocaleString()}</p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Beneficiaries</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.totalBeneficiaries.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Claim Status Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Claim Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{analytics.approvedClaims}</span>
                    <Badge variant="default" className="bg-green-100 text-green-700">
                      {approvalRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={approvalRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{analytics.pendingClaims}</span>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      {pendingRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={pendingRate} className="h-2" />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-sm">Rejected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{analytics.rejectedClaims}</span>
                    <Badge variant="destructive" className="bg-red-100 text-red-700">
                      {rejectionRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
                <Progress value={rejectionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Demographics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Demographics & Environment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tribal Population</span>
                  <span className="text-sm font-medium">{analytics.tribalPopulation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Forest Coverage</span>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    {analytics.forestCoverage}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-700">
                    {analytics.completionRate}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Schemes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recommended Schemes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.recommendedSchemes.map((scheme, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{scheme}</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">Estimated Budget</span>
                  <div className="flex items-center space-x-1">
                    <IndianRupee className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-bold text-blue-900">
                      {(analytics.estimatedBudget / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-1">
                  Total convergence budget allocation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button className="w-full" variant="default">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button className="w-full" variant="outline">
              View Detailed Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}