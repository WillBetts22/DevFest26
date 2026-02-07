"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { Lightbulb, Plus, X } from "lucide-react"
import { useJournal } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"

export function QuickNotes() {
  const { todayEntry, getOrCreateTodayEntry, addQuickNote, removeQuickNote } = useJournal()
  const [newNote, setNewNote] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isAdding])

  const handleAdd = () => {
    if (newNote.trim()) {
      addQuickNote(newNote.trim())
      setNewNote("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
    if (e.key === "Escape") {
      setIsAdding(false)
      setNewNote("")
    }
  }

  const notes = todayEntry?.quickNotes || []

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-chart-2/15 flex items-center justify-center">
            <Lightbulb className="h-3.5 w-3.5 text-chart-2" />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Shower Thoughts
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
          onClick={() => setIsAdding(true)}
          aria-label="Add quick note"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {notes.map((note, i) => (
          <div
            key={`note-${todayEntry?.date}-${i}`}
            className="flex items-start gap-2 group rounded-xl bg-secondary/50 px-3 py-2.5"
          >
            <span className="text-sm text-foreground leading-relaxed flex-1">{note}</span>
            <button
              onClick={() => removeQuickNote(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive mt-0.5 shrink-0"
              aria-label="Remove note"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {isAdding && (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!newNote.trim()) setIsAdding(false)
              }}
              placeholder="What's on your mind..."
              className="flex-1 rounded-xl bg-secondary/60 border-0 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full shrink-0"
              onClick={handleAdd}
              disabled={!newNote.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}

        {!isAdding && notes.length === 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors text-left py-2"
          >
            Tap to capture a fleeting thought...
          </button>
        )}
      </div>
    </div>
  )
}
