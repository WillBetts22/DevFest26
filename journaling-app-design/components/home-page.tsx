"use client"

import { useState } from "react"
import { DailyPrompt } from "@/components/daily-prompt"
import { EmotionPicker } from "@/components/emotion-picker"
import { QuickNotes } from "@/components/quick-notes"
import { VoiceMemo } from "@/components/voice-memo"
import { GrowthInsights } from "@/components/growth-insights"
import { JournalEditor } from "@/components/journal-editor"

export function HomePage() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return <JournalEditor onBack={() => setShowEditor(false)} />
  }

  return (
    <>
      <EmotionPicker />
      <DailyPrompt onOpenJournal={() => setShowEditor(true)} />
      <GrowthInsights />
      <QuickNotes />
      <VoiceMemo />
    </>
  )
}
