"use client"

import { useState } from "react"
import { Database } from "lucide-react"
import { DailyPrompt } from "@/components/daily-prompt"
import { EmotionPicker } from "@/components/emotion-picker"
import { QuickNotes } from "@/components/quick-notes"
import { VoiceMemo } from "@/components/voice-memo"
import { GrowthInsights } from "@/components/growth-insights"
import { JournalEditor } from "@/components/journal-editor"
import { Button } from "@/components/ui/button"
import { useJournal } from "@/lib/journal-store"
import { generateSeedData } from "@/lib/seed-entries"

export function HomePage() {
  const [showEditor, setShowEditor] = useState(false)
  const { allEntries, seedData } = useJournal()

  const handleSeed = () => {
    const seedState = generateSeedData()
    seedData(seedState)
    window.location.reload()
  }

  if (showEditor) {
    return <JournalEditor onBack={() => setShowEditor(false)} />
  }

  return (
    <>
      <EmotionPicker />
      <DailyPrompt onOpenJournal={() => setShowEditor(true)} />
      {allEntries.length < 7 && (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleSeed}
        >
          <Database className="h-4 w-4" />
          Load sample entries (for AI prompts)
        </Button>
      )}
      <GrowthInsights />
      <QuickNotes />
      <VoiceMemo />
    </>
  )
}
