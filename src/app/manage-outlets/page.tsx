'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  Plus, 
  Search, 
  Calendar, 
  RefreshCcw, 
  ChevronDown,
  MapPin,
  MoreHorizontal,
  Edit3
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
import { cn } from "@/lib/utils";
import MenuBuilder from "@/components/menu-builder";
import AppSidebar from "@/components/app-sidebar";

// --- Types & Mock Data ---

interface Outlet {
  id: string;
  name: string;
  cuisine: string;
  city: string;
  locationDetail: string;
  image: string;
}

const MOCK_OUTLETS: Outlet[] = [
  { id: '1', name: "Bloomsbury's", cuisine: 'Bakery', city: 'Ras Al Khaimah', locationDetail: 'Ras Al Khaimah', image: 'https://picsum.photos/seed/bloom/400/250' },
  { id: '2', name: 'The Cheesecake Factory', cuisine: 'International', city: 'Dubai', locationDetail: 'Dubai Mall', image: 'https://picsum.photos/seed/cheesecake/400/250' },
  { id: '3', name: "P.F. Chang's", cuisine: 'Asian', city: 'Abu Dhabi', locationDetail: 'Abu Dhabi', image: 'https://picsum.photos/seed/pfchangs/400/250' },
  { id: '4', name: 'Zuma', cuisine: 'Japanese', city: 'Dubai', locationDetail: 'Dubai', image: 'https://picsum.photos/seed/zuma/400/250' },
  { id: '5', name: 'Al Fanar Seafood Market', cuisine: 'Seafood', city: 'Dubai', locationDetail: 'Dubai', image: 'https://picsum.photos/seed/seafood/400/250' },
  { id: '6', name: 'Vapiano', cuisine: 'Italian', city: 'Dubai', locationDetail: 'Dubai', image: 'https://picsum.photos/seed/vapiano/400/250' },
];

const OutletCard = ({ outlet }: { outlet: Outlet }) => (
  <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col group transition-all hover:shadow-md">
    <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden">
      <img src={outlet.image} alt={outlet.name} className="w-full h-full object-cover" />
      <button className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    <div className="p-5 flex-1 flex flex-col justify-between">
      <div className="space-y-4 mb-6">
        <div className="space-y-1">
          <h3 className="text-[15px] font-black text-slate-900 tracking-tight leading-tight">{outlet.name}</h3>
          <p className="text-[12px] text-slate-400 font-medium">{outlet.cuisine} • {outlet.city}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[12px] font-medium">{outlet.locationDetail}</span>
        </div>
      </div>
      <Button className="w-full bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-11 flex items-center justify-center gap-2 shadow-sm shadow-[#0CB5A8]/20">
        <Edit3 className="w-4 h-4" />
        Edit Outlet
      </Button>
    </div>
  </div>
);

export default function ManageOutletsPage() {
  const [mounted, setMounted] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isHeaderSearchFocused, setIsHeaderSearchFocused] = useState(false);
  const [lookbackWindow, setLookbackWindow] = useState('3 M');
  const [isMenuBuilderOpen, setIsMenuBuilderOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOutlets = useMemo(() => {
    return MOCK_OUTLETS.filter(outlet => 
      outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      outlet.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      <AppSidebar currentPath="/manage-outlets" onMenuBuilderOpen={() => setIsMenuBuilderOpen(true)} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <header className="fixed top-0 right-0 left-[280px] h-16 bg-white border-b border-slate-100 flex items-center px-8 justify-between gap-4 z-20">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center bg-white border border-slate-200 rounded-[15px] overflow-hidden h-10 w-full max-w-2xl transition-all">
              <div className="flex items-center flex-1 px-3.5 relative">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Search restaurant name..." 
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

        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] pt-16">
          <div className="p-8 max-w-[1400px] mx-auto space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Outlets</h1>
                <p className="text-[15px] text-slate-400 font-medium">Manage all your outlets in one place.</p>
              </div>
              <Button className="bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-xl h-10 px-6 shadow-lg shadow-[#0CB5A8]/20 flex items-center gap-2 text-xs">
                <Plus className="w-4 h-4" />
                New Outlet
              </Button>
            </div>

            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200 w-full transition-colors focus-within:border-[#0CB5A8]/50">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <Input 
                  placeholder="Search restaurant name" 
                  className="border-none shadow-none bg-transparent h-7 text-[14px] p-0 focus-visible:ring-0 placeholder:text-slate-400 font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 pb-20">
              {filteredOutlets.length > 0 ? (
                filteredOutlets.map((outlet) => (
                  <OutletCard key={outlet.id} outlet={outlet} />
                ))
              ) : (
                <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-[15px] text-slate-900 font-bold">No outlets found matching "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MenuBuilder open={isMenuBuilderOpen} onOpenChange={setIsMenuBuilderOpen} />
    </div>
  );
}
