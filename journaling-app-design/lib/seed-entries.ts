import type { JournalEntry, JournalState } from "./journal-store"

const SAMPLE_ENTRIES: { prompt: string; answer: string; emotion: string }[] = [
  {
    prompt: "What's stressing you out the most this week?",
    answer: "I have two midterms on the same day and a group project due Friday. My group members haven't done anything and I know I'm gonna end up carrying the whole thing. I emailed the professor about it but she basically said 'work it out amongst yourselves.' Easy for you to say. Haven't been to the gym in two weeks and I can feel it in my mood.",
    emotion: "stressed",
  },
  {
    prompt: "Did you actually take care of yourself today or just survive?",
    answer: "Survived. Had a Red Bull for breakfast, skipped lunch because I was cramming in the library, then ate dining hall pizza at 9pm. My roommate Tyler said I look like a zombie and honestly he's not wrong. I did take a 20-minute walk between classes though which felt nice. The weather was perfect and I almost forgot about my orgo exam for a second.",
    emotion: "sad",
  },
  {
    prompt: "How are you feeling about your classes right now?",
    answer: "Econ is going great — Professor Walsh makes everything click and I actually look forward to lecture. But organic chemistry is destroying me. I got a 62 on the last exam and the curve only brought it to a 68. I've been going to office hours but it still feels like everyone else just gets it faster than me. Thinking about dropping it but then I'd be behind for med school prereqs.",
    emotion: "stressed",
  },
  {
    prompt: "Who did you spend time with today and how did it make you feel?",
    answer: "Hung out with my friend group at the campus coffee shop for like three hours. We were supposed to be studying but ended up talking about everything — Mia's situationship drama, Tyler's internship rejection, whether we should road trip to Austin for spring break. I needed that. Sometimes I isolate when I'm stressed and forget how much better I feel around people who actually get me.",
    emotion: "happy",
  },
  {
    prompt: "What's one thing about college nobody warned you about?",
    answer: "How lonely it can be even when you're surrounded by people 24/7. I have friends, I go to parties, I'm in two clubs — but sometimes I sit in my dorm at night and feel this weird emptiness. Called my mom about it and she said it's normal but that didn't really help. Mia says she feels the same way sometimes which made me feel less broken at least.",
    emotion: "sad",
  },
  {
    prompt: "How are you managing your money this month — honestly?",
    answer: "Terribly lol. I spent way too much on DoorDash this week because I was too tired to walk to the dining hall. Also bought a $45 sweater I didn't need because Tyler said it looked good. My bank account is at $127 and it's only the 15th. Might have to ask my parents for money again which I hate doing. Need to start actually using that budget spreadsheet I made in September and never opened.",
    emotion: "stressed",
  },
  {
    prompt: "What would you do this semester if you weren't afraid of failing?",
    answer: "I'd switch my major to film. I've been making little videos since high school and my film elective is the only class where I feel genuinely excited. But my parents are paying tuition and they expect a 'practical' degree. Dad literally said 'film school is for rich kids who don't need jobs.' Maybe he's right but sitting through business classes makes me want to scream.",
    emotion: "sad",
  },
  {
    prompt: "When's the last time you did something just because it was fun?",
    answer: "Last Saturday! Tyler and I drove to the lake at 2am because neither of us could sleep. We just sat on the hood of his car and talked about stupid stuff — what animal we'd be, whether aliens exist, our most embarrassing high school moments. No homework, no stress, just vibes. I need more nights like that and fewer nights staring at a textbook I'm not actually reading.",
    emotion: "happy",
  },
  {
    prompt: "Did you compare yourself to someone today? What triggered it?",
    answer: "My lab partner Jess casually mentioned she already has a summer internship at Google lined up. GOOGLE. Meanwhile I've applied to 30 places and heard back from zero. Then I went on LinkedIn and saw three more people from my high school posting about their internships. I know comparison is the thief of joy or whatever but it's hard not to feel behind. Tyler says I need to delete LinkedIn and honestly maybe he's right.",
    emotion: "stressed",
  },
  {
    prompt: "How did you handle pressure today?",
    answer: "Badly at first — I had a mini breakdown in the library when I realized my essay was due at midnight and not next Monday. Literally put my head on the desk and just sat there. Then Mia texted me and talked me through it. I cranked out 1500 words in four hours and it's not my best work but I submitted it. Sometimes done is better than perfect. Gonna reward myself with a movie tonight.",
    emotion: "smiley",
  },
  {
    prompt: "What's a relationship in your life that needs attention?",
    answer: "My relationship with my little sister. She's a senior in high school and keeps texting me about college apps and I've been leaving her on read because I'm busy. She called last week and I let it go to voicemail. I remember how scary the application process was and she doesn't have anyone else to talk to about it really. I need to FaceTime her this weekend. She looks up to me and I'm dropping the ball.",
    emotion: "sad",
  },
  {
    prompt: "What's keeping you up at night lately?",
    answer: "Whether I'm even supposed to be here. Not in a dark way — just in a 'is this the right path' way. I picked this school because of the scholarship but sometimes I wonder what would've happened if I went to the smaller school closer to home. I feel like everyone here already knows what they want to do and I'm just floating. My advisor says that's normal for sophomores but it doesn't feel normal.",
    emotion: "stressed",
  },
  {
    prompt: "Are you chasing something because you want it or because you think you should?",
    answer: "Pre-med. I'm chasing pre-med because both my parents are doctors and it's always been 'the plan.' But I dread every bio lecture and the thought of four more years of school after this makes me want to cry. I love my psych elective though — like actually love it. Professor Kim makes it so interesting. I'm scared to even bring up switching tracks with my family.",
    emotion: "sad",
  },
  {
    prompt: "What's one thing you did today that future you will thank you for?",
    answer: "Went to the career center and had them look at my resume. The advisor completely tore it apart (in a nice way) and helped me rebuild it. Turns out I was underselling everything. She also told me about a summer research position I didn't know existed. I walked out feeling like maybe I'm not as behind as I think. Also did laundry for the first time in... I'd rather not say how long.",
    emotion: "happy",
  },
  {
    prompt: "How's your mental health — like, really?",
    answer: "It's okay. Not great, not terrible. I've been anxious a lot — like that tight chest feeling before bed. I know I should probably talk to someone at the counseling center but the waitlist is apparently 3 weeks. Mia goes and says it helps. I've been journaling more (hey, this app) and going on walks which helps some. I think I just need to stop pretending everything is fine when people ask.",
    emotion: "smiley",
  },
  {
    prompt: "What's one boundary you need to start setting?",
    answer: "Saying no to going out every Thursday-Saturday. I have serious FOMO and I end up at parties I don't even enjoy because I'm afraid of missing something. Then I'm exhausted all weekend and scramble to do homework Sunday night. Tyler goes out less than me and still has a better social life somehow. Quality over quantity I guess. This Thursday I'm staying in. Probably. We'll see.",
    emotion: "stressed",
  },
  {
    prompt: "What would you do differently if you could redo today?",
    answer: "I wouldn't have checked my phone during lecture. I spent the entire 75 minutes scrolling TikTok and now I have no idea what happened in stats. The notes on Canvas are useless without context. Also I would've said yes when Tyler asked if I wanted to go to the club meeting tonight. I said I was tired but really I was just being lazy. Those are the nights I usually end up having the most fun.",
    emotion: "sad",
  },
  {
    prompt: "What's stressing you out the most this week?",
    answer: "HOUSING LOTTERY IS NEXT WEEK. Tyler and I want to room together again but we need a group of four and our other two friends are being flaky about committing. If we don't get into the suite-style dorms I might have to do a random roommate situation which honestly sounds terrible. Also stressing about whether I can afford to live off campus junior year. The apartment prices near campus are insane.",
    emotion: "stressed",
  },
  {
    prompt: "What's one thing you're procrastinating on and why?",
    answer: "Declaring my major. The deadline is literally next month and I still haven't decided. Every time I sit down to think about it I get overwhelmed and watch YouTube instead. I keep going back and forth between econ and psych. My parents want me to do something 'employable' but what does that even mean anymore. Mia said to go with my gut but my gut is confused.",
    emotion: "stressed",
  },
  {
    prompt: "Are you where you thought you'd be at this point in college?",
    answer: "Honestly no. I thought I'd have my life figured out by sophomore year — close friend group, clear career path, maybe a relationship. I have great friends but everything else is a question mark. But then I look at my group chat and realize everyone else is just as lost as me, they're just better at hiding it. Maybe that's the real college experience — being confused together.",
    emotion: "smiley",
  },
  {
    prompt: "How are you feeling about your classes right now?",
    answer: "I just got an A on my psych paper and I'm actually so hyped. Professor Kim wrote 'exceptional analysis' in the comments and I've been riding that high all day. It's the first time in a while I felt genuinely smart and not just 'getting by.' Meanwhile I bombed my calc quiz but whatever. Today is a psych celebration day. Tyler and I got boba to celebrate.",
    emotion: "happy",
  },
  {
    prompt: "Who did you spend time with today and how did it make you feel?",
    answer: "Went to my RA's study group thing and ended up meeting this girl Sophie from my econ class. We studied for like 2 hours and then just kept talking — about music, about home, about how weird it is that we're supposed to be adults now. Haven't clicked with someone like that in a while. Got her number. Not even in a romantic way, just in a 'I think we could be really good friends' way.",
    emotion: "happy",
  },
  {
    prompt: "What's one thing you wish you could tell your professor?",
    answer: "I wish I could tell my orgo professor that assigning 6 hours of homework per week in a class where we already have 4 hours of lecture and 3 hours of lab is genuinely unreasonable. I'm not learning at that point, I'm just going through the motions to get a grade. Also the TAs don't actually explain anything during office hours, they just do the problem on the board and expect us to get it. It's not working.",
    emotion: "mad",
  },
  {
    prompt: "How did you handle pressure today?",
    answer: "Presentation in my communications class. I was shaking beforehand and almost considered just taking the zero. But Mia hyped me up in the hallway and I went in and just... did it. It wasn't perfect — I talked too fast and forgot one of my points — but I finished and people actually clapped. My professor said my topic was 'refreshingly honest.' I feel like I could run through a wall right now.",
    emotion: "happy",
  },
  {
    prompt: "What's keeping you up at night lately?",
    answer: "Post-grad stuff is starting to feel real even though I have two years left. Everyone's talking about internships and grad school and career fairs. I went to the career fair today and felt so out of place — everyone was in suits and had printed resumes and I showed up in jeans with a PDF on my phone. Left after 20 minutes feeling like a fraud. Tyler said most people were faking confidence too. Hope he's right.",
    emotion: "stressed",
  },
  {
    prompt: "When's the last time you did something just because it was fun?",
    answer: "Intramural volleyball game tonight and we actually won for the first time all season! Our team is objectively terrible but we have the best energy. Sophie came to watch and was losing it on the sidelines. After, the whole team went to get wings and we were so loud the restaurant probably hated us. College is stressful but moments like these are why I wouldn't trade it.",
    emotion: "happy",
  },
  {
    prompt: "Did you actually take care of yourself today or just survive?",
    answer: "Actually took care of myself for once. Woke up early, went to the campus gym, had a real breakfast at the dining hall instead of a granola bar. Went to all my classes and actually paid attention. Did my reading for tomorrow before 10pm. Called my mom. It's sad that a normal functional day feels like an achievement but here we are. More days like this please.",
    emotion: "happy",
  },
  {
    prompt: "How's your mental health — like, really?",
    answer: "Better than last month. I finally got into the counseling center and my therapist is actually really cool. She doesn't do the whole 'and how does that make you feel' cliché — she's more like 'okay so what are we gonna do about it.' We talked about my perfectionism and how it's actually making me perform worse because I avoid things I might fail at. Mind = blown. Going back next Tuesday.",
    emotion: "smiley",
  },
  {
    prompt: "What's a relationship in your life that needs attention?",
    answer: "My friendship with Marcus from back home. We were inseparable in high school but we've barely talked this semester. He goes to state and every time we text it feels surface level — just memes and 'we should call soon' but we never do. I'm scared we're becoming those friends who just like each other's Instagram posts. Gonna actually call him tonight instead of just thinking about it.",
    emotion: "sad",
  },
  {
    prompt: "What's one boundary you need to start setting?",
    answer: "I need to stop letting people copy my homework. I know that sounds small but it happens every week — someone from class texts me at 11pm asking for 'help' which really means 'can I see your answers.' I always say yes because I want people to like me but then I resent it. Sophie told me she stopped doing it last semester and nobody actually got mad. Easier said than done but I'm trying.",
    emotion: "stressed",
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
