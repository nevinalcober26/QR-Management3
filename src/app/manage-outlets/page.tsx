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
  MapPin,
  MoreHorizontal,
  Edit3,
  MinusSquare,
  Armchair
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import MenuBuilder from "@/components/menu-builder";

// --- Types & Mock Data ---

interface Outlet {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  locationDetail: string;
  image: string;
}

const MOCK_OUTLETS: Outlet[] = [
  { id: '1', name: "Bloomsbury's", cuisine: 'Bakery', city: 'Ras Al Khaimah', locationDetail: 'Ras Al Khaimah', image: 'https://picsum.photos/seed/bloom/400/250' },
  { id: '2', name: 'The Cheesecake Factory', cuisine: 'International', city: 'Dubai', locationDetail: 'Dubai Mall', image: 'https://picsum.photos/seed/cheesecake/400/250' },
  { id: '3', name: "P.F. Chang's", cuisine: 'Asian', city: 'Abu Dhabi', locationDetail: 'Abu Dhabi', image: 'https://picsum.photos/seed/pfchangs/400/250' },
  { id: '4', name: 'Zuma', cuisine: 'Japanese', city: 'Dubai', locationDetail: 'Dubai', image: 'https://picsum.photos/seed/zuma/400/250' },
  { id: '5', name: 'Al Fanar Seafood Market', cuisine: 'Seafood', city: 'Dubai', locationDetail: 'Dubai', image: 'https://picsum.photos/seed/seafood/400/250' },
  { id: '6', name: 'Vapiano', cuisine: 'Italian', city: 'Dubai', locationDetail: 'Dubai', image: 'https://picsum.photos/seed/vapiano/400/250' },
];

