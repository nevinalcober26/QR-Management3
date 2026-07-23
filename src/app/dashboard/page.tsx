
'use client';

import React, { useState, useMemo } from 'react';
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
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils";
import Link from 'next/link';

// --- Shared Layout Components ---

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

// --- Dashboard Specific Components ---

const StatCard = ({ title, value, change, changeType, icon: Icon, colorClass, trendLabel }: { title: string, value: string, change: string, changeType: 'up' | 'down' | 'neutral', icon: any, colorClass: string, trendLabel: string }) => (
  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden relative">
    <div className={cn("absolute top-0 left-0 w-1 h-full", colorClass)} />
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <p className="text-[13px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
          <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
        </div>
        <div className={cn("p-2.5 rounded-xl", colorClass.replace('bg-', 'bg-').concat('/10'))}>
          <Icon className={cn("w-5 h-5", colorClass.replace('bg-', 'text-'))} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {changeType !== 'neutral' && (
          <div className={cn(
            "flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[11px] font-bold",
            changeType === 'up' ? "text-[#0CB5A8] bg-[#0CB5A8]/5" : "text-[#EF4444] bg-[#EF4444]/5"
          )}>
            <TrendingUp className={cn("w-3 h-3", changeType === 'down' && "rotate-180")} />
            {change}
          </div>
        )}
        <span className="text-[11px] text-slate-400 font-medium">{trendLabel}</span>
      </div>
    </CardContent>
  </Card>
);

const chartData = [
  { day: "Mon", sales: 18000 },
  { day: "Tue", sales: 24000 },
  { day: "Wed", sales: 21000 },
  { day: "Thu", sales: 28000 },
  { day: "Fri", sales: 25000 },
  { day: "Sat", sales: 32000 },
  { day: "Sun", sales: 30000 },
];

const chartConfig = {
  sales: {
    label: "Sales",
    color: "#0CB5A8",
  },
} satisfies ChartConfig;

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
            <path d="M47.5498 21.1168C47.5498 21.526 47.5243 21.9523 47.4731 22.3956H37.5756C37.6438 23.2822 37.9251 23.9642 38.4196 24.4416C38.9311 24.9019 39.5534 25.1321 40.2865 25.1321C41.3777 25.1321 42.1365 24.6717 42.5627 23.751H47.2174C46.9787 24.6888 46.5439 25.5328 45.913 26.283C45.2992 27.0332 44.5235 27.6214 43.5857 28.0476C42.648 28.4739 41.5994 28.687 40.44 28.687C39.0419 28.687 37.7972 28.3886 36.706 27.7919C35.6148 27.1951 34.7623 26.3426 34.1485 25.2344C33.5347 24.1261 33.2278 22.8303 33.2278 21.347C33.2278 19.8636 33.5262 18.5678 34.1229 17.4596C34.7367 16.3513 35.5892 15.4988 36.6805 14.9021C37.7717 14.3053 39.0248 14.0069 40.44 14.0069C41.821 14.0069 43.0486 14.2968 44.1228 14.8765C45.1969 15.4562 46.0324 16.2831 46.6291 17.3573C47.2429 18.4314 47.5498 19.6846 47.5498 21.1168ZM43.0742 19.9659C43.0742 19.2157 42.8185 18.619 42.307 18.1757C41.7955 17.7324 41.1561 17.5107 40.3888 17.5107C39.6557 17.5107 39.0334 17.7239 38.5219 18.1501C38.0274 18.5764 37.7205 19.1816 37.6012 19.9659H43.0742ZM70.1891 10.5287V28.4824H65.8158V17.7153L61.8005 28.4824H58.2712L54.2303 17.6898V28.4824H49.857V10.5287H55.0231L60.0614 22.9582L65.0486 10.5287H70.1891ZM86.7865 21.1168C86.7865 21.526 86.761 21.9523 86.7098 22.3956H76.8123C76.8805 23.2822 77.1618 23.9642 77.6563 24.4416C78.1678 24.9019 78.7901 25.1321 79.5232 25.1321C80.6144 25.1321 81.3732 24.6717 81.7994 23.751H86.4541C86.2154 24.6888 85.7806 25.5328 85.1497 26.283C84.5359 27.0332 83.7602 27.6214 82.8224 28.0476C81.8847 28.4739 80.8361 28.687 79.6767 28.687C78.2786 28.687 77.0339 28.3886 75.9427 27.7919C74.8515 27.1951 73.999 26.3426 73.3852 25.2344C72.7714 24.1261 72.4645 22.8303 72.4645 21.347C72.4645 19.8636 72.7629 18.5678 73.3597 17.4596C73.9735 16.3513 74.826 15.4988 75.9172 14.9021C77.0084 14.3053 78.2615 14.0069 79.6767 14.0069C81.0577 14.0069 82.2853 14.2968 83.3595 14.8765C84.4336 15.4562 85.2691 16.2831 85.8658 17.3573C86.4796 18.4314 86.7865 19.6846 86.7865 21.1168ZM82.3109 19.9659C82.3109 19.2157 82.0552 18.619 81.5437 18.1757C81.0322 17.7324 80.3928 17.5107 79.6255 17.5107C78.8924 17.5107 78.2701 17.7239 77.7586 18.1501C77.2641 18.5764 76.9572 19.1816 76.8379 19.9659H82.3109ZM97.7892 14.0581C99.4601 14.0581 100.79 14.6037 101.779 15.6949C102.785 16.7691 103.288 18.2524 103.288 20.145V28.4824H98.9401V20.7332C98.9401 19.7784 98.6929 19.0367 98.1984 18.5082C97.704 17.9796 97.039 17.7153 96.2036 17.7153C95.3681 17.7153 94.7032 17.9796 94.2087 18.5082C93.7143 19.0367 93.467 19.7784 93.467 20.7332V28.4824H89.0937V14.2115H93.467V16.1041C93.9103 15.4733 94.5071 14.9788 95.2573 14.6207C96.0075 14.2456 96.8515 14.0581 97.7892 14.0581ZM120.419 14.2115V28.4824H116.045V26.5387C115.602 27.1696 114.997 27.6811 114.23 28.0732C113.479 28.4483 112.644 28.6359 111.723 28.6359C110.632 28.6359 109.669 28.3972 108.833 27.9198C107.998 27.4253 107.35 26.7177 106.89 25.797C106.429 24.8763 106.199 23.7937 106.199 22.549V14.2115H110.547V21.9608C110.547 22.9156 110.794 23.6573 111.288 24.1858C111.783 24.7144 112.448 24.9786 113.283 24.9786C114.136 24.9786 114.809 24.7144 115.304 24.1858C115.798 23.6573 116.045 22.9156 116.045 21.9608V14.2115H120.419Z" fill="#111E3C"/>
          </svg>
        </div>

        <Separator className="bg-slate-50" />

        <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar">
          <SidebarSectionLabel label="OVERVIEW" />
          <SidebarItem icon={LayoutGrid} label="Dashboard" active href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Live Order Hub" href="#" />
          <SidebarItem icon={LineChartIcon} label="Reports" hasAdd href="#" />

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
                  className="border-none bg-white shadow-none text-[13px] h-full placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-white rounded-none"
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
                  {/* ... same as qr-codes page ... */}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-[10px] font-bold bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-900 transition-all cursor-default group/pos">
              <RefreshCcw className="w-3 h-3 text-slate-500" />
              <span className="uppercase tracking-tight">POS SYNCED</span>
              <Separator orientation="vertical" className="h-2.5 bg-slate-200 mx-1" />
              <span className="text-slate-500 uppercase tracking-tight font-bold">JULY 02, 2:42 PM</span>
            </div>
            <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
              <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
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
                icon={Package} 
                colorClass="bg-orange-500" 
                trendLabel="vs last month"
              />
              <StatCard 
                title="Active Products" 
                value="120" 
                change="+12%" 
                changeType="up" 
                icon={ShoppingBag} 
                colorClass="bg-pink-500" 
                trendLabel="New items added"
              />
              <StatCard 
                title="Published Pages" 
                value="8" 
                change="NA" 
                changeType="neutral" 
                icon={FileText} 
                colorClass="bg-green-500" 
                trendLabel="Updated 2 days ago"
              />
              <StatStatStatCard Stat Stat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatState StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat the s de can get ecStatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat state factStat StatStat StatStat StatStat StatStat progress StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStatement ChangeStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StateStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat Statistically.StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatStat StatState de d’un de l’un de l’un de l’un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l'un de l{ }^{\text {th }}$ July, 2011, through e-mail No. BPRD (DR-2)005/2011/986 dated July 13, 2011 issued by Bangladesh Bank. The financial statements of the branches operated in Bangladesh (the Bank) as at and for the year ended 31 December 2022 were prepared in accordance with International Financial Reporting Standards (IFRS) and the requirements of the Banking Companies Act, 1991, the rules and regulations issued by the Bangladesh Bank, the Companies Act, 1994, the Securities and Exchange Rules, 1987 and other applicable laws and regulations in Bangladesh. In case the requirements of the Bangladesh Bank and the Securities and Exchange Commission (SEC) differ with those of IFRS, the requirements of the Bangladesh Bank and the Securities and Exchange Commission shall prevail.

