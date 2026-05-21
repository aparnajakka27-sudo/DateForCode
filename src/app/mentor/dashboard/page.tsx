"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Video, Calendar, Swords, FileCheck, TrendingUp, Star, 
  Target, BarChart3, Clock, Briefcase, Bell, Settings, LogOut, Code2, AlertCircle, Play, ChevronRight, MessageSquare, Award, BookOpen, Zap,
  Search, CheckCircle2, Shield, Edit3, Plus, X, UserCheck, Terminal, Cpu, Database, Laptop, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 15 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

interface LiveSession {
  id: number;
  students: string;
  stack: string;
  time: string;
  status: 'help_requested' | 'coding' | 'reviewing';
  avatar1: string;
  avatar2: string | null;
  topic: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  hp: number;
  matches: number;
  level: number;
  topSkill: string;
}

// Higher density live session queue
const MOCK_LIVE_SESSIONS: LiveSession[] = [
  { id: 101, students: 'Rahul M. & Aarav M.', stack: 'C++', time: '14m elapsed', status: 'help_requested', avatar1: 'RM', avatar2: 'AM', topic: 'Dynamic Programming: Knapsack Array Overflows' },
  { id: 102, students: 'Sneha D. & Rohan V.', stack: 'JavaScript', time: '22m elapsed', status: 'coding', avatar1: 'SD', avatar2: 'RV', topic: 'React Thread Rendering Sockets' },
  { id: 103, students: 'Ananya I. & Priya S.', stack: 'Python', time: '8m elapsed', status: 'reviewing', avatar1: 'AI', avatar2: 'PS', topic: 'Data Pipeline Array Matrix' },
];

const MOCK_STUDENTS: Student[] = [
  { id: 'st1', name: 'Rahul Mehta', avatar: 'RM', hp: 580, matches: 12, level: 8, topSkill: 'C++ Kernels' },
  { id: 'st2', name: 'Sneha Nair', avatar: 'SN', hp: 490, matches: 9, level: 6, topSkill: 'TypeScript Sockets' },
  { id: 'st3', name: 'Aarav Verma', avatar: 'AV', hp: 610, matches: 15, level: 9, topSkill: 'React Virtual DOM' },
  { id: 'st4', name: 'Rohan Sharma', avatar: 'RS', hp: 380, matches: 6, level: 5, topSkill: 'Python Automation' },
];

