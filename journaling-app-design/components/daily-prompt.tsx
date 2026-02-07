"use client"

import React from "react"

import { useEffect, useState } from "react"
import { RefreshCw, ArrowRight, Loader2 } from "lucide-react"
import { useJournal } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"

interface DailyPromptProps {
  onOpenJournal: () => void
}

async function fetchPersonalizedPrompt(
  entries: { date: string; prompt: string; answer: string; emotion: string | null }[]
): Promise<string | null> {
  const res = await fetch("/api/generate-prompt", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  })
  if (!res.ok) return null
  const data = await res.json()
  return data.prompt || null
}

export function DailyPrompt({ onOpenJournal }: DailyPromptProps) {
  const { todayEntry, getOrCreateTodayEntry, refreshPrompt, getRecentEntries, setPrompt } = useJournal()
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  // Generate AI prompt once when entry is created and hasn't been personalized yet
  useEffect(() => {
    if (!todayEntry || todayEntry.aiPromptGenerated) return

    const recentEntries = getRecentEntries(7)
    if (recentEntries.length < 7) return

    setIsLoadingAI(true)
    const mapped = recentEntries.map((e) => ({
      date: e.date,
      prompt: e.prompt,
      answer: e.answer,
      emotion: e.emotion,
    }))
    fetchPersonalizedPrompt(mapped)
      .then((prompt) => {
        if (prompt) {
          setPrompt(prompt, true)
        }
      })
      .catch((err) => console.error("AI prompt error:", err))
      .finally(() => setIsLoadingAI(false))
  }, [todayEntry?.aiPromptGenerated])

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const recentEntries = getRecentEntries(7)
    if (recentEntries.length >= 7) {
      setIsLoadingAI(true)
      try {
        const mapped = recentEntries.map((e) => ({
          date: e.date,
          prompt: e.prompt,
          answer: e.answer,
          emotion: e.emotion,
        }))
        const prompt = await fetchPersonalizedPrompt(mapped)
        if (prompt) {
          setPrompt(prompt, true)
        } else {
          refreshPrompt()
        }
      } catch {
        refreshPrompt()
      } finally {
        setIsLoadingAI(false)
      }
    } else {
      refreshPrompt()
    }
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
          disabled={isLoadingAI}
          aria-label="Get new prompt"
        >
          {isLoadingAI ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <RefreshCw className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>

      <p className="font-serif text-lg font-bold leading-snug text-foreground mb-3">
        {isLoadingAI ? "Thinking of something just for you..." : todayEntry.prompt}
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