BRPD Circular No. 14, dated 23 June 2003, requires the preparation of the financial statements in a specific format. The Departinent of Banking Inspection (DBI) of Bangladesh Bank vide its letter ref no. DBI-1/640/2023-1188 dated 26 April 2023 has granted exemption to the Bank from the specific formats of the financial statements, as prescribed in BRPD Circular No. 14 dated 23 June 2003, for the year ended 31 December 2022. Consequently, these financial statements have been prepared in accordance with the International Financial Reporting Standards (IFRS), and as per the guidelines of Bangladesh Bank. Relevant disclosures are made in the notes to the financial statements.

2.03 Use of estimates and judgments

The preparation of the financial statements in conformity with IFRS requires management to make judgments, estimates and assumptions that affect the application of accounting policies and the reported amounts of assets, liabilities, income and expenses. Actual results may differ from these estimates.

Estimates and underlying assumptions are reviewed on an ongoing basis. Revisions to accounting estimates are recognised in the period in which the estimate is revised and in any future periods affected.

Information about significant areas of estimation, uncertainty and critical judgements in applying accounting policies that have the most significant effect on the amounts recognised in the financial statements are described in the following notes:

- Note 2.05.02 (b) - depreciation

- Note 2.05.03 - amortization

- Note 2.05.10 - provision for income taxes

- Note 2.05.11 - provision for gratuity

- Note $2.05 .13$ - provisions for liabilities and charges

- Note 4.01 - provision for loans and advances /n2.04 Foreign currency translation

The financial statements of the Bank are presented in Taka, which is the Bank's functional and presentation currency.

Transactions in foreign currencies are translated into Taka at the exchange rates prevailing on the dates of the transactions. Monetary assets and liabilities denominated in foreign currencies are translated into Taka at the closing rate of exchange at the reporting date. Non-monetary assets and liabilities in foreign currencies that are measured in terms of historical cost are translated using the exchange rates at the dates of the transactions. Non-monetary assets and liabilities denominated in foreign currencies that are stated at fair value are translated into Taka at foreign exchange rates ruling at the dates the fair value was determined. Foreign exchange differences arising on translation are recognised in the profit and loss account.

2.05 Significant accounting policies

The accounting policies set out below have been applied consistently to all periods presented in these financial statements.

\subsubsection{Accounting for Investments}

The investments inGovernment securities (Treasury bills, bonds) are classified as "Held to Maturity" (HTM) and "Held for Trading" (HFT) according to the nature of the investments and as per the guidelines of Bangladesh Bank.

Held to Maturity (HTM): Government securities with fixed or determinable payments and fixed maturity that the Bank has the positive intent and ability to hold to maturity are classified as "Held to Maturity".

Held for Trading (HFT): Government securities that are held for being traded in the near term are classified as "Held for Trading".

\section{Measurement}

Quoted securities are valued at cost. Unquoted securities are valued at cost or Net Asset Value (NAV) whichever is lower.

Investment in treasury bills and bonds (HTM) are valued at amortised cost. The premium on the bonds is amortized over the period to maturity.

Investment in treasury bills and bonds (HFT) are valued at mark-to-market. The revaluation gain, if any, is credited to the Revaluation Reserve Account and the revaluation loss is charged to the profit and loss account.

\subsubsection{Fixed Assets and Depreciation}

(a) Recognition and measurement Items of fixed assets are measured at cost less accumulated depreciation and accumulated impairment losses.

Cost includes expenditures that are directly attributable to the acquisition of the assets. The cost of selfconstructed assets includes the cost of materials and direct labour, any other costs directly attributable to bringing the assets to a working condition for their intended use and the costs of dismantling and removing the items and restoring the site on which they are located. /n(b) Depreciation

Depreciation is charged on a straight-line basis over the estimated useful lives of each part of an item of fixed assets. Depreciation is charged from the date the asset is available for use. The estimated useful lives for the current and comparative periods are as follows:

Category

$\begin{array}{cc}\text { Estimated Useful Life (Years) } & \text { Rate (\%) } \\ 10 & 10 \\ 6.67 & 15 \\ 3.33 & 30 \\ 3.33 & 30\end{array}$

Furniture and fixtures

Office equipment

IT equipment

Software

(c) Revaluation

There are no revalued assets.

(d) Capital work-in-progress

Capital work-in-progress represents the cost incurred for yet to be completed property, plant and equipment. These are stated at cost and will be transferred to the relevant category of property, plant and equipment when they are ready for use.

\subsubsection{Intangible Assets}

Intangible assets comprise the value of computer software. Intangible assets are stated at cost less accumulated amortisation and any impairment losses.

Amortization is provided on the straight-line method at $30 \%$ p.a. to write-off the cost of intangible assets over their estimated useful lives.

\subsubsection{Foreign exchange}

Foreign currency transactions are converted into Taka at the exchange rates prevailing on the dates of transactions. Assets and liabilities in foreign currencies as at 31 December 2022 are translated into Taka at the year-end inter-bank exchange rates. Resulting exchange differences are recognised in the profit and loss account.

\subsubsection{Leases}

Operating Lease

Initially, the Bank as a lessee shall measure the right-of-use asset at cost. The cost of the right-of-use asset shall comprise the amount of the initial measurement of the lease liability, any lease payments made at or before the commencement date, less any lease incentives received, any initial direct costs incurred by the lessee and an estimate of costs to be incurred by the lessee in dismantling and removing the underlying asset, restoring the site on which it is located or restoring the underlying asset to the condition required by the terms and conditions of the lease.

After the commencement date, the Bank shall measure the right-of-use asset applying a cost model. To apply a cost model, a lessee shall measure the right-of-use asset at cost less any accumulated depreciation and any accumulated impairment losses and adjusted for any remeasurement of the lease liability.

Finance Lease

Leases in terms of which the Bank assumes substantially all the risks and rewards of ownership are classified as finance leases. Upon initial recognition the leased asset is measured at an amount equal to the lower of its fair value and the present value of the minimum lease payments. Subsequent to initial recognition, the asset is accounted for in accordance with the accounting policy applicable to that asset. /n

\subsubsection{Revenue Recognition}

(i) Interest income

The Bank calculates interest income by applying the effective interest rate to the gross carrying amount of financial assets other than credit-impaired assets. When a financial asset becomes credit-impaired, the Bank calculates interest income by applying the effective interest rate to the net amortised cost of the financial asset. If the financial asset cures and is no longer credit-impaired, the Bank reverts to calculating interest income on a gross basis.

In accordance with the guidelines of Bangladesh Bank, no interest income is recognized on classified loans and advances. Interest on these loans is credited to an interest suspense account. This interest is only recognized as income when it is actually realized.

(ii) Commission and fee income

Fee and commission income is recognized on an accrual basis when the service has been provided.

Commission on Guarantees, Letters of Credit, etc. is recognized on an accrual basis over the period of the instrument.

(iii) Income from investments

Interest income on investments is recognized on an accrual basis.

(iv) Other income

Other income is recognized on an accrual basis.

\subsubsection{Employee benefits}

(i) Provident fund

The Bank operates a defined contribution provident fund for its employees. This fund is recognized by the National Board of Revenue.

(ii) Gratuity

The Bank provides for a gratuity scheme for its employees. The scheme is a defined benefit plan and is based on the employees' last drawn salary and years of service. The Bank makes annual contributions to the gratuity fund based on actuarial valuations.

(iii) Other benefits

Other benefits provided to employees include festival bonus, leave encashment, etc., which are recognized on an accrual basis.

