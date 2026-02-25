'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, FileText, X, ExternalLink, 
  Star, ChevronRight, Inbox, Search, CheckCircle2
} from "lucide-react";
import PremiumLoader from "@/components/PremiumLoader";

// 1. Updated Interface to match your Form Data
interface MerchantApplication {
  id: string;
  user_id: string;
  business_name: string; 
  dba_name: string;
  business_phone: string;
  business_website: string;
  business_address: string;
  shipping_address: string;
  tax_id: string;
  owner_first_name: string;
  owner_last_name: string;
  personal_phone: string;
  email: string;
  ssn: string;
  drivers_license_url?: string;
  business_license_url?: string;
  void_check_url?: string;
  additional_doc_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [apps, setApps] = useState<MerchantApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<MerchantApplication | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchApps = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (!error) {
      setApps((data as MerchantApplication[]) || []);
    }
    setDataLoading(false);
  };

  // Admin Check Logic (Using DB instead of ENV)
  useEffect(() => {
    if (!user && !loading) {
        router.replace("/login");
        return;
    }
    if (!user) return;

    const checkAdminAndLoad = async () => {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!admin) {
        router.replace("/");
        return;
      }
      await fetchApps();
    };
    checkAdminAndLoad();
  }, [user, loading, router]);

  const updateStatus = async (id: string, newStatus: MerchantApplication['status']) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setApps((prev) => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      if (selectedApp?.id === id) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
      }
    }
  };

  if (loading || dataLoading) return <PremiumLoader />;

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-[#fafafa] relative overflow-hidden font-sans text-stone-900">
      {/* Premium Background Accents */}
      <div className="absolute top-0 -left-20 w-[600px] h-[600px] bg-[#8B3DA5]/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header & Stats Card */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200 shadow-sm mb-4">
              <Star size={10} className="fill-[#8B3DA5] text-[#8B3DA5]" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500">Admin Dashboard</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-none text-stone-950">
              Merchant <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B3DA5] to-[#C08FD0]">Applications.</span>
            </h1>
          </div>
          
          <div className="flex items-center bg-white p-2 rounded-[2.5rem] border border-stone-200 shadow-xl shadow-stone-200/40">
            <StatSimple label="Total" value={stats.total} />
            <div className="w-px h-8 bg-stone-100 mx-2" />
            <StatSimple label="Pending" value={stats.pending} color="text-amber-500" />
            <div className="w-px h-8 bg-stone-100 mx-2" />
            <StatSimple label="Active" value={stats.approved} color="text-emerald-500" />
          </div>
        </div>

        {/* Main Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-stone-200/60 shadow-2xl shadow-stone-200/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50/50 border-b border-stone-100">
                <tr>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-stone-400">Merchant Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-stone-400">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-stone-400">Submission Date</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest text-stone-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {apps.length > 0 ? (
                  apps.map(app => (
                    <tr key={app.id} className="group hover:bg-stone-50/50 transition-all duration-300">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-stone-950 text-[#C08FD0] flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                            {app.owner_first_name?.[0]}{app.owner_last_name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900 text-base leading-tight">{app.dba_name || app.business_name}</p>
                            <p className="text-xs text-stone-400 font-medium">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-tighter">
                          {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="p-3 bg-stone-100 text-stone-900 rounded-xl hover:bg-[#8B3DA5] hover:text-white transition-all active:scale-90"
                        >
                          <ChevronRight size={18} strokeWidth={3} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-4 border border-stone-100">
                          <Inbox size={32} className="text-stone-200" />
                        </div>
                        <h3 className="text-xl font-black text-stone-900 tracking-tight">No Applications Yet</h3>
                        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Waiting for new enrollments...</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal - Clean Slide-up/Fade */}
      {selectedApp && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 bg-stone-950/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl h-[95vh] md:h-auto md:max-h-[90vh] rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-stone-200 relative animate-in slide-in-from-bottom-10 duration-500">
            
            <div className="px-8 py-6 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#8B3DA5] flex items-center justify-center text-white shadow-lg">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-stone-900 tracking-tight">{selectedApp.dba_name}</h2>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Case Review Mode • ID: {selectedApp.id.slice(0,8)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-3 hover:bg-stone-100 rounded-full transition-all text-stone-400 hover:text-stone-900">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#fafafa]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Business Details Section */}
                  <DetailCard title="Business Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailItem label="DBA / Business Name" value={selectedApp.dba_name} />
                      <DetailItem label="Business Phone" value={selectedApp.business_phone} />
                      <DetailItem label="Tax ID / EIN" value={selectedApp.tax_id} />
                      <DetailItem label="Business Website" value={selectedApp.business_website} isLink />
                      <div className="md:col-span-2">
                         <DetailItem label="Business Address" value={selectedApp.business_address} />
                      </div>
                      <div className="md:col-span-2">
                         <DetailItem label="Shipping Address" value={selectedApp.shipping_address || "Same as business address"} />
                      </div>
                    </div>
                  </DetailCard>

                  {/* Personal Details Section */}
                  <DetailCard title="Owner Profile">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <DetailItem label="First Name" value={selectedApp.owner_first_name} />
                      <DetailItem label="Last Name" value={selectedApp.owner_last_name} />
                      <DetailItem label="Email Address" value={selectedApp.email} />
                      <DetailItem label="Personal Cell" value={selectedApp.personal_phone} />
                      <div className="md:col-span-2">
                        <DetailItem label="Social Security Number (SSN)" value={selectedApp.ssn} />
                      </div>
                    </div>
                  </DetailCard>

                  {/* Documents Section */}
                  <div className="bg-white p-8 rounded-[2rem] border border-stone-200">
                     <h4 className="text-[10px] font-black text-[#8B3DA5] uppercase tracking-[0.2em] mb-6">Verification Documents</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <DocLink label="Driver License" url={selectedApp.drivers_license_url} />
                        <DocLink label="Business License" url={selectedApp.business_license_url} />
                        <DocLink label="Void Check" url={selectedApp.void_check_url} />
                        <DocLink label="Additional" url={selectedApp.additional_doc_url} />
                     </div>
                  </div>

                  {/* Terms Authorization Note */}
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-800 uppercase tracking-[0.15em]">Legal Authorization</p>
                        <p className="text-xs text-emerald-700/80 font-medium mt-1 leading-relaxed">
                          The applicant has authorized Bizz POS to process merchant services as per agreed terms (Lease/Own/Rent/Buyout) by digital submission of this form.
                        </p>
                    </div>
                  </div>
                </div>

                {/* Sticky Decision Sidebar */}
                <div className="space-y-6">
                  <div className="bg-stone-950 p-8 rounded-[2.5rem] shadow-xl text-center sticky top-0">
                    <h4 className="text-[10px] font-black text-[#C08FD0] mb-6 uppercase tracking-[0.3em]">Decision Center</h4>
                    <div className="space-y-3">
                      {(['pending', 'approved', 'rejected'] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedApp.id, status)}
                          className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                            selectedApp.status === status
                            ? 'bg-[#8B3DA5] text-white shadow-lg scale-[1.02]'
                            : 'bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-300'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-[9px] font-medium text-stone-500 uppercase tracking-widest leading-loose">
                            Update status to notify the merchant via their dashboard.
                        </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Internal Helper Components ---

function StatSimple({ label, value, color = "text-stone-900" }: { label: string; value: number; color?: string }) {
  return (
    <div className="px-6 py-2 text-center">
      <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-2xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: MerchantApplication['status'] }) {
  const styles = {
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100"
  };
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status]}`}>
      {status}
    </span>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-stone-200">
      <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-6 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#8B3DA5]" /> {title}
      </h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DetailItem({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <p className="text-[8px] uppercase font-black text-stone-300 tracking-[0.15em] mb-1">{label}</p>
      {isLink && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#8B3DA5] hover:underline truncate block">
          {value}
        </a>
      ) : (
        <p className="text-xs font-bold text-stone-800 truncate">{value || 'N/A'}</p>
      )}
    </div>
  );
}

function DocLink({ label, url }: { label: string; url?: string }) {
  if (!url) return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-stone-100/50 border border-dashed border-stone-200 opacity-50 grayscale">
      <FileText size={24} className="text-stone-300 mb-2" />
      <span className="text-[8px] font-black text-stone-400 uppercase">Missing</span>
    </div>
  );

  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#8B3DA5] hover:shadow-lg transition-all group">
      <FileText size={24} className="text-stone-300 group-hover:text-[#8B3DA5] mb-2" />
      <span className="text-[8px] font-black text-stone-500 uppercase text-center leading-tight mb-2">{label}</span>
      <span className="text-[8px] font-black text-[#8B3DA5] uppercase tracking-widest">Open File</span>
    </a>
  );
}