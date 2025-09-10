// Mock Data Service for Development and Demo - Enhanced with Realistic Census Data
import type { 
  Village, 
  State,
  District,
  Claimant, 
  Document, 
  OCRResult, 
  NERResult, 
  Scheme, 
  DSSAnalysisResult,
  StructuredClaim,
  GeoFeature
} from '@/types'
import { 
  indiaStatesGeoJSON, 
  districtBoundariesGeoJSON, 
  getTribalPopulationColor,
  getCachedLayerData
} from './geoDataService'

// Mock States Data with updated 2021-2022 tribal population density
export const mockStates: State[] = [
  {
    id: 'state_odisha',
    name: 'Odisha',
    code: 'OR',
    center: [20.9517, 85.0985],
    population: 45429399,
    tribalPopulation: 9590756,
    tribalPercentage: 22.85, // Updated percentage
    forestCover: 33.16, // Updated forest cover
    districts: 30,
    fraClaimsCount: 1342, // Updated FRA claims
    color: '#ef4444', // Medium-high red
    priority: 'high'
  },
  {
    id: 'state_mp',
    name: 'Madhya Pradesh',
    code: 'MP', 
    center: [22.9734, 78.6569],
    population: 85358965,
    tribalPopulation: 15316784,
    tribalPercentage: 21.09, // Updated percentage
    forestCover: 25.15, // Updated forest cover
    districts: 55,
    fraClaimsCount: 2287, // Updated FRA claims
    color: '#ef4444', // Medium-high red
    priority: 'high'
  },
  {
    id: 'state_chhattisgarh',
    name: 'Chhattisgarh', 
    code: 'CG',
    center: [21.2787, 81.8661],
    population: 29436231,
    tribalPopulation: 7822902,
    tribalPercentage: 30.62, // Updated percentage
    forestCover: 41.33, // Updated forest cover
    districts: 32,
    fraClaimsCount: 1156, // Updated FRA claims
    color: '#dc2626', // High red
    priority: 'high'
  },
  {
    id: 'state_jharkhand',
    name: 'Jharkhand',
    code: 'JH',
    center: [23.6102, 85.2799],
    population: 38593948,
    tribalPopulation: 8645042,
    tribalPercentage: 26.21, // Updated percentage
    forestCover: 29.55, // Updated forest cover
    districts: 24,
    fraClaimsCount: 1687, // Updated FRA claims
    color: '#dc2626', // High red
    priority: 'high'
  },
  {
    id: 'state_gujarat',
    name: 'Gujarat',
    code: 'GJ',
    center: [22.2587, 71.1924],
    population: 70139114,
    tribalPopulation: 8917174,
    tribalPercentage: 14.75, // Updated percentage
    forestCover: 7.29,
    districts: 33,
    fraClaimsCount: 934, // Updated FRA claims
    color: '#f59e0b', // Medium orange
    priority: 'medium'
  },
  {
    id: 'state_rajasthan',
    name: 'Rajasthan',
    code: 'RJ',
    center: [27.0238, 74.2179],
    population: 81032689,
    tribalPopulation: 9238534,
    tribalPercentage: 13.48, // Updated percentage
    forestCover: 4.83,
    districts: 50,
    fraClaimsCount: 723, // Updated FRA claims
    color: '#f59e0b', // Medium orange
    priority: 'medium'
  },
  {
    id: 'state_assam',
    name: 'Assam',
    code: 'AS',
    center: [26.2006, 92.9376],
    population: 35607039,
    tribalPopulation: 3884371,
    tribalPercentage: 12.45, // Updated percentage
    forestCover: 35.83,
    districts: 35,
    fraClaimsCount: 567, // Updated FRA claims
    color: '#f59e0b', // Medium orange
    priority: 'medium'
  },
  {
    id: 'state_karnataka',
    name: 'Karnataka',
    code: 'KA',
    center: [15.3173, 75.7139],
    population: 67562686,
    tribalPopulation: 4248987,
    tribalPercentage: 6.95, // Updated percentage
    forestCover: 20.19,
    districts: 31,
    fraClaimsCount: 389, // Updated FRA claims
    color: '#eab308', // Low-medium yellow
    priority: 'low'
  },
  {
    id: 'state_maharashtra',
    name: 'Maharashtra',
    code: 'MH',
    center: [19.7515, 75.7139],
    population: 123144223,
    tribalPopulation: 10510213,
    tribalPercentage: 9.35, // Updated percentage
    forestCover: 20.13,
    districts: 36,
    fraClaimsCount: 1234, // Updated FRA claims
    color: '#eab308', // Low-medium yellow
    priority: 'medium'
  },
  {
    id: 'state_telangana',
    name: 'Telangana',
    code: 'TG',
    center: [18.1124, 79.0193],
    population: 39362732,
    tribalPopulation: 3504543,
    tribalPercentage: 9.34, // Updated percentage
    forestCover: 24.0,
    districts: 33,
    fraClaimsCount: 645, // Updated FRA claims
    color: '#eab308', // Low-medium yellow
    priority: 'medium'
  },
  {
    id: 'state_mizoram',
    name: 'Mizoram',
    code: 'MZ',
    center: [23.1645, 92.9376],
    population: 1239244,
    tribalPopulation: 1036115,
    tribalPercentage: 94.43, // Very high tribal population
    forestCover: 84.53,
    districts: 11,
    fraClaimsCount: 189,
    color: '#7f1d1d', // Very dark red
    priority: 'high'
  },
  {
    id: 'state_meghalaya',
    name: 'Meghalaya',
    code: 'ML',
    center: [25.4670, 91.3662],
    population: 3366710,
    tribalPopulation: 2555861,
    tribalPercentage: 86.15, // Very high tribal population
    forestCover: 76.00,
    districts: 12,
    fraClaimsCount: 312,
    color: '#7f1d1d', // Very dark red
    priority: 'high'
  },
  {
    id: 'state_tripura',
    name: 'Tripura',
    code: 'TR',
    center: [23.9408, 91.9882],
    population: 4169794,
    tribalPopulation: 1166813,
    tribalPercentage: 31.78, // High tribal population
    forestCover: 73.68,
    districts: 8,
    fraClaimsCount: 234,
    color: '#dc2626', // High red
    priority: 'high'
  }
]