\subsubsection{Cash and cash equivalents}

Cash and cash equivalents include notes and coins on hand, balances with the Bangladesh Bank and its agent bank, and balances with other banks and financial institutions.

\subsubsection{Statement of Cash Flows}

The Statement of Cash Flows has been prepared using the Direct Method in accordance with the requirements of the Bangladesh Bank.

\subsubsection{Provision for income taxes}

Income tax expense comprises current and deferred tax. Income tax expense is recognized in the profit and loss account. /n(i) Current Tax

Current tax is the expected tax payable on the taxable income for the year, using tax rates enacted at the balance sheet date, and any adjustment to tax payable in respect of previous years.

(ii) Deferred Tax

Deferred tax is provided using the balance sheet method, providing for temporary differences between the carrying amounts of assets and liabilities for financial reporting purposes and the amounts used for taxation purposes. Deferred tax is measured at the tax rates that are expected to be applied to the temporary differences when they reverse, based on the laws that have been enacted or substantively enacted by the reporting date.

A deferred tax asset is recognized only to the extent that it is probable that future taxable profits will be available against which the asset can be utilized.

\subsubsection{Provisions}

A provision is recognized in the balance sheet when the Bank has a legal or constructive obligation as a result of a past event, and it is probable that an outflow of economic benefits will be required to settle the obligation. If the effect is material, provisions are determined by discounting the expected future cash flows at a pre-tax rate that reflects current market assessments of the time value of money and, where appropriate, the risks specific to the liability.

\subsubsection{Staff loans}

Staff loans are granted to the employees of the Bank at a concessional rate as per the Bank's human resource policy. These loans are recognized at their cost.

\subsubsection{Off-balance sheet items}

Off-balance sheet items include commitments to extend credit, letters of credit, and guarantees. These items are recognized in the financial statements when the commitments are made.

\subsubsection{Reconciliation of inter-bank/inter-branch account}

The Bank reconciles its inter-bank and inter-branch accounts on a regular basis. Any unreconciled items are investigated and resolved promptly.

\subsubsection{Earnings Per Share (EPS)}

The Bank presents basic and diluted earnings per share (EPS) data for its ordinary shares. Basic EPS is calculated by dividing the profit or loss attributable to ordinary shareholders of the Bank by the weighted average number of ordinary shares outstanding during the period. Diluted EPS is determined by adjusting the profit or loss attributable to ordinary shareholders and the weighted average number of ordinary shares outstanding for the effects of all dilutive potential ordinary shares. /n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\section{CASH}

Cash in hand (including foreign currencies)

Balance with Bangladesh Bank and its agent bank (including foreign currencies)

\subsection{Cash in hand (including foreign currencies)}

Local currency

Foreign currencies

\subsection{Balance with Bangladesh Bank and its agent bank (including foreign currencies)}

Bangladesh Bank:

Local currency

Foreign currencies

Sonali Bank as agent of Bangladesh Bank:

Local currency

\subsection{Cash Reserve Ratio (CRR) and Statutory Liquidity Ratio (SLR)}

Cash Reserve Ratio (CRR) and Statutory Liquidity Ratio (SLR) have been calculated and maintained in accordance with Section 33 of the Banking Companies Act, 1991 and MPD Circular No. 03, dated 21 June 2020.

The Cash Reserve Ratio (CRR) on the Bank's average daily balance is $4.0 \%$ and is maintained with Bangladesh Bank.

The Statutory Liquidity Ratio (SLR) is $13.0 \%$ and is maintained in the form of cash in hand, balance with Bangladesh Bank and other banks, unencumbered approved securities.

\subsubsection{Cash Reserve Ratio (CRR)}

As per Bangladesh Bank MPD Circular No. 03, dated June 21, 2020, the Bank has to maintain CRR @ $4.0 \%$ on its average daily balance of last fortnight of the second month preceding the current month.

Required reserve Actual reserve held Surplus

\subsubsection{Statutory Liquidity Ratio (SLR)}

As per section 33 of the Banking Companies Act 1991 (amended up to 2013) and MPD circular no. 02 dated June 10, 2020 and DOS circular no. 01 dated January 19, 2014, the Bank has to maintain SLR @ 13.0% of its average daily balance of last fortnight of the second month preceding the current month.

Required reserve Actual reserve held (Note 3.3.3) Surplus

\begin{tabular}{rr}
$12,709,334$ & $9,951,023$ \\
$16,423,732$ & $25,124,942$ \\
\hline $\mathbf{3 , 7 1 4 , 3 9 8}$ & $\mathbf{1 5 , 1 7 3 , 9 1 9}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$41,305,335$ & $32,340,825$ \\
$84,008,189$ & $78,561,048$ \\
\hline $\mathbf{4 2 , 7 0 2 , 8 5 4}$ & $\mathbf{4 6 , 2 2 0 , 2 2 3}$ \\
\hline \hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\subsubsection{Actual reserve held for SLR}

Cash in hand (including foreign currencies)

Balance with Bangladesh Bank in excess of CRR

Balance with Sonali Bank (as agent of Bangladesh Bank)

Government securities - T-Bills & T-Bonds (HFT)

Government securities - T-Bonds (HTM)

Other securities (Prize Bond)

\section{BALANCE WITH OTHER BANKS AND FINANCIAL INSTITUTIONS}

In Bangladesh (Note 4.1)

Outside Bangladesh (Note 4.2)

\subsection{In Bangladesh}

Current accounts:

Standard Chartered Bank, Dhaka (Note 4.1.1)

Term deposits:

Banks

Non-bank financial institutions

Total

\begin{tabular}{rr}
$1,720,283$ & $1,757,980$ \\
$3,714,398$ & $15,173,919$ \\
$1,563,059$ & $1,595,920$ \\
$14,929,313$ & $17,163,803$ \\
$62,080,240$ & $42,868,767$ \\
896 & 659 \\
\hline $\mathbf{8 4 , 0 0 8 , 1 8 9}$ & $\mathbf{7 8 , 5 6 1 , 0 4 8}$ \\
\hline
\end{tabular}

\subsubsection{Current accounts with Standard Chartered Bank, Dhaka}

\begin{tabular}{rr}
183,923 & 60,676 \\
$16,198,103$ & $29,067,882$ \\
\hline $\mathbf{1 6 , 3 8 2 , 0 2 6}$ & $\mathbf{2 9 , 1 2 8 , 5 5 8}$ \\
\hline
\end{tabular}

This balance represents amount in clearing account with Standard Chartered Bank, Dhaka. For the purpose of statutory reporting, this balance has been reported under 'Balance with other banks and financial institutions'. For the purpose of the financial statements of the Bank, this amount has been adjusted with the 'Amount due from / (to) Head Office and branches outside Bangladesh' (see Note 11).

\subsection{Outside Bangladesh}

Current accounts:

Standard Chartered Bank, overseas branches (Note 4.2.1)

Other banks (Note 4.2.1)

\begin{tabular}{rr}
$15,617,125$ & $28,970,051$ \\
580,978 & 97,831 \\
\hline $\mathbf{1 6 , 1 9 8 , 1 0 3}$ & $\mathbf{2 9 , 0 6 7 , 8 8 2}$ \\
\hline
\end{tabular}

\subsubsection{Current accounts with other banks (outside Bangladesh)}

Standard Chartered Bank - New York

Standard Chartered Bank - United Kingdom

Standard Chartered Bank - Singapore

Standard Chartered Bank - Mumbai

Standard Chartered Bank - Frankfurt

Standard Chartered Bank - Tokyo

Standard Chartered Bank - China

Standard Chartered Bank - Hong Kong

Standard Chartered Bank - Italy

Standard Chartered Bank - Pakistan

Standard Chartered Bank - Sri Lanka

Standard Chartered Bank - Thailand

JP Morgan Chase - New York

Zuercher Kantonal Bank

Standard Chartered Bank - Vietnam

Citibank N.A. New York

Australia and New Zealand Banking Group Ltd.

Standard Chartered Bank - Mauritius

Standard Chartered Bank - Paris

Commerzbank AG

