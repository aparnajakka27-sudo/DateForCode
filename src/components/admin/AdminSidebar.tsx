"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Heart, 
  UsersRound, 
  MonitorPlay, 
  FileText, 
  FolderKanban, 
  Trophy, 
  Star, 
  Flag, 
  Shield, 
  BarChart3, 
  DollarSign, 
  Bell, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import Logo from '@/components/Logo';

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Chats', path: '/admin/chats', icon: MessageSquare },
  { name: 'Matches', path: '/admin/matches', icon: Heart },
  { name: 'Communities', path: '/admin/communities', icon: UsersRound },
  { name: 'Coding Rooms', path: '/admin/coding-rooms', icon: MonitorPlay },
  { name: 'Posts', path: '/admin/posts', icon: FileText },
  { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { name: 'Leaderboard', path: '/admin/leaderboard', icon: Trophy },
  { name: 'Premium Users', path: '/admin/premium', icon: Star },
  { name: 'Reports', path: '/admin/reports', icon: Flag },
  { name: 'Moderators', path: '/admin/moderators', icon: Shield },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  { name: 'Revenue', path: '/admin/revenue', icon: DollarSign },
  { name: 'System Health', path: '/admin/system-health', icon: Activity },
  { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.aside 
      initial={false}
      animate={{ width: collapsed ? '80px' : '260px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-50 bg-[var(--nav-bg)] backdrop-blur-xl border-r border-[var(--nav-border)] flex flex-col hide-scrollbar overflow-y-auto overflow-x-hidden shadow-[10px_0_40px_-10px_rgba(255,51,102,0.05)]"
    >
      <div className="flex items-center justify-between p-6 border-b border-[var(--nav-border)] sticky top-0 bg-[var(--nav-bg)] backdrop-blur-xl z-20 h-[80px]">
        {mounted && (
          <AnimateLogo collapsed={collapsed} />
        )}
        
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 bg-[var(--ide-bg)] border border-[var(--ide-border)] p-1.5 rounded-full text-[var(--text-secondary)] hover:text-[#FF3366] transition-colors shadow-lg z-50"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      <div className="flex-1 py-4 px-3 space-y-1 relative">
        {mounted && !collapsed && (
          <div className="px-3 pb-6 mb-2 border-b border-[var(--nav-border)]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF3366] to-[#7B61FF] p-[2px] shadow-lg">
                  <div className="w-full h-full rounded-full bg-[var(--ide-bg)] border-2 border-transparent flex items-center justify-center overflow-hidden">
                    <span className="text-[var(--text-primary)] font-bold text-sm">O</span>
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[var(--nav-bg)] rounded-full"></span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[var(--text-primary)] leading-tight">Owner</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">Super Admin</span>
              </div>
            </div>
          </div>
        )}
        {mounted && collapsed && (
          <div className="px-1 pb-4 mb-2 border-b border-[var(--nav-border)] flex justify-center">
             <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF3366] to-[#7B61FF] p-[2px] shadow-md">
                  <div className="w-full h-full rounded-full bg-[var(--ide-bg)] border-2 border-transparent flex items-center justify-center overflow-hidden">
                    <span className="text-[var(--text-primary)] font-bold text-xs">O</span>
                  </div>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--nav-bg)] rounded-full"></span>
              </div>
          </div>
        )}

        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div 
                className={`relative flex items-center p-3 rounded-xl transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'text-white font-semibold' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--btn-sec-bg)] hover:text-[var(--foreground)]'
                } ${collapsed ? 'justify-center' : 'gap-4'}`}
                title={collapsed ? item.name : ''}
              >
                {/* Active Background Glow */}
                {isActive && mounted && (
                  <motion.div 
                    layoutId="active-bg"
                    className="absolute inset-0 bg-gradient-to-r from-[#FF3366] to-[#7B61FF] opacity-90 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={`relative z-10 ${isActive ? 'text-white' : 'text-[var(--text-muted)] group-hover:text-[#FF3366]'} transition-colors shrink-0`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                {!collapsed && (
                  <span className={`relative z-10 whitespace-nowrap text-sm ${isActive ? 'font-bold tracking-wide' : 'font-medium'}`}>
                    {item.name}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-[var(--nav-border)] sticky bottom-0 bg-[var(--nav-bg)] backdrop-blur-xl h-[70px]">
        <button 
          className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:text-red-500 text-[var(--text-secondary)] group ${collapsed ? 'justify-center' : 'gap-4'}`}
          title={collapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="group-hover:text-red-500 transition-colors shrink-0" />
          {!collapsed && <span className="font-medium text-sm whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}

function AnimateLogo({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center">
      {!collapsed ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
          <Logo showText={true} className="scale-[0.85] origin-left" />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex justify-center text-[#FF3366]">
          <Logo showText={false} className="scale-[0.7]" />
        </motion.div>
      )}
    </div>
  );
}
