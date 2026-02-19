'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { 
  LayoutDashboard, FileText, Clock, 
  CheckCircle2, AlertCircle, Plus,
  ExternalLink, Building2, ChevronRight, Star
} from "lucide-react";
import Link from "next/link";
import PremiumLoader from "@/components/PremiumLoader";

// Proper TypeScript Interface for UX Consistency
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
    const interval = setInterval(() => loadData(), 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, [user]);

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'pending': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'rejected': return 'bg-rose-500/10 text-rose-600 border-rose-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  if (loading || dataLoading) {
    return (
       <PremiumLoader />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-stone-900">
      {/* Background Aesthetic Blobs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-amber-100/30 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-[100px] -z-10" />

      {/* Top Navbar */}
      <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-stone-900 p-2 rounded-xl text-amber-400 shadow-lg shadow-stone-200">
              <LayoutDashboard size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase leading-none">User Portal</h1>
            </div>
          </div>
          
          <Link 
            href="/dashboard/submit-application"
            className="group flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-amber-600 transition-all hover:scale-105 shadow-xl shadow-stone-300"
          >
            <Plus size={14} strokeWidth={4} /> New Enrollment
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 relative">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 mb-4">
            <Star size={10} className="fill-amber-600 text-amber-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-amber-700">Account Verified</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-stone-900">
            Welcome <span className="text-amber-600">back,</span>
          </h2>
          <p className="text-stone-500 mt-3 font-medium italic">Monitor your application status and business integration in real-time.</p>
        </div>

        {/* Dashboard Section Label */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.4em] whitespace-nowrap">Submission History</span>
          <div className="h-px w-full bg-stone-200"></div>
        </div>

        {applications.length === 0 ? (
          /* Empty State UX */
          <div className="bg-white rounded-[3rem] border border-stone-200 p-20 text-center shadow-2xl shadow-stone-200/40 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
            <div className="bg-stone-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-stone-300 border border-stone-100 shadow-inner">
              <FileText size={40} />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-3 uppercase tracking-tight">Ready to Scale?</h3>
            <p className="text-stone-400 text-sm max-w-sm mx-auto mb-10 font-medium leading-relaxed">
              You haven't submitted any merchant applications yet. Let's get your business set up for global payments.
            </p>
            <Link 
              href="/dashboard/submit-application"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-stone-100 text-stone-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all hover:shadow-2xl"
            >
              Start Application <ChevronRight size={14} />
            </Link>
          </div>
        ) : (
          /* Application Cards */
          <div className="grid gap-5">
            {applications.map((app) => (
              <div 
                key={app.id} 
                className="group relative bg-white rounded-[2rem] border border-stone-200/60 shadow-sm hover:shadow-2xl hover:shadow-amber-900/5 hover:-translate-y-1 transition-all duration-500 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-stone-100 group-hover:bg-amber-500 transition-colors" />

                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-stone-900 text-amber-400 flex items-center justify-center rounded-2xl shadow-lg group-hover:bg-amber-600 group-hover:text-white transition-colors duration-500">
                    <Building2 size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-900 text-xl tracking-tighter leading-tight">
                      {app.business_name || app.dba_name || "Merchant Business"}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-100 rounded text-[9px] font-black text-stone-500 uppercase">
                        ID: {app.id.slice(0, 8)}
                      </div>
                      <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400">
                        <Clock size={12} />
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between md:justify-end">
                  <div className={`px-5 py-2 rounded-full text-[9px] font-black border uppercase tracking-widest flex items-center gap-2 ${getStatusStyles(app.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      app.status === 'approved' ? 'bg-emerald-500' : 
                      app.status === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                    {app.status}
                  </div>
                  
                  <button className="flex items-center justify-center w-12 h-12 bg-white rounded-full border border-stone-200 text-stone-400 hover:text-amber-600 hover:border-amber-300 hover:shadow-lg transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="max-w-4xl mx-auto px-6 pb-12 text-center">
        <p className="text-[10px] font-bold text-stone-700 uppercase tracking-[0.5em]">
          &copy; 2026 Merchant Secure Portal • All Rights Reserved
        </p>
      </footer>
    </div>
  );
}