// Mock Villages Data
export const mockVillages: Village[] = [
  {
    id: 'village_1',
    name: 'Kalahandi',
    state: 'Odisha',
    district: 'Kalahandi',
    coordinates: [20.1342, 83.1675], // [lat, lng] - Kalahandi, Odisha
    population: 1250,
    tribalPopulation: 890,
    forestCover: 78.5,
    waterIndex: 65
  },
  {
    id: 'village_2', 
    name: 'Badwani',
    state: 'Madhya Pradesh',
    district: 'Khargone',
    coordinates: [21.8756, 75.2347], // [lat, lng] - Badwani, MP
    population: 980,
    tribalPopulation: 720,
    forestCover: 85.2,
    waterIndex: 45
  },
  {
    id: 'village_3',
    name: 'Warangal',
    state: 'Telangana', 
    district: 'Warangal',
    coordinates: [18.1234, 79.4565], // [lat, lng] - Warangal, Telangana
    population: 1680,
    tribalPopulation: 1120,
    forestCover: 62.8,
    waterIndex: 72
  }
]

// Mock Claimants Data
export const mockClaimants: Claimant[] = [
  {
    id: 'claimant_1',
    name: 'Sita Devi',
    villageId: 'village_1',
    contactNumber: '+91-9876543210',
    landSize: 2.5,
    claimType: 'IFR',
    status: 'approved',
    submissionDate: '2024-01-15',
    documentIds: ['doc_1']
  },
  {
    id: 'claimant_2',
    name: 'Ramesh Kumar Bhil',
    villageId: 'village_2', 
    contactNumber: '+91-9876543211',
    landSize: 4.2,
    claimType: 'IFR',
    status: 'pending',
    submissionDate: '2024-01-14',
    documentIds: ['doc_2']
  },
  {
    id: 'claimant_3',
    name: 'Balaghat Community',
    villageId: 'village_2',
    landSize: 12.5,
    claimType: 'CFR',
    status: 'under_review',
    submissionDate: '2024-01-13',
    documentIds: ['doc_3']
  }
]

