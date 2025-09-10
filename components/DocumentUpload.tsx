"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useDocumentUpload } from "@/hooks/useDocument"
import type { StructuredClaim, Document } from "@/types"

interface DemoDocument extends Document {
  structuredData?: StructuredClaim
}



export function DocumentUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedData, setExtractedData] = useState<StructuredClaim[]>([
    {
      villageName: "Jhabua Village",
      claimantName: "Ramesh Kumar Bhil",
      landSize: "2.5 hectares",
      claimStatus: "Approved",
      claimType: "Individual Forest Rights",
      submissionDate: "2024-03-15",
      coordinates: [22.7697, 74.5947]
    },
    {
      villageName: "Mayurbhanj District",
      claimantName: "Sita Devi Soren",
      landSize: "1.8 hectares",
      claimStatus: "Under Review",
      claimType: "Community Forest Rights",
      submissionDate: "2024-02-28",
      coordinates: [22.1000, 86.0000]
    },
    {
      villageName: "Dhalai Village",
      claimantName: "Tripura Tribal Council",
      landSize: "15.2 hectares",
      claimStatus: "Approved",
      claimType: "Community Forest Rights",
      submissionDate: "2024-01-20",
      coordinates: [23.7500, 91.9500]
    }
  ])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const {
    isUploading,
    uploadProgress,
    documents: uploadedDocuments,
    ocrResults,
    nerResults,
    uploadDocument,
    getStructuredData,
    clearProgress
  } = useDocumentUpload()

  // Demo documents for display
  const demoDocuments: DemoDocument[] = [
    {
      id: "demo-1",
      name: "FRA_Claim_Jhabua_MP_001.pdf",
      type: "pdf" as const,
      size: 2456789,
      uploadDate: new Date('2024-03-15').toISOString(),
      status: "completed" as const,
      progress: 100,
      structuredData: {
        villageName: "Jhabua Village",
        claimantName: "Ramesh Kumar Bhil",
        landSize: "2.5 hectares",
        claimStatus: "Approved",
        claimType: "Individual Forest Rights"
      }
    },
    {
      id: "demo-2", 
      name: "Community_Rights_Mayurbhanj_OR.pdf",
      type: "pdf" as const,
      size: 3128456,
      uploadDate: new Date('2024-02-28').toISOString(),
      status: "completed" as const,
      progress: 100,
      structuredData: {
        villageName: "Mayurbhanj District",
        claimantName: "Sita Devi Soren",
        landSize: "1.8 hectares",
        claimStatus: "Under Review",
        claimType: "Community Forest Rights"
      }
    },
    {
      id: "demo-3",
      name: "Tribal_Council_Dhalai_TR.pdf",
      type: "pdf" as const,
      size: 1876543,
      uploadDate: new Date('2024-01-20').toISOString(),
      status: "completed" as const,
      progress: 100,
      structuredData: {
        villageName: "Dhalai Village",
        claimantName: "Tripura Tribal Council",
        landSize: "15.2 hectares",
        claimStatus: "Approved",
        claimType: "Community Forest Rights"
      }
    }
  ]

  // Combine uploaded documents with demo documents
  const documents: (Document | DemoDocument)[] = [...demoDocuments, ...uploadedDocuments]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    if (files.length === 0) return
    
    const file = files[0]
    setSelectedFile(file)
    
    try {
      const result = await uploadDocument(file)
      
      if (result.success && result.data) {
        const structuredData = result.data.structuredData
        setExtractedData(prev => [...prev, structuredData])
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      handleFiles(event.target.files)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">FRA Document Upload</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Demo Mode
          </Badge>
        </div>
        <p className="text-gray-600">Upload and process FRA claims with AI-powered OCR and NER extraction</p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            ℹ️ This is a demonstration with sample FRA documents showing the AI processing capabilities. Upload your own documents to see real-time OCR and NER extraction.
          </p>
        </div>
      </div>

      {/* AI Processing Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>AI Processing Pipeline</CardTitle>
          <CardDescription>Automated document processing workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Upload</span>
            </div>
            <div className="flex-1 h-2 bg-blue-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full" style={{ width: "100%" }}></div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">OCR</span>
            </div>
            <div className="flex-1 h-2 bg-green-200 rounded-full">
              <div className="h-2 bg-green-600 rounded-full" style={{ width: "100%" }}></div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">NER</span>
            </div>
            <div className="flex-1 h-2 bg-purple-200 rounded-full">
              <div className="h-2 bg-purple-600 rounded-full" style={{ width: "100%" }}></div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Verified</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>Drag & drop FRA documents or click to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Drag & Drop FRA Documents</h3>
              <p className="text-gray-600 mb-4">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
              <div className="space-y-2">
                <Button onClick={() => fileInputRef.current?.click()}>
                  Choose Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="hidden"
                  multiple={false}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>

            {(isUploading || uploadProgress.length > 0) && (
              <div className="mt-4">
                {uploadProgress.map((progress, index) => (
                  <div key={progress.fileId} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{progress.message || progress.stage}</span>
                      <span className="text-sm text-gray-600">{progress.progress}%</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                    <div className="mt-1 text-xs text-gray-500">
                      Stage: {progress.stage.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Processing Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">94.5%</div>
                <div className="text-sm text-gray-600">OCR Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">91.2%</div>
                <div className="text-sm text-gray-600">NER Precision</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data Table - Always visible with demo data */}
        <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Extracted Data Results
              </CardTitle>
              <CardDescription>Structured data extracted from uploaded documents using OCR + NER</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Village</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Claimant</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Land Size</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">GPS Coordinates</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extractedData.map((data, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          {data.villageName || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {data.claimantName || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {data.landSize || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-xs text-gray-600">
                          {data.coordinates ? `${data.coordinates[0].toFixed(4)}°N, ${data.coordinates[1].toFixed(4)}°E` : 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <Badge 
                            variant={data.claimStatus?.toLowerCase().includes('approved') ? 'default' : 'secondary'}
                          >
                            {data.claimStatus || 'N/A'}
                          </Badge>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {data.claimType || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Export
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {extractedData.length > 0 && (
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Total records extracted: {extractedData.length}
                  </p>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Export All as CSV
                    </Button>
                    <Button variant="outline" size="sm">
                      Save to Database
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Processing status and extracted information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>No documents uploaded yet</p>
                  <p className="text-sm">Upload a document to see processing results</p>
                </div>
              ) : (
                documents.map((doc) => {
                  const structuredData = 'structuredData' in doc ? doc.structuredData : getStructuredData(doc.id)
                  
                  return (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="font-medium text-sm">{doc.name}</span>
                          {doc.id.startsWith('demo-') && (
                            <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                              Demo
                            </Badge>
                          )}
                        </div>
                        <Badge
                          variant={
                            doc.status === "completed"
                              ? "default"
                              : doc.status === "processing"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB • {new Date(doc.uploadDate).toLocaleDateString()}
                      </div>

                      {doc.status === "processing" && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-600">Processing...</span>
                            <span className="text-xs text-gray-600">{doc.progress}%</span>
                          </div>
                          <Progress value={doc.progress} className="h-1" />
                        </div>
                      )}

                      {doc.status === "completed" && structuredData && (
                        <div className="bg-green-50 rounded p-3 text-xs space-y-1">
                          <div className="font-medium text-green-800">Extracted Information:</div>
                          <div>
                            <span className="font-medium">Village:</span> {structuredData.villageName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Claimant:</span> {structuredData.claimantName || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Land Size:</span> {structuredData.landSize || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> {structuredData.claimStatus || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {structuredData.claimType || 'N/A'}
                          </div>
                        </div>
                      )}

                      {doc.status === "error" && (
                        <div className="bg-red-50 rounded p-3 text-xs">
                          <div className="font-medium text-red-800">Processing failed</div>
                          <div className="text-red-600">Please try uploading the document again</div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <Button variant="ghost" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </Button>
                        {doc.status === "completed" && (
                          <Button variant="ghost" size="sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            Export
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
