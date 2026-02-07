"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Play, Pause } from "lucide-react"
import { useJournal } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function VoiceMemo() {
  const { todayEntry, getOrCreateTodayEntry, addVoiceMemo } = useJournal()
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [])

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    intervalRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1)
    }, 1000)
  }

  const stopRecording = () => {
    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (recordingTime > 0) {
      addVoiceMemo(recordingTime)
    }
    setRecordingTime(0)
  }

  const togglePlay = (memoId: string) => {
    setPlayingId(playingId === memoId ? null : memoId)
  }

  const memos = todayEntry?.voiceMemos || []

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center ${isRecording ? "bg-destructive/20" : "bg-primary/15"}`}
          >
            <Mic className={`h-3.5 w-3.5 ${isRecording ? "text-destructive" : "text-primary"}`} />
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
            Voice Memos
          </span>
        </div>
      </div>

      {isRecording ? (
        <div className="flex items-center gap-4 rounded-xl bg-destructive/10 px-4 py-3">
          <div className="h-3 w-3 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-semibold text-destructive tabular-nums flex-1">
            {formatTime(recordingTime)}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
            onClick={stopRecording}
            aria-label="Stop recording"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <button
          onClick={startRecording}
          className="w-full flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Mic className="h-4 w-4" />
          <span>Tap to record a thought...</span>
        </button>
      )}

      {memos.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          {memos.map((memo) => (
            <div
              key={memo.id}
              className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3 py-2.5"
            >
              <button
                onClick={() => togglePlay(memo.id)}
                className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shrink-0"
                aria-label={playingId === memo.id ? "Pause" : "Play"}
              >
                {playingId === memo.id ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5 ml-0.5" />
                )}
              </button>
              <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary/50 transition-all"
                  style={{ width: playingId === memo.id ? "60%" : "0%" }}
                />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatTime(memo.duration)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
