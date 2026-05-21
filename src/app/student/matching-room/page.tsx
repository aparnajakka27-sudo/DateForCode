"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Code2, Sparkles, Zap, Search, Wifi, Globe, ArrowRight, Shield, Heart, Star, CheckCircle2, Loader2, ArrowLeft, Terminal, Cpu, Clock, Calendar, BarChart3, Database } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

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

type Phase = 'intro' | 'scanning' | 'matched';

function MatchingRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillId = searchParams.get('skill') || 'javascript';
  const meta = SKILL_META[skillId] || SKILL_META.javascript;

  const [phase, setPhase] = useState<Phase>('intro');
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedUsers, setScannedUsers] = useState<typeof FAKE_USERS>([]);
  const [matchedUser, setMatchedUser] = useState<typeof FAKE_USERS[0]|null>(null);
  const [onlineCount, setOnlineCount] = useState(67);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);

  useEffect(() => {
    setOnlineCount(Math.floor(Math.random() * 80) + 40);
  }, []);

  // Scanning phase simulated logs & progression
  useEffect(() => {
    if (phase !== 'scanning') return;
    const shuffled = [...FAKE_USERS].sort(() => Math.random() - 0.5);
    let idx = 0;
    let userIdx = 0;

    const logTemplates = [
      "INITIALIZING SCIENTIFIC MATCHMAKING CRITERIA...",
      "SCANNING TELEMETRY NODE PORTS...",
      "ESTABLISHING TIMEZONE SCHEDULE COMPARATORS...",
      "AUDITING SKILL REPERTOIRE POPULARITIES...",
      "EXTRACTING CODER SPEED CAPABILITIES (WPM)...",
      "EVALUATING COLLABORATIVE PREFERENCE SYNERGIES...",
      "CALCULATING DRIVER/NAVIGATOR ROLE BALANCE...",
      "COMPILING COMPATIBILITY CORRELATION MATRIX...",
      "SEARCHING ACTIVE CLUSTERS FOR OPTIMAL NODES...",
      "FILTERING BY COMPATIBILITY SYNERGY LEVEL > 85%..."
    ];

    const scanTimer = setInterval(() => {
      idx++;
      setScanProgress(Math.min((idx / 30) * 100, 100));
      
      // Inject console logs
      if (idx % 3 === 0 && idx / 3 < logTemplates.length) {
        setConsoleLogs(prev => [...prev, `[SYS] ${logTemplates[Math.floor(idx / 3)]}`]);
      }

      if (idx % 4 === 0 && userIdx < 8) {
        const user = shuffled[userIdx % shuffled.length];
        userIdx++;
        setScannedUsers(prev => [...prev, user]);
        setConsoleLogs(prev => [...prev, `[FOUND] Active Candidate: ${user.name} (${user.speed}, ${user.overlap})`]);
      }

      if (idx >= 30) {
        clearInterval(scanTimer);
        const match = shuffled[Math.floor(Math.random() * 4)];
        setMatchedUser(match);
        setConsoleLogs(prev => [...prev, `[SUCCESS] MATCH VERIFIED WITH CODER: ${match.name.toUpperCase()}`]);
        setTimeout(() => setPhase('matched'), 1200);
      }
    }, 180);
    return () => clearInterval(scanTimer);
  }, [phase]);

  const startScanning = () => {
    setScannedUsers([]);
    setScanProgress(0);
    setConsoleLogs(["[SYS] BOOTING MULTIPLAYER COOPERATION TELEMETRY..."]);
    setPhase('scanning');
  };

  return (
    <main className="fixed inset-0 bg-[#08090C] text-[#F3F4F6] z-[9999] overflow-hidden flex flex-col font-sans">
      {/* ═══ DEVELOPER DEEP ACCENT BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* IDE grid background overlay */}
        <div className="absolute inset-0 developer-grid opacity-[0.08]" />
        
        {/* Soft glowing mesh color matrices (based on theme parameters) */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-[0.07]" 
          animate={{ x: [0, 40, -40, 0], y: [0, -40, 40, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} 
          style={{ background: meta.color, left: '-10%', top: '-10%' }} 
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.07]" 
          animate={{ x: [0, -30, 40, 0], y: [0, 40, -30, 0] }} 
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} 
          style={{ background: '#FF3366', right: '-5%', top: '20%' }} 
        />
      </div>

      {/* ═══ PREMIUM TERMINAL TOP HEADER ═══ */}
      <nav className="relative z-30 bg-[#08090C]/90 backdrop-blur-md border-b border-[#2A2E3D]/60 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <Logo showText={true} className="scale-[0.8] origin-left" />
          <div className="w-px h-5 bg-[#2A2E3D]" />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">// MATCHING_ENGINE</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#10B981]/5 border border-[#10B981]/25 text-[#10B981] font-mono text-[10px] font-bold">
            <Wifi className="w-3 h-3 animate-pulse" />
            <span>{onlineCount} NODES ONLINE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#15171F] border border-[#2A2E3D] text-xs font-mono text-white/80">
            <span className="text-sm shrink-0">{meta.icon}</span>
            <span className="text-[10px] font-bold uppercase">{meta.name}</span>
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
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="text-center max-w-2xl w-full"
            >
              {/* Scientific pairing beam compiler visualization */}
              <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-full border border-dashed border-[#2A2E3D]"
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }} 
                />
                <motion.div 
                  className="absolute inset-4 rounded-full border-2 border-dashed border-[#FF3366]/20"
                  animate={{ rotate: -360 }} 
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} 
                />
                <motion.div 
                  className="absolute inset-8 rounded-full border border-dashed border-[#3B82F6]/30"
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} 
                />
                
                <motion.div 
                  animate={{ scale: [1, 1.05, 1], boxShadow: [`0 0 0 0px ${meta.color}00`, `0 0 25px 4px ${meta.color}33`, `0 0 0 0px ${meta.color}00`] }} 
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-3xl bg-[#15171F] border border-[#2A2E3D] z-10"
                >
                  <Users className="w-10 h-10 text-white" />
                </motion.div>

                {/* Satellite data nodes orbiting */}
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i} 
                    className="absolute w-2.5 h-2.5 rounded-full" 
                    style={{ background: i === 0 ? '#FF3366' : i === 1 ? '#3B82F6' : '#10B981' }}
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="absolute -top-1" style={{ left: 58 + i * 8 }} />
                  </motion.div>
                ))}
              </div>

              {/* Monospace Developer-Native Titles */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#FF3366]/10 border border-[#FF3366]/30 text-[#FF3366] text-[10px] font-mono uppercase tracking-widest font-bold">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" />
                  TELEMETRY MATCHMAKER SYSTEM ACTIVE
                </div>

                <h1 className="text-4xl md:text-5xl font-mono font-black text-white leading-tight uppercase">
                  SCIENTIFIC <span className="text-[#FF3366] accent-glow">PAIRING</span> GRID
                </h1>

                <p className="text-gray-400 text-xs max-w-md mx-auto font-mono leading-relaxed">
                  Avoid the generic SaaS social template swiping. Match with highly compatible engineers computed on strict schedule availability, code speeds, and toolbox complementary balances.
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#15171F] border border-[#2A2E3D] text-[9px] font-mono text-gray-400"
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
                  className="flex items-center gap-2 px-6 py-3 border border-[#2A2E3D] hover:border-gray-500 rounded bg-[#15171F] text-xs font-mono text-gray-400 hover:text-white transition-all uppercase"
                >
                  <ArrowLeft className="w-4 h-4" /> Exit telemetry
                </button>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  onClick={startScanning}
                  className="flex items-center gap-2 px-8 py-3 rounded bg-[#FF3366] text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#FF3366]/90 transition-all border border-[#FF3366] hover:border-[#FF5E85] shadow-[0_0_15px_rgba(255,51,102,0.3)]"
                >
                  <Search className="w-4 h-4" /> Start Matching Sequence <ArrowRight className="w-4 h-4" />
                </motion.button>
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
              className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
            >
              {/* Left Column: Console Matrix Telemetry Logger (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="ide-panel flex-1 bg-[#15171F] border-[#2A2E3D] flex flex-col min-h-[320px] rounded-lg overflow-hidden">
                  <div className="ide-panel-header w-full justify-between py-2.5 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80 px-4">
                    <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-[#FF3366]" /> SYSTEM_LOG_COMPILER.SH
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-pulse" />
                  </div>
                  
                  {/* Active telemetry terminal output stream */}
                  <div className="p-4 flex-1 font-mono text-[10px] text-gray-400 space-y-1.5 overflow-y-auto max-h-[250px] scrollbar-none flex flex-col justify-end">
                    {consoleLogs.map((log, i) => (
                      <motion.div 
                        key={i} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }}
                        className={log.startsWith('[SUCCESS]') ? 'text-[#10B981] font-bold' : log.startsWith('[FOUND]') ? 'text-[#3B82F6]' : 'text-gray-500'}
                      >
                        {log}
                      </motion.div>
                    ))}
                    <div className="flex items-center gap-1 text-[#FF3366] animate-pulse">
                      <span>&gt; compiling compatibility telemetry parameters...</span>
                      <span className="w-1.5 h-3 bg-[#FF3366]" />
                    </div>
                  </div>

                  {/* Linear Progress Bar */}
                  <div className="p-4 border-t border-[#2A2E3D]/50 bg-[#0D0E12]/40 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-gray-500">COMPILING PAIR SYNERGY</span>
                      <span className="text-[#FF3366] font-bold">{Math.round(scanProgress)}%</span>
                    </div>
                    <div className="h-1.5 rounded bg-[#0D0E12] overflow-hidden border border-[#2A2E3D]/40">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-[#FF3366] to-[#3B82F6]" 
                        animate={{ width: `${scanProgress}%` }} 
                        transition={{ ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Active candidate parsing queue (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                <div className="ide-panel bg-[#15171F] border-[#2A2E3D] flex-1 flex flex-col rounded-lg overflow-hidden">
                  <div className="ide-panel-header w-full py-2.5 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80 px-4">
                    <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-[#3B82F6]" /> MATCH_CANDIDATE_POOL
                    </span>
                  </div>

                  <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[300px] scrollbar-none">
                    <AnimatePresence mode="popLayout">
                      {scannedUsers.length === 0 ? (
                        <div className="h-full flex items-center justify-center flex-col text-center py-12 text-gray-600 space-y-2">
                          <Loader2 className="w-8 h-8 animate-spin text-[#FF3366]" />
                          <p className="text-[10px] font-mono uppercase tracking-widest">Searching node streams...</p>
                        </div>
                      ) : (
                        scannedUsers.slice(-4).map((u, i) => (
                          <motion.div 
                            key={u.name + i} 
                            initial={{ opacity: 0, y: 15, scale: 0.98 }} 
                            animate={{ opacity: i === scannedUsers.slice(-4).length - 1 ? 1 : 0.4, y: 0, scale: 1 }} 
                            exit={{ opacity: 0, x: -20 }}
                            className={`p-3 rounded border font-mono ${
                              i === scannedUsers.slice(-4).length - 1 
                                ? 'bg-[#15171F] border-[#FF3366]/40 text-white' 
                                : 'bg-[#0D0E12]/50 border-[#2A2E3D]/40 text-gray-500'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded border border-[#2A2E3D] bg-[#0D0E12] flex items-center justify-center text-[10px] font-bold text-accent-pink">
                                  {u.avatar}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-bold">{u.name}</p>
                                  <p className="text-[8px] text-gray-500">{u.skill.toUpperCase()} // {u.overlap.toUpperCase()}</p>
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-mono uppercase tracking-widest font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  HIGH COMPATIBILITY CODER MATCHED SUCCESSFULLY
                </div>
                <h2 className="text-3xl font-mono font-black text-white uppercase tracking-tight">
                  PARTNER_SYNERGY_<span className="text-[#10B981]">ESTABLISHED</span>
                </h2>
              </div>

              {/* Core Pairing Visual Node Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Side: Coder Details & Synergy Metrics (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden flex-1 flex flex-col justify-between">
                    {/* Header */}
                    <div className="ide-panel-header w-full justify-between py-2 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80 px-4">
                      <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-[#10B981]" /> ECOSYSTEM_SYNERGY_ANALYSIS
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#10B981]">MATCH_ID: #D4C-{Math.floor(Math.random()*9000+1000)}</span>
                    </div>

                    {/* Node Connection Beam Animation Block */}
                    <div className="p-6 bg-[#0D0E12]/50 border-b border-[#2A2E3D]/40 flex items-center justify-center gap-4 py-8">
                      {/* You Node */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF3366] to-[#FF5E85] border border-[#FF3366]/40 flex items-center justify-center text-white text-base font-mono font-black shadow-[0_0_15px_rgba(255,51,102,0.2)]">
                          YOU
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">LOCAL_NODE</span>
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
                          <Heart className="w-4 h-4 text-[#10B981] fill-[#10B981]/20" />
                        </motion.div>
                      </div>

                      {/* Matched Node */}
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] border border-[#3B82F6]/40 flex items-center justify-center text-white text-base font-mono font-black shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                          {matchedUser.avatar}
                        </div>
                        <span className="text-[9px] font-mono text-gray-500 uppercase">PEER_NODE</span>
                      </div>
                    </div>

                    {/* Scientific Synergy Radar Parameters (High Density Info Grid) */}
                    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#15171F]">
                      <div className="p-3 border border-[#2A2E3D] bg-[#0D0E12]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-gray-500 uppercase block mb-1">Timezone Overlap</span>
                        <div className="flex items-center gap-1.5 text-white">
                          <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" />
                          <span className="text-xs font-bold">{matchedUser.overlap}</span>
                        </div>
                        <span className="text-[8px] text-gray-500 block mt-1">UTC+5:30 Alignment</span>
                      </div>

                      <div className="p-3 border border-[#2A2E3D] bg-[#0D0E12]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-gray-500 uppercase block mb-1">Coding Speed</span>
                        <div className="flex items-center gap-1.5 text-white">
                          <Zap className="w-3.5 h-3.5 text-[#FF3366]" />
                          <span className="text-xs font-bold">{matchedUser.speed}</span>
                        </div>
                        <span className="text-[8px] text-gray-500 block mt-1">70 WPM Cohort avg</span>
                      </div>

                      <div className="p-3 border border-[#2A2E3D] bg-[#0D0E12]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-gray-500 uppercase block mb-1">Pairing Style</span>
                        <div className="flex items-center gap-1.5 text-white">
                          <Code2 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-xs font-bold text-ellipsis overflow-hidden whitespace-nowrap">{matchedUser.style}</span>
                        </div>
                        <span className="text-[8px] text-gray-500 block mt-1">Balanced driver</span>
                      </div>

                      <div className="p-3 border border-[#2A2E3D] bg-[#0D0E12]/60 rounded font-mono text-left">
                        <span className="text-[8px] text-gray-500 uppercase block mb-1">Synergy Quotient</span>
                        <div className="flex items-center gap-1.5 text-[#10B981]">
                          <BarChart3 className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-xs font-bold">96% SYNERGY</span>
                        </div>
                        <span className="text-[8px] text-gray-500 block mt-1">Extremely compatible</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Quick Action Options Terminal (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden flex-1 flex flex-col justify-between p-5 space-y-5">
                    <div className="space-y-2">
                      <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">// TARGET_PEER_SUMMARY</p>
                      <h3 className="text-base font-mono font-bold text-white uppercase">{matchedUser.name}</h3>
                      <p className="text-xs text-gray-400 font-mono leading-relaxed bg-[#0D0E12]/60 p-3 border border-[#2A2E3D] rounded">
                        Experienced coder focusing on {meta.name} design configurations, compiler telemetry pipelines, and strict type safety matrices.
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-[#2A2E3D]/50 pt-4">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-gray-500">PEER TELEMETRY XP</span>
                        <span className="text-[#FF3366] font-bold">{matchedUser.hp} HP</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-gray-500">PEER ACCENT STATE</span>
                        <span className="text-[#3B82F6] font-bold">VERIFIED CODER</span>
                      </div>
                    </div>

                    {/* Enter room CTA actions */}
                    <div className="space-y-3 pt-2">
                      <motion.button 
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          try {
                            const p = JSON.parse(localStorage.getItem('dateforcode_progress') || '{}');
                            p.matchDone = true;
                            p.matches = (p.matches || 0) + 1;
                            localStorage.setItem('dateforcode_progress', JSON.stringify(p));
                          } catch (_) {}
                          router.push(`/student/coding-room?skill=${skillId}&partner=${encodeURIComponent(matchedUser.name)}&avatar=${matchedUser.avatar}`);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded bg-[#10B981] hover:bg-[#10B981]/90 text-white font-mono text-xs font-bold uppercase tracking-wider border border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all"
                      >
                        <Code2 className="w-4 h-4" /> Enter Coding Room <ArrowRight className="w-4 h-4" />
                      </motion.button>

                      <button 
                        onClick={() => router.push('/student/dashboard')} 
                        className="w-full py-2.5 rounded border border-[#2A2E3D] hover:border-gray-500 bg-[#0D0E12] text-xs font-mono text-gray-500 hover:text-white uppercase transition-all"
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
      </div>
    </main>
  );
}

export default function MatchingRoom() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#08090C] flex flex-col items-center justify-center font-mono text-xs text-gray-500">
        <p>WARMING PAIR MATCHING GRID PORT TELEMETRY...</p>
      </div>
    }>
      <MatchingRoomContent />
    </React.Suspense>
  );
}
