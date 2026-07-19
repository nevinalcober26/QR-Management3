'use client';

import React from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  LineChart, 
  List, 
  BookOpen, 
  Grid3X3, 
  Users, 
  Settings, 
  Link as LinkIcon, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ArrowLeft,
  ChevronDown,
  Download,
  Plus,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const SidebarItem = ({ icon: Icon, label, active = false, hasAdd = false }: { icon: any, label: string, active?: boolean, hasAdd?: boolean }) => (
  <div className={cn(
    "group flex items-center justify-between px-6 py-2.5 cursor-pointer transition-colors relative",
    active ? "bg-slate-50 text-emerald-500" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  )}>
    <div className="flex items-center gap-3">
      <Icon className={cn("w-[18px] h-[18px]", active ? "text-emerald-500" : "text-slate-400 group-hover:text-slate-600")} />
      <span className={cn("text-[13px] font-medium", active && "font-semibold")}>{label}</span>
    </div>
    {hasAdd && <div className="border border-slate-200 rounded p-0.5"><Plus className="w-2.5 h-2.5 text-slate-400" /></div>}
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-emerald-500 rounded-l-full" />}
  </div>
);

const SidebarSectionLabel = ({ label }: { label: string }) => (
  <div className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
    {label}
  </div>
);

export default function QRCodesPage() {
  const tableData = [
    { id: 'T1', qr: null, status: 'Inactive', date: 'NA' },
    { id: 'T2', qr: null, status: 'Inactive', date: 'NA' },
    { id: 'T3', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T3', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T4', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T4', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T5', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T5', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T6', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T6', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T7', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T7', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shrink-0 border-r border-slate-100">
        <div className="p-7 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
               <div className="w-6 h-1 bg-emerald-500 rounded-full" />
               <div className="w-6 h-1 bg-emerald-500 rounded-full" />
               <div className="w-4 h-1 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-xl font-bold text-[#111827] tracking-tight">eMenu</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-2">
          <SidebarSectionLabel label="OVERVIEW" />
          <SidebarItem icon={LayoutGrid} label="Dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" />
          <SidebarItem icon={LineChart} label="Reports" />

          <SidebarSectionLabel label="MANAGEMENT" />
          <SidebarItem icon={List} label="Order List" />
          <SidebarItem icon={BookOpen} label="Menu Builder" />
          <SidebarItem icon={Grid3X3} label="Table Operations" active />
          <SidebarItem icon={Users} label="Guest Directory" />

          <SidebarSectionLabel label="CONFIGURATION" />
          <SidebarItem icon={Settings} label="Settings" hasAdd />

          <SidebarSectionLabel label="CONNECTIONS" />
          <SidebarItem icon={LinkIcon} label="Integration" hasAdd />
        </div>

        <div className="p-5 mt-auto">
          <div className="bg-[#111827] text-white rounded-xl p-4 flex items-center justify-between mb-4 shadow-lg">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 rounded-lg border border-slate-700">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">BLOOMSBURY'S</span>
                <span className="text-[11px] font-medium truncate opacity-80">Ras Al Khaimah</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 hover:text-emerald-500 cursor-pointer transition-colors px-2 py-1">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[13px] font-medium">Help & Support</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/">
              <Button variant="outline" size="icon" className="w-9 h-9 shrink-0 border-slate-200 hover:bg-slate-50 rounded-lg">
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Button>
            </Link>
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <Input 
                placeholder="Order #, table, customer name, email, phone..." 
                className="pl-10 bg-slate-50/50 border-slate-100 shadow-none text-[13px] h-10 placeholder:text-slate-400 focus-visible:ring-emerald-500/20"
              />
            </div>
            <div className="flex items-center gap-2 px-3 h-10 bg-white rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Last 3M</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-[10px] font-bold bg-[#F0FDF4] px-3.5 py-1.5 rounded-full border border-emerald-100">
              <RefreshCcw className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-700 uppercase tracking-tight">POS SYNCED</span>
              <Separator orientation="vertical" className="h-2.5 bg-emerald-200 mx-1" />
              <span className="text-emerald-500/60 uppercase tracking-tight font-bold">JULY 02, 2:42 PM</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 cursor-pointer hover:bg-emerald-100 transition-colors">
                <LayoutGrid className="w-[18px] h-[18px]" />
              </div>
              <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/chef/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage QR Codes</h1>
                <p className="text-sm text-slate-400 font-medium">Create, edit, and manage QR codes for your tables.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="text-[13px] font-bold gap-2 shadow-none border-slate-200 text-slate-600 h-10 px-6 hover:bg-slate-50 rounded-lg">
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
                <Button className="text-[13px] font-bold gap-2 shadow-sm bg-emerald-500 hover:bg-emerald-600 text-white h-10 px-6 rounded-lg border-none">
                  <Plus className="w-4 h-4" />
                  Create QR Code
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input placeholder="Search Tables" className="pl-10 h-11 border-slate-100 rounded-xl text-[13px] bg-slate-50/50 focus-visible:bg-white" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-44 h-11 border-slate-100 rounded-xl text-[13px] bg-slate-50/50 font-medium shadow-none">
                      <SelectValue placeholder="All Floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floors</SelectItem>
                      <SelectItem value="floor1">Ground Floor</SelectItem>
                      <SelectItem value="floor2">First Floor</SelectItem>
                      <SelectItem value="terrace">Outdoor Terrace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <Button variant="outline" className="h-11 text-[13px] font-bold gap-2 border-slate-200 hover:bg-slate-50 rounded-xl px-5 text-slate-700 shadow-none">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Generate Missing QR
                  </Button>
                  <div className="absolute -top-1.5 -right-1 w-5 h-5 bg-[#EF4444] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    2
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F9FAFB]">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="w-16 px-7">
                        <Checkbox className="rounded border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-4 w-4" />
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Table <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">QR Preview <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Status <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Created at</TableHead>
                      <TableHead className="text-right px-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50/50 border-slate-50 transition-colors h-20">
                        <TableCell className="px-7">
                          <Checkbox className="rounded border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 text-[15px]">{row.id}</TableCell>
                        <TableCell>
                          {row.qr ? (
                            <div className="w-12 h-12 border border-slate-100 rounded-lg p-2 bg-white shadow-sm flex items-center justify-center cursor-pointer hover:border-emerald-200 transition-colors">
                              <img src={row.qr} alt={`QR ${row.id}`} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold gap-2 px-3.5 border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 shadow-none uppercase tracking-tight">
                              <div className="grid grid-cols-2 gap-0.5 opacity-60">
                                <div className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
                                <div className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
                                <div className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
                                <div className="w-0.5 h-0.5 bg-slate-400 rounded-full" />
                              </div>
                              Generate
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "inline-flex items-center px-4 py-1 rounded-full text-[11px] font-bold",
                            row.status === 'Active' 
                              ? "bg-emerald-50 text-emerald-500 border border-emerald-100" 
                              : "bg-red-50 text-red-400 border border-red-100"
                          )}>
                            {row.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] text-slate-400 font-medium">{row.date}</TableCell>
                        <TableCell className="text-right px-10">
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-slate-300 hover:text-slate-900 hover:bg-slate-50">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-6 border-t border-slate-50 bg-[#F9FAFB]/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-32 h-10 text-[13px] border-slate-200 bg-white rounded-lg font-medium shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[13px] text-slate-400 font-medium">
                    Showing <span className="text-slate-900 font-bold">1 to 6</span> of <span className="text-slate-900 font-bold">124</span> results
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-none">
                    <ChevronRight className="w-4 h-4 rotate-180 text-slate-400" />
                  </Button>
                  <Button className="w-8 h-8 rounded-lg bg-emerald-500 text-white text-[13px] font-bold p-0 shadow-none border-none">1</Button>
                  <Button variant="ghost" className="w-8 h-8 rounded-lg text-[13px] font-bold p-0 text-slate-400 hover:bg-slate-100">2</Button>
                  <Button variant="ghost" className="w-8 h-8 rounded-lg text-[13px] font-bold p-0 text-slate-400 hover:bg-slate-100">3</Button>
                  <span className="px-1.5 text-slate-300 text-[13px] font-bold">...</span>
                  <Button variant="ghost" className="w-8 h-8 rounded-lg text-[13px] font-bold p-0 text-slate-400 hover:bg-slate-100">21</Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-none">
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
