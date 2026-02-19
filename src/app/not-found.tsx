"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    // justify-center aur items-center dono apply kiye hain perfect alignment ke liye
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#FBF9F6] text-stone-900 px-4 selection:bg-stone-900 selection:text-amber-400">
      
      <div className="flex flex-col items-center text-center max-w-md w-full">
        {/* 404 Text */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-8xl md:text-9xl font-black tracking-tighter leading-none"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-lg md:text-xl mt-4 font-black uppercase tracking-[0.3em] text-amber-600"
        >
          Page Not Found
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm mt-4 text-stone-500 font-medium italic leading-relaxed"
        >
          The page you are looking for has been moved <br className="hidden md:block" /> or doesn't exist in our protocols.
        </motion.p>

        {/* Back Button Container - w-full aur flex justify-center se alignment control ki hai */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 w-full flex justify-center"
        >
          <Link
            href="/"
            className="group inline-flex items-center justify-center px-10 py-5 rounded-full bg-stone-900 text-white font-black text-[11px] uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-stone-200"
          >
            <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
            Go Back Home
          </Link>
        </motion.div>
      </div>

    </div>
  )
}