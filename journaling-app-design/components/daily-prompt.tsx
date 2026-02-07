"use client"

import React from "react"

import { useEffect } from "react"
import { RefreshCw, ArrowRight } from "lucide-react"
import { useJournal } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"

interface DailyPromptProps {
  onOpenJournal: () => void
}

export function DailyPrompt({ onOpenJournal }: DailyPromptProps) {
  const { todayEntry, getOrCreateTodayEntry, refreshPrompt } = useJournal()

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation()
    refreshPrompt()
  }

  if (!todayEntry) return null

  const hasAnswer = !!todayEntry.answer?.trim()

  return (
    <button
      onClick={onOpenJournal}
      className="w-full rounded-2xl bg-card border border-border p-5 text-left transition-colors hover:border-primary/30 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          {"Today's Prompt"}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={handleRefresh}
          aria-label="Get new prompt"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>

      <p className="font-serif text-lg font-bold leading-snug text-foreground mb-3">
        {todayEntry.prompt}
      </p>

      <div className="flex items-center justify-between">
        {hasAnswer ? (
          <p className="text-sm text-muted-foreground truncate max-w-[75%]">
            {todayEntry.answer}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Tap to start writing...</p>
        )}
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </button>
  )
}
