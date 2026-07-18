"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Code2, Sparkles, Zap, Search, Wifi, Globe, ArrowRight, Shield, Heart, Star, CheckCircle2, Loader2, ArrowLeft, Terminal, Cpu, Clock, Calendar, BarChart3, Database } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { useUser } from '@/context/UserContext';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, runTransaction, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const SKILL_META: Record<string,{name:string,icon:string,color:string}> = {
  javascript:{name:'JavaScript',icon:'⚡',color:'#FF3366'}, python:{name:'Python',icon:'🐍',color:'#3776AB'},
  typescript:{name:'TypeScript',icon:'🔷',color:'#3178C6'}, react:{name:'React',icon:'⚛️',color:'#61DAFB'},
  nextjs:{name:'Next.js',icon:'▲',color:'#FFFFFF'}, nodejs:{name:'Node.js',icon:'🟢',color:'#10B981'},
  java:{name:'Java',icon:'☕',color:'#ED8B00'}, cpp:{name:'C++',icon:'⚙️',color:'#00599C'},
  'html-css':{name:'HTML & CSS',icon:'🎨',color:'#E34F26'}, sql:{name:'SQL',icon:'🗄️',color:'#4479A1'},
  git:{name:'Git',icon:'🔀',color:'#F05032'}, rust:{name:'Rust',icon:'🦀',color:'#CE422B'},
  go:{name:'Go',icon:'🐹',color:'#00ADD8'}, docker:{name:'Docker',icon:'🐳',color:'#2496ED'},
  aws:{name:'AWS',icon:'☁️',color:'#FF9900'}, flutter:{name:'Flutter',icon:'💙',color:'#02569B'},
};

const FAKE_USERS = [
  {name:'Aarav Mehta',avatar:'AM',hp:420,skill:'React Wizard',loc:'Mumbai',speed:'74 WPM',style:'Driver/Navigator',overlap:'4.5h overlap'},
  {name:'Priya Sharma',avatar:'PS',hp:385,skill:'Full-Stack Dev',loc:'Delhi',speed:'68 WPM',style:'Co-Pilot Dynamic',overlap:'6.0h overlap'},
  {name:'Rohan Verma',avatar:'RV',hp:510,skill:'Backend Pro',loc:'Bangalore',speed:'82 WPM',style:'Strict Modular',overlap:'5.0h overlap'},
  {name:'Ananya Iyer',avatar:'AI',hp:340,skill:'Code Artisan',loc:'Chennai',speed:'65 WPM',style:'Verbose Commenter',overlap:'4.0h overlap'},
  {name:'Karthik Nair',avatar:'KN',hp:475,skill:'Data Coder',loc:'Hyderabad',speed:'78 WPM',style:'Test-Driven Core',overlap:'5.5h overlap'},
  {name:'Sneha Reddy',avatar:'SR',hp:395,skill:'DevOps Lead',loc:'Pune',speed:'71 WPM',style:'Automation First',overlap:'6.5h overlap'},
  {name:'Vivek Joshi',avatar:'VJ',hp:450,skill:'API Architect',loc:'Kolkata',speed:'76 WPM',style:'REST/GraphQL Opt',overlap:'3.5h overlap'},
  {name:'Diya Patel',avatar:'DP',hp:360,skill:'UI Engineer',loc:'Ahmedabad',speed:'69 WPM',style:'Framer & Motion',overlap:'4.0h overlap'},
];

type Phase = 'intro' | 'scanning' | 'matched' | 'timeout';

function MatchingRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skill') || 'javascript';
  const meta = SKILL_META[skillId] || SKILL_META.javascript;
  const { user, profile } = useUser();

  const [phase, setPhase] = useState<Phase>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedUsers, setScannedUsers] = useState<any[]>([]);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const [onlineCount, setOnlineCount] = useState(67);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [roomId, setRoomId] = useState<string|null>(null);

  const isScanningRef = useRef(false);

  useEffect(() => {
    console.log("[MATCH] Component Mounted");
    return () => console.log("[MATCH] Component Unmounted");
  }, []);

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 80) + 40);
  }, []);

  useEffect(() => {
    if (phase !== 'scanning' || !user) return;
    
    // Prevent React Strict Mode double execution
    if (isScanningRef.current) {
      console.log("[MATCH] useEffect triggered (Ignored due to Strict Mode)");
      return;
    }
    
    console.log("[MATCH] useEffect triggered");
    isScanningRef.current = true;
    let isMounted = true;
    let unsub = () => {};
    let progTimer: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;
    const qRef = doc(db, 'waiting_queue', user.uid);

    const initQueue = async () => {
      try {
        console.log("[MATCH] startScanning()");
        await setDoc(qRef, {
          userId: user.uid,
          skill: skillId,
          status: 'waiting',
          createdAt: new Date().toISOString(),
          name: profile?.username || 'user',
          avatar: profile?.avatar || 'kai',
          hp: 500
        });
        
        if (!isMounted) return;
        console.log("[MATCH] waiting_queue created");
        setConsoleLogs(["[SYS] REALTIME QUEUE ENTERED. SEARCHING..."]);

        // Start animation (less aggressive updates to prevent UI lock)
        let prog = 0;
        progTimer = setInterval(() => {
          prog = Math.min(prog + (100 / 600), 100);
          setScanProgress(prog);
          if (Math.random() > 0.95) {
             setScannedUsers(prev => prev.length < 5 ? [...prev, { name: 'Scanning...', avatar: '❓', skill: meta.name, speed: '---', overlap: 'Searching...' }] : prev);
          }
        }, 250);

        // Find partner
        console.log("[MATCH] Searching...");
        const q = query(collection(db, 'waiting_queue'), where('skill', '==', skillId), where('status', '==', 'waiting'));
        const qSnap = await getDocs(q);
        
        let partnerDoc: any = null;
        qSnap.forEach(d => {
          if (d.id !== user.uid) partnerDoc = { id: d.id, ...d.data() };
        });

        if (partnerDoc && isMounted) {
          setConsoleLogs(prev => [...prev, `[FOUND] CANDIDATE: ${partnerDoc.name}`]);
          try {
            await runTransaction(db, async (t) => {
              const pRef = doc(db, 'waiting_queue', partnerDoc.id);
              const mRef = doc(db, 'waiting_queue', user.uid);
              const pSnap = await t.get(pRef);
              const mSnap = await t.get(mRef);
              if (!pSnap.exists() || !mSnap.exists() || pSnap.data().status !== 'waiting' || mSnap.data().status !== 'waiting') {
                throw new Error("Race condition: Doc changed state");
              }
              const newRoomId = `room_${Math.random().toString(36).substring(2,9)}`;
              t.update(pRef, { status: 'matched', roomId: newRoomId, matchedWith: user.uid });
              t.update(mRef, { status: 'matched', roomId: newRoomId, matchedWith: partnerDoc.id });
            });
            console.log("[MATCH] Partner Found");
            console.log("[MATCH] Room Created");
            if (isMounted) setConsoleLogs(prev => [...prev, "[SUCCESS] ATOMIC TRANSACTION SECURED SYNERGY."]);
          } catch (e) {
            if (isMounted) setConsoleLogs(prev => [...prev, "[FAIL] MATCH INTERRUPTED. RESUMING QUEUE..."]);
          }
        }

        // Listen for match
        unsub = onSnapshot(qRef, async (docSnap) => {
          if (!isMounted) return;
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.status === 'matched' && data.roomId) {
              console.log("[MATCH] Partner Found");
              setRoomId(data.roomId);
              if (data.matchedWith) {
                 const pSnap = await getDoc(doc(db, 'waiting_queue', data.matchedWith));
                 if (pSnap.exists()) {
                   const pData = pSnap.data();
                   setMatchedUser({
                     name: pData.name, avatar: pData.avatar, hp: pData.hp || 500,
                     skill: pData.skill, loc: 'Remote', speed: '70 WPM', style: 'Balanced', overlap: 'Active Now'
                   });
                 } else {
                   setMatchedUser({
                     name: 'Matched Partner', avatar: '👋', hp: 500,
                     skill: meta.name, loc: 'Remote', speed: '70 WPM', style: 'Balanced', overlap: 'Active Now'
                   });
                 }
              }
              clearInterval(progTimer);
              setScanProgress(100);
              setPhase('matched');
            }
          }
        });

        timeoutTimer = setTimeout(async () => {
          if (!isMounted) return;
          const snap = await getDoc(qRef);
          if (snap.exists() && snap.data().status === 'waiting') {
            setPhase('timeout');
          }
        }, 60000);

      } catch (e) {
        console.error("Firestore error:", e);
        console.log("[MATCH] waiting_queue failed");
      }
    };

    initQueue();

    return () => {
      isMounted = false;
      isScanningRef.current = false;
      clearInterval(progTimer);
      clearTimeout(timeoutTimer);
      unsub();
      
      // Cleanup: only delete if the user was still waiting
      getDoc(qRef).then(snap => {
        if (snap.exists() && snap.data().status === 'waiting') {
          if (!isScanningRef.current) {
            deleteDoc(qRef).catch(e => console.error(e));
          }
        }
      }).catch(e => console.error(e));
    };
  }, [phase]); // Exclude user to avoid continuous restarts from UserContext re-renders

  const startScanning = () => {
    if (!user || phase === 'scanning') return;
    console.log("[MATCH] Button Clicked");
    setScannedUsers([]);
    setScanProgress(0);
    setConsoleLogs(["[SYS] BOOTING MULTIPLAYER COOPERATION TELEMETRY..."]);
    setPhase('scanning');
  };

  return (
    <main className="fixed inset-0 bg-[var(--background)] text-[var(--foreground)] z-[9999] overflow-hidden flex flex-col font-sans">
      {/* ═══ DEVELOPER DEEP ACCENT BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 developer-grid opacity-[0.2]" />
        
        {/* Soft glowing mesh matrices */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.08]" 
          animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} 
          style={{ background: meta.color, left: '-10%', top: '-10%' }} 
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.08]" 
          animate={{ x: [0, -30, 40, 0], y: [0, 40, -30, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} 
          style={{ background: '#FF3366', right: '-5%', top: '20%' }} 
        />
      </div>

      {/* ═══ PREMIUM NAVIGATION HEADER ═══ */}
      <nav className="relative z-30 bg-[var(--background)]/75 backdrop-blur-md border-b border-[var(--ide-border)] px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Logo showText={true} className="scale-[0.8] origin-left" />
          <div className="w-px h-5 bg-[#1E2333]" />
          <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">// MATCHING_ENGINE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#10B981]/5 border border-[#10B981]/25 text-[#10B981] font-mono text-[9px] font-bold tracking-widest uppercase">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>{onlineCount} NODES ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] text-[9px] font-mono text-[var(--text-primary)]/80 font-bold uppercase tracking-widest">
            <span className="shrink-0">{meta.icon}</span>
            <span>{meta.name}</span>
          </div>
        </div>
      </nav>

      {/* ═══ WORKSPACE CONTENT VIEWPORT ═══ */}
      <div className="flex-1 relative z-20 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ════ PHASE 1: INTRO ARCHITECTURE ════ */}
          {phase === 'intro' && (
            <motion.div 
              key="intro" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="text-center max-w-2xl w-full"
            >
              {/* Scientific pairing beam compiler visualization */}
              <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-full border border-dashed border-[var(--ide-border)]"
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 35, repeat: Infinity, ease: 'linear' }} 
                />
                <motion.div 
                  className="absolute inset-4 rounded-full border-2 border-dashed border-[#FF3366]/15"
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }} 
                />
                <motion.div 
                  className="absolute inset-10 rounded-full border border-dashed border-[#3B82F6]/20"
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} 
                />
                
                <motion.div 
                  animate={{ scale: [1, 1.03, 1], boxShadow: [`0 0 0 0px ${meta.color}00`, `0 0 30px 4px ${meta.color}20`, `0 0 0 0px ${meta.color}00`] }} 
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 rounded-2xl flex items-center justify-center bg-[var(--ide-bg)] border border-[var(--ide-border)] z-10 shadow-2xl"
                >
                  <Users className="w-10 h-10 text-[var(--text-primary)]" />
                </motion.div>

                {/* Satellite data nodes orbiting */}
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    className="absolute w-2 h-2 rounded-full" 
                    style={{ background: i === 0 ? '#FF3366' : i === 1 ? '#3B82F6' : '#10B981' }}
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 8 + i * 3, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="absolute -top-1" style={{ left: 68 + i * 10 }} />
                  </motion.div>
                ))}
              </div>

              {/* Monospace Developer-Native Titles */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF3366]/5 border border-[#FF3366]/20 text-[#FF3366] text-[9px] font-mono uppercase tracking-widest font-bold">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" />
                  TELEMETRY MATCHMAKER SYSTEM ACTIVE
                </div>

                <h1 className="text-4xl md:text-5xl font-mono font-black text-[var(--text-primary)] leading-[1.1] uppercase">
                  SCIENTIFIC <span className="text-[#FF3366] accent-glow">PAIRING</span> GRID
                </h1>

                <p className="text-[var(--text-secondary)] text-xs max-w-md mx-auto font-sans leading-relaxed">
                  Avoid the generic social templates. Match with highly compatible engineers computed on strict schedule availability, code speeds, and toolbox complementary balances.
                </p>
              </div>

              {/* Architectural parameters badges */}
              <div className="flex items-center justify-center gap-3 mt-8 mb-10 flex-wrap">
                {[
                  { icon: Shield, text: 'Strict Skill Validation' },
                  { icon: Clock, text: 'Overlapping Workspace Match' },
                  { icon: Globe, text: 'Driver/Navigator Balancing' },
                  { icon: Database, text: 'Active Firestore Sockets' }
                ].map((f, i) => (
                  <motion.div 
                    key={f.text} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[var(--ide-bg)] border border-[var(--ide-border)] text-[9px] font-mono text-[var(--text-secondary)] font-bold"
                  >
                    <f.icon className="w-3 h-3 text-[#FF3366]" />
                    <span>{f.text.toUpperCase()}</span>
                  </motion.div>
                ))}
              </div>

              {/* Premium Monospaced CTA Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => router.push('/student/dashboard')} 
                  className="flex items-center gap-2 px-6 py-3 border border-[var(--ide-border)] hover:border-accent-pink rounded bg-[var(--ide-bg)] text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] hover:text-accent-pink transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Exit telemetry
                </button>
                
                <button 
                  onClick={startScanning}
                  className="btn-premium px-8 py-3 flex items-center gap-2 text-xs"
                >
                  <Search className="w-4 h-4" /> Start Matching Sequence <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ════ PHASE 2: SCANNING — COMPILER LOGS GRID ════ */}
          {phase === 'scanning' && (
            <motion.div 
              key="scanning" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Console Matrix Telemetry Logger */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="glass-panel flex-1 flex flex-col min-h-[320px] rounded-lg overflow-hidden border-[var(--ide-border)]">
                  <div className="ide-panel-header w-full justify-between py-2.5 border-b border-[var(--ide-border)]/40 bg-[var(--ide-header-bg)]/50 px-4">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1.5 font-bold">
                      <Terminal className="w-3.5 h-3.5 text-[#FF3366]" /> SYSTEM_LOG_COMPILER.SH
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] animate-pulse" />
                  </div>
                  
                  {/* Active telemetry terminal output stream */}
                  <div className="p-5 flex-1 font-mono text-[10px] text-[var(--text-secondary)] space-y-2 overflow-y-auto max-h-[250px] scrollbar-none flex flex-col justify-end bg-[var(--ide-header-bg)]/30">
                    {consoleLogs.map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className={log.startsWith('[SUCCESS]') ? 'text-[#10B981] font-bold' : log.startsWith('[FOUND]') ? 'text-[#3B82F6]' : 'text-[var(--text-muted)]'}
                      >
                        {log}
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-1 text-[#FF3366] animate-pulse">
                      <span>&gt; compiling compatibility telemetry parameters...</span>
                      <span className="w-1.5 h-3 bg-[#FF3366]" />
                    </div>
                  </div>

                  {/* Manual Cancel Button */}
                  <div className="px-4 py-2 bg-[var(--ide-header-bg)]/80 border-t border-[var(--ide-border)]/40 flex justify-end">
                    <button
                      onClick={() => setPhase('intro')}
                      className="px-4 py-1.5 rounded bg-[var(--background)] border border-[var(--ide-border)] hover:border-[#FF3366] text-[#FF3366] text-[9px] font-mono font-bold uppercase tracking-widest transition-colors"
                    >
                      Cancel Matchmaking
                    </button>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="p-4 border-t border-[var(--ide-border)]/40 bg-[var(--ide-header-bg)]/50 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-mono font-bold text-[var(--text-muted)] uppercase">
                      <span>COMPILING PAIR SYNERGY</span>
                      <span className="text-[#FF3366] font-bold">{Math.round(scanProgress)}%</span>
                    </div>
                    <div className="h-1.5 rounded bg-[var(--background)] overflow-hidden border border-[var(--ide-border)]/40 p-[1px]">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#FF3366] to-[#3B82F6] rounded-sm" 
                        animate={{ width: `${scanProgress}%` }} 
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Active candidate parsing queue */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="glass-panel flex-1 flex flex-col rounded-lg overflow-hidden border-[var(--ide-border)]">
                  <div className="ide-panel-header w-full py-2.5 border-b border-[var(--ide-border)]/40 bg-[var(--ide-header-bg)]/50 px-4">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1.5 font-bold">
                      <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" /> MATCH_CANDIDATE_POOL
                    </span>
                  </div>

                  <div className="p-5 flex-1 space-y-3 overflow-y-auto max-h-[300px] scrollbar-none bg-[var(--ide-header-bg)]/10">
                    <AnimatePresence mode="popLayout">
                      {scannedUsers.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col text-center py-12 text-[var(--text-muted)] space-y-2">
                          <Loader2 className="w-8 h-8 animate-spin text-[#FF3366]" />
                          <p className="text-[9px] font-mono uppercase tracking-widest font-bold">Searching node streams...</p>
                        </div>
                      ) : (
                        scannedUsers.slice(-4).map((u, i) => (
                          <motion.div 
                            key={u.name + i} 
                            initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                            animate={{ opacity: i === scannedUsers.slice(-4).length - 1 ? 1 : 0.4, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-3 rounded-md border font-mono ${
                              i === scannedUsers.slice(-4).length - 1 
                                ? 'bg-[var(--ide-bg)] border-[#FF3366]/40 text-[var(--text-primary)]' 
                                : 'bg-[var(--ide-header-bg)]/30 border-[var(--ide-border)]/40 text-[var(--text-muted)]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded border border-[var(--ide-border)] bg-[var(--background)] flex items-center justify-center text-[10px] font-bold text-accent-pink">
                                  {u.avatar}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold">{u.name}</p>
                                  <p className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-wide">{u.skill} // {u.overlap}</p>
                                </div>
                              </div>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20">
                                {u.speed}
                              </span>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════ PHASE 3: MATCHED - HIGH INFORMATION SYNERGY RADAR ════ */}
          {phase === 'matched' && matchedUser && (
            <motion.div 
              key="matched" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="w-full max-w-4xl space-y-6"
            >
              {/* Title Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[9px] font-mono uppercase tracking-widest font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  HIGH COMPATIBILITY CODER MATCHED SUCCESSFULLY
                </div>
                <h2 className="text-3xl font-mono font-black text-[var(--text-primary)] uppercase tracking-tight">
                  PARTNER_SYNERGY_<span className="text-[#10B981]">ESTABLISHED</span>
                </h2>
              </div>

              {/* Core Pairing Visual Node Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                
                {/* Left Side: Coder Details & Synergy Metrics */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <div className="glass-panel border-[var(--ide-border)] rounded-lg overflow-hidden flex-1 flex flex-col justify-between bg-[var(--ide-bg)]">
                    {/* Header */}
                    <div className="ide-panel-header w-full justify-between py-2.5 border-b border-[var(--ide-border)]/50 bg-[var(--ide-header-bg)]/80 px-4">
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1.5 font-bold">
                        <Cpu className="w-3.5 h-3.5 text-[#10B981]" /> ECOSYSTEM_SYNERGY_ANALYSIS
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#10B981]">MATCH_ID: #D4C-{Math.floor(Math.random()*9000+1000)}</span>
                    </div>

                    {/* Node Connection Beam Animation Block */}
                    <div className="p-6 bg-[var(--ide-header-bg)]/30 border-b border-[var(--ide-border)]/40 flex items-center justify-center gap-4 py-8">
                      {/* You Node */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF3366] to-[#FF5E85] border border-[#FF3366]/40 flex items-center justify-center text-white text-base font-mono font-black shadow-[0_0_15px_rgba(255,51,102,0.2)]">
                          YOU
                        </div>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest">LOCAL_NODE</span>
                      </div>

                      {/* Connection teleporter beam line */}
                      <div className="flex-1 flex items-center justify-center relative px-2">
                        <div className="w-full h-px bg-gradient-to-r from-[#FF3366]/40 via-[#10B981]/50 to-[#3B82F6]/40 relative">
                          <motion.div 
                            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981]"
                            animate={{ left: ['0%', '100%', '0%'] }} 
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          />
                        </div>
                        <motion.div 
                          className="absolute w-9 h-9 rounded-full bg-[#10B981]/10 border border-[#10B981]/40 flex items-center justify-center shadow-lg"
                          animate={{ scale: [1, 1.08, 1] }} 
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Code2 className="w-4 h-4 text-[#10B981]" />
                        </motion.div>
                      </div>

                      {/* Matched Node */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] border border-[#3B82F6]/40 flex items-center justify-center text-white text-base font-mono font-black shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          {matchedUser.avatar}
                        </div>
                        <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase font-bold tracking-widest">PEER_NODE</span>
                      </div>
                    </div>

                    {/* Scientific Synergy Radar Parameters */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[var(--ide-header-bg)]/50">
                      <div className="p-3 border border-[var(--ide-border)] bg-[var(--background)]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-[var(--text-muted)] uppercase block mb-1">Timezone Overlap</span>
                        <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                          <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span className="text-xs font-bold">{matchedUser.overlap}</span>
                        </div>
                        <span className="text-[8px] text-[var(--text-muted)] block mt-1">UTC+5:30 Alignment</span>
                      </div>

                      <div className="p-3 border border-[var(--ide-border)] bg-[var(--background)]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-[var(--text-muted)] uppercase block mb-1">Coding Speed</span>
                        <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                          <Zap className="w-3.5 h-3.5 text-[#FF3366]" />
                          <span className="text-xs font-bold">{matchedUser.speed}</span>
                        </div>
                        <span className="text-[8px] text-[var(--text-muted)] block mt-1">70 WPM Cohort avg</span>
                      </div>

                      <div className="p-3 border border-[var(--ide-border)] bg-[var(--background)]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-[var(--text-muted)] uppercase block mb-1">Pairing Style</span>
                        <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                          <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-xs font-bold text-ellipsis overflow-hidden whitespace-nowrap">{matchedUser.style}</span>
                        </div>
                        <span className="text-[8px] text-[var(--text-muted)] block mt-1">Balanced driver</span>
                      </div>

                      <div className="p-3 border border-[var(--ide-border)] bg-[var(--background)]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-[var(--text-muted)] uppercase block mb-1">Synergy Quotient</span>
                        <div className="flex items-center gap-1.5 text-[#10B981]">
                          <BarChart3 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-xs font-bold">96% SYNERGY</span>
                        </div>
                        <span className="text-[8px] text-[var(--text-muted)] block mt-1">Extremely compatible</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action Options Terminal */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <div className="glass-panel border-[var(--ide-border)] rounded-lg overflow-hidden flex-1 flex flex-col justify-between p-5 space-y-5 bg-[var(--ide-bg)]">
                    <div className="space-y-2">
                      <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-bold">// TARGET_PEER_SUMMARY</p>
                      <h3 className="text-base font-mono font-bold text-[var(--text-primary)] uppercase">{matchedUser.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed bg-[var(--background)]/60 p-3 border border-[var(--ide-border)] rounded-lg">
                        Experienced coder focusing on {meta.name} design configurations, compiler telemetry pipelines, and strict type safety matrices.
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-[var(--ide-border)]/50 pt-4">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-[var(--text-muted)]">PEER TELEMETRY XP</span>
                        <span className="text-[#FF3366] font-bold">{matchedUser.hp} HP</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-[var(--text-muted)]">PEER ACCENT STATE</span>
                        <span className="text-[#3B82F6] font-bold uppercase">VERIFIED CODER</span>
                      </div>
                    </div>

                    {/* Enter room CTA actions */}
                    <div className="space-y-3 pt-2">
                      <button 
                        onClick={() => {
                          try {
                            const p = JSON.parse(localStorage.getItem('dateforcode_progress') || '{}');
                            p.matchDone = true;
                            p.matches = (p.matches || 0) + 1;
                            localStorage.setItem('dateforcode_progress', JSON.stringify(p));
                          } catch (_) {}
                          router.push(`/student/coding-room?skill=${skillId}&partner=${encodeURIComponent(matchedUser.name)}&avatar=${matchedUser.avatar}&roomId=${roomId || 'default'}`);
                        }}
                        className="btn-premium w-full py-3.5 text-xs flex items-center justify-center gap-2"
                      >
                        <Code2 className="w-4 h-4" /> Enter Coding Room <ArrowRight className="w-4 h-4" />
                      </button>

                      <button 
                        onClick={() => router.push('/student/dashboard')} 
                        className="w-full py-2.5 rounded border border-[var(--ide-border)] hover:border-accent-pink bg-[var(--background)] text-[10px] font-mono font-bold text-[var(--text-muted)] hover:text-accent-pink uppercase transition-all"
                      >
                        Decline & Return to Command
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>
          )}

        </AnimatePresence>

        <AnimatePresence>
          {/* ════ PHASE 4: TIMEOUT ════ */}
          {phase === 'timeout' && (
            <motion.div
              key="timeout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center bg-[var(--background)]/90 backdrop-blur-md z-50 p-6"
            >
              <div className="max-w-md w-full glass-panel border border-[var(--ide-border)] p-8 text-left space-y-6 bg-[#0a0a0a] rounded-2xl shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="flex items-center gap-3 border-b border-[var(--ide-border)] pb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] flex items-center justify-center">
                    <span className="text-xl">💀</span>
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white tracking-wide">
                    Oops... Looks Like {meta.name} Is Taking a Coffee Break!
                  </h3>
                </div>
                
                <div className="space-y-4 font-mono text-[13px] text-[#A1A1AA] leading-relaxed">
                  <p>
                    <span className="text-[#FF3366]">{`>`}</span> No <span className="text-white font-semibold">{meta.name}</span> coders are online right now.
                  </p>
                  <p>
                    Looks like everyone's busy fixing bugs, arguing about tabs vs spaces, or pretending "it works on my machine".
                  </p>
                  <p className="text-[#3B82F6] font-bold mt-2">
                    ? What do you want to do?
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-[var(--ide-border)]/50">
                  <button
                    onClick={() => setPhase('scanning')}
                    className="w-full py-3.5 px-4 rounded-lg bg-[var(--ide-bg)] hover:bg-[#FF3366]/10 border border-[var(--ide-border)] hover:border-[#FF3366]/30 text-white text-xs font-mono font-bold transition-all flex items-center gap-3 group/btn"
                  >
                    <span className="group-hover/btn:scale-125 transition-transform">⚡</span> Keep Hunting
                  </button>
                  <button
                    onClick={() => router.push('/student/solo-code')}
                    className="w-full py-3.5 px-4 rounded-lg bg-[var(--ide-bg)] hover:bg-[#3B82F6]/10 border border-[var(--ide-border)] hover:border-[#3B82F6]/30 text-white text-xs font-mono font-bold transition-all flex items-center gap-3 group/btn"
                  >
                    <span className="group-hover/btn:scale-125 transition-transform">🎯</span> Train Solo
                  </button>
                  <button
                    onClick={() => router.push('/student/dashboard')}
                    className="w-full py-3.5 px-4 rounded-lg bg-[var(--ide-bg)] hover:bg-white/5 border border-[var(--ide-border)] hover:border-white/20 text-[#A1A1AA] hover:text-white text-xs font-mono font-bold transition-all flex items-center gap-3 group/btn"
                  >
                    <span className="group-hover/btn:scale-125 transition-transform text-xl">🚪</span> Bail Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function MatchingRoom() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center font-mono text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
        <p>WARMING PAIR MATCHING GRID PORT TELEMETRY...</p>
      </div>
    }>
      <MatchingRoomContent />
    </React.Suspense>
  );
}
