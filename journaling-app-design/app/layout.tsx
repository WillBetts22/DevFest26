import React from "react"
import type { Metadata, Viewport } from 'next'
import { Funnel_Display } from 'next/font/google'

import './globals.css'

const funnelDisplay = Funnel_Display({ subsets: ['latin'], variable: '--font-funnel-display' })

export const metadata: Metadata = {
  title: 'Mellow - Journal Your Way',
  description: 'A calm, reflective journaling app for self-growth and daily mindfulness.',
}

export const viewport: Viewport = {
  themeColor: '#131619',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("mellow-theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${funnelDisplay.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
