'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  HelpCircle,
  ClipboardList,
  Plug, 
  BookOpen,
  History,
  Grid3X3,
  Users,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  MinusSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import MenuBuilder from "@/components/menu-builder";

// --- Types & Mock Data ---

interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastOrder: string;
  totalOrders: number;
  totalSpent: number;
  avgBill: number;
}

const MOCK_GUESTS: Guest[] = [
  { id: '1', name: 'John Smith', email: 'john.smith@gmail.com', phone: '+971 50 123 4567', lastOrder: 'Jul 24, 2024', totalOrders: 12, totalSpent: 2450.50, avgBill: 204.20 },
  { id: '2', name: 'Sarah Ahmed', email: 'sarah.a@outlook.com', phone: '+971 55 987 6543', lastOrder: 'Jul 22, 2024', totalOrders: 8, totalSpent: 1890.00, avgBill: 236.25 },
  { id: '3', name: 'Michael Chen', email: 'm.chen@techcorp.com', phone: '+971 52 444 5555', lastOrder: 'Jul 20, 2024', totalOrders: 15, totalSpent: 3200.75, avgBill: 213.38 },
  { id: '4', name: 'Elena Rodriguez', email: 'elena.rod@gmail.com', phone: '+971 58 333 2222', lastOrder: 'Jul 18, 2024', totalOrders: 5, totalSpent: 850.00, avgBill: 170.00 },
  { id: '5', name: 'David Wilson', email: 'dave.w@freemail.com', phone: '+971 50 555 0199', lastOrder: 'Jul 15, 2024', totalOrders: 22, totalSpent: 5600.25, avgBill: 254.55 },
  { id: '6', name: 'Layla Mansour', email: 'l.mansour@dubai.ae', phone: '+971 56 111 2233', lastOrder: 'Jul 12, 2024', totalOrders: 3, totalSpent: 420.00, avgBill: 140.00 },
  { id: '7', name: 'Robert Taylor', email: 'robert.t@yahoo.com', phone: '+971 54 888 7766', lastOrder: 'Jul 10, 2024', totalOrders: 9, totalSpent: 1560.50, avgBill: 173.39 },
  { id: '8', name: 'Fatima Al-Sayed', email: 'fatima.as@gmail.com', phone: '+971 55 222 3344', lastOrder: 'Jul 08, 2024', totalOrders: 18, totalSpent: 4100.00, avgBill: 227.77 },
  { id: '9', name: 'William Brown', email: 'will.b@icloud.com', phone: '+971 52 666 9988', lastOrder: 'Jul 05, 2024', totalOrders: 1, totalSpent: 125.00, avgBill: 125.00 },
  { id: '10', name: 'Sophie Martin', email: 's.martin@design.fr', phone: '+971 58 555 4433', lastOrder: 'Jul 01, 2024', totalOrders: 7, totalSpent: 1440.25, avgBill: 205.75 },
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

export default function GuestDirectoryPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredGuests = useMemo(() => {
    return MOCK_GUESTS.filter(guest => 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm)
    );
  }, [searchTerm]);

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
          <SidebarItem icon={Users} label="Guest Directory" active href="/guest-directory" />

          <SidebarDivider />

          <SidebarSectionLabel label="CONFIGURATION" />
          <SidebarItem icon={Settings} label="Settings" subItems={[
            { label: 'Manage Outlets', href: '/manage-outlets' },
            { label: 'Manage Users', href: '#' },
          ]} />

          <SidebarDivider />

          <SidebarSectionLabel label="CONNECTIONS" />
          <SidebarItem icon={Plug} label="Integration" />
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

        {/* Scrollable Guest Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Page Header */}
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Guest</h1>
              <p className="text-[15px] text-slate-400 font-medium">Track guest orders and spending</p>
            </div>

            {/* Main Content Container */}
            <div className="bg-white rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col">
              {/* Search Bar */}
              <div className="p-6 border-b border-slate-50">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 w-full transition-colors focus-within:border-[#0CB5A8]/50">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <Input 
                    placeholder="Search by name, email or phone..." 
                    className="border-none shadow-none bg-transparent h-7 text-[14px] p-0 focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table Headers */}
              <div className="bg-[#F8FAFC] border-b border-slate-50 grid grid-cols-5 px-6">
                {[
                  { label: 'Customer', sort: true },
                  { label: 'Last Order', sort: true },
                  { label: 'Total Orders', sort: true },
                  { label: 'Total Spent', sort: true },
                  { label: 'Avg. Bill Value', sort: true }
                ].map((head, i) => (
                  <div key={i} className="py-4 flex items-center gap-2">
                    <span className="text-[12px] font-bold text-slate-400 tracking-tight">{head.label}</span>
                    {head.sort && <ArrowUpDown className="w-3 h-3 text-slate-300" />}
                  </div>
                ))}
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-50">
                {filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <div key={guest.id} className="grid grid-cols-5 px-6 py-5 hover:bg-slate-50/50 transition-colors">
                      {/* Customer Info */}
                      <div className="flex flex-col justify-center space-y-0.5">
                        <span className="text-[14px] font-black text-slate-900 tracking-tight">{guest.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{guest.email}</span>
                        <span className="text-[11px] text-slate-400 font-medium">{guest.phone}</span>
                      </div>
                      
                      {/* Last Order */}
                      <div className="flex items-center">
                        <span className="text-[13px] font-medium text-slate-500">{guest.lastOrder}</span>
                      </div>

                      {/* Total Orders */}
                      <div className="flex items-center">
                        <div className="bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
                          <span className="text-[13px] font-bold text-slate-900">{guest.totalOrders} Orders</span>
                        </div>
                      </div>

                      {/* Total Spent */}
                      <div className="flex items-center">
                        <span className="text-[14px] font-black text-slate-900">AED {guest.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>

                      {/* Avg Bill Value */}
                      <div className="flex items-center">
                        <span className="text-[14px] font-black text-[#0CB5A8]">AED {guest.avgBill.toFixed(2)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-32 flex items-center justify-center text-center">
                    <p className="text-[15px] text-slate-900 font-bold">No customers with selected filters</p>
                  </div>
                )}
              </div>

              {/* Table Footer / Pagination */}
              <div className="p-6 border-t border-slate-50 bg-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-20 h-10 border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 shadow-none bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[13px] text-slate-400 font-medium">
                    per page <span className="text-slate-400 ml-4">
                      {filteredGuests.length > 0 ? `1 - ${filteredGuests.length}` : '0'} of {filteredGuests.length} results
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-10 h-10 rounded-xl border-slate-100 bg-[#F8FAFC] text-slate-300 cursor-not-allowed" 
                    disabled
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-10 h-10 rounded-xl border-slate-100 bg-[#F8FAFC] text-slate-300 cursor-not-allowed" 
                    disabled
                  >
                    <ChevronsRight className="w-4 h-4" />
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
