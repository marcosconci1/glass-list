import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AppTooltipProvider } from "@/components/tooltip-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pomodoro Habit Tracker",
  description: "Immersive Pomodoro timer with visual habit tracking",
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
            __html: `
              (function() {
                const theme = localStorage.getItem('app-theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans">
        <AppTooltipProvider>{children}</AppTooltipProvider>
        <Analytics />
      </body>
    </html>
  )
}
