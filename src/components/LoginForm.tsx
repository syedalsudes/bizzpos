"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }
    router.push("/");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/` },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4 md:p-6 font-sans relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8B3DA5 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Main Card: Mobile responsive padding and radius */}
      <div className="w-full max-w-md relative z-10 bg-white p-6 sm:p-8 lg:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(139,61,165,0.1)] border border-stone-100">        

        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight mb-2">Welcome <span className="text-[#8B3DA5]">Back</span></h2>
          <p className="text-[#8189B3] text-xs md:text-sm font-medium">Authorized access to the merchant portal.</p>
        </div>

        {/* Google Login */}
        <button 
          type="button"
          onClick={handleGoogle} 
          className="group w-full flex items-center justify-center gap-3 px-4 py-3 md:py-3.5 bg-white border border-stone-200 rounded-2xl font-bold text-stone-700 hover:border-[#8B3DA5] hover:shadow-xl hover:shadow-[#8B3DA5]/5 transition-all duration-300 mb-6 md:mb-8 text-sm md:text-base"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6 md:mb-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone-100"></span></div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-stone-300"><span className="bg-white px-4 md:px-6">Direct Access</span></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-3 md:space-y-4">
            <div className="group">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#8B3DA5] transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address" 
                  required
                  className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-[#F7F7F6] border border-stone-100 rounded-2xl focus:bg-white focus:border-[#8B3DA5] focus:ring-4 focus:ring-[#8B3DA5]/5 outline-none transition-all font-semibold text-stone-900 placeholder:text-stone-400 text-sm md:text-base" 
                />
              </div>
            </div>

            <div className="group">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#8B3DA5] transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Security Password" 
                  required
                  className="w-full pl-12 pr-6 py-3.5 md:py-4 bg-[#F7F7F6] border border-stone-100 rounded-2xl focus:bg-white focus:border-[#8B3DA5] focus:ring-4 focus:ring-[#8B3DA5]/5 outline-none transition-all font-semibold text-stone-900 placeholder:text-stone-400 text-sm md:text-base" 
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-3.5 md:py-4 bg-stone-900 text-white rounded-2xl font-black text-base md:text-lg hover:bg-[#8B3DA5] transition-all duration-500 flex items-center justify-center gap-3 mt-4 md:mt-6 shadow-xl shadow-stone-200 disabled:opacity-50 active:scale-[0.98] group"
          >
            {loading ? "Verifying..." : "Authorized Sign In"} 
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-6 md:mt-8 text-center text-stone-500 font-bold text-[10px] md:text-xs tracking-wide">
          NEW TO THE NETWORK?{" "}
          <Link href="/signup" className="text-[#8B3DA5] hover:text-[#AA6ABD] transition-colors underline decoration-[#C08FD0] underline-offset-4">
            ESTABLISH ACCOUNT
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;