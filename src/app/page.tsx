'use client'

import { motion } from "framer-motion";
import { 
  ArrowRight, Zap, Lock, ChevronRight, Star, 
  CheckCircle2, Globe, ShieldCheck, Shield 
} from 'lucide-react';
import Link from 'next/link';

// --- Animation Variants ---
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" }
  })
};

// --- UI Components ---

function FeatureCard({ icon, title, description, index }: { icon: React.ReactNode; title: string; description: string; index: number }) {
  return (
    <motion.div 
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative p-10 rounded-[2.5rem] border border-stone-200 bg-white hover:border-amber-400 hover:shadow-[0_40px_80px_-15px_rgba(180,130,50,0.12)] transition-all duration-500 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-amber-100 transition-colors" />
      <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center mb-8 shadow-xl group-hover:bg-amber-600 group-hover:scale-110 transition-all duration-500">
        <div className="text-amber-400 group-hover:text-white transition-colors">{icon}</div>
      </div>
      <h3 className="text-2xl font-black text-stone-900 mb-4 tracking-tighter">{title}</h3>
      <p className="text-stone-500 leading-relaxed font-medium group-hover:text-stone-700 transition-colors">{description}</p>
    </motion.div>
  );
}

function StatItem({ label, value, index }: { label: string; value: string; index: number }) {
  return (
    <motion.div 
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="text-center px-10"
    >
      <div className="text-4xl font-black text-stone-900 mb-2 tracking-tighter">{value}</div>
      <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">{label}</div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FBF9F6] text-stone-900 selection:bg-stone-900 selection:text-amber-400 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 flex flex-col items-center overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-amber-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-stone-200/50 rounded-full blur-[100px]" />
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-stone-200 shadow-xl mb-12"
          >
            <Star size={14} className="fill-amber-500 text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Industry Leader in High-Risk Processing</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-7xl lg:text-[110px] font-black leading-[0.9] tracking-[ -0.04em] mb-10"
          >
            Global <span className="text-amber-600">Wealth.</span><br />
            <span className="relative inline-block mt-4">
              Seamless Payments.
              <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 400 20" fill="none">
                <motion.path 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1, duration: 1.5 }}
                  d="M5 15C100 5 300 5 395 15" stroke="#F59E0B" strokeWidth="8" strokeLinecap="round" 
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-xl md:text-2xl text-stone-500 max-w-3xl mx-auto mb-16 font-medium leading-tight italic"
          >
            Empowering the next generation of global merchants with bulletproof security and instant liquidity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24"
          >
            <Link href="/signup" className="group px-12 py-6 rounded-full bg-stone-900 text-white font-black text-sm uppercase tracking-widest flex items-center gap-4 hover:bg-amber-600 transition-all hover:scale-105 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
              Open Your Account
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            

          </motion.div>

          {/* Premium Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 py-16 border-t border-stone-200">
            <StatItem label="Approval Rate" value="99.9%" index={1} />
            <StatItem label="Live Support" value="24/7" index={2} />
            <StatItem label="API Uptime" value="100%" index={3} />
            <StatItem label="Zero Fraud" value="Elite" index={4} />
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION WITH SCROLL REVEAL --- */}
      <section className="py-40 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6">Designed for <span className="text-amber-600">Velocity.</span></h2>
            <p className="text-stone-400 font-bold uppercase tracking-[0.4em] text-xs">Modern Infrastructure • Global Compliance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureCard 
              index={1}
              icon={<ShieldCheck size={32} />}
              title="Identity Vault"
              description="Our proprietary KYC engine verifies international entities in under 60 seconds."
            />
            <FeatureCard 
              index={2}
              icon={<Zap size={32} />}
              title="Lightning Settlement"
              description="Why wait days? Access your funds faster with our express liquidity protocols."
            />
            <FeatureCard 
              index={3}
              icon={<Globe size={32} />}
              title="Borderless Reach"
              description="Accept payments from any corner of the globe with zero conversion friction."
            />
          </div>
        </div>
      </section>

      {/* --- DARK SECURITY SECTION (The Impression Maker) --- */}
      <section className="py-24 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto bg-stone-950 rounded-[4rem] p-16 lg:p-32 relative overflow-hidden"
        >
          {/* Internal Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="inline-block px-4 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest mb-8">Military Grade</div>
              <h2 className="text-5xl lg:text-7xl font-black text-white mb-10 leading-[0.9] tracking-tighter">Your Assets, <br />In <span className="text-amber-500">Vault.</span></h2>
              <div className="space-y-8">
                {[
                  { t: "Encryption", d: "AES-256 end-to-end data scrambling." },
                  { t: "Compliance", d: "Fully PCI-DSS Level 1 & SOC2 certified." },
                  { t: "Privacy", d: "Zero-knowledge proof document storage." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <CheckCircle2 className="text-amber-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-white font-black uppercase text-xs tracking-widest mb-1">{item.t}</h4>
                      <p className="text-stone-500 text-sm font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative flex justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-dashed border-amber-500/20 rounded-full"
              />
              <div className="w-80 h-80 bg-gradient-to-br from-amber-500 to-amber-700 rounded-[3rem] flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.4)]">
                <Shield size={140} className="text-stone-950" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-40 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-6xl md:text-8xl font-black text-stone-900 mb-10 tracking-[ -0.05em]">Start your <span className="text-amber-600">Legacy.</span></h2>
          <Link href="/signup" className="inline-flex items-center gap-6 px-16 py-8 rounded-full bg-stone-900 text-white text-xl font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-2xl hover:scale-105 group">
            Apply Now
            <ChevronRight size={28} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-12 text-stone-400 font-bold text-xs uppercase tracking-widest">No credit card required for initial review</p>
        </motion.div>
      </section>

      <footer className="py-16 border-t border-stone-200 bg-stone-50 text-center">
        <div className="flex justify-center gap-12 mb-8 opacity-30 grayscale font-black text-xl italic tracking-tighter">
           <span>VISA</span> <span>MASTERCARD</span> <span>STRIPE</span> <span>AMEX</span>
        </div>
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 MerchantPro Elite • Payment Excellence</p>
      </footer>
    </main>
  );
};

