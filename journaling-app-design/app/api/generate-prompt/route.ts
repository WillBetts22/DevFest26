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
          content: `You are a close friend who also happens to be a great listener. You've been reading this person's journal and you want to ask them something that shows you've been paying attention to the specific details of their life.

Your job is to generate ONE journal prompt that:
- Directly references SPECIFIC people, events, places, or situations they mentioned (use names, places, details — e.g. "How's it going with Marcus?" or "Did that climbing session help clear your head?")
- Feels like a friend checking in, not a therapist or coach
- Is casual and warm — like a text from someone who cares
- Follows up on something unresolved or asks them to go deeper on something they mentioned
- Is 1-2 sentences max

Examples of the tone and specificity you're going for:
- "How did that conversation with your mom end up going — did you actually call her this weekend?"
- "You mentioned the imposter syndrome at Stripe is getting quieter — what changed?"
- "That V5 you sent at the climbing gym sounds sick — has climbing been helping with the stress from work?"
- "You and Sam talked about moving in together — have you made a decision yet?"

DO NOT be generic. DO NOT say things like "How are you feeling about your relationships?" — instead say "How are things with Sam after that apartment argument?"

Respond with ONLY the journal prompt, nothing else.`,
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
