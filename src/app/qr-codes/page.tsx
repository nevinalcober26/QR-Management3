'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ArrowLeft,
  ChevronDown,
  Download,
  MoreHorizontal,
  Trash2,
  Info,
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import MenuBuilder from "@/components/menu-builder";
import AppSidebar from "@/components/app-sidebar";

type TableDataItem = {
  id: string;
  qr: string | null;
  status: 'Active' | 'Inactive';
  date: string;
  floor: 'floor1' | 'floor2' | 'terrace';
};

const INITIAL_MOCK_DATA: TableDataItem[] = [
  { id: '22', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: '23', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: '24', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=24', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM', floor: 'floor1' },
  { id: '25', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=25', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM', floor: 'floor1' },
  { id: '26', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: '27', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: 'F1', qr: null, status: 'Inactive', date: 'NA', floor: 'floor2' },
  { id: 'F2', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=F2', status: 'Active', date: 'Aug 02, 2024 at 11:20 AM', floor: 'floor2' },
  { id: 'F3', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=F3', status: 'Active', date: 'Aug 02, 2024 at 11:20 AM', floor: 'floor2' },
  { id: 'T1', qr: null, status: 'Inactive', date: 'NA', floor: 'terrace' },
  { id: 'T2', qr: null, status: 'Inactive', date: 'NA', floor: 'terrace' },
  { id: 'T3', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T3', status: 'Active', date: 'Sep 10, 2024 at 4:30 PM', floor: 'terrace' },
  { id: 'T4', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=T4', status: 'Active', date: 'Sep 10, 2024 at 4:30 PM', floor: 'terrace' },
];

const getFloorName = (floor: string) => {
  switch (floor) {
    case 'floor1': return 'Dining area';
    case 'floor2': return 'First Floor';
    case 'terrace': return 'Outdoor Terrace';
    default: return 'Dining area';
  }
};

export default function QRCodesPage() {
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const [items, setItems] = useState<TableDataItem[]>(INITIAL_MOCK_DATA);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [mainSearchTerm, setMainSearchTerm] = useState('');
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (selectedFloor !== 'all') {
      filtered = filtered.filter(item => item.floor === selectedFloor);
    }
    if (mainSearchTerm) {
      const term = mainSearchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.id.toLowerCase().includes(term) || 
        getFloorName(item.floor).toLowerCase().includes(term)
      );
    }
    return filtered;
  }, [items, selectedFloor, mainSearchTerm]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(row => row.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedIds(prev => prev.filter(i => i !== id));
    toast({
      variant: "destructive",
      title: "Table Deleted",
      description: `Table ${id} has been removed from the list.`,
    });
  };

  const isAllSelected = selectedIds.length === filteredItems.length && filteredItems.length > 0;

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <AppSidebar currentPath="/qr-codes" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4 z-20">
          <div className="flex items-center gap-4 flex-1">
            <Button asChild variant="outline" size="icon" className="w-9 h-9 shrink-0 border-slate-200 hover:bg-slate-50 rounded-lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
            
            <div className="flex items-center bg-white border border-slate-200 rounded-[15px] overflow-hidden h-10 w-full max-w-2xl transition-all">
              <div className="flex items-center flex-1 px-3.5 relative">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Order #, table, customer name..." 
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
             <div className="flex items-center gap-2.5 text-[10px] font-bold bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-400 hover:bg-[#0CB5A8]/5 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-all cursor-default group/pos">
              <RefreshCcw className="w-3 h-3 text-slate-400 group-hover/pos:text-[#0CB5A8] transition-colors" />
              <span className="uppercase tracking-tight">POS SYNCED</span>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/restaurant/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manage QR Codes</h1>
                <p className="text-[13px] text-slate-400 font-medium">Create, edit, and manage QR codes for your tables.</p>
              </div>
              <div className="flex items-center gap-2.5">
                <Button 
                  variant="outline" 
                  className="text-[12px] font-bold gap-2 shadow-none border-slate-200 text-slate-600 h-9 px-5 hover:bg-[#0CB5A8]/10 hover:text-slate-600 rounded-lg group"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  Download All
                </Button>
                <Button 
                  className="text-[12px] font-bold gap-2 shadow-sm bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white h-9 px-5 rounded-lg border-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create QR Code
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3 bg-[#F8FAFC] px-3.5 py-1.5 rounded-xl border border-slate-100 w-full max-w-md">
                  <Search className="w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search by table ID, floor name..." 
                    className="border-none shadow-none bg-transparent h-7 text-[13px] p-0 focus-visible:ring-0"
                    value={mainSearchTerm}
                    onChange={(e) => setMainSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                    <SelectTrigger className="w-44 h-10 border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 shadow-none">
                      <SelectValue placeholder="All Floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floors</SelectItem>
                      <SelectItem value="floor1">Dining area</SelectItem>
                      <SelectItem value="floor2">First Floor</SelectItem>
                      <SelectItem value="terrace">Outdoor Terrace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-50 hover:bg-transparent">
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={isAllSelected} 
                        onCheckedChange={toggleSelectAll} 
                        className="rounded-md border-slate-300 data-[state=checked]:bg-[#0CB5A8] data-[state=checked]:border-[#0CB5A8]"
                      />
                    </TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Table ID</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">QR Image</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Floor / Area</TableHead>
                    <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Last Generated</TableHead>
                    <TableHead className="text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} className="border-slate-50 group hover:bg-slate-50/30">
                      <TableCell>
                        <Checkbox 
                          checked={selectedIds.includes(item.id)}
                          onCheckedChange={() => toggleSelectRow(item.id)}
                          className="rounded-md border-slate-300 data-[state=checked]:bg-[#0CB5A8] data-[state=checked]:border-[#0CB5A8]"
                        />
                      </TableCell>
                      <TableCell className="font-bold text-[13px] text-slate-900">Table {item.id}</TableCell>
                      <TableCell>
                        {item.qr ? (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center cursor-pointer hover:bg-slate-200 transition-colors overflow-hidden">
                            <img src={item.qr} alt="QR" className="w-8 h-8 object-contain" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                            <Info className="w-4 h-4" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={cn(
                            "rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tight border-none",
                            item.status === 'Active' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[13px] font-medium text-slate-600">{getFloorName(item.floor)}</TableCell>
                      <TableCell className="text-[12px] font-medium text-slate-400">{item.date}</TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 shadow-xl">
                              <DropdownMenuItem className="gap-2 text-[13px] font-medium">
                                <Search className="w-4 h-4 text-slate-400" /> Preview QR
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDelete(item.id)} 
                                className="gap-2 text-[13px] font-medium text-red-500 focus:text-red-500 focus:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" /> Delete Table
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>

      <MenuBuilder open={isMenuBuilderOpen} onOpenChange={setIsMenuBuilderOpen} />
    </div>
  );
}
