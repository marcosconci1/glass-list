"use client"

import { motion, AnimatePresence } from "framer-motion"

interface NumberTickerProps {
  value: string | number
}

export function NumberTicker({ value }: NumberTickerProps) {
  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden inline-block text-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "80%", filter: "blur(2px)", opacity: 0.3 }}
          animate={{ y: "0%", filter: "blur(0px)", opacity: 1 }}
          exit={{ y: "-80%", filter: "blur(2px)", opacity: 0.3 }}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 20,
            mass: 0.8,
            opacity: { duration: 0.25, ease: "easeOut" },
            filter: { duration: 0.2, ease: "easeOut" },
          }}
          className="absolute inset-0 flex items-center justify-center tabular-nums"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}