export default function MentorDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorRequests, setMentorRequests] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dateforcode_mentor_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      // Create a default profile to avoid blocking
      const defaultProf = {
        name: 'Dr. Aparna J.',
        title: 'Certified Principal Coach',
        avatar: 'AJ',
        skillsKnown: ['TypeScript', 'C++', 'Algorithms', 'System Design'],
        skillsGuide: ['Dynamic Programming', 'Multiplayer Sockets', 'Kernel Telemetries']
      };
      localStorage.setItem('dateforcode_mentor_profile', JSON.stringify(defaultProf));
      setProfile(defaultProf);
    }

    // Poll for incoming student stuck triggers
    const interval = setInterval(() => {
      const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
      setMentorRequests(reqs.filter((r: any) => r.status === 'pending'));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleRequestAction = (id: string, action: 'accepted' | 'declined') => {
    const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
    const updated = reqs.map((r: any) => r.id === id ? { ...r, status: action } : r);
    localStorage.setItem('dateforcode_mentor_requests', JSON.stringify(updated));
    if (action === 'accepted') {
      router.push('/mentor/live-session?req=' + id);
    }
  };

  const SIDEBAR_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Live Sessions', icon: Video },
    { label: 'Classes & Batches', icon: Calendar },
    { label: 'Challenges', icon: Swords },
    { label: 'Analytics & Reports', icon: TrendingUp },
    { label: 'Advanced Tools', icon: Target },
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center font-mono text-xs text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
          <p>ESTABLISHING ELITE MENTOR SECURE LINK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#08090C] text-[#F3F4F6] overflow-hidden font-sans">
      {/* ═══ ELITE ROYAL PURPLE SIDEBAR ═══ */}
      <motion.aside 
        initial={{ x: -280 }} 
        animate={{ x: 0 }} 
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }} 
        className="w-[280px] bg-[#0D0E12] border-r border-[#2A2E3D]/60 flex flex-col relative z-20 flex-shrink-0"
      >
        <div className="p-6 pb-6 flex flex-col gap-1 items-start">
          <Logo showText={true} className="scale-[0.8] origin-left" />
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6] text-[8px] font-mono uppercase font-bold tracking-widest mt-2 ml-1">
            <Award className="w-3 h-3 text-[#F59E0B]" /> CERTIFIED MENTOR
          </div>
        </div>

        {/* Navigation Sidebar Options */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto font-mono text-[11px]">
          {SIDEBAR_ITEMS.map((item, i) => {
            const isActive = activeTab === item.label;
            return (
              <button 
                key={item.label} 
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded text-left transition-all uppercase tracking-wider border ${
                  isActive 
                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)] font-bold' 
                    : 'text-gray-500 border-transparent hover:text-gray-300 hover:bg-[#15171F]/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-[#8B5CF6]' : 'text-gray-600'}`} />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 mt-auto">
          <div className="h-[1px] bg-[#2A2E3D]/50 mb-4" />
          <button 
            onClick={async () => { await signOut(auth); localStorage.clear(); router.push('/'); }} 
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-xs font-mono font-bold uppercase tracking-wider text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:text-red-500 transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout telemetry
          </button>
        </div>
      </motion.aside>

      {/* ═══ MAIN WORKSPACE VIEWPORT ═══ */}
      <div className="flex-1 overflow-y-auto relative z-10 flex flex-col min-h-screen">
        
        {/* Workspace Top Header Bar */}
        <motion.header 
          {...fadeUp(0)} 
          className="sticky top-0 z-20 bg-[#08090C]/90 backdrop-blur-md border-b border-[#2A2E3D]/60 px-8 py-4 flex items-center justify-between flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-mono font-black uppercase text-white tracking-widest">{activeTab} //</h2>
            <span className="text-[9px] font-mono text-gray-600 uppercase">Principal diagnostics hub</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded bg-[#15171F] border border-[#2A2E3D] flex items-center justify-center hover:border-gray-500 transition-all relative">
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF3366] rounded-full animate-ping" />
            </button>
            <button className="w-9 h-9 rounded bg-[#15171F] border border-[#2A2E3D] flex items-center justify-center hover:border-gray-500 transition-all">
              <Settings className="w-4 h-4 text-gray-400" />
            </button>

            {/* Coach Profile Widget */}
            <div 
              onClick={() => setShowProfileModal(true)} 
              className="flex items-center gap-3 pl-4 border-l border-[#2A2E3D] cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="text-right font-mono">
                <p className="text-xs font-bold text-white">{profile.name}</p>
                <p className="text-[8px] font-bold text-[#8B5CF6] uppercase tracking-wider">{profile.title}</p>
              </div>
              <div className="w-9 h-9 rounded bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] border border-[#8B5CF6]/40 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#8B5CF6]/10">
                {profile.avatar}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Workspace Main Panels */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          
          {/* TAB: Dashboard */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Telemetry Alert: Incoming Student Requests */}
              <AnimatePresence>
                {mentorRequests.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="p-5 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-lg border border-[#8B5CF6]/40 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-[#8B5CF6]/15 gap-4 font-mono text-xs"
                  >
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-12 h-12 rounded bg-white/10 border border-white/20 flex items-center justify-center animate-pulse"><UserCheck className="w-6 h-6"/></div>
                      <div>
                        <h3 className="text-sm font-bold mb-0.5 uppercase tracking-wider">{mentorRequests.length} Student Stuck Signals Intercepted</h3>
                        <p className="text-[10px] text-purple-100 uppercase tracking-tight">Student {mentorRequests[0].studentName.toUpperCase()} requires active diagnostics support inside coding-room.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleRequestAction(mentorRequests[0].id, 'declined')} className="px-5 py-2.5 bg-[#0D0E12]/50 border border-white/10 text-white font-bold rounded uppercase hover:bg-[#0D0E12] transition-all">Decline</button>
                      <button onClick={() => handleRequestAction(mentorRequests[0].id, 'accepted')} className="px-5 py-2.5 bg-white text-[#8B5CF6] font-bold rounded uppercase hover:bg-purple-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)]">Accept & Connect</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Red Urgent Telemetry: Student Stuck Interventions */}
              <motion.div 
                {...fadeUp(0.1)} 
                className="p-5 bg-[#FF3366]/5 border border-[#FF3366]/40 rounded-lg flex items-center justify-between font-mono text-xs shadow-[0_0_15px_rgba(255,51,102,0.05)]"
              >
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded bg-[#FF3366]/10 border border-[#FF3366]/30 flex items-center justify-center text-[#FF3366] animate-pulse"><AlertCircle className="w-6 h-6"/></div>
                  <div>
                    <h3 className="text-sm font-bold mb-0.5 uppercase tracking-wider text-[#FF3366]">URGENT_INTERVENTIONS_REQUIRED</h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-tight">Active Peer Room #101 has dispatched a STUCK signal trigger (DP knapsack errors).</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('Live Sessions')} 
                  className="px-5 py-2.5 bg-[#FF3366] hover:bg-[#FF3366]/90 border border-[#FF3366] text-white font-bold rounded uppercase transition-all shadow-[0_0_15px_rgba(255,51,102,0.25)]"
                >
                  Join Code Session
                </button>
              </motion.div>

              {/* High Density Stats Indicators Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Cohort Students', val: '42', icon: Users, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20' },
                  { label: 'Rooms Monitored', val: '18', icon: Video, color: '#3B82F6', bg: 'bg-[#3B82F6]/5 border-[#3B82F6]/20' },
                  { label: 'Evaluations Completed', val: '156', icon: FileCheck, color: '#10B981', bg: 'bg-[#10B981]/5 border-[#10B981]/20' },
                  { label: 'Rating Diagnostic Score', val: '4.9', icon: Star, color: '#F59E0B', bg: 'bg-[#F59E0B]/5 border-[#F59E0B]/20' },
                ].map((s, i) => (
                  <motion.div 
                    key={s.label} 
                    {...fadeUp(0.15 + i * 0.05)} 
                    className={`p-5 rounded-lg border bg-[#15171F] flex flex-col justify-between font-mono relative overflow-hidden group`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">{s.label}</span>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-3xl font-black text-white">{s.val}</h4>
                      <span className="text-[7px] text-gray-600 uppercase font-bold tracking-widest mt-1">Ecosystem metrics active</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Central Core Diagnostic Hub & Active Rooms View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Column: Live Active Coding Sockets Viewport (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden flex-1 flex flex-col justify-between">
                    <div className="ide-panel-header w-full justify-between py-2.5 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80 px-4">
                      <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#8B5CF6]" /> ACTIVE_MULTIPLAYER_SOCKET_FEED
                      </span>
                      <button onClick={() => setActiveTab('Live Sessions')} className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#8B5CF6] hover:underline">View telemetry</button>
                    </div>

                    <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[300px] scrollbar-none font-mono text-xs">
                      {MOCK_LIVE_SESSIONS.map((session, i) => (
                        <div 
                          key={session.id} 
                          className={`p-4 rounded border flex items-center justify-between bg-[#0D0E12]/50 ${
                            session.status === 'help_requested' 
                              ? 'border-[#FF3366]/40 text-[#FF3366]' 
                              : 'border-[#2A2E3D]/50 text-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                              <div className="w-7 h-7 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center text-[9px] font-bold text-[#8B5CF6]">{session.avatar1}</div>
                              {session.avatar2 && <div className="w-7 h-7 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center text-[9px] font-bold text-[#3B82F6]">{session.avatar2}</div>}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-white uppercase">{session.students}</p>
                              <p className="text-[8px] text-gray-500 uppercase mt-0.5 h-4 overflow-hidden">{session.topic}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-bold px-2 py-0.5 rounded border border-[#2A2E3D] bg-[#15171F] text-gray-500">{session.stack.toUpperCase()}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              session.status === 'help_requested' 
                                ? 'bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20' 
                                : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                            }`}>
                              {session.status === 'help_requested' ? 'STUCK ALERT' : 'ACTIVE CO-OP'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Programming / Graph Diagnostics Chart Widget (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden flex-1 flex flex-col justify-between p-5 space-y-4 font-mono">
                    <div className="space-y-1">
                      <span className="text-[8px] text-gray-500 uppercase tracking-widest">// COHORT_WEAK_SPOTS</span>
                      <h3 className="text-xs font-bold text-white uppercase">Weak-Skill Diagnostics</h3>
                      <p className="text-[10px] text-gray-400 leading-relaxed bg-[#0D0E12]/50 p-3 border border-[#2A2E3D] rounded mt-2">
                        AI compilation signals show <strong>35% failure quotient</strong> inside arrays recursive bounds.
                      </p>
                    </div>

                    {/* Interactive diagnostics progress bars */}
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Dynamic Programming</span>
                          <span className="text-[#FF3366] font-bold">35% Failure</span>
                        </div>
                        <div className="h-1 bg-[#0D0E12] rounded overflow-hidden">
                          <div className="h-full bg-[#FF3366]" style={{ width: '35%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Graph Traversals (BFS/DFS)</span>
                          <span className="text-[#F59E0B] font-bold">22% Failure</span>
                        </div>
                        <div className="h-1 bg-[#0D0E12] rounded overflow-hidden">
                          <div className="h-full bg-[#F59E0B]" style={{ width: '22%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-gray-400">Recursion Stack Overflows</span>
                          <span className="text-[#8B5CF6] font-bold">18% Failure</span>
                        </div>
                        <div className="h-1 bg-[#0D0E12] rounded overflow-hidden">
                          <div className="h-full bg-[#8B5CF6]" style={{ width: '18%' }} />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('Advanced Tools')} 
                      className="w-full py-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 border border-[#8B5CF6] text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    >
                      Audit cohort telemetry
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB: Live Sessions */}
          {activeTab === 'Live Sessions' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4">
              <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#2A2E3D]/50 pb-4">
                  <div className="font-mono text-xs text-left">
                    <h2 className="text-sm font-bold text-white uppercase">Live Telemetry Channels</h2>
                    <p className="text-[10px] text-gray-500 uppercase mt-0.5">Audit student compiler screens and inject live voice guidance.</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] font-mono text-[9px] font-bold uppercase tracking-widest animate-pulse">
                    {MOCK_LIVE_SESSIONS.length} Active channels
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {MOCK_LIVE_SESSIONS.map((session, i) => (
                    <div 
                      key={session.id} 
                      className={`p-5 rounded border bg-[#0D0E12] ${
                        session.status === 'help_requested' 
                          ? 'border-[#FF3366]/40 text-[#FF3366]' 
                          : 'border-[#2A2E3D]/40 text-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center text-[10px] font-bold text-[#8B5CF6]">{session.avatar1}</div>
                            {session.avatar2 && <div className="w-8 h-8 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center text-[10px] font-bold text-[#3B82F6]">{session.avatar2}</div>}
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-white uppercase">{session.students}</h4>
                            <p className="text-[8px] text-gray-500 uppercase mt-0.5">{session.topic}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          session.status === 'help_requested' 
                            ? 'bg-[#FF3366] text-white animate-pulse' 
                            : 'bg-[#15171F] border border-[#2A2E3D] text-gray-500'
                        }`}>
                          {session.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#2A2E3D]/40 pt-4 mt-2">
                        <div className="flex gap-2">
                          <span className="text-[8px] bg-[#15171F] border border-[#2A2E3D] px-2 py-0.5 rounded text-gray-400 uppercase font-bold">{session.stack}</span>
                          <span className="text-[8px] bg-[#15171F] border border-[#2A2E3D] px-2 py-0.5 rounded text-gray-400 uppercase font-bold">{session.time}</span>
                        </div>
                        <button className="px-3.5 py-1.5 rounded bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 border border-[#8B5CF6] text-white text-[9px] font-bold uppercase transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                          Connect Screen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: Classes & Batches */}
          {activeTab === 'Classes & Batches' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-xs text-left">
                  <h2 className="text-sm font-bold text-white uppercase">Group Telemetry Lectures</h2>
                  <p className="text-[10px] text-gray-500 uppercase mt-0.5">Configure group schedules and batch telemetry viewports.</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8B5CF6] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded border border-[#8B5CF6] hover:bg-[#8B5CF6]/90 shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                  <Plus className="w-3.5 h-3.5"/> Schedule Class
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                {[
                  { title: 'System Design Fundamentals', date: 'TODAY', time: '4:00 PM', students: 24, type: 'Live Class', color: 'text-[#3B82F6]', bg: 'border-[#3B82F6]/30' },
                  { title: 'React Hooks Deep Dive', date: 'TOMORROW', time: '10:00 AM', students: 15, type: 'Batch Session', color: 'text-[#FF3366]', bg: 'border-[#FF3366]/30' },
                  { title: 'DSA Mock Interviews', date: 'FRIDAY', time: '2:00 PM', students: 8, type: 'Interactive', color: 'text-[#F59E0B]', bg: 'border-[#F59E0B]/30' },
                ].map((c, i) => (
                  <div key={i} className={`bg-[#15171F] rounded border ${c.bg} p-5 flex flex-col justify-between h-[180px]`}>
                    <div>
                      <div className="flex justify-between items-center text-[8px] text-gray-500 uppercase font-bold">
                        <span>{c.type}</span>
                        <span>{c.students} active students</span>
                      </div>
                      <h3 className="text-xs font-bold text-white uppercase mt-3 h-10 overflow-hidden leading-relaxed">{c.title}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-[#2A2E3D]/50 pt-3">
                      <span className="text-[9px] font-bold text-[#8B5CF6]">{c.date} // {c.time}</span>
                      <span className="text-[8px] text-gray-500 hover:text-white cursor-pointer uppercase">Configure</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: Challenges */}
          {activeTab === 'Challenges' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="text-left">
                  <h2 className="text-sm font-bold text-white uppercase">Arena Coding Battles</h2>
                  <p className="text-[10px] text-gray-500 uppercase mt-0.5">Deploy customized coding tests and streaks to cohorts.</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8B5CF6] text-white text-[10px] font-bold uppercase rounded border border-[#8B5CF6] hover:bg-[#8B5CF6]/90 transition-all">
                  <Plus className="w-3.5 h-3.5"/> Create Challenge
                </button>
              </div>

              <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden p-6 space-y-4">
                {[
                  { title: 'Weekend Hackathon: API Builder', participants: 45, status: 'Active', difficulty: 'Hard' },
                  { title: 'Daily Byte: Array Manipulation', participants: 120, status: 'Completed', difficulty: 'Easy' },
                  { title: 'Algorithms Speed Run', participants: 0, status: 'Draft', difficulty: 'Medium' },
                ].map((ch, i) => (
                  <div key={i} className="p-4 rounded border border-[#2A2E3D]/50 bg-[#0D0E12]/50 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-9 h-9 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center text-gray-400"><Swords className="w-4 h-4"/></div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white uppercase">{ch.title}</h4>
                        <p className="text-[8px] text-gray-500 uppercase mt-0.5">{ch.participants} participants // {ch.difficulty}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      ch.status === 'Active' 
                        ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
                        : 'border-[#2A2E3D] text-gray-500 bg-[#15171F]'
                    }`}>{ch.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: Analytics & Reports */}
          {activeTab === 'Analytics & Reports' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="text-left">
                  <h2 className="text-sm font-bold text-white uppercase">Student Telemetry Logs</h2>
                  <p className="text-[10px] text-gray-500 uppercase mt-0.5">Track and analyze cohort test scores, compatibility and match histories.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600"/>
                  <input 
                    type="text" 
                    placeholder="QUERY STU_NODE_LOGS..." 
                    className="w-full pl-9 pr-4 py-2 rounded bg-[#15171F] border border-[#2A2E3D] text-[10px] text-white outline-none focus:border-[#8B5CF6] transition-all font-bold placeholder:text-gray-700"
                  />
                </div>
              </div>
              
              <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse font-mono text-[10px]">
                  <thead>
                    <tr className="bg-[#0D0E12] border-b border-[#2A2E3D]/50 text-gray-500 uppercase">
                      <th className="p-4 font-bold">STUDENT_NODE</th>
                      <th className="p-4 font-bold">LEVEL & TELEMETRY XP</th>
                      <th className="p-4 font-bold">DOMINANT_SKILL</th>
                      <th className="p-4 font-bold">PAIR_MATCHES</th>
                      <th className="p-4 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_STUDENTS.map(student => (
                      <tr key={student.id} className="border-b border-[#2A2E3D]/30 hover:bg-[#0D0E12]/30 text-gray-300">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-7 h-7 rounded border border-[#2A2E3D] bg-[#0D0E12] flex items-center justify-center text-[10px] font-bold text-white">{student.avatar}</div>
                          <span className="font-bold text-white uppercase">{student.name}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#8B5CF6] font-bold">LVL_{student.level}</span>
                            <span className="text-gray-500 font-bold">// {student.hp} HP</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded border border-[#2A2E3D] bg-[#0D0E12] text-[8px] font-bold text-gray-400 uppercase">{student.topSkill}</span>
                        </td>
                        <td className="p-4 font-bold">{student.matches} SESSIONS</td>
                        <td className="p-4 text-right">
                          <button className="text-[9px] font-bold text-[#8B5CF6] uppercase hover:underline">Diagnostic Report</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB: Advanced Tools */}
          {activeTab === 'Advanced Tools' && (
            <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-4">
                <div className="ide-panel bg-[#15171F] border-[#2A2E3D] p-6 rounded-lg space-y-4 text-left">
                  <div className="w-10 h-10 rounded border border-[#2A2E3D] bg-[#0D0E12] flex items-center justify-center text-[#8B5CF6]"><Target className="w-5 h-5"/></div>
                  <h3 className="text-sm font-bold text-white uppercase">Mock Placement Sandboxes</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase">// CONFIGURE STRICT SANDBOX TELEMETRIES THAT DISABLE AUTOMATED AI CODE COMPILERS AND DICTATE STRICT TIME BOUNDS TO MIMIC FAANG ASSESSMENTS.</p>
                  <button className="w-full py-2.5 rounded bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-bold uppercase transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    Launch FAANG Sandbox Mode
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="ide-panel bg-[#15171F] border-[#2A2E3D] p-6 rounded-lg space-y-4 text-left">
                  <div className="w-10 h-10 rounded border border-[#2A2E3D] bg-[#0D0E12] flex items-center justify-center text-[#F59E0B]"><MessageSquare className="w-5 h-5"/></div>
                  <h3 className="text-sm font-bold text-white uppercase">Broadcast Cohort Announcement</h3>
                  <p className="text-[10px] text-gray-500 leading-relaxed uppercase">// COMPILE AND SEND A LIVE PUSH TELEMETRY UPDATE BROADCAST TO ALL ONLINE STUDENT DASHBOARDS UNDER GUIDANCE LINK.</p>
                  
                  <div className="space-y-3 pt-2">
                    <input 
                      type="text" 
                      placeholder="BROADCAST MESSAGE ANNOUNCEMENT..." 
                      className="w-full px-4 py-2.5 rounded bg-[#0D0E12] border border-[#2A2E3D] text-[10px] text-white outline-none focus:border-[#8B5CF6] placeholder:text-gray-700 font-bold"
                    />
                    <button className="w-full py-2.5 rounded bg-white hover:bg-gray-200 text-black font-bold uppercase transition-all">
                      Transmit Broadcast Signal
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Certified Mentor Profile dialog overlay */}
      <AnimatePresence>
        {showProfileModal && profile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#08090C]/80 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
              <div className="bg-[#15171F] border border-[#2A2E3D] rounded-lg shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden font-mono text-xs">
                <div className="h-24 bg-gradient-to-r from-[#8B5CF6] to-[#FF3366] relative opacity-[0.8]">
                  <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 w-7 h-7 rounded border border-white/20 bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"><X className="w-4 h-4"/></button>
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 rounded bg-[#0D0E12] border border-[#2A2E3D] flex items-center justify-center text-3xl -mt-10 mb-4 shadow-xl">{profile.avatar}</div>
                  <h2 className="text-sm font-bold text-white uppercase">{profile.name}</h2>
                  <p className="text-[9px] font-bold text-[#8B5CF6] uppercase tracking-widest mt-0.5">{profile.title}</p>
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-2">// CAPABILITY MATRIX</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillsKnown?.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 rounded bg-[#0D0E12] text-[9px] font-bold text-gray-400 border border-[#2A2E3D] uppercase">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] text-gray-500 uppercase tracking-wider mb-2">// ACTIVE GUIDANCE FIELDS</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillsGuide?.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 rounded bg-[#8B5CF6]/10 text-[9px] font-bold text-[#8B5CF6] border border-[#8B5CF6]/30 uppercase">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-2.5">
                    <button onClick={() => { setShowProfileModal(false); router.push('/mentor/settings'); }} className="w-full py-2.5 rounded border border-[#2A2E3D] hover:border-gray-500 bg-[#0D0E12] text-gray-500 hover:text-white uppercase transition-all">
                      Configure profile parameters
                    </button>
                    <button onClick={async () => { await signOut(auth); localStorage.clear(); router.push('/'); }} className="w-full py-2.5 rounded bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 text-red-400 hover:text-red-300 uppercase transition-all">
                      Terminate session links
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
