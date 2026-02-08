"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Plus, X, ImageIcon, Pencil } from "lucide-react"
import { useJournal, STICKY_COLORS_DARK, STICKY_COLORS_LIGHT } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"
import type { Sticky } from "@/lib/journal-store"

function StickyNote({
  sticky,
  onUpdate,
  onRemove,
}: {
  sticky: Sticky
  onUpdate: (updates: Partial<Sticky>) => void
  onRemove: () => void
}) {
  const [isEditing, setIsEditing] = useState(!sticky.content && !sticky.mediaUrl)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleImageUpload = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*,video/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const url = URL.createObjectURL(file)
        const type = file.type.startsWith("video") ? "video" : "image"
        onUpdate({ mediaUrl: url, mediaType: type as "image" | "video" })
      }
    }
    input.click()
  }

  return (
    <div
      className="rounded-xl p-3 min-h-[100px] relative group flex flex-col gap-2 border border-border/40"
      style={{ backgroundColor: sticky.color }}
    >
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20"
          aria-label="Edit"
        >
          <Pencil className="h-3 w-3 text-foreground/60" />
        </button>
        <button
          onClick={handleImageUpload}
          className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20"
          aria-label="Add media"
        >
          <ImageIcon className="h-3 w-3 text-foreground/60" />
        </button>
        <button
          onClick={onRemove}
          className="h-6 w-6 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20"
          aria-label="Remove"
        >
          <X className="h-3 w-3 text-foreground/60" />
        </button>
      </div>

      {sticky.mediaUrl && (
        <div className="rounded-lg overflow-hidden">
          {sticky.mediaType === "video" ? (
            <video
              src={sticky.mediaUrl}
              className="w-full h-20 object-cover rounded-lg"
              controls
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sticky.mediaUrl || "/placeholder.svg"}
              alt="Sticky media"
              className="w-full h-20 object-cover rounded-lg"
            />
          )}
        </div>
      )}

      {isEditing ? (
        <textarea
          ref={textareaRef}
          value={sticky.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onBlur={() => setIsEditing(false)}
          placeholder="Write anything..."
          className="w-full bg-transparent border-0 resize-none text-sm text-foreground/80 placeholder:text-foreground/30 focus:outline-none leading-relaxed min-h-[50px]"
        />
      ) : (
        <p
          className="text-sm text-foreground/80 leading-relaxed cursor-pointer min-h-[30px]"
          onClick={() => setIsEditing(true)}
        >
          {sticky.content || "Tap to write..."}
        </p>
      )}
    </div>
  )
}

interface JournalEditorProps {
  onBack: () => void
}

export function JournalEditor({ onBack }: JournalEditorProps) {
  const {
    todayEntry,
    getOrCreateTodayEntry,
    updateAnswer,
    saveEntry,
    addSticky,
    updateSticky,
    removeSticky,
  } = useJournal()
  const getThemeStickyColor = () => {
    const isLight = document.documentElement.classList.contains("light")
    const colors = isLight ? STICKY_COLORS_LIGHT : STICKY_COLORS_DARK
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const [localAnswer, setLocalAnswer] = useState("")
  const [saved, setSaved] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  useEffect(() => {
    if (todayEntry?.answer) {
      setLocalAnswer(todayEntry.answer)
    }
  }, [todayEntry?.answer])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleSave = () => {
    updateAnswer(localAnswer)
    saveEntry()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!todayEntry) return null

  const stickies = todayEntry.stickies || []

  return (
    <div className="absolute inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full"
          onClick={onBack}
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
          Journal
        </span>
        <Button
          onClick={handleSave}
          disabled={!localAnswer.trim()}
          size="sm"
          className="rounded-full gap-1.5 px-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          {saved ? "Saved" : "Save"}
          <Send className="h-3.5 w-3.5" />
        </Button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {/* Prompt */}
        <div>
          <p className="font-serif text-xl font-bold leading-snug text-foreground mb-1">
            {todayEntry.prompt}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Main text area */}
        <textarea
          ref={textareaRef}
          value={localAnswer}
          onChange={(e) => setLocalAnswer(e.target.value)}
          placeholder="Start writing your thoughts..."
          className="w-full min-h-[200px] resize-none bg-transparent border-0 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed"
        />

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Stickies section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              Stickies
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
              onClick={() => addSticky({ color: getThemeStickyColor() })}
              aria-label="Add sticky"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {stickies.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {stickies.map((sticky) => (
                <StickyNote
                  key={sticky.id}
                  sticky={sticky}
                  onUpdate={(updates) => updateSticky(sticky.id, updates)}
                  onRemove={() => removeSticky(sticky.id)}
                />
              ))}
            </div>
          ) : (
            <button
              onClick={() => addSticky({ color: getThemeStickyColor() })}
              className="w-full rounded-xl border border-dashed border-border/60 py-6 flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-xs">Add a sticky note with text, images, or video</span>
            </button>
          )}
        </div>

        {/* Character count */}
        <p className="text-xs text-muted-foreground/60 text-right">
          {localAnswer.length > 0 ? `${localAnswer.split(/\s+/).filter(Boolean).length} words` : ""}
        </p>
      </div>
    </div>
  )
}
