// Core Types for FRA Atlas Application

export interface Village {
  id: string
  name: string
  state: string
  district: string
  coordinates: [number, number]
  population: number
  tribalPopulation: number
  forestCover: number
  waterIndex: number
}

export interface State {
  id: string
  name: string
  code: string
  center: [number, number]
  population: number
  tribalPopulation: number
  tribalPercentage: number // Added for enhanced state layer
  forestCover: number
  districts: number
  fraClaimsCount: number // Added for enhanced state layer
  color: string
  priority: 'high' | 'medium' | 'low'
}

export interface Claimant {
  id: string
  name: string
  villageId: string
  contactNumber?: string
  aadhaarNumber?: string
  landSize: number
  claimType: 'IFR' | 'CFR'
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  submissionDate: string
  documentIds: string[]
}

export interface OCRResult {
  id: string
  documentId: string
  extractedText: string
  confidence: number
  processingTime: number
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
}

export interface NERResult {
  id: string
  ocrResultId: string
  entities: NEREntity[]
  confidence: number
  structuredData: StructuredClaim
  status: 'processing' | 'completed' | 'failed'
  createdAt: string
}

export interface NEREntity {
  text: string
  label: 'VILLAGE' | 'PERSON' | 'AREA' | 'STATUS' | 'DATE' | 'LOCATION' | 'CLAIM_TYPE'
  start: number
  end: number
  confidence: number
}

export interface StructuredClaim {
  villageName?: string
  claimantName?: string
  landSize?: string
  claimStatus?: string
  claimType?: string
  submissionDate?: string
  coordinates?: [number, number]
}

export interface Document {
  id: string
  name: string
  type: 'pdf' | 'jpg' | 'jpeg' | 'png'
  size: number
  uploadDate: string
  status: 'uploaded' | 'processing' | 'completed' | 'error'
  progress: number
  url?: string
  ocrResult?: OCRResult
  nerResult?: NERResult
}

export interface MapLayer {
  id: string
  name: string
  type: 'raster' | 'vector'
  category: 'base' | 'fra' | 'satellite' | 'analysis'
  url?: string
  visible: boolean
  opacity: number
  color: string
  legend?: string
  description?: string
  zoomThreshold?: number
  maxZoom?: number
  minZoom?: number
  style?: {
    fillColor?: string
    fillOpacity?: number
    color?: string
    weight?: number
    opacity?: number
  }
}

export interface GeoFeature {
  id: string
  type: 'Point' | 'Polygon' | 'LineString'
  geometry: {
    type: 'Point' | 'Polygon' | 'LineString' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon'
    coordinates: number[] | number[][] | number[][][] | number[][][][]
  }
  properties: {
    [key: string]: any
    name?: string
    population?: number
    tribalPopulation?: number
    tribalPercentage?: number
    forestCover?: number
    center?: [number, number]
    labelPosition?: [number, number]
    color?: string
    priority?: 'high' | 'medium' | 'low'
  }
}

export interface District {
  id: string
  name: string
  state: string
  stateCode: string
  center: [number, number]
  population: number
  tribalPopulation: number
  tribalPercentage: number
  forestCover: number
  fraClaimsCount: number
  area?: number
  priority?: 'high' | 'medium' | 'low'
}

export interface StateGeometry {
  id: string
  name: string
  code: string
  boundaries: GeoFeature
  districts: District[]
  statistics: {
    population: number
    tribalPopulation: number
    tribalPercentage: number
    forestCover: number
    fraClaimsCount: number
    districts: number
  }
}

export interface Scheme {
  id: string
  name: string
  ministry: string
  category: 'livelihood' | 'infrastructure' | 'welfare' | 'agriculture'
  description: string
  eligibilityScore: number
  budgetAllocation: number
  coveragePercentage: number
  benefits: string[]
  requirements: string[]
  aiCompatibilityScore: number
  priority: 'high' | 'medium' | 'low'
  status: 'recommended' | 'eligible' | 'applied' | 'approved'
}

export interface DSSSuggestion {
  id: string
  type: 'convergence' | 'optimization' | 'targeting'
  title: string
  description: string
  schemes: string[]
  expectedImpact: string
  beneficiaryCount: number
  estimatedCost: number
  confidence: number
  priority: 'high' | 'medium' | 'low'
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UploadProgress {
  fileId: string
  progress: number
  stage: 'uploading' | 'ocr' | 'ner' | 'completed' | 'error'
  message?: string
}

export interface DSSAnalysisResult {
  villageId: string
  recommendations: Scheme[]
  convergenceOpportunities: DSSSuggestion[]
  priorityActions: DSSSuggestion[]
  confidence: number
  lastUpdated: string
}