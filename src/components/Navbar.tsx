"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  ChevronDown,
  FileText,
  ShieldCheck,
  LogOut as LogOutIcon, // Renamed for clarity
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // DB se admin check karne ke liye state
  const dropdownRef = useRef<HTMLDivElement>(null);

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  const getInitial = () => {
    const name = user?.user_metadata?.full_name || user?.email || "?";
    return name.charAt(0).toUpperCase();
  };

  // User Auth aur Admin Check logic
  useEffect(() => {
    const checkUserAndAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Yahan hum DB se check kar rahe hain
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminData) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    checkUserAndAdmin();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const { data } = await supabase
            .from('admin_users')
            .select('user_id')
            .eq('user_id', currentUser.id)
            .maybeSingle();
          setIsAdmin(!!data);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Click outside dropdown logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    setIsAdmin(false);
  };

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="h-10 md:h-12 overflow-hidden rounded-xl bg-white border border-stone-200 shadow-sm">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-auto h-full object-contain md:object-cover select-none pointer-events-none"
              onError={(e) => (e.currentTarget.src = "https://ui-avatars.com/api/?name=M&background=8B3DA5&color=fff")}
            />
          </div>
        </Link>

        {/* Right Side Items */}
        <div className="flex items-center gap-6">
          {!user && !loading ? (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden md:block px-5 py-2.5 text-sm font-bold text-stone-600 hover:text-[#8B3DA5] transition-colors">Sign In</Link>
              <Link href="/signup" className="px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-stone-900 text-white text-xs md:text-sm font-bold hover:bg-[#8B3DA5] transition-all whitespace-nowrap">Get Started</Link>
            </div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all duration-500 ${isOpen ? "bg-stone-950 border-stone-950 shadow-xl" : "bg-white border-stone-200 hover:border-[#8B3DA5] hover:shadow-md"}`}
                >
                  <div className="relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="User" className="w-8 h-8 rounded-full object-cover ring-2 ring-white/10" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#8B3DA5] to-[#AA6ABD] text-white text-[10px] font-black shadow-inner">{getInitial()}</div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-[#C08FD0]' : 'text-stone-400'}`} />
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(139,61,165,0.15)] border border-stone-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right z-50">
                    <div className="p-6 bg-gradient-to-br from-stone-950 to-stone-800">
                      <div className="flex items-center gap-4">
                        {avatarUrl ? (
                          <img src={avatarUrl} className="w-14 h-14 rounded-2xl border-2 border-white/20 object-cover" alt="Profile" />
                        ) : (
                          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#8B3DA5] text-white font-black text-xl shadow-lg">{getInitial()}</div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-black text-white truncate uppercase tracking-tight">{user.user_metadata?.full_name || 'Premium Merchant'}</p>
                          <p className="text-xs text-stone-400 truncate font-medium">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 grid grid-cols-1 gap-1">
                      <DropdownLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Overview" onClick={() => setIsOpen(false)} />
                      <DropdownLink href="/dashboard/submit-application" icon={<FileText size={18} />} label="New Application" onClick={() => setIsOpen(false)} />

                      {/* --- DATABASE-DRIVEN ADMIN SECTION --- */}
                      {isAdmin && (
                        <div className="mt-2 pt-2 border-t border-stone-100">
                          <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-stone-400">Administration</p>
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[#8B3DA5] hover:bg-[#8B3DA5]/5 rounded-2xl transition-all group"
                          >
                            <div className="p-1.5 bg-[#8B3DA5]/10 rounded-xl group-hover:bg-[#8B3DA5]/20 transition-colors text-[#8B3DA5]">
                              <ShieldCheck size={18} />
                            </div>
                            Management Portal
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-stone-50 border-t border-stone-100">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100/50 rounded-2xl transition-all group">
                        <div className="p-1.5 bg-white border border-rose-100 rounded-xl group-hover:scale-110 transition-transform">
                          <LogOutIcon size={18} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

const DropdownLink = ({ href, icon, label, onClick }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-stone-600 hover:bg-stone-50 hover:text-stone-900 rounded-2xl transition-all group"
  >
    <div className="p-1.5 text-stone-400 group-hover:text-[#8B3DA5] group-hover:bg-[#8B3DA5]/10 rounded-xl transition-all">
      {icon}
    </div>
    {label}
  </Link>
);

export default Navbar;