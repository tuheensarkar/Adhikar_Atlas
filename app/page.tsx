"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { QuickActions } from "@/components/QuickActions"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { NotificationSystem } from "@/components/NotificationSystem"
import { Dashboard } from "@/components/Dashboard"
import { DocumentUpload } from "@/components/DocumentUpload"
import { WebGIS } from "@/components/WebGIS"
import { AssetMapping } from "@/components/AssetMapping"
import { DecisionSupport } from "@/components/DecisionSupport"
import { Reports } from "@/components/Reports"
import { Login } from "@/components/Login"

export default function FRAAtlasDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by ensuring component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted) return // Prevent running on server
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only process shortcuts if no modal is open and user is authenticated
      if (!isAuthenticated || isQuickActionsOpen) return

      const { key, ctrlKey, metaKey, altKey } = event
      const isModifier = ctrlKey || metaKey

      // Quick Actions (Ctrl/Cmd + K)
      if (isModifier && key === 'k') {
        event.preventDefault()
        setIsQuickActionsOpen(true)
        return
      }

      // Navigation shortcuts (Ctrl/Cmd + Number)
      if (isModifier && !altKey) {
        const shortcuts: Record<string, string> = {
          '1': 'dashboard',
          '2': 'upload',
          '3': 'webgis',
          '4': 'assets',
          '5': 'decisions',
          '6': 'reports'
        }

        if (shortcuts[key]) {
          event.preventDefault()
          handleSectionChange(shortcuts[key])
          return
        }
      }

      // Escape to close quick actions
      if (key === 'Escape' && isQuickActionsOpen) {
        setIsQuickActionsOpen(false)
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mounted, isAuthenticated, isQuickActionsOpen])

  const handleSectionChange = (section: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setActiveSection(section)
      setIsLoading(false)
    }, 300)
  }

  const handleNavigate = (section: string) => {
    handleSectionChange(section)
    setIsQuickActionsOpen(false)
  }

  const handleLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsLoading(false)
    }, 1500)
  }

  if (!mounted) {
    // Return a simple loading state to prevent hydration mismatch
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading FRA Atlas..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} isLoading={isLoading} />
  }

  const renderActiveSection = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      )
    }

    switch (activeSection) {
      case "dashboard":
        return <Dashboard />
      case "upload":
        return <DocumentUpload />
      case "webgis":
        return <WebGIS />
      case "assets":
        return <AssetMapping />
      case "decisions":
        return <DecisionSupport />
      case "reports":
        return <Reports />
      default:
        return <Dashboard />
    }
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30"
      role="main"
      aria-label="FRA Atlas Decision Support System"
    >
      <NotificationSystem>
        <div />
      </NotificationSystem>
      <Navigation
        activeSection={activeSection}
        onNavigate={handleSectionChange}
      />

      <main className="pt-20 pb-8" role="main" aria-label={`${activeSection} section`}>
        <div className="animate-fade-in">
          <div className="sr-only" aria-live="polite">
            Currently viewing {activeSection} section
          </div>
          {renderActiveSection()}
        </div>
      </main>

      <QuickActions
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Keyboard shortcuts help - Hidden but available for screen readers */}
      <div className="sr-only" aria-label="Keyboard shortcuts">
        <h2>Available Keyboard Shortcuts:</h2>
        <ul>
          <li>Ctrl/Cmd + K: Open Quick Actions</li>
          <li>Ctrl/Cmd + 1: Go to Dashboard</li>
          <li>Ctrl/Cmd + 2: Go to Document Upload</li>
          <li>Ctrl/Cmd + 3: Go to WebGIS</li>
          <li>Ctrl/Cmd + 4: Go to Asset Mapping</li>
          <li>Ctrl/Cmd + 5: Go to Decision Support</li>
          <li>Ctrl/Cmd + 6: Go to Reports</li>
          <li>Escape: Close Quick Actions</li>
        </ul>
      </div>

      {/* Scroll to Top Button */}
      {mounted && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[var(--gov-blue)] text-white rounded-full shadow-lg hover:shadow-xl focus:ring-4 focus:ring-blue-300 focus:outline-none transition-all duration-200 flex items-center justify-center z-40"
          aria-label="Scroll to top"
          title="Scroll to top (Keyboard accessible)"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      {/* Government Footer */}
      <footer className="bg-[var(--gov-blue)] text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">FRA Atlas & DSS</h3>
                  <p className="text-white/80">Ministry of Tribal Affairs</p>
                </div>
              </div>
              <p className="text-white/80 mb-4">
                Empowering tribal communities through AI-powered Forest Rights Act implementation and intelligent
                government scheme convergence.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white/60">Secured by Government of India</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Upload Documents
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    WebGIS Atlas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Reports
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    System Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60">
              © 2025 Government of India. All rights reserved. | Smart India Hackathon 2025
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-white/60">Problem Statement 25108</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-green-400">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
