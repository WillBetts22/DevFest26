"use client"
import { useSyncExternalStore, useCallback } from "react"




// Types
export interface JournalEntry {
  id: string
  date: string // YYYY-MM-DD
  prompt: string
  aiPromptGenerated?: boolean
  answer: string
  emotion: string | null
  quickNotes: string[]
  voiceMemos: { id: string; duration: number; timestamp: number; url: string; mimeType: string }[]
  stickies: Sticky[]
  createdAt: number
}

export interface Sticky {
  id: string
  content: string
  color: string
  x: number
  y: number
  mediaUrl?: string
  mediaType?: "image" | "video"
}

export interface JournalState {
  entries: Record<string, JournalEntry>
  streak: number
  lastEntryDate: string | null
}

// Prompts pool
const PROMPTS = [
  "What's stressing you out the most this week?",
  "Did you actually take care of yourself today or just survive?",
  "What's one thing you're procrastinating on and why?",
  "How are you feeling about your classes right now?",
  "What's something you did today that future you will thank you for?",
  "Who did you spend time with today and how did it make you feel?",
  "What would you do differently if you could redo today?",
  "Are you where you thought you'd be at this point in college?",
  "What's one thing you wish you could tell your professor?",
  "How are you managing your money this month — honestly?",
  "What's keeping you up at night lately?",
  "Did you compare yourself to someone today? What triggered it?",
  "What's a relationship in your life that needs attention?",
  "When's the last time you did something just because it was fun?",
  "What's one thing about college nobody warned you about?",
  "Are you chasing something because you want it or because you think you should?",
  "How did you handle pressure today?",
  "What's one boundary you need to start setting?",
  "What would you do this semester if you weren't afraid of failing?",
  "How's your mental health — like, really?",
]

const EMOTIONS = ["happy", "mad", "sad", "stressed", "smiley"]

const STICKY_COLORS_DARK = [
  "hsl(210, 3%, 25%)",
  "hsl(160, 12%, 23%)",
  "hsl(38, 12%, 23%)",
  "hsl(210, 5%, 27%)",
  "hsl(280, 8%, 25%)",
]

const STICKY_COLORS_LIGHT = [
  "hsl(35, 30%, 85%)",
  "hsl(160, 25%, 85%)",
  "hsl(38, 35%, 85%)",
  "hsl(210, 20%, 87%)",
  "hsl(280, 20%, 88%)",
]

const STICKY_COLORS = STICKY_COLORS_DARK

// Bump this version to force a prompt/data reset when content changes
const STORE_VERSION = 2

// Helper
function getToday(): string {
  return new Date().toISOString().split("T")[0]
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// ──────────────────────────────────────────────
// Store state
// ──────────────────────────────────────────────

let state: JournalState = {
  entries: {},
  streak: 0,
  lastEntryDate: null,
}

let listeners: Set<() => void> = new Set()



function emitChange() {
  // Notify React subscribers
  for (const listener of listeners) {
    listener()
  }

  // Cache to localStorage
  try {
    localStorage.setItem("mellow-journal", JSON.stringify(state))
  } catch {}

  
}



function loadState() {
  try {
    const storedVersion = localStorage.getItem("mellow-journal-version")
    if (storedVersion !== String(STORE_VERSION)) {
      localStorage.removeItem("mellow-journal")
      localStorage.setItem("mellow-journal-version", String(STORE_VERSION))
      return
    }
    const stored = localStorage.getItem("mellow-journal")
    if (stored) {
      state = JSON.parse(stored)
    }
  } catch {}
}

if (typeof window !== "undefined") {
  loadState()
}

// ──────────────────────────────────────────────
// External store API
// ──────────────────────────────────────────────

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): JournalState {
  return state
}

function getServerSnapshot(): JournalState {
  return { entries: {}, streak: 0, lastEntryDate: null }
}

// ──────────────────────────────────────────────
// Actions (unchanged API — all synchronous)
// ──────────────────────────────────────────────

function getOrCreateTodayEntry(): JournalEntry {
  const today = getToday()
  if (!state.entries[today]) {
    state = {
      ...state,
      entries: {
        ...state.entries,
        [today]: {
          id: generateId(),
          date: today,
          prompt: getRandomPrompt(),
          answer: "",
          emotion: null,
          quickNotes: [],
          voiceMemos: [],
          stickies: [],
          createdAt: Date.now(),
        },
      },
    }
    emitChange()
  }
  return state.entries[today]
}

