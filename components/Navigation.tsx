"use client"

import { useState, useEffect } from "react"
import { 
  BarChart3, 
  Upload, 
  Map, 
  MapPin, 
  Brain, 
  FileText, 
  Menu, 
  X, 
  Bell, 
  Search,
  User,
  Settings,
  LogOut,
  Command,
  ChevronDown,
  Shield,
  Home
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeSection: string
  onNavigate: (section: string) => void
  className?: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  shortcut: string
  description: string
  badge?: string
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <BarChart3 className="w-5 h-5" />,
    shortcut: "⌘1",
    description: "Analytics & Overview"
  },
  {
    id: "upload",
    label: "Documents",
    icon: <Upload className="w-5 h-5" />,
    shortcut: "⌘2",
    description: "Upload & Process FRA Documents"
  },
  {
    id: "webgis",
    label: "WebGIS",
    icon: <Map className="w-5 h-5" />,
    shortcut: "⌘3",
    description: "Interactive Mapping"
  },
  {
    id: "assets",
    label: "Assets",
    icon: <MapPin className="w-5 h-5" />,
    shortcut: "⌘4",
    description: "Asset Mapping & Analysis"
  },
  {
    id: "decisions",
    label: "AI Support",
    icon: <Brain className="w-5 h-5" />,
    shortcut: "⌘5",
    description: "Decision Support System",
    badge: "AI"
  },
  {
    id: "reports",
    label: "Reports",
    icon: <FileText className="w-5 h-5" />,
    shortcut: "⌘6",
    description: "Analytics & Reports"
  }
]

export function Navigation({ activeSection, onNavigate, className }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications] = useState(3)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsScrolled(scrollY > 10)
      setIsCompact(scrollY > 100)
    }

    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        const key = e.key
        const shortcuts: Record<string, string> = {
          "1": "dashboard",
          "2": "upload", 
          "3": "webgis",
          "4": "assets",
          "5": "decisions",
          "6": "reports"
        }
        
        if (shortcuts[key]) {
          e.preventDefault()
          onNavigate(shortcuts[key])
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("keydown", handleKeyboard)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("keydown", handleKeyboard)
    }
  }, [onNavigate])

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          "bg-white/95 backdrop-blur-lg border-b border-gray-200/50",
          isScrolled && "shadow-lg",
          isCompact ? "py-2" : "py-4",
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div className={cn(
                  "transition-all duration-300",
                  isCompact && "opacity-0 w-0 overflow-hidden"
                )}>
                  <h1 className="text-xl font-bold text-gray-900">
                    FRA Atlas DSS
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Ministry of Tribal Affairs
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => onNavigate(item.id)}
                    className={cn(
                      "relative group px-4 py-2 rounded-lg transition-all duration-200",
                      "hover:bg-blue-50 hover:text-blue-700 focus:ring-2 focus:ring-blue-500/20",
                      isActive && "bg-blue-100 text-blue-700 shadow-sm",
                      isCompact ? "px-2" : "px-4"
                    )}
                    title={`${item.description} (${item.shortcut})`}
                  >
                    <div className="flex items-center space-x-2">
                      {item.icon}
                      <span className={cn(
                        "font-medium transition-all duration-300",
                        isCompact && "opacity-0 w-0 overflow-hidden"
                      )}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={cn(
                            "text-xs bg-purple-100 text-purple-700 transition-all duration-300",
                            isCompact && "opacity-0 w-0 overflow-hidden"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-blue-600 rounded-full" />
                    )}
                  </Button>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Quick Actions Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center space-x-2 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20"
                title="Quick Actions (⌘K)"
              >
                <Command className="w-4 h-4" />
                <span className={cn(
                  "transition-all duration-300",
                  isCompact && "opacity-0 w-0 overflow-hidden"
                )}>
                  Quick Actions
                </span>
                <Badge variant="outline" className={cn(
                  "text-xs transition-all duration-300",
                  isCompact && "opacity-0 w-0 overflow-hidden"
                )}>
                  ⌘K
                </Badge>
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-gray-100"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-all duration-300",
                      isCompact && "opacity-0 w-0 overflow-hidden"
                    )} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-gray-900">Admin User</p>
                    <p className="text-sm text-gray-500">admin@tribal.gov.in</p>
                  </div>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">FRA Atlas DSS</h2>
                    <p className="text-xs text-gray-500">Ministry of Tribal Affairs</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => {
                      onNavigate(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "w-full justify-start space-x-3 h-12 rounded-lg transition-all",
                      "hover:bg-blue-50 hover:text-blue-700",
                      isActive && "bg-blue-100 text-blue-700 shadow-sm"
                    )}
                  >
                    {item.icon}
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        <div className="flex items-center space-x-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {item.shortcut}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </Button>
                )
              })}
            </div>

            <div className="p-4 border-t mt-auto">
              <Button
                className="w-full justify-start space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Command className="w-5 h-5" />
                <span>Quick Actions</span>
                <Badge variant="secondary" className="ml-auto">
                  ⌘K
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {isScrolled && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-110"
          title="Scroll to top"
        >
          <Home className="w-5 h-5" />
        </Button>
      )}
    </>
  )
}
