// API Route for OCR Processing using Tesseract

import { NextRequest, NextResponse } from 'next/server'
import type { OCRResult, APIResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<OCRResult>>> {
  try {
    const { documentId } = await request.json()
    
    if (!documentId) {
      return NextResponse.json({
        success: false,
        error: 'Document ID is required'
      }, { status: 400 })
    }

    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // In a real implementation, use Tesseract.js or API
    // const Tesseract = require('tesseract.js')
    // const { data: { text, confidence } } = await Tesseract.recognize(imagePath, 'eng')

    // Mock OCR result for demo
    const ocrResult: OCRResult = {
      id: `ocr_${Date.now()}`,
      documentId,
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
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: ocrResult,
      message: 'OCR processing completed successfully'
    })

  } catch (error) {
    console.error('OCR processing error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process OCR'
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
): Promise<NextResponse<APIResponse<OCRResult>>> {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('documentId')

    if (!documentId) {
      return NextResponse.json({
        success: false,
        error: 'Document ID is required'
      }, { status: 400 })
    }

    // In a real implementation, fetch from database
    // const ocrResult = await db.ocrResults.findOne({ documentId })

    return NextResponse.json({
      success: false,
      error: 'OCR result not found'
    }, { status: 404 })

  } catch (error) {
    console.error('Error fetching OCR result:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch OCR result'
    }, { status: 500 })
  }
}