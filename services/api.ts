// API Service Layer for FRA Atlas Application

import type { 
  Document, 
  OCRResult, 
  NERResult, 
  DSSAnalysisResult, 
  APIResponse, 
  Village,
  Claimant,
  Scheme
} from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

class APIService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed')
      }

      return data
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Document Upload and Processing
  async uploadDocument(file: File): Promise<APIResponse<Document>> {
    const formData = new FormData()
    formData.append('document', file)

    return this.request<Document>('/documents/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    })
  }

  async getDocuments(): Promise<APIResponse<Document[]>> {
    return this.request<Document[]>('/documents')
  }

  async getDocument(id: string): Promise<APIResponse<Document>> {
    return this.request<Document>(`/documents/${id}`)
  }

  // OCR Processing
  async processOCR(documentId: string): Promise<APIResponse<OCRResult>> {
    return this.request<OCRResult>('/ocr/process', {
      method: 'POST',
      body: JSON.stringify({ documentId }),
    })
  }

  async getOCRResult(documentId: string): Promise<APIResponse<OCRResult>> {
    return this.request<OCRResult>(`/ocr/result/${documentId}`)
  }

  // NER Processing
  async processNER(ocrResultId: string): Promise<APIResponse<NERResult>> {
    return this.request<NERResult>('/ner/process', {
      method: 'POST',
      body: JSON.stringify({ ocrResultId }),
    })
  }

  async getNERResult(ocrResultId: string): Promise<APIResponse<NERResult>> {
    return this.request<NERResult>(`/ner/result/${ocrResultId}`)
  }

  // Decision Support System
  async analyzeVillage(villageId: string): Promise<APIResponse<DSSAnalysisResult>> {
    return this.request<DSSAnalysisResult>('/dss/analyze', {
      method: 'POST',
      body: JSON.stringify({ villageId }),
    })
  }

  async getSchemeRecommendations(villageId: string): Promise<APIResponse<Scheme[]>> {
    return this.request<Scheme[]>(`/dss/recommendations/${villageId}`)
  }

  async getDSSAnalysis(villageId: string): Promise<APIResponse<DSSAnalysisResult>> {
    return this.request<DSSAnalysisResult>(`/dss/analysis/${villageId}`)
  }

  // Villages and Claims
  async getVillages(): Promise<APIResponse<Village[]>> {
    return this.request<Village[]>('/villages')
  }

  async getVillage(id: string): Promise<APIResponse<Village>> {
    return this.request<Village>(`/villages/${id}`)
  }

  async getClaimants(villageId?: string): Promise<APIResponse<Claimant[]>> {
    const query = villageId ? `?villageId=${villageId}` : ''
    return this.request<Claimant[]>(`/claimants${query}`)
  }

  async createClaimant(claimantData: Partial<Claimant>): Promise<APIResponse<Claimant>> {
    return this.request<Claimant>('/claimants', {
      method: 'POST',
      body: JSON.stringify(claimantData),
    })
  }

  // GIS Data
  async getGeoFeatures(layerId: string): Promise<APIResponse<any>> {
    return this.request<any>(`/gis/features/${layerId}`)
  }

  async getMapLayers(): Promise<APIResponse<any[]>> {
    return this.request<any[]>('/gis/layers')
  }
}

export const apiService = new APIService()
export default apiService