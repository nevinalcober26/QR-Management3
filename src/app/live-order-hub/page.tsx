'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  ZoomIn,
  ZoomOut,
  Clock
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

type OrderStatus = 'LIVE' | 'PENDING' | 'READY' | 'IN_PROGRESS' | 'PREPARED';

interface Order {
  id: string;
  orderId: string;
  refId: string;
  status: OrderStatus;
  tableId: string;
  items: number;
  time: string;
}

const MOCK_ORDERS: Order[] = [
  { id: '1', orderId: '4825', refId: '#NDAGPJC4825...', status: 'LIVE', tableId: 'T-24', items: 3, time: '12:04' },
  { id: '2', orderId: '4823', refId: '#NDAGPJC4823...', status: 'READY', tableId: 'T-18', items: 2, time: '08:15' },
  { id: '3', orderId: '4822', refId: '#NDAGPJC4822...', status: 'LIVE', tableId: 'T-05', items: 5, time: '15:30' },
  { id: '4', orderId: '4827', refId: '#NDAGPJC4827...', status: 'READY', tableId: 'F-12', items: 1, time: '05:45' },
  { id: '5', orderId: '4838', refId: '#NDAGPJC4838...', status: 'PENDING', tableId: 'T-31', items: 4, time: '02:10' },
  { id: '6', orderId: '4833', refId: '#NDAGPJC4833...', status: 'READY', tableId: 'T-22', items: 3, time: '06:20' },
  { id: '7', orderId: '4820', refId: '#NDAGPJC4820...', status: 'LIVE', tableId: 'T-01', items: 2, time: '18:50' },
  { id: '8', orderId: '6300', refId: '#NDAGPJC6300...', status: 'READY', tableId: 'F-03', items: 6, time: '10:00' },
];

const FilterBadge = ({ label, count, colorClass, active = false }: { label: string, count: number, colorClass: string, active?: boolean }) => (
  <div className={cn(
    "flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-all rounded-full",
    active ? "bg-[#F0FDFB] border border-[#0CB5A8]/20" : "hover:bg-slate-50"
  )}>
    <div className={cn("w-2 h-2 rounded-full", colorClass)} />
    <span className={cn(
      "text-[10px] font-black uppercase tracking-[0.05em]",
      active ? "text-[#0CB5A8]" : "text-slate-400"
    )}>{label}</span>
    <span className="text-[10px] font-black text-slate-900 ml-1">{count}</span>
  </div>
);

const OrderCard = ({ order }: { order: Order }) => {
  const statusColors = {
    LIVE: 'bg-[#0CB5A8]',
    PENDING: 'bg-[#FBBF24]',
    READY: 'bg-[#6366f1]',
    IN_PROGRESS: 'bg-[#FBBF24]',
    PREPARED: 'bg-[#6366f1]'
  };

  return (
    <div className={cn(
      "aspect-[2/1] rounded-[10px] p-4 flex flex-col justify-between shadow-sm hover:brightness-95 transition-all cursor-pointer relative overflow-hidden",
      statusColors[order.status]
    )}>
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
          <span className="text-2xl font-black text-white leading-none tracking-tight">{order.tableId}</span>
          <span className="text-[11px] font-bold text-white/70 mt-1">Order {order.orderId}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-lg">
          <Clock className="w-3 h-3 text-white" />
          <span className="text-[11px] font-black text-white">{order.time}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-end z-10">
        <span className="text-[10px] font-black text-white/50 uppercase tracking-tighter truncate max-w-[100px]">
          {order.refId}
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-black text-white uppercase">{order.items} ITEMS</span>
        </div>
      </div>

      {/* Background Decorative ID */}
      <span className="absolute -bottom-2 -right-2 text-6xl font-black text-white/5 select-none pointer-events-none">
        {order.orderId.slice(-2)}
      </span>
    </div>
  );
};

