import { supabase } from "./supabase"

const BUCKET = "voice-memos"

/**
 * Upload an audio blob to Supabase Storage and return the public URL.
 */
export async function uploadVoiceMemo(blob: Blob, mimeType: string, userId?: string): Promise<string> {
  const ext = mimeType.includes("webm") ? "webm" : mimeType.includes("mp4") ? "mp4" : "ogg"
  const prefix = userId ? `${userId}/` : ""
  const fileName = `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, blob, {
      contentType: mimeType,
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload voice memo: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(fileName)

  return urlData.publicUrl
}
