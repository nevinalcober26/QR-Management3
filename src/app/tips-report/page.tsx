'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  FileDown,
  Wallet,
  Coins,
  Percent,
  User,
  LayoutGrid
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

// --- Types & Mock Data ---

type TipType = 'PRESET' | 'CUSTOM';

interface TipTransaction {
  id: string;
  orderId: string;
  date: string;
  staffName: string;
  staffInitial: string;
  avatarColor: string;
  method: string;
  tipType: TipType;
  orderTotal: number;
  tipAmount: number;
  tipPercent: number;
}

const MOCK_TIPS: TipTransaction[] = [
  { id: '1', orderId: '#3325', date: 'Mar 2, 2026, 09:15 AM', staffName: 'Sarah Chen', staffInitial: 'S', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Credit Card', tipType: 'CUSTOM', orderTotal: 122.00, tipAmount: 6.54, tipPercent: 5.4 },
  { id: '2', orderId: '#3255', date: 'Mar 2, 2026, 09:11 AM', staffName: 'Lisa Wang', staffInitial: 'L', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Cash', tipType: 'PRESET', orderTotal: 15.00, tipAmount: 0.73, tipPercent: 4.9 },
  { id: '3', orderId: '#3315', date: 'Mar 2, 2026, 08:42 AM', staffName: 'Sam Taylor', staffInitial: 'S', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Cash', tipType: 'PRESET', orderTotal: 82.00, tipAmount: 1.69, tipPercent: 2.1 },
  { id: '4', orderId: '#3240', date: 'Mar 2, 2026, 08:34 AM', staffName: 'Chloe Bennett', staffInitial: 'C', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Cash', tipType: 'PRESET', orderTotal: 92.00, tipAmount: 5.30, tipPercent: 5.8 },
  { id: '5', orderId: '#3275', date: 'Mar 2, 2026, 07:56 AM', staffName: 'Sophie Turner', staffInitial: 'S', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Credit Card', tipType: 'PRESET', orderTotal: 68.00, tipAmount: 2.71, tipPercent: 4.0 },
  { id: '6', orderId: '#3260', date: 'Mar 2, 2026, 07:00 AM', staffName: 'Chloe Bennett', staffInitial: 'C', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Credit Card', tipType: 'PRESET', orderTotal: 46.00, tipAmount: 1.64, tipPercent: 3.6 },
  { id: '7', orderId: '#3295', date: 'Mar 2, 2026, 06:49 AM', staffName: 'Elena Rodriguez', staffInitial: 'E', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Credit Card', tipType: 'CUSTOM', orderTotal: 63.00, tipAmount: 2.73, tipPercent: 4.3 },
  { id: '8', orderId: '#3280', date: 'Mar 2, 2026, 06:43 AM', staffName: 'Lisa Wang', staffInitial: 'L', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Cash', tipType: 'PRESET', orderTotal: 78.00, tipAmount: 3.12, tipPercent: 4.0 },
  { id: '9', orderId: '#3210', date: 'Mar 2, 2026, 06:01 AM', staffName: 'Sam Taylor', staffInitial: 'S', avatarColor: 'bg-emerald-100 text-emerald-600', method: 'Credit Card', tipType: 'PRESET', orderTotal: 55.00, tipAmount: 2.75, tipPercent: 5.0 },
];

const KPICard = ({ title, value, sub, icon: Icon, colorClass, borderClass }: { title: string, value: string, sub: string, icon: any, colorClass: string, borderClass: string }) => (
  <div className={cn("bg-white p-6 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border-r-4 relative overflow-hidden", borderClass)}>
    <div className="flex justify-between items-start">
      <div className="space-y-4">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
          <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
        </div>
      </div>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

export default function TipsReportPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTips = useMemo(() => {
    return MOCK_TIPS.filter(item => 
      item.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.staffName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const kpis = useMemo(() => {
    const total = filteredTips.reduce((sum, t) => sum + t.tipAmount, 0);
    const avg = total / (filteredTips.length || 1);
    const staff = new Set(filteredTips.map(t => t.staffName)).size;
    const captureRate = 4.5; // Mock fixed rate based on average trends

    return { total, avg, staff, captureRate };
  }, [filteredTips]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <AppSidebar currentPath="/tips-report" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

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

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Report Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Tips & Gratuity Report</h1>
                <p className="text-[13px] text-slate-400 font-medium">Analyze gratuity patterns, staff performance, and net earnings.</p>
              </div>
              <Button className="bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-10 px-6 shadow-lg shadow-[#0CB5A8]/20 flex items-center gap-2 text-xs">
                <FileDown className="w-4 h-4" />
                Export
              </Button>
            </div>

            {/* Date Range Picker */}
            <div className="bg-white p-4 rounded-[20px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100">
               <div className="inline-flex items-center gap-3 bg-[#F8FAFC] px-4 py-2.5 rounded-xl border border-slate-100 text-[13px] font-medium text-slate-600 cursor-pointer">
                  <span>2026-03-02 - 2026-03-02</span>
                  <Calendar className="w-4 h-4 text-slate-400" />
               </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="TOTAL TIPS" 
                value={`AED ${kpis.total.toFixed(2)}`} 
                sub="Across all paid orders" 
                icon={Wallet} 
                colorClass="bg-green-50 text-green-500" 
                borderClass="border-r-emerald-500"
              />
              <KPICard 
                title="AVG. TIP" 
                value={`AED ${kpis.avg.toFixed(2)}`} 
                sub="Per tip transaction" 
                icon={Coins} 
                colorClass="bg-teal-50 text-teal-500" 
                borderClass="border-r-[#0CB5A8]"
              />
              <KPICard 
                title="TIP CAPTURE RATE" 
                value={`${kpis.captureRate}%`} 
                sub="Tips vs order value" 
                icon={Percent} 
                colorClass="bg-red-50 text-red-500" 
                borderClass="border-r-red-400"
              />
              <KPICard 
                title="ACTIVE STAFF" 
                value={kpis.staff.toString()} 
                sub="Staff receiving tips" 
                icon={User} 
                colorClass="bg-yellow-50 text-yellow-500" 
                borderClass="border-r-yellow-500"
              />
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col">
              {/* Table Filters */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2.5 rounded-xl border border-slate-100 w-full max-w-xs">
                  <Search className="w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search order or staff..." 
                    className="border-none shadow-none bg-transparent h-6 text-[13px] p-0 focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-x-auto min-h-[400px]">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] border-b border-slate-50">
                    <tr>
                      {['Order ID', 'Date', 'Staff Member', 'Method', 'Tip Type', 'Order Total', 'Tip Amount', 'Tip %'].map((head) => (
                        <th key={head} className={cn("px-6 py-4 text-left", (head === 'Tip Amount' || head === 'Tip %') && "text-right")}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">{head}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTips.length > 0 ? (
                      filteredTips.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-[14px] font-black text-slate-900">{tx.orderId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{tx.date}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px]", tx.avatarColor)}>
                                {tx.staffInitial}
                              </div>
                              <span className="text-[13px] font-black text-slate-900">{tx.staffName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-medium text-slate-400">{tx.method}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "rounded-md px-2 py-0.5 text-[9px] font-black tracking-tight",
                                tx.tipType === 'CUSTOM' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              )}
                            >
                              {tx.tipType}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-medium text-slate-400 whitespace-nowrap">AED {tx.orderTotal.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-[14px] font-black text-slate-900 whitespace-nowrap">AED {tx.tipAmount.toFixed(2)}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-[14px] font-black text-emerald-500">{tx.tipPercent.toFixed(1)}%</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-24 text-center">
                          <p className="text-[14px] text-slate-400 font-medium">No tip transactions found for the selected filters.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MenuBuilder open={isMenuBuilderOpen} onOpenChange={setIsMenuBuilderOpen} />
    </div>
  );
}
