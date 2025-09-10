// API Route for Document Upload and Processing

import { NextRequest, NextResponse } from 'next/server'
import type { Document, APIResponse } from '@/types'

export async function POST(request: NextRequest): Promise<NextResponse<APIResponse<Document>>> {
  try {
    const formData = await request.formData()
    const file = formData.get('document') as File
    
    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file type. Please upload PDF, JPG, or PNG files only.'
      }, { status: 400 })
    }
    
    if (file.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      }, { status: 400 })
    }

    // Create document record
    const document: Document = {
      id: `doc_${Date.now()}`,
      name: file.name,
      type: file.name.split('.').pop()?.toLowerCase() as any,
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'uploaded',
      progress: 0
    }

    // In a real implementation, save the file to storage
    // const uploadPath = path.join(process.env.OCR_UPLOAD_DIR || './uploads', document.id)
    // await fs.writeFile(uploadPath, Buffer.from(await file.arrayBuffer()))

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    })

  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to upload document'
    }, { status: 500 })
  }
}

export async function GET(): Promise<NextResponse<APIResponse<Document[]>>> {
  try {
    // In a real implementation, fetch from database
    const documents: Document[] = []
    
    return NextResponse.json({
      success: true,
      data: documents
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch documents'
    }, { status: 500 })
  }
}