// Mock Documents with OCR/NER Results
export const mockDocuments: Document[] = [
  {
    id: 'doc_1',
    name: 'FRA_Claim_Kalahandi_001.pdf',
    type: 'pdf',
    size: 2457600, // 2.4 MB
    uploadDate: '2024-01-15T10:30:00Z',
    status: 'completed',
    progress: 100,
    url: '/uploads/docs/fra_claim_kalahandi_001.pdf'
  },
  {
    id: 'doc_2', 
    name: 'Claim_Document_Badwani_002.jpg',
    type: 'jpg',
    size: 1843200, // 1.8 MB
    uploadDate: '2024-01-14T15:45:00Z',
    status: 'processing',
    progress: 65
  },
  {
    id: 'doc_3',
    name: 'Community_Rights_Warangal.pdf',
    type: 'pdf',
    size: 890000, // 890 KB
    uploadDate: '2024-01-14T09:15:00Z', 
    status: 'error',
    progress: 0
  }
]

// Mock OCR Results
export const mockOCRResults: OCRResult[] = [
  {
    id: 'ocr_1',
    documentId: 'doc_1',
    extractedText: `Forest Rights Act Claim Application
Village: Kalahandi, District: Kalahandi, State: Odisha
Applicant Name: Sita Devi
Father's Name: Raman Sahu
Land Area Claimed: 2.5 acres
Type of Claim: Individual Forest Rights (IFR)
Date of Application: 15/01/2024
Status: Approved by Gram Sabha
Contact: 9876543210`,
    confidence: 94.5,
    processingTime: 1250,
    status: 'completed',
    createdAt: '2024-01-15T10:32:00Z'
  }
]

// Mock NER Results
export const mockNERResults: NERResult[] = [
  {
    id: 'ner_1',
    ocrResultId: 'ocr_1',
    entities: [
      { text: 'Kalahandi', label: 'VILLAGE', start: 45, end: 54, confidence: 0.98 },
      { text: 'Sita Devi', label: 'PERSON', start: 95, end: 104, confidence: 0.97 },
      { text: '2.5 acres', label: 'AREA', start: 150, end: 159, confidence: 0.95 },
      { text: 'Approved', label: 'STATUS', start: 220, end: 228, confidence: 0.92 }
    ],
    confidence: 95.5,
    structuredData: {
      villageName: 'Kalahandi',
      claimantName: 'Sita Devi', 
      landSize: '2.5 acres',
      claimStatus: 'Approved',
      claimType: 'Individual Forest Rights (IFR)',
      submissionDate: '15/01/2024',
      coordinates: [83.1675, 20.1342]
    },
    status: 'completed',
    createdAt: '2024-01-15T10:34:00Z'
  }
]

