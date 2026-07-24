'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  HelpCircle,
  Users,
  Plus,
  MoreHorizontal,
  Globe,
  UserCheck,
  UserX,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight
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
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import MenuBuilder from "@/components/menu-builder";
import AppSidebar from "@/components/app-sidebar";

const UserStatCard = ({ title, value, icon: Icon, colorClass, iconBgClass }: { title: string, value: string, icon: any, colorClass: string, iconBgClass: string }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 flex items-center justify-between">
    <div className="space-y-1">
      <p className="text-[13px] font-bold text-slate-400">{title}</p>
      <h3 className="text-4xl font-black text-slate-900">{value}</h3>
    </div>
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shadow-sm", iconBgClass)}>
      <Icon className={cn("w-6 h-6", colorClass)} />
    </div>
  </div>
);

export default function ManageUsersPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <AppSidebar currentPath="/manage-users" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
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
            </div>
            <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
              <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Scrollable User Content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
            {/* Page Header */}
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
              <p className="text-[15px] text-slate-400 font-medium">Manage users in your account. Add, edit, and update user roles and permissions.</p>
            </div>

            {/* Sub-tabs */}
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="bg-transparent h-12 p-0 border-b border-slate-100 w-full justify-start rounded-none">
                <TabsTrigger 
                  value="users" 
                  className="px-8 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#0CB5A8] data-[state=active]:bg-transparent data-[state=active]:text-[#0CB5A8] text-slate-400 font-bold text-sm"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="permission" 
                  className="px-8 h-full rounded-none border-b-2 border-transparent data-[state=active]:border-[#0CB5A8] data-[state=active]:bg-transparent data-[state=active]:text-[#0CB5A8] text-slate-400 font-bold text-sm"
                >
                  Permission Matrix
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UserStatCard 
                title="Total Users" 
                value="1" 
                icon={Users} 
                colorClass="text-cyan-600" 
                iconBgClass="bg-cyan-50"
              />
              <UserStatCard 
                title="Active Users" 
                value="1" 
                icon={UserCheck} 
                colorClass="text-green-600" 
                iconBgClass="bg-green-50"
              />
              <UserStatCard 
                title="Suspended" 
                value="0" 
                icon={UserX} 
                colorClass="text-red-500" 
                iconBgClass="bg-red-50"
              />
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col">
              {/* Filter Bar */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 w-full max-w-2xl transition-colors focus-within:border-[#0CB5A8]/50">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <Input 
                    placeholder="Filter by name, email or phone number..." 
                    className="border-none shadow-none bg-transparent h-7 text-[14px] p-0 focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-48 h-11 border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 shadow-none bg-white">
                      <SelectValue placeholder="Select an outlet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Outlets</SelectItem>
                      <SelectItem value="blooms">Bloomsbury's</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-[#0CB5A8]/20 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add User
                  </Button>
                </div>
              </div>

              {/* User Table */}
              <div className="flex-1 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC]">
                    <tr className="border-b border-slate-50">
                      <th className="px-6 py-4 text-left">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Name</span>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Role & Assignments</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-1.5 cursor-pointer">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Last Active</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right pr-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-slate-100">
                             <AvatarImage src="https://picsum.photos/seed/user1/100/100" />
                             <AvatarFallback>FC</AvatarFallback>
                          </Avatar>
                          <span className="text-[14px] font-bold text-slate-900">farnz.company</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge className="bg-emerald-50 text-emerald-600 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tight border-none">
                          Active
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <Badge className="bg-teal-50 text-teal-600 rounded-md px-2 py-0.5 text-[10px] font-black tracking-tight border-none">
                            Admin
                          </Badge>
                          <div className="flex items-center gap-2 text-slate-400">
                            <Globe className="w-3.5 h-3.5" />
                            <span className="text-[12px] font-medium">All Outlets</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-slate-900">July 24, 2026</span>
                          <span className="text-[11px] text-slate-400 font-medium italic">4 hours ago</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right pr-10">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-slate-300 hover:text-[#0CB5A8] hover:bg-[#0CB5A8]/5">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="p-6 border-t border-slate-50 bg-[#F8FAFC]/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Select defaultValue="10">
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
                      1 of 1 results
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm opacity-30 cursor-not-allowed" disabled>
                    <ChevronsLeft className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm opacity-30 cursor-not-allowed" disabled>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </Button>
                  <div className="flex items-center gap-1">
                    <Button className="w-8 h-8 rounded-lg bg-[#0CB5A8] text-white text-[12px] font-bold">1</Button>
                  </div>
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm opacity-30 cursor-not-allowed" disabled>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Button>
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg border-slate-200 bg-white shadow-sm opacity-30 cursor-not-allowed" disabled>
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
