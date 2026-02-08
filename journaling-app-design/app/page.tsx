"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { HomePage } from "@/components/home-page"
import { CalendarView } from "@/components/calendar-view"
import { InsightsView } from "@/components/insights-view"
import { StreakDisplay } from "@/components/streak-display"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/use-auth"
import { setUser } from "@/lib/journal-store"

export default function Page() {
  const { user, loading } = useAuth()
  const [activePage, setActivePage] = useState<"home" | "calendar" | "insights">("home")

  useEffect(() => {
    setUser(user?.id ?? null)
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const pageTitle = {
    home: "Today",
    calendar: "Calendar",
    insights: "Insights",
  }

  const now = new Date()
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening"

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-lg mx-auto px-4 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between pt-6 pb-4">
          <div>
            {activePage === "home" ? (
              <>
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{greeting}</p>
                <h1 className="font-serif text-xl font-bold text-foreground">
                  {now.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </h1>
              </>
            ) : (
              <h1 className="font-serif text-xl font-bold text-foreground">
                {pageTitle[activePage]}
              </h1>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <StreakDisplay />
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-4">
          {activePage === "home" && <HomePage />}
          {activePage === "calendar" && <CalendarView />}
          {activePage === "insights" && <InsightsView />}
        </div>
      </main>

      <BottomNav active={activePage} onNavigate={setActivePage} />
    </div>
  )
}
