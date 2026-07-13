"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Activity, 
  Trash2, 
  UserCheck, 
  UserX, 
  RefreshCw, 
  Search, 
  ArrowLeft,
  Calendar,
  Layers,
  Laptop
} from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

interface AdminLog {
  id: string;
  eventType: string;
  email: string;
  details: string;
  timestamp: number;
  userAgent?: string;
}

export default function AdminDashboard() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    // Realtime administrative logs listener
    const q = query(
      collection(db, 'admin_logs'), 
      orderBy('timestamp', 'desc'), 
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parsedLogs: AdminLog[] = [];
      snapshot.forEach((doc) => {
        const d = doc.data();
        parsedLogs.push({
          id: doc.id,
          eventType: d.eventType || 'UNKNOWN',
          email: d.email || 'Unknown',
          details: d.details || '',
          timestamp: d.timestamp || Date.now(),
          userAgent: d.userAgent || ''
        });
      });
      setLogs(parsedLogs);
      setLoading(false);
    }, (err) => {
      console.error("Firestore subscription error in administrative dashboard:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter logs based on search and type filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || log.eventType === filterType;

    return matchesSearch && matchesType;
  });

  // Calculate telemetry counts
  const stats = {
    total: logs.length,
    success: logs.filter(l => l.eventType === 'LOGIN_SUCCESS').length,
    failed: logs.filter(l => l.eventType === 'LOGIN_FAILED').length,
    suspicious: logs.filter(l => l.eventType === 'SUSPICIOUS_BEHAVIOR' || l.eventType === 'ACCOUNT_SWITCH_ATTEMPT').length,
    deletions: logs.filter(l => l.eventType === 'ACCOUNT_DELETED').length
  };

  // Helper to mask emails for user privacy (Requirement #7: without exposing private user credentials)
  const maskEmail = (emailStr: string): string => {
    if (!emailStr || emailStr === 'Unknown') return 'System / Guest';
    const parts = emailStr.split('@');
    if (parts.length !== 2) return emailStr;
    const name = parts[0];
    const domain = parts[1];
    const maskedName = name.length > 2 
      ? name.substring(0, 2) + '*'.repeat(name.length - 2) 
      : name + '**';
    return `${maskedName}@${domain}`;
  };

  // Helper to format date cleanly
  const formatTime = (timeMs: number): string => {
    return new Date(timeMs).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timeMs: number): string => {
    return new Date(timeMs).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Render icons corresponding to audit types
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'LOGIN_SUCCESS':
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case 'LOGIN_FAILED':
        return <UserX className="w-4 h-4 text-amber-500" />;
      case 'ACCOUNT_SWITCH_ATTEMPT':
      case 'SUSPICIOUS_BEHAVIOR':
        return <ShieldAlert className="w-4 h-4 text-[#FF3366] animate-pulse" />;
      case 'ACCOUNT_DELETED':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      default:
        return <Layers className="w-4 h-4 text-[var(--text-secondary)]" />;
    }
  };

  return (
    <main className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#FF3366]/20 overflow-x-hidden font-sans noise-bg pb-20">
      
      {/* Aurora mesh glows */}
      <div className="aurora-mesh" />

      {/* Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] py-5 px-6 md:px-12 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center">
          <Logo showText={true} className="scale-[0.95] origin-left" />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-bold hover:text-[#FF3366] transition-colors group font-mono"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            LANDING
          </Link>
        </div>
      </nav>

      {/* Main Admin Section */}
      <section className="relative z-10 pt-40 px-6 md:px-12 max-w-7xl mx-auto space-y-10">
        
        {/* Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-bold font-mono">
            🛡️ SECURITY PROTOCOL ACTIVE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            ADMINISTRATIVE MONITORING
          </h1>
          <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
            Realtime security ledger auditing logins, failed attempts, account deletion sequences, and device binding restrictions.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Events', val: stats.total, icon: Activity, col: 'text-[#3B82F6]' },
            { label: 'Login Success', val: stats.success, icon: UserCheck, col: 'text-emerald-500' },
            { label: 'Failed Logins', val: stats.failed, icon: UserX, col: 'text-amber-500' },
            { label: 'Suspicious / Switches', val: stats.suspicious, icon: ShieldAlert, col: 'text-[#FF3366]' },
            { label: 'Account Wipes', val: stats.deletions, icon: Trash2, col: 'text-red-500' }
          ].map((s, i) => (
            <div key={i} className="glass-panel p-5 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] shadow-md flex items-center gap-4">
              <div className={`p-2.5 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)]/50 ${s.col}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">{s.label}</div>
                <div className="text-xl font-black text-[var(--text-primary)] font-mono mt-0.5">{loading ? '...' : s.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search toolbar */}
        <div className="glass-panel p-6 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel-bg)] flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF3366] transition-colors" />
            <input 
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search details, emails, events..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF3366] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-semibold"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto font-mono text-[10px]">
            {[
              { label: 'All Logs', id: 'ALL' },
              { label: 'Success', id: 'LOGIN_SUCCESS' },
              { label: 'Failed', id: 'LOGIN_FAILED' },
              { label: 'Switches', id: 'ACCOUNT_SWITCH_ATTEMPT' },
              { label: 'Suspicious', id: 'SUSPICIOUS_BEHAVIOR' },
              { label: 'Deletions', id: 'ACCOUNT_DELETED' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`px-3 py-1.5 rounded-lg border font-bold uppercase transition-all duration-300 ${filterType === type.id ? 'border-[#FF3366] bg-[#FF3366]/10 text-[#FF3366]' : 'border-[var(--btn-sec-border)] hover:border-[#FF3366] text-[var(--text-secondary)] bg-[var(--btn-sec-bg)]'}`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="ide-panel w-full overflow-hidden border border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-2xl rounded-3xl">
          {/* Table Header */}
          <div className="ide-panel-header justify-between border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)] py-4 px-6">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF3366] animate-pulse" />
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">Security Access Ledger</span>
            </div>
            <span className="text-[9px] text-[var(--text-muted)] font-mono uppercase">Showing {filteredLogs.length} events</span>
          </div>

          {/* Logs List */}
          <div className="divide-y divide-[var(--ide-border)] overflow-x-auto min-h-[300px]">
            {loading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-[#FF3366]/20 border-t-[#FF3366] rounded-full animate-spin mx-auto" />
                <span className="text-xs text-[var(--text-muted)] font-mono uppercase">Retrieving Audit Trails...</span>
              </div>
            ) : filteredLogs.length === 0 ? (
              <div className="py-20 text-center space-y-2">
                <ShieldAlert className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
                <div className="text-xs font-bold text-[var(--text-secondary)] font-mono uppercase">No Records Resolved</div>
                <div className="text-[10px] text-[var(--text-muted)] font-mono">Ledger is clean or query filters returned empty results.</div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[var(--ide-header-bg)] border-b border-[var(--ide-border)] text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-wider">
                    <th className="py-4 px-6">Timestamp</th>
                    <th className="py-4 px-6">Event Type</th>
                    <th className="py-4 px-6">Masked Identity</th>
                    <th className="py-4 px-6">Audit Details</th>
                    <th className="py-4 px-6 hidden md:table-cell">Client Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ide-border)] bg-[var(--background)]/30 text-[var(--text-secondary)]">
                  <AnimatePresence>
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/[0.02] dark:hover:bg-white/[0.01] transition-colors">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                            <span>{formatDate(log.timestamp)}</span>
                            <span className="text-[var(--text-muted)]">@{formatTime(log.timestamp)}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[var(--btn-sec-bg)] border border-[var(--ide-border)]/50 font-bold uppercase text-[9px]">
                            {getEventIcon(log.eventType)}
                            <span className="ml-0.5">{log.eventType.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap font-bold">
                          {maskEmail(log.email)}
                        </td>
                        <td className="py-4 px-6 text-[11px] text-[var(--text-primary)] max-w-sm break-words font-sans">
                          {log.details}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-[var(--text-muted)] hidden md:table-cell text-[10px]">
                          <div className="flex items-center gap-1.5 max-w-[150px] overflow-hidden text-ellipsis">
                            <Laptop className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{log.userAgent || "Unknown Agent"}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
