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
      <body className={`${funnelDisplay.variable} font-sans antialiased bg-neutral-950 flex items-center justify-center min-h-screen`}>
        <div id="phone-frame" className="relative w-full max-w-[430px] h-screen max-h-[932px] overflow-hidden bg-background rounded-none sm:rounded-[2.5rem] sm:border sm:border-border sm:shadow-2xl">
          {children}
        </div>
      </body>
    </html>
  )
}
