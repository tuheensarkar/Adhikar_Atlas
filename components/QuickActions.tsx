"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { 
  Search, 
  FileText, 
  Map, 
  BarChart3, 
  Upload, 
  Settings, 
  Users, 
  MapPin,
  Brain,
  Download,
  Bell,
  HelpCircle,
  Command,
  Calculator,
  Database
} from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  keywords: string[]
  section: string
  shortcut?: string
  action: () => void
  disabled?: boolean
}

interface QuickActionsProps {
  isOpen: boolean
  onClose: () => void
  actions?: QuickAction[]
  onNavigate?: (section: string) => void
}

const defaultActions: QuickAction[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    description: "View key metrics and analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    keywords: ["dashboard", "analytics", "metrics", "overview", "stats"],
    section: "navigation",
    shortcut: "⌘1",
    action: () => console.log("Navigate to dashboard")
  },
  {
    id: "document-upload",
    title: "Upload Documents",
    description: "Process FRA documents with OCR/NER",
    icon: <Upload className="w-4 h-4" />,
    keywords: ["upload", "documents", "ocr", "ner", "scan", "fra"],
    section: "navigation",
    shortcut: "⌘2",
    action: () => console.log("Navigate to document upload")
  },
  {
    id: "webgis",
    title: "WebGIS",
    description: "Interactive mapping and satellite imagery",
    icon: <Map className="w-4 h-4" />,
    keywords: ["map", "gis", "satellite", "imagery", "location"],
    section: "navigation",
    shortcut: "⌘3",
    action: () => console.log("Navigate to WebGIS")
  },
  {
    id: "asset-mapping",
    title: "Asset Mapping",
    description: "Analyze land, forest, water, and settlements",
    icon: <MapPin className="w-4 h-4" />,
    keywords: ["assets", "land", "forest", "water", "settlements", "analysis"],
    section: "navigation",
    shortcut: "⌘4",
    action: () => console.log("Navigate to asset mapping")
  },
  {
    id: "decision-support",
    title: "Decision Support",
    description: "AI-powered scheme recommendations",
    icon: <Brain className="w-4 h-4" />,
    keywords: ["ai", "recommendations", "schemes", "decision", "support"],
    section: "navigation",
    shortcut: "⌘5",
    action: () => console.log("Navigate to decision support")
  },
  {
    id: "reports",
    title: "Reports",
    description: "Comprehensive reporting and analytics",
    icon: <FileText className="w-4 h-4" />,
    keywords: ["reports", "analytics", "export", "data"],
    section: "navigation",
    shortcut: "⌘6",
    action: () => console.log("Navigate to reports")
  },
  {
    id: "export-data",
    title: "Export Data",
    description: "Download reports and analytics",
    icon: <Download className="w-4 h-4" />,
    keywords: ["export", "download", "csv", "pdf", "data"],
    section: "actions",
    action: () => console.log("Export data")
  },
  {
    id: "calculate-area",
    title: "Calculate Area",
    description: "Measure land area and boundaries",
    icon: <Calculator className="w-4 h-4" />,
    keywords: ["calculate", "area", "measure", "land", "boundary"],
    section: "tools",
    action: () => console.log("Open area calculator")
  },
  {
    id: "search-claims",
    title: "Search FRA Claims",
    description: "Find specific FRA claims and applications",
    icon: <Search className="w-4 h-4" />,
    keywords: ["search", "find", "claims", "fra", "applications"],
    section: "tools",
    action: () => console.log("Open claim search")
  },
  {
    id: "manage-users",
    title: "Manage Users",
    description: "User management and permissions",
    icon: <Users className="w-4 h-4" />,
    keywords: ["users", "manage", "permissions", "admin"],
    section: "admin",
    action: () => console.log("Open user management")
  },
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure system preferences",
    icon: <Settings className="w-4 h-4" />,
    keywords: ["settings", "preferences", "config", "system"],
    section: "admin",
    action: () => console.log("Open settings")
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "View system notifications and alerts",
    icon: <Bell className="w-4 h-4" />,
    keywords: ["notifications", "alerts", "messages"],
    section: "tools",
    action: () => console.log("Open notifications")
  },
  {
    id: "help",
    title: "Help & Documentation",
    description: "Access help and documentation",
    icon: <HelpCircle className="w-4 h-4" />,
    keywords: ["help", "docs", "documentation", "support"],
    section: "help",
    action: () => console.log("Open help")
  },
  {
    id: "database",
    title: "Database Status",
    description: "Check database connection and status",
    icon: <Database className="w-4 h-4" />,
    keywords: ["database", "status", "connection", "health"],
    section: "admin",
    action: () => console.log("Check database status")
  }
]