// Mock Schemes Data
export const mockSchemes: Scheme[] = [
  {
    id: 'pmkisan',
    name: 'PM-KISAN',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'agriculture',
    description: 'Income support scheme for farmers with landholding up to 2 hectares',
    eligibilityScore: 95,
    budgetAllocation: 75000,
    coveragePercentage: 85,
    benefits: [
      '₹6,000 annual income support',
      'Direct benefit transfer to bank account',
      'Crop insurance eligibility'
    ],
    requirements: [
      'Landholding certificate',
      'Aadhaar card',
      'Bank account details'
    ],
    aiCompatibilityScore: 94,
    priority: 'high',
    status: 'recommended'
  },
  {
    id: 'jaljeevan',
    name: 'Jal Jeevan Mission',
    ministry: 'Ministry of Jal Shakti',
    category: 'infrastructure',
    description: 'Providing functional household tap connections to every rural household',
    eligibilityScore: 88,
    budgetAllocation: 125000,
    coveragePercentage: 62,
    benefits: [
      'Piped water supply to every household',
      'Quality testing of water',
      'Community participation in water management'
    ],
    requirements: [
      'Village water committee formation',
      'Community contribution (10-15%)',
      'Gram Panchayat resolution'
    ],
    aiCompatibilityScore: 91,
    priority: 'high',
    status: 'eligible'
  },
  {
    id: 'mgnrega',
    name: 'MGNREGA',
    ministry: 'Ministry of Rural Development',
    category: 'livelihood',
    description: 'Guaranteed 100 days of wage employment in a financial year',
    eligibilityScore: 92,
    budgetAllocation: 95000,
    coveragePercentage: 78,
    benefits: [
      '100 days guaranteed employment',
      'Skill development opportunities',
      'Creation of durable assets'
    ],
    requirements: [
      'Job card registration',
      'Demand for work application',
      'Proof of residence'
    ],
    aiCompatibilityScore: 89,
    priority: 'medium',
    status: 'applied'
  },
  {
    id: 'dajgua',
    name: 'DAJGUA (Development Action Plan for Particularly Vulnerable Tribal Groups)',
    ministry: 'Ministry of Tribal Affairs',
    category: 'welfare',
    description: 'Comprehensive development plan for particularly vulnerable tribal groups',
    eligibilityScore: 97,
    budgetAllocation: 180000,
    coveragePercentage: 45,
    benefits: [
      'Infrastructure development',
      'Livelihood support',
      'Health and education facilities',
      'Skill development programs'
    ],
    requirements: [
      'PVTG community membership',
      'Village development committee',
      'Baseline survey completion'
    ],
    aiCompatibilityScore: 96,
    priority: 'high',
    status: 'recommended'
  }
]

// DSS Analysis Rules Engine
export const getDSSRecommendations = (village: Village): DSSAnalysisResult => {
  const recommendations: Scheme[] = []
  
  // Rule 1: Land size based recommendations
  const avgLandSize = 2.0 // Calculate from claimants
  if (avgLandSize < 2) {
    recommendations.push(mockSchemes.find(s => s.id === 'pmkisan')!)
  }
  
  // Rule 2: Water index based recommendations  
  if (village.waterIndex < 60) {
    recommendations.push(mockSchemes.find(s => s.id === 'jaljeevan')!)
  }
  
  // Rule 3: Forest cover based recommendations
  if (village.forestCover > 70) {
    recommendations.push(mockSchemes.find(s => s.id === 'mgnrega')!)
  }
  
  // Rule 4: Tribal population percentage
  const tribalPercentage = (village.tribalPopulation / village.population) * 100
  if (tribalPercentage > 60) {
    recommendations.push(mockSchemes.find(s => s.id === 'dajgua')!)
  }

  return {
    villageId: village.id,
    recommendations: recommendations.slice(0, 4), // Top 4 recommendations
    convergenceOpportunities: [
      {
        id: 'conv_1',
        type: 'convergence',
        title: 'Multi-Scheme Convergence Opportunity',
        description: 'Link PM-KISAN with Jal Jeevan Mission for enhanced agricultural productivity',
        schemes: ['pmkisan', 'jaljeevan'],
        expectedImpact: 'Enhanced agricultural productivity and water security',
        beneficiaryCount: 1250,
        estimatedCost: 15200000,
        confidence: 95,
        priority: 'high'
      }
    ],
    priorityActions: [
      {
        id: 'priority_1',
        type: 'optimization',
        title: 'Accelerate DAJGUA Implementation',
        description: 'Highest AI compatibility score indicates optimal fit for tribal development',
        schemes: ['dajgua'],
        expectedImpact: 'Comprehensive tribal welfare improvement',
        beneficiaryCount: village.tribalPopulation,
        estimatedCost: 18000000,
        confidence: 96,
        priority: 'high'
      }
    ],
    confidence: 92,
    lastUpdated: new Date().toISOString()
  }
}

