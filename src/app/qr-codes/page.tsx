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
  Layout
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
    "group flex items-center justify-between px-4 py-2 cursor-pointer transition-colors relative",
    active ? "bg-primary/10 text-primary" : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
  )}>
    <div className="flex items-center gap-3">
      <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-slate-400 group-hover:text-white")} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {hasAdd && <Plus className="w-3 h-3 text-slate-500 group-hover:text-white" />}
    {active && <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-md" />}
  </div>
);

const SidebarSectionLabel = ({ label }: { label: string }) => (
  <div className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
      <aside className="w-64 bg-[#111827] flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
               <div className="w-6 h-1 bg-primary rounded-full" />
               <div className="w-6 h-1 bg-primary rounded-full" />
               <div className="w-4 h-1 bg-primary rounded-full" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">eMenu</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pt-4">
          <SidebarSectionLabel label="Overview" />
          <SidebarItem icon={LayoutGrid} label="Dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" />
          <SidebarItem icon={LineChart} label="Reports" />

          <SidebarSectionLabel label="Management" />
          <SidebarItem icon={List} label="Order List" />
          <SidebarItem icon={BookOpen} label="Menu Builder" />
          <SidebarItem icon={Grid3X3} label="Table Operations" active />
          <SidebarItem icon={Users} label="Guest Directory" />

          <SidebarSectionLabel label="Configuration" />
          <SidebarItem icon={Settings} label="Settings" hasAdd />

          <SidebarSectionLabel label="Connections" />
          <SidebarItem icon={LinkIcon} label="Integration" hasAdd />
        </div>

        <div className="p-4 mt-auto">
          <div className="bg-[#1F2937] text-white rounded-lg p-3 flex items-center justify-between mb-4 border border-slate-700/50">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 rounded-md border border-slate-600">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Bloomsbury's</span>
                <span className="text-xs font-semibold truncate">Ras Al Khaimah</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="flex items-center gap-2 text-slate-400 hover:text-white cursor-pointer transition-colors px-2 py-1">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help & Support</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Link href="/">
              <Button variant="outline" size="icon" className="w-8 h-8 shrink-0 border-slate-200 hover:bg-slate-50">
                <ArrowLeft className="w-4 h-4 text-slate-500" />
              </Button>
            </Link>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Order #, table, customer name, email, phone..." 
                className="pl-10 bg-slate-50 border-none shadow-none text-sm h-10 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2 px-3 h-10 bg-white rounded-md border border-slate-200 text-xs font-medium text-slate-600 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Last 3M</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold bg-slate-50 px-3 py-2 rounded-full border border-slate-100 shadow-sm">
              <RefreshCcw className="w-3 h-3 text-primary animate-spin-slow" />
              <span className="text-slate-600 uppercase tracking-tight">POS SYNCED</span>
              <Separator orientation="vertical" className="h-3 bg-slate-300 mx-1" />
              <span className="text-slate-400 uppercase tracking-tight font-medium">JULY 02, 2:42 PM</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-primary/10 text-primary rounded-lg border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
                <LayoutGrid className="w-4 h-4" />
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
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Manage QR Codes</h1>
                <p className="text-sm text-slate-500 mt-2 font-medium">Create, edit, and manage QR codes for your tables.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="text-xs font-bold gap-2 shadow-sm border-slate-200 text-slate-600 h-10 px-6 hover:bg-slate-50">
                  <Download className="w-4 h-4" />
                  Download All
                </Button>
                <Button className="text-xs font-bold gap-2 shadow-sm bg-primary hover:bg-primary/90 text-white h-10 px-6">
                  <Plus className="w-4 h-4" />
                  Create QR Code
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="Search Tables" className="pl-10 h-11 border-slate-200 rounded-xl text-sm bg-slate-50/30 focus-visible:bg-white" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48 h-11 border-slate-200 rounded-xl text-sm bg-slate-50/30 font-medium">
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
                  <Button variant="outline" className="h-11 text-xs font-bold gap-2 border-slate-200 pr-10 hover:bg-slate-50 rounded-xl px-5 text-slate-700">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Generate Missing QR
                  </Button>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EF4444] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-md">
                    2
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="w-14 px-6">
                        <Checkbox className="rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] py-5">Table <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] py-5">QR Preview <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] py-5">Status <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] py-5">Created at</TableHead>
                      <TableHead className="text-right px-10 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] py-5">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow key={row.id} className="hover:bg-slate-50/40 border-slate-100 transition-colors h-20">
                        <TableCell className="px-6">
                          <Checkbox className="rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 text-base">{row.id}</TableCell>
                        <TableCell>
                          {row.qr ? (
                            <div className="w-12 h-12 border border-slate-200 rounded-lg p-1.5 bg-white shadow-sm flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors">
                              <img src={row.qr} alt={`QR ${row.id}`} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <Button variant="outline" size="sm" className="h-9 text-[10px] font-bold gap-2 px-4 border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 shadow-sm">
                              <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                                <div className="w-1 h-1 bg-slate-400 rounded-full" />
                              </div>
                              Generate
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={cn(
                            "inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-bold border-2",
                            row.status === 'Active' 
                              ? "bg-[#ECFDF5] text-[#10B981] border-[#D1FAE5]" 
                              : "bg-[#FEF2F2] text-[#EF4444] border-[#FEE2E2]"
                          )}>
                            {row.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-[13px] text-slate-500 font-medium">{row.date}</TableCell>
                        <TableCell className="text-right px-10">
                          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 shadow-sm hover:shadow-md">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="p-6 border-t border-slate-100 bg-[#FCFDFE] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-36 h-10 text-xs border-slate-200 bg-white rounded-lg font-medium shadow-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[13px] text-slate-500 font-medium">
                    Showing <span className="text-slate-900 font-bold">1 to 6</span> of <span className="text-slate-900 font-bold">124</span> results
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
                    <ChevronRight className="w-4 h-4 rotate-180" />
                  </Button>
                  <Button className="w-9 h-9 rounded-lg bg-primary text-white text-sm font-bold p-0 shadow-md">1</Button>
                  <Button variant="ghost" className="w-9 h-9 rounded-lg text-sm font-bold p-0 text-slate-500 hover:bg-slate-100 transition-colors">2</Button>
                  <Button variant="ghost" className="w-9 h-9 rounded-lg text-sm font-bold p-0 text-slate-500 hover:bg-slate-100 transition-colors">3</Button>
                  <span className="px-2 text-slate-300 text-sm font-bold tracking-widest">...</span>
                  <Button variant="ghost" className="w-9 h-9 rounded-lg text-sm font-bold p-0 text-slate-500 hover:bg-slate-100 transition-colors">21</Button>
                  <Button variant="outline" size="icon" className="w-9 h-9 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-sm">
                    <ChevronRight className="w-4 h-4" />
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