export default function LiveOrderHubPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);

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
      <AppSidebar currentPath="/live-order-hub" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

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

        {/* Scrollable Hub Content Container */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="max-w-[1600px] mx-auto">
            
            {/* STICKY HEADER SECTION */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-5 z-10">
              <div className="flex items-center">
                <div className="flex items-center">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight mr-6">ORDER HUB</h1>
                  
                  <Separator orientation="vertical" className="h-8 bg-slate-100 mr-6" />

                  <div className="flex items-center gap-2 bg-[#E2F5F3] border border-[#0CB5A8]/30 px-3.5 py-1.5 rounded-full mr-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0CB5A8] animate-pulse" />
                    <span className="text-[10px] font-black text-[#0CB5A8] uppercase tracking-[0.05em]">REAL TIME SYNC</span>
                  </div>

                  <div className="flex items-center gap-2 mr-6">
                    <span className="text-3xl font-black text-slate-900 leading-none">{MOCK_ORDERS.length}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight leading-[1.1]">ACTIVE<br/>ORDERS</span>
                  </div>

                  <Separator orientation="vertical" className="h-8 bg-slate-100 mr-6" />

                  <div className="flex items-center gap-3 bg-[#F0FDFB] border border-[#0CB5A8]/10 px-4 py-2 rounded-2xl">
                    <span className="text-[10px] font-black text-[#0CB5A8] uppercase tracking-widest">FILTER BY</span>
                    <Separator orientation="vertical" className="h-4 bg-[#0CB5A8]/20 mx-1" />
                    <div className="flex items-center gap-3">
                      <Select defaultValue="days">
                        <SelectTrigger className="w-[90px] h-9 bg-white border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 shadow-sm focus:ring-0">
                          <SelectValue placeholder="Days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="2">
                        <SelectTrigger className="w-[100px] h-9 bg-white border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 shadow-sm focus:ring-0">
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
              </div>
            </div>

            {/* Filter Bar and Zoom Controls */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white border border-slate-100 p-1.5 rounded-full shadow-sm w-fit">
                  <div className="flex items-center">
                    <FilterBadge label="LIVE" count={MOCK_ORDERS.filter(o => o.status === 'LIVE').length} colorClass="bg-[#0CB5A8]" active />
                    <FilterBadge label="PENDING" count={MOCK_ORDERS.filter(o => o.status === 'PENDING').length} colorClass="bg-[#FBBF24]" />
                    <FilterBadge label="READY" count={MOCK_ORDERS.filter(o => o.status === 'READY').length} colorClass="bg-[#6366f1]" />
                    <FilterBadge label="IN PROGRESS" count={MOCK_ORDERS.filter(o => o.status === 'IN_PROGRESS').length} colorClass="bg-[#FBBF24]" />
                    <FilterBadge label="PREPARED" count={MOCK_ORDERS.filter(o => o.status === 'PREPARED').length} colorClass="bg-[#6366f1]" />
                  </div>
                </div>

                <div className="flex items-center bg-white border border-slate-100 p-1.5 rounded-full shadow-sm w-fit gap-2 px-4">
                  <button className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                    <ZoomOut className="w-4 h-4 text-slate-400" />
                  </button>
                  <Separator orientation="vertical" className="h-4 bg-slate-200" />
                  <button className="p-1 hover:bg-slate-50 rounded-full transition-colors">
                    <ZoomIn className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Main Order Grid Container */}
            <div className="px-8 pb-10">
              <div className="bg-white border border-slate-100 rounded-[32px] p-8 min-h-[800px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
                  {/* Render Mock Orders */}
                  {MOCK_ORDERS.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                  
                  {/* Render Remaining Placeholders to maintain 100% structural fidelity */}
                  {Array.from({ length: 80 - MOCK_ORDERS.length }).map((_, i) => (
                    <div 
                      key={`placeholder-${i}`} 
                      className="aspect-[2/1] rounded-[10px] bg-[#F8FAFC] border border-slate-50" 
                    />
                  ))}
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
