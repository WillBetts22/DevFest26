Demo Link: https://youtube.com/shorts/lTTfrITNl3M?si=EOiKk6QrCdkByfIa 

##  Mellow: Project Story


## Inspiration
**Non-journalers still reflect — just unintentionally.**  
They vent about stress, think about goals, notice patterns, and want to improve — but those thoughts disappear because there’s no lightweight system to capture and make sense of them.

Mellow was inspired by that gap.

What if journaling wasn’t a hobby, but a **tool for lifestyle-maxxing**?  
What if reflection felt effortless — and actually helped you improve?

## What it does
Mellow is **journaling for lifestyle-maxxing non-journalers** — an app that understands you and motivates you to grow.

Instead of asking users to journal for journaling’s sake, Mellow:
- Gives **simple daily prompts** so users never face a blank page
- Supports **quick, low-commitment entries**
- Stores short-term reflection data (last 1–2 weeks)
- Analyzes what users write to identify **growth areas**
- Surfaces **clear, actionable improvements** users can work on

For example, if a user consistently writes about feeling overwhelmed by work, Mellow doesn’t just summarize that — it highlights *“Managing Work Stress”* as a growth area and suggests a realistic adjustment.

Mellow turns reflection into **direction**.

## How we built it
We built Mellow with speed, clarity, and iteration in mind.

**Frontend**
- Designed the UI using **v0** to rapidly prototype flows and visual hierarchy
- Built the mobile experience with **React Native (Expo)**
- Focused on a calm, modern interface optimized for non-journalers:
  - Home dashboard with daily prompt
  - Quick entry flow
  - Growth Areas section that highlights what to improve next

**Backend**
- Used **Supabase** for authentication and data storage
- Modeled journal entries and AI-generated insights in Postgres
- API calls with Dedalus Labs 
- Implemented **Supabase Edge Functions** to:
  1. Fetch a user’s recent entries (short-term memory)
  2. Detect recurring patterns using AI
  3. Store structured “growth areas” back into the database

## Challenges we ran into
- **Avoiding “self-help cringe”**: The app needed to feel practical and motivating, not emotional or preachy.
- **Scoping AI responsibly**: We intentionally limited memory to short-term data to avoid overreach while still delivering meaningful personalization.
- **Turning reflection into action**: It was harder than expected to phrase insights in a way that felt helpful rather than judgmental.
- **Time pressure**: Balancing backend logic, UI clarity, and AI behavior within a hackathon timeframe required strict prioritization.

## Accomplishments that we're proud of
- Reframing journaling as a **lifestyle optimization tool**
- Building a system that understands users instead of just storing text
- Delivering personalized growth insights rather than generic advice
- Creating an experience that lowers the barrier to reflection for non-journalers
- Implementing a full input → analysis → output loop in a short timeframe

## What we learned
- Reflection is most powerful when it leads to **one clear next step**
- AI adds the most value when it *interprets patterns*, not when it overexplains

## What's next for Mellow
- Cooler UI/UX
- Lock-screen widgets for ultra-low-friction reflection
- Social and collaborative reflection features
