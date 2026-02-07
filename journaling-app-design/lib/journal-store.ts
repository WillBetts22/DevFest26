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
  voiceMemos: { id: string; duration: number; timestamp: number }[]
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
  "What made you smile today?",
  "What's one thing you're grateful for right now?",
  "If today had a theme song, what would it be?",
  "What's something you learned about yourself recently?",
  "Describe your ideal tomorrow in 3 sentences.",
  "What's a fear you'd like to let go of?",
  "Who made a difference in your day?",
  "What would your future self thank you for today?",
  "What's one small win you can celebrate?",
  "If you could tell your younger self one thing, what would it be?",
  "What boundary do you need to set or honor?",
  "What's draining your energy right now?",
  "What does 'enough' look like for you today?",
  "What habit is silently shaping your life?",
  "When did you last feel truly present?",
  "What conversation do you keep avoiding?",
  "What would you do if you weren't afraid of judgment?",
  "What's a belief you've outgrown?",
  "How did you show up for yourself today?",
  "What's one thing you want to release before bed?",
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

// Helper
function getToday(): string {
  return new Date().toISOString().split("T")[0]
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

// Store
let state: JournalState = {
  entries: {},
  streak: 0,
  lastEntryDate: null,
}

let listeners: Set<() => void> = new Set()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
  // Persist to localStorage
  try {
    localStorage.setItem("mellow-journal", JSON.stringify(state))
  } catch {}
}

function loadState() {
  try {
    const stored = localStorage.getItem("mellow-journal")
    if (stored) {
      state = JSON.parse(stored)
    }
  } catch {}
}

// Initialize on first load
if (typeof window !== "undefined") {
  loadState()
}

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

// Actions
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

function addVoiceMemo(duration: number) {
  const today = getToday()
  const entry = state.entries[today]
  if (!entry) return
  const memo = { id: generateId(), duration, timestamp: Date.now() }
  state = {
    ...state,
    entries: {
      ...state.entries,
      [today]: { ...entry, voiceMemos: [...entry.voiceMemos, memo] },
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
