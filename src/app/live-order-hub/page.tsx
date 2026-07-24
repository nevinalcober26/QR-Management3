
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  Plus, 
  Grid3X3, 
  Users, 
  Settings, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  HelpCircle,
  ClipboardList,
  Plug,
  BookOpen,
  History,
  ZoomIn,
  ZoomOut,
  Armchair
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from 'next/link';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active = false, hasAdd = false, href = "#" }: { icon: any, label: string, active?: boolean, hasAdd?: boolean, href?: string }) => (
  <Link href={href} className="px-4 py-0.5 block">
    <div className={cn(
      "group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all rounded-xl",
      active ? "bg-[#0CB5A8]/10 text-[#0CB5A8]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
    )}>
      <div className="flex items-center gap-3">
        <Icon className={cn("w-[18px] h-[18px]", active ? "text-[#0CB5A8]" : "text-slate-400 group-hover:text-slate-600")} />
        <span className={cn("text-[13px] font-semibold tracking-tight")}>{label}</span>
      </div>
      {hasAdd && (
        <div className="border border-slate-200 rounded w-4.5 h-4.5 flex items-center justify-center bg-white shadow-sm">
          <Plus className="w-2.5 h-2.5 text-slate-400" />
        </div>
      )}
    </div>
  </Link>
);

const SidebarSectionLabel = ({ label }: { label: string }) => (
  <div className="px-8 py-3.5 mt-2 first:mt-0 text-[11px] font-bold text-slate-400/80 uppercase tracking-[0.15em]">
    {label}
  </div>
);

const SidebarDivider = () => (
  <div className="px-8 py-2">
    <div className="border-t border-dotted border-slate-200 w-full" />
  </div>
);

const FilterBadge = ({ label, count, colorClass }: { label: string, count: number, colorClass: string }) => (
  <div className="flex items-center gap-2.5 px-3 py-1.5 cursor-pointer hover:bg-slate-50 rounded-full transition-colors group">
    <div className={cn("w-2 h-2 rounded-full", colorClass)} />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">{label}</span>
    <span className="text-[10px] font-black text-slate-900">{count}</span>
  </div>
);

