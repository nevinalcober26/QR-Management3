'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  FileDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  ShoppingCart,
  DollarSign,
  Wallet,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  XCircle,
  Smartphone,
  Store
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

type PaymentStatus = 'Paid' | 'Pending' | 'Voided';
type PaymentMethod = 'Cash' | 'Credit Card' | '-';
type OrderSource = 'App to App' | 'POS';

interface Transaction {
  id: string;
  orderId: string;
  dateTime: string;
  totalAmount: number;
  paidAmount: number;
  outstanding: number;
  status: PaymentStatus;
  method: PaymentMethod;
  source: OrderSource;
  payers: number;
}

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 30 }).map((_, i) => {
  const status: PaymentStatus = i % 10 === 0 ? 'Voided' : (i % 3 === 0 ? 'Pending' : 'Paid');
  const total = 450 + (i * 12);
  const paid = status === 'Paid' ? total : (status === 'Pending' ? total * 0.5 : 0);
  const outstanding = total - paid;
  
  return {
    id: `tx-${i}`,
    orderId: `#NDAGPJC${4820 + i}`,
    dateTime: `2024-07-24, ${10 + (i % 12)}:${(i * 7) % 60 < 10 ? '0' : ''}${(i * 7) % 60} PM`,
    totalAmount: total,
    paidAmount: paid,
    outstanding: outstanding,
    status: status,
    method: status === 'Voided' ? '-' : (i % 2 === 0 ? 'Cash' : 'Credit Card'),
    source: i % 3 === 0 ? 'POS' : 'App to App',
    payers: (i % 3) + 1,
  };
});

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

export default function OrdersReportPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTransactions = useMemo(() => {
    return MOCK_TRANSACTIONS.filter(tx => {
      const matchesSearch = tx.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || tx.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const kpis = useMemo(() => {
    const total = MOCK_TRANSACTIONS.length;
    const gross = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.totalAmount, 0);
    const paid = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.paidAmount, 0);
    const outstanding = MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.outstanding, 0);
    const voided = MOCK_TRANSACTIONS.filter(tx => tx.status === 'Voided').length;

    return { total, gross, paid, outstanding, voided };
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <AppSidebar currentPath="/orders-report" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

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
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Order & Transaction Summary</h1>
                <p className="text-[13px] text-slate-400 font-medium">Detailed financial truth source for every order and payment.</p>
              </div>
              <Button className="bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-10 px-6 shadow-lg shadow-[#0CB5A8]/20 flex items-center gap-2 text-xs">
                <FileDown className="w-4 h-4" />
                Export
              </Button>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <KPICard 
                title="TOTAL ORDERS" 
                value={kpis.total.toString()} 
                sub="Completed Transactions" 
                icon={ShoppingCart} 
                colorClass="bg-yellow-50 text-yellow-500" 
                borderClass="border-r-yellow-400"
              />
              <KPICard 
                title="GROSS SALES" 
                value={`฿ ${kpis.gross.toLocaleString()}`} 
                sub="Before Discounts" 
                icon={DollarSign} 
                colorClass="bg-green-50 text-green-500" 
                borderClass="border-r-emerald-500"
              />
              <KPICard 
                title="PAID AMOUNT" 
                value={`฿ ${kpis.paid.toLocaleString()}`} 
                sub="Collected Payments" 
                icon={Wallet} 
                colorClass="bg-slate-100 text-slate-500" 
                borderClass="border-r-slate-300"
              />
              <KPICard 
                title="OUTSTANDING" 
                value={`฿ ${kpis.outstanding.toLocaleString()}`} 
                sub="Pending Collection" 
                icon={AlertTriangle} 
                colorClass="bg-red-50 text-red-500" 
                borderClass="border-r-red-400"
              />
              <KPICard 
                title="VOIDED ORDERS" 
                value={kpis.voided.toString()} 
                sub="Cancelled or Removed" 
                icon={Ban} 
                colorClass="bg-red-50 text-red-500" 
                borderClass="border-r-red-500"
              />
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col">
              {/* Table Filters */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2.5 rounded-xl border border-slate-100 w-full max-w-xs">
                  <Search className="w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search order number" 
                    className="border-none shadow-none bg-transparent h-6 text-[13px] p-0 focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to page 1 on search
                    }}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1); // Reset to page 1 on filter
                }}>
                  <SelectTrigger className="w-[200px] h-10 border-slate-100 rounded-xl text-[13px] font-medium text-slate-400 shadow-none bg-white">
                    <SelectValue placeholder="Select Payment Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="voided">Voided</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table Body */}
              <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[600px] no-scrollbar">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC] sticky top-0 z-10">
                    <tr className="border-b border-slate-50">
                      {['Order ID', 'Date & Time', 'Total Amount', 'Paid Amount', 'Outstanding', 'Status', 'Method', 'Source', 'Payers'].map((head) => (
                        <th key={head} className="px-6 py-4 text-left">
                          <div className="flex items-center gap-1.5 cursor-pointer">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{head}</span>
                            <ChevronDown className="w-2.5 h-2.5 text-slate-300" />
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.length > 0 ? (
                      paginatedTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-black text-slate-900">{tx.orderId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{tx.dateTime}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-black text-slate-900 whitespace-nowrap">฿ {tx.totalAmount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-black text-slate-900 whitespace-nowrap">฿ {tx.paidAmount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[13px] font-black text-red-500 whitespace-nowrap">฿ {tx.outstanding.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className={cn(
                              "flex items-center gap-2 px-2.5 py-1 rounded-full w-fit",
                              tx.status === 'Paid' ? "bg-emerald-50 text-emerald-600" : 
                              tx.status === 'Pending' ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-600"
                            )}>
                              {tx.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                              {tx.status === 'Pending' && <Clock className="w-3 h-3" />}
                              {tx.status === 'Voided' && <XCircle className="w-3 h-3" />}
                              <span className="text-[9px] font-black uppercase tracking-tight">{tx.status}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[12px] font-medium text-slate-500 whitespace-nowrap">{tx.method}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {tx.source === 'App to App' ? (
                                <Smartphone className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Store className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="text-[13px] font-bold text-slate-900 whitespace-nowrap">{tx.source}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[13px] font-black text-slate-900">{tx.payers}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-24 text-center">
                          <p className="text-[14px] text-slate-900 font-bold">No transactions found.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer / Pagination */}
              <div className="p-6 border-t border-slate-50 bg-[#F8FAFC]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Select 
                    value={itemsPerPage.toString()} 
                    onValueChange={(val) => {
                      setItemsPerPage(parseInt(val));
                      setCurrentPage(1); // Reset to page 1 on limit change
                    }}
                  >
                    <SelectTrigger className="w-20 h-9 border-slate-200 rounded-xl text-[12px] font-bold text-slate-600 shadow-none bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[11px] text-slate-400 font-medium tracking-tight">
                    per page <span className="text-slate-900 ml-3">
                      {filteredTransactions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} results
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm disabled:opacity-30"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm disabled:opacity-30"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </Button>
                  <div className="px-4 text-[13px] font-bold text-slate-600">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm disabled:opacity-30"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm disabled:opacity-30"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronsRight className="w-4 h-4 text-slate-400" />
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
