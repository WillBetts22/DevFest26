"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Play, Pause, Mic } from "lucide-react"

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

interface VoiceMemoItem {
  id: string
  duration: number
  timestamp: number
  url: string
  mimeType: string
}

interface VoiceMemoListProps {
  memos: VoiceMemoItem[]
  showHeader?: boolean
}

export function VoiceMemoList({ memos, showHeader = false }: VoiceMemoListProps) {
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [playbackTime, setPlaybackTime] = useState(0)
  const [playbackDuration, setPlaybackDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const onTime = () => setPlaybackTime(audio.currentTime || 0)
    const onLoaded = () => setPlaybackDuration(audio.duration || 0)
    const onEnded = () => {
      setPlayingId(null)
      setPlaybackTime(0)
      setPlaybackDuration(0)
    }

    audio.addEventListener("timeupdate", onTime)
    audio.addEventListener("loadedmetadata", onLoaded)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", onTime)
      audio.removeEventListener("loadedmetadata", onLoaded)
      audio.removeEventListener("ended", onEnded)
    }
  }, [])

  const activeProgress = useMemo(() => {
    if (!playingId) return 0
    if (!playbackDuration || playbackDuration === 0) return 0
    return Math.min(1, playbackTime / playbackDuration)
  }, [playingId, playbackTime, playbackDuration])

  const togglePlay = async (memoId: string) => {
    const memo = memos.find((m) => m.id === memoId)
    const audio = audioRef.current
    if (!memo || !audio) return

    if (playingId === memoId) {
      audio.pause()
      setPlayingId(null)
      return
    }

    audio.pause()
    setPlaybackTime(0)
    setPlaybackDuration(0)

    audio.src = memo.url
    setPlayingId(memoId)

    try {
      await audio.play()
    } catch (e) {
      console.error(e)
      setPlayingId(null)
    }
  }

  if (memos.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      {showHeader && (
        <div className="flex items-center gap-2 mb-1">
          <Mic className="h-3.5 w-3.5 text-primary" />
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Voice Memos
          </p>
        </div>
      )}
      {memos.map((memo) => {
        const isThisPlaying = playingId === memo.id
        const width =
          isThisPlaying ? `${Math.round(activeProgress * 100)}%` : "0%"

        return (
          <div
            key={memo.id}
            className="flex items-center gap-3 rounded-xl bg-secondary/40 px-3 py-2.5"
          >
            <button
              onClick={() => togglePlay(memo.id)}
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shrink-0"
              aria-label={isThisPlaying ? "Pause" : "Play"}
            >
              {isThisPlaying ? (
                <Pause className="h-3.5 w-3.5" />
              ) : (
                <Play className="h-3.5 w-3.5 ml-0.5" />
              )}
            </button>

            <div className="flex-1 h-1 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary/50 transition-all"
                style={{ width }}
              />
            </div>

            <span className="text-xs text-muted-foreground tabular-nums">
              {formatTime(memo.duration)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
