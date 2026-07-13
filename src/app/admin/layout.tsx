"use client";

import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Authentication is now strictly handled at the Edge (src/middleware.ts)
  // Non-owners are instantly redirected before this layout even renders.

  return (
    <div className="min-h-screen bg-[var(--background)] flex font-sans selection:bg-[#FF3366]/20">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ml-[80px] md:ml-[260px]">
        <AdminNavbar />
        
        <main className="flex-1 p-6 lg:p-10 relative overflow-x-hidden noise-bg">
          <div className="aurora-mesh opacity-30 fixed pointer-events-none" />
          
          <div className="relative z-10 w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