\begin{tabular}{rr}
$13,293,724$ & $22,468,142$ \\
581,870 & $4,008,126$ \\
$1,192,204$ & $1,739,726$ \\
239,949 & 133,363 \\
143,456 & 232,049 \\
2,467 & 4,772 \\
48,018 & 124,535 \\
78,416 & 220,111 \\
3,556 & 4,749 \\
4,769 & 5,115 \\
14,976 & 16,984 \\
1,600 & 2,752 \\
192,977 & 47,211 \\
37,014 & 37,217 \\
1,540 & 1,939 \\
246,145 & 5,348 \\
9,680 & 4,204 \\
9,365 & 8,111 \\
24 & 1,602 \\
98,349 & 1,826 \\
\hline $\mathbf{1 6 , 1 9 8 , 1 0 3}$ & $\mathbf{2 9 , 0 6 7 , 8 8 2}$ \\
\hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

4.3 Maturity grouping of balance with other banks and financial institutions

On demand

Up to 3 months

Over 3 months but not more than 1 year

Over 1 year but not more than 5 years

Over 5 years

\section{MONEY AT CALL AND SHORT NOTICE}

Commercial banks

Financial institutions

\section{INVESTMENTS}

Government securities (Note 6.1)

Other investments (Note 6.2)

\subsection{Government securities}

Treasury bills (Note 6.1.1)

Treasury bonds (Note 6.1.2)

Prize bonds

\subsubsection{Treasury bills}

91 days

182 days

364 days

\subsubsection{Treasury bonds}

2 years

5 years

10 years

15 years

20 years

\subsection{Other investments}

Financial institutions

Bond (Note 6.2.1)

Sub-total

\section{Corporate}

Preference Share (Note 6.2.2)

Sub-total

\subsubsection{Bond}

Dhaka Bank Limited 7 Year Unsecured Non-Convertible Subordinated Bond Trust Bank Limited Unsecured Non-Convertible Subordinated Bond Prime Bank Limited Unsecured Non-Convertible Subordinated Bond Bank Asia Limited Unsecured Non-Convertible Subordinated Bond IDLC Finance Limited Unsecured Non-Convertible Subordinated Bond

\begin{tabular}{cc}
$16,382,026$ & $29,128,558$ \\
$-$ & $-$ \\
$-$ & $-$ \\
$-$ & $-$ \\
$-$ & $-$ \\
\hline $\mathbf{1 6 , 3 8 2 , 0 2 6}$ & $\mathbf{2 9 , 1 2 8 , 5 5 8}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{cr}
$5,650,000$ & $-$ \\
$-$ & $-$ \\
\hline $\mathbf{5 , 6 5 0 , 0 0 0}$ & $-$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$77,009,553$ & $60,032,570$ \\
$1,173,000$ & $1,283,000$ \\
\hline $\mathbf{7 8 , 1 8 2 , 5 5 3}$ & $\mathbf{6 1 , 3 1 5 , 5 7 0}$ \\
\hline \hline
\end{tabular}

$4,375,188 \quad 3,694,769$

$72,633,469 \quad 56,337,142$

$896 \quad 659$

$\mathbf{7 7 , 0 0 9 , 5 5 3} \mathbf{6 0 , 0 3 2 , 5 7 0}$

$1,960,375 \quad 1,180,683$

$217,330 \quad 1,940,328$

$2,197,483 \quad 573,758$

$4,375,188 \quad 3,694,769$

$10,217,543 \quad 8,639,183$

$17,309,692 \quad 11,261,311$

$26,260,845 \quad 17,992,306$

$9,576,011 \quad 9,335,011$

$9,269,378 \quad 9,109,331$

$\mathbf{7 2 , 6 3 3 , 4 6 9} \quad \mathbf{5 6 , 3 3 7 , 1 4 2}$

\begin{tabular}{rr}
$1,050,000$ & $1,050,000$ \\
\hline $1,050,000$ & $1,050,000$ \\
\hline
\end{tabular}

\begin{tabular}{rr}
123,000 & 233,000 \\
\hline 123,000 & 233,000 \\
\hline $\mathbf{1 , 1 7 3 , 0 0 0}$ & $\mathbf{1 , 2 8 3 , 0 0 0}$ \\
\hline \hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\subsubsection{Preference Share}

Summit Gazipur II Power Limited Non-Convertible Cumulative Preference Share United Mymensingh Power Ltd Non-Convertible Non-Cumulative Preference Share Union Bank Ltd Mudaraba Non-Convertible Perpetual Mudaraba Bond Max Infra Limited Redeemable Preference Share

\subsection{Maturity grouping of investments}

Up to 1 month

Over 1 month to 3 months

Over 3 months to 1 year

Over 1 year to 5 years

Over 5 years

\section{LOANS AND ADVANCES}

Loans, cash credits, overdrafts, etc. (Note 7.1)

Bills purchased and discounted (Note 7.2)

7.1 Loans, cash credits, overdrafts, etc.

Inside Bangladesh:

Loans

Cash credits

Overdrafts

Others (Demand Loans, Trust Receipts, House Building Loans, etc.)

Outside Bangladesh

7.2 Bills purchased and discounted

Payable in Bangladesh

Payable outside Bangladesh

\begin{tabular}{rr}
50,000 & 100,000 \\
73,000 & 123,000 \\
$-$ & 10,000 \\
$-$ & $-$ \\
\hline $\mathbf{1 2 3 , 0 0 0}$ & $\mathbf{2 3 3 , 0 0 0}$ \\
\hline \hline & \\
& \\
$2,454,496$ & $3,059,203$ \\
$2,298,826$ & 869,308 \\
$2,197,483$ & 573,758 \\
$18,485,391$ & $15,116,914$ \\
$52,746,357$ & $41,696,387$ \\
\hline $\mathbf{7 8 , 1 8 2 , 5 5 3}$ & $\mathbf{6 1 , 3 1 5 , 5 7 0}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$280,086,512$ & $214,136,589$ \\
$19,006,204$ & $12,790,392$ \\
\hline $\mathbf{2 9 9 , 0 9 2 , 7 1 6}$ & $\mathbf{2 2 6 , 9 2 6 , 9 8 1}$ \\
\hline \hline
\end{tabular}

7.3 Maturity grouping of loans and advances

On demand

Up to 3 months

$40,996,182$

Over 3 months to 1 year

$118,529,865$

$103,425,720$

Over 1 year to 5 years

$88,629,067$

$65,064,286$

Over 5 years

$34,314,642$

$24,089,451$

$16,622,960$

$11,358,011$

$299,092,716$

$226,926,981$ /n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

7.4 Loans and advances on the basis of significant concentration

a) Advances to directors, executives and officers of the Bank

b) Advances to customers other than directors, executives and officers:

i) Agricultural

ii) Industry:

- Food & beverage

- Jute and jute products

- Textile

- Garments

- Chemical, pharmaceutical and allied products

- Cement

- Bricks

- Wood & bamboo and its products

- Paper & paper products

- Rubber, plastic & leather products

- Iron, steel and engineering

- Energy & power

- Others

iii) Construction

iv) Transport, storage and communication

v) Trade & commerce

vi) Personal & Professional loans

vii) Others

7.5 Geographical location-wise (region)

Inside Bangladesh

Dhaka Division

Chittagong Division

Khulna Division

Sylhet Division

Rajshahi Division

Barishal Division

Rangpur Division

Mymensingh Division

Outside Bangladesh

7.6 Classification of loans and advances

Unclassified

Standard

Special Mention Account

Classified

Sub-standard

Doubtful

Bad / Loss

\begin{tabular}{rr}
550,229 & 449,706 \\
$12,713,293$ & $8,524,435$ \\
& \\
$21,795,788$ & $22,865,249$ \\
593,243 & 608,983 \\
$32,642,883$ & $23,738,103$ \\
$51,691,732$ & $36,259,002$ \\
$15,649,957$ & $10,131,349$ \\
$2,987,901$ & $2,878,085$ \\
$-$ & 3,212 \\
114,357 & 116,913 \\
$4,171,987$ & $3,400,211$ \\
$1,674,807$ & $2,298,905$ \\
$18,485,274$ & $13,639,122$ \\
$42,860,111$ & $27,477,882$ \\
$18,806,786$ & $11,385,836$ \\
$14,929,141$ & $7,532,156$ \\
466,742 & 432,604 \\
$46,929,481$ & $41,403,281$ \\
$10,214,032$ & $11,595,798$ \\
$1,814,972$ & $2,186,149$ \\
\hline $\mathbf{2 9 9 , 0 9 2 , 7 1 6}$ & $\mathbf{2 2 6 , 9 2 6 , 9 8 1}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$230,064,260$ & $170,051,894$ \\
$68,881,192$ & $56,664,570$ \\
$-$ & $-$ \\
147,264 & 210,517 \\
$-$ & $-$ \\
$-$ & $-$ \\
$-$ & $-$ \\
$-$ & $-$ \\
\hline $299,092,716$ & $226,926,981$ \\
$-$ & $-$ \\
\hline $299,092,716$ & $226,926,981$ \\
\hline
\end{tabular}

