import { ExternalLink, Globe, Shield } from "lucide-react";

export default function Footer() {
    return (
        <footer className="pt-16 md:pt-24 pb-12 border-t border-stone-100 bg-[#FBFBFA]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Main Footer Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-20">

                    {/* Logo Section */}
                    <div className="flex flex-col gap-6 items-center md:items-start text-center md:text-left">
                        <div className="relative w-48 h-12">
                            {/* Replace '/logo.png' with your actual image path */}
                            <img
                                src="/logo.png"
                                alt="MerchantPro Elite Logo"
                                className="object-contain"
                            />
                        </div>
                        <p className="text-stone-600 text-xs font-medium leading-relaxed max-w-xs">
                            Premium high-risk and general both processing solutions for the modern global economy.
                        </p>
                    </div>

                    {/* Quick Links / Website */}
                    <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B3DA5]">Platform</h4>
                        <a href="https://bizzpos.co" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-stone-900 font-bold text-sm hover:text-[#8B3DA5] transition-colors">
                            bizzpos.co
                            <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all hidden md:block" />
                        </a>
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B3DA5]">Get In Touch</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start gap-3 text-stone-700 font-bold text-sm">
                                <Globe size={16} className="text-stone-400 shrink-0" />
                                <span>Email: info@bizzpos.co</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start gap-3 text-stone-700 font-bold text-sm">
                                <Shield size={16} className="text-stone-400 shrink-0" />
                                <span>Call Us: +1 (412) 634-5515</span>
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8B3DA5]">Availability</h4>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 w-fit">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[11px] font-black text-stone-600 uppercase tracking-tighter">24/7 Support</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em] text-center md:text-left">
                        © Bizzpos • Payment Excellence
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10  transition-all duration-500">

                        <div className="flex items-center gap-1">
                            <span className="font-black italic text-[14px] md:text-lg tracking-tighter text-[#1A1F71]">VISA</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="flex -space-x-2">
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#EB001B]" />
                                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#F79E1B] opacity-80" />
                            </div>
                            <span className="font-black italic text-[10px] md:text-xs tracking-tighter">MASTERCARD</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-[#016FD0] rounded-sm flex items-center justify-center">
                                <span className="text-[6px] text-white font-bold">AX</span>
                            </div>
                            <span className="font-black text-[10px] md:text-xs tracking-tight">AMEX</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <span className="font-black text-[12px] md:text-sm tracking-tighter text-stone-800">DISCOVER</span>
                            <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#FF6000]" />
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    )
}