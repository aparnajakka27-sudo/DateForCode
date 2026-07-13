"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserCheck, Star, UsersRound, MonitorPlay, 
  Heart, FolderKanban, MessageSquare, Flag, DollarSign,
  Activity, AlertCircle, Play, Shield, FileText
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

const mockActivities = [
  { id: 1, type: 'user', message: 'New User Joined: alex_dev', time: 'Just now', icon: Users, color: 'text-[#3B82F6]' },
  { id: 2, type: 'premium', message: 'Premium Purchased by sarah_codes', time: '2 mins ago', icon: Star, color: 'text-[#FF3366]' },
  { id: 3, type: 'community', message: 'New Community: React Wizards', time: '15 mins ago', icon: UsersRound, color: 'text-[#10B981]' },
  { id: 4, type: 'project', message: 'Project Uploaded: AI Chatbot', time: '1 hour ago', icon: FolderKanban, color: 'text-[#7B61FF]' },
  { id: 5, type: 'report', message: 'User Reported: spam_bot_99', time: '2 hours ago', icon: Flag, color: 'text-red-500' },
  { id: 6, type: 'match', message: 'Match Created: Alex & Sarah', time: '3 hours ago', icon: Heart, color: 'text-[#FF3366]' },
  { id: 7, type: 'room', message: 'Coding Room Started: Python 101', time: '4 hours ago', icon: Play, color: 'text-[#3B82F6]' },
];

export default function AdminDashboardHome() {
  const [activities, setActivities] = useState(mockActivities);

  // Simulate incoming live activity
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: 'message',
        message: 'New Messages in Global Chat',
        time: 'Just now',
        icon: MessageSquare,
        color: 'text-[#7B61FF]'
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 8));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tight">Dashboard Overview</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Welcome back, Super Admin. Here is what is happening today.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Systems Operational
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <StatCard title="Total Users" value="12,450" trend={12.5} icon={Users} color="blue" delay={0.1} />
        <StatCard title="Active Today" value="3,210" trend={5.2} icon={UserCheck} color="green" delay={0.15} />
        <StatCard title="Premium Members" value="1,840" trend={18.4} icon={Star} color="pink" delay={0.2} />
        <StatCard title="Communities" value="156" trend={2.1} icon={UsersRound} color="purple" delay={0.25} />
        <StatCard title="Coding Rooms" value="42" trend={-1.5} icon={MonitorPlay} color="blue" delay={0.3} />
        <StatCard title="Matches Created" value="8,920" trend={14.2} icon={Heart} color="pink" delay={0.35} />
        <StatCard title="Projects Shared" value="4,150" trend={8.7} icon={FolderKanban} color="purple" delay={0.4} />
        <StatCard title="Daily Messages" value="145k" trend={22.4} icon={MessageSquare} color="blue" delay={0.45} />
        <StatCard title="Reports Pending" value="12" trend={-5.0} icon={Flag} color="green" delay={0.5} />
        <StatCard title="Total Revenue" value="$45,210" trend={16.8} icon={DollarSign} color="green" delay={0.55} />
      </div>

      {/* Live Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Activity Feed */}
        <div className="lg:col-span-2 ide-panel overflow-hidden border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-2xl rounded-3xl">
          <div className="ide-panel-header border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)] py-4 px-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FF3366] animate-pulse" />
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">Live Activity</span>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-1">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 p-3 rounded-xl hover:bg-[var(--btn-sec-bg)] transition-colors group"
                  >
                    <div className={`mt-0.5 p-2 rounded-lg bg-[var(--btn-sec-bg)] border border-[var(--ide-border)]/50 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#FF3366] transition-colors">{activity.message}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Signups */}
        <div className="space-y-8">
          
          <div className="ide-panel overflow-hidden border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-2xl rounded-3xl">
            <div className="ide-panel-header border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)] py-4 px-6">
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">Quick Actions</span>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {[
                { label: 'Broadcast', icon: MessageSquare },
                { label: 'Add Mod', icon: Shield },
                { label: 'Gen Report', icon: FileText },
                { label: 'Backup DB', icon: AlertCircle }
              ].map((action, i) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-[var(--btn-sec-border)] bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] hover:text-[#FF3366] hover:border-[#FF3366]/30 hover:bg-[#FF3366]/5 transition-all"
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="ide-panel overflow-hidden border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-2xl rounded-3xl">
            <div className="ide-panel-header border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)] py-4 px-6">
              <span className="text-xs font-bold text-[var(--text-primary)] font-mono uppercase tracking-wider">Recent Signups</span>
            </div>
            <div className="p-4 space-y-4">
              {[
                { name: 'Sarah Jenkins', role: 'Frontend Dev', time: '10m ago' },
                { name: 'Michael Chen', role: 'Data Scientist', time: '35m ago' },
                { name: 'Elena Rodriguez', role: 'UX Designer', time: '1h ago' }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF3366]/20 to-[#7B61FF]/20 border border-[var(--ide-border)] flex items-center justify-center text-[var(--text-primary)] font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{user.name}</p>
                    <div className="flex gap-2 text-xs text-[var(--text-muted)]">
                      <span>{user.role}</span>
                      <span>•</span>
                      <span>{user.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 py-2 text-xs font-bold text-[#FF3366] border border-[#FF3366]/20 rounded-lg hover:bg-[#FF3366]/10 transition-colors">
                View All Users
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
