
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Plus, 
  Grid3X3, 
  Users, 
  Settings, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ArrowLeft,
  ChevronDown,
  MoreHorizontal,
  HelpCircle,
  ClipboardList,
  Plug,
  BookOpen,
  ArrowUpRight,
  Package,
  FileText,
  ShoppingBag,
  History,
  AlertTriangle,
  TrendingUp,
  Star,
  Layers,
  Utensils,
  ChevronRight,
  Download,
  FileDown,
  FileImage,
  Info,
  Maximize,
  Minimize,
  ArrowDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  Line, 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import Link from 'next/link';

// --- Mock Data ---

const salesData = [
  { day: "Mon", sales: 18000 },
  { day: "Tue", sales: 24000 },
  { day: "Wed", sales: 21000 },
  { day: "Thu", sales: 28000 },
  { day: "Fri", sales: 25000 },
  { day: "Sat", sales: 32000 },
  { day: "Sun", sales: 30000 },
];

const popularItems = [
  { name: "Classic Cheese Burger", orders: 142, revenue: "1,240", image: "https://picsum.photos/seed/burger/40/40" },
  { name: "Caesar Salad", orders: 98, revenue: "890", image: "https://picsum.photos/seed/salad/40/40" },
  { name: "Red Velvet Cake", orders: 76, revenue: "645", image: "https://picsum.photos/seed/cake/40/40" },
  { name: "Pasta Carbonara", orders: 65, revenue: "975", image: "https://picsum.photos/seed/pasta/40/40" },
];

