import type { JournalEntry, JournalState } from "./journal-store"

const SAMPLE_ENTRIES: { prompt: string; answer: string; emotion: string }[] = [
  {
    prompt: "What's on your mind today?",
    answer: "I had my second round interview at Stripe today and I think it went really well. The system design question tripped me up a little but I recovered. The interviewer seemed impressed when I talked about the distributed caching project I built at my last job. Really hoping I get the offer — it would change everything.",
    emotion: "happy",
  },
  {
    prompt: "How are you feeling right now?",
    answer: "Exhausted. Mom called again about Thanksgiving plans and it turned into this whole thing about me not visiting enough. I love her but she doesn't understand how busy work has been. Jake said I should just set boundaries but it's not that simple with my family. Feeling guilty about it all.",
    emotion: "stressed",
  },
  {
    prompt: "What happened today that stood out?",
    answer: "Had coffee with Marcus this morning — he's going through a rough breakup with Leah and needed someone to talk to. It's weird because they seemed so solid. Made me think about my own relationship with Sam and how I sometimes take us for granted. Texted Sam something nice after, felt good.",
    emotion: "smiley",
  },
  {
    prompt: "What's been weighing on you?",
    answer: "Still haven't heard back from Stripe. It's been 5 days since the interview and the recruiter said they'd get back within a week. I keep refreshing my email like a maniac. Tried to distract myself by going to that new climbing gym on 5th with Jake but my head wasn't in it. Fell on a V3 I normally cruise through.",
    emotion: "stressed",
  },
  {
    prompt: "What are you grateful for today?",
    answer: "Sam surprised me with tickets to the Bon Iver concert next month. I've been wanting to go since they announced the tour. It's the little things like this that remind me how lucky I am to have someone who actually pays attention. Also grateful my landlord finally fixed the kitchen sink — it's been leaking for three weeks.",
    emotion: "happy",
  },
  {
    prompt: "How did you take care of yourself today?",
    answer: "Actually went to Dr. Chen for that checkup I've been putting off for six months. Everything came back fine which is a relief. She said my vitamin D is low though, which explains why I've been so tired lately. Need to start taking supplements and getting outside more. Went for a walk along the river after — it was nice.",
    emotion: "smiley",
  },
  {
    prompt: "What challenged you today?",
    answer: "Got into it with my manager Lisa about the Q1 roadmap. She wants to prioritize the analytics dashboard but I think we need to fix the auth bugs first — we've had three customer complaints this week. I stood my ground which felt good but also uncomfortable. I hate conflict at work. Jake thinks I need to be more assertive in general.",
    emotion: "mad",
  },
  {
    prompt: "What's something you're looking forward to?",
    answer: "The camping trip with Jake and Marcus next weekend at Big Sur! We've been planning it for months. I need it so bad — work has been crushing my soul lately. Already started packing even though it's a week away lol. Sam can't come because of a work conference but promised to join next time.",
    emotion: "happy",
  },
  {
    prompt: "What did you learn about yourself today?",
    answer: "I realized I've been using work as an excuse to avoid dealing with the mom situation. Jake pointed it out pretty bluntly at lunch — he said 'you keep saying you're too busy but you binge Netflix every night.' Ouch but he's right. I need to call her this weekend and actually have a real conversation. Not the surface level 'everything's fine' stuff.",
    emotion: "sad",
  },
  {
    prompt: "How was your day?",
    answer: "GOT THE STRIPE OFFER. I literally screamed in my apartment. The package is way better than I expected — 180k base plus equity. Called mom first actually, and she cried happy tears. Sam took me to that fancy Italian place on Valencia to celebrate. Marcus and Jake are planning a congrats dinner this weekend. I can't believe this is real.",
    emotion: "happy",
  },
  {
    prompt: "What's on your mind tonight?",
    answer: "Now that the Stripe excitement is settling, I'm getting nervous about actually starting. It's a huge company and I'm worried about imposter syndrome kicking in. My current team at Pano threw me a little going-away lunch today and my coworker Dev got emotional which made ME emotional. Two more weeks and then everything changes.",
    emotion: "stressed",
  },
  {
    prompt: "What happened today?",
    answer: "The camping trip was incredible. Woke up to fog rolling through the redwoods, made terrible camp coffee, and Marcus somehow burned the eggs but we ate them anyway. Jake brought his guitar and we sat around the fire playing music until midnight. I needed this more than I realized. Didn't check my phone once the entire day. When's the last time I did that?",
    emotion: "happy",
  },
  {
    prompt: "How are you feeling about things?",
    answer: "Had the real conversation with Mom today. Told her I feel guilty when she says I don't visit enough, and that the guilt makes me want to avoid calling even more. She was quiet for a while and then said she just misses me and doesn't know how to say it without it coming out wrong. We both cried. I think it was a breakthrough. Planning to visit her in two weeks.",
    emotion: "smiley",
  },
  {
    prompt: "What's something small that made your day better?",
    answer: "Found a $20 bill in my old jacket pocket and used it to buy coffees for me and Jake. We sat in Dolores Park and people-watched for an hour. A dog stole someone's sandwich and the whole park was dying laughing. Sometimes the best moments aren't planned at all. Also Sam left a sticky note on my mirror saying 'you're gonna crush it at Stripe' and I almost teared up.",
    emotion: "happy",
  },
  {
    prompt: "What's been on your mind lately?",
    answer: "I start at Stripe on Monday and I'm oscillating between excited and terrified every five minutes. Spent today organizing my desk setup and picking out a first-day outfit like I'm going to middle school lol. Read through the onboarding docs they sent — there's a lot to absorb. Jake says first weeks are always awkward and to just ask a lot of questions.",
    emotion: "stressed",
  },
  {
    prompt: "How did today go?",
    answer: "First day at Stripe done! My manager Priya seems really cool — she took me to lunch and walked me through the team dynamics. The codebase is massive but well-documented which is a relief. Met my onboarding buddy Arun who's been here 2 years. Felt like a total newbie asking basic questions all day but everyone was patient. Collapsed on the couch when I got home. Sam ordered pizza.",
    emotion: "smiley",
  },
  {
    prompt: "What are you thinking about tonight?",
    answer: "Marcus texted that he ran into Leah at a bar and it got awkward. Feel bad for him — he's clearly not over it. Trying to be a good friend but I honestly don't know what advice to give. My own relationship experience before Sam was a disaster. Speaking of Sam, we've been talking about moving in together. It makes financial sense with my new salary but it's a big step. Excited and scared.",
    emotion: "smiley",
  },
  {
    prompt: "What do you want to remember about today?",
    answer: "Visited Mom this weekend and it was the best trip home in years. She made her famous lasagna and we watched old home videos from when I was a kid. Dad would have loved seeing me at Stripe — he always said I'd end up in tech. Mom got teary talking about him but in a good way. Drove home feeling lighter than I have in months.",
    emotion: "happy",
  },
  {
    prompt: "What's frustrating you right now?",
    answer: "Second week at Stripe and I'm struggling with their internal tooling. Spent 3 hours debugging a deployment issue that turned out to be a config problem. Felt dumb asking Arun for help but he fixed it in 5 minutes and said everyone hits that same issue. Still can't shake the imposter syndrome. Jake keeps telling me to give it 3 months before judging but it's hard.",
    emotion: "stressed",
  },
  {
    prompt: "What are you proud of?",
    answer: "Shipped my first PR at Stripe today! It was small — just a bug fix for the payment retry logic — but Priya gave me a shoutout in the team standup and I was beaming. Arun said my code review comments on his PR were 'surprisingly thorough for a new hire' which I'm taking as a huge compliment. Called Mom to tell her and she pretended to understand what a PR is. Love her.",
    emotion: "happy",
  },
  {
    prompt: "How are you doing, really?",
    answer: "Honestly? I think I'm the happiest I've been in a long time. Work is challenging but in a good way, Sam and I found an apartment in the Mission we both love, Mom and I are talking regularly without it being tense. Even Marcus seems to be doing better — he started therapy which is huge for him. The only thing nagging me is I haven't been to the gym in 3 weeks. Need to fix that.",
    emotion: "happy",
  },
  {
    prompt: "What happened today that you want to process?",
    answer: "Sam and I had our first real argument in a while. It was about the apartment — I want the one in the Mission but Sam thinks the one in Hayes Valley is better because it's closer to their office. It got heated and I said something about always compromising which wasn't fair. We cooled off and talked it through. I think we're going with Hayes Valley and honestly it IS the nicer place. I just hate being wrong lol.",
    emotion: "mad",
  },
  {
    prompt: "What's giving you energy right now?",
    answer: "The climbing gym has become my happy place again. Jake and I went three times this week and I finally sent that V5 I've been projecting for a month. There's something meditative about climbing — you can't think about work or apartment hunting when you're trying not to fall. Also started the vitamin D supplements Dr. Chen recommended and I actually do feel less tired. Placebo or not, I'll take it.",
    emotion: "happy",
  },
  {
    prompt: "What would you tell a friend going through what you're going through?",
    answer: "I'd tell them to slow down and appreciate the transition. I've been so focused on 'getting settled' at Stripe and figuring out the apartment and maintaining all my relationships that I forgot to just... exist. Read a book for the first time in months last night — Sam was already asleep and it was just me and the quiet. Realized how much I miss that stillness.",
    emotion: "smiley",
  },
  {
    prompt: "What's something you want to work on?",
    answer: "I need to get better at saying no. Agreed to help Dev with a side project even though I have zero bandwidth. Also said yes to three social things this weekend when I really just want to unpack boxes at the new apartment. Jake called it my 'people-pleasing thing' and he's annoyingly right. Starting tomorrow I'm practicing the word no. No. See? Easy. (It's not easy.)",
    emotion: "stressed",
  },
  {
    prompt: "What moment from today will you remember?",
    answer: "Move-in day! Sam and I officially live together now. The apartment is a mess of boxes and we couldn't find the sheets so we slept on the bare mattress with our coats as blankets. We lay there laughing at how ridiculous it was and I thought — this is it. This is the good stuff. Marcus and Jake are coming over Saturday to help us build the IKEA furniture. Prayers welcome.",
    emotion: "happy",
  },
  {
    prompt: "How are you feeling about the future?",
    answer: "Three months into Stripe and I finally feel like I belong. Priya asked me to lead the design review for the new checkout flow which is a big deal. The imposter syndrome isn't gone but it's quieter now. Sam decorated the apartment beautifully — it actually feels like home. Mom is planning to visit next month and I'm genuinely excited instead of dreading it. Things are clicking into place.",
    emotion: "happy",
  },
  {
    prompt: "What do you need right now?",
    answer: "Sleep. I've been averaging 5 hours a night because I stay up doom-scrolling or working on that side project with Dev. My body is telling me to slow down — my eye has been twitching for a week. Sam noticed and is worried. I need to set a hard 11pm phone-away rule. Also need to call Marcus — he left a voicemail yesterday and sounded off. Being a good friend takes energy I don't always have right now.",
    emotion: "stressed",
  },
  {
    prompt: "What are you noticing about yourself?",
    answer: "I'm way more confident at work than I was at Pano. Not sure if it's the environment or if I've actually grown. Gave a tech talk at the team offsite about the caching system I built and people asked genuinely interested questions after. Old me would have been terrified. New me was nervous but handled it. Jake said 'you're finally seeing what the rest of us have always seen' and I'm gonna remember that for a while.",
    emotion: "happy",
  },
  {
    prompt: "What's your heart telling you?",
    answer: "That I need to be more present. I catch myself planning the next thing while the current thing is still happening. At dinner with Sam last night I was mentally writing a work email instead of listening to their story about a weird coworker. They noticed and didn't say anything but I could tell. I don't want to be that person. Tomorrow I'm leaving my phone in another room during dinner. Small steps.",
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
