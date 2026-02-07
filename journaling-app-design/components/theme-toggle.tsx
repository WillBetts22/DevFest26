"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("mellow-theme")
    if (stored === "light") {
      setIsLight(true)
      document.documentElement.classList.add("light")
    }
  }, [])

  const toggle = () => {
    const next = !isLight
    setIsLight(next)
    if (next) {
      document.documentElement.classList.add("light")
      localStorage.setItem("mellow-theme", "light")
    } else {
      document.documentElement.classList.remove("light")
      localStorage.setItem("mellow-theme", "dark")
    }
  }

  return (
    <button
      onClick={toggle}
      className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  )
}
