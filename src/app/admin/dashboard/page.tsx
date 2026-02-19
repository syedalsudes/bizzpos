'use client'

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Clock, CheckCircle, 
  Eye, FileText, X, ExternalLink, Star, ChevronRight 
} from "lucide-react";
import PremiumLoader from "@/components/PremiumLoader";

// 1. Typescript Interface for Application Data
interface MerchantApplication {
  id: string;
  business_name: string;
  dba_name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  owner_first_name: string;
  owner_last_name: string;
  tax_id: string;
  business_website: string;
  business_phone: string;
  ssn: string;
  drivers_license_url?: string;
  business_license_url?: string;
  void_check_url?: string;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // 2. State with Proper Types
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

  useEffect(() => {
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
  }, [user, router]);

  const updateStatus = async (id: string, newStatus: MerchantApplication['status']) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      // TypeScript fixed: 'prev' now correctly infers MerchantApplication[]
      setApps((prev: MerchantApplication[]) => 
        prev.map(a => a.id === id ? { ...a, status: newStatus } : a)
      );
      
      if (selectedApp?.id === id) {
        setSelectedApp((prev: MerchantApplication | null) => 
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } else {
      alert("Status update failed: " + error.message);
    }
  };

  if (loading || dataLoading) return (
    <PremiumLoader />
  );

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === 'pending').length,
    approved: apps.filter(a => a.status === 'approved').length,
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] relative overflow-hidden font-sans text-stone-900">
      {/* Background Blobs (Premium Landing Page Theme) */}
      <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm mb-4">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">Global Admin Portal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              User <span className="text-amber-600 underline decoration-amber-200">Messages.</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="bg-white px-8 py-5 rounded-[2rem] border border-stone-200 shadow-xl shadow-stone-200/20 flex items-center gap-10">
                <StatSimple label="Total Enrolled" value={stats.total} />
                <div className="w-px h-10 bg-stone-100" />
                <StatSimple label="Reviewing" value={stats.pending} color="text-amber-600" />
                <div className="w-px h-10 bg-stone-100" />
                <StatSimple label="Approved" value={stats.approved} color="text-stone-900" />
             </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-stone-200 shadow-2xl shadow-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-stone-50/50 border-b border-stone-100">
                <tr>
                  <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest text-stone-400">Business Identity</th>
                  <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest text-stone-400">Status</th>
                  <th className="px-10 py-7 text-[11px] font-black uppercase tracking-widest text-stone-400">Date Logged</th>
                  <th className="px-10 py-7 text-right text-[11px] font-black uppercase tracking-widest text-stone-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {apps.map(app => (
                  <tr key={app.id} className="group hover:bg-white transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-black text-base shadow-lg group-hover:bg-amber-600 group-hover:text-white transition-all">
                          {app.owner_first_name?.[0]}{app.owner_last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-black text-stone-900 text-lg leading-tight">{app.business_name || app.dba_name}</p>
                          <p className="text-xs text-stone-400 mt-1 font-bold tracking-tight">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-bold text-stone-600">
                        {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="inline-flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full font-black text-[10px] tracking-widest hover:bg-amber-600 transition-all hover:scale-105 shadow-xl shadow-stone-200"
                      >
                        REVIEW FILE <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-in Detail Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#FBF9F6] w-full max-w-6xl max-h-full rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-white relative">
            
            {/* Modal Header */}
            <div className="px-12 py-10 flex items-center justify-between border-b border-stone-200 bg-white/50">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-stone-900 flex items-center justify-center text-amber-400 shadow-2xl shadow-stone-400">
                   <ShieldCheck size={40} />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-2">{selectedApp.business_name || selectedApp.dba_name}</h2>
                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 bg-stone-100 rounded-full text-[10px] font-black uppercase tracking-widest text-stone-500 border border-stone-200">REF_ID: {selectedApp.id.slice(0,14)}</span>
                    <StatusBadge status={selectedApp.status} />
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-5 hover:bg-stone-100 rounded-full transition-all text-stone-400 hover:rotate-90">
                <X size={32} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Details Section */}
                <div className="lg:col-span-8 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <DetailCard title="Registration Info">
                      <DetailItem label="Legal Entity" value={selectedApp.business_name} />
                      <DetailItem label="DBA Name" value={selectedApp.dba_name} />
                      <DetailItem label="Tax ID / EIN" value={selectedApp.tax_id} />
                      <DetailItem label="Digital Presence" value={selectedApp.business_website} isLink />
                    </DetailCard>

                    <DetailCard title="Officer Profile">
                      <DetailItem label="Authorized Person" value={`${selectedApp.owner_first_name} ${selectedApp.owner_last_name}`} />
                      <DetailItem label="Corporate Email" value={selectedApp.email} />
                      <DetailItem label="Identification (SSN)" value={selectedApp.ssn} />
                      <DetailItem label="Support Phone" value={selectedApp.business_phone} />
                    </DetailCard>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-sm">
                     <h4 className="text-xs font-black text-amber-600 uppercase tracking-[0.2em] mb-8">Verification Assets</h4>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <DocLink label="Government ID" url={selectedApp.drivers_license_url} />
                        <DocLink label="Entity License" url={selectedApp.business_license_url} />
                        <DocLink label="Financial Proof" url={selectedApp.void_check_url} />
                     </div>
                  </div>
                </div>

                {/* Sticky Decision Sidebar */}
                <div className="lg:col-span-4">
                  <div className="bg-stone-900 p-10 rounded-[3rem] sticky top-0 shadow-3xl">
                    <h4 className="text-xs font-black text-amber-400 mb-8 uppercase tracking-[0.3em] text-center">Final Adjudication</h4>
                    <div className="space-y-4">
                      {(['pending', 'approved', 'rejected'] as const).map((statusOption) => (
                        <button
                          key={statusOption}
                          onClick={() => updateStatus(selectedApp.id, statusOption)}
                          className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 ${
                            selectedApp.status === statusOption
                            ? 'bg-amber-600 text-white shadow-2xl scale-[1.05] ring-4 ring-amber-600/20'
                            : 'bg-white/5 text-stone-500 hover:bg-white/10 hover:text-stone-200 border border-white/5'
                          }`}
                        >
                          {statusOption === selectedApp.status && "✓ "}
                          {statusOption}
                        </button>
                      ))}
                    </div>
                    <div className="mt-10 pt-10 border-t border-white/10">
                       <p className="text-[10px] text-stone-500 text-center italic leading-relaxed uppercase tracking-tighter">
                         Caution: Decisions are logged and synced with the merchant dashboard instantly.
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

// --- Sub-Components (Internal) ---

function StatSimple({ label, value, color = "text-stone-900" }: { label: string; value: number; color?: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: MerchantApplication['status'] }) {
  const styles = {
    approved: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200"
  };
  return (
    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${styles[status]}`}>
      {status}
    </span>
  );
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-sm hover:shadow-xl transition-shadow">
      <h4 className="text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> {title}
      </h4>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function DetailItem({ label, value, isLink }: { label: string; value: string; isLink?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase font-bold text-stone-300 tracking-[0.1em] mb-2">{label}</p>
      {isLink ? (
        <a href={value} target="_blank" className="text-base font-black text-amber-600 underline decoration-amber-200 hover:text-amber-700 transition-colors truncate block">
          {value || 'Not Provided'}
        </a>
      ) : (
        <p className="text-base font-black text-stone-800 truncate">{value || 'Not Provided'}</p>
      )}
    </div>
  );
}

function DocLink({ label, url }: { label: string; url?: string }) {
  if (!url) return (
    <div className="flex flex-col gap-3 p-8 rounded-[2rem] bg-stone-50 border border-stone-100 opacity-50 grayscale cursor-not-allowed">
      <FileText size={32} className="text-stone-300" />
      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{label} Missing</span>
    </div>
  );

  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex flex-col gap-4 p-8 rounded-[2rem] bg-stone-50 border border-stone-200 hover:border-amber-400 hover:bg-white hover:shadow-2xl hover:shadow-amber-100 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <ExternalLink size={20} className="text-amber-600" />
      </div>
      <FileText size={32} className="text-stone-300 group-hover:text-amber-600 transition-colors" />
      <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-tight">{label}</span>
      <span className="text-[9px] font-bold text-amber-600 tracking-tighter group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
        VERIFY DOCUMENT <ChevronRight size={10} />
      </span>
    </a>
  );
}