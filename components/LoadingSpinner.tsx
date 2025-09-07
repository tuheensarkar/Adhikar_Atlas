"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "government" | "tribal" | "ai" | "minimal"
  text?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = "md", 
  variant = "government", 
  text, 
  className,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <SpinnerVariant size={size} variant={variant} />
          {text && (
            <p className={cn("mt-4 text-gray-600 font-medium", textSizeClasses[size])}>
              {text}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center">
        <SpinnerVariant size={size} variant={variant} />
        {text && (
          <p className={cn("mt-2 text-gray-600", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}

function SpinnerVariant({ size, variant }: { size: string; variant: string }) {
  const sizeClasses: Record<string, string> = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  }

  const className = sizeClasses[size] || sizeClasses.md

  switch (variant) {
    case "government":
      return <GovernmentSpinner className={className} />
    case "tribal":
      return <TribalSpinner className={className} />
    case "ai":
      return <AISpinner className={className} />
    case "minimal":
      return <MinimalSpinner className={className} />
    default:
      return <DefaultSpinner className={className} />
  }
}

function DefaultSpinner({ className }: { className: string }) {
  return (
    <div className={cn("animate-spin rounded-full border-2 border-gray-200", className)}>
      <div className="absolute inset-0 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
    </div>
  )
}

function GovernmentSpinner({ className }: { className: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Outer ring - Saffron */}
      <div className="absolute inset-0 rounded-full border-2 border-orange-200">
        <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" 
             style={{ animationDuration: "1.5s" }} />
      </div>
      
      {/* Middle ring - White */}
      <div className="absolute inset-1 rounded-full border-2 border-gray-100">
        <div className="absolute inset-0 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" 
             style={{ animationDuration: "1.2s", animationDirection: "reverse" }} />
      </div>
      
      {/* Inner ring - Green */}
      <div className="absolute inset-2 rounded-full border-2 border-green-200">
        <div className="absolute inset-0 rounded-full border-2 border-green-600 border-t-transparent animate-spin" 
             style={{ animationDuration: "1s" }} />
      </div>
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

function TribalSpinner({ className }: { className: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Earth pattern */}
      <div className="absolute inset-0 rounded-full border-2 border-amber-200">
        <div className="absolute inset-0 rounded-full border-2 border-amber-600 border-t-transparent animate-spin" 
             style={{ animationDuration: "2s" }} />
      </div>
      
      {/* Forest pattern */}
      <div className="absolute inset-1 rounded-full border-2 border-green-200">
        <div className="absolute inset-0 rounded-full border-2 border-green-700 border-r-transparent border-l-transparent animate-spin" 
             style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
      </div>
      
      {/* Water pattern */}
      <div className="absolute inset-2 rounded-full border-2 border-blue-200">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-b-transparent animate-spin" 
             style={{ animationDuration: "1.8s" }} />
      </div>
    </div>
  )
}

function AISpinner({ className }: { className: string }) {
  return (
    <div className={cn("relative", className)}>
      {/* Neural network pattern */}
      <div className="absolute inset-0">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-purple-300"
            style={{
              animation: `spin 2s linear infinite`,
              animationDelay: `${i * 0.2}s`,
              transform: `rotate(${i * 45}deg)`,
            }}
          >
            <div className="w-1 h-1 bg-purple-600 rounded-full" 
                 style={{ 
                   position: "absolute", 
                   top: "0", 
                   left: "50%", 
                   transform: "translateX(-50%)",
                   animation: `pulse 1s ease-in-out infinite`,
                   animationDelay: `${i * 0.15}s`
                 }} />
          </div>
        ))}
      </div>
      
      {/* Central processing core */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

function MinimalSpinner({ className }: { className: string }) {
  return (
    <div className={cn("animate-spin rounded-full border border-gray-300 border-t-blue-600", className)} />
  )
}

// Loading skeleton components
export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("loading-skeleton rounded animate-shimmer", className)} />
  )
}

export function LoadingCard() {
  return (
    <div className="p-6 border rounded-lg shadow-sm space-y-4">
      <div className="flex items-center space-x-4">
        <LoadingSkeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <LoadingSkeleton className="h-20 w-full" />
      <div className="space-y-2">
        <LoadingSkeleton className="h-3 w-full" />
        <LoadingSkeleton className="h-3 w-4/5" />
        <LoadingSkeleton className="h-3 w-3/5" />
      </div>
    </div>
  )
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-4" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <LoadingSkeleton key={j} className="h-3" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Loading states for specific components
export function LoadingDashboard() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <LoadingSkeleton className="h-8 w-1/3" />
        <LoadingSkeleton className="h-4 w-2/3" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 border rounded-lg">
            <LoadingSkeleton className="h-6 w-3/4 mb-4" />
            <LoadingSkeleton className="h-8 w-1/2 mb-2" />
            <LoadingSkeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg">
          <LoadingSkeleton className="h-6 w-1/2 mb-4" />
          <LoadingSkeleton className="h-40 w-full" />
        </div>
        <div className="p-6 border rounded-lg">
          <LoadingSkeleton className="h-6 w-1/2 mb-4" />
          <LoadingSkeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  )
}