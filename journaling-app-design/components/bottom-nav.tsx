"use client"

import { Home, CalendarDays, Sparkles } from "lucide-react"

interface BottomNavProps {
  active: "home" | "calendar" | "insights"
  onNavigate: (page: "home" | "calendar" | "insights") => void
}

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  const items = [
    { id: "home" as const, label: "Today", icon: Home },
    { id: "calendar" as const, label: "Calendar", icon: CalendarDays },
    { id: "insights" as const, label: "Insights", icon: Sparkles },
  ]

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around py-2 px-4">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-5 rounded-xl transition-all ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5px]" : ""}`} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}
