'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  ArrowUpRight,
  Package,
  FileText,
  History,
  AlertTriangle,
  TrendingUp,
  Star,
  Utensils,
  ArrowDown,
  Armchair,
  Grid2X2,
  ClipboardCheck,
  ClipboardList
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import MenuBuilder from "@/components/menu-builder";
import AppSidebar from "@/components/app-sidebar";

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

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  iconBgColor, 
  iconTextColor, 
  rightBarColor 
}: { 
  title: string, 
  value: string, 
  description: string, 
  icon: any, 
  iconBgColor: string, 
  iconTextColor: string, 
  rightBarColor: string 
}) => (
  <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[20px] overflow-hidden relative bg-white">
    <div className={cn("absolute top-0 right-0 w-1 h-full", rightBarColor)} />
    <CardContent className="p-6 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <p className="text-[14px] font-bold text-slate-400">{title}</p>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBgColor)}>
          <Icon className={cn("w-5 h-5", iconTextColor)} />
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-3xl font-extrabold text-slate-900">{value}</h3>
      </div>
      <div className="mt-1">
        <p className="text-[12px] text-slate-400 font-medium">{description}</p>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
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
      <AppSidebar currentPath="/dashboard" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

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

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total Categories" 
                value="4" 
                description="Total number of product categories."
                icon={Grid2X2} 
                iconBgColor="bg-yellow-50" 
                iconTextColor="text-yellow-600" 
                rightBarColor="bg-yellow-400" 
              />
              <StatCard 
                title="Active Products" 
                value="85" 
                description="Active Product for ordering."
                icon={Utensils} 
                iconBgColor="bg-green-50" 
                iconTextColor="text-green-600" 
                rightBarColor="bg-green-500" 
              />
              <StatCard 
                title="Published Menus" 
                value="1" 
                description="Currently published Menus."
                icon={ClipboardList} 
                iconBgColor="bg-red-50" 
                iconTextColor="text-red-600" 
                rightBarColor="bg-red-500" 
              />
              <StatCard 
                title="Today's Orders" 
                value="0" 
                description="Total orders for today"
                icon={ClipboardCheck} 
                iconBgColor="bg-cyan-50" 
                iconTextColor="text-cyan-600" 
                rightBarColor="bg-cyan-500" 
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

      <MenuBuilder open={isMenuBuilderOpen} onOpenChange={setIsMenuBuilderOpen} />
    </div>
  );
}
