"use client";

import React from 'react';
import { Search, Bell, MessageSquare, User } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { motion } from 'framer-motion';

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full h-[80px] bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--nav-border)] flex items-center justify-between px-6 md:px-10 transition-all duration-300 shadow-[0_4px_30px_rgba(255,51,102,0.03)]">
      
      {/* Left side: Search */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF3366] transition-colors" />
          <input 
            type="text"
            placeholder="Search users, metrics, reports..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF3366] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-medium shadow-sm focus:shadow-[0_0_15px_rgba(255,51,102,0.15)]"
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-4 md:gap-6 ml-4">
        
        {/* Actions (Notifications & Messages) */}
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full text-[var(--text-secondary)] hover:text-[#FF3366] hover:bg-[var(--btn-sec-bg)] transition-colors"
          >
            <MessageSquare size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#7B61FF] rounded-full animate-pulse" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-full text-[var(--text-secondary)] hover:text-[#FF3366] hover:bg-[var(--btn-sec-bg)] transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3366] rounded-full animate-pulse" />
          </motion.button>
        </div>

        <div className="h-6 w-[1px] bg-[var(--ide-border)] hidden md:block"></div>

        {/* Theme & Profile */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#FF3366] transition-colors">Admin Super</span>
              <span className="text-[10px] text-[var(--text-muted)]">Owner</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF3366] to-[#7B61FF] p-[2px] shadow-md group-hover:shadow-[0_0_15px_rgba(255,51,102,0.3)] transition-all">
              <div className="w-full h-full rounded-full bg-[var(--ide-bg)] border-2 border-transparent flex items-center justify-center overflow-hidden">
                <User size={16} className="text-[var(--text-secondary)]" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
