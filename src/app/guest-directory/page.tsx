'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown
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
import MenuBuilder from "@/components/menu-builder";
import AppSidebar from "@/components/app-sidebar";

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
      <AppSidebar currentPath="/guest-directory" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

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
