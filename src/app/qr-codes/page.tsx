'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  X,
  Trash2,
  Upload,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from 'next/link';

const SidebarItem = ({ icon: Icon, label, active = false, hasAdd = false }: { icon: any, label: string, active?: boolean, hasAdd?: boolean }) => (
  <div className={cn(
    "group flex items-center justify-between px-6 py-2.5 cursor-pointer transition-colors relative",
    active ? "bg-slate-50 text-primary" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
  )}>
    <div className="flex items-center gap-3">
      <Icon className={cn("w-[18px] h-[18px]", active ? "text-primary" : "text-slate-400 group-hover:text-slate-600")} />
      <span className={cn("text-[13px] font-medium", active && "font-semibold")}>{label}</span>
    </div>
    {hasAdd && <div className="border border-slate-200 rounded p-0.5"><Plus className="w-2.5 h-2.5 text-slate-400" /></div>}
    {active && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-l-full" />}
  </div>
);

const SidebarSectionLabel = ({ label }: { label: string }) => (
  <div className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
    {label}
  </div>
);

export default function QRCodesPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tableData = useMemo(() => [
    { id: 'T1', qr: null, status: 'Inactive', date: 'NA' },
    { id: 'T2', qr: null, status: 'Inactive', date: 'NA' },
    { id: 'T3', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T3', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T4', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T4', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T5', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T5', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T6', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T6', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
    { id: 'T7', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T7', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM' },
  ], []);

  const toggleSelectAll = () => {
    if (selectedIds.length === tableData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tableData.map(row => row.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isAllSelected = selectedIds.length === tableData.length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col shrink-0 border-r border-slate-100">
        <div className="p-7 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
               <div className="w-6 h-1 bg-primary rounded-full" />
               <div className="w-6 h-1 bg-primary rounded-full" />
               <div className="w-4 h-1 bg-primary rounded-full" />
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
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">BLOOMSBURY'S</span>
                <span className="text-[11px] font-medium truncate opacity-80">Ras Al Khaimah</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-2.5 text-slate-500 hover:text-primary cursor-pointer transition-colors px-2 py-1">
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
            <Button asChild variant="outline" size="icon" className="w-9 h-9 shrink-0 border-slate-200 hover:bg-slate-50 rounded-lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
            <div className="relative w-full max-w-lg" suppressHydrationWarning>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              {mounted ? (
                <Input 
                  placeholder="Order #, table, customer name, email, phone..." 
                  className="pl-10 bg-slate-50/50 border-slate-100 shadow-none text-[13px] h-10 placeholder:text-slate-400 focus-visible:ring-primary/20"
                />
              ) : (
                <div className="pl-10 bg-slate-50/50 border border-slate-100 h-10 rounded-md w-full" />
              )}
            </div>
            <div className="flex items-center gap-2 px-3 h-10 bg-white rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 shrink-0 cursor-pointer hover:bg-slate-50 transition-colors">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Last 3M</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5 text-[10px] font-bold bg-primary/5 px-3.5 py-1.5 rounded-full border border-primary/10">
              <RefreshCcw className="w-3 h-3 text-primary" />
              <span className="text-primary uppercase tracking-tight">POS SYNCED</span>
              <Separator orientation="vertical" className="h-2.5 bg-primary/20 mx-1" />
              <span className="text-primary/60 uppercase tracking-tight font-bold">JULY 02, 2:42 PM</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-primary/5 text-primary rounded-lg border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors">
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
                <Button 
                  className="text-[13px] font-bold gap-2 shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-6 rounded-lg border-none"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Create QR Code
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative w-80" suppressHydrationWarning>
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    {mounted ? (
                      <Input placeholder="Search Tables" className="pl-10 h-11 border-slate-100 rounded-xl text-[13px] bg-slate-50/50 focus-visible:bg-white" />
                    ) : (
                      <div className="pl-10 h-11 border border-slate-100 rounded-xl w-full bg-slate-50/50" />
                    )}
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
                    <Sparkles className="w-4 h-4 text-primary" />
                    Generate Missing QR
                  </Button>
                  <div className="absolute -top-1.5 -right-1 w-5 h-5 bg-[#EF4444] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    2
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className={cn("transition-colors", selectedIds.length > 0 ? "bg-white" : "bg-[#F9FAFB]")}>
                    {selectedIds.length > 0 ? (
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-16 px-7">
                          <Checkbox 
                            className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" 
                            checked={isAllSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead colSpan={5} className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedIds([])}>
                              <div className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 group-hover:text-slate-900 transition-colors">
                                <X className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-[15px] font-bold text-slate-900 leading-tight">{selectedIds.length}</span>
                                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">selected</span>
                              </div>
                            </div>
                            
                            <Separator orientation="vertical" className="h-8 bg-slate-100 mx-2" />
                            
                            <div className="flex items-center gap-2">
                              <Button variant="outline" className="h-10 px-5 gap-2 border-slate-100 rounded-xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-none">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Generate
                              </Button>
                              <Button variant="outline" className="h-10 px-5 gap-2 border-slate-100 rounded-xl text-[13px] font-bold text-slate-300 hover:bg-slate-50 shadow-none">
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                              <Button variant="ghost" className="h-10 px-5 gap-2 bg-[#FEE2E2]/50 hover:bg-[#FEE2E2] rounded-xl text-[13px] font-bold text-[#EF4444] transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </TableHead>
                      </TableRow>
                    ) : (
                      <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-16 px-7">
                          <Checkbox 
                            className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" 
                            checked={isAllSelected}
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Table <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                        <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">QR Preview <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                        <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Status <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                        <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Created at</TableHead>
                        <TableHead className="text-right px-10 text-[11px] font-bold text-slate-400 uppercase tracking-widest py-5">Actions</TableHead>
                      </TableRow>
                    )}
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className={cn(
                          "hover:bg-slate-50/50 border-slate-50 transition-colors h-20",
                          selectedIds.includes(row.id) && "bg-slate-50/30"
                        )}
                      >
                        <TableCell className="px-7">
                          <Checkbox 
                            className="rounded border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4" 
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => toggleSelectRow(row.id)}
                          />
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 text-[15px]">{row.id}</TableCell>
                        <TableCell>
                          {row.qr ? (
                            <div className="w-12 h-12 border border-slate-100 rounded-lg p-2 bg-white shadow-sm flex items-center justify-center cursor-pointer hover:border-primary/20 transition-colors">
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
                              ? "bg-primary/5 text-primary border border-primary/10" 
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
                    Showing <span className="text-slate-900 font-bold">1 to {tableData.length}</span> of <span className="text-slate-900 font-bold">124</span> results
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 shadow-none">
                    <ChevronRight className="w-4 h-4 rotate-180 text-slate-400" />
                  </Button>
                  <Button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-[13px] font-bold p-0 shadow-none border-none">1</Button>
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

      {/* Side Drawer: Generate New QR Code */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0 border-none bg-white shadow-2xl flex flex-col [&>button]:hidden">
          {/* Header area with custom teal close button */}
          <div className="flex items-start justify-between p-10 pb-6 relative">
            <div className="space-y-1">
              <SheetTitle className="text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">Generate New QR Code</SheetTitle>
              <SheetDescription className="text-slate-400 font-medium text-base">Create a new QR code</SheetDescription>
            </div>
            <Button 
              onClick={() => setIsDrawerOpen(false)}
              className="absolute -left-16 top-10 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-xl flex items-center justify-center p-0"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <Separator className="mx-10 w-auto bg-slate-100" />

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            {/* Table Details Section */}
            <div className="space-y-6">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">TABLE DETAILS</Label>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-700">Table Name/Number <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <Select>
                    <SelectTrigger className="w-full h-12 bg-white border-slate-200 rounded-xl text-[14px] font-medium text-slate-400 px-4 focus:ring-primary/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center">
                          <LayoutGrid className="w-4 h-4 text-primary" />
                        </div>
                        <SelectValue placeholder="Select a table number..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="T1">T1</SelectItem>
                      <SelectItem value="T2">T2</SelectItem>
                      <SelectItem value="T3">T3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* QR Customization Section */}
            <div className="space-y-6">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">QR CUSTOMIZATION</Label>
              
              {/* Upload Box */}
              <div className="border-2 border-dashed border-slate-200 rounded-24px p-12 flex flex-col items-center justify-center gap-4 bg-slate-50/30 hover:bg-slate-50/50 transition-colors cursor-pointer group rounded-[24px]">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[15px] font-bold text-slate-900 tracking-tight">Click to upload logo</p>
                  <p className="text-[12px] font-medium text-slate-400">PNG, JPG (max. 2MB)</p>
                </div>
              </div>

              {/* Quality Select */}
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-700">Quality</Label>
                <Select defaultValue="low">
                  <SelectTrigger className="w-full h-12 bg-white border-slate-200 rounded-xl text-[14px] font-medium px-4 focus:ring-primary/20">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Inputs Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-slate-700">QR Color</Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-black border border-slate-200 shadow-sm" />
                    <Input defaultValue="#000000" className="h-12 pl-14 bg-white border-slate-200 rounded-xl text-[14px] font-medium focus-visible:ring-primary/20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-slate-700">QR background</Label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-sm" />
                    <Input defaultValue="#FFFFFF" className="h-12 pl-14 bg-white border-slate-200 rounded-xl text-[14px] font-medium focus-visible:ring-primary/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <SheetFooter className="p-10 pt-6 mt-auto">
            <div className="flex items-center justify-end gap-4 w-full">
              <SheetClose asChild>
                <Button variant="outline" className="h-12 px-8 rounded-xl border-slate-200 text-[14px] font-bold text-slate-600 hover:bg-slate-50 shadow-none">
                  Cancel
                </Button>
              </SheetClose>
              <Button className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white border-none shadow-lg shadow-primary/20 text-[14px] font-bold">
                Create QR Code
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
