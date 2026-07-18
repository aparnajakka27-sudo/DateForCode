"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Target, Users, Code, Gamepad2, Trophy, Bell, Settings, 
  ChevronRight, ChevronLeft, Zap, Flame, ArrowRight, CheckCircle2, Circle, Lock,
  TrendingUp, Calendar, Heart, LogOut, X, GitBranch, Swords, BookOpen, GraduationCap, Briefcase, Diamond, Terminal as TerminalIcon
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import PortalSidebar from '@/components/PortalSidebar';
import ThemeToggle from '@/components/ThemeToggle';
import ThunderEffect from '@/components/ThunderEffect';
import { useUser } from '@/context/UserContext';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 20, scale: 0.98 }, 
  animate: { opacity: 1, y: 0, scale: 1 }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

const SKILLS_COLORS: Record<string,string> = {
  'JavaScript':'#D97706','TypeScript':'#3178C6','Python':'#3776AB','React':'#61DAFB',
  'Next.js':'#6366F1','Node.js':'#10B981','Java':'#ED8B00','C++':'#00599C',
  'HTML/CSS':'#E34F26','MongoDB':'#47A248','SQL':'#4479A1','Git':'#F05032',
  'Docker':'#2496ED','AWS':'#FF9900','Flutter':'#02569B','Rust':'#CE422B',
  'Go':'#00ADD8','Swift':'#FA7343',
};

