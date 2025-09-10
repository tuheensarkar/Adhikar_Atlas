"use client"

import { useState, useEffect, createContext, useContext, ReactNode, useRef } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

type NotificationType = "success" | "error" | "warning" | "info"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  persistent?: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationCounterRef = useRef(0)

  const addNotification = (notification: Omit<Notification, "id">) => {
    // Use counter-based ID to avoid hydration mismatch
    notificationCounterRef.current += 1
    const id = `notification_${notificationCounterRef.current}`
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    if (!notification.persistent && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification, clearAll }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4 max-w-md">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onClose: () => void
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    return () => setIsVisible(false)
  }, [])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 300)
  }

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    const base = "glass border-l-4 shadow-lg"
    switch (notification.type) {
      case "success":
        return `${base} border-l-green-500 bg-green-50/90`
      case "error":
        return `${base} border-l-red-500 bg-red-50/90`
      case "warning":
        return `${base} border-l-yellow-500 bg-yellow-50/90`
      case "info":
        return `${base} border-l-blue-500 bg-blue-50/90`
    }
  }

  return (
    <div
      className={`
        ${getStyles()}
        p-4 rounded-lg transition-all duration-300 transform
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
        ${isLeaving ? "scale-95" : "scale-100"}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-700">
            {notification.message}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Convenience hooks for different notification types
export function useSuccessNotification() {
  const { addNotification } = useNotifications()
  return (title: string, message: string, duration?: number) =>
    addNotification({ type: "success", title, message, duration })
}

export function useErrorNotification() {
  const { addNotification } = useNotifications()
  return (title: string, message: string, persistent = false) =>
    addNotification({ type: "error", title, message, persistent })
}

export function useWarningNotification() {
  const { addNotification } = useNotifications()
  return (title: string, message: string, duration?: number) =>
    addNotification({ type: "warning", title, message, duration })
}

export function useInfoNotification() {
  const { addNotification } = useNotifications()
  return (title: string, message: string, duration?: number) =>
    addNotification({ type: "info", title, message, duration })
}

// Export the main NotificationSystem component for easy import
export const NotificationSystem = NotificationProvider