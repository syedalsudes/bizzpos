'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import {
  Zap, FileText, Clock,
  Plus, ExternalLink, Building2,
  ChevronRight, Sparkles, Orbit,
  ArrowUpRight, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import PremiumLoader from "@/components/PremiumLoader";

interface Application {
  id: string;
  business_name: string;
  dba_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setApplications((data as Application[]) || []);
    setDataLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => loadData(), 10000);
    return () => clearInterval(interval);
  }, [user]);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-4 ring-emerald-50/50';
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100 ring-4 ring-amber-50/50';
      case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100 ring-4 ring-rose-50/50';
      default: return 'bg-stone-50 text-stone-600 border-stone-100';
    }
  };

  if (loading || dataLoading) return <PremiumLoader />;

  return (
    <div className="min-h-screen bg-[#fafafa] text-stone-900 font-sans selection:bg-[#8B3DA5]/10 selection:text-[#8B3DA5]">
      {/* Dynamic Background Elements */}
      <div className="fixed -top-[10%] -right-[10%] w-[500px] h-[500px] bg-[#8B3DA5]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[20%] -left-[5%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Modern Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#8B3DA5] to-[#C08FD0] rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-stone-950 p-2.5 rounded-xl text-white">
                <Zap size={20} className="fill-[#C08FD0] text-[#C08FD0]" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#8B3DA5] uppercase tracking-widest leading-none mb-1">Nexus</p>
              <h1 className="text-xl font-black tracking-tight uppercase leading-none">User Portal</h1>
            </div>
          </div>

          <Link
            href="/dashboard/submit-application"
            className="group relative flex items-center gap-2 px-6 py-3 bg-stone-950 text-white rounded-full font-bold text-[11px] uppercase tracking-wider hover:bg-[#8B3DA5] transition-all active:scale-95 shadow-xl shadow-stone-200 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Plus size={14} strokeWidth={3} /> New Enrollment
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-16 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-6">
            <ShieldCheck size={14} className="text-[#8B3DA5]" />
            <span className="text-[10px] font-bold uppercase tracking-tight text-stone-600">Secure Merchant Access</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-stone-900 leading-[1.1]">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B3DA5] to-[#C08FD0]">Home,</span>
          </h2>
          <p className="text-stone-500 mt-4 text-md font-medium max-w-xl">
            Everything you need to manage your business infrastructure in one workspace.
          </p>
        </div>

        {/* Section Label */}
        <div className="flex items-center gap-6 mb-10">
          <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.3em] whitespace-nowrap">Active Submissions</h4>
          <div className="h-px w-full bg-gradient-to-r from-stone-200 to-transparent"></div>
        </div>

        {applications.length === 0 ? (
          <div className="relative group overflow-hidden">
            {/* Background Glow for Empty State */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B3DA5]/5 to-transparent rounded-[3.5rem] -z-10" />

            <div className="bg-white/60 backdrop-blur-xl rounded-[3.5rem] border border-stone-200/60 p-12 md:p-20 text-center shadow-xl shadow-stone-200/20 relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                {/* Floating Icon Animation */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-[#8B3DA5]/20 blur-2xl rounded-full animate-pulse" />
                  <div className="relative bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center border border-stone-100 shadow-xl group-hover:scale-110 hover:bg-[#8B3DA5] transition-all duration-500">
                    <Plus size={32} className="text-[#8B3DA5] hover:text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <h3 className="text-3xl font-black text-stone-900 mb-3 tracking-tighter">Ready to Scale?</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-medium">
                  You haven&apos;t submitted any merchant applications yet. Start your journey with BizzPOS today.
                </p>

                <Link
                  href="/dashboard/submit-application"
                  className="group/btn relative inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-stone-950 text-white font-black text-[11px] uppercase tracking-widest hover:bg-[#8B3DA5] transition-all duration-300 shadow-xl shadow-stone-200 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    Submit First Application <ChevronRight size={16} />
                  </span>
                  {/* Button shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                </Link>
              </div>

              {/* Decorative Subtle Background Icon */}
              <Building2 className="absolute -bottom-10 -right-10 text-stone-100/50 -rotate-12" size={240} />
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="group relative bg-white rounded-[2.5rem] border border-stone-200/50 shadow-sm hover:shadow-2xl hover:shadow-[#8B3DA5]/10 hover:border-[#8B3DA5]/20 transition-all duration-500 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div className="flex items-center gap-8">
                  <div className="relative">
                    <div className="w-20 h-20 bg-stone-50 text-stone-900 flex items-center justify-center rounded-[2rem] border border-stone-100 group-hover:bg-stone-950 group-hover:text-[#C08FD0] transition-colors duration-500">
                      <Building2 size={32} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-stone-100 shadow-sm">
                      <Sparkles size={12} className="text-[#8B3DA5]" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-black text-stone-900 text-2xl tracking-tighter mb-2 group-hover:text-[#8B3DA5] transition-colors">
                      {app.business_name || app.dba_name || "Merchant Business"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-2.5 py-1 bg-stone-100 rounded-md text-[10px] font-bold text-stone-500 tracking-wider">
                        REF: {app.id.slice(0, 8).toUpperCase()}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
                        <Clock size={14} strokeWidth={2.5} />
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className={`px-6 py-2.5 rounded-full text-[10px] font-black border uppercase tracking-[0.15em] flex items-center gap-3 transition-all ${getStatusStyles(app.status)}`}>
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${app.status === 'approved' ? 'bg-emerald-400' :
                          app.status === 'rejected' ? 'bg-rose-400' : 'bg-amber-400'
                        }`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${app.status === 'approved' ? 'bg-emerald-500' :
                          app.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                        }`}></span>
                    </span>
                    {app.status}
                  </div>


                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modern Footer */}
      <footer className="text-center mx-auto px-6 pt-20 pb-12">
          <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.5em]">
            &copy; 2026 BizzPOS Secure Portal
          </p>
      </footer>
    </div>
  );
}