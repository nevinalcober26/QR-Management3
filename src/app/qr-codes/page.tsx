
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  LineChart, 
  Plus, 
  Grid3X3, 
  Users, 
  Settings, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ArrowLeft,
  ChevronDown,
  Download,
  MoreHorizontal,
  Sparkles,
  ChevronRight,
  HelpCircle,
  X,
  Trash2,
  Upload,
  FileDown,
  FileImage,
  Info,
  Armchair,
  ClipboardList,
  Plug,
  BookOpen,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';

const SidebarItem = ({ icon: Icon, label, active = false, hasAdd = false }: { icon: any, label: string, active?: boolean, hasAdd?: boolean }) => (
  <div className="px-4 py-0.5">
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
  </div>
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

type TableDataItem = {
  id: string;
  qr: string | null;
  status: 'Active' | 'Inactive';
  date: string;
  floor: 'floor1' | 'floor2' | 'terrace';
};

const INITIAL_MOCK_DATA: TableDataItem[] = [
  // Ground Floor
  { id: '22', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: '23', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: '24', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=24', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM', floor: 'floor1' },
  { id: '25', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=25', status: 'Active', date: 'Jul 15, 2024 at 1:05 PM', floor: 'floor1' },
  { id: '26', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  { id: '27', qr: null, status: 'Inactive', date: 'NA', floor: 'floor1' },
  // First Floor
  { id: 'F1', qr: null, status: 'Inactive', date: 'NA', floor: 'floor2' },
  { id: 'F2', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=F2', status: 'Active', date: 'Aug 02, 2024 at 11:20 AM', floor: 'floor2' },
  { id: 'F3', qr: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=F3', status: 'Active', date: 'Aug 02, 2024 at 11:20 AM', floor: 'floor2' },
  // Outdoor Terrace
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [previewTableId, setPreviewTableId] = useState<string | null>(null);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [mainSearchTerm, setMainSearchTerm] = useState('');

  // Drawer Customization State
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');

  // Regeneration logic state
  const [idsToGenerate, setIdsToGenerate] = useState<string[]>([]);
  const [isRegenerateConfirmOpen, setIsRegenerateConfirmOpen] = useState(false);

  // Drawer Table Selector State
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [isTableSelectorOpen, setIsTableSelectorOpen] = useState(false);
  const [selectedTableInDrawer, setSelectedTableInDrawer] = useState<TableDataItem | null>(null);

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

  const handleOpenPreview = (id: string) => {
    setPreviewTableId(id);
    setIsPreviewOpen(true);
  };

  const performGeneration = (targetIds: string[]) => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', { 
      month: 'short', 
      day: '2-digit', 
      year: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }).replace(',', ' at');

    setItems(prev => prev.map(item => 
      targetIds.includes(item.id)
        ? { ...item, qr: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.id}&color=${qrColor.substring(1)}&bgcolor=${qrBgColor.substring(1)}`, status: 'Active', date: formattedDate }
        : item
    ));

    toast({
      title: targetIds.length > 1 ? "QR Codes Generated" : "QR Code Generated",
      description: targetIds.length > 1 
        ? `${targetIds.length} QR codes have been updated successfully.`
        : `QR code for table ${targetIds[0]} has been created successfully.`,
    });
    
    setIdsToGenerate([]);
    setIsRegenerateConfirmOpen(false);
  };

  const triggerGenerate = (targetIds: string[]) => {
    const itemsWithExistingQR = items.filter(item => targetIds.includes(item.id) && item.qr);
    
    if (itemsWithExistingQR.length > 0) {
      setIdsToGenerate(targetIds);
      setIsRegenerateConfirmOpen(true);
    } else {
      performGeneration(targetIds);
    }
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

  const handleDownload = (id: string) => {
    toast({
      title: "Download Started",
      description: `QR code for table ${id} is being downloaded.`,
    });
  };

  const isAllSelected = selectedIds.length === filteredItems.length && filteredItems.length > 0;
  const lookbackOptions = ['1 W', '1 M', '3 M', '6 M', '1 Y', '3 Y'];

  const selectedItems = useMemo(() => items.filter(item => selectedIds.includes(item.id)), [items, selectedIds]);
  const hasSelectionWithoutQR = useMemo(() => selectedItems.some(item => !item.qr), [selectedItems]);
  const isDownloadDeleteDisabled = useMemo(() => hasSelectionWithoutQR, [hasSelectionWithoutQR]);

  // Smart Search for Table Selector in Drawer - ONLY show tables WITHOUT QR
  const filteredDrawerTables = useMemo(() => {
    const term = tableSearchTerm.toLowerCase();
    return items.filter(item => 
      !item.qr && (
        item.id.toLowerCase().includes(term) || 
        getFloorName(item.floor).toLowerCase().includes(term)
      )
    );
  }, [items, tableSearchTerm]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white flex flex-col shrink-0 border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-6 flex items-center">
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
          <SidebarItem icon={LayoutGrid} label="Dashboard" />
          <SidebarItem icon={BarChart3} label="Live Order Hub" />
          <SidebarItem icon={LineChart} label="Reports" hasAdd />

          <SidebarDivider />

          <SidebarSectionLabel label="MANAGEMENT" />
          <SidebarItem icon={ClipboardList} label="Order List" />
          <SidebarItem icon={BookOpen} label="Menu Builder" />
          <SidebarItem icon={Grid3X3} label="Table Operations" active />
          <SidebarItem icon={Users} label="Guest Directory" />

          <SidebarDivider />

          <SidebarSectionLabel label="CONFIGURATION" />
          <SidebarItem icon={Settings} label="Settings" hasAdd />

          <SidebarDivider />

          <SidebarSectionLabel label="CONNECTIONS" />
          <SidebarItem icon={Plug} label="Integration" hasAdd />
        </div>

        {/* Sidebar Footer */}
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
        {/* Topbar - Fixed Position */}
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4 z-20">
          <div className="flex items-center gap-4 flex-1">
            <Button asChild variant="outline" size="icon" className="w-9 h-9 shrink-0 border-slate-200 hover:bg-slate-50 rounded-lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 text-slate-400" />
              </Link>
            </Button>
            
            {/* Unified Search & Date Picker component */}
            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden h-10 w-full max-w-2xl transition-all focus-within:ring-2 focus-within:ring-[#0CB5A8]/20 focus-within:border-[#0CB5A8]/40">
              <div className="flex items-center flex-1 px-3.5 relative">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Order #, table, customer name, email, phone..." 
                  className="border-none shadow-none text-[13px] h-full placeholder:text-slate-400 focus-visible:ring-0 focus-visible:bg-transparent"
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
                <PopoverContent className="w-[180px] p-2.5 rounded-[16px] border-slate-100 shadow-xl" align="end">
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block px-1">LOOKBACK WINDOW</span>
                    <div className="grid grid-cols-3 gap-1">
                      {lookbackOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => setLookbackWindow(option)}
                          className={cn(
                            "h-7 rounded-lg border text-[10px] font-bold transition-all",
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
            <div className="flex items-center gap-2.5 text-[10px] font-bold bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-900 hover:bg-[#0CB5A8]/5 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-all cursor-default group/pos">
              <RefreshCcw className="w-3 h-3 text-slate-500 group-hover/pos:text-[#0CB5A8] transition-colors" />
              <span className="uppercase tracking-tight">POS SYNCED</span>
              <Separator orientation="vertical" className="h-2.5 bg-slate-200 group-hover/pos:bg-[#0CB5A8]/20 mx-1" />
              <span className="text-slate-500 group-hover/pos:text-[#0CB5A8]/60 uppercase tracking-tight font-bold">JULY 02, 2:42 PM</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-500 rounded-lg border border-slate-200 cursor-pointer hover:bg-[#0CB5A8]/10 hover:text-[#0CB5A8] hover:border-[#0CB5A8]/20 transition-colors">
                <LayoutGrid className="w-[18px] h-[18px]" />
              </div>
              <Avatar className="w-9 h-9 border-2 border-slate-100 shadow-sm">
                <AvatarImage src="https://picsum.photos/seed/chef/100/100" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
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
                  onClick={() => setIsDownloadModalOpen(true)}
                >
                  <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                  Download All
                </Button>
                <Button 
                  className="text-[12px] font-bold gap-2 shadow-sm bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white h-9 px-5 rounded-lg border-none"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create QR Code
                </Button>
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4">
                {selectedIds.length > 0 ? (
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setSelectedIds([])}>
                      <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 group-hover:text-slate-900 transition-colors">
                        <X className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[16px] font-extrabold text-slate-900 leading-none">{selectedIds.length}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">SELECTED</span>
                      </div>
                    </div>
                    
                    <Separator orientation="vertical" className="h-8 bg-slate-100 mx-2" />
                    
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        className="h-10 px-5 gap-2 border-slate-100 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-[#0CB5A8]/10 hover:text-slate-700 shadow-none bg-slate-50/50"
                        onClick={() => triggerGenerate(selectedIds)}
                      >
                        <Sparkles className="w-4 h-4 text-[#0CB5A8]" />
                        Generate
                      </Button>
                      <Button 
                        variant="outline" 
                        className={cn(
                          "h-10 px-5 gap-2 border-slate-100 rounded-lg text-[13px] font-bold text-slate-700 hover:bg-[#0CB5A8]/10 hover:text-slate-700 shadow-none bg-slate-50/50",
                          isDownloadDeleteDisabled && "opacity-20 pointer-events-none"
                        )}
                        onClick={() => selectedIds.forEach(id => handleDownload(id))}
                      >
                        <Download className="w-4 h-4 text-slate-400" />
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        className={cn(
                          "h-10 px-5 gap-2 bg-[#FEE2E2]/50 hover:bg-[#FEE2E2] rounded-lg text-[13px] font-bold text-[#EF4444] transition-colors",
                          isDownloadDeleteDisabled && "opacity-20 pointer-events-none"
                        )}
                        onClick={() => selectedIds.forEach(id => handleDelete(id))}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                        <SelectTrigger className="w-48 h-10 border-slate-100 rounded-lg text-[13px] bg-slate-50/50 font-medium shadow-none text-slate-600">
                          <SelectValue placeholder="All Floors" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Floors</SelectItem>
                          <SelectItem value="floor1">Dining area</SelectItem>
                          <SelectItem value="floor2">First Floor</SelectItem>
                          <SelectItem value="terrace">Outdoor Terrace</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="relative w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <Input 
                          placeholder="Search Tables" 
                          className="pl-10 h-10 border-slate-100 rounded-lg text-[13px] bg-slate-50/50 focus-visible:bg-white placeholder:text-slate-400"
                          value={mainSearchTerm}
                          onChange={(e) => setMainSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    {items.filter(i => !i.qr).length > 0 && (
                      <div className="relative">
                        <Button 
                          variant="outline" 
                          className="h-10 text-[13px] font-bold gap-2 border-slate-200 hover:bg-[#0CB5A8]/10 hover:text-slate-700 rounded-lg px-6 text-slate-700 shadow-none group"
                          onClick={() => {
                            const missingIds = items.filter(i => !i.qr).map(i => i.id);
                            if (missingIds.length > 0) performGeneration(missingIds);
                          }}
                        >
                          <Sparkles className="w-4 h-4 text-[#0CB5A8]" />
                          Generate Missing QR
                        </Button>
                        <div className="absolute -top-1.5 -right-1 w-5 h-5 bg-[#EF4444] rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                          {items.filter(i => !i.qr).length}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-[#F9FAFB]">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="w-14 px-6 py-4">
                        <Checkbox 
                          className="rounded border-slate-300 data-[state=checked]:bg-[#0CB5A8] data-[state=checked]:border-[#0CB5A8] h-4 w-4" 
                          checked={isAllSelected}
                          onCheckedChange={toggleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-4">Table <ChevronDown className="inline w-3 h-3 ml-1 text-slate-300" /></TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-4">QR Preview</TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-4">Status</TableHead>
                      <TableHead className="text-[11px] font-bold text-slate-400 uppercase tracking-widest py-4">Created at</TableHead>
                      <TableHead className="text-right px-8 text-[11px] font-bold text-slate-400 uppercase tracking-widest py-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((row) => (
                      <TableRow 
                        key={row.id} 
                        className={cn(
                          "hover:bg-slate-50/50 border-slate-50 transition-colors",
                          selectedIds.includes(row.id) && "bg-slate-50/30"
                        )}
                      >
                        <TableCell className="px-6 py-4">
                          <Checkbox 
                            className="rounded border-slate-300 data-[state=checked]:bg-[#0CB5A8] data-[state=checked]:border-[#0CB5A8] h-4 w-4" 
                            checked={selectedIds.includes(row.id)}
                            onCheckedChange={() => toggleSelectRow(row.id)}
                          />
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 text-[14px] py-4">{row.id}</TableCell>
                        <TableCell className="py-4">
                          {row.qr ? (
                            <div 
                              className="w-10 h-10 border border-slate-100 rounded-xl p-1.5 bg-white shadow-sm flex items-center justify-center cursor-pointer hover:border-[#0CB5A8]/20 transition-colors"
                              onClick={() => handleOpenPreview(row.id)}
                            >
                              <img src={row.qr} alt={`QR ${row.id}`} className="w-full h-full object-contain" />
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-[10px] font-bold gap-1.5 px-3 border-slate-200 rounded-lg text-slate-500 hover:bg-[#0CB5A8]/10 hover:text-slate-500 shadow-none uppercase tracking-tight"
                              onClick={() => triggerGenerate([row.id])}
                            >
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
                        <TableCell className="py-4">
                          <div className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold",
                            row.status === 'Active' 
                              ? "bg-[#0CB5A8]/5 text-[#0CB5A8] border border-[#0CB5A8]/10" 
                              : "bg-red-50 text-red-400 border border-red-100"
                          )}>
                            {row.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-[12px] text-slate-400 font-medium py-4">{row.date}</TableCell>
                        <TableCell className="text-right px-8 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-slate-300 hover:text-slate-900 hover:bg-slate-50">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl border-slate-100 p-1.5 shadow-xl">
                              <DropdownMenuLabel className="px-2.5 py-1.5 text-[13px] font-bold text-slate-900 tracking-tight">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-slate-50 mx-0" />
                              <DropdownMenuItem 
                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 focus:bg-[#0CB5A8]/10 hover:bg-[#0CB5A8]/10 cursor-pointer transition-colors focus:text-[#0CB5A8]"
                                onClick={() => triggerGenerate([row.id])}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-[#0CB5A8]" />
                                <span className="text-[13px] font-medium tracking-tight">{row.qr ? 'Regenerate' : 'Generate'}</span>
                              </DropdownMenuItem>
                              {row.qr && (
                                <>
                                  <DropdownMenuItem 
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-600 focus:bg-[#0CB5A8]/10 hover:bg-[#0CB5A8]/10 cursor-pointer transition-colors focus:text-[#0CB5A8]"
                                    onClick={() => handleDownload(row.id)}
                                  >
                                    <Download className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[13px] font-medium tracking-tight">Download</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[#EF4444] focus:bg-red-50 hover:bg-red-50 cursor-pointer transition-colors focus:text-[#EF4444]"
                                    onClick={() => handleDelete(row.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-[13px] font-medium tracking-tight">Delete</span>
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredItems.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-slate-400 text-sm italic">
                          No tables found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="p-4 border-t border-slate-50 bg-[#F9FAFB]/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Select defaultValue="10">
                    <SelectTrigger className="w-28 h-8 text-[12px] border-slate-200 bg-white rounded-lg font-medium shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-[12px] text-slate-400 font-medium">
                    Showing <span className="text-slate-900 font-bold">1 to {filteredItems.length}</span> of <span className="text-slate-900 font-bold">{items.length}</span> results
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg border-slate-200 bg-white hover:bg-[#0CB5A8]/10 hover:text-slate-400 shadow-none">
                    <ChevronRight className="w-3.5 h-3.5 rotate-180 text-slate-400" />
                  </Button>
                  <Button className="w-7 h-7 rounded-lg bg-[#0CB5A8] text-white text-[12px] font-bold p-0 shadow-none border-none">1</Button>
                  <Button variant="ghost" className="w-7 h-7 rounded-lg text-[12px] font-bold p-0 text-slate-400 hover:bg-slate-100">2</Button>
                  <Button variant="ghost" className="w-7 h-7 rounded-lg text-[12px] font-bold p-0 text-slate-400 hover:bg-slate-100">3</Button>
                  <span className="px-1.5 text-slate-300 text-[12px] font-bold">...</span>
                  <Button variant="ghost" className="w-7 h-7 rounded-lg text-[12px] font-bold p-0 text-slate-400 hover:bg-slate-100">21</Button>
                  <Button variant="outline" size="icon" className="w-7 h-7 rounded-lg border-slate-200 bg-white hover:bg-[#0CB5A8]/10 hover:text-slate-400 shadow-none">
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
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
          <div className="flex items-start justify-between p-10 pb-6 relative">
            <div className="space-y-1">
              <SheetTitle className="text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">Generate New QR Code</SheetTitle>
              <SheetDescription className="text-slate-400 font-medium text-base">Create a new QR code</SheetDescription>
            </div>
            <Button 
              onClick={() => setIsDrawerOpen(false)}
              className="absolute -left-16 top-10 w-12 h-12 rounded-full bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white shadow-xl flex items-center justify-center p-0"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <Separator className="mx-10 w-auto bg-slate-100" />

          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            <div className="space-y-6">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">TABLE DETAILS</Label>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-700">Table Name/Number <span className="text-red-500">*</span></Label>
                
                <Popover open={isTableSelectorOpen} onOpenChange={setIsTableSelectorOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex items-center justify-between w-full h-12 bg-white border border-slate-200 rounded-xl text-[14px] font-medium text-slate-400 px-4 cursor-pointer hover:border-[#0CB5A8]/40 transition-colors focus:ring-2 focus:ring-[#0CB5A8]/20">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#0CB5A8]/5 rounded-lg flex items-center justify-center">
                          <LayoutGrid className="w-4 h-4 text-[#0CB5A8]" />
                        </div>
                        {selectedTableInDrawer ? (
                          <span className="text-slate-900 font-bold">{selectedTableInDrawer.id}</span>
                        ) : (
                          <span>Select a table number...</span>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-[520px] p-0 border-none shadow-2xl rounded-[20px] overflow-hidden" align="start">
                    <div className="p-4 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                        <Input 
                          placeholder="Search by number..." 
                          className="h-11 pl-10 border-[#0CB5A8] border-2 rounded-xl text-[14px] font-medium placeholder:text-slate-400 focus-visible:ring-0 focus-visible:border-[#0CB5A8]"
                          value={tableSearchTerm}
                          onChange={(e) => setTableSearchTerm(e.target.value)}
                        />
                      </div>
                      
                      <div className="px-1">
                        <span className="text-[13px] font-bold text-slate-500">{filteredDrawerTables.length} tables available</span>
                      </div>

                      <ScrollArea 
                        className="h-[320px] -mx-4"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <div className="px-4">
                          {filteredDrawerTables.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => {
                                setSelectedTableInDrawer(item);
                                setIsTableSelectorOpen(false);
                                setTableSearchTerm('');
                              }}
                              className="group flex items-center gap-4 p-3.5 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                            >
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                                <Armchair className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[15px] font-bold text-slate-900 tracking-tight">{item.id}</span>
                                <span className="text-[12px] font-medium text-slate-400 uppercase tracking-tight">{getFloorName(item.floor)}</span>
                              </div>
                            </div>
                          ))}
                          {filteredDrawerTables.length === 0 && (
                            <div className="py-20 text-center text-slate-400 font-medium">
                              No tables found for "{tableSearchTerm}"
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-6">
              <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">QR CUSTOMIZATION</Label>
              <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-12 flex flex-col items-center justify-center gap-4 bg-slate-50/30 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#0CB5A8] flex items-center justify-center shadow-lg shadow-[#0CB5A8]/20 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[15px] font-bold text-slate-900 tracking-tight">Click to upload logo</p>
                  <p className="text-[12px] font-medium text-slate-400">PNG, JPG (max. 2MB)</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[13px] font-bold text-slate-700">Quality</Label>
                <Select defaultValue="low">
                  <SelectTrigger className="w-full h-12 bg-white border-slate-200 rounded-xl text-[14px] font-medium px-4 focus:ring-[#0CB5A8]/20">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-slate-700">QR Color</Label>
                  <div className="relative group">
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border border-slate-200 shadow-sm cursor-pointer" 
                      style={{ backgroundColor: qrColor }}
                      onClick={() => document.getElementById('qr-color-picker')?.click()}
                    />
                    <input 
                      id="qr-color-picker"
                      type="color" 
                      className="sr-only" 
                      value={qrColor} 
                      onChange={(e) => setQrColor(e.target.value)} 
                    />
                    <Input 
                      value={qrColor} 
                      onChange={(e) => setQrColor(e.target.value)}
                      className="h-12 pl-14 bg-white border-slate-200 rounded-xl text-[14px] font-medium focus-visible:ring-[#0CB5A8]/20" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[13px] font-bold text-slate-700">QR background</Label>
                  <div className="relative group">
                    <div 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg border border-slate-200 shadow-sm cursor-pointer" 
                      style={{ backgroundColor: qrBgColor }}
                      onClick={() => document.getElementById('qr-bg-color-picker')?.click()}
                    />
                    <input 
                      id="qr-bg-color-picker"
                      type="color" 
                      className="sr-only" 
                      value={qrBgColor} 
                      onChange={(e) => setQrBgColor(e.target.value)} 
                    />
                    <Input 
                      value={qrBgColor}
                      onChange={(e) => setQrBgColor(e.target.value)}
                      className="h-12 pl-14 bg-white border-slate-200 rounded-xl text-[14px] font-medium focus-visible:ring-[#0CB5A8]/20" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter className="p-10 pt-6 mt-auto">
            <div className="flex items-center justify-end gap-4 w-full">
              <SheetClose asChild>
                <Button variant="outline" className="h-12 px-8 rounded-xl border-slate-200 text-[14px] font-bold text-slate-600 hover:bg-[#0CB5A8]/10 hover:text-slate-600 shadow-none">
                  Cancel
                </Button>
              </SheetClose>
              <Button 
                className="h-12 px-8 rounded-xl bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white border-none shadow-lg shadow-[#0CB5A8]/20 text-[14px] font-bold"
                onClick={() => {
                  if (selectedTableInDrawer) {
                    performGeneration([selectedTableInDrawer.id]);
                    setIsDrawerOpen(false);
                    setSelectedTableInDrawer(null);
                  }
                }}
                disabled={!selectedTableInDrawer}
              >
                Create QR Code
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* QR Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[480px] p-0 border-none bg-white shadow-2xl overflow-visible [&>button]:hidden">
          <Button 
            onClick={() => setIsPreviewOpen(false)}
            className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white shadow-xl flex items-center justify-center p-0 z-50 border-4 border-white"
          >
            <X className="w-5 h-5" />
          </Button>
          <div className="p-8 pb-4">
            <DialogHeader className="text-left space-y-1">
              <DialogTitle className="text-2xl font-extrabold text-[#111827] tracking-tight">Preview</DialogTitle>
              <DialogDescription className="text-slate-400 font-medium text-[15px]">
                Viewing QR code for table <span className="text-slate-900 font-bold">"{previewTableId}"</span>.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-8 py-10 flex items-center justify-center">
            <div className="w-64 h-64 border border-slate-100 rounded-[32px] p-8 bg-white shadow-sm flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${previewTableId}&color=${qrColor.substring(1)}&bgcolor=${qrBgColor.substring(1)}`} 
                alt="QR Code Preview" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="p-8 pt-0 flex items-center justify-center gap-4">
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-[13px] font-bold text-slate-700 hover:bg-[#0CB5A8]/10 hover:text-slate-700 shadow-none gap-2" onClick={() => handleDownload(previewTableId!)}>
              <Download className="w-4 h-4 text-slate-400" />
              PNG
            </Button>
            <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-200 text-[13px] font-bold text-slate-700 hover:bg-[#0CB5A8]/10 hover:text-slate-700 shadow-none gap-2" onClick={() => handleDownload(previewTableId!)}>
              <FileDown className="w-4 h-4 text-slate-400" />
              SVG
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Regeneration Confirmation Dialog */}
      <AlertDialog open={isRegenerateConfirmOpen} onOpenChange={setIsRegenerateConfirmOpen}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-slate-900">Regenerate QR Code?</AlertDialogTitle>
            <AlertDialogAction 
              className="rounded-xl bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold border-none"
              onClick={() => performGeneration(idsToGenerate)}
            >
              Confirm Regeneration
            </AlertDialogAction>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-200 text-slate-600 font-bold">Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Download Format Modal */}
      <Dialog open={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 border-none bg-white shadow-2xl overflow-visible [&>button]:hidden rounded-[32px]">
          <Button 
            onClick={() => setIsDownloadModalOpen(false)}
            className="absolute -top-6 -left-6 w-14 h-14 rounded-full bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white shadow-xl flex items-center justify-center p-0 z-50 border-4 border-white"
          >
            <X className="w-7 h-7" />
          </Button>
          <div className="p-12 pb-6">
            <DialogHeader className="text-left space-y-3">
              <DialogTitle className="text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">Choose Download Format</DialogTitle>
              <DialogDescription asChild>
                <div className="text-slate-500 font-medium text-lg leading-relaxed flex items-center gap-2 flex-wrap">
                  You are about to download QR codes for 
                  <Badge variant="secondary" className="bg-[#0CB5A8]/5 text-[#0CB5A8] border-[#0CB5A8]/10 px-3 py-0.5 text-base font-bold rounded-lg shadow-sm">
                    {items.filter(i => i.qr).length} table(s)
                  </Badge>
                  . Select your preferred format to continue.
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="px-12 py-8 grid grid-cols-2 gap-8">
            <div className="group relative bg-white border border-slate-100 rounded-[28px] p-10 flex flex-col items-center justify-center text-center gap-6 cursor-pointer hover:border-[#0CB5A8]/20 hover:shadow-xl hover:shadow-[#0CB5A8]/5 transition-all duration-300">
              <div className="w-20 h-20 rounded-[22px] bg-[#EF4444] flex items-center justify-center shadow-xl shadow-red-500/20 group-hover:scale-110 transition-transform">
                <FileDown className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Download as SVG</h3>
                <p className="text-base text-slate-400 font-medium">Perfect for printing & sharing</p>
              </div>
            </div>
            <div className="group relative bg-white border border-slate-100 rounded-[28px] p-10 flex flex-col items-center justify-center text-center gap-6 cursor-pointer hover:border-[#0CB5A8]/20 hover:shadow-xl hover:shadow-[#0CB5A8]/5 transition-all duration-300">
              <div className="w-20 h-20 rounded-[22px] bg-[#F59E0B] flex items-center justify-center shadow-xl shadow-orange-500/20 group-hover:scale-110 transition-transform">
                <FileImage className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Download as PNGs</h3>
                <p className="text-base text-slate-400 font-medium">Individual PNG image files</p>
              </div>
            </div>
          </div>
          <div className="p-10 bg-slate-50/30 rounded-b-[32px] flex items-center justify-between">
            <div className="flex items-center gap-3 text-[#0CB5A8]">
              <Info className="w-5 h-5" />
              <span className="text-[15px] font-bold tracking-tight">Select a format to proceed</span>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDownloadModalOpen(false)}
                className="h-12 px-10 rounded-xl border-slate-200 text-base font-bold text-slate-500 hover:bg-white hover:text-slate-900 hover:border-slate-300 shadow-none transition-all"
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