export default function StudentDashboard() {
  const router = useRouter();
  const { user, profile, loading: isAuthLoading } = useUser();
  const [progress, setProgress] = useState({skillDone:false,matchDone:false,codeDone:false,hp:0,streak:0,matches:0,sessions:0,lastDate:''});
  const [showProfile, setShowProfile] = useState(false);
  const [lockModal, setLockModal] = useState<{show:boolean,title:string,msg:string,action?:string,href?:string}>({show:false,title:'',msg:''});
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Firestore Real-Time Data Integration
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to progress
    const unsubProg = onSnapshot(doc(db, 'users', user.uid, 'progress', 'main'), (docSnap) => {
      if (docSnap.exists()) {
        const p = docSnap.data() as any;
        setProgress({
          skillDone: !!p.skillDone,
          matchDone: !!p.matchDone,
          codeDone: !!p.codeDone,
          hp: p.hp || 0,
          streak: p.streak || 0,
          matches: p.matches || 0,
          sessions: p.sessions || 0,
          lastDate: p.lastDate || ''
        });
      }
    });

    try { const n = JSON.parse(localStorage.getItem('dateforcode_notifications')||'[]'); setNotifications(n); } catch(_){}

    return () => {
      unsubProg();
    };
  }, [user]);

  // Auth state and loading handled by layout

  const SIDEBAR_ITEMS = [
    { label:'Dashboard', icon:LayoutDashboard, href:'/student/dashboard', active:true },
    { label:'Skill Assessment', icon:Target, href:'/student/skill-assessment' },
    { label:'Matching', icon:Users, href:progress.skillDone?'/student/matching-room':'#', locked:!progress.skillDone },
    { label:'Coding Room', icon:Code, href:progress.matchDone?'/student/coding-room':'#', locked:!progress.matchDone },
    { label:'Gamification', icon:Gamepad2, href:'/student/gamification' },
    { label:'Challenges', icon:Zap, href:'/student/challenges' },
    { label:'Playground', icon:TerminalIcon, href:'/student/playground' },
    { label:'Leaderboard', icon:Trophy, href:'/student/leaderboard' },
    { label:'Mentor Guidance', icon:GraduationCap, href:'/student/mentor-guidance' },
  ];

  const MATCHING_STEPS = [
    { step:1, title:'Skill Assessment', desc:'Test your coding telemetry across multiple domains to find your true synergy level.', icon:Target, status:progress.skillDone?'done':'ready' as string, color:'#FF3366', href:'/student/skill-assessment' },
    { step:2, title:'Matching Room', desc:'Pair with a high-synergy programming node based on scheduled overlaps and skills.', icon:Users, status:progress.matchDone?'done':progress.skillDone?'ready':'locked' as string, color:'#3B82F6', href:'/student/matching-room' },
    { step:3, title:'Coding Room', desc:'Acquire driver/navigator key ownership and initiate collaborative live compilation.', icon:Code, status:progress.codeDone?'done':progress.matchDone?'ready':'locked' as string, color:'#10B981', href:'/student/coding-room' },
  ];

  // Legacy migration map to convert old dicebear avatars to new 3D avatars
  const LEGACY_AVATAR_MAP: Record<string, string> = {
    ninja: 'kai', astro: 'leo', pixel: 'maya', cyber: 'luna', nova: 'kai', ghost: 'leo'
  };

  const AVATAR_MAP: Record<string, string> = {
    kai: '/avatars/kai.png',
    leo: '/avatars/leo.png',
    maya: '/avatars/maya.png',
    luna: '/avatars/luna.png',
    jax: '/avatars/jax.png',
    zara: '/avatars/zara.png',
    finn: '/avatars/finn.png',
    nova: '/avatars/nova.png',
    remy: '/avatars/remy.png',
    cleo: '/avatars/cleo.png',
  };

  const currentAvatarId = profile?.avatar ? (LEGACY_AVATAR_MAP[profile.avatar] || profile.avatar) : 'kai';
  const avatarImg = AVATAR_MAP[currentAvatarId] || AVATAR_MAP['kai'];

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans noise-bg">
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0 developer-grid" />
      <ThunderEffect />

      <PortalSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        items={SIDEBAR_ITEMS.map((item) => ({
          ...item,
          onClick: (e) => {
            if ((item as any).locked) {
              e.preventDefault();
              if (item.label === 'Matching') {
                setLockModal({
                  show: true,
                  title: 'MODULE LOCKED: MATCHING',
                  msg: 'You must successfully pass a Core Skill Assessment before entering the Matching Arena. This preserves system pairing synergy.',
                  action: 'INITIATE ASSESSMENT',
                  href: '/student/skill-assessment'
                });
              } else if (item.label === 'Coding Room') {
                setLockModal({
                  show: true,
                  title: 'MODULE LOCKED: CODING_ROOM',
                  msg: 'No active pair connection. You must secure a partner node in the Matching Room before opening a live collaborative IDE session.',
                  action: 'OPEN MATCHING ROOM',
                  href: '/student/matching-room'
                });
              }
            }
          }
        }))}
        headerBadge={
          <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-muted)] px-3">system modules</p>
        }
        bottomActions={
          <>
            <Link 
              href="/mentor/dashboard" 
              className={`flex items-center gap-3 px-3 py-3 rounded bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold font-mono transition-all duration-300 shadow-lg shadow-purple-900/25 hover:shadow-purple-700/40 group ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                <span className="truncate text-[11px] uppercase tracking-wider font-bold">MENTOR CONSOLE</span>
              </div>
            </Link>

            <div className="h-[1px] bg-[var(--ide-border)] my-2 w-full" />
            
            <button 
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                await signOut(auth);
                localStorage.clear();
                router.push('/login');
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded text-[11px] font-mono font-bold text-red-400 hover:text-red-500 bg-red-950/10 hover:bg-red-950/20 border border-red-900/25 transition-all duration-300 group ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                <span className="truncate text-left block w-full uppercase tracking-widest font-bold">EXIT NODE</span>
              </div>
            </button>
          </>
        }
      />

      {/* Main Content Wrapper */}
      <div className={`flex-1 min-h-screen relative z-10 transition-all duration-500 ${isSidebarOpen ? 'ml-64' : 'ml-[88px]'}`}>
        
        {/* Sticky Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.5 }} 
          className="sticky top-0 z-40 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-8 py-4.5 flex items-center justify-between shadow-sm"
        >
          <div />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#FF3366] font-mono absolute left-1/2 -translate-x-1/2 drop-shadow-[0_0_10px_rgba(255,51,102,0.2)]">
            FROM_HELLO_WORLD_TO_WORLD_CLASS
          </p>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)} 
                className="w-9 h-9 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] flex items-center justify-center hover:border-accent-pink transition-colors relative"
              >
                <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
                {notifications.filter(n=>n.status==='pending').length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF3366] text-white text-[8px] font-bold flex items-center justify-center shadow-lg">
                    {notifications.filter(n=>n.status==='pending').length}
                  </span>
                )}
              </button>

              {/* Notifications Panel */}
              <AnimatePresence>
                {showNotifs && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 15, scale: 0.95 }} 
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-12 w-80 bg-[var(--ide-bg)] rounded border border-[var(--ide-border)] shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-[var(--ide-border)] flex items-center justify-between bg-[var(--ide-header-bg)]">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">INCOMING SYSTEM LOGS</span>
                      <button onClick={() => setShowNotifs(false)} className="hover:rotate-90 transition-transform">
                        <X className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto font-mono text-[11px] bg-[var(--ide-header-bg)]/50">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center"><p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">NO ACTIVE SIGNALS</p></div>
                      ) : notifications.map((n:any, i:number) => (
                        <div key={n.id||i} className="px-4 py-3 border-b border-[var(--ide-border)]/50 hover:bg-[var(--ide-bg)]/40 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded border border-accent-pink/30 bg-accent-pink/5 flex items-center justify-center shrink-0">
                              <Users className="w-3.5 h-3.5 text-accent-pink"/>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[var(--text-primary)] truncate">MATCH_REQUEST: <span className="text-[#FF3366]">@{n.from}</span></p>
                              <p className="text-[9px] text-[var(--text-muted)] uppercase mt-0.5 tracking-wider">COMPATIBILITY RESOLVED</p>
                            </div>
                          </div>
                          {n.status==='pending' ? (
                            <div className="flex gap-2 mt-2.5 ml-10">
                              <button 
                                onClick={() => { 
                                  const updated = notifications.map((x:any)=>x.id===n.id?{...x,status:'accepted'}:x); 
                                  setNotifications(updated); 
                                  localStorage.setItem('dateforcode_notifications',JSON.stringify(updated)); 
                                  router.push('/student/challenges'); 
                                }}
                                className="px-3 py-1 rounded bg-[#FF3366] text-white text-[9px] font-bold uppercase transition-all hover:bg-accent-pink-hover"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => { 
                                  const updated = notifications.map((x:any)=>x.id===n.id?{...x,status:'declined'}:x); 
                                  setNotifications(updated); 
                                  localStorage.setItem('dateforcode_notifications',JSON.stringify(updated)); 
                                  
                                }}
                                className="px-3 py-1 rounded border border-[var(--ide-border)] text-[var(--text-secondary)] text-[9px] font-bold uppercase hover:bg-white/[0.03]"
                              >
                                Decline
                              </button>
                            </div>
                          ) : (
                            <p className={`text-[10px] font-bold mt-1.5 ml-10 ${n.status==='accepted'?'text-[#10B981]':'text-[var(--text-muted)]'}`}>
                              {n.status==='accepted'?'// REQUEST_ACCEPTED':'// REQUEST_DECLINED'}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <button 
              onClick={() => router.push('/student/settings')} 
              className="w-9 h-9 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] flex items-center justify-center hover:border-accent-pink transition-colors"
            >
              <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            
            <button 
              onClick={() => setShowProfile(true)} 
              className="flex items-center gap-3 pl-3 border-l border-[var(--ide-border)] hover:opacity-80 transition-opacity"
            >
              <div className="text-right">
                <p className="text-xs font-mono font-bold text-[var(--text-primary)]">@{profile?.username || 'user'}</p>
                <p className="text-[9px] font-mono text-[#FF3366] font-bold uppercase tracking-widest">LEVEL 01 // CRITICAL</p>
              </div>
              <div className="w-9 h-9 rounded overflow-hidden border border-accent-pink/30 bg-[var(--ide-bg)] p-0.5">
                <img src={avatarImg} alt="avatar" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="p-8 pb-20 max-w-7xl mx-auto space-y-12 relative">
          
          {/* Matching Steps Flow */}
          <motion.div {...fadeUp(0.1)} className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded bg-[#FF3366]" />
              <h2 className="text-sm font-bold font-mono tracking-widest uppercase text-[var(--text-primary)]">MATCHING PROTOCOL JOURNEY</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {MATCHING_STEPS.map((s, i) => (
                <motion.div 
                  key={s.step} 
                  {...fadeUp(0.2+i*0.1)} 
                  className="glass-panel relative overflow-hidden rounded-lg"
                >
                  {/* Top colored indicator bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[2px]" 
                    style={{ background: s.status==='ready' ? s.color : '#1E2333' }} 
                  />
                  
                  {/* IDE-style panel header */}
                  <div className="ide-panel-header justify-between py-2 border-b border-[var(--ide-border)]/40 bg-[var(--ide-header-bg)]/50">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider">STEP_0{s.step}_THREAD</span>
                    {s.status==='ready' ? (
                      <span className="text-[8px] font-mono text-accent-pink animate-pulse font-bold tracking-widest">// READY</span>
                    ) : s.status==='done' ? (
                      <span className="text-[8px] font-mono text-accent-green font-bold tracking-widest">// COMPILED</span>
                    ) : (
                      <span className="text-[8px] font-mono text-[var(--text-muted)] font-bold tracking-widest">// LOCKED</span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded border flex items-center justify-center shrink-0"
                        style={{
                          color: s.status==='ready' ? s.color : '#4B5563',
                          borderColor: s.status==='ready' ? `${s.color}30` : '#1E2333',
                          backgroundColor: s.status==='ready' ? `${s.color}05` : '#08090C',
                        }}
                      >
                        <s.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold font-mono text-[var(--text-primary)] text-sm uppercase tracking-wider">{s.title}</h3>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">telemetry node 0{s.step}</span>
                      </div>
                    </div>

                    <p className="text-[var(--text-secondary)] text-xs font-sans leading-relaxed h-12">
                      {s.desc}
                    </p>

                    {s.status==='ready' && (
                      <button 
                        onClick={() => router.push(s.href || '/student/skill-assessment')}
                        className="btn-premium w-full py-2.5 text-xs flex items-center justify-center gap-2"
                      >
                        <span>EXECUTE MODULE</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                    
                    {s.status==='done' && (
                      <div className="w-full py-2.5 border border-[#10B981]/20 bg-[#10B981]/5 text-[#10B981] text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-md">
                        <CheckCircle2 className="w-3.5 h-3.5"/>SYSTEM COMPILED
                      </div>
                    )}
                    
                    {s.status==='locked' && (
                      <button 
                        onClick={() => {
                          if (s.step === 2) {
                            setLockModal({
                              show: true,
                              title: 'MODULE LOCKED: MATCHING',
                              msg: 'You must successfully pass a Core Skill Assessment before entering the Matching Arena.',
                              action: 'INITIATE ASSESSMENT',
                              href: '/student/skill-assessment'
                            });
                          } else if (s.step === 3) {
                            setLockModal({
                              show: true,
                              title: 'MODULE LOCKED: CODING_ROOM',
                              msg: 'No active pair connection. You must secure a partner node in the Matching Room before opening a live collaborative IDE session.',
                              action: 'OPEN MATCHING ROOM',
                              href: '/student/matching-room'
                            });
                          }
                        }}
                        className="w-full py-2.5 bg-[var(--background)] border border-[var(--ide-border)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-gray-500 transition-colors text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-md"
                      >
                        <Lock className="w-3.5 h-3.5"/> LOCKED PROTOCOL
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Premium Stats Row */}
          <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label:'XP Score (Honor Points)', value:progress.hp, icon:Zap, color:'#FF3366', suffix:' HP', details:'COLLECTIVE LEVEL' },
              { label:'Consecutive Days Streak', value:progress.streak, icon:Flame, color:'#F59E0B', suffix:' days', details:'SYSTEM STREAK' },
              { label:'Secured Matches', value:progress.matches, icon:Heart, color:'#3B82F6', suffix:'', details:'STABLE SYNERGIES' },
              { label:'IDE Coding Sessions', value:progress.sessions, icon:Code, color:'#8B5CF6', suffix:'', details:'MODULE RUNS' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label} 
                {...fadeUp(0.35+i*0.1)} 
                className="group glass-panel glass-panel-interactive p-6 rounded-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                  <div 
                    className="w-12 h-12 rounded border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12"
                    style={{ color: stat.color, borderColor: `${stat.color}25`, backgroundColor: `${stat.color}03` }}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest block mb-0.5">{stat.details}</span>
                    <p className="text-2xl font-mono font-bold text-[var(--text-primary)] leading-none">
                      {stat.value}
                      <span className="text-xs font-bold text-[var(--text-muted)] ml-1 font-mono uppercase">{stat.suffix}</span>
                    </p>
                    <span className="text-[9px] font-mono text-[var(--text-muted)] block mt-1.5 uppercase font-bold tracking-tight">{stat.label.split(' (')[0]}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Two Column: Activity + Skill Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Weekly Activity */}
            <motion.div 
              {...fadeUp(0.4)} 
              className="lg:col-span-7 glass-panel rounded-lg overflow-hidden"
            >
              <div className="ide-panel-header justify-between py-2.5 border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-accent-pink" />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">activity_frequency_telemetry.log</span>
                </div>
                <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold">INTERVAL: 7 DAYS</span>
              </div>

              <div className="p-8 space-y-6 bg-[var(--ide-header-bg)]/30">
                <div className="flex items-end gap-5 h-44 border-b border-[var(--ide-border)]/50 pb-2">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                    const todayIdx = new Date().getDay();
                    const adjustedIdx = todayIdx === 0 ? 6 : todayIdx - 1;
                    const hasSession = progress.sessions > 0;
                    const heights = [0,0,0,0,0,0,0];
                    
                    if (hasSession && i === adjustedIdx) { 
                      heights[i] = Math.min(90, 30 + progress.sessions * 15); 
                    }
                    if (progress.streak > 1 && adjustedIdx > 0) { 
                      const streakBars = [25,40,55,35,50,45]; 
                      for(let j=Math.max(0,adjustedIdx-progress.streak+1); j<adjustedIdx; j++) {
                        heights[j] = streakBars[j%6]; 
                      }
                    }

                    return (
                      <div key={day} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end group">
                        <motion.div
                          initial={{ height: 0 }} 
                          animate={{ height: `${heights[i] || 8}%` }}
                          transition={{ duration: 0.8, delay: 0.5+i*0.08 }}
                          className="w-full rounded-sm relative overflow-hidden transition-all"
                          style={{ 
                            background: heights[i] > 0 ? 'linear-gradient(to top, #FF3366, #FF4D6D)' : 'var(--ide-border)',
                            boxShadow: heights[i] > 0 ? '0 0 10px rgba(255,51,102,0.15)' : 'none'
                          }}
                        >
                          {heights[i] > 0 && (
                            <div className="absolute inset-0 bg-[var(--btn-sec-bg)] translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                          )}
                        </motion.div>
                        <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${i===adjustedIdx ? 'text-[#FF3366]' : 'text-[var(--text-muted)]'}`}>
                          {day}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-[10px] font-mono text-[var(--text-muted)] flex justify-between uppercase">
                  <span>// ACTIVE COMPILATION TELEMETRY GRAPH</span>
                  <span className="text-[#FF3366] font-bold">XP Velocity active</span>
                </div>
              </div>
            </motion.div>

            {/* Skill Progress Bar */}
            <motion.div 
              {...fadeUp(0.5)} 
              className="lg:col-span-5 glass-panel rounded-lg overflow-hidden"
            >
              <div className="ide-panel-header justify-between py-2.5 border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-accent-blue" />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">skills_telemetry_density.yaml</span>
                </div>
                <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold">TELEMETRY</span>
              </div>

              <div className="p-8 space-y-6 bg-[var(--ide-header-bg)]/30">
                {(profile?.skills || ['JavaScript','Python','React']).slice(0, 4).map((skill, i) => {
                  const pct = progress.sessions > 0 ? Math.min(100, progress.sessions * 8) : 25;
                  const color = SKILLS_COLORS[skill] || '#FF3366';
                  return (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-[var(--text-primary)] uppercase tracking-wider font-bold">{skill}</span>
                        <span className="text-[var(--text-secondary)] font-bold">{pct}% MATCH LEVEL</span>
                      </div>
                      <div className="h-2 bg-[var(--background)] rounded-sm overflow-hidden border border-[var(--ide-border)]/50 p-[1px]">
                        <motion.div
                          initial={{ width: 0 }} 
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.6+i*0.1 }}
                          className="h-full rounded-sm"
                          style={{ 
                            background: color,
                            boxShadow: `0 0 10px ${color}30` 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

          </div>

          {/* Achievements Row */}
          <motion.div 
            {...fadeUp(0.6)} 
            className="glass-panel rounded-lg overflow-hidden"
          >
            <div className="ide-panel-header justify-between py-2.5 border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-accent-gold" />
                <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">achievements_system_registry.bin</span>
              </div>
              <span className="text-[9px] font-mono text-[#F59E0B] px-2 py-0.5 rounded bg-accent-gold/10 border border-accent-gold/20 uppercase tracking-widest font-bold">
                {[progress.matchDone,progress.streak>=3,progress.codeDone,progress.matchDone,progress.hp>=50,progress.hp>=100].filter(Boolean).length} / 6 VERIFIED
              </span>
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-6 gap-6 bg-[var(--ide-header-bg)]/30">
              {[
                { icon: Target, name: 'First Match', locked: !progress.matchDone },
                { icon: Flame, name: '3 Day Streak', locked: progress.streak < 3 },
                { icon: Zap, name: 'Speed Coder', locked: !progress.codeDone },
                { icon: Users, name: 'Team Player', locked: !progress.matchDone },
                { icon: Trophy, name: '50 HP', locked: progress.hp < 50 },
                { icon: Diamond, name: '100 HP', locked: progress.hp < 100 },
              ].map((ach, i) => (
                <div 
                  key={ach.name}
                  className={`flex flex-col items-center gap-3 p-5 rounded border transition-all duration-300 relative ${
                    ach.locked 
                      ? 'border-[var(--ide-border)] opacity-35 bg-[var(--background)] grayscale' 
                      : 'border-accent-gold/30 bg-[#F59E0B]/5 shadow-lg shadow-accent-gold/5'
                  }`}
                >
                  <ach.icon className={`w-8 h-8 ${ach.locked ? 'text-[var(--text-muted)]' : 'text-[#F59E0B]'}`} />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] text-center z-10">
                    {ach.name}
                  </span>
                  {!ach.locked && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Explore & Build */}
          <motion.div {...fadeUp(0.7)} className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded bg-[#10B981]" />
              <h2 className="text-sm font-bold font-mono tracking-widest uppercase text-[var(--text-primary)]">ARENA OPERATIONS MODULES</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Play Games', desc: 'Engage in live multiplayer developer sandbox puzzles. Boost streak indexes and Honor points.', icon: Gamepad2, color: '#8B5CF6', bg: 'from-[#8B5CF6]/20 to-transparent', href: '/student/gamification' },
                { title: 'Coding Challenges', desc: 'Secure timed high-contrast battles. Test architecture speed and refactor efficiency.', icon: Swords, color: '#F59E0B', bg: 'from-[#F59E0B]/20 to-transparent', href: '/student/challenges' },
                { title: 'Mentor Guidance', desc: 'Deploy sticking modules onto live auditor boards. Acquire certified expert code interventions.', icon: BookOpen, color: '#3B82F6', bg: 'from-[#3B82F6]/20 to-transparent', href: '/student/mentor-guidance' },
                { title: 'Push to GitHub', desc: 'Directly establish git registries. Synthesize clean branch telemetry and ship real modules.', icon: GitBranch, color: '#10B981', bg: 'from-[#10B981]/20 to-transparent', href: '#' },
              ].map((card, i) => (
                <div 
                  key={card.title}
                  onClick={() => { if (card.href !== '#') router.push(card.href); }}
                  className="group glass-panel glass-panel-interactive p-6 rounded-lg relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-0 left-0 w-[4px] h-full" style={{ backgroundColor: card.color }} />
                  <div className="flex items-start gap-5">
                    <div 
                      className="w-12 h-12 rounded border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
                      style={{ color: card.color, borderColor: `${card.color}35`, backgroundColor: `${card.color}05` }}
                    >
                      <card.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="font-bold font-mono text-[var(--text-primary)] text-sm uppercase tracking-wider">{card.title}</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-sans leading-relaxed">{card.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-accent-pink transition-colors mt-3" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>

      {/* Profile Overlay Slide Panel */}
      <AnimatePresence>
        {showProfile && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" 
              onClick={() => setShowProfile(false)} 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 30, stiffness: 200 }} 
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--ide-bg)] border-l border-[var(--ide-border)] z-[101] overflow-y-auto"
            >
              <div className="p-8 space-y-8 h-full flex flex-col">
                <div className="flex justify-between items-center pb-4 border-b border-[var(--ide-border)]">
                  <span className="text-[10px] font-mono text-accent-pink uppercase font-bold tracking-widest">// NODE DETAILS</span>
                  <button onClick={() => setShowProfile(false)} className="w-8 h-8 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center hover:border-accent-pink transition-colors">
                    <X className="w-4 h-4 text-[var(--text-secondary)] hover:text-accent-pink" />
                  </button>
                </div>

                {/* Avatar info */}
                <div className="text-center space-y-4 py-4">
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="w-full h-full rounded border-2 border-[#FF3366] bg-[var(--ide-bg)] p-1.5 overflow-hidden">
                      <img src={avatarImg} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent-green border border-black shadow-[0_0_10px_#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-mono text-[var(--text-primary)]">@{profile?.username || 'user'}</h3>
                    <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest mt-1">LEVEL 01 ACCESS THREAD</p>
                  </div>
                  {profile?.bio && (
                    <p className="text-[var(--text-secondary)] text-xs font-mono leading-relaxed max-w-xs mx-auto border border-[var(--ide-border)]/50 bg-[var(--ide-bg)]/50 p-3 rounded">
                      {profile.bio}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Honor Score', val: `${progress.hp} HP`, icon: Zap, color: '#FF3366' },
                    { label: 'Active Streak', val: `${progress.streak} days`, icon: Flame, color: '#F59E0B' },
                    { label: 'Match Nodes', val: `${progress.matches}`, icon: Heart, color: '#3B82F6' },
                    { label: 'IDE Compiles', val: `${progress.sessions}`, icon: Code, color: '#8B5CF6' }
                  ].map((s) => (
                    <div key={s.label} className="p-4 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)]">
                      <s.icon className="w-5 h-5 mb-2" style={{ color: s.color }} />
                      <p className="text-lg font-mono font-bold text-[var(--text-primary)]">{s.val}</p>
                      <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-wider block">STACK REGISTRY</span>
                  <div className="flex flex-wrap gap-2">
                    {(profile?.skills || []).map((s) => (
                      <span 
                        key={s} 
                        className="px-2.5 py-1 text-[10px] font-mono font-bold rounded border" 
                        style={{ 
                          backgroundColor: `${SKILLS_COLORS[s]||'#FF3366'}10`, 
                          color: SKILLS_COLORS[s]||'#FF3366',
                          borderColor: `${SKILLS_COLORS[s]||'#FF3366'}30` 
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 mt-auto">
                  <button 
                    onClick={() => { setShowProfile(false); router.push('/student/settings?tab=edit-profile'); }}
                    className="w-full py-3 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] text-xs font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-accent-pink hover:border-accent-pink transition-colors text-center"
                  >
                    Edit Profile Node
                  </button>
                  <button 
                    onClick={async () => { 
                      await fetch('/api/auth/logout', { method: 'POST' });
                      await signOut(auth); 
                      localStorage.clear(); 
                      router.push('/login'); 
                    }}
                    className="w-full py-3 rounded bg-red-950/20 border border-red-900/30 text-xs font-mono font-bold uppercase tracking-widest text-red-400 hover:text-red-500 hover:bg-red-950/40 transition-colors text-center"
                  >
                    DISCONNECT NODE
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Lock Modal */}
      <AnimatePresence>
        {lockModal.show && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-black/80 z-[110] backdrop-blur-sm" 
              onClick={() => setLockModal({ show: false, title: '', msg: '' })} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[111] flex items-center justify-center p-4"
            >
              <div className="bg-[var(--ide-bg)] border border-[#FF3366]/40 rounded-lg shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FF3366]" />
                
                <div className="w-16 h-16 mx-auto rounded border border-red-900/30 bg-red-950/10 flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-[#FF3366]" />
                </div>
                
                <h3 className="text-lg font-bold font-mono text-center text-[var(--text-primary)] mb-3 uppercase tracking-wider">
                  {lockModal.title}
                </h3>
                <p className="text-xs font-mono text-center text-[var(--text-secondary)] leading-relaxed mb-8">
                  {lockModal.msg}
                </p>
                
                <div className="flex gap-4 font-mono text-xs">
                  <button 
                    onClick={() => setLockModal({ show: false, title: '', msg: '' })}
                    className="flex-1 py-3 border border-[var(--ide-border)] hover:border-gray-500 rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase font-bold"
                  >
                    Dismiss
                  </button>
                  {lockModal.action && lockModal.href && (
                    <button 
                      onClick={() => { setLockModal({ show: false, title: '', msg: '' }); router.push(lockModal.href!); }}
                      className="flex-1 py-3 bg-[#FF3366] hover:bg-accent-pink-hover text-white rounded transition-colors uppercase font-bold"
                    >
                      {lockModal.action}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
