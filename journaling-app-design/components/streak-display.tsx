"use client"

import { Flame } from "lucide-react"
import { useJournal } from "@/lib/journal-store"

export function StreakDisplay() {
  const { state } = useJournal()
  const streak = state.streak

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border">
      <Flame className={`h-4 w-4 ${streak > 0 ? "text-chart-2" : "text-muted-foreground"}`} />
      <span className={`text-sm font-bold tabular-nums ${streak > 0 ? "text-chart-2" : "text-muted-foreground"}`}>
        {streak}
      </span>
    </div>
  )
}
