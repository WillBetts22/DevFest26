import { supabase } from "./supabase"
import type { JournalEntry } from "./journal-store"

// --- Row ↔ Entry mapping ---

interface DbRow {
  id: string
  user_id: string
  date: string
  prompt: string
  ai_prompt_generated: boolean
  answer: string
  emotion: string | null
  quick_notes: JournalEntry["quickNotes"]
  voice_memos: JournalEntry["voiceMemos"]
  stickies: JournalEntry["stickies"]
  created_at: string
  updated_at: string
}

function rowToEntry(row: DbRow): JournalEntry {
  return {
    id: row.id,
    date: row.date,
    prompt: row.prompt,
    aiPromptGenerated: row.ai_prompt_generated,
    answer: row.answer,
    emotion: row.emotion,
    quickNotes: row.quick_notes ?? [],
    voiceMemos: row.voice_memos ?? [],
    stickies: row.stickies ?? [],
    createdAt: new Date(row.created_at).getTime(),
  }
}

function entryToRow(userId: string, entry: JournalEntry) {
  return {
    user_id: userId,
    date: entry.date,
    prompt: entry.prompt,
    ai_prompt_generated: entry.aiPromptGenerated ?? false,
    answer: entry.answer,
    emotion: entry.emotion,
    quick_notes: entry.quickNotes,
    voice_memos: entry.voiceMemos,
    stickies: entry.stickies,
    created_at: new Date(entry.createdAt).toISOString(),
  }
}

// --- CRUD ---

export async function fetchAllEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("fetchAllEntries error:", error)
    return []
  }

  return (data as DbRow[]).map(rowToEntry)
}

export async function upsertEntry(userId: string, entry: JournalEntry): Promise<void> {
  const row = entryToRow(userId, entry)
  const { error } = await supabase
    .from("journal_entries")
    .upsert(row, { onConflict: "user_id,date" })

  if (error) {
    console.error("upsertEntry error:", error)
  }
}

export async function upsertManyEntries(userId: string, entries: JournalEntry[]): Promise<void> {
  if (entries.length === 0) return
  const rows = entries.map((e) => entryToRow(userId, e))
  const { error } = await supabase
    .from("journal_entries")
    .upsert(rows, { onConflict: "user_id,date" })

  if (error) {
    console.error("upsertManyEntries error:", error)
  }
}

// --- Streak ---

export async function fetchStreak(userId: string): Promise<{ streak: number; lastEntryDate: string | null }> {
  const { data, error } = await supabase
    .from("user_streaks")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error || !data) {
    return { streak: 0, lastEntryDate: null }
  }

  return {
    streak: data.streak ?? 0,
    lastEntryDate: data.last_entry_date ?? null,
  }
}

export async function upsertStreak(userId: string, streak: number, lastEntryDate: string | null): Promise<void> {
  const { error } = await supabase
    .from("user_streaks")
    .upsert({
      user_id: userId,
      streak,
      last_entry_date: lastEntryDate,
    })

  if (error) {
    console.error("upsertStreak error:", error)
  }
}
