// Custom hooks for document processing and OCR/NER functionality

import { useState, useCallback, useRef } from 'react'
import type { Document, OCRResult, NERResult, StructuredClaim, UploadProgress } from '@/types'
import { processDocumentMock } from '@/services/mockData'

export const useDocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([])
  const [nerResults, setNerResults] = useState<NERResult[]>([])
  const fileCounterRef = useRef(0)

  const uploadDocument = useCallback(async (file: File) => {
    setIsUploading(true)
    
    // Use counter-based ID to avoid hydration mismatch
    fileCounterRef.current += 1
    const fileId = `file_${fileCounterRef.current}`
    
    // Initialize progress tracking
    setUploadProgress(prev => [...prev, {
      fileId,
      progress: 0,
      stage: 'uploading',
      message: 'Uploading file...'
    }])

    try {
      // Simulate upload stages with progress updates
      const updateProgress = (progress: number, stage: UploadProgress['stage'], message?: string) => {
        setUploadProgress(prev => prev.map(p => 
          p.fileId === fileId 
            ? { ...p, progress, stage, message }
            : p
        ))
      }

      updateProgress(25, 'uploading', 'File uploaded successfully')
      
      // Process document (OCR + NER)
      updateProgress(30, 'ocr', 'Starting OCR processing...')
      
      const result = await processDocumentMock(file)
      
      updateProgress(70, 'ocr', 'OCR processing completed')
      updateProgress(85, 'ner', 'NER processing in progress...')
      updateProgress(100, 'completed', 'Processing completed successfully')

      // Update state with results
      setDocuments(prev => [...prev, result.document])
      setOcrResults(prev => [...prev, result.ocrResult])
      setNerResults(prev => [...prev, result.nerResult])

      return {
        success: true,
        data: result
      }
    } catch (error) {
      setUploadProgress(prev => prev.map(p => 
        p.fileId === fileId 
          ? { ...p, progress: 0, stage: 'error', message: 'Processing failed' }
          : p
      ))
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    } finally {
      setIsUploading(false)
      
      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.fileId !== fileId))
      }, 3000)
    }
  }, [])

  const getStructuredData = useCallback((documentId: string): StructuredClaim | null => {
    const ocrResult = ocrResults.find(r => r.documentId === documentId)
    if (!ocrResult) return null
    
    const nerResult = nerResults.find(r => r.ocrResultId === ocrResult.id)
    return nerResult?.structuredData || null
  }, [ocrResults, nerResults])

  const clearProgress = useCallback(() => {
    setUploadProgress([])
  }, [])

  return {
    isUploading,
    uploadProgress,
    documents,
    ocrResults,
    nerResults,
    uploadDocument,
    getStructuredData,
    clearProgress
  }
}