const latestUpdates = [
  { title: "New product added", desc: "Spicy Chicken Wings added to Appetizers", time: "2 hours ago", icon: Package, color: "text-green-500", bg: "bg-green-50" },
  { title: "Menu updated", desc: "Bloomsbury's menu prices adjusted", time: "5 hours ago", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  { title: "Promotion activated", desc: "Happy Hour 20% off campaign started", time: "1 day ago", icon: Star, color: "text-purple-500", bg: "bg-purple-50" },
  { title: "New review received", desc: "5-star rating from customer feedback", time: "2 days ago", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

// --- Sub-components ---

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

const StatCard = ({ title, value, change, changeType, icon: Icon, iconColor, borderClass }: { title: string, value: string, change?: string, changeType?: 'up' | 'down' | 'neutral', icon: any, iconColor: string, borderClass: string }) => (
  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden relative">
    <div className={cn("absolute top-0 left-0 w-1 h-full", borderClass)} />
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
        </div>
        <div className={cn("p-2.5 rounded-xl flex items-center justify-center", iconColor)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {change && (
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[11px] font-bold",
            changeType === 'up' ? "text-[#0CB5A8] bg-[#0CB5A8]/5" : "text-[#EF4444] bg-[#EF4444]/5"
          )}>
            <TrendingUp className={cn("w-3 h-3", changeType === 'down' && "rotate-180")} />
            {change}
          </div>
        )}
        <span className="text-[11px] text-slate-400 font-medium">vs last month</span>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');

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
            <path d="M47.5498 21.1168C47.5498 21.526 47.5243 21.9523 47.4731 22.3956H37.5756C37.6438 23.2822 37.9251 23.9642 38.4196 24.4416C38.9311 24.9019 39.5534 25.1321 40.2865 25.1321C41.3777 25.1321 42.1365 24.6717 42.5627 23.751H47.2174C46.9787 24.6888 46.5439 25.5328 45.913 26.283C45.2992 27.0332 44.5235 27.6214 43.5857 28.0476C42.648 28.4739 41.5994 28.687 40.44 28.687C39.0419 28.687 37.7972 28.3886 36.706 27.7919C35.6148 27.1951 34.7623 26.3426 34.1485 25.2344C33.5347 24.1261 33.2278 22.8303 33.2278 21.347C33.2278 19.8636 33.5262 18.5678 34.1229 17.4596C34.7367 16.3513 35.5892 15.4988 36.6805 14.9021C37.7717 14.3053 39.0248 14.0069 40.44 14.0069C41.821 14.0069 43.0486 14.2968 44.1228 14.8765C45.1969 15.4562 46.0324 16.2831 46.6291 17.3573C47.2429 18.4314 47.5498 19.6846 47.5498 21.1168ZM43.0742 19.9659C43.0742 19.2157 42.8185 18.619 42.307 18.1757C41.7955 17.7324 41.1561 17.5107 40.3888 17.5107C39.6557 17.5107 39.0334 17.7239 38.5219 18.1501C38.0274 18.5764 37.7205 19.1816 37.6012 19.9659H43.0742ZM70.1891 10.5287V28.4824H65.8158V17.7153L61.8005 28.4824H58.2712L54.2303 17.6898V28.4824H49.857V10.5287H55.0231L60.0614 22.9582L65.0486 10.5287H70.1891ZM86.7865 21.1168C86.7865 21.526 86.761 21.9523 86.7098 22.3956H76.8123C76.8805 23.2822 77.1618 23.9642 77.6563 24.4416C78.1678 24.9019 78.7901 25.1321 79.5232 25.1321C80.6144 25.1321 81.3732 24.6717 81.7994 23.751H86.4541C86.2154 24.6888 85.7806 25.5328 85.1497 26.283C84.5359 27.0332 83.7602 27.6214 82.8224 28.0476C81.8847 28.4739 80.8361 28.687 79.6767 28.687C78.2786 28.687 77.0339 28.3886 75.9427 27.7919C74.8515 27.1951 73.999 26.3426 73.3852 25.2344C72.7714 24.1261 72.4645 22.8303 72.4645 21.347C72.4645 19.8636 72.7629 18.5678 73.3597 17.4596C73.9735 16.3513 74.826 15.4988 75.9172 14.9021C77.0084 14.3053 78.2615 14.0069 79.6767 14.0069C81.0577 14.0069 82.2853 14.2968 83.3595 14.8765C84.4336 15.4562 85.2691 16.2831 85.8658 17.3573C86.4796 18.4314 86.7865 19.6846 86.7865 21.1168ZM82.3109 19.9659C82.3109 19.2157 82.0552 18.619 81.5437 18.1757C81.0322 17.7324 80.3928 17.5107 79.6255 17.5107C78.8924 17.5107 78.2701 17.7239 77.7586 18.1501C77.2641 18.5764 76.9572 19.1816 76.8379 19.9659H82.3109ZM97.7892 14.0581C99.4601 14.0581 100.79 14.6037 101.779 15.6949C102.785 16.7691 103.288 18.2524 103.288 20.145V28.4824H98.9401V20.7332C98.9401 19.7784 98.6929 19.0367 98.1984 18.5082C97.704 17.9796 97.039 17.7153 96.2036 17.7153C95.3681 17.7153 94.7032 17.9796 94.2087 18.5082C93.7143 19.0367 93.467 19.7784 93.467 20.7332V28.4824H89.0937V14.2115H93.467V16.1041C93.9103 15.4733 94.5071 14.9788 95.2573 14.6207C96.0075 14.2456 96.8515 14.0581 97.7892 14.0581ZM120.419 14.2115V28.4824H116.045V26.5387C115.602 27.1696 114.997 27.6811 114.23 28.0732C113.479 28.4483 112.644 28.6359 111.723 28.6359C110.632 28.6359 109.669 28.3972 108.833 27.9198C107.998 27.4253 107.35 26.7177 106.89 25.797C106.429 24.8763 106.199 23.7937 106.199 22.549V14.2115H110.547V21.9608C110.547 22.9156 110.794 23.6573 111.288 24.1858C111.783 24.7144 112.448 24.9786 113.283 24.9786C114.136 24.9786 114.809 24.7144 113.283 24.9786C114.136 24.9786 114.809 24.7144 115.304 24.1858C115.798 23.6573 116.045 22.9156 116.045 21.9608V14.2115H120.419Z" fill="#111E3C"/>
          </svg>
        </div>

        <Separator className="bg-slate-50" />

        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar">
          <SidebarSectionLabel label="OVERVIEW" />
          <SidebarItem icon={LayoutGrid} label="Dashboard" active href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Live Order Hub" />
          <SidebarItem icon={LineChartIcon} label="Reports" hasAdd />

          <SidebarDivider />

          <SidebarSectionLabel label="MANAGEMENT" />
          <SidebarItem icon={ClipboardList} label="Order List" />
          <SidebarItem icon={BookOpen} label="Menu Builder" />
          <SidebarItem icon={Grid3X3} label="Table Operations" href="/qr-codes" />
          <SidebarItem icon={Users} label="Guest Directory" />

          <SidebarDivider />

          <SidebarSectionLabel label="CONFIGURATION" />
          <SidebarItem icon={Settings} label="Settings" hasAdd />

          <SidebarDivider />

          <SidebarSectionLabel label="CONNECTIONS" />
          <SidebarItem icon={Plug} label="Integration" hasAdd />
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
                
                {/* Smart Search Results Dropdown */}
                {isHeaderSearchFocused && headerSearchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-none shadow-2xl z-50 overflow-hidden">
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
            <div className="flex items-center gap-2.5 text-[10px] font-bold bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-400 hover:bg-[#0CB5A8]/10 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-all cursor-default group/pos">
              <RefreshCcw className="w-3 h-3 text-slate-400 group-hover/pos:text-[#0CB5A8] transition-colors" />
              <span className="uppercase tracking-tight">POS SYNCED</span>
              <ul className="flex items-center gap-1.5 before:content-[''] before:w-1 before:h-2.5 before:bg-slate-200 before:mx-1 before:inline-block">
                <li className="text-slate-400 group-hover/pos:text-[#0CB5A8]/60 uppercase tracking-tight font-bold">JULY 02, 2:42 PM</li>
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-slate-100 text-slate-400 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#0CB5A8]/10 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-all">
                <LayoutGrid className="w-[18px] h-[18px]" />
              </div>
              <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Categories" 
                value="26" 
                change="+4.5%" 
                changeType="up" 
                icon={Layers} 
                iconColor="bg-orange-400" 
                borderClass="bg-orange-400" 
                trendLabel="vs last month"
              />
              <StatCard 
                title="Active Products" 
                value="120" 
                change="+12%" 
                changeType="up" 
                icon={Utensils} 
                iconColor="bg-pink-500" 
                borderClass="bg-pink-500" 
                trendLabel="New items added"
              />
              <StatCard 
                title="Published Pages" 
                value="8" 
                icon={FileText} 
                iconColor="bg-green-500" 
                borderClass="bg-green-500" 
                trendLabel="Updated 2 days ago"
              />
              <StatCard 
                title="Today's Orders" 
                value="45" 
                change="+8.2%" 
                changeType="up" 
                icon={ShoppingBag} 
                iconColor="bg-cyan-400" 
                borderClass="bg-cyan-400" 
                trendLabel="vs yesterday"
              />
            </div>

            {/* Middle Section: Chart and Popular Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Sales Analytics</CardTitle>
                    <CardDescription>A summary of your sales performance.</CardDescription>
                  </div>
                  <Select defaultValue="7days">
                    <SelectTrigger className="w-32 h-9 rounded-lg border-slate-200">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0CB5A8" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0CB5A8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fill: '#94a3b8', fontSize: 12}}
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#0CB5A8" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Popular Items</CardTitle>
                  <CardDescription>Highest volume sellers this period.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {popularItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{item.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">฿ {item.revenue}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="pt-2 border-t border-slate-50 flex justify-center">
                  <Button variant="link" className="text-[#0CB5A8] font-bold flex items-center gap-2">
                    <ArrowDown className="w-4 h-4" />
                    View All Items
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Bottom Section: Recent Activity & Inventory Alerts */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
                    <p className="text-sm text-slate-400 font-medium">Monitoring the latest changes across the platform.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <History className="w-5 h-5 text-[#0CB5A8]" />
                                Latest Updates
                            </CardTitle>
                            <Button variant="outline" size="sm" className="rounded-lg text-[#0CB5A8] border-[#0CB5A8]/20 hover:bg-[#0CB5A8]/10 font-bold">
                                View All Updates
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {latestUpdates.map((update, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", update.bg)}>
                                        <update.icon className={cn("w-5 h-5", update.color)} />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-bold text-sm text-slate-900">{update.title}</h4>
                                            <span className="text-xs text-slate-400">{update.time}</span>
                                        </div>
                                        <p className="text-sm text-slate-500">{update.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                         <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                    Inventory Alerts
                                </CardTitle>
                                <Button variant="outline" size="sm" className="rounded-lg text-[#0CB5A8] border-[#0CB5A8]/20 hover:bg-[#0CB5A8]/10 font-bold">
                                    View Inventory
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="p-4 bg-red-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500" />
                                        <div>
                                            <h5 className="font-bold text-sm text-slate-900">Chicken Stock</h5>
                                            <p className="text-xs text-red-400">Only 5kg remaining</p>
                                        </div>
                                    </div>
                                    <Button variant="link" className="text-red-500 p-0 h-auto font-bold text-sm hover:no-underline">Reorder</Button>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                                        <div>
                                            <h5 className="font-bold text-sm text-slate-900">Fresh Vegetables</h5>
                                            <p className="text-xs text-orange-400">Low stock warning</p>
                                        </div>
                                    </div>
                                    <Button variant="link" className="text-orange-400 p-0 h-auto font-bold text-sm hover:no-underline">Review</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-[#111827] text-white border-none shadow-xl rounded-[24px]">
                            <CardContent className="p-6 space-y-6">
                                <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                    <TrendingUp className="w-4 h-4 text-[#0CB5A8]" />
                                    This Week Performance
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
                                        <h4 className="text-2xl font-black">$12,450</h4>
                                        <div className="flex items-center text-[10px] font-bold text-emerald-400 gap-1">
                                            <ArrowUpRight className="w-3 h-3" />
                                            +15.3%
                                        </div>
                                    </div>
                                    <div className="space-y-1 border-l border-slate-800 pl-4">
                                        <p className="text-xs text-slate-500 font-medium">Avg. Order Value</p>
                                        <h4 className="text-2xl font-black">$28.50</h4>
                                        <div className="flex items-center text-[10px] font-bold text-emerald-400 gap-1">
                                            <ArrowUpRight className="w-3 h-3" />
                                            +8.7%
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
