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
  HelpCircle
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

const SidebarItem = ({ icon: Icon, label, active = false, hasAdd = false }: { icon: any, label: string, active?: boolean, hasAdd?: boolean }) => (
  <div className={cn(
    "group flex items-center justify-between px-4 py-2 cursor-pointer transition-colors",
    active ? "bg-primary/5 text-primary border-r-4 border-primary" : "text-muted-foreground hover:bg-muted"
  )}>
    <div className="flex items-center gap-3">
      <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    {hasAdd && <Plus className="w-3 h-3 text-muted-foreground" />}
  </div>
);

const SidebarSectionLabel = ({ label }: { label: string }) => (
  <div className="px-4 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/20 rounded-md flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">eMenu</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
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
          <div className="bg-slate-900 text-white rounded-lg p-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 rounded-md">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] text-primary font-bold uppercase">Bloomsbury's</span>
                <span className="text-xs font-semibold truncate">Ras Al Khaimah</span>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors px-2 py-1">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help & Support</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-card border-b flex items-center px-6 justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="outline" size="icon" className="w-8 h-8 shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Order #, table, customer name, email, phone..." 
                className="pl-10 bg-slate-50 border-none shadow-none text-sm h-9"
              />
            </div>
            <div className="flex items-center gap-2 px-3 h-9 bg-slate-50 rounded-md border text-xs font-medium text-muted-foreground shrink-0 cursor-pointer">
              <Calendar className="w-4 h-4" />
              <span>Last 3M</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border">
              <RefreshCcw className="w-3 h-3 text-primary animate-spin-slow" />
              <span>POS SYNCED</span>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-muted-foreground">JULY 02, 2:42 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-teal-50 text-primary rounded-md border border-teal-100 cursor-pointer">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://picsum.photos/seed/chef/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Manage QR Codes</h1>
              <p className="text-sm text-muted-foreground">Create, edit, and manage QR codes for your tables.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="text-xs font-bold gap-2 shadow-sm border-slate-200">
                <Download className="w-3.5 h-3.5" />
                Download All
              </Button>
              <Button className="text-xs font-bold gap-2 shadow-sm bg-primary hover:bg-primary/90 text-white">
                <Plus className="w-3.5 h-3.5" />
                Create QR Code
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search Tables" className="pl-9 h-10 border-slate-200" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40 h-10 border-slate-200">
                    <SelectValue placeholder="All Floors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Floors</SelectItem>
                    <SelectItem value="floor1">Ground Floor</SelectItem>
                    <SelectItem value="floor2">First Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="relative">
                <Button variant="outline" className="h-10 text-xs font-bold gap-2 border-slate-200 pr-10">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Generate Missing QR
                </Button>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                  2
                </div>
              </div>
            </div>

            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-12 px-4">
                    <Checkbox className="rounded-sm border-slate-300" />
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 uppercase">Table <ChevronDown className="inline w-3 h-3 ml-1" /></TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 uppercase">QR Preview <ChevronDown className="inline w-3 h-3 ml-1" /></TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 uppercase">Status <ChevronDown className="inline w-3 h-3 ml-1" /></TableHead>
                  <TableHead className="text-xs font-bold text-slate-500 uppercase">Created at</TableHead>
                  <TableHead className="text-right px-6 text-xs font-bold text-slate-500 uppercase">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50">
                    <TableCell className="px-4">
                      <Checkbox className="rounded-sm border-slate-300" />
                    </TableCell>
                    <TableCell className="font-bold text-slate-900">{row.id}</TableCell>
                    <TableCell>
                      {row.qr ? (
                        <div className="w-8 h-8 border rounded-sm p-0.5 bg-white">
                          <img src={row.qr} alt={`QR ${row.id}`} className="w-full h-full" />
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold gap-1 px-3 border-slate-200">
                          <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-1 h-1 bg-slate-400" />
                            <div className="w-1 h-1 bg-slate-400" />
                            <div className="w-1 h-1 bg-slate-400" />
                            <div className="w-1 h-1 bg-slate-400" />
                          </div>
                          Generate
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(
                        "rounded-full px-3 py-0.5 text-[10px] font-bold border-none",
                        row.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-400"
                      )}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">{row.date}</TableCell>
                    <TableCell className="text-right px-6">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full border border-slate-100">
                        <MoreHorizontal className="w-4 h-4 text-slate-400" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="p-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Select defaultValue="10">
                  <SelectTrigger className="w-32 h-9 text-xs border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="20">20 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-slate-500">Showing <span className="text-slate-900 font-medium">1 to 6</span> of 124 results</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-slate-200">
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </Button>
                <Button className="w-8 h-8 rounded-md bg-primary text-white text-xs font-bold p-0">1</Button>
                <Button variant="ghost" className="w-8 h-8 rounded-md text-xs font-medium p-0 text-slate-500">2</Button>
                <Button variant="ghost" className="w-8 h-8 rounded-md text-xs font-medium p-0 text-slate-500">3</Button>
                <span className="px-2 text-slate-300 text-xs">...</span>
                <Button variant="ghost" className="w-8 h-8 rounded-md text-xs font-medium p-0 text-slate-500">21</Button>
                <Button variant="outline" size="icon" className="w-8 h-8 rounded-md border-slate-200">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}