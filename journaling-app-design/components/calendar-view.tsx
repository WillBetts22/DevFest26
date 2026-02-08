"use client"

import { useState, useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useJournal } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"
import { VoiceMemoList } from "@/components/voice-memo-list"

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function CalendarView() {
  const { state } = useJournal()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const monthData = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startPad = (firstDay.getDay() + 6) % 7
    const totalDays = lastDay.getDate()

    const days: (null | {
      date: number
      dateStr: string
      emotion: string | null
      hasEntry: boolean
    })[] = []

    for (let i = 0; i < startPad; i++) {
      days.push(null)
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      const entry = state.entries[dateStr]
      days.push({
        date: d,
        dateStr,
        emotion: entry?.emotion || null,
        hasEntry:
          !!entry &&
          (!!entry.answer || entry.quickNotes.length > 0 || entry.stickies.length > 0 || entry.voiceMemos.length > 0),
      })
    }

    return days
  }, [currentMonth, state.entries])

  const navigateMonth = (dir: number) => {
    setCurrentMonth((prev) => {
      const next = new Date(prev)
      next.setMonth(next.getMonth() + dir)
      return next
    })
  }

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  const todayStr = new Date().toISOString().split("T")[0]
  const selectedEntry = selectedDate ? state.entries[selectedDate] : null

  // Mood summary
  const moodSummary = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const e of Object.values(state.entries)) {
      const d = new Date(e.date + "T12:00:00")
      if (
        d.getMonth() === currentMonth.getMonth() &&
        d.getFullYear() === currentMonth.getFullYear() &&
        e.emotion
      ) {
        counts[e.emotion] = (counts[e.emotion] || 0) + 1
      }
    }
    return Object.entries(counts).sort(([, a], [, b]) => b - a)
  }, [state.entries, currentMonth])

  return (
    <div className="flex flex-col gap-4">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => navigateMonth(-1)}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-serif text-base font-bold text-foreground">{monthLabel}</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => navigateMonth(1)}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-[10px] font-semibold text-muted-foreground py-1 uppercase tracking-wide"
          >
            {d}
          </div>
        ))}

        {monthData.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const isToday = day.dateStr === todayStr
          const isSelected = day.dateStr === selectedDate

          return (
            <button
              key={day.dateStr}
              onClick={() =>
                setSelectedDate(day.dateStr === selectedDate ? null : day.dateStr)
              }
              className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all text-xs font-medium ${
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : isToday
                    ? "bg-primary/15 text-primary font-bold ring-1 ring-primary/30"
                    : day.hasEntry
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/50"
              }`}
            >
              {day.emotion ? (
                <span className="text-sm leading-none">{day.emotion}</span>
              ) : (
                <span className="leading-none">{day.date}</span>
              )}
              {day.hasEntry && !day.emotion && (
                <div className="h-1 w-1 rounded-full bg-primary/60" />
              )}
            </button>
          )
        })}
      </div>

      {/* Selected detail */}
      {selectedEntry && (
        <div className="rounded-2xl bg-card border border-border p-4 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-sm font-bold text-foreground">
              {new Date(selectedEntry.date + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            {selectedEntry.emotion && (
              <span className="text-xl">{selectedEntry.emotion}</span>
            )}
          </div>

          {selectedEntry.answer && (
            <div className="rounded-xl bg-secondary/50 p-3">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                {selectedEntry.prompt}
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {selectedEntry.answer}
              </p>
            </div>
          )}

          {selectedEntry.quickNotes.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Quick notes
              </p>
              {selectedEntry.quickNotes.map((note, j) => (
                <p
                  key={`cal-note-${j}`}
                  className="text-sm text-foreground/80 pl-2 border-l-2 border-primary/30"
                >
                  {note}
                </p>
              ))}
            </div>
          )}

          {selectedEntry.voiceMemos && selectedEntry.voiceMemos.length > 0 && (
            <VoiceMemoList memos={selectedEntry.voiceMemos} showHeader />
          )}

          {selectedEntry.stickies && selectedEntry.stickies.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Stickies
              </p>
              <div className="grid grid-cols-2 gap-2">
                {selectedEntry.stickies.map((sticky) => (
                  <div
                    key={sticky.id}
                    className="rounded-xl p-2.5 min-h-[80px] flex flex-col gap-1.5 border border-border/40"
                    style={{ backgroundColor: sticky.color }}
                  >
                    {sticky.mediaUrl && (
                      <div className="rounded-lg overflow-hidden">
                        {sticky.mediaType === "video" ? (
                          <video
                            src={sticky.mediaUrl}
                            className="w-full h-24 object-cover rounded-lg"
                            controls
                          />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={sticky.mediaUrl}
                            alt="Sticky media"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        )}
                      </div>
                    )}
                    {sticky.content && (
                      <p className="text-xs text-foreground/80 leading-relaxed">
                        {sticky.content}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedEntry.answer && selectedEntry.quickNotes.length === 0 && (!selectedEntry.voiceMemos || selectedEntry.voiceMemos.length === 0) && (!selectedEntry.stickies || selectedEntry.stickies.length === 0) && (
            <p className="text-sm text-muted-foreground">No entries for this day.</p>
          )}
        </div>
      )}

      {/* Mood summary */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
          {"This Month's Mood"}
        </p>
        <div className="flex flex-wrap gap-2">
          {moodSummary.map(([emoji, count]) => (
            <div
              key={emoji}
              className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5"
            >
              <span className="text-base">{emoji}</span>
              <span className="text-xs font-bold text-muted-foreground">{count}</span>
            </div>
          ))}
          {moodSummary.length === 0 && (
            <p className="text-sm text-muted-foreground">No mood data yet this month.</p>
          )}
        </div>
      </div>
    </div>
  )
}
