'use client'

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowRight, Zap, ChevronRight, Star,
  CheckCircle2, Globe, ShieldCheck, Shield, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

// --- Improved Feature Card with Spotlight Effect ---
function FeatureCard({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) {
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={onMouseMove}
      className="group relative p-8 rounded-[2rem] border border-stone-200 bg-white hover:border-[#8B3DA5]/30 transition-all duration-500 overflow-hidden"
    >
      {/* Spotlight Overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(139,61,165,0.06), transparent 40%)`
          ),
        }}
      />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-xl bg-stone-50 text-[#8B3DA5] flex items-center justify-center mb-6 group-hover:bg-[#8B3DA5] group-hover:text-white transition-all duration-500 shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-black text-stone-900 mb-3 tracking-tight flex items-center gap-2">
          {title}
        </h3>
        <p className="text-stone-500 leading-relaxed text-sm font-medium">{description}</p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-stone-900 overflow-x-hidden">

      {/* --- HERO SECTION (Unchanged as requested) --- */}
      <section className="relative pt-20 pb-32 flex flex-col items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-stone-200 shadow-xl mb-12"
          >
            <Star size={14} className="fill-[#8B3DA5] text-[#8B3DA5]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8189B3]">Industry Leader in High-Risk Processing</span>
          </motion.div>

          <motion.h1 className="text-7xl lg:text-[110px] font-black leading-[0.9] tracking-[-0.04em] mb-10">
            Global <span className="text-[#8B3DA5]">Wealth.</span><br />
            <span className="relative inline-block mt-4">
              Seamless Payments.
              <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 400 20" fill="none">
                <path d="M5 15C100 5 300 5 395 15" stroke="#AA6ABD" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p className="text-xl md:text-2xl text-[#8189B3] max-w-3xl mx-auto mb-16 font-medium leading-tight italic">
            Empowering the next generation of global merchants with bulletproof security and instant liquidity.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24">
            <Link href="/dashboard" className="group px-12 py-6 rounded-full bg-stone-900 text-white font-black text-sm uppercase tracking-widest flex items-center gap-4 hover:bg-[#8B3DA5] transition-all hover:scale-105 shadow-2xl">
              View My Dashboard
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES: NEW BENTO GRID DESIGN --- */}
      <section className="py-32 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic">
                Designed for <span className="text-[#8B3DA5]">Velocity.</span>
              </h2>
              <p className="text-stone-500 font-medium text-lg">We've stripped away the bureaucracy of traditional banking.</p>
            </div>
            <div className="hidden md:block pb-2">
              <div className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-stone-400">
                Infrastructure v4.0.2
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Card */}
            <div className="md:col-span-7">
              <FeatureCard 
                index={0}
                icon={<ShieldCheck size={28} />}
                title="Identity Vault" 
                description="Our proprietary KYC engine verifies international entities in under 60 seconds with AI-driven document analysis and biometric matching."
              />
            </div>
            {/* Small Card */}
            <div className="md:col-span-5">
              <FeatureCard 
                index={1}
                icon={<Zap size={28} />}
                title="Lightning Settlement" 
                description="Access your funds in T+0. No more waiting for weekend cycles or bank holidays."
              />
            </div>
            {/* Small Card */}
            <div className="md:col-span-5">
              <FeatureCard 
                index={2}
                icon={<Globe size={28} />}
                title="Global Ledger" 
                description="Accept 135+ currencies with local settlement options in 50+ countries."
              />
            </div>
            {/* Large Card */}
            <div className="md:col-span-7">
              <FeatureCard 
                index={3}
                icon={<ArrowRight size={28} />}
                title="Smart Routing" 
                description="Automatically route transactions through the highest-converting acquiring banks in our global network to ensure 99% success."
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECURITY: REFINED LUXURY DESIGN --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8B3DA5] to-[#C08FD0] rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
          
          <div className="relative bg-stone-950 rounded-[3rem] p-12 lg:p-24 overflow-hidden">
            {/* Ambient Background Light */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#8B3DA5]/20 rounded-full blur-[120px]" />
            
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-[#C08FD0] text-xs font-black uppercase tracking-[0.3em] mb-6 block">Security Protocol</span>
                <h2 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.85]">
                  Your Assets, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C08FD0] to-white">In Vault.</span>
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { t: "Military-Grade Encryption", d: "AES-256 end-to-end scrambling." },
                    { t: "Elite Compliance", d: "PCI-DSS Level 1 & SOC2 Certified." },
                    { t: "Privacy First", d: "Zero-knowledge proof storage." }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 10 }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex gap-4 items-center"
                    >
                      <CheckCircle2 className="text-[#C08FD0]" size={20} />
                      <div>
                        <p className="text-white font-bold text-sm tracking-tight">{item.t}</p>
                        <p className="text-stone-500 text-xs">{item.d}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative flex justify-center items-center">
                <div className="absolute w-full h-full border border-white/5 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-[80%] h-[80%] border border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
                <div className="w-64 h-64 bg-stone-900 rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl relative z-10">
                  <Shield size={80} className="text-[#C08FD0]" />
                  <div className="absolute -bottom-4 -right-4 bg-[#8B3DA5] p-4 rounded-2xl shadow-xl">
                    <Zap size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA: MINIMAL & POWERFUL --- */}
      <section className="py-40 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mb-12 inline-block"
          >
            <div className="px-6 py-2 rounded-full border border-[#8B3DA5]/20 text-[#8B3DA5] text-[10px] font-black uppercase tracking-widest bg-[#8B3DA5]/5">
              Available Worldwide
            </div>
          </motion.div>
          
          <h2 className="text-6xl md:text-8xl font-black text-stone-900 mb-12 tracking-tighter leading-[0.9]">
            Build your <br/>
            <span className="text-[#8B3DA5] italic">Legacy.</span>
          </h2>

          <Link href="/dashboard/submit-application" className="relative inline-flex group">
            <div className="absolute -inset-4 bg-[#8B3DA5]/20 rounded-full blur-xl group-hover:bg-[#8B3DA5]/30 transition duration-500" />
            <div className="relative flex items-center gap-6 px-14 py-8 rounded-full bg-stone-900 text-white text-xl font-black uppercase tracking-widest hover:bg-[#8B3DA5] transition-all duration-500 shadow-2xl group-hover:scale-105">
              Apply Now
              <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
            </div>
          </Link>
          
          <p className="mt-12 text-stone-400 font-bold text-[10px] uppercase tracking-[0.5em]">
            Zero commitment • 24h Review • Global Access
          </p>
        </div>
      </section>

      {/* --- FOOTER: CLEAN & CORPORATE --- */}
     {/* --- REFINED FOOTER --- */}
      <footer className="pt-24 pb-12 border-t border-stone-100 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            {/* Logo Section */}
            <div className="flex flex-col gap-6">
              <div className="relative w-48 h-12">
                {/* Replace '/logo.png' with your actual image path */}
                <img 
                  src="/logo.png" 
                  alt="MerchantPro Elite Logo" 
                  className="object-contain"
                />
              </div>
              <p className="text-stone-400 text-xs font-medium leading-relaxed max-w-xs">
                Premium high-risk processing solutions for the modern global economy.
              </p>
            </div>

            {/* Quick Links / Website */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B3DA5]">Platform</h4>
              <a href="https://bizzpos.co" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-stone-900 font-bold text-sm hover:text-[#8B3DA5] transition-colors">
                bizzpos.co
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            </div>

            {/* Contact Details (Clean & Non-Link) */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B3DA5]">Get In Touch</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-stone-700 font-bold text-sm">
                  <Globe size={16} className="text-stone-400" />
                  <span>Email: info@bizzpos.co</span>
                </div>
                <div className="flex items-center gap-3 text-stone-700 font-bold text-sm">
                  <Shield size={16} className="text-stone-400" />
                  <span>Call Us: +1 (412) 634-5515</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="flex flex-col gap-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B3DA5]">Availability</h4>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 w-fit">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[11px] font-black text-stone-600 uppercase tracking-tighter">Mon - Fri Support</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">
              © 2026 MerchantPro Elite • Payment Excellence
            </p>
            
            {/* Payment Network Icons */}
            <div className="flex gap-8 opacity-20 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
               <span className="font-black italic text-sm tracking-tighter">VISA</span>
               <span className="font-black italic text-sm tracking-tighter">MASTERCARD</span>
               <span className="font-black italic text-sm tracking-tighter">AMEX</span>
               <span className="font-black italic text-sm tracking-tighter">STRIPE</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}