'use client';

import React from 'react';
import { 
  X, 
  Plus, 
  LayoutGrid, 
  Smartphone, 
  Settings, 
  MoreHorizontal,
  ListIcon,
  Palette
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";

interface MenuBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MenuBuilder({ open, onOpenChange }: MenuBuilderProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 border-0 flex flex-col w-screen h-screen max-w-full max-h-full rounded-none sm:rounded-none overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Menu Builder</DialogTitle>
        </VisuallyHidden>

        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-0 bg-white z-10">
          <div className="flex items-center h-full">
            <button 
              onClick={() => onOpenChange(false)}
              className="w-16 h-full flex items-center justify-center border-r border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className="flex items-center gap-3 px-6">
              <div className="w-8 h-8 bg-[#0CB5A8] rounded-lg flex items-center justify-center">
                <ListIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Menu Builder</span>
            </div>
          </div>
          <div className="px-6">
            <Button className="bg-[#0CB5A8] hover:bg-[#0CB5A8]/90 text-white font-bold rounded-lg h-9 px-4 flex items-center gap-2 text-xs">
              <Plus className="w-4 h-4" />
              Add Menu
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden bg-[#F8FAFC]">
          {/* Internal Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-4 gap-6">
            <div className="space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 bg-[#E2F5F3] text-[#0CB5A8] hover:bg-[#E2F5F3] hover:text-[#0CB5A8] font-bold text-[13px] h-11 rounded-xl"
              >
                <ListIcon className="w-4 h-4" />
                Create a Menu
              </Button>
            </div>

            <div className="space-y-3">
              <span className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Customization</span>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-slate-500 hover:bg-slate-50 font-bold text-[13px] h-11 rounded-xl"
              >
                <Palette className="w-4 h-4" />
                Brand Management
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-12">
            <div className="max-w-5xl space-y-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Menus</h1>
                <p className="text-[15px] text-slate-400 font-medium">Manage and organize all your restaurant menus</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Existing Menu Card */}
                <div className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
                  <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#0CB5A8]" />
                      <span className="text-[13px] font-bold text-slate-900">Mobile Menu</span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-slate-300">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="aspect-square bg-slate-50 flex items-center justify-center p-8">
                    <div className="w-full h-full relative rounded-[32px] border-[6px] border-slate-900 overflow-hidden shadow-2xl bg-white">
                      <div className="absolute inset-0 bg-[#0CB5A8]/5 flex flex-col">
                        <div className="h-10 bg-[#0CB5A8] flex items-center px-4 justify-between">
                           <div className="w-4 h-0.5 bg-white/40" />
                           <div className="w-12 h-2 bg-white/20 rounded-full" />
                        </div>
                        <div className="p-4 space-y-4">
                           <div className="h-4 bg-slate-200 rounded-full w-2/3" />
                           <div className="grid grid-cols-2 gap-2">
                              <div className="aspect-square bg-orange-400 rounded-lg" />
                              <div className="aspect-square bg-slate-100 rounded-lg" />
                           </div>
                           <div className="h-2 bg-emerald-400 rounded-full w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Create New Menu Button */}
                <div className="aspect-square rounded-[24px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 hover:border-[#0CB5A8] hover:bg-[#0CB5A8]/5 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-white group-hover:text-[#0CB5A8] transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="text-[14px] font-bold text-slate-400 group-hover:text-[#0CB5A8]">Create New Menu</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}