// Enhanced Mock GeoJSON Features with realistic boundary data and performance optimization
export const mockGeoFeatures: { [layerId: string]: GeoFeature[] } = {
  'state_boundaries': indiaStatesGeoJSON,
  'district_boundaries': districtBoundariesGeoJSON,
  'fra_claims': [
    {
      id: 'claim_area_1',
      type: 'Polygon',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [83.1675, 20.1342], // [lng, lat] - GeoJSON format
          [83.1680, 20.1342],
          [83.1680, 20.1350],
          [83.1675, 20.1350],
          [83.1675, 20.1342]
        ]]
      },
      properties: {
        claimantName: 'Sita Devi',
        village: 'Kalahandi',
        landSize: 2.5,
        status: 'approved',
        claimType: 'IFR',
        tribalPercentage: 71.2,
        color: getTribalPopulationColor(71.2)
      }
    },
    {
      id: 'claim_area_2',
      type: 'Polygon',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [75.2340, 21.8750], // Badwani area
          [75.2350, 21.8750],
          [75.2350, 21.8765],
          [75.2340, 21.8765],
          [75.2340, 21.8750]
        ]]
      },
      properties: {
        claimantName: 'Ramesh Kumar Bhil',
        village: 'Badwani',
        landSize: 4.2,
        status: 'pending',
        claimType: 'IFR',
        tribalPercentage: 73.5,
        color: getTribalPopulationColor(73.5)
      }
    },
    {
      id: 'claim_area_3',
      type: 'Polygon',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [79.4550, 18.1220], // Warangal area
          [79.4580, 18.1220],
          [79.4580, 18.1250],
          [79.4550, 18.1250],
          [79.4550, 18.1220]
        ]]
      },
      properties: {
        claimantName: 'Balaghat Community',
        village: 'Warangal',
        landSize: 12.5,
        status: 'under_review',
        claimType: 'CFR',
        tribalPercentage: 66.7,
        color: getTribalPopulationColor(66.7)
      }
    }
  ],
  'settlements': [
    {
      id: 'settlement_1',
      type: 'Point',
      geometry: {
        type: 'Point',
        coordinates: [83.1675, 20.1342] // [lng, lat] - Kalahandi
      },
      properties: {
        name: 'Kalahandi Village',
        population: 1250,
        tribalPopulation: 890,
        tribalPercentage: 71.2,
        forestCover: 78.5,
        waterIndex: 65,
        fraClaimsCount: 12,
        color: getTribalPopulationColor(71.2)
      }
    },
    {
      id: 'settlement_2',
      type: 'Point',
      geometry: {
        type: 'Point',
        coordinates: [75.2347, 21.8756] // [lng, lat] - Badwani
      },
      properties: {
        name: 'Badwani Village',
        population: 980,
        tribalPopulation: 720,
        tribalPercentage: 73.5,
        forestCover: 85.2,
        waterIndex: 45,
        fraClaimsCount: 8,
        color: getTribalPopulationColor(73.5)
      }
    },
    {
      id: 'settlement_3',
      type: 'Point',
      geometry: {
        type: 'Point',
        coordinates: [79.4565, 18.1234] // [lng, lat] - Warangal
      },
      properties: {
        name: 'Warangal Village',
        population: 1680,
        tribalPopulation: 1120,
        tribalPercentage: 66.7,
        forestCover: 62.8,
        waterIndex: 72,
        fraClaimsCount: 15,
        color: getTribalPopulationColor(66.7)
      }
    }
  ],
  'forest_cover': [
    {
      id: 'forest_patch_1',
      type: 'Polygon',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [83.1600, 20.1300], [83.1750, 20.1300], [83.1750, 20.1400], [83.1600, 20.1400], [83.1600, 20.1300]
        ]]
      },
      properties: {
        name: 'Similipal Forest Reserve',
        forestType: 'Reserved Forest',
        canopyCover: 85.6,
        biodiversityIndex: 92,
        tribalDependency: 'High',
        color: '#22c55e'
      }
    }
  ],
  'water_bodies': [
    {
      id: 'water_body_1',
      type: 'Polygon',
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [83.1650, 20.1320], [83.1680, 20.1320], [83.1680, 20.1340], [83.1650, 20.1340], [83.1650, 20.1320]
        ]]
      },
      properties: {
        name: 'Mahanadi River',
        waterType: 'River',
        seasonality: 'Perennial',
        qualityIndex: 78,
        tribalUsage: 'Drinking, Irrigation, Fishing',
        color: '#06b6d4'
      }
    }
  ]
}