$287,511,811$

$219,812,698$

$4,451,130$

$2,642,883$

$291,962,941$

$222,455,581$

\begin{tabular}{rr}
487,030 & 168,771 \\
168,092 & 100,562 \\
$6,474,653$ & $4,202,067$ \\
\hline $\mathbf{7 , 1 2 9 , 7 7 5}$ & $\mathbf{4 , 4 7 1 , 4 0 0}$ \\
\hline $\mathbf{2 9 9 , 0 9 2 , 7 1 6}$ & $\mathbf{2 2 6 , 9 2 6 , 9 8 1}$ \\
\hline \hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\subsection{Particulars of Loans, Cash Credits and Overdrafts}

(i) Debts considered good in respect of which the bank is fully secured;

(ii) Debts considered good for which the bank holds no other security other than the debtor's personal security;

(iii) Debts considered good, secured by the personal liabilities of one or more parties in addition to the personal security of the debtors;

(iv) Debts considered doubtful or bad, not provided for;

(v) Debts due by directors or officers of the banking company or any of them either severally or jointly with any other persons;

(vi) Debts due by companies or firms in which the directors of the banking company are interested as directors, partners or managing agents or, in the case of private companies, as members;

(vii) Maximum total amount of advances, including temporary advances made at any time during the year to directors or managers or officers of the banking company or any of them either severally or jointly with any other persons;

(viii) Maximum total amount of advances, including temporary advances granted during the year to the companies or firms in which the directors of the banking company are interested as directors, partners or managing agents or, in the case of private companies, as members;

(ix) Due from banking companies

(x) Amount of classified loan on which interest has not been charged:

(a) Decrease/increase in provision (specific)

(b) Amount of loan written off

(c) Amount of loan recovered against which was previously written off

(d) Amount of interest credited to Interest Suspense Account

(xi) Cumulative amount of written off loan:

Balance at the beginning of the year

Amount written off during the year

Balance at the end of the year

The amount of written off loan for which lawsuits have been filed $185,550,119$

$164,136,547$

$106,412,822$

$58,318,854$

$7,129,775$

$4,471,580$

550,229

449,706

550,229

449,706 /n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

8 FIXED ASSETS INCLUDING LAND, BUILDING, FURNITURE AND FIXTURES

Assets at cost (Note 8.1)

Less: Accumulated depreciation (Note 8.1)

Right-of-use assets (Note 8.2.1)

Less: Accumulated depreciation (Note 8.2.1)

Software (Note 8.3.1)

Less: Accumulated Amortization (Note 8.3.1)

Total Book value

\begin{tabular}{rr}
$3,074,402$ & $3,101,659$ \\
$(2,581,858)$ & $(2,569,219)$ \\
\hline 492,544 & 532,440 \\
\hline $3,196,523$ & $2,873,348$ \\
$(1,577,419)$ & $(1,126,837)$ \\
\hline $1,619,104$ & $1,746,511$ \\
\hline $1,180,683$ & $1,114,357$ \\
$(915,223)$ & $(839,471)$ \\
\hline 265,460 & 274,886 \\
\hline & \\
\hline $\mathbf{2 , 3 7 7 , 1 0 8}$ & $\mathbf{2 , 5 5 3 , 8 3 7}$ \\
\hline \hline
\end{tabular}

8.1 Assets at Cost

Balance at the beginning of the year

Additions during the year

Adjustments / transfers during the year

Balance at the end of the year

\begin{tabular}{rr}
$3,101,659$ & $2,933,763$ \\
124,310 & 216,400 \\
$(151,567)$ & $(48,504)$ \\
\hline $\mathbf{3 , 0 7 4 , 4 0 2}$ & $\mathbf{3 , 1 0 1 , 6 5 9}$ \\
\hline & \\
$2,569,219$ & $2,423,730$ \\
145,178 & 176,575 \\
$(132,539)$ & $(31,086)$ \\
\hline $\mathbf{2 , 5 8 1 , 8 5 8}$ & $\mathbf{2 , 5 6 9 , 2 1 9}$ \\
\hline $\mathbf{4 9 2 , 5 4 4}$ & $\mathbf{5 3 2 , 4 4 0}$ \\
\hline \hline
\end{tabular}

\section{Accumulated depreciation}

Balance at the beginning of the year

Charge during the year

Adjustments / transfers during the year

Balance at the end of the year

Net Book Value

Details of fixed assets are given in Annexure - $B$.

\subsection{Lease (IFRS 16)}

8.2.1 Right-of-use assets

Balance at the beginning of the year

Additions during the year

Disposal during the year

Balance at the end of the year

\begin{tabular}{cc}
$2,873,348$ & $2,467,705$ \\
$1,170,086$ & 554,432 \\
$(846,911)$ & $(148,789)$ \\
\hline $\mathbf{3 , 1 9 6 , 5 2 3}$ & $\mathbf{2 , 8 7 3 , 3 4 8}$ \\
\hline
\end{tabular}

Accumulated depreciation

Balance at the beginning of the year

Charge during the year

Disposal during the year

Balance at the end of the year

Net Book Value

\begin{tabular}{cc}
$1,126,837$ & 753,745 \\
$1,164,888$ & 495,290 \\
$(714,306)$ & $(122,198)$ \\
\hline $\mathbf{1 , 5 7 7 , 4 1 9}$ & $\mathbf{1 , 1 2 6 , 8 3 7}$ \\
\hline $\mathbf{1 , 6 1 9 , 1 0 4}$ & $\mathbf{1 , 7 4 6 , 5 1 1}$ \\
\hline \hline
\end{tabular}

\subsubsection{Lease Liabilities}

Balance at the beginning of the year

Additions during the year

Interest Accrual

Payments during the year

Disposal during the year

Balance at the end of the year

\begin{tabular}{rr}
$1,849,271$ & $1,791,230$ \\
$1,167,419$ & 539,949 \\
167,236 & 119,776 \\
$(1,213,275)$ & $(570,050)$ \\
$(171,987)$ & $(31,634)$ \\
\hline $\mathbf{1 , 7 9 8 , 6 6 4}$ & $\mathbf{1 , 8 4 9 , 2 7 1}$ \\
\hline \hline
\end{tabular}

The Bank has adopted IFRS 16 "Leases" since January 2019. The lease term was estimated based on the non-cancellable period of a lease, together with both: (a) periods covered by an option to extend the lease if the lessee is reasonably certain to exercise that option; and (b) periods covered by an option to terminate the lease if the lessee is reasonably certain not to exercise that option. The discount rate applied to lease liabilities is the incremental borrowing rate.

The lease payments for the ROU assets are as follows:

Within one year

Between one and five years

More than five years

$\begin{array}{rr}1,114,242 & 900,477 \\ 684,422 & 948,794 \\ - & -\end{array}$

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\subsection{Software}

\subsubsection{Cost}

Balance at the beginning of the year

Additions during the year

Adjustments / transfers during the year

Balance at the end of the year

\section{Accumulated amortization}

Balance at the beginning of the year

Charge during the year

Adjustments / transfers during the year

Balance at the end of the year

Net Book Value

\section{OTHER ASSETS}

Interest receivable (Note 9.1)

Advance tax (Note 9.2)

Inventory

Suspense account (Note 9.3)

Others (Note 9.4)

Less: Provision for other assets (Note 14.2)

9.1 Interest receivable:

Government securities

Loans and advances

Banks and financial institutions

9.2 Advance tax:

Balance at the beginning of the year

TDS during the year

Adjustment during the year

Balance at the end of the year

