'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  Settings2,
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import MenuBuilder from "@/components/menu-builder";
import AppSidebar from "@/components/app-sidebar";

export default function POSPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <AppSidebar currentPath="/pos" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4 z-20">
          <div className="flex items-center gap-4 flex-1">
             <div className="flex items-center bg-white border border-slate-200 rounded-[15px] overflow-hidden h-10 w-full max-w-2xl transition-all">
              <div className="flex items-center flex-1 px-3.5 relative">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Order #, table, customer name, email, phone..." 
                  className="border-none shadow-none text-[13px] h-full placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-transparent"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  onFocus={() => setIsHeaderSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsHeaderSearchFocused(false), 200)}
                />
              </div>
              <div className="w-[1px] h-6 bg-slate-200 shrink-0" />
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-2 px-4 h-full text-[13px] font-medium text-slate-600 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">Last {lookbackWindow}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-[180px] p-2.5 rounded-none border-slate-100 shadow-xl" align="end">
                   <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block px-1">LOOKBACK WINDOW</span>
                    <div className="grid grid-cols-3 gap-1">
                      {['1 W', '1 M', '3 M', '6 M', '1 Y', '3 Y'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setLookbackWindow(option)}
                          className={cn(
                            "h-7 rounded-none border text-[10px] font-bold transition-all",
                            lookbackWindow === option 
                              ? "bg-[#0CB5A8]/5 border-[#0CB5A8] text-[#0CB5A8]" 
                              : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-[10px] font-bold bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-400 hover:bg-[#0CB5A8]/10 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-all cursor-default group/pos">
              <RefreshCcw className="w-3 h-3 text-slate-400 group-hover/pos:text-[#0CB5A8] transition-colors" />
              <span className="uppercase tracking-tight">POS SYNCED</span>
            </div>
            <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
              <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable POS Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-7xl mx-auto space-y-12">
            
            {/* Page Header */}
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">POS Integration</h1>
              <p className="text-[15px] text-slate-400 font-medium">Link your physical terminal to automate your digital menu.</p>
            </div>

            {/* Main Content Area - Grid with the POS Card */}
            <div className="flex flex-col md:flex-row gap-8">
              {/* POS Status Card */}
              <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10 w-full max-w-md flex flex-col">
                {/* Header Row */}
                <div className="flex items-start justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-[18px] border border-slate-100 flex items-center justify-center bg-white shadow-sm">
                         {/* Symphony Icon Placeholder */}
                         <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0CB5A8]">
                            <rect x="3" y="15" width="18" height="6" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M7 15V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <rect x="10" y="8" width="4" height="2" rx="1" fill="currentColor"/>
                         </svg>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-black text-slate-900 leading-tight">SYMPHONY</h2>
                        <span className="text-[12px] font-medium text-slate-400">Emenu</span>
                      </div>
                   </div>

                   <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                      <Settings2 className="w-4 h-4 text-slate-300 cursor-pointer hover:text-slate-400 transition-colors" />
                      <Badge className="bg-[#0CB5A8] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-none shadow-sm">
                        Live
                      </Badge>
                   </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mt-10">
                   <div className="bg-white border border-slate-100 rounded-[20px] p-5 space-y-1.5 shadow-sm">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">OPERATIONAL</p>
                      <p className="text-[16px] font-black text-slate-900">Active</p>
                   </div>
                   <div className="bg-white border border-slate-100 rounded-[20px] p-5 space-y-1 shadow-sm">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">LAST DATA SYNC</p>
                      <div className="flex flex-col">
                        <p className="text-[16px] font-black text-slate-900 leading-tight">6:08 PM</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-tight">07/07/2026</p>
                      </div>
                   </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 mt-10">
                   <Button variant="ghost" className="bg-red-50 hover:bg-red-100 text-red-500 font-black text-[12px] uppercase tracking-wide h-10 px-6 rounded-xl transition-all shadow-sm shadow-red-500/5">
                      Configure
                   </Button>
                   <Button className="bg-[#E2F5F3] hover:bg-[#D1EFED] text-[#0CB5A8] font-black text-[12px] uppercase tracking-wide h-10 px-6 rounded-xl transition-all flex items-center gap-2 shadow-sm shadow-[#0CB5A8]/5">
                      <RefreshCw className="w-4 h-4" />
                      Sync POS
                   </Button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <MenuBuilder open={isMenuBuilderOpen} onOpenChange={setIsMenuBuilderOpen} />
    </div>
  );
}