// Function to get layer data with zoom-based optimization
export const getOptimizedLayerData = (layerId: string, zoomLevel: number): GeoFeature[] => {
  // Use cached data for state/district boundaries based on zoom
  if (layerId === 'state_boundaries' || layerId === 'district_boundaries') {
    return getCachedLayerData(layerId, zoomLevel)
  }
  
  // Return regular mock data for other layers
  return mockGeoFeatures[layerId] || []
}

// Simulate API delays for realistic demo
export const simulateProcessing = (duration: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, duration))
}

// Counter for generating consistent IDs
let idCounter = 1000

export const processDocumentMock = async (file: File): Promise<{
  document: Document,
  ocrResult: OCRResult,
  nerResult: NERResult,
  structuredData: StructuredClaim
}> => {
  // Simulate file upload
  await simulateProcessing(1000)
  
  // Use counter-based IDs to avoid hydration mismatch
  const docId = `doc_${++idCounter}`
  const timestamp = '2024-01-15T10:30:00Z' // Fixed timestamp for consistency
  
  const document: Document = {
    id: docId,
    name: file.name,
    type: file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'jpg' | 'jpeg' | 'png',
    size: file.size,
    uploadDate: timestamp,
    status: 'processing',
    progress: 25
  }
  
  // Simulate OCR processing
  await simulateProcessing(2000)
  
  const ocrResult: OCRResult = {
    id: `ocr_${++idCounter}`,
    documentId: document.id,
    extractedText: `Forest Rights Act Claim Application
Village: Kalahandi, District: Kalahandi, State: Odisha
Applicant Name: Sita Devi
Father's Name: Raman Sahu
Land Area Claimed: 2.5 acres
Type of Claim: Individual Forest Rights (IFR)
Date of Application: 15/01/2024
Status: Approved by Gram Sabha
Contact: 9876543210`,
    confidence: 94.5,
    processingTime: 2250,
    status: 'completed',
    createdAt: timestamp
  }
  
  // Simulate NER processing
  await simulateProcessing(1500)
  
  const nerResult: NERResult = {
    id: `ner_${++idCounter}`,
    ocrResultId: ocrResult.id,
    entities: [
      { text: 'Kalahandi', label: 'VILLAGE', start: 45, end: 54, confidence: 0.98 },
      { text: 'Sita Devi', label: 'PERSON', start: 95, end: 104, confidence: 0.97 },
      { text: '2.5 acres', label: 'AREA', start: 150, end: 159, confidence: 0.95 },
      { text: 'Approved', label: 'STATUS', start: 220, end: 228, confidence: 0.92 }
    ],
    confidence: 95.5,
    structuredData: {
      villageName: 'Kalahandi',
      claimantName: 'Sita Devi',
      landSize: '2.5 acres',
      claimStatus: 'Approved',
      claimType: 'Individual Forest Rights (IFR)',
      submissionDate: '15/01/2024',
      coordinates: [83.1675, 20.1342]
    },
    status: 'completed',
    createdAt: timestamp
  }
  
  return {
    document: { ...document, status: 'completed', progress: 100 },
    ocrResult,
    nerResult,
    structuredData: nerResult.structuredData
  }
}