// --- Sub-components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  href = "#",
  subItems,
  onClick
}: { 
  icon: any, 
  label: string, 
  active?: boolean, 
  href?: string,
  subItems?: { label: string, href: string, active?: boolean }[],
  onClick?: () => void
}) => {
  const [isOpen, setIsOpen] = useState(active || subItems?.some(s => s.active));

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (subItems) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="px-4 py-0.5 block">
      <div className={cn(
        "group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all rounded-xl",
        active ? "bg-[#0CB5A8]/10 text-[#0CB5A8]" : (isOpen && subItems) ? "bg-[#F0FDFB] text-[#0CB5A8]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )} onClick={handleClick}>
        <Link href={href} className="flex items-center gap-3 flex-1" onClick={(e) => { if(onClick || subItems) e.preventDefault(); }}>
          <Icon className={cn("w-[18px] h-[18px]", (active || (isOpen && subItems)) ? "text-[#0CB5A8]" : "text-slate-400 group-hover:text-slate-600")} />
          <span className={cn("text-[13px] font-semibold tracking-tight")}>{label}</span>
        </Link>
        {subItems && (
          <div className="flex items-center justify-center">
            {isOpen ? <MinusSquare className="w-4 h-4 text-[#0CB5A8]/40" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
          </div>
        )}
      </div>
      {isOpen && subItems && (
        <div className="ml-8 mt-1 border-l border-slate-100 pb-2">
          {subItems.map((sub, idx) => (
            <Link key={idx} href={sub.href} className="relative flex items-center py-2 pl-6 group/sub">
              {sub.active && (
                <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white bg-[#0CB5A8]" />
              )}
              <span className={cn(
                "text-[13px] transition-colors",
                sub.active ? "font-bold text-[#0CB5A8]" : "font-medium text-slate-500 hover:text-slate-900"
              )}>
                {sub.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

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

const OutletCard = ({ outlet }: { outlet: Outlet }) => (
  <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col group transition-all hover:shadow-md">
    <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
      <img src={outlet.image} alt={outlet.name} className="w-full h-full object-cover" />
      <button className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div className="space-y-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">{outlet.name}</h3>
          <p className="text-[12px] text-slate-400 font-medium">{outlet.cuisine} • {outlet.city}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[12px] font-medium">{outlet.locationDetail}</span>
        </div>
      </div>
      <Button className="w-full bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-11 flex items-center justify-center gap-2 shadow-sm shadow-[#0CB5A8]/20">
        <Edit3 className="w-4 h-4" />
        Edit Outlet
      </Button>
    </div>
  </div>
);

export default function ManageOutletsPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOutlets = useMemo(() => {
    return MOCK_OUTLETS.filter(outlet => 
      outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

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
            <path d="M47.5498 21.11168C47.5498 21.526 47.5243 21.9523 47.4731 22.3956H37.5756C37.6438 23.2822 37.9251 23.9642 38.4196 24.4416C38.9311 24.9019 39.5534 25.1321 40.2865 25.1321C41.3777 25.1321 42.1365 24.6717 42.5627 23.751H47.2174C46.9787 24.6888 46.5439 25.5328 45.913 26.283C45.2992 27.0332 44.5235 27.6214 43.5857 28.0476C42.648 28.4739 41.5994 28.687 40.44 28.687C39.0419 28.687 37.7972 28.3886 36.706 27.7919C35.6148 27.1951 34.7623 26.3426 34.1485 25.2344C33.5347 24.1261 33.2278 22.8303 33.2278 21.347C33.2278 19.8636 33.5262 18.5678 34.1229 17.4596C33.5347 16.3513 35.5892 15.4988 36.6805 14.9021C37.7717 14.3053 39.0248 14.0069 40.44 14.0069C41.821 14.0069 43.0486 14.2968 44.1228 14.8765C45.1969 15.4562 46.0324 16.2831 46.6291 17.3573C47.2429 18.4314 47.5498 19.6846 47.5498 21.11168ZM43.0742 19.9659C43.0742 19.2157 42.8185 18.619 42.307 18.1757C41.7955 17.7324 41.1561 17.5107 40.3888 17.5107C39.6557 17.5107 39.0334 17.7239 38.5219 18.1501C38.0274 18.5764 37.7205 19.1816 37.6012 19.9659H43.0742ZM70.1891 10.5287V28.4824H65.8158V17.7153L61.8005 28.4824H58.2712L54.2303 17.6898V28.4824H49.857V10.5287H55.0231L60.0614 22.9582L65.0486 10.5287H70.1891ZM86.7865 21.11168C86.7865 21.526 86.761 21.9523 86.7098 22.3956H76.8123C76.8805 23.2822 77.1618 23.9642 77.6563 24.4416C78.1678 24.9019 78.7901 25.1321 79.5232 25.1321C80.6144 25.1321 81.3732 24.6717 81.7994 23.751H86.4541C86.2154 24.6888 85.7806 25.5328 85.1497 26.283C84.5359 27.0332 83.7602 27.6214 82.8224 28.0476C81.8847 28.4739 80.8361 28.687 79.6767 28.687C78.2786 28.687 77.0339 28.3886 75.9427 27.7919C74.8515 27.1951 73.999 26.3426 73.3852 25.2344C72.7714 24.1261 72.4645 22.8303 72.4645 21.347C72.4645 19.8636 72.7629 18.5678 73.3597 17.4596C73.9735 16.3513 74.826 15.4988 75.9172 14.9021C77.0084 14.3053 78.2615 14.0069 79.6767 14.0069C81.0577 14.0069 82.2853 14.2968 83.3595 14.8765C84.4336 15.4562 85.2691 16.2831 85.8658 17.3573C86.4796 18.4314 86.7865 19.6846 86.7865 21.11168ZM82.3109 19.9659C82.3109 19.2157 82.0552 18.619 81.5437 18.1757C81.0322 17.7324 80.3928 17.5107 79.6255 17.5107C78.8924 17.5107 78.2701 17.7239 77.7586 18.1501C77.2641 18.5764 77.2641 18.5764 76.8379 19.9659H82.3109ZM97.7892 14.0581C99.4601 14.0581 100.79 14.6037 101.779 15.6949C102.785 16.7691 103.288 18.2524 103.288 20.145V28.4824H98.9401V20.7332C98.9401 19.7784 98.6929 19.0367 98.1984 18.5082C97.704 17.9796 97.039 17.7153 96.2036 17.7153C95.3681 17.7153 94.5071 14.9788 95.2573 14.6207C96.0075 14.2456 96.8515 14.0581 97.7892 14.0581ZM120.419 14.2115V28.4824H116.045V26.5387C115.602 27.1696 114.997 27.6811 114.23 28.0732C113.479 28.4483 112.644 28.6359 111.723 28.6359C110.632 28.6359 109.669 28.3972 108.833 27.9198C107.998 27.4253 107.35 26.7177 106.89 25.797C106.429 24.8763 106.199 23.7937 106.199 22.549V14.2115H110.547V21.9608C110.547 22.9156 110.794 23.6573 111.288 24.1858C111.783 24.7144 112.448 24.9786 113.283 24.9786C114.136 24.9786 114.809 24.7144 115.304 24.1858C115.798 23.6573 116.045 22.9156 116.045 21.9608V14.2115H120.419Z" fill="#111E3C"/>
          </svg>
        </div>

        <Separator className="bg-slate-50" />

        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar">
          <SidebarSectionLabel label="OVERVIEW" />
          <SidebarItem icon={LayoutGrid} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Live Order Hub" href="/live-order-hub" />
          <SidebarItem icon={History} label="Reports" subItems={[
            { label: 'Order Report', href: '/orders-report' },
            { label: 'Split Bill Report', href: '/split-bill-report' },
            { label: 'Tips Report', href: '/tips-report' },
          ]} />

          <SidebarDivider />

          <SidebarSectionLabel label="MANAGEMENT" />
          <SidebarItem icon={ClipboardList} label="Order List" href="/orders" />
          <SidebarItem icon={BookOpen} label="Menu Builder" onClick={() => setIsMenuBuilderOpen(true)} />
          <SidebarItem icon={Grid3X3} label="Table Operations" href="/qr-codes" />
          <SidebarItem icon={Users} label="Guest Directory" href="/guest-directory" />

          <SidebarDivider />

          <SidebarSectionLabel label="CONFIGURATION" />
          <SidebarItem icon={Settings} label="Settings" subItems={[
            { label: 'Manage Outlets', href: '/manage-outlets', active: true },
            { label: 'Manage Users', href: '/manage-users' },
          ]} />

          <SidebarDivider />

          <SidebarSectionLabel label="CONNECTIONS" />
          <SidebarItem icon={Plug} label="Integration" subItems={[
            { label: 'POS', href: '/pos' },
            { label: 'Payment Gateway', href: '/payment-gateway' },
          ]} />
        </div>

        <div className="bg-[#111827] p-4 rounded-t-[28px] mt-auto">
          <div className="bg-[#1E293B] rounded-[20px] p-2.5 flex items-center justify-between group cursor-pointer transition-colors hover:bg-[#2D3748] shadow-lg">
            <div className="flex items-center gap-2.5">
              <Avatar className="w-9 h-9 border-2 border-white/10 shadow-lg">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback className="bg-[#0CB5A8]/20 text-[#0CB5A8] font-bold">B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-[#0CB5A8] font-bold uppercase tracking-wider leading-none mb-0.5">BLOOMSBURY'S</span>
                <span className="text-[12px] font-bold text-white tracking-tight truncate max-w spill-w-[120px]">Ras Al Khaimah</span>
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
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center bg-white border border-slate-200 rounded-[15px] overflow-hidden h-10 w-full max-w-2xl transition-all">
              <div className="flex items-center flex-1 px-3.5 relative">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Search restaurant name..." 
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

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Outlets</h1>
                <p className="text-[15px] text-slate-400 font-medium">Manage all your outlets in one place.</p>
              </div>
              <Button className="bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-10 px-6 shadow-lg shadow-[#0CB5A8]/20 flex items-center gap-2 text-xs">
                <Plus className="w-4 h-4" />
                New Outlet
              </Button>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 w-full transition-colors focus-within:border-[#0CB5A8]/50">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Search restaurant name" 
                  className="border-none shadow-none bg-transparent h-7 text-[14px] p-0 focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-20">
              {filteredOutlets.length > 0 ? (
                filteredOutlets.map((outlet) => (
                  <OutletCard key={outlet.id} outlet={outlet} />
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-[15px] text-slate-900 font-bold">No outlets found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MenuBuilder open={isMenuBuilderOpen} onOpenChange={setIsMenuBuilderOpen} />
    </div>
  );
}