\begin{tabular}{rr}
$1,114,357$ & 959,045 \\
66,326 & 155,312 \\
$-$ & $-$ \\
\hline $\mathbf{1 , 1 8 0 , 6 8 3}$ & $\mathbf{1 , 1 1 4 , 3 5 7}$ \\
\hline & \\
839,471 & 740,948 \\
75,752 & 98,523 \\
$-$ & $-$ \\
\hline $\mathbf{9 1 5 , 2 2 3}$ & $\mathbf{8 3 9 , 4 7 1}$ \\
\hline $\mathbf{2 6 5 , 4 6 0}$ & $\mathbf{2 7 4 , 8 8 6}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,967,364$ & $1,154,236$ \\
$51,192,203$ & $44,577,419$ \\
31,867 & 37,287 \\
$1,568,220$ & 305,627 \\
$3,191,335$ & $2,933,837$ \\
$(424,312)$ & $(16,778)$ \\
\hline $\mathbf{5 7 , 5 2 6 , 6 7 7}$ & $\mathbf{4 8 , 9 9 1 , 6 2 8}$ \\
\hline \hline & \\
593,243 & 510,798 \\
$1,273,534$ & 573,285 \\
100,587 & 70,153 \\
\hline $\mathbf{1 , 9 6 7 , 3 6 4}$ & $\mathbf{1 , 1 5 4 , 2 3 6}$ \\
\hline \hline
\end{tabular}

9.3 Suspense account:

Sundry debtors

Others

\begin{tabular}{rr}
$44,577,419$ & $36,252,900$ \\
$6,614,784$ & $8,324,519$ \\
$-$ & $-$ \\
\hline $\mathbf{5 1 , 1 9 2 , 2 0 3}$ & $\mathbf{4 4 , 5 7 7 , 4 1 9}$ \\
\hline \hline
\end{tabular}

9.4 Others:

Accounts receivables

Prepayments

Prepaid rent

Net deferred tax assets (Note 14.4.1)

Advance to vendors

Others

\begin{tabular}{rr}
386,076 & 119,737 \\
$1,182,144$ & 185,890 \\
\hline $\mathbf{1 , 5 6 8 , 2 2 0}$ & $\mathbf{3 0 5 , 6 2 7}$ \\
\hline
\end{tabular}

\begin{tabular}{rr}
569,637 & 216,767 \\
293,767 & 288,521 \\
16,613 & 15,557 \\
$2,197,358$ & $2,306,128$ \\
41,400 & 36,448 \\
72,560 & 70,416 \\
\hline $\mathbf{3 , 1 9 1 , 3 3 5}$ & $\mathbf{2 , 9 3 3 , 8 3 7}$ \\
\hline \hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\section{BORROWINGS FROM OTHER BANKS, FINANCIAL INSTITUTIONS AND AGENTS}

In Bangladesh (Note 10.1)

Outside Bangladesh (Note 10.2)

\subsection{In Bangladesh}

Bangladesh Bank:

Under Refinance Schemes

From other Banks and Financial Institutions:

Overdrafts

Term borrowings

Repo

Other borrowings

10.2 Outside Bangladesh

Banks:

Overdrafts

Term borrowings

Other borrowings

10.3 Security-wise grouping of borrowings

Secured

Unsecured

10.4 Maturity grouping of borrowings

Payable on demand

Up to 1 month

Over 1 month but not more than 3 months

Over 3 months but not more than 1 year

Over 1 year but not more than 5 years

Over 5 years

11 AMOUNTS DUE TO HEAD OFFICE AND BRANCHES OUTSIDE BANGLADESH

Inside Bangladesh

Head office, London

Other branches outside Bangladesh:

India

Singapore

Philippines

Jordan

Sri Lanka

Thailand

Malaysia

Korea

Hong Kong

South Africa

Oman

U.A.E

Uganda

Vietnam

Turkey

Others

\begin{tabular}{rr}
$13,565,302$ & $12,795,787$ \\
$17,046,312$ & $16,777,370$ \\
\hline $\mathbf{3 0 , 6 1 1 , 6 1 4}$ & $\mathbf{2 9 , 5 7 3 , 1 5 7}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$6,861,354$ & $4,588,672$ \\
125,123 & 37,115 \\
$3,000,000$ & $3,000,000$ \\
$3,578,825$ & $5,170,000$ \\
$-$ & $-$ \\
\hline $\mathbf{1 3 , 5 6 5 , 3 0 2}$ & $\mathbf{1 2 , 7 9 5 , 7 8 7}$ \\
\hline
\end{tabular}

\begin{tabular}{rr}
4,302 & 270,361 \\
$17,042,010$ & $16,507,009$ \\
$-$ & $-$ \\
\hline $\mathbf{1 7 , 0 4 6 , 3 1 2}$ & $\mathbf{1 6 , 7 7 7 , 3 7 0}$ \\
\hline
\end{tabular}

\begin{tabular}{rr}
$3,578,825$ & $5,170,000$ \\
$27,032,789$ & $24,403,157$ \\
\hline $\mathbf{3 0 , 6 1 1 , 6 1 4}$ & $\mathbf{2 9 , 5 7 3 , 1 5 7}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$3,583,127$ & $5,440,361$ \\
$14,923,595$ & $14,642,884$ \\
$1,692,306$ & 390,740 \\
$4,082,109$ & $4,554,416$ \\
$6,330,477$ & $4,544,756$ \\
$-$ & $-$ \\
\hline $\mathbf{3 0 , 6 1 1 , 6 1 4}$ & $\mathbf{2 9 , 5 7 3 , 1 5 7}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$(183,923)$ & $(60,676)$ \\
1,234 & 1,440 \\
& \\
$2,166,419$ & $2,842,506$ \\
$14,756,664$ & $9,112,654$ \\
1,489 & 1,749 \\
53 & 62 \\
5,502 & 10,753 \\
4,757 & 12,504 \\
23,546 & 24,960 \\
1,114 & 1,304 \\
576,013 & 362,096 \\
128 & 151 \\
28 & 33 \\
2,354 & 11,816 \\
33 & 39 \\
6,950 & 5,885 \\
20,296 & 23,767 \\
3,547 & 700 \\
\hline $\mathbf{1 7 , 3 8 6 , 2 0 4}$ & $\mathbf{1 2 , 3 5 1 , 7 4 3}$ \\
\hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\section{DEPOSITS AND OTHER ACCOUNTS}

Current accounts and other accounts (Note 12.1)

Bills payable (Note 12.2)

Savings bank deposits

Fixed deposits

Short term deposits

12.1 Current accounts and other accounts

Current accounts

Foreign currency deposits

Short term deposits

Overdue deposits

12.2 Bills payable

Pay orders

Demand drafts

12.3 Sector-wise breakup of deposits

Government

Co-operative

Private

12.4 Maturity grouping of deposits

Repayable on demand

Repayable within 1 month

Over 1 month but not more than 6 months

Over 6 months but not more than 1 year

Over 1 year but not more than 5 years

Over 5 years

\section{OTHER LIABILITIES}

Accrued expenses (Note 13.1)

Lease liabilities (Note 8.2.2)

Sundry creditors (Note 13.2)

Other liabilities (Note 13.3)

13.1 Accrued expenses:

Salary and other employee benefits Interest on deposits

Audit fee

Professional fee

Others

\subsection{Sundry creditors:}

Advance interest

Sourcing from group

Tax and VAT withheld from various payments

Payment on behalf of customers

Security deposits

Others

