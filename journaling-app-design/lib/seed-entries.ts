import type { JournalEntry, JournalState } from "./journal-store"

const SAMPLE_ENTRIES: { prompt: string; answer: string; emotion: string }[] = [
  {
    prompt: "What made you smile today?",
    answer: "My friend sent me a funny meme out of nowhere and it completely turned my afternoon around. Sometimes it's the little unexpected things that hit different.",
    emotion: "happy",
  },
  {
    prompt: "What's one thing you're grateful for right now?",
    answer: "Honestly, just having a warm apartment. It's freezing outside and I keep thinking about how lucky I am to come home to a cozy space after a long day.",
    emotion: "happy",
  },
  {
    prompt: "What's draining your energy right now?",
    answer: "Work has been nonstop. I feel like every time I finish one task, three more appear. I need to get better at saying no to things that aren't my responsibility.",
    emotion: "stressed",
  },
  {
    prompt: "How did you show up for yourself today?",
    answer: "I actually took a full lunch break instead of eating at my desk. Went for a short walk and it made the rest of the day so much more manageable.",
    emotion: "happy",
  },
  {
    prompt: "What conversation do you keep avoiding?",
    answer: "I need to talk to my roommate about the dishes situation. It's been bothering me for weeks but I keep putting it off because I hate confrontation.",
    emotion: "stressed",
  },
  {
    prompt: "What's something you learned about yourself recently?",
    answer: "I realized I'm a lot more introverted than I thought. After social events, I really do need alone time to recharge and that's completely okay.",
    emotion: "smiley",
  },
  {
    prompt: "What boundary do you need to set or honor?",
    answer: "I need to stop checking my email after 7pm. It's bleeding into my personal time and I end up stressed before bed thinking about work stuff.",
    emotion: "stressed",
  },
  {
    prompt: "If today had a theme song, what would it be?",
    answer: "Probably 'Here Comes the Sun' by The Beatles. Started rough but the afternoon was beautiful — went for a walk and the weather was perfect.",
    emotion: "happy",
  },
  {
    prompt: "What's one small win you can celebrate?",
    answer: "I finally finished that book I've been reading for two months! It feels good to actually complete something I started for fun.",
    emotion: "smiley",
  },
  {
    prompt: "What would your future self thank you for today?",
    answer: "Going to the gym even though I really didn't want to. I almost skipped but I know future me will appreciate building the habit.",
    emotion: "smiley",
  },
  {
    prompt: "Who made a difference in your day?",
    answer: "My coworker Sarah. She noticed I was overwhelmed and offered to help with my project without me even asking. People like that are rare.",
    emotion: "happy",
  },
  {
    prompt: "What's a fear you'd like to let go of?",
    answer: "The fear of being judged for my interests. I love drawing but I never share my work because I'm afraid people will think it's not good enough.",
    emotion: "sad",
  },
  {
    prompt: "When did you last feel truly present?",
    answer: "Last weekend when I was cooking dinner and listening to music. No phone, no distractions, just chopping vegetables and vibing. Need more of that.",
    emotion: "smiley",
  },
  {
    prompt: "What does 'enough' look like for you today?",
    answer: "Getting through my three main tasks at work and then allowing myself to relax without guilt. I don't need to be productive every waking hour.",
    emotion: "smiley",
  },
  {
    prompt: "What habit is silently shaping your life?",
    answer: "Scrolling my phone first thing in the morning. I know it sets a bad tone for the day but it's become so automatic I barely notice I'm doing it.",
    emotion: "stressed",
  },
  {
    prompt: "What's a belief you've outgrown?",
    answer: "That I need to have everything figured out by now. Life isn't a race and it's okay to still be figuring things out. Most people are.",
    emotion: "smiley",
  },
  {
    prompt: "What's one thing you want to release before bed?",
    answer: "The argument I had with my mom earlier. We both said things we didn't mean. I know we'll work it out but I need to let it go for tonight.",
    emotion: "sad",
  },
  {
    prompt: "Describe your ideal tomorrow in 3 sentences.",
    answer: "Wake up naturally without an alarm. Spend the morning at the coffee shop working on my side project. End the day cooking a nice dinner with a friend.",
    emotion: "happy",
  },
  {
    prompt: "If you could tell your younger self one thing, what would it be?",
    answer: "Stop trying so hard to fit in. The people who matter will like you for who you actually are. The rest aren't worth the energy.",
    emotion: "smiley",
  },
  {
    prompt: "What would you do if you weren't afraid of judgment?",
    answer: "I'd start posting my photography online. I take photos everywhere I go but they just sit on my phone. Maybe I'd even try selling prints.",
    emotion: "smiley",
  },
  {
    prompt: "What made you smile today?",
    answer: "My dog did the funniest thing at the park — she tried to befriend a squirrel and was so confused when it ran away. Pure joy watching her.",
    emotion: "happy",
  },
  {
    prompt: "What's draining your energy right now?",
    answer: "Honestly, the news cycle. Everything feels so heavy and I find myself doom-scrolling even though it makes me feel worse. Need to set limits.",
    emotion: "sad",
  },
  {
    prompt: "How did you show up for yourself today?",
    answer: "I said no to plans I didn't actually want to go to. Usually I'd force myself and be miserable the whole time, but tonight I chose rest.",
    emotion: "smiley",
  },
  {
    prompt: "What's something you learned about yourself recently?",
    answer: "I thrive with structure but I've been resisting it. When I plan my day the night before, everything flows better. Need to make that a habit.",
    emotion: "smiley",
  },
  {
    prompt: "Who made a difference in your day?",
    answer: "A random stranger held the door open and said 'have a great day' with genuine warmth. Such a small thing but it shifted my whole mood.",
    emotion: "happy",
  },
  {
    prompt: "What's one small win you can celebrate?",
    answer: "I cooked a new recipe and it actually turned out amazing. Usually I stick to the same 5 meals so this felt like a real accomplishment.",
    emotion: "happy",
  },
  {
    prompt: "What boundary do you need to set or honor?",
    answer: "I need to stop saying yes to every social invite. It's okay to have a quiet weekend. My energy matters more than FOMO.",
    emotion: "stressed",
  },
  {
    prompt: "What's a fear you'd like to let go of?",
    answer: "The fear of failure. I've been wanting to apply for a new job but I keep talking myself out of it. What's the worst that could happen?",
    emotion: "stressed",
  },
  {
    prompt: "When did you last feel truly present?",
    answer: "This morning during my run. No music, no podcast, just me and the sound of my footsteps. It was meditative in a way I didn't expect.",
    emotion: "happy",
  },
  {
    prompt: "What's one thing you want to release before bed?",
    answer: "The guilt of not being productive enough today. It was a slow day and that's fine. Rest is productive too, even if it doesn't feel like it.",
    emotion: "sad",
  },
]

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function generateSeedData(): JournalState {
  const entries: Record<string, JournalEntry> = {}
  const today = new Date()

  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    const sample = SAMPLE_ENTRIES[i % SAMPLE_ENTRIES.length]

    entries[dateStr] = {
      id: generateId(),
      date: dateStr,
      prompt: sample.prompt,
      answer: sample.answer,
      emotion: sample.emotion,
      quickNotes: [],
      voiceMemos: [],
      stickies: [],
      createdAt: date.getTime(),
    }
  }

  return {
    entries,
    streak: 7,
    lastEntryDate: new Date(today.getTime() - 86400000).toISOString().split("T")[0],
  }
}
