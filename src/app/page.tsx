'use client'

import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight, Zap, Globe, ShieldCheck,
  CreditCard, Monitor, Smartphone, Mail,
  Repeat, CheckCircle2, Star, ShoppingCart,
  UserCheck, BadgePercent, Clock
} from 'lucide-react';
import Link from 'next/link';
import Footer from "../components/Footer";

// --- Feature Card Component (Bento Style) ---
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
      className="group relative p-6 md:p-8 rounded-[2rem] border border-stone-200 bg-white hover:border-[#8B3DA5]/30 transition-all duration-500 overflow-hidden h-full"
    >
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
        <h3 className="text-xl font-black text-stone-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-stone-500 leading-relaxed text-sm font-medium">{description}</p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-stone-900 overflow-x-hidden">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-16 md:pt-20 pb-24 md:pb-32 flex flex-col items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-stone-200 shadow-xl mb-12"
          >
            <Star size={14} className="fill-[#8B3DA5] text-[#8B3DA5]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8189B3]">Registered ISO of Wells Fargo Bank, N.A.</span>
          </motion.div>

          <motion.h1 className="text-4xl sm:text-6xl lg:text-[100px] font-black leading-[1.1] md:leading-[0.9] tracking-[-0.04em] mb-10">
            Digital <span className="text-[#8B3DA5]">Dominance.</span><br className="hidden md:block" />
            <span className="relative inline-block mt-4">
              Business Excellence.
              <svg className="absolute -bottom-4 left-0 w-full" viewBox="0 0 400 20" fill="none">
                <path d="M5 15C100 5 300 5 395 15" stroke="#AA6ABD" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p className="text-lg md:text-2xl text-[#8189B3] max-w-3xl mx-auto mb-16 font-medium leading-tight italic px-4">
            Empowering retailers with streamlined transactions, bulletproof security, and the most competitive processing fees in the industry.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-24">
            <Link href="/dashboard" className="w-full sm:w-auto group px-12 py-6 rounded-full bg-stone-900 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:bg-[#8B3DA5] transition-all hover:scale-105 shadow-2xl">
              View Dashboard
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <div className="text-stone-400 font-bold text-sm">+1 (412) 634-5515</div>
          </div>
        </div>
      </section>

      {/* --- PRODUCT GRID (BENTO) --- */}
      <section className="py-20 md:py-32 bg-[#FBFBFA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 italic text-center md:text-left">
              Payment <span className="text-[#8B3DA5]">Products.</span>
            </h2>
            <p className="text-stone-500 font-medium text-lg text-center md:text-left">Comprehensive solutions for retail, restaurants, and e-commerce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-12 lg:col-span-8">
              <FeatureCard
                index={0}
                icon={<Monitor size={28} />}
                title="POS (Point-of-Sale) Solutions"
                description="Tailored systems for restaurants and retailers. Select from mobile or countertop configurations with integrated management, printers, and scanners."
              />
            </div>
            <div className="md:col-span-12 lg:col-span-4">
              <FeatureCard
                index={1}
                icon={<CreditCard size={28} />}
                title="Top-Tier Machines"
                description="High-quality hardware featuring chip & pin, tap-to-pay, and swipe capabilities for universal acceptance."
              />
            </div>
            <div className="md:col-span-12 lg:col-span-4">
              <FeatureCard
                index={2}
                icon={<ShoppingCart size={28} />}
                title="E-Commerce & APIs"
                description="Integrate credit card processing directly into your website or shopping cart with our robust online gateway."
              />
            </div>
            <div className="md:col-span-12 lg:col-span-4">
              <FeatureCard
                index={3}
                icon={<Mail size={28} />}
                title="Email Invoicing"
                description="Simplify collections with personalized invoices sent directly to inboxes for rapid fund transfers."
              />
            </div>
            <div className="md:col-span-12 lg:col-span-4">
              <FeatureCard
                index={4}
                icon={<Repeat size={28} />}
                title="Recurring Billing"
                description="Create personalized subscription plans with flexible installment options and full payment control."
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE BIZZPOS --- */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">
                Why Merchants <br /><span className="text-[#8B3DA5]">Choose Bizz POS</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: <BadgePercent className="text-[#8B3DA5]" />, t: "Wholesale-Rate Membership", d: "Transparent pricing structures that pass significant savings directly to you." },
                  { icon: <Clock className="text-[#8B3DA5]" />, t: "Lightning Fast Deposits", d: "Same-day financing and onboarding in a matter of hours." },
                  { icon: <UserCheck className="text-[#8B3DA5]" />, t: "No Binding Agreements", d: "Enjoy the freedom of no enforceable contracts or exorbitant cancellation costs." },
                  { icon: <Globe className="text-[#8B3DA5]" />, t: "Total Transparency", d: "Navigate a seamless journey with clear processes and financial clarity." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-3xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                    <div className="shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="font-black text-lg mb-1">{item.t}</h4>
                      <p className="text-stone-500 text-sm font-medium">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-[#8B3DA5] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Zap size={200} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-6">Mastering Business Excellence</h3>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Our objective is to minimize processing expenses to the point of elimination.
                  We believe accepting payments is currently excessively costly—we're here to change that.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">PCI-DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl border border-white/20">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">24/7 Dedicated Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUST & LEGAL: PREMIUM VAULT DESIGN --- */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-stone-950" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, #8B3DA5 0%, transparent 70%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="mb-10 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl"
            >
              <ShieldCheck size={48} className="text-[#C08FD0]" />
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-black text-white mb-12 tracking-tighter text-center px-4">
              Enterprise-Grade <br />
              <span className="text-[#C08FD0]">Compliance & Security.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md text-left">
                <p className="text-[#C08FD0] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Banking Partner</p>
                <p className="text-stone-300 text-sm leading-relaxed font-medium">
                  Bizz POS legal entity <span className="text-white font-bold">Bizz POS LLC</span> is a registered ISO of <span className="text-white font-bold">Wells Fargo Bank, N.A.</span>, Concord, CA. American Express may require separate approval.
                </p>
              </div>

              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-md text-left">
                <p className="text-[#C08FD0] text-[10px] font-black uppercase tracking-[0.4em] mb-4">Trademark Notice</p>
                <p className="text-stone-300 text-sm leading-relaxed font-medium">
                  The <span className="text-white font-bold">Clover</span> trademark and logo are owned by Clover Network, Inc., a First Data company. All other trademarks, service marks and trade names are the property of their respective owners.
                </p>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="mt-16 pt-8 border-t border-white/10 w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6"
            >
              <div className="flex flex-wrap justify-center gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-white font-black italic tracking-tighter text-xl">VISA</span>
                <span className="text-white font-black italic tracking-tighter text-xl">Mastercard</span>
                <span className="text-white font-black italic tracking-tighter text-xl">AMEX</span>
                <span className="text-white font-black italic tracking-tighter text-xl">Clover</span>
              </div>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-[0.2em] text-center">
                © 2023 Bizz POS LLC • All Rights Reserved
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8B3DA5] to-transparent opacity-50" />
      </section>

      {/* --- CTA: HIGH-CONVERSION APPLICATION SECTION --- */}
      <section className="py-24 md:py-40 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative bg-stone-900 rounded-[2.5rem] md:rounded-[4rem] p-10 md:p-24 overflow-hidden border border-white/10 shadow-2xl">

            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#8B3DA5]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-[#8B3DA5]/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8"
              >
                <span className="px-6 py-2 rounded-full border border-white/20 text-[#C08FD0] text-[10px] font-black uppercase tracking-[0.3em] bg-white/5">
                  Instant Onboarding
                </span>
              </motion.div>

              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black text-white mb-10 tracking-tighter leading-[1.1] md:leading-[0.9]">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C08FD0] to-white italic">Transform</span> <br />
                Your Business?
              </h2>

              <p className="text-stone-400 text-base md:text-xl max-w-2xl mb-12 font-medium">
                Apply today and join thousands of merchants who have eliminated hidden fees.
                The application takes less than 5 minutes.
              </p>

              <div className="flex flex-col items-center gap-8 w-full">
                <Link href="/dashboard/submit-application" className="w-full sm:w-auto group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#8B3DA5] to-[#C08FD0] rounded-full blur opacity-60 group-hover:opacity-100 transition duration-500" />

                  <div className="relative flex items-center justify-center gap-6 px-8 py-6 md:px-16 md:py-9 rounded-full bg-white text-stone-900 text-lg md:text-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all duration-300">
                    Start Application
                    <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-12 mt-8">
                  {[
                    { t: "Zero Setup Cost", d: "Start for $0 today" },
                    { t: "24h Review", d: "Fast-track approval" },
                    { t: "Global Access", d: "All major cards" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span className="text-white font-black text-sm uppercase tracking-widest mb-1 text-center">{item.t}</span>
                      <span className="text-[#8B3DA5] text-xs font-bold text-center">{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}