\begin{tabular}{rr}
$83,071,061$ & $70,897,058$ \\
$1,787,032$ & $1,757,910$ \\
$21,080,240$ & $21,992,306$ \\
$72,633,469$ & $56,337,142$ \\
$9,269,378$ & $9,109,331$ \\
\hline $\mathbf{1 8 7 , 8 4 1 , 1 8 0}$ & $\mathbf{1 6 0 , 0 9 3 , 7 4 7}$ \\
\hline \hline & \\
$42,860,111$ & $27,477,882$ \\
$18,806,786$ & $11,385,836$ \\
$14,929,141$ & $7,532,156$ \\
$6,475,023$ & $24,501,184$ \\
\hline $\mathbf{8 3 , 0 7 1 , 0 6 1}$ & $\mathbf{7 0 , 8 9 7 , 0 5 8}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,786,950$ & $1,757,910$ \\
82 & $-$ \\
\hline $\mathbf{1 , 7 8 7 , 0 3 2}$ & $\mathbf{1 , 7 5 7 , 9 1 0}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$13,546,081$ & $12,713,293$ \\
123,000 & 233,000 \\
$174,172,099$ & $147,147,454$ \\
\hline $\mathbf{1 8 7 , 8 4 1 , 1 8 0}$ & $\mathbf{1 6 0 , 0 9 3 , 7 4 7}$ \\
\hline \hline & \\
$40,996,182$ & $41,305,335$ \\
$118,529,865$ & $84,008,189$ \\
$24,089,451$ & $26,260,845$ \\
147,264 & 217,330 \\
168,092 & 100,587 \\
$3,910,326$ & $8,197,461$ \\
\hline $\mathbf{1 8 7 , 8 4 1 , 1 8 0}$ & $\mathbf{1 6 0 , 0 9 3 , 7 4 7}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,273,534$ & 593,243 \\
$1,798,664$ & $1,849,271$ \\
$1,568,220$ & 31,867 \\
$4,171,987$ & $3,191,335$ \\
\hline $\mathbf{8 , 8 1 2 , 4 0 5}$ & $\mathbf{5 , 6 6 5 , 7 1 6}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
576,013 & 23,546 \\
114,357 & 128 \\
48,018 & 28 \\
3,547 & 2,354 \\
531,599 & 567,187 \\
\hline $\mathbf{1 , 2 7 3 , 5 3 4}$ & $\mathbf{5 9 3 , 2 4 3}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
1,540 & 1,114 \\
239,949 & 1,600 \\
$1,182,144$ & 14,976 \\
4,769 & 5,502 \\
14,976 & 33 \\
124,842 & 8,642 \\
\hline $\mathbf{1 , 5 6 8 , 2 2 0}$ & $\mathbf{3 1 , 8 6 7}$ \\
\hline \hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

13.3 Other liabilities:

Interest suspense account (Note 14.3)

Provision for income tax (Note 14.4)

Provision for other assets (Note 14.2)

Unearned commission

Provision for off-balance sheet items (Note 14.1.2)

Others

\begin{tabular}{rr}
$1,674,807$ & 581,870 \\
$1,720,283$ & $1,757,980$ \\
424,312 & 16,778 \\
72,560 & 70,416 \\
3,556 & 4,757 \\
276,469 & 759,534 \\
\hline $\mathbf{4 , 1 7 1 , 9 8 7}$ & $\mathbf{3 , 1 9 1 , 3 3 5}$ \\
\hline \hline
\end{tabular}

14 PROVISIONS AND OTHER LIABILITIES

Provision for loans and advances (Note 14.1)

Provision for other assets (Note 14.2)

Interest suspense account (Note 14.3)

Provision for taxation (Note 14.4)

14.1 Provision for loans and advances

14.1.1 General provision:

Balance at the beginning of the year

Provision made during the year

Balance at the end of the year

\begin{tabular}{rr}
$6,474,653$ & $4,202,067$ \\
424,312 & 16,778 \\
$1,674,807$ & 581,870 \\
$1,720,283$ & $1,757,980$ \\
\hline $\mathbf{1 0 , 2 9 4 , 0 5 5}$ & $\mathbf{6 , 5 5 8 , 6 9 5}$ \\
\hline \hline
\end{tabular}

Specific provision:

Balance at the beginning of the year

Add: Provision made during the year

Less: Write-off during the year

Recoveries of amounts previously written off

Balance at the end of the year

Total provision for loans and advances

14.1.2 Provision for off-balance sheet items:

Balance at the beginning of the year

Add: Provision made during the year

Balance at the end of the year

\begin{tabular}{rr}
$1,563,059$ & $1,595,920$ \\
$-$ & $-$ \\
\hline $\mathbf{1 , 5 6 3 , 0 5 9}$ & $\mathbf{1 , 5 9 5 , 9 2 0}$ \\
\hline \hline
\end{tabular}

14.2 Provision for other assets

Balance at the beginning of the year

Add: Provision made during the year

Balance at the end of the year

\begin{tabular}{rr}
$2,606,147$ & $2,800,000$ \\
$2,305,447$ & $(193,853)$ \\
$-$ & $-$ \\
$-$ & $-$ \\
\hline $\mathbf{4 , 9 1 1 , 5 9 4}$ & $\mathbf{2 , 6 0 6 , 1 4 7}$ \\
\hline $\mathbf{6 , 4 7 4 , 6 5 3}$ & $\mathbf{4 , 2 0 2 , 0 6 7}$ \\
\hline \hline
\end{tabular}

14.3 Interest suspense account

Balance at the beginning of the year

Add: Amount transferred to interest suspense during the year

Less: Amount recovered from interest suspense during the year

Less: Amount written off during the year

Balance at the end of the year

\begin{tabular}{rr}
4,757 & 3,556 \\
$(1,201)$ & 1,201 \\
\hline $\mathbf{3 , 5 5 6}$ & $\mathbf{4 , 7 5 7}$ \\
\hline \hline
\end{tabular}

14.4 Provision for taxation

Current tax (Note 14.4.1)

Deferred tax (Note 14.4.2)

Balance at the end of the year

14.4.1 Current tax:

Balance at the beginning of the year

Add: Provision made during the year

Less: Adjustment during the year

Balance at the end of the year

\begin{tabular}{rr}
16,778 & 424,312 \\
407,534 & $(407,534)$ \\
\hline $\mathbf{4 2 4 , 3 1 2}$ & $\mathbf{1 6 , 7 7 8}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
581,870 & $1,674,807$ \\
$1,092,937$ & $(1,092,937)$ \\
$-$ & $-$ \\
$-$ & $-$ \\
\hline $\mathbf{1 , 6 7 4 , 8 0 7}$ & $\mathbf{5 8 1 , 8 7 0}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,720,283$ & $1,757,980$ \\
$-$ & $-$ \\
\hline $\mathbf{1 , 7 2 0 , 2 8 3}$ & $\mathbf{1 , 7 5 7 , 9 8 0}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,757,980$ & $2,197,358$ \\
$(37,697)$ & $(439,378)$ \\
$-$ & $-$ \\
\hline $\mathbf{1 , 7 2 0 , 2 8 3}$ & $\mathbf{1 , 7 5 7 , 9 8 0}$ \\
\hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\subsubsection{Deferred tax:}

Balance at the beginning of the year

Add: Provision made during the year

Less: Adjustment during the year

Balance at the end of the year

Net Deferred tax assets (Note 9.4)

15 INTEREST INCOME

Interest on loans and advances:

Loans

Cash credits

Overdrafts

Others

Interest on balance with other banks and financial institutions

16 INTEREST PAID ON DEPOSITS AND BORROWINGS, ETC.

Interest on deposits:

Current accounts

Savings bank deposits

Fixed deposits

Short term deposits

Interest on borrowings from other banks, financial institutions, etc. Interest on lease liabilities (IFRS 16)

17 INVESTMENT INCOME

Income from government securities:

Treasury bills

Treasury bonds

Others

18 COMMISSION, EXCHANGE AND BROKERAGE

Commission from:

Letters of credit

Guarantees

Bills

Others

Exchange gain (net)

\section{OTHER OPERATING INCOME}

Profit on sale of fixed assets

Service charges on deposit accounts

Others

\begin{tabular}{rrr}
$-$ & $-$ \\
$-$ & $-$ \\
$-$ & $-$ \\
\hline$-$ & $-$ \\
\hline $\mathbf{2 , 1 9 7 , 3 5 8}$ & $\mathbf{2 , 3 0 6 , 1 2 8}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$10,214,032$ & $11,595,798$ \\
$1,814,972$ & $2,186,149$ \\
$13,546,081$ & $12,713,293$ \\
123,000 & 233,000 \\
386,076 & 119,737 \\
\hline $\mathbf{2 6 , 0 8 4 , 1 6 1}$ & $\mathbf{2 6 , 8 4 7 , 9 7 7}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
386,076 & 119,737 \\
$1,182,144$ & 185,890 \\
$13,546,081$ & $12,713,293$ \\
123,000 & 233,000 \\
48,018 & 28,041 \\
167,236 & 119,776 \\
\hline $\mathbf{1 5 , 4 5 2 , 5 5 5}$ & $\mathbf{1 3 , 3 9 9 , 7 3 7}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,786,950$ & $1,757,910$ \\
82 & $-$ \\
576,013 & 23,546 \\
\hline $\mathbf{2 , 3 6 3 , 0 4 5}$ & $\mathbf{1 , 7 8 1 , 4 5 6}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
123,000 & 233,000 \\
$-$ & 10,000 \\
$-$ & $-$ \\
2,354 & 11,816 \\
4,769 & 5,502 \\
\hline $\mathbf{1 3 0 , 1 2 3}$ & $\mathbf{2 6 0 , 3 1 8}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
386,076 & 119,737 \\
$1,182,144$ & 185,890 \\
$1,568,220$ & 305,627 \\
\hline $\mathbf{3 , 1 3 6 , 4 4 0}$ & $\mathbf{6 1 1 , 2 5 4}$ \\
\hline \hline
\end{tabular}

/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\section{SALARIES AND ALLOWANCES}

Basic salary

Allowances

Bonus

Bank's contribution to provident fund

21 RENT, TAXES, INSURANCE, ELECTRICITY, ETC.

Rent, rates and taxes

Insurance

Electricity, gas, water, etc.

\section{LEGAL EXPENSES}

Legal fees and charges

Other professional fees

\section{POSTAGE, STAMP, TELECOMMUNICATION, ETC.}

Postage and courier

Telegram, telex, fax and telephone

24 STATIONERY, PRINTING, ADVERTISEMENTS, ETC.

Stationery and printing

Advertisements

25 CHIEF EXECUTIVE'S SALARY AND FEES

Basic salary

Allowances

Bonus

\section{DIRECTORS' FEES}

Fees for attending board/executive committee meetings

27 AUDITORS' FEES

Statutory audit fee

Others

\section{DEPRECIATION AND REPAIR OF BANK'S ASSETS}

Depreciation (Note 8.1)

Amortization (Note 8.3.1)

Repairs and maintenance

\begin{tabular}{rr}
576,013 & 23,546 \\
114,357 & 128 \\
48,018 & 28 \\
3,547 & 2,354 \\
\hline $\mathbf{7 4 1 , 9 3 5}$ & $\mathbf{2 6 , 0 5 6}$ \\
\hline \hline & \\
& \\
531,599 & 567,187 \\
1,540 & 1,114 \\
239,949 & 1,600 \\
\hline $\mathbf{7 7 3 , 0 8 8}$ & $\mathbf{5 6 9 , 9 0 1}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,182,144$ & 185,890 \\
4,769 & 5,502 \\
\hline $\mathbf{1 , 1 8 6 , 9 1 3}$ & $\mathbf{1 9 1 , 3 9 2}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
14,976 & 33 \\
124,842 & 8,642 \\
\hline $\mathbf{1 3 9 , 8 1 8}$ & $\mathbf{8 , 6 7 5}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
276,469 & 759,534 \\
$1,568,220$ & 305,627 \\
\hline $\mathbf{1 , 8 4 4 , 6 8 9}$ & $\mathbf{1 , 0 6 5 , 1 6 1}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,674,807$ & 581,870 \\
$1,720,283$ & $1,757,980$ \\
424,312 & 16,778 \\
\hline $\mathbf{3 , 8 1 9 , 4 0 2}$ & $\mathbf{2 , 3 5 6 , 6 2 8}$ \\
\hline \hline
\end{tabular}\begin{tabular}{rr}
72,560 & 70,416 \\
3,556 & 4,757 \\
\hline $\mathbf{7 6 , 1 1 6}$ & $\mathbf{7 5 , 1 7 3}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
145,178 & 176,575 \\
75,752 & 98,523 \\
$1,164,888$ & 495,290 \\
\hline $\mathbf{1 , 3 8 5 , 8 1 8}$ & $\mathbf{7 7 0 , 3 8 8}$ \\
\hline \hline
\end{tabular}
/n

\section{Standard Chartered Bank - Bangladesh Branches \\ Notes to the Financial Statements \\ For the year ended 31 December 2022}

\section{OTHER EXPENSES}

Training

Travel and conveyance

Books and periodicals

Entertainment

Cleaning and laundry

Subscription

Welfare and recreation

\section{PROVISION FOR LOANS, ADVANCES AND OFF-BALANCE SHEET ITEMS}

Provision for unclassified loans and advances

Provision for classified loans and advances

Provision for off-balance sheet items

\section{PROVISION FOR DIMINUTION IN VALUE OF INVESTMENTS}

Provision for diminution in value of investments

\section{OTHER PROVISIONS}

Provision for other assets

\begin{tabular}{rr}
183,923 & 60,676 \\
1,234 & 1,440 \\
$2,166,419$ & $2,842,506$ \\
$14,756,664$ & $9,112,654$ \\
1,489 & 1,749 \\
53 & 62 \\
5,502 & 10,753 \\
\hline $\mathbf{1 7 , 1 1 5 , 2 8 4}$ & $\mathbf{1 2 , 0 2 9 , 8 4 0}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
$1,563,059$ & $1,595,920$ \\
$4,911,594$ & $2,606,147$ \\
3,556 & 4,757 \\
\hline $\mathbf{6 , 4 7 8 , 2 0 9}$ & $\mathbf{4 , 2 0 6 , 8 2 4}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
4,757 & 3,556 \\
\hline $\mathbf{4 , 7 5 7}$ & $\mathbf{3 , 5 5 6}$ \\
\hline \hline
\end{tabular}

\begin{tabular}{rr}
424,312 & 16,778 \\
\hline $\mathbf{4 2 4 , 3 1 2}$ & $\mathbf{1 6 , 7 7 8}$ \\
\hline \hline
\end{tabular}

/n

# Standard Chartered Bank - Bangladesh Branches

Annexure - B

Fixed Assets Schedule

For the year ended 31 December 2022

Amount in BDT '000

  --------------------------------- ------------------------------------- ----------- ------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ------------------- ------------ ------------- -------------

                                      Balance as on 1 Jan Particulars (a)   Additions   Deduction s during year year                                                                                                                                                                                                                                                           Balance as on (b) Dec 2022   Rate p.a. as on 1     Jan 2022   During year    Deductions
  $\mathbf{3 1}$ Dec 2022                                                                                                                                                                                                                                                                                                                                                                                                                                
  Property, Plant and Equipment                                                                                                                                                                                                                                                                                                                                                                                                                          
  Furniture and fixtures                                          368,007      22,395                          2,347                                                                                                                                                                                                                                                                              388,055             $10 \%$      278,924        36,547         1,540
  Office equipment                                                128,421      48,018                         14,976                                                                                                                                                                                                                                                                              161,463             $15 \%$       98,523        14,976        11,816
  IT equipment                                                $2,605,231$      53,897                        134,244                                                                                                                                                                                                                                                                          $2,524,884$             $30 \%$      101,683       501,476 
  Total Property, Plant and Equi.            $\mathbf{3 , 1 0 1 , 6 5 9}$     124,310                        151,567                                                                                                                                                                                                                                                                          $3,074,402$                       $2,56,772$        93,655       119,183
                                                                                                                                                                                                                                                                                                                                                                                              $2,166,244$             358,640                            
  Software                                                    $1,114,357$      66,326                            $-$                                                                                                                                                                                                                                                                          $1,180,683$             $30 \%$      132,539   $2,581,858$       492,544
  Right of Use (RoU) Assets                                   $2,873,348$     1,170,0                        846,911                                                                                                                                                                                                                                                                          $3,196,523$             $15 \%$      839,471        75,752 
                                                                                   86                                                                                                                                                                                                                                                                                                                             $1,126,837$      1,164,8       714,306   $1,577,419$
                                                                                                                                                                                                                                                                                                                                                                                              $1,619,104$                                                
  Grand Total                                                 $7,089,364$    1,360,72                    $9,065,302$   $\mathbf{4 3 6 , 3 6 , 3 6 , 3 6 , 3 6 , 5 6 7 5 3 7 3 5 , 5 0 2 0 6 7 5 2 0 6 7 5 2 0 6 7 5 2 0 1 , 5 0 2 0 , 5 0 6 2 0 1 , 5 0 1 , 5 0 6 7} \mathbf{1 4 , 3 6 , 5 6 2 0 6 2 0 1 , 5 0 6 7 3 0} \mathbf{4 0 9 6 7 3 0} \mathbf{2 , 3 6 , 5 6 2 0 1 5} \mathbf{2 , 5 6 7 3 9} 530$                                                
  Grand Total 2021                                           $1,5156,067$                                                                                                                                                                                                                                                                                                                                                                                

  --------------------------------- ------------------------------------- ----------- ------------------------------ ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ ------------------- ------------ ------------- -------------