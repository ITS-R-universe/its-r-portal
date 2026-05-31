import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ITS-R Universe — Digital Civilization',
  description: 'Civilization-scale digital infrastructure. One universe, limitless possibilities.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
