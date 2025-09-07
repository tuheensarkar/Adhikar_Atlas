"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

const stateData = [
  { state: "MP", filed: 45000, approved: 32000, pending: 5000, rejected: 8000, trend: "+12%" },
  { state: "Odisha", filed: 38000, approved: 28000, pending: 4000, rejected: 6000, trend: "+8%" },
  { state: "Telangana", filed: 25000, approved: 18000, pending: 3000, rejected: 4000, trend: "+15%" },
  { state: "Tripura", filed: 15000, approved: 8500, pending: 2500, rejected: 4000, trend: "+5%" },
]

const claimTypes = [
  { name: "Individual Forest Rights (IFR)", value: 65, color: "#22c55e" },
  { name: "Community Forest Rights (CFR)", value: 25, color: "#3b82f6" },
  { name: "Community Rights (CR)", value: 10, color: "#f59e0b" },
]

const monthlyTrends = [
  { month: "Jan", claims: 8500, approved: 6200 },
  { month: "Feb", claims: 9200, approved: 6800 },
  { month: "Mar", claims: 10100, approved: 7500 },
  { month: "Apr", claims: 11200, approved: 8200 },
  { month: "May", claims: 12800, approved: 9100 },
  { month: "Jun", claims: 13500, approved: 9800 },
]

export function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("6months")
  const [isLoading, setIsLoading] = useState(true)
  const [animateCards, setAnimateCards] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setAnimateCards(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Comprehensive insights into FRA implementation and scheme convergence across tribal communities
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-6 lg:mt-0">
          <Button variant="outline" size="sm" className="hover:bg-blue-50 transition-colors bg-transparent">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export PDF
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-xl border shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-semibold text-gray-700">Filters:</span>
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
          <option>All States</option>
          <option>Madhya Pradesh</option>
          <option>Odisha</option>
          <option>Telangana</option>
        </select>
        <select
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
          <option value="2years">Last 2 Years</option>
        </select>
        <Badge variant="secondary" className="ml-auto">
          Real-time Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total FRA Claims",
            value: "1,20,000",
            change: "+12%",
            icon: "📋",
            color: "blue",
            bgGradient: "from-blue-500 to-blue-600",
          },
          {
            title: "Approved Claims",
            value: "87,000",
            change: "+18%",
            icon: "✅",
            color: "green",
            bgGradient: "from-green-500 to-green-600",
          },
          {
            title: "Beneficiary Households",
            value: "95,000",
            change: "+15%",
            icon: "👥",
            color: "purple",
            bgGradient: "from-purple-500 to-purple-600",
          },
          {
            title: "Scheme Convergence",
            value: "68%",
            change: "+22%",
            icon: "🎯",
            color: "orange",
            bgGradient: "from-orange-500 to-orange-600",
          },
        ].map((metric, index) => (
          <Card
            key={index}
            className={`relative overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1 ${
              animateCards ? "animate-in slide-in-from-bottom-4" : ""
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  <div className="flex items-center">
                    <div className="flex items-center px-2 py-1 bg-green-100 rounded-full">
                      <svg
                        className="w-3 h-3 text-green-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      <span className="text-xs text-green-700 font-semibold">{metric.change}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">vs last period</span>
                  </div>
                </div>
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${metric.bgGradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}
                >
                  {metric.icon}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.bgGradient}`}></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <Card className="xl:col-span-2 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📊 FRA Claims Progress by State</CardTitle>
            <CardDescription>Filed vs Approved vs Rejected claims across major states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="state" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="approved" fill="#22c55e" name="Approved" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="rejected" fill="#ef4444" name="Rejected" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">🥧 Claim Types Distribution</CardTitle>
            <CardDescription>Breakdown by claim category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={claimTypes}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${value}%`}
                  >
                    {claimTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {claimTypes.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: type.color }}></div>
                    <span className="text-sm text-gray-700 font-medium">{type.name}</span>
                  </div>
                  <Badge variant="secondary">{type.value}%</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">📈 Monthly Processing Trends</CardTitle>
          <CardDescription>Claims filed and approved over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="claims"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Claims Filed"
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                  name="Claims Approved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🗺️ State-wise Progress Details</CardTitle>
          <CardDescription>Detailed breakdown of FRA implementation across states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {stateData.map((state, index) => {
              const approvalRate = Math.round((state.approved / state.filed) * 100)
              return (
                <div
                  key={index}
                  className="group p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <h3 className="text-xl font-bold text-gray-900">{state.state}</h3>
                      <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                        {state.trend} growth
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={approvalRate >= 70 ? "default" : approvalRate >= 50 ? "secondary" : "destructive"}
                        className="text-sm px-3 py-1"
                      >
                        {approvalRate}% Approval Rate
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    {[
                      { label: "Filed", value: state.filed, color: "text-blue-600", bg: "bg-blue-50" },
                      { label: "Approved", value: state.approved, color: "text-green-600", bg: "bg-green-50" },
                      { label: "Pending", value: state.pending, color: "text-orange-600", bg: "bg-orange-50" },
                      { label: "Rejected", value: state.rejected, color: "text-red-600", bg: "bg-red-50" },
                    ].map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg ${item.bg} transition-transform group-hover:scale-105`}>
                        <p className="text-sm font-medium text-gray-600 mb-1">{item.label}</p>
                        <p className={`text-2xl font-bold ${item.color}`}>{item.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold">{approvalRate}%</span>
                    </div>
                    <Progress value={approvalRate} className="h-3" />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
