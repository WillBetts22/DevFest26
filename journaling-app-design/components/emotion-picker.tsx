"use client"

import { useEffect } from "react"
import { useJournal, EMOTIONS } from "@/lib/journal-store"

const LABELS: Record<string, string> = {
  "\u{1F60A}": "Good",
  "\u{1F624}": "Stressed",
  "\u{1F622}": "Down",
  "\u{1F914}": "Meh",
  "\u{1F60E}": "Great",
}

export function EmotionPicker() {
  const { todayEntry, getOrCreateTodayEntry, setEmotion } = useJournal()

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  return (
    <div className="flex items-center gap-2">
      {EMOTIONS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => setEmotion(emoji)}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
            todayEntry?.emotion === emoji
              ? "bg-primary/15 ring-1 ring-primary/40"
              : "bg-secondary/60 hover:bg-secondary"
          }`}
          aria-label={`Feeling ${LABELS[emoji] || emoji}`}
        >
          <span className="text-lg leading-none">{emoji}</span>
          <span className="text-[10px] font-medium text-muted-foreground">
            {LABELS[emoji] || ""}
          </span>
        </button>
      ))}
    </div>
  )
}
