"use client"

import * as Switch from "@radix-ui/react-switch"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function DarkLightSwitch() {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    const isDark =
      saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)

    setChecked(isDark)
    document.documentElement.classList.toggle("dark", isDark)
  }, [])

  const handleChange = (value: boolean) => {
    setChecked(value)
    const mode = value ? "dark" : "light"
    localStorage.setItem("theme", mode)
    document.documentElement.classList.toggle("dark", value)
  }

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = i * 0.2
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
          opacity: { delay, duration: 0.1 },
        },
      }
    },
  }

  return (
    <div className="flex items-center scale-50">
      <Switch.Root checked={checked} onCheckedChange={handleChange} asChild>
        <motion.button
          className="w-[150px] p-1 rounded-full outline-none cursor-pointer flex items-center"
          style={{
            justifyContent: checked ? "flex-end" : "flex-start",
          }}
          initial={false}
          animate={{
            backgroundColor: checked ? "#111" : "#ffe58f",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Switch.Thumb asChild>
            <motion.div
              className="w-[50px] h-[50px] rounded-full flex items-center justify-center shadow-md bg-white dark:bg-zinc-800"
              layout
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              {checked ? (
                // 🌙 Moon icon (animated)
                <motion.svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  initial="hidden"
                  animate="visible"
                  variants={draw}
                >
                  <motion.path
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010.59 9.79z"
                    stroke="#8df0cc"
                    strokeWidth="2"
                    fill="transparent"
                    variants={draw}
                    custom={1}
                  />
                </motion.svg>
              ) : (
                // ☀️ Sun icon (animated)
                <motion.svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  initial="hidden"
                  animate="visible"
                  variants={draw}
                >
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="5"
                    stroke="#facc15"
                    strokeWidth="2"
                    fill="transparent"
                    variants={draw}
                    custom={1}
                  />
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180
                    const x1 = 12 + Math.cos(angle) * 8
                    const y1 = 12 + Math.sin(angle) * 8
                    const x2 = 12 + Math.cos(angle) * 10
                    const y2 = 12 + Math.sin(angle) * 10
                    return (
                      <motion.line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#facc15"
                        strokeWidth="2"
                        variants={draw}
                        custom={1.5 + i * 0.1}
                      />
                    )
                  })}
                </motion.svg>
              )}
            </motion.div>
          </Switch.Thumb>
        </motion.button>
      </Switch.Root>
    </div>
  )
}
