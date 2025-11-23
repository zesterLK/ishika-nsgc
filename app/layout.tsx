import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SME Compliance Tracker',
  description: 'Track and manage compliance requirements for Indian SMEs',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

