"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

interface SidebarItem {
  label: string;
  icon: any;
  href?: string;
  locked?: boolean;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

interface PortalSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  items: SidebarItem[];
  headerBadge?: React.ReactNode;
  bottomActions?: React.ReactNode;
}

export default function PortalSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  items,
  headerBadge,
  bottomActions
}: PortalSidebarProps) {
  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }} 
      transition={{ duration: 0.5 }} 
      className={`fixed top-0 left-0 h-screen bg-[var(--ide-header-bg)] border-r border-[var(--ide-border)] flex flex-col z-50 transition-all duration-500 shadow-2xl ${isSidebarOpen ? 'w-64' : 'w-[88px]'}`}
    >
      
      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center text-[var(--text-secondary)] hover:text-accent-pink hover:border-accent-pink z-[60] transition-colors"
      >
        {isSidebarOpen ? <ChevronLeft className="w-3 h-3"/> : <ChevronRight className="w-3 h-3"/>}
      </button>

      <div className={`p-6 pb-4 flex items-center ${isSidebarOpen ? '' : 'justify-center'}`}>
        <Logo showText={isSidebarOpen} className={`origin-left transition-all duration-500 ${isSidebarOpen ? 'scale-[0.8]' : 'scale-[0.5]'}`} />
      </div>

      {headerBadge && (
        <div className={`px-4 mb-2 flex ${isSidebarOpen ? '' : 'justify-center'}`}>
          {isSidebarOpen ? (
            headerBadge
          ) : (
            <div className="opacity-0 w-0 overflow-hidden transition-all duration-300 h-0">
              {headerBadge}
            </div>
          )}
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {items.map((item) => {
          const isLink = item.href && !item.locked;
          const href = item.locked ? '#' : item.href;
          
          const innerContent = (
            <>
              {item.locked ? (
                <Lock className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0" />
              ) : (
                <item.icon className={`w-4 h-4 flex-shrink-0 ${item.active ? 'text-white' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'} transition-colors`} />
              )}
              
              <div className={`flex items-center justify-between overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                <span className="truncate">{item.label}</span>
                {item.locked && <Lock className="w-3.5 h-3.5 text-[var(--text-secondary)] ml-auto" />}
              </div>
            </>
          );

          const commonProps = {
            onClick: (e: any) => { if (item.onClick) item.onClick(e); },
            className: `w-full flex items-center gap-3 px-3 py-3 rounded text-[12px] font-bold font-mono transition-all duration-200 group text-left ${isSidebarOpen ? '' : 'justify-center'} ${
                item.active 
                  ? 'bg-[#FF3366] text-white shadow-lg shadow-[#FF3366]/20' 
                  : item.locked 
                    ? 'text-[var(--text-muted)] cursor-not-allowed border border-transparent opacity-40' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--ide-bg)]'
              }`
          };

          return isLink ? (
            <Link key={item.label} href={href!} {...commonProps}>
              {innerContent}
            </Link>
          ) : (
            <button key={item.label} {...commonProps}>
              {innerContent}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      {bottomActions && (
        <div className="p-4 mt-auto space-y-2">
          {bottomActions}
        </div>
      )}
    </motion.aside>
  );
}
