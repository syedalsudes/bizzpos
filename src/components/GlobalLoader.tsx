"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 2.5s to 3s ka time best hai global experience ke liye
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2800)
    return () => clearTimeout(timer)
  }, [])

  // Brand Name
  const letters = ["B", "i", "z", "z", "P", "O", "S"]

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } 
          }}
          className="fixed inset-0 z-[9999] bg-[#FBF9F6] flex flex-col items-center justify-center selection:bg-transparent"
        >
          {/* Brand Animation */}
          <div className="flex items-baseline mb-10">
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className={`text-4xl sm:text-6xl font-black tracking-tighter ${
                  letter === "P" || letter === "O" || letter === "S" 
                  ? "text-amber-600" // POS highlight
                  : "text-stone-900" // Bizz part
                }`}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Minimalist Progress Container */}
          <div className="relative w-48 sm:w-64 h-[2px] bg-stone-200 rounded-full overflow-hidden">
            {/* Moving Light/Glow Effect */}
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "linear" 
              }}
              className="absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50"
            />
            
            
          </div>

          {/* Loading Indicator Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 0.5, repeat: Infinity, duration: 2 }}
            className="mt-6 text-[9px] font-black uppercase tracking-[0.5em] text-stone-700"
          >
            Initializing Secure Terminal
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}