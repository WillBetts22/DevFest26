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

const SHOWER_THOUGHTS = [
  "Why do we press harder on the remote when we know the battery is low?",
  "If you replace every part of a ship, is it still the same ship?",
  "The person who invented the clock must have had a really hard time explaining what it did.",
  "Your future self is watching you right now through memories.",
  "Every book you've ever read is just a different combination of 26 letters.",
  "You've never seen your own face, only reflections and photos of it.",
  "At some point, your parents put you down and never picked you up again.",
  "We're all just walking each other home.",
  "The voice in your head has been with you your entire life and you've never heard it from the outside.",
  "Nothing is on fire — fire is on things.",
  "Somewhere in the world, someone is having the best day of their life right now.",
  "You are the universe experiencing itself.",
  "Every decision you've ever made has led you to reading this sentence right now.",
  "The first person to hear a parrot talk must have been absolutely terrified.",
  "Your stomach thinks all potatoes are mashed.",
  "We all have a favorite mug but no idea when we decided it was our favorite.",
  "Sand is called sand because it's between the sea and the land.",
  "If two mind readers read each other's minds, whose mind are they reading?",
  "The oldest photo of you is also the youngest photo of you.",
  "Accidentally liking someone's post while stalking their profile is the modern equivalent of stepping on a twig while sneaking through the woods.",
  "We cook bacon and bake cookies.",
  "Your bed is basically a shelf for your body when you're not using it.",
  "The word 'short' is longer than the word 'long'.",
  "If you clean a vacuum cleaner, you become the vacuum cleaner.",
  "There's no physical evidence that today is Wednesday. We all just have to trust that someone has been keeping count since the first one.",
  "Maybe plants are farming us — giving us oxygen until we decompose and they can consume us.",
  "The fact that we say 'heads up' when we actually want people to duck is pretty confusing.",
  "Running feels so much better when you're not being chased.",
  "The most unbelievable thing about movies is that everyone always finds parking right in front of the building.",
  "Technically, every mirror you buy is used.",
]

/** Weighted random pick — returns the index */
function weightedRandomIndex(weights: number[]): number {
  const total = weights.reduce((a, b) => a + b, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
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

    // Build a pool of topics from entries + shower thoughts, each with a weight
    interface Topic {
      type: "entry" | "shower_thought"
      text: string
      weight: number
    }

    // Count how many times a keyword / phrase appears across all entries
    // Entries that share overlapping words with other entries get higher weight
    const allAnswers = last7.map((e) => e.answer.toLowerCase())
    const entryTopics: Topic[] = last7.map((e, i) => {
      const words = new Set(
        allAnswers[i]
          .split(/\s+/)
          .filter((w) => w.length > 3)
      )
      // Weight = 1 (base) + number of OTHER entries that share significant words
      let mentions = 0
      for (let j = 0; j < allAnswers.length; j++) {
        if (j === i) continue
        const otherWords = allAnswers[j].split(/\s+/)
        const overlap = otherWords.filter((w) => words.has(w)).length
        if (overlap >= 2) mentions++
      }
      return {
        type: "entry" as const,
        text: `Date: ${e.date}\nPrompt: ${e.prompt}\nAnswer: ${e.answer}\nMood: ${e.emotion || "not set"}`,
        weight: 1 + mentions,
      }
    })

    // Add shower thoughts with base weight of 1
    const showerTopics: Topic[] = SHOWER_THOUGHTS.map((t) => ({
      type: "shower_thought" as const,
      text: t,
      weight: 1,
    }))

    const pool = [...entryTopics, ...showerTopics]
    const weights = pool.map((t) => t.weight)

    // Pick one random topic (weighted) to be the FOCUS of this prompt
    const pickedIndex = weightedRandomIndex(weights)
    const picked = pool[pickedIndex]

    const entriesSummary = last7
      .map(
        (e) =>
          `Date: ${e.date}\nPrompt: ${e.prompt}\nAnswer: ${e.answer}\nMood: ${e.emotion || "not set"}`
      )
      .join("\n\n---\n\n")

    const focusInstruction =
      picked.type === "entry"
        ? `\n\n🎯 FOR THIS PROMPT, specifically reference or riff on this particular entry:\n\n${picked.text}`
        : `\n\n🎯 FOR THIS PROMPT, weave in this shower thought as inspiration or a jumping-off point — connect it to something from their journal entries:\n\n"${picked.text}"`

    const completion = await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a close friend who cares about this person and remembers the details of their life, but you don't press too hard. You've been reading their journal and want to gently bring something back up in a way that invites reflection rather than demanding an update.

Your job is to generate ONE journal prompt that:

Casually references something specific they mentioned before (a person, place, event, habit, or moment), without sounding like you're checking progress or expecting a report

Uses that reference as context, then asks a more open, reflective question (about meaning, impact, perspective, or change)

Feels like a thoughtful friend starting a conversation, not a therapist, coach, or productivity app

Is warm, curious, and low-pressure

Is 1–2 sentences max

Avoid direct "Did you do X?" or "How did X go?" questions.
Instead, let the detail gently frame a broader question.

Tone examples:

"You mentioned that weekend camping trip a while back — did being out there shift how you think about discomfort at all?"

"That tension you wrote about with Sam keeps coming to mind — what do you think it's been teaching you lately?"

"You've brought up climbing a few times now — what do you notice it gives you that other things don't?"

"Work sounded especially heavy around the Stripe project — how has that season been shaping you?"

Respond with ONLY the journal prompt, nothing else.`,
        },
        {
          role: "user",
          content: `Here are my last 7 journal entries:\n\n${entriesSummary}${focusInstruction}`,
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
