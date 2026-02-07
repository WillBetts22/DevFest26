"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  async function signIn() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (!error) setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4 rounded-xl border p-6">
        <h1 className="text-xl font-semibold">Log in</h1>

        {sent ? (
          <p className="text-sm text-muted-foreground">
            Check your email for the login link.
          </p>
        ) : (
          <>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={signIn}
              className="w-full rounded-md bg-black px-3 py-2 text-white"
            >
              Send magic link
            </button>
          </>
        )}
      </div>
    </div>
  )
}
