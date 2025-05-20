'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    setDarkMode(isDark)
  }, [])

  const toggleTheme = () => {
    const newMode = !darkMode
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
    setDarkMode(newMode)
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="
        theme-toggle
        rounded-full shadow-md
        w-10 h-10 flex items-center justify-center
      "
    >
      {darkMode ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}
