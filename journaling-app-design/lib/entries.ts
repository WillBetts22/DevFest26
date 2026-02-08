import { supabase } from "./supabase"

export async function getEntryForDate(
  userId: string,
  entryDate: string
) {
  return supabase
    .from("entries")

    .select("*")
    .eq("user_id", userId)
    .eq("entry_date", entryDate)
    .single()

 
}
export async function upsertEntry({
  userId,
  entryDate,
  emotion,
  content,
}: {
  userId: string
  entryDate: string
  emotion?: string
  content?: string
}) {
  return supabase
    .from("entries")

    .upsert({
      user_id: userId,
      entry_date: entryDate,
      emotion,
      content,
    })
}
