"use client"

import React from "react"

import { useMemo } from "react"
import { TrendingUp, Target, Zap } from "lucide-react"
import { useJournal } from "@/lib/journal-store"

interface Insight {
  icon: React.ElementType
  label: string
  suggestion: string
  color: string
}

const KEYWORD_INSIGHTS: Record<string, { label: string; suggestion: string }> = {
  stress: {
    label: "Stress detected",
    suggestion: "Try to identify one stressor you can delegate or drop this week.",
  },
  work: {
    label: "Work-heavy focus",
    suggestion: "Block 30 min of non-work time today. Protect your off-switch.",
  },
  tired: {
    label: "Low energy signals",
    suggestion: "Audit your sleep window. Even +20 min makes a measurable difference.",
  },
  anxious: {
    label: "Anxiety patterns",
    suggestion: "Write down 3 things within your control right now.",
  },
  anxiety: {
    label: "Anxiety patterns",
    suggestion: "Write down 3 things within your control right now.",
  },
  overwhelm: {
    label: "Feeling overwhelmed",
    suggestion: "Pick one task. Just one. Finish it before thinking about the rest.",
  },
  lonely: {
    label: "Connection needed",
    suggestion: "Reach out to one person today. Even a short text counts.",
  },
  money: {
    label: "Financial focus",
    suggestion: "Review one financial habit this week. Automate where possible.",
  },
  procrastinat: {
    label: "Procrastination noted",
    suggestion: "Use the 2-minute rule: if it takes less than 2 min, do it now.",
  },
  happy: {
    label: "Positive momentum",
    suggestion: "Double down on what's working. Capture what made today good.",
  },
  grateful: {
    label: "Gratitude practice",
    suggestion: "Keep this up. Gratitude compounds over time.",
  },
  angry: {
    label: "Frustration signals",
    suggestion: "Channel it. What boundary needs to be set?",
  },
  sleep: {
    label: "Sleep concerns",
    suggestion: "Screen off 30 min earlier tonight. Track the difference tomorrow.",
  },
  exercise: {
    label: "Fitness awareness",
    suggestion: "Consistency beats intensity. A 15-min walk still counts.",
  },
  health: {
    label: "Health on your mind",
    suggestion: "One small health win today: water, stretch, or a proper meal.",
  },
}

export function GrowthInsights() {
  const { allEntries, todayEntry } = useJournal()

  const insights = useMemo(() => {
    const result: Insight[] = []
    const icons = [Target, TrendingUp, Zap]

    // Analyze recent entries (last 7 days including today)
    const recentEntries = allEntries.slice(0, 7)
    const allText = recentEntries
      .map((e) => [e.answer, ...e.quickNotes].join(" "))
      .join(" ")
      .toLowerCase()

    // Also prioritize today's entry
    const todayText = todayEntry
      ? [todayEntry.answer, ...todayEntry.quickNotes].join(" ").toLowerCase()
      : ""

    const matched = new Set<string>()

    // Check today's text first (priority)
    for (const [keyword, data] of Object.entries(KEYWORD_INSIGHTS)) {
      if (todayText.includes(keyword) && !matched.has(data.label)) {
        matched.add(data.label)
        result.push({
          icon: icons[result.length % icons.length],
          label: data.label,
          suggestion: data.suggestion,
          color:
            result.length === 0
              ? "text-primary"
              : result.length === 1
                ? "text-chart-2"
                : "text-chart-3",
        })
      }
      if (result.length >= 3) break
    }

    // Then check all recent text
    if (result.length < 3) {
      for (const [keyword, data] of Object.entries(KEYWORD_INSIGHTS)) {
        if (allText.includes(keyword) && !matched.has(data.label)) {
          matched.add(data.label)
          result.push({
            icon: icons[result.length % icons.length],
            label: data.label,
            suggestion: data.suggestion,
            color:
              result.length === 0
                ? "text-primary"
                : result.length === 1
                  ? "text-chart-2"
                  : "text-chart-3",
          })
        }
        if (result.length >= 3) break
      }
    }

    // Fallback suggestions if no keywords matched
    if (result.length === 0) {
      result.push({
        icon: Target,
        label: "Start journaling",
        suggestion:
          "Answer today's prompt to unlock personalized growth insights.",
        color: "text-primary",
      })
    }

    return result
  }, [allEntries, todayEntry])

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-primary/15 flex items-center justify-center">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Growth Areas
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {insights.map((insight, i) => (
          <div
            key={`insight-${i}`}
            className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3"
          >
            <div className={`mt-0.5 shrink-0 ${insight.color}`}>
              <insight.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {insight.label}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                {insight.suggestion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
