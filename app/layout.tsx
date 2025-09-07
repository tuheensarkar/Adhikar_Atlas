import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientLayout } from "./ClientLayout"

export const metadata: Metadata = {
  title: "FRA Atlas & DSS - Ministry of Tribal Affairs",
  description: "AI-powered Forest Rights Act Atlas & WebGIS Decision Support System",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientLayout>{children}</ClientLayout>
}
