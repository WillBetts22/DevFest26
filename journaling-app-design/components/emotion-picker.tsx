"use client"

import { useEffect } from "react"
import Image from "next/image"
import { useJournal, EMOTIONS } from "@/lib/journal-store"

const LABELS: Record<string, string> = {
  happy: "Happy",
  mad: "Mad",
  sad: "Sad",
  sleepy: "Sleepy",
  smiley: "Good",
}

export function EmotionPicker() {
  const { todayEntry, getOrCreateTodayEntry, setEmotion } = useJournal()

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  return (
    <div className="flex items-center justify-center gap-2">
      {EMOTIONS.map((emotion) => (
        <button
          key={emotion}
          onClick={() => setEmotion(emotion)}
          className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all ${
            todayEntry?.emotion === emotion
              ? "bg-primary/15 ring-1 ring-primary/40"
              : "bg-secondary/60 hover:bg-secondary"
          }`}
          aria-label={`Feeling ${LABELS[emotion] || emotion}`}
        >
          <Image
            src={`/emojis/${emotion}.png`}
            alt={LABELS[emotion] || emotion}
            width={28}
            height={28}
            className="object-contain"
          />
          <span className="text-[10px] font-medium text-muted-foreground">
            {LABELS[emotion] || ""}
          </span>
        </button>
      ))}
    </div>
  )
}