export function QuickActions({ 
  isOpen, 
  onClose, 
  actions = defaultActions,
  onNavigate 
}: QuickActionsProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions
    
    const searchTerms = query.toLowerCase().split(" ")
    
    return actions.filter(action => {
      const searchableText = [
        action.title,
        action.description,
        ...action.keywords
      ].join(" ").toLowerCase()
      
      return searchTerms.every(term => searchableText.includes(term))
    })
  }, [query, actions])

  const groupedActions = useMemo(() => {
    const groups: Record<string, QuickAction[]> = {}
    
    filteredActions.forEach(action => {
      if (!groups[action.section]) {
        groups[action.section] = []
      }
      groups[action.section].push(action)
    })
    
    return groups
  }, [filteredActions])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % filteredActions.length)
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length)
        break
      case "Enter":
        e.preventDefault()
        if (filteredActions[selectedIndex]) {
          filteredActions[selectedIndex].action()
          onClose()
        }
        break
      case "Escape":
        onClose()
        break
    }
  }, [isOpen, filteredActions, selectedIndex, onClose])

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const sectionTitles: Record<string, string> = {
    navigation: "Navigation",
    actions: "Quick Actions",
    tools: "Tools",
    admin: "Administration",
    help: "Help & Support"
  }

  const sectionOrder = ["navigation", "actions", "tools", "admin", "help"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
        <div className="border-b border-gray-200/50">
          <div className="flex items-center gap-3 px-4 py-3">
            <Command className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search actions, navigate pages, or run commands..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Badge variant="secondary" className="text-xs">
              ⌘K
            </Badge>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {Object.keys(groupedActions).length === 0 ? (
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No actions found for &quot;{query}&quot;</p>
              <p className="text-sm text-gray-400 mt-1">
                Try searching for dashboard, upload, map, or settings
              </p>
            </div>
          ) : (
            <div className="p-2">
              {sectionOrder.map(sectionKey => {
                const sectionActions = groupedActions[sectionKey]
                if (!sectionActions?.length) return null

                return (
                  <div key={sectionKey} className="mb-6 last:mb-2">
                    <div className="px-3 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {sectionTitles[sectionKey] || sectionKey}
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {sectionActions.map((action, actionIndex) => {
                        const globalIndex = filteredActions.indexOf(action)
                        const isSelected = selectedIndex === globalIndex
                        
                        return (
                          <button
                            key={action.id}
                            onClick={() => {
                              action.action()
                              onClose()
                            }}
                            disabled={action.disabled}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all",
                              "hover:bg-blue-50 focus:bg-blue-50 focus:outline-none",
                              isSelected && "bg-blue-50 ring-2 ring-blue-500/20",
                              action.disabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            <div className={cn(
                              "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                              isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                            )}>
                              {action.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={cn(
                                  "font-medium truncate",
                                  isSelected ? "text-blue-900" : "text-gray-900"
                                )}>
                                  {action.title}
                                </p>
                                {action.shortcut && (
                                  <Badge variant="outline" className="text-xs">
                                    {action.shortcut}
                                  </Badge>
                                )}
                              </div>
                              <p className={cn(
                                "text-sm truncate",
                                isSelected ? "text-blue-700" : "text-gray-500"
                              )}>
                                {action.description}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="border-t border-gray-200/50 px-4 py-3 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">↑↓</Badge>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">↵</Badge>
                <span>Select</span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs">Esc</Badge>
                <span>Close</span>
              </div>
            </div>
            <div className="text-gray-400">
              {filteredActions.length} {filteredActions.length === 1 ? "action" : "actions"}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook for managing quick actions state
export function useQuickActions() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(prev => !prev)
  }
}