// Custom hooks for Decision Support System functionality

import { useState, useCallback, useEffect } from 'react'
import type { Scheme, DSSAnalysisResult, Village, DSSSuggestion } from '@/types'
import { mockSchemes, getDSSRecommendations, mockVillages } from '@/services/mockData'

interface DSSState {
  isAnalyzing: boolean
  analysisProgress: number
  recommendations: Scheme[]
  convergenceOpportunities: DSSSuggestion[]
  priorityActions: DSSSuggestion[]
  lastAnalysis?: DSSAnalysisResult
  confidence: number
}

interface DSSFilters {
  category: 'all' | 'agriculture' | 'infrastructure' | 'welfare' | 'livelihood'
  priority: 'all' | 'high' | 'medium' | 'low'
  status: 'all' | 'recommended' | 'eligible' | 'applied' | 'approved'
  minAIScore: number
}

const defaultFilters: DSSFilters = {
  category: 'all',
  priority: 'all', 
  status: 'all',
  minAIScore: 0
}

export const useDSS = () => {
  const [dssState, setDSSState] = useState<DSSState>({
    isAnalyzing: false,
    analysisProgress: 0,
    recommendations: mockSchemes,
    convergenceOpportunities: [],
    priorityActions: [],
    confidence: 0
  })
  
  const [filters, setFilters] = useState<DSSFilters>(defaultFilters)
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([])

  // Run AI analysis for a village
  const runAnalysis = useCallback(async (villageId: string) => {
    const village = mockVillages.find(v => v.id === villageId)
    if (!village) {
      throw new Error('Village not found')
    }

    setDSSState(prev => ({ 
      ...prev, 
      isAnalyzing: true, 
      analysisProgress: 0 
    }))

    try {
      // Simulate analysis stages with progress updates
      const stages = [
        { progress: 20, message: 'Loading village data...' },
        { progress: 40, message: 'Analyzing demographic patterns...' },
        { progress: 60, message: 'Evaluating scheme compatibility...' },
        { progress: 80, message: 'Calculating convergence opportunities...' },
        { progress: 100, message: 'Analysis complete!' }
      ]

      for (const stage of stages) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setDSSState(prev => ({ 
          ...prev, 
          analysisProgress: stage.progress 
        }))
      }

      // Get analysis results
      const analysisResult = getDSSRecommendations(village)
      
      setDSSState(prev => ({
        ...prev,
        isAnalyzing: false,
        analysisProgress: 100,
        recommendations: analysisResult.recommendations,
        convergenceOpportunities: analysisResult.convergenceOpportunities,
        priorityActions: analysisResult.priorityActions,
        lastAnalysis: analysisResult,
        confidence: analysisResult.confidence
      }))

      return analysisResult
    } catch (error) {
      setDSSState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        analysisProgress: 0 
      }))
      throw error
    }
  }, [])

  // Filter schemes based on current filters
  const getFilteredSchemes = useCallback(() => {
    return dssState.recommendations.filter(scheme => {
      // Category filter
      if (filters.category !== 'all' && scheme.category !== filters.category) {
        return false
      }
      
      // Priority filter
      if (filters.priority !== 'all' && scheme.priority !== filters.priority) {
        return false
      }
      
      // Status filter
      if (filters.status !== 'all' && scheme.status !== filters.status) {
        return false
      }
      
      // AI Score filter
      if (scheme.aiCompatibilityScore < filters.minAIScore) {
        return false
      }
      
      return true
    }).sort((a, b) => b.aiCompatibilityScore - a.aiCompatibilityScore) // Sort by AI score
  }, [dssState.recommendations, filters])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<DSSFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  // Toggle scheme selection for comparison
  const toggleSchemeSelection = useCallback((schemeId: string) => {
    setSelectedSchemes(prev => 
      prev.includes(schemeId)
        ? prev.filter(id => id !== schemeId)
        : [...prev, schemeId]
    )
  }, [])

  // Clear scheme selections
  const clearSchemeSelections = useCallback(() => {
    setSelectedSchemes([])
  }, [])

  // Get selected schemes data
  const getSelectedSchemes = useCallback(() => {
    return dssState.recommendations.filter(scheme => 
      selectedSchemes.includes(scheme.id)
    )
  }, [dssState.recommendations, selectedSchemes])

  // Calculate scheme convergence potential
  const calculateConvergencePotential = useCallback((schemeIds: string[]) => {
    if (schemeIds.length < 2) return 0
    
    const schemes = schemeIds.map(id => 
      dssState.recommendations.find(s => s.id === id)
    ).filter(Boolean)
    
    if (schemes.length < 2) return 0
    
    // Simple convergence calculation based on category overlap and AI scores
    const avgAIScore = schemes.reduce((sum, scheme) => 
      sum + (scheme?.aiCompatibilityScore || 0), 0
    ) / schemes.length
    
    const categoryBonus = new Set(schemes.map(s => s?.category)).size === schemes.length ? 1.2 : 1.0
    
    return Math.min(Math.round(avgAIScore * categoryBonus), 100)
  }, [dssState.recommendations])

  // Get scheme statistics
  const getSchemeStatistics = useCallback(() => {
    const schemes = getFilteredSchemes()
    
    return {
      total: schemes.length,
      byCategory: {
        agriculture: schemes.filter(s => s.category === 'agriculture').length,
        infrastructure: schemes.filter(s => s.category === 'infrastructure').length,
        welfare: schemes.filter(s => s.category === 'welfare').length,
        livelihood: schemes.filter(s => s.category === 'livelihood').length
      },
      byPriority: {
        high: schemes.filter(s => s.priority === 'high').length,
        medium: schemes.filter(s => s.priority === 'medium').length,
        low: schemes.filter(s => s.priority === 'low').length
      },
      byStatus: {
        recommended: schemes.filter(s => s.status === 'recommended').length,
        eligible: schemes.filter(s => s.status === 'eligible').length,
        applied: schemes.filter(s => s.status === 'applied').length,
        approved: schemes.filter(s => s.status === 'approved').length
      },
      avgAIScore: schemes.reduce((sum, s) => sum + s.aiCompatibilityScore, 0) / schemes.length || 0,
      totalBenefit: schemes.reduce((sum, s) => sum + s.budgetAllocation, 0)
    }
  }, [getFilteredSchemes])

  // Export analysis results
  const exportAnalysis = useCallback(async (format: 'json' | 'csv' | 'pdf' = 'json') => {
    if (!dssState.lastAnalysis) {
      throw new Error('No analysis results to export')
    }

    const exportData = {
      analysisDate: new Date().toISOString(),
      village: dssState.lastAnalysis.villageId,
      confidence: dssState.confidence,
      recommendations: getFilteredSchemes(),
      convergenceOpportunities: dssState.convergenceOpportunities,
      priorityActions: dssState.priorityActions,
      statistics: getSchemeStatistics()
    }

    // Simulate export processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `dss_analysis_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    return { success: true, format, recordCount: exportData.recommendations.length }
  }, [dssState.lastAnalysis, dssState.confidence, dssState.convergenceOpportunities, dssState.priorityActions, getFilteredSchemes, getSchemeStatistics])

  // Reset analysis state
  const resetAnalysis = useCallback(() => {
    setDSSState(prev => ({
      ...prev,
      isAnalyzing: false,
      analysisProgress: 0,
      recommendations: mockSchemes,
      convergenceOpportunities: [],
      priorityActions: [],
      lastAnalysis: undefined,
      confidence: 0
    }))
  }, [])

  return {
    // State
    ...dssState,
    filters,
    selectedSchemes,
    
    // Analysis
    runAnalysis,
    resetAnalysis,
    
    // Filtering
    getFilteredSchemes,
    updateFilters,
    resetFilters,
    
    // Scheme selection
    toggleSchemeSelection,
    clearSchemeSelections,
    getSelectedSchemes,
    
    // Calculations
    calculateConvergencePotential,
    getSchemeStatistics,
    
    // Export
    exportAnalysis
  }
}