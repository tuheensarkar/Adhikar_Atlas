"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { TreePine, Brain, MapPin, Shield, CheckCircle, Eye, EyeOff, Lock, User, Building2 } from "lucide-react"

interface LoginProps {
  onLogin: () => void
  isLoading: boolean
}

export function Login({ onLogin, isLoading }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "admin@fra.gov.in",
    password: "password123",
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { email?: string; password?: string } = {}

    if (!credentials.email || !credentials.email.includes("@")) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!credentials.password || credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onLogin()
    }
  }

  const handleDemoLogin = () => {
    setCredentials({
      email: "admin@fra.gov.in",
      password: "password123",
    })
    setErrors({})
    setTimeout(onLogin, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white animate-pulse" />
          </div>
          <LoadingSpinner size="lg" text="Authenticating with Government Systems..." />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Government branding and information */}
        <div className="space-y-8 animate-slide-up">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <TreePine className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">FRA Atlas & DSS</h1>
                <p className="text-lg text-gray-600 font-medium">Ministry of Tribal Affairs</p>
                <p className="text-sm text-gray-500">Government of India</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge className="bg-orange-500 text-white px-3 py-1">Smart India Hackathon 2025</Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-600 px-3 py-1">
                Problem Statement 25108
              </Badge>
              <Badge variant="outline" className="text-green-600 border-green-600 px-3 py-1">
                AI-Powered
              </Badge>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transforming <span className="text-blue-600">Tribal Welfare</span> with Technology
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Digitizing Forest Rights Act claims with AI technology, satellite imagery analysis, and intelligent
              government scheme convergence for tribal communities across India.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                <Brain className="h-8 w-8 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">AI Document Processing</h4>
                  <p className="text-sm text-gray-600">94.5% accuracy in OCR/NER extraction</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                <MapPin className="h-8 w-8 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">WebGIS Integration</h4>
                  <p className="text-sm text-gray-600">Real-time satellite imagery analysis</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white">Impact Statistics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">95,000+</div>
                <div className="text-sm text-white/90">Families Benefited</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">₹450Cr</div>
                <div className="text-sm text-white/90">Scheme Benefits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">94.5%</div>
                <div className="text-sm text-white/90">AI Accuracy</div>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-sm font-medium text-gray-700 mb-3">Currently Active in:</p>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Madhya Pradesh
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Odisha
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Telangana
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Tripura
              </Badge>
            </div>
          </div>
        </div>

        {/* Right side - Secure login form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 animate-scale-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Access Portal</h2>
              <p className="text-gray-600">Government Official Login</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Official Email ID
                </label>
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => {
                    setCredentials((prev) => ({ ...prev, email: e.target.value }))
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="admin@fra.gov.in"
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="h-4 w-4 inline mr-1" />
                  Secure Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={(e) => {
                      setCredentials((prev) => ({ ...prev, password: e.target.value }))
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    placeholder="••••••••••"
                    className={`w-full pr-10 ${errors.password ? "border-red-500" : ""}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Access Level
                </label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="radio"
                    id="admin"
                    name="role"
                    value="admin"
                    defaultChecked
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="admin" className="text-sm font-medium text-gray-700">
                    System Administrator
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium"
                size="lg"
              >
                <Shield className="w-4 h-4 mr-2" />
                Access FRA Atlas System
              </Button>
            </form>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Demo Access Available</span>
              </div>
              <div className="text-xs text-green-700 space-y-1 mb-3">
                <div>
                  <strong>Email:</strong> admin@fra.gov.in
                </div>
                <div>
                  <strong>Password:</strong> password123
                </div>
                <div>
                  <strong>Role:</strong> System Administrator
                </div>
              </div>
              <Button
                onClick={handleDemoLogin}
                variant="outline"
                size="sm"
                className="w-full border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
              >
                Use Demo Credentials
              </Button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-2">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Secured by Government of India</span>
              </div>
              <p className="text-xs text-gray-400">
                All communications encrypted • GDPR Compliant • ISO 27001 Certified
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
