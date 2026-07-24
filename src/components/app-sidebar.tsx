'use client';

import React, { useState } from 'react';
import { 
  LayoutGrid, 
  BarChart3, 
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ClipboardList,
  Plug,
  BookOpen,
  History,
  Grid3X3,
  Users,
  Settings,
  MinusSquare,
  Search,
  Image as ImageIcon,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Link from 'next/link';

interface SidebarItemProps {
  icon: any;
  label: string;
  active?: boolean;
  href?: string;
  subItems?: { label: string, href: string, active?: boolean }[];
  onClick?: () => void;
}

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  href = "#",
  subItems,
  onClick
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(active || subItems?.some(s => s.active));

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (subItems) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="px-4 py-0.5 block">
      <div className={cn(
        "group flex items-center justify-between px-4 py-2.5 cursor-pointer transition-all rounded-xl",
        active ? "bg-[#0CB5A8]/10 text-[#0CB5A8]" : (isOpen && subItems) ? "bg-[#F0FDFB] text-[#0CB5A8]" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )} onClick={handleClick}>
        <Link href={href} className="flex items-center gap-3 flex-1" onClick={(e) => { if(onClick || subItems) e.preventDefault(); }}>
          <Icon className={cn("w-[18px] h-[18px]", (active || (isOpen && subItems)) ? "text-[#0CB5A8]" : "text-slate-400 group-hover:text-slate-600")} />
          <span className={cn("text-[13px] font-semibold tracking-tight")}>{label}</span>
        </Link>
        {subItems && (
          <div className="flex items-center justify-center">
            {isOpen ? <MinusSquare className="w-4 h-4 text-[#0CB5A8]/40" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
          </div>
        )}
      </div>
      {isOpen && subItems && (
        <div className="ml-8 mt-1 border-l border-slate-100 pb-2">
          {subItems.map((sub, idx) => (
            <Link key={idx} href={sub.href} className="relative flex items-center py-2 pl-6 group/sub">
              {sub.active && (
                <div className="absolute left-[-4.5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-white bg-[#0CB5A8]" />
              )}
              <span className={cn(
                "text-[13px] transition-colors",
                sub.active ? "font-bold text-[#0CB5A8]" : "font-medium text-slate-500 hover:text-slate-900"
              )}>
                {sub.label}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

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

const MOCK_OUTLETS = [
  { id: '1', name: 'santossssssssssssss', slug: 'santossssssssssssss' },
  { id: '2', name: 'santosssss', slug: 'santosssss' },
  { id: '3', name: 'santos', slug: 'santos' },
  { id: '4', name: 'los-santos-nights', slug: 'los santos nights' },
];

export default function AppSidebar({ currentPath, onMenuBuilderOpen }: { currentPath: string, onMenuBuilderOpen: () => void }) {
  const [activeOutlet, setActiveOutlet] = useState(MOCK_OUTLETS[0]);

  return (
    <aside className="w-[280px] bg-white flex flex-col shrink-0 border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-screen overflow-hidden">
      <div className="p-8 pb-6 flex items-center justify-center">
        <svg width="122" height="39" viewBox="0 0 122 39" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="8.81641" y="0.482422" width="40.2279" height="4.95961" fill="#0CB5A8"/>
          <rect x="8.81641" y="12.0547" width="19.8384" height="4.95961" fill="#0CB5A8"/>
          <rect x="8.81641" y="23.6289" width="9.91922" height="4.95961" fill="#0CB5A8"/>
          <rect y="23.6289" width="5.51067" height="4.95961" fill="#0CB5A8"/>
          <rect y="12.0547" width="5.51067" height="4.95961" fill="#0CB5A8"/>
          <rect y="0.482422" width="5.51067" height="4.95961" fill="#0CB5A8"/>
          <path d="M47.5498 21.11168C47.5498 21.526 47.5243 21.9523 47.4731 22.3956H37.5756C37.6438 23.2822 37.9251 23.9642 38.4196 24.4416C38.9311 24.9019 39.5534 25.1321 40.2865 25.1321C41.3777 25.1321 42.1365 24.6717 42.5627 23.751H47.2174C46.9787 24.6888 46.5439 25.5328 45.913 26.283C45.2992 27.0332 44.5235 27.6214 43.5857 28.0476C42.648 28.4739 41.5994 28.687 40.44 28.687C39.0419 28.687 37.7972 28.3886 36.706 27.7919C35.6148 27.1951 34.7623 26.3426 34.1485 25.2344C33.5347 24.1261 33.2278 22.8303 33.2278 21.347C33.2278 19.8636 33.5262 18.5678 34.1229 17.4596C33.5347 16.3513 35.5892 15.4988 36.6805 14.9021C37.7717 14.3053 39.0248 14.0069 40.44 14.0069C41.821 14.0069 43.0486 14.2968 44.1228 14.8765C45.1969 15.4562 46.0324 16.2831 46.6291 17.3573C47.2429 18.4314 47.5498 19.6846 47.5498 21.11168ZM43.0742 19.9659C43.0742 19.2157 42.8185 18.619 42.307 18.1757C41.7955 17.7324 41.1561 17.5107 40.3888 17.5107C39.6557 17.5107 39.0334 17.7239 38.5219 18.1501C38.0274 18.5764 37.7205 19.1816 37.6012 19.9659H43.0742ZM70.1891 10.5287V28.4824H65.8158V17.7153L61.8005 28.4824H58.2712L54.2303 17.6898V28.4824H49.857V10.5287H55.0231L60.0614 22.9582L65.0486 10.5287H70.1891ZM86.7865 21.11168C86.7865 21.526 86.761 21.9523 86.7098 22.3956H76.8123C76.8805 23.2822 77.1618 23.9642 77.6563 24.4416C78.1678 24.9019 78.7901 25.1321 79.5232 25.1321C80.6144 25.1321 81.3732 24.6717 81.7994 23.751H86.4541C86.2154 24.6888 85.7806 25.5328 85.1497 26.283C84.5359 27.0332 83.7602 27.6214 82.8224 28.0476C81.8847 28.4739 80.8361 28.687 79.6767 28.687C78.2786 28.687 77.0339 28.3886 75.9427 27.7919C74.8515 27.1951 73.999 26.3426 73.3852 25.2344C72.7714 24.1261 72.4645 22.8303 72.4645 21.347C72.4645 19.8636 72.7629 18.5678 73.3597 17.4596C73.9735 16.3513 74.826 15.4988 75.9172 14.9021C77.0084 14.3053 78.2615 14.0069 79.6767 14.0069C81.0577 14.0069 82.2853 14.2968 83.3595 14.8765C84.4336 15.4562 85.2691 16.2831 85.8658 17.3573C86.4796 18.4314 86.7865 19.6846 86.7865 21.11168ZM82.3109 19.9659C82.3109 19.2157 82.0552 18.619 81.5437 18.1757C81.0322 17.7324 80.3928 17.5107 79.6255 17.5107C78.8924 17.5107 78.2701 17.7239 77.7586 18.1501C77.2641 18.5764 77.2641 18.5764 76.8379 19.9659H82.3109ZM97.7892 14.0581C99.4601 14.0581 100.79 14.6037 101.779 15.6949C102.785 16.7691 103.288 18.2524 103.288 20.145V28.4824H98.9401V20.7332C98.9401 19.7784 98.6929 19.0367 98.1984 18.5082C97.704 17.9796 97.039 17.7153 96.2036 17.7153C95.3681 17.7153 94.5071 14.9788 95.2573 14.6207C96.0075 14.2456 96.8515 14.0581 97.7892 14.0581ZM120.419 14.2115V28.4824H116.045V26.5387C115.602 27.1696 114.997 27.6811 114.23 28.0732C113.479 28.4483 112.644 28.6359 111.723 28.6359C110.632 28.6359 109.669 28.3972 108.833 27.9198C107.998 27.4253 107.35 26.7177 106.89 25.797C106.429 24.8763 106.199 23.7937 106.199 22.549V14.2115H110.547V21.9608C110.547 22.9156 110.794 23.6573 111.288 24.1858C111.783 24.7144 112.448 24.9786 113.283 24.9786C114.136 24.9786 114.809 24.7144 115.304 24.1858C115.798 23.6573 116.045 22.9156 116.045 21.9608V14.2115H120.419Z" fill="#111E3C"/>
        </svg>
      </div>

      <Separator className="bg-slate-50" />

      <div className="flex-1 overflow-y-auto pt-4 pb-8 no-scrollbar">
        <SidebarSectionLabel label="OVERVIEW" />
        <SidebarItem icon={LayoutGrid} label="Dashboard" active={currentPath === '/dashboard'} href="/dashboard" />
        <SidebarItem icon={BarChart3} label="Live Order Hub" active={currentPath === '/live-order-hub'} href="/live-order-hub" />
        <SidebarItem icon={History} label="Reports" active={['/orders-report', '/split-bill-report', '/tips-report'].includes(currentPath)} subItems={[
          { label: 'Order Report', href: '/orders-report', active: currentPath === '/orders-report' },
          { label: 'Split Bill Report', href: '/split-bill-report', active: currentPath === '/split-bill-report' },
          { label: 'Tips Report', href: '/tips-report', active: currentPath === '/tips-report' },
        ]} />

        <SidebarDivider />

        <SidebarSectionLabel label="MANAGEMENT" />
        <SidebarItem icon={ClipboardList} label="Order List" active={currentPath === '/orders'} href="/orders" />
        <SidebarItem icon={BookOpen} label="Menu Builder" onClick={onMenuBuilderOpen} />
        <SidebarItem icon={Grid3X3} label="Table Operations" active={currentPath === '/qr-codes'} href="/qr-codes" />
        <SidebarItem icon={Users} label="Guest Directory" active={currentPath === '/guest-directory'} href="/guest-directory" />

        <SidebarDivider />

        <SidebarSectionLabel label="CONFIGURATION" />
        <SidebarItem icon={Settings} label="Settings" active={['/manage-outlets', '/manage-users'].includes(currentPath)} subItems={[
          { label: 'Manage Outlets', href: '/manage-outlets', active: currentPath === '/manage-outlets' },
          { label: 'Manage Users', href: '/manage-users', active: currentPath === '/manage-users' },
        ]} />

        <SidebarDivider />

        <SidebarSectionLabel label="CONNECTIONS" />
        <SidebarItem icon={Plug} label="Integration" active={['/pos', '/payment-gateway'].includes(currentPath)} subItems={[
          { label: 'POS', href: '/pos', active: currentPath === '/pos' },
          { label: 'Payment Gateway', href: '/payment-gateway', active: currentPath === '/payment-gateway' },
        ]} />
      </div>

      <div className="bg-[#111827] p-4 rounded-t-[28px] mt-auto">
        <Popover>
          <PopoverTrigger asChild>
            <div className="bg-[#1E293B] rounded-[20px] p-2.5 flex items-center justify-between group cursor-pointer transition-colors hover:bg-[#2D3748] shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 border-2 border-white/10 shadow-lg rounded-xl flex items-center justify-center bg-white text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-[#0CB5A8] font-bold uppercase tracking-wider leading-none mb-0.5 truncate max-w-[120px]">
                    {activeOutlet.slug}
                  </span>
                  <span className="text-[12px] font-bold text-white tracking-tight truncate max-w-[120px]">
                    {activeOutlet.name}
                  </span>
                </div>
              </div>
              <ChevronUp className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[240px] p-0 rounded-[20px] border-slate-100 shadow-2xl overflow-hidden bg-white mb-2" 
            align="end" 
            side="top"
            sideOffset={12}
          >
            <div className="p-4 border-b border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SELECT AN OUTLET</span>
              <Search className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="p-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg mb-2 border border-slate-100/50">
                 <Search className="w-3.5 h-3.5 text-slate-400" />
                 <Input 
                  placeholder="Search outlet..." 
                  className="border-none shadow-none h-4 text-[12px] p-0 focus-visible:ring-0 placeholder:text-slate-400" 
                 />
              </div>
              <div className="space-y-1 max-h-[200px] overflow-y-auto no-scrollbar">
                {MOCK_OUTLETS.map((outlet) => (
                  <div 
                    key={outlet.id}
                    onClick={() => setActiveOutlet(outlet)}
                    className={cn(
                      "flex flex-col px-3 py-2.5 rounded-xl cursor-pointer transition-all relative group",
                      activeOutlet.id === outlet.id ? "bg-[#F0FDFB]" : "hover:bg-slate-50"
                    )}
                  >
                    <span className={cn(
                      "text-[10px] font-medium leading-none mb-1",
                      activeOutlet.id === outlet.id ? "text-slate-400" : "text-slate-400"
                    )}>{outlet.slug}</span>
                    <span className={cn(
                      "text-[13px] font-black leading-none",
                      activeOutlet.id === outlet.id ? "text-[#0CB5A8]" : "text-slate-600"
                    )}>{outlet.name}</span>
                    {activeOutlet.id === outlet.id && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0CB5A8]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-3 border-t border-slate-50">
               <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-[#0CB5A8] hover:bg-[#F0FDFB] transition-colors text-[13px] font-black group">
                  <div className="w-5 h-5 rounded-full border border-[#0CB5A8]/30 flex items-center justify-center group-hover:border-[#0CB5A8] transition-colors">
                    <Plus className="w-3 h-3" />
                  </div>
                  Add New Outlet
               </button>
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="flex items-center gap-2.5 px-3 py-3 mt-0.5 group cursor-pointer">
          <div className="w-5.5 h-5.5 rounded-full border border-[#0CB5A8] flex items-center justify-center group-hover:bg-[#0CB5A8]/10 transition-colors">
            <HelpCircle className="w-3 h-3 text-[#0CB5A8]" />
          </div>
          <span className="text-[13px] font-semibold text-slate-400 group-hover:text-white transition-colors">Help & Support</span>
        </div>
      </div>
    </aside>
  );
}
