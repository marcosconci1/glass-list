"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useSyncExternalStore } from "react"
import { motion } from "framer-motion"

const THEME_STORAGE_KEY = "app-theme"
const THEME_EVENT = "app-theme-change"

const getStoredTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as "light" | "dark" | null
  return savedTheme === "dark" ? "dark" : "light"
}

const subscribeToTheme = (callback: () => void) => {
  if (typeof window === "undefined") return () => {}

  const handler = () => callback()
  window.addEventListener("storage", handler)
  window.addEventListener(THEME_EVENT, handler)
  return () => {
    window.removeEventListener("storage", handler)
    window.removeEventListener(THEME_EVENT, handler)
  }
}

export function ThemeToggle() {
  const currentTheme = useSyncExternalStore<"light" | "dark">(subscribeToTheme, getStoredTheme, () => "light")

  const applyTheme = (theme: "light" | "dark") => {
    const htmlElement = document.documentElement
    if (theme === "dark") {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme])

  const handleThemeClick = (newTheme: "light" | "dark") => {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    window.dispatchEvent(new Event(THEME_EVENT))
  }

  const tabs = [
    { id: "light" as const, icon: Sun, label: "Light" },
    { id: "dark" as const, icon: Moon, label: "Dark" },
  ]

  return (
    <div className="relative flex items-center p-1 bg-black/40 rounded-full border border-white/10 w-fit isolate">
      {tabs.map((tab) => {
        const isActive = currentTheme === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleThemeClick(tab.id)}
            className="relative z-10 p-2 rounded-full transition-colors duration-200"
            title={tab.label}
          >
            {isActive && (
              <motion.div
                layoutId="active-theme-pill"
                className="absolute inset-0 bg-white rounded-full shadow-lg"
                style={{ zIndex: 0 }}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 35,
                }}
              />
            )}

            <tab.icon
              className="relative z-10"
              size={16}
              strokeWidth={2.5}
              style={{ color: isActive ? "#000000" : "rgba(255, 255, 255, 0.5)" }}
            />
          </button>
        )
      })}
    </div>
  )
}