export default function LiveOrderHubPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');

  useEffect(() => {
    setMounted(true);
  }, []);

  const smartSearchResults = useMemo(() => {
    if (!headerSearchQuery) return [];
    const query = headerSearchQuery.toLowerCase();
    const mockData = [
      { type: 'Order', value: '#10293', sub: 'Jul 15, 2024' },
      { type: 'Table', value: 'Table 24', sub: 'Dining area' },
      { type: 'Customer', value: 'John Smith', sub: 'john.smith@example.com' },
    ];
    return mockData.filter(item => item.value.toLowerCase().includes(query));
  }, [headerSearchQuery]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white flex flex-col shrink-0 border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-6 flex items-center justify-center">
          <svg width="122" height="39" viewBox="0 0 122 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8.81641" y="0.482422" width="40.2279" height="4.95961" fill="#0CB5A8"/>
            <rect x="8.81641" y="12.0547" width="19.8384" height="4.95961" fill="#0CB5A8"/>
            <rect x="8.81641" y="23.6289" width="9.91922" height="4.95961" fill="#0CB5A8"/>
            <rect y="23.6289" width="5.51067" height="4.95961" fill="#0CB5A8"/>
            <rect y="12.0547" width="5.51067" height="4.95961" fill="#0CB5A8"/>
            <rect y="0.482422" width="5.51067" height="4.95961" fill="#0CB5A8"/>
            <path d="M47.5498 21.1168C47.5498 21.526 47.5243 21.9523 47.4731 22.3956H37.5756C37.6438 23.2822 37.9251 23.9642 38.4196 24.4416C38.9311 24.9019 39.5534 25.1321 40.2865 25.1321C41.3777 25.1321 42.1365 24.6717 42.5627 23.751H47.2174C46.9787 24.6888 46.5439 25.5328 45.913 26.283C45.2992 27.0332 44.5235 27.6214 43.5857 28.0476C42.648 28.4739 41.5994 28.687 40.44 28.687C39.0419 28.687 37.7972 28.3886 36.706 27.7919C35.6148 27.1951 34.7623 26.3426 34.1485 25.2344C33.5347 24.1261 33.2278 22.8303 33.2278 21.347C33.2278 19.8636 33.5262 18.5678 34.1229 17.4596C34.7367 16.3513 35.5892 15.4988 36.6805 14.9021C37.7717 14.3053 39.0248 14.0069 40.44 14.0069C41.821 14.0069 43.0486 14.2968 44.1228 14.8765C45.1969 15.4562 46.0324 16.2831 46.6291 17.3573C47.2429 18.4314 47.5498 19.6846 47.5498 21.1168ZM43.0742 19.9659C43.0742 19.2157 42.8185 18.619 42.307 18.1757C41.7955 17.7324 41.1561 17.5107 40.3888 17.5107C39.6557 17.5107 39.0334 17.7239 38.5219 18.1501C38.0274 18.5764 37.7205 19.1816 37.6012 19.9659H43.0742ZM70.1891 10.5287V28.4824H65.8158V17.7153L61.8005 28.4824H58.2712L54.2303 17.6898V28.4824H49.857V10.5287H55.0231L60.0614 22.9582L65.0486 10.5287H70.1891ZM86.7865 21.1168C86.7865 21.526 86.761 21.9523 86.7098 22.3956H76.8123C76.8805 23.2822 77.1618 23.9642 77.6563 24.4416C78.1678 24.9019 78.7901 25.1321 79.5232 25.1321C80.6144 25.1321 81.3732 24.6717 81.7994 23.751H86.4541C86.2154 24.6888 85.7806 25.5328 85.1497 26.283C84.5359 27.0332 83.7602 27.6214 82.8224 28.0476C81.8847 28.4739 80.8361 28.687 79.6767 28.687C78.2786 28.687 77.0339 28.3886 75.9427 27.7919C74.8515 27.1951 73.999 26.3426 73.3852 25.2344C72.7714 24.1261 72.4645 22.8303 72.4645 21.347C72.4645 19.8636 72.7629 18.5678 73.3597 17.4596C73.9735 16.3513 74.826 15.4988 75.9172 14.9021C77.0084 14.3053 78.2615 14.0069 79.6767 14.0069C81.0577 14.0069 82.2853 14.2968 83.3595 14.8765C84.4336 15.4562 85.2691 16.2831 85.8658 17.3573C86.4796 18.4314 86.7865 19.6846 86.7865 21.1168ZM82.3109 19.9659C82.3109 19.2157 82.0552 18.619 81.5437 18.1757C81.0322 17.7324 80.3928 17.5107 79.6255 17.5107C78.8924 17.5107 78.2701 17.7239 77.7586 18.1501C77.2641 18.5764 77.2641 18.5764 76.8379 19.9659H82.3109ZM97.7892 14.0581C99.4601 14.0581 100.79 14.6037 101.779 15.6949C102.785 16.7691 103.288 18.2524 103.288 20.145V28.4824H98.9401V20.7332C98.9401 19.7784 98.6929 19.0367 98.1984 18.5082C97.704 17.9796 97.039 17.7153 96.2036 17.7153C95.3681 17.7153 94.7032 17.9796 94.2087 18.5082C93.7143 19.0367 93.467 19.7784 93.467 20.7332V28.4824H89.0937V14.2115H93.467V16.1041C93.9103 15.4733 94.5071 14.9788 95.2573 14.6207C96.0075 14.2456 96.8515 14.0581 97.7892 14.0581ZM120.419 14.2115V28.4824H116.045V26.5387C115.602 27.1696 114.997 27.6811 114.23 28.0732C113.479 28.4483 112.644 28.6359 111.723 28.6359C110.632 28.6359 109.669 28.3972 108.833 27.9198C107.998 27.4253 107.35 26.7177 106.89 25.797C106.429 24.8763 106.199 23.7937 106.199 22.549V14.2115H110.547V21.9608C110.547 22.9156 110.794 23.6573 111.288 24.1858C111.783 24.7144 112.448 24.9786 113.283 24.9786C114.136 24.9786 114.809 24.7144 115.304 24.1858C115.798 23.6573 116.045 22.9156 116.045 21.9608V14.2115H120.419Z" fill="#111E3C"/>
          </svg>
        </div>

        <Separator className="bg-slate-50" />

        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar">
          <SidebarSectionLabel label="OVERVIEW" />
          <SidebarItem icon={LayoutGrid} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Live Order Hub" active href="/live-order-hub" />
          <SidebarItem icon={History} label="Reports" hasAdd href="#" />

          <SidebarDivider />

          <SidebarSectionLabel label="MANAGEMENT" />
          <SidebarItem icon={ClipboardList} label="Order List" href="#" />
          <SidebarItem icon={BookOpen} label="Menu Builder" href="#" />
          <SidebarItem icon={Grid3X3} label="Table Operations" href="/qr-codes" />
          <SidebarItem icon={Users} label="Guest Directory" href="#" />

          <SidebarDivider />

          <SidebarSectionLabel label="CONFIGURATION" />
          <SidebarItem icon={Settings} label="Settings" hasAdd href="#" />

          <SidebarDivider />

          <SidebarSectionLabel label="CONNECTIONS" />
          <SidebarItem icon={Plug} label="Integration" hasAdd href="#" />
        </div>

        {/* Sidebar Footer */}
        <div className="bg-[#111827] p-4 rounded-t-[28px] mt-auto">
          <div className="bg-[#1E293B] rounded-[20px] p-2.5 flex items-center justify-between group cursor-pointer transition-colors hover:bg-[#2D3748] shadow-lg">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-9 h-9 border-2 border-white/10 shadow-lg">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback className="bg-[#0CB5A8]/20 text-[#0CB5A8] font-bold">B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-[#0CB5A8] font-bold uppercase tracking-wider leading-none mb-0.5">BLOOMSBURY'S</span>
                <span className="text-[12px] font-bold text-white tracking-tight truncate max-w-[120px]">Ras Al Khaimah</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <div className="flex items-center gap-2.5 px-3 py-3 mt-0.5 group cursor-pointer">
            <div className="w-5.5 h-5.5 rounded-full border border-[#0CB5A8] flex items-center justify-center group-hover:bg-[#0CB5A8]/10 transition-colors">
              <HelpCircle className="w-3 h-3 text-[#0CB5A8]" />
            </div>
            <span className="text-[13px] font-semibold text-slate-400 group-hover:text-white transition-colors">Help & Support</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Topbar */}
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4 z-20">
          <div className="flex items-center gap-4 flex-1">
             <div className="flex items-center bg-white border border-white rounded-[15px] overflow-hidden h-10 w-full max-w-2xl transition-all">
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
                
                {/* Smart Search Results Dropdown */}
                {isHeaderSearchFocused && headerSearchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-none shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 max-h-[300px] overflow-y-auto no-scrollbar">
                      <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</div>
                      {smartSearchResults.length > 0 ? (
                        smartSearchResults.map((result, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors cursor-default rounded-none group">
                            <div className="w-8 h-8 rounded-none bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                              {result.type === 'Order' && <ClipboardList className="w-4 h-4 text-slate-400" />}
                              {result.type === 'Table' && <Armchair className="w-4 h-4 text-slate-400" />}
                              {result.type === 'Customer' && <Users className="w-4 h-4 text-slate-400" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-bold text-slate-900 leading-tight">{result.value}</span>
                              <span className="text-[11px] text-slate-400 font-medium">{result.sub}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-[13px] text-slate-400 font-medium italic">No matches found for "{headerSearchQuery}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
              <Separator orientation="vertical" className="h-2.5 bg-slate-200 group-hover/pos:bg-[#0CB5A8]/20 mx-1" />
              <span className="text-slate-400 group-hover/pos:text-[#0CB5A8]/60 uppercase tracking-tight font-bold">JULY 02, 2:42 PM</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#0CB5A8]/10 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-all">
                <LayoutGrid className="w-[18px] h-[18px]" />
              </div>
              <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Hub Content Container */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-10 max-w-[1600px] mx-auto space-y-10">
            
            {/* STICKY HEADER SECTION (Matches Uploaded Design) */}
            <div className="sticky top-0 bg-[#F8FAFC]/90 backdrop-blur-sm pt-4 pb-6 z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-10">
                  <h1 className="text-3xl font-black text-slate-900 tracking-tighter">ORDER HUB</h1>
                  
                  <div className="flex items-center gap-3 bg-white border border-[#0CB5A8]/10 px-5 py-2 rounded-full shadow-sm group">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0CB5A8] animate-pulse" />
                    <span className="text-[10px] font-black text-[#0CB5A8] uppercase tracking-[0.1em]">REAL TIME SYNC</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-900 leading-none">0</span>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.05em] leading-tight">ACTIVE<br/>ORDERS</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#E2F5F3] border border-[#0CB5A8]/20 px-6 py-2 rounded-[18px]">
                  <span className="text-[11px] font-black text-[#0CB5A8] uppercase tracking-widest">FILTER BY</span>
                  <Separator orientation="vertical" className="h-4 bg-[#0CB5A8]/20" />
                  <div className="flex items-center gap-4">
                    <Select defaultValue="days">
                      <SelectTrigger className="w-[100px] h-8 border-none bg-transparent shadow-none text-[12px] font-bold text-slate-600 focus:ring-0 px-0">
                        <SelectValue placeholder="Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="2">
                      <SelectTrigger className="w-[100px] h-8 border-none bg-transparent shadow-none text-[12px] font-bold text-slate-600 focus:ring-0 px-0">
                        <SelectValue placeholder="2 Days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="2">2 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white border border-slate-100 p-1.5 rounded-full shadow-sm w-full max-w-4xl">
                  <div className="flex items-center gap-2 px-2">
                    <FilterBadge label="LIVE" count={0} colorClass="bg-[#0CB5A8]" />
                    <Separator orientation="vertical" className="h-4 bg-slate-100 mx-2" />
                    <FilterBadge label="PENDING" count={0} colorClass="bg-[#FBBF24]" />
                    <Separator orientation="vertical" className="h-4 bg-slate-100 mx-2" />
                    <FilterBadge label="READY" count={0} colorClass="bg-[#3B82F6]" />
                    <Separator orientation="vertical" className="h-4 bg-slate-100 mx-2" />
                    <FilterBadge label="IN PROGRESS" count={0} colorClass="bg-[#EF4444]" />
                    <Separator orientation="vertical" className="h-4 bg-slate-100 mx-2" />
                    <FilterBadge label="PREPARED" count={0} colorClass="bg-[#8B5CF6]" />
                  </div>
                </div>

                <div className="flex items-center bg-white border border-slate-100 rounded-[14px] p-1.5 shadow-sm">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600">
                      <Search className="w-4 h-4" />
                    </Button>
                    <Separator orientation="vertical" className="h-4 bg-slate-100 mx-1" />
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600">
                        <ZoomOut className="w-3.5 h-3.5" />
                      </Button>
                      <Separator orientation="vertical" className="h-4 bg-slate-100 mx-1" />
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Order Grid Container */}
            <div className="bg-white border border-slate-100 rounded-[32px] p-8 min-h-[800px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-4">
                {Array.from({ length: 72 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="aspect-[4/3] rounded-[18px] border-2 border-dashed border-slate-100 bg-slate-50/20 hover:bg-slate-50/40 transition-colors cursor-default" 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
