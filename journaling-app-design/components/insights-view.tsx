"use client"

import React from "react"
import { useMemo } from "react"
import { TrendingUp, TrendingDown, Calendar, Flame, Award, Heart } from "lucide-react"
import { useJournal } from "@/lib/journal-store"

interface InsightCard {
  title: string
  value: string
  icon: React.ElementType
  color: string
  bgColor: string
}

export function InsightsView() {
  const { state, allEntries } = useJournal()

  const insights = useMemo(() => {
    const entries = allEntries
    const totalEntries = entries.length
    const totalWords = entries.reduce(
      (acc, e) => acc + (e.answer?.split(/\s+/).filter(Boolean).length || 0),
      0,
    )
    const totalNotes = entries.reduce((acc, e) => acc + e.quickNotes.length, 0)

    const emotionCounts: Record<string, number> = {}
    for (const e of entries) {
      if (e.emotion) {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1
      }
    }
    const topEmotion = Object.entries(emotionCounts).sort(([, a], [, b]) => b - a)[0]

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisWeekEntries = entries.filter((e) => new Date(e.date + "T12:00:00") >= weekAgo)

    const wordMap: Record<string, number> = {}
    const skipWords = new Set([
      "the", "a", "an", "is", "was", "are", "were", "i", "my", "me", "to",
      "and", "of", "in", "it", "for", "on", "with", "that", "this", "but",
      "not", "have", "had", "has", "been", "be", "do", "did", "will",
      "would", "could", "should", "am", "about", "just", "really", "very",
      "like", "from", "they", "them", "what", "when", "how", "all",
    ])
    for (const e of entries) {
      if (e.answer) {
        for (const word of e.answer.toLowerCase().split(/\s+/)) {
          const cleaned = word.replace(/[^a-z]/g, "")
          if (cleaned.length > 2 && !skipWords.has(cleaned)) {
            wordMap[cleaned] = (wordMap[cleaned] || 0) + 1
          }
        }
      }
    }
    const topWords = Object.entries(wordMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return {
      totalEntries,
      totalWords,
      totalNotes,
      topEmotion,
      thisWeekEntries: thisWeekEntries.length,
      topWords,
      streak: state.streak,
    }
  }, [allEntries, state.streak])

  const cards: InsightCard[] = [
    {
      title: "Streak",
      value: `${insights.streak}d`,
      icon: Flame,
      color: "text-chart-2",
      bgColor: "bg-chart-2/15",
    },
    {
      title: "Entries",
      value: `${insights.totalEntries}`,
      icon: Calendar,
      color: "text-primary",
      bgColor: "bg-primary/15",
    },
    {
      title: "Words",
      value: insights.totalWords.toLocaleString(),
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/15",
    },
    {
      title: "This Week",
      value: `${insights.thisWeekEntries}`,
      icon: Award,
      color: "text-chart-4",
      bgColor: "bg-chart-4/15",
    },
  ]

  const wrappedCards = useMemo(() => {
    const items: { text: string; detail: string; icon: React.ElementType }[] = []

    if (insights.topEmotion) {
      items.push({
        text: `Your most frequent mood is ${insights.topEmotion[0]}`,
        detail: `Logged ${insights.topEmotion[1]} times`,
        icon: Heart,
      })
    }

    if (insights.topWords.length > 0) {
      items.push({
        text: `You write about "${insights.topWords[0][0]}" the most`,
        detail: `Mentioned ${insights.topWords[0][1]} times`,
        icon: TrendingUp,
      })
    }

    if (insights.totalWords > 100) {
      items.push({
        text: `${insights.totalWords.toLocaleString()} words written`,
        detail: `~${Math.ceil(insights.totalWords / 250)} pages of reflection`,
        icon: Award,
      })
    }

    if (insights.totalNotes > 0) {
      items.push({
        text: `${insights.totalNotes} shower thoughts captured`,
        detail: "Those fleeting ideas are safe",
        icon: TrendingDown,
      })
    }

    return items
  }, [insights])

  const oneYearAgo = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 1)
    const dateStr = d.toISOString().split("T")[0]
    return state.entries[dateStr] || null
  }, [state.entries])

  return (
    <div className="flex flex-col gap-4">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl bg-card border border-border p-3 flex flex-col items-center gap-2"
          >
            <div className={`h-8 w-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="text-lg font-bold text-foreground">{card.value}</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Wrapped cards */}
      {wrappedCards.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground px-1">
            Your Reflection Summary
          </h3>
          {wrappedCards.map((card, i) => (
            <div
              key={`wrapped-${i}`}
              className="rounded-2xl bg-card border border-border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                    <card.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-sm font-bold text-foreground leading-snug">
                      {card.text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{card.detail}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Last year */}
      {oneYearAgo && (
        <div className="rounded-2xl bg-card border border-border p-4">
          <h3 className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            This Time Last Year
          </h3>
          <div className="rounded-xl bg-secondary/50 p-3">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {oneYearAgo.prompt}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {oneYearAgo.answer || "No entry written."}
            </p>
          </div>
        </div>
      )}

      {/* Top themes */}
      {insights.topWords.length > 0 && (
        <div className="rounded-2xl bg-card border border-border p-4">
          <h3 className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">
            Your Top Themes
          </h3>
          <div className="flex flex-col gap-2.5">
            {insights.topWords.map(([word, count]) => (
              <div key={word} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground capitalize">
                      {word}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">{count}x</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary/70 transition-all"
                      style={{
                        width: `${(count / insights.topWords[0][1]) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty */}
      {allEntries.length === 0 && (
        <div className="rounded-2xl bg-card border border-border p-8 flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-serif text-base font-bold text-foreground">No insights yet</h3>
          <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">
            Start journaling to unlock personalized insights about your journey.
          </p>
        </div>
      )}
    </div>
  )
}
