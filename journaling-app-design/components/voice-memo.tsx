"use client"

import { useEffect, useRef, useState } from "react"
import { Mic, Square } from "lucide-react"
import { useJournal, getCurrentUserId } from "@/lib/journal-store"
import { Button } from "@/components/ui/button"
import { uploadVoiceMemo } from "@/lib/voice-memo-storage"
import { VoiceMemoList } from "@/components/voice-memo-list"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

type RecorderStatus = "idle" | "requesting" | "recording"

export function VoiceMemo() {
  const { todayEntry, getOrCreateTodayEntry, addVoiceMemo, updateVoiceMemoUrl } = useJournal()

  const [status, setStatus] = useState<RecorderStatus>("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const recordingTimeRef = useRef(0)

  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  useEffect(() => {
    getOrCreateTodayEntry()
  }, [getOrCreateTodayEntry])

  // Cleanup if component unmounts while recording
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop()
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const isRecording = status === "recording"
  const memos = todayEntry?.voiceMemos || []

  const startRecording = async () => {
    if (status !== "idle") return

    setStatus("requesting")
    setRecordingTime(0)
    chunksRef.current = []

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream)
      recorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstart = () => {
        setStatus("recording")
        recordingTimeRef.current = 0
        intervalRef.current = setInterval(() => {
          recordingTimeRef.current += 1
          setRecordingTime(recordingTimeRef.current)
        }, 1000)
      }

      recorder.onstop = async () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop())
          streamRef.current = null
        }

        const mimeType = recorder.mimeType || "audio/webm"
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const duration = recordingTimeRef.current

        chunksRef.current = []
        recorderRef.current = null
        setRecordingTime(0)
        setStatus("idle")

        if (duration > 0 && blob.size > 0) {
          // Save immediately with blob URL so it shows up right away
          const blobUrl = URL.createObjectURL(blob)
          const memoId = addVoiceMemo({ duration, url: blobUrl, mimeType })

          // Try uploading to Supabase in the background
          if (memoId) {
            uploadVoiceMemo(blob, mimeType, getCurrentUserId() ?? undefined)
              .then((supabaseUrl) => {
                updateVoiceMemoUrl(memoId, supabaseUrl)
                URL.revokeObjectURL(blobUrl)
              })
              .catch((err) => {
                console.warn("Supabase upload failed, using local blob URL:", err)
              })
          }
        }
      }

      recorder.start()
    } catch (err) {
      console.error(err)
      setStatus("idle")
      setRecordingTime(0)
    }
  }

  const stopRecording = () => {
    if (!recorderRef.current) return
    if (recorderRef.current.state === "inactive") return
    recorderRef.current.stop()
    setStatus("idle")
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center ${
              isRecording ? "bg-destructive/20" : "bg-primary/15"
            }`}
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
          disabled={status === "requesting"}
          className="w-full flex items-center gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Mic className="h-4 w-4" />
          <span>{status === "requesting" ? "Requesting mic permission..." : "Tap to record a thought..."}</span>
        </button>
      )}

      {memos.length > 0 && (
        <div className="mt-3">
          <VoiceMemoList memos={memos} />
        </div>
      )}
    </div>
  )
}
