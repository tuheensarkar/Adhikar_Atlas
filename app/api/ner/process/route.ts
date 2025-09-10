// API Route for NER Processing using SpaCy

import { NextRequest, NextResponse } from 'next/server'
import type { NERResult, NEREntity, StructuredClaim, APIResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<NERResult>>> {
  try {
    const { ocrResultId, extractedText } = await request.json()
    
    if (!ocrResultId) {
      return NextResponse.json({
        success: false,
        error: 'OCR Result ID is required'
      }, { status: 400 })
    }

    // Simulate NER processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In a real implementation, call SpaCy NER API
    // const response = await fetch(process.env.SPACY_NER_API_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ text: extractedText })
    // })
    // const nerData = await response.json()

    // Mock NER processing for demo
    const entities: NEREntity[] = [
      { text: 'Kalahandi', label: 'VILLAGE', start: 45, end: 54, confidence: 0.98 },
      { text: 'Sita Devi', label: 'PERSON', start: 95, end: 104, confidence: 0.97 },
      { text: '2.5 acres', label: 'AREA', start: 150, end: 159, confidence: 0.95 },
      { text: 'Approved', label: 'STATUS', start: 220, end: 228, confidence: 0.92 },
      { text: 'Individual Forest Rights', label: 'CLAIM_TYPE', start: 180, end: 205, confidence: 0.94 },
      { text: '15/01/2024', label: 'DATE', start: 240, end: 250, confidence: 0.96 }
    ]

    const structuredData: StructuredClaim = {
      villageName: entities.find(e => e.label === 'VILLAGE')?.text,
      claimantName: entities.find(e => e.label === 'PERSON')?.text,
      landSize: entities.find(e => e.label === 'AREA')?.text,
      claimStatus: entities.find(e => e.label === 'STATUS')?.text,
      claimType: entities.find(e => e.label === 'CLAIM_TYPE')?.text,
      submissionDate: entities.find(e => e.label === 'DATE')?.text,
      coordinates: [83.1675, 20.1342] // Mock coordinates for Kalahandi
    }

    const nerResult: NERResult = {
      id: `ner_${Date.now()}`,
      ocrResultId,
      entities,
      confidence: 95.5,
      structuredData,
      status: 'completed',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: nerResult,
      message: 'NER processing completed successfully'
    })

  } catch (error) {
    console.error('NER processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process NER'
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse<NERResult>>> {
  try {
    const { searchParams } = new URL(request.url)
    const ocrResultId = searchParams.get('ocrResultId')

    if (!ocrResultId) {
      return NextResponse.json({
        success: false,
        error: 'OCR Result ID is required'
      }, { status: 400 })
    }

    // In a real implementation, fetch from database
    // const nerResult = await db.nerResults.findOne({ ocrResultId })

    return NextResponse.json({
      success: false,
      error: 'NER result not found'
    }, { status: 404 })

  } catch (error) {
    console.error('Error fetching NER result:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch NER result'
    }, { status: 500 })
  }
}