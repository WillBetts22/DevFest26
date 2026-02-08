// Login page commented out — not needed for now
// To re-enable, uncomment the code below

/*
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  async function signIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMessage("")

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    setLoading(false)

    if (error) {
      console.error(error)
      setErrorMessage(error.message)
    } else {
      setSent(true)
    }
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

          <form onSubmit={signIn} className="space-y-4">
            {errorMessage && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-black px-3 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
*/

export default function LoginPage() {
  return null
}
