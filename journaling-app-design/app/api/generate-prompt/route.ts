import { NextResponse } from "next/server"
import Dedalus from "dedalus-labs"

const client = new Dedalus({
  apiKey: process.env.DEDALUS_LABS_APIKEY,
})

interface EntryPayload {
  date: string
  prompt: string
  answer: string
  emotion: string | null
}

export async function POST(request: Request) {
  try {
    const { entries } = (await request.json()) as { entries: EntryPayload[] }

    if (!entries || entries.length < 7) {
      return NextResponse.json(
        { error: "Not enough entries for personalization" },
        { status: 400 }
      )
    }

    const last7 = entries.slice(0, 7)

    const entriesSummary = last7
      .map(
        (e) =>
          `Date: ${e.date}\nPrompt: ${e.prompt}\nAnswer: ${e.answer}\nMood: ${e.emotion || "not set"}`
      )
      .join("\n\n---\n\n")

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a thoughtful, empathetic journaling coach. Based on the user's recent journal entries, generate ONE personalized journal prompt that:
- References themes, emotions, or situations from their recent writing (without quoting them directly)
- Encourages deeper self-reflection or growth
- Feels warm and personal, not generic
- Is a single question, 1-2 sentences max
- Does NOT start with "What" every time — vary your question starters

Respond with ONLY the journal prompt question, nothing else.`,
        },
        {
          role: "user",
          content: `Here are my last 7 journal entries:\n\n${entriesSummary}`,
        },
      ],
    })

    const prompt = completion.choices[0]?.message?.content?.trim()

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt generated" },
        { status: 500 }
      )
    }

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error("Error generating prompt:", error)
    return NextResponse.json(
      { error: "Failed to generate prompt" },
      { status: 500 }
    )
  }
}