function getRandomPrompt(): string {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
}

function refreshPrompt() {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  let newPrompt = getRandomPrompt()
  while (newPrompt === entry.prompt && PROMPTS.length > 1) {
    newPrompt = getRandomPrompt()
  }
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, prompt: newPrompt },
    },
  }
  emitChange()
}

function setPrompt(prompt: string, aiGenerated = false) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, prompt, aiPromptGenerated: aiGenerated },
    },
  }
  emitChange()
}

function updateAnswer(answer: string) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, answer },
    },
  }
  emitChange()
}

function setEmotion(emotion: string) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, emotion },
    },
  }
  updateStreak()
  emitChange()
}

function addQuickNote(note: string) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, quickNotes: [...entry.quickNotes, note] },
    },
  }
  emitChange()
}

function removeQuickNote(index: number) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  const notes = [...entry.quickNotes]
  notes.splice(index, 1)
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, quickNotes: notes },
    },
  }
  emitChange()
}

function addVoiceMemo(memo: { duration: number; url: string; mimeType: string }): string {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return ""
  const id = generateId()
  const newMemo = {
    id,
    duration: memo.duration,
    timestamp: Date.now(),
    url: memo.url,
    mimeType: memo.mimeType,
  }
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, voiceMemos: [...entry.voiceMemos, newMemo] },
    },
  }
  emitChange()
  return id
}

function updateVoiceMemoUrl(memoId: string, newUrl: string) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: {
        ...entry,
        voiceMemos: entry.voiceMemos.map((m) =>
          m.id === memoId ? { ...m, url: newUrl } : m
        ),
      },
    },
  }
  emitChange()
}

function addSticky(sticky?: Partial<Sticky>) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  const newSticky: Sticky = {
    id: generateId(),
    content: sticky?.content || "",
    color: sticky?.color || STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)],
    x: sticky?.x ?? Math.random() * 200,
    y: sticky?.y ?? Math.random() * 100,
    mediaUrl: sticky?.mediaUrl,
    mediaType: sticky?.mediaType,
  }
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, stickies: [...entry.stickies, newSticky] },
    },
  }
  emitChange()
}

function updateSticky(stickyId: string, updates: Partial<Sticky>) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: {
        ...entry,
        stickies: entry.stickies.map((s) =>
          s.id === stickyId ? { ...s, ...updates } : s
        ),
      },
    },
  }
  emitChange()
}

function removeSticky(stickyId: string) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: {
        ...entry,
        stickies: entry.stickies.filter((s) => s.id !== stickyId),
      },
    },
  }
  emitChange()
}

function updateStreak() {
  const today = getToday()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split("T")[0]

  if (state.lastEntryDate === today) return

  if (state.lastEntryDate === yesterdayStr) {
    state = { ...state, streak: state.streak + 1, lastEntryDate: today }
  } else if (state.lastEntryDate !== today) {
    state = { ...state, streak: 1, lastEntryDate: today }
  }
  
  emitChange()
}

function saveEntry() {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  if (entry.answer || entry.quickNotes.length > 0 || entry.stickies.length > 0) {
    updateStreak()
  }
}

function getRecentEntries(count: number): JournalEntry[] {
  const today = getToday()
  return Object.values(state.entries)
    .filter((e) => e.date !== today && e.answer?.trim())
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, count)
}

function seedData(seedState: JournalState) {
  state = seedState
  emitChange()

  
}

// Hook
export function useJournal() {
  const journalState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    state: journalState,
    today: getToday(),
    todayEntry: journalState.entries[getToday()] || null,
    getOrCreateTodayEntry,
    refreshPrompt,
    updateAnswer,
    setEmotion,
    addQuickNote,
    removeQuickNote,
    addVoiceMemo,
    updateVoiceMemoUrl,
    addSticky,
    updateSticky,
    removeSticky,
    saveEntry,
    allEntries: Object.values(journalState.entries).sort(
      (a, b) => b.createdAt - a.createdAt
    ),
    getEntryForDate: (date: string) => journalState.entries[date] || null,
    getRecentEntries,
    seedData,
    setPrompt,
  }
}

export { PROMPTS, EMOTIONS, STICKY_COLORS, STICKY_COLORS_DARK, STICKY_COLORS_LIGHT, getToday }
