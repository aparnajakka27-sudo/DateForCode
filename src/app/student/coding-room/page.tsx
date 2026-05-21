"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Code2, Play, Send, Mic, MicOff, Monitor, Users, MessageSquare, ChevronRight, CheckCircle2, XCircle, Trophy, Zap, ArrowRight, X, Shield, Star, RotateCcw, Home, Eye, Bot, UserCheck, Volume2, AlertTriangle, Heart, Sparkles, Terminal, Cpu, Database, Laptop, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRandomCodingQuestions, CodingQuestion } from '@/data/codingQuestions';
import Logo from '@/components/Logo';

const META: Record<string,{name:string,icon:string,color:string}> = {
  javascript:{name:'JavaScript',icon:'⚡',color:'#FF3366'}, python:{name:'Python',icon:'🐍',color:'#3776AB'},
  cpp:{name:'C++',icon:'⚙️',color:'#00599C'}, typescript:{name:'TypeScript',icon:'🔷',color:'#3178C6'},
  sql:{name:'SQL',icon:'🗄️',color:'#4479A1'}, react:{name:'React',icon:'⚛️',color:'#61DAFB'},
  nodejs:{name:'Node.js',icon:'🟢',color:'#10B981'}, nextjs:{name:'Next.js',icon:'▲',color:'#FFFFFF'},
};

const MENTORS = [
  {name:'Dr. Priya K.',avatar:'PK',skill:'Full-Stack',status:'online'},
  {name:'Rahul M.',avatar:'RM',skill:'Algorithms',status:'online'},
  {name:'Sneha D.',avatar:'SD',skill:'System Design',status:'busy'},
];

const AI_REPLIES = [
  "Try breaking the problem into smaller recursive subproblems.",
  "Consider evaluating performance using a Hash Map with O(1) average lookup.",
  "Check edge constraints: are empty parameters, negative limits, or overflow boundaries accounted for?",
  "Analyze structural complexity. Could a greedy sliding window optimize memory allocations?",
  "The TypeScript compiler suggests structural types mismatch, check return interfaces.",
  "Excellent syntactic optimization path! Proceed with verification.",
  "Verify allocation size boundaries prior to thread dispatching."
];

type Phase = 'protocols' | 'coding' | 'results';
type Role = 'coder' | 'navigator';
type ChatMsg = {from:string;text:string;time:string};

function CodingRoomContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const stack = sp.get('skill') || 'javascript';
  const partnerName = sp.get('partner') || 'Aarav Mehta';
  const partnerAvatar = sp.get('avatar') || 'AM';
  const m = META[stack] || META.javascript;

  const [phase, setPhase] = useState<Phase>('protocols');
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [activeQ, setActiveQ] = useState(0);
  const [code, setCode] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30*60);
  const [role, setRole] = useState<Role>('coder');
  const [roleSwaps, setRoleSwaps] = useState(0);
  const [micOn, setMicOn] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([{from:'bot',text:'[SYSTEM] Connected to AI diagnostic telemetry socket. Ask me anything about the coding challenges.',time:'now'}]);
  const [chatInput, setChatInput] = useState('');
  const [testResults, setTestResults] = useState<(boolean|null)[][]>([]);
  const [partnerReady, setPartnerReady] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [feedback, setFeedback] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [tickerMsg, setTickerMsg] = useState('Teammate connected to matching room');
  const [mentorAlertStatus, setMentorAlertStatus] = useState<'idle'|'requesting'|'dispatched'>('idle');

  // Load questions
  useEffect(() => {
    const qs = getRandomCodingQuestions(stack, 2);
    setQuestions(qs);
    setCode(qs.map(q => q.starter));
    setTestResults(qs.map(q => q.testCases.map(() => null)));
  }, [stack]);

  // Telemetry countdown
  useEffect(() => {
    if (phase !== 'coding') return;
    const t = setInterval(() => {
      setTimeLeft(p => { 
        if (p <= 1) { 
          clearInterval(t); 
          finishSession(); 
          return 0; 
        } 
        return p - 1; 
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Teammate typing/compiling simulation ticker
  useEffect(() => {
    if (phase !== 'coding') return;
    const tickers = [
      `${partnerName} is checking test cases...`,
      `${partnerName} updated lines inside solution...`,
      `${partnerName} is inspecting computational time complexity...`,
      `${partnerName} started WebRTC audio voice stream...`,
      `${partnerName} changed character allocations...`
    ];
    const t = setInterval(() => {
      setTickerMsg(tickers[Math.floor(Math.random() * tickers.length)]);
    }, 9000);
    return () => clearInterval(t);
  }, [phase, partnerName]);

  // Fullscreen block rules for strict test arena
  useEffect(() => {
    if (phase !== 'coding') return;
    
    // Attempt fullscreen
    (async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (_) {}
    })();

    const block = () => window.history.pushState(null, '', window.location.href);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', block);

    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F11' || e.key === 'F5' || e.key === 'F12') { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }
      if ((e.ctrlKey || e.metaKey) && ['w', 't', 'n', 'r', 'l', 'q'].includes(e.key.toLowerCase())) { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }
      if (e.altKey && (e.key === 'Tab' || e.key === 'F4')) { 
        e.preventDefault(); 
        e.stopPropagation(); 
      }
    };
    window.addEventListener('keydown', blockKeys, true);

    const blockCtxMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', blockCtxMenu);

    const onBlur = () => { 
      try { 
        window.focus(); 
      } catch (_) {} 
    };
    window.addEventListener('blur', onBlur);

    return () => { 
      window.removeEventListener('popstate', block); 
      window.removeEventListener('keydown', blockKeys, true); 
      window.removeEventListener('contextmenu', blockCtxMenu); 
      window.removeEventListener('blur', onBlur); 
    };
  }, [phase]);

  const finishSession = useCallback(() => {
    setPhase('results');
    (async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (_) {}
    })();

    // Update LocalStorage metrics
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress') || '{}');
      p.codeDone = true;
      p.sessions = (p.sessions || 0) + 1;
      const allTests = testResults.flat();
      const passedCount = allTests.filter(t => t === true).length;
      const earnedHp = passedCount * 15 + roleSwaps * 5;
      p.hp = (p.hp || 0) + earnedHp;
      
      const today = new Date().toISOString().split('T')[0];
      if (p.lastDate !== today) { 
        p.streak = (p.streak || 0) + 1; 
        p.lastDate = today; 
      }
      localStorage.setItem('dateforcode_progress', JSON.stringify(p));
    } catch (_) {}
  }, [testResults, roleSwaps]);

  const runTests = () => {
    const res = [...testResults];
    // Simulating compiling run with high accuracy chance
    res[activeQ] = questions[activeQ].testCases.map(() => Math.random() > 0.25);
    setTestResults(res);
    setTickerMsg(`Compiling solution.${stack === 'cpp' ? 'cpp' : 'js'} results compiled.`);
  };

  const toggleRole = () => { 
    setRole(r => r === 'coder' ? 'navigator' : 'coder'); 
    setRoleSwaps(s => s + 1); 
    setTickerMsg(`Role swapped: You are now a ${role === 'coder' ? 'navigator' : 'coder'}.`);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMsgs(p => [...p, { from: 'you', text: chatInput, time: now }]);
    setChatInput('');
    setTimeout(() => {
      setChatMsgs(p => [...p, { from: 'bot', text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };

  // Live stuck intervention simulation
  const triggerMentorIntervention = () => {
    setMentorAlertStatus('requesting');
    setTickerMsg("DISPATCHING STUCK ALERT TELEMETRY METRIC TO LIVE MENTOR HUBS...");
    
    // Simulate mentor dispatching within 4 seconds
    setTimeout(() => {
      setMentorAlertStatus('dispatched');
      setTickerMsg("LIVE MENTOR HAS BEEN DISPATCHED TO ENCRYPTED STREAM LINK.");
      
      // Inject to chat
      setChatMsgs(p => [...p, {
        from: 'system',
        text: 'Live Mentor Dr. Priya K. has joined the session channel to guide your stuck thread.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 4000);
  };

  useEffect(() => { 
    if (!myReady) return; 
    const t = setTimeout(() => setPartnerReady(true), 3000); 
    return () => clearTimeout(t); 
  }, [myReady]);

  useEffect(() => { 
    if (myReady && partnerReady) finishSession(); 
  }, [myReady, partnerReady, finishSession]);

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
  const totalTests = testResults.flat();
  const passedCount = totalTests.filter(t => t === true).length;
  const failedCount = totalTests.filter(t => t === false).length;
  const hpEarned = passedCount * 15 + roleSwaps * 5;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center font-mono text-xs text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3366]" />
          <p>LOADING SECURE TESTING ENVIRONMENT PORT...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-[#08090C] text-[#F3F4F6] z-[9999] flex flex-col overflow-hidden font-sans">
      <AnimatePresence mode="wait">

        {/* ════ PHASE 1: ELITE PROTOCOLS HANDSHAKE ════ */}
        {phase === 'protocols' && (
          <motion.div 
            key="proto" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto"
          >
            <motion.div 
              initial={{ y: 25, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="max-w-xl w-full"
            >
              <div className="ide-panel bg-[#15171F] border-[#2A2E3D] p-6 md:p-8 rounded-lg overflow-hidden flex flex-col justify-between">
                
                {/* Panel Header */}
                <div className="ide-panel-header w-full justify-between py-2 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80 px-4 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
                  <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#FF3366]" /> ROOM_HANDSHAKE_VALIDATOR.EXE
                  </span>
                  <span className="text-[10px] font-mono text-accent-pink uppercase font-bold tracking-widest">SECURE SYSTEM</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded border border-[#2A2E3D] flex items-center justify-center text-2xl bg-[#0D0E12]" style={{ color: m.color }}>
                    {m.icon}
                  </div>
                  <div>
                    <h2 className="text-base font-mono font-bold text-white uppercase">{m.name} Multiplayer Arena</h2>
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">// ENCRYPTED SOCKET CONNECTION SUCCESS</p>
                  </div>
                </div>

                {/* Rules Monospace Checklist */}
                <div className="space-y-2 mb-6">
                  {[
                    { icon: Clock, text: 'Strict 30 minutes allocation to solve 2 telemetry modules.', hl: false },
                    { icon: Users, text: `Active Node Link: Teammate ${partnerName.toUpperCase()} connected.`, hl: false },
                    { icon: Code2, text: 'Driver/Navigator protocol active. Swap control key anytime.', hl: false },
                    { icon: Mic, text: 'Integrated WebRTC voice & viewport diagnostics.', hl: false },
                    { icon: Shield, text: 'Security sandbox mode. Navigation tab change registers tab-out warning.', hl: true },
                    { icon: Trophy, text: 'XP Velocity: +15 HP per passed case, +5 HP per driver swap.', hl: true }
                  ].map((r, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded border font-mono text-[10px] ${
                        r.hl 
                          ? 'bg-[#FF3366]/5 border-[#FF3366]/30 text-[#FF3366]' 
                          : 'bg-[#0D0E12]/40 border-[#2A2E3D]/50 text-gray-400'
                      }`}
                    >
                      <r.icon className="w-4 h-4 shrink-0" style={{ color: r.hl ? '#FF3366' : m.color }} />
                      <span>{r.text.toUpperCase()}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  onClick={() => setPhase('coding')}
                  className="w-full py-3.5 rounded bg-[#FF3366] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#FF3366] hover:border-[#FF5E85] shadow-[0_0_15px_rgba(255,51,102,0.25)] transition-all"
                >
                  <Code2 className="w-4 h-4"/> Compile Handshake & Enter <ArrowRight className="w-4 h-4"/>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ════ PHASE 2: FLAGSHIP MULTIPLAYER SPLIT IDE TERMINAL ════ */}
        {phase === 'coding' && (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col">
            
            {/* Top Workspace Toolbar */}
            <div className="bg-[#0D0E12] border-b border-[#2A2E3D]/60 px-5 py-3 flex items-center justify-between flex-shrink-0 z-30 font-mono">
              <div className="flex items-center gap-4">
                <Logo showText={true} className="scale-[0.7] origin-left" />
                <div className="w-px h-5 bg-[#2A2E3D]" />
                
                {/* Driver / Navigator Key Badging */}
                <div 
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-bold uppercase border transition-all duration-300 ${
                    role === 'coder' 
                      ? 'bg-[#FF3366]/10 border-[#FF3366]/30 text-[#FF3366]' 
                      : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]'
                  }`}
                >
                  {role === 'coder' ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{role === 'coder' ? 'Driver (Active Control)' : 'Navigator (Telemetry Monitor)'}</span>
                </div>

                <button 
                  onClick={toggleRole} 
                  className="px-2.5 py-1 rounded text-[9px] font-bold uppercase border border-[#2A2E3D] hover:border-gray-500 bg-[#15171F] text-gray-400 hover:text-white transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> Swap Roles
                </button>
              </div>

              {/* Central Active Compiler Sim Ticker */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#15171F] border border-[#2A2E3D]/50 rounded text-[9px] text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                <span>{tickerMsg.toUpperCase()}</span>
              </div>

              {/* Workspace Telemetries & Controls */}
              <div className="flex items-center gap-2">
                {/* Teammate status indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#15171F] border border-[#2A2E3D] text-[9px]">
                  <div className="w-5 h-5 rounded bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-white text-[9px] font-bold">{partnerAvatar}</div>
                  <span className="text-gray-400">{partnerName.toUpperCase()}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                </div>

                <div className="w-px h-5 bg-[#2A2E3D]" />

                {/* Voice channel toggle */}
                <button 
                  onClick={() => setMicOn(!micOn)} 
                  className={`p-2 rounded border transition-all ${
                    micOn 
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                      : 'bg-[#15171F] border-[#2A2E3D] text-gray-500 hover:text-white'
                  }`}
                  title={micOn ? 'Mute' : 'Unmute'}
                >
                  {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>

                {/* Screen Share toggle */}
                <button 
                  onClick={() => setScreenShare(!screenShare)} 
                  className={`p-2 rounded border transition-all ${
                    screenShare 
                      ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.15)]' 
                      : 'bg-[#15171F] border-[#2A2E3D] text-gray-500 hover:text-white'
                  }`}
                  title="Share Viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>

                {/* AI stuck assistant panel button */}
                <button 
                  onClick={() => { setShowChat(!showChat); setShowMentor(false); }} 
                  className={`p-2 rounded border transition-all ${
                    showChat 
                      ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 text-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.15)]' 
                      : 'bg-[#15171F] border-[#2A2E3D] text-gray-500 hover:text-white'
                  }`}
                  title="AI Diagnostic Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                {/* live mentor stuck intervention trigger button */}
                <button 
                  onClick={triggerMentorIntervention} 
                  disabled={mentorAlertStatus !== 'idle'}
                  className={`px-3 py-2 rounded font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    mentorAlertStatus === 'requesting'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 animate-pulse'
                      : mentorAlertStatus === 'dispatched'
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-400'
                      : 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                  }`}
                  title="Intervention Stuck Request"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{mentorAlertStatus === 'requesting' ? 'Requesting...' : mentorAlertStatus === 'dispatched' ? 'Mentor Online' : 'Stuck Intervention'}</span>
                </button>

                <div className="w-px h-5 bg-[#2A2E3D]" />

                {/* Monospace Telemetry Clock */}
                <div className={`px-3 py-1.5 rounded font-mono text-xs font-bold border flex items-center gap-1.5 ${
                  timeLeft < 300 
                    ? 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366] animate-pulse' 
                    : 'bg-[#15171F] border-[#2A2E3D] text-white/95'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
                </div>

                <button 
                  onClick={() => setShowEndConfirm(true)} 
                  className="px-3 py-1.5 rounded border border-[#FF3366]/30 text-[#FF3366] text-[9px] font-bold uppercase bg-[#FF3366]/5 hover:bg-[#FF3366]/15 transition-all"
                >
                  Exit Room
                </button>
              </div>
            </div>

            {/* End session confirm dialog */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#08090C]/80 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#15171F] border border-[#2A2E3D] rounded-lg shadow-2xl p-6 max-w-sm w-full mx-4 font-mono text-xs">
                    <div className="w-12 h-12 mx-auto rounded border border-red-500/20 bg-red-500/5 flex items-center justify-center mb-4"><AlertTriangle className="w-6 h-6 text-red-500"/></div>
                    <h3 className="text-sm font-bold text-center text-white mb-2 uppercase">End Coding Session?</h3>
                    <p className="text-gray-400 text-center mb-6 leading-relaxed">Closing this viewport compiles existing progress and returns both nodes back to the dashboard command panels.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowEndConfirm(false)} className="flex-1 py-2 rounded border border-[#2A2E3D] hover:border-gray-500 bg-[#0D0E12] text-gray-500 hover:text-white uppercase transition-all">Cancel</button>
                      <button onClick={() => { setShowEndConfirm(false); finishSession(); }} className="flex-1 py-2 rounded bg-[#FF3366] text-white hover:bg-[#FF3366]/90 border border-[#FF3366] uppercase transition-all">Compile & Exit</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden relative">
              {/* LEFT — Question thread & compiler test nodes */}
              <div className="w-[380px] bg-[#15171F] border-r border-[#2A2E3D]/50 flex flex-col flex-shrink-0 z-20 font-mono">
                <div className="flex border-b border-[#2A2E3D]/50 bg-[#0D0E12] px-2 pt-2 gap-1">
                  {questions.map((_, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveQ(i)} 
                      className={`px-4 py-2 text-[10px] font-bold rounded-t border-t border-x transition-colors ${
                        i === activeQ 
                          ? 'bg-[#15171F] text-[#FF3366] border-[#2A2E3D]/80' 
                          : 'text-gray-500 border-transparent hover:text-gray-300'
                      }`}
                    >
                      MODULE_0{i + 1}.TS
                    </button>
                  ))}
                </div>

                {/* Challenge specs viewport */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#15171F]/40 scrollbar-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#FF3366]/30 bg-[#FF3366]/5 text-[#FF3366]">
                      DIFFICULTY: {questions[activeQ]?.difficulty.toUpperCase()}
                    </span>
                    <span className="text-[8px] text-gray-500">Telemetry Socket: #082-Q</span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-white uppercase">{questions[activeQ]?.title}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{questions[activeQ]?.desc}</p>
                  
                  <div className="w-full h-px bg-[#2A2E3D]/50" />
                  
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#FF3366] mb-2">SYSTEM_TEST_CASES</p>
                  <div className="space-y-2">
                    {questions[activeQ]?.testCases.map((tc, i) => {
                      const r = testResults[activeQ]?.[i];
                      return (
                        <div 
                          key={i} 
                          className={`rounded border p-3 text-[10px] bg-[#0D0E12]/50 ${
                            r === true 
                              ? 'border-[#10B981]/40 text-[#10B981]' 
                              : r === false 
                              ? 'border-[#FF3366]/40 text-[#FF3366]' 
                              : 'border-[#2A2E3D]/40 text-gray-400'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-500 text-[8px] uppercase">TEST_SUITE_0{i + 1}</span>
                            {r !== null && (r ? <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> : <XCircle className="w-3.5 h-3.5 text-[#FF3366]" />)}
                          </div>
                          <p className="overflow-x-auto scrollbar-none"><span className="text-gray-500">IN:</span> {tc.input}</p>
                          <p className="overflow-x-auto scrollbar-none"><span className="text-gray-500">EXPECTED:</span> {tc.expected}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Operations footer */}
                <div className="p-4 border-t border-[#2A2E3D]/50 space-y-2 bg-[#0D0E12]/80">
                  <button 
                    onClick={runTests} 
                    className="w-full py-2.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Test Suite (Compile)
                  </button>
                  <button 
                    onClick={() => setMyReady(true)} 
                    disabled={myReady}
                    className={`w-full py-2.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      myReady 
                        ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]' 
                        : 'border-[#2A2E3D] text-gray-500 hover:text-white'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" /> 
                    <span>{myReady ? (partnerReady ? 'MUTUAL HANDSHAKE SUCCESSFUL' : 'WAITING FOR PEER HANDSHAKE...') : 'SUBMIT SOLUTION MATRIX'}</span>
                  </button>
                </div>
              </div>

              {/* CENTER — Premium Code Terminal Window (High Density Editor UI) */}
              <div className="flex-1 flex flex-col bg-[#0D0E12] relative z-10">
                <div className="bg-[#08090C] px-4 py-2.5 flex items-center justify-between border-b border-[#2A2E3D]/50 font-mono">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    SOLUTION.{stack === 'cpp' ? 'cpp' : stack === 'python' ? 'py' : 'ts'}
                  </span>
                  <span className="text-[9px] text-[#FF3366] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366]" /> LIVE EDITOR CONNECTED
                  </span>
                </div>
                
                <div className="flex-1 relative overflow-hidden font-mono flex">
                  {/* Line numbers pane */}
                  <div className="w-10 bg-[#08090C] border-r border-[#2A2E3D]/30 flex flex-col items-center pt-3 text-[10px] text-gray-600 select-none overflow-hidden leading-[21px]">
                    {(code[activeQ] || '').split('\n').map((_, i) => (
                      <div key={i} className="h-[21px]">{i + 1}</div>
                    ))}
                  </div>

                  {/* Core Interactive Editor Textarea */}
                  <textarea 
                    value={code[activeQ] || ''} 
                    onChange={e => {
                      if (role === 'coder') {
                        const c = [...code];
                        c[activeQ] = e.target.value;
                        setCode(c);
                        setTickerMsg("Compiling keystrokes in active driver session...");
                      }
                    }}
                    disabled={role !== 'coder'}
                    className="flex-1 h-full pl-3 pr-4 py-3 bg-[#0D0E12] text-sm text-[#CDD6F4] resize-none outline-none leading-[21px] caret-[#FF3366] overflow-y-auto border-none focus:ring-0"
                    spellCheck={false} 
                    style={{ tabSize: 2 }}
                    placeholder="// Waiting for driver control key swap to write code..."
                  />

                  {/* Teammate custom cursor simulation over the IDE */}
                  {role === 'navigator' && (
                    <motion.div 
                      className="absolute pointer-events-none flex flex-col items-start"
                      animate={{ x: [100, 180, 120, 240, 160], y: [80, 160, 220, 110, 190] }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="w-[1.5px] h-4 bg-[#FF3366] animate-pulse" />
                      <div className="px-1.5 py-0.5 rounded bg-[#FF3366] text-[8px] font-bold text-white font-mono uppercase tracking-widest mt-1 shadow-md">
                        {partnerName} typing...
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* RIGHT — Collapsible AI stuck compiler diagnostic chat */}
              <AnimatePresence>
                {(showChat || showMentor) && (
                  <motion.div 
                    initial={{ width: 0, opacity: 0 }} 
                    animate={{ width: 300, opacity: 1 }} 
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-[#15171F] border-l border-[#2A2E3D]/50 flex flex-col overflow-hidden flex-shrink-0 z-20 font-mono text-[10px]"
                  >
                    <div className="flex border-b border-[#2A2E3D]/50 bg-[#0D0E12]">
                      <button 
                        onClick={() => { setShowChat(true); setShowMentor(false); }} 
                        className={`flex-1 py-3 font-bold uppercase transition-colors ${
                          showChat 
                            ? 'text-[#FF3366] bg-[#15171F] border-b-2 border-[#FF3366]' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <Bot className="w-3.5 h-3.5 inline mr-1" /> Diagnostic Bot
                      </button>
                      <button 
                        onClick={() => { setShowMentor(true); setShowChat(false); }} 
                        className={`flex-1 py-3 font-bold uppercase transition-colors ${
                          showMentor 
                            ? 'text-[#F59E0B] bg-[#15171F] border-b-2 border-[#F59E0B]' 
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Active Mentors
                      </button>
                    </div>

                    {showChat && (
                      <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#15171F]/20 scrollbar-none flex flex-col justify-end">
                          {chatMsgs.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                              <div 
                                className={`max-w-[90%] px-3 py-2.5 rounded border text-[10px] leading-relaxed ${
                                  msg.from === 'you' 
                                    ? 'bg-[#3B82F6]/5 border-[#3B82F6]/30 text-white' 
                                    : msg.from === 'system'
                                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#A78BFA]'
                                    : 'bg-[#0D0E12] border-[#2A2E3D]/80 text-gray-400'
                                }`}
                              >
                                {msg.from === 'bot' && <Bot className="w-3 h-3 inline mr-1.5 text-[#10B981]" />}
                                {msg.text}
                                <span className="block text-[7px] text-gray-600 mt-1 uppercase">{msg.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-[#2A2E3D]/50 bg-[#0D0E12] flex gap-2">
                          <input 
                            value={chatInput} 
                            onChange={e => setChatInput(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && sendChat()}
                            placeholder="QUERY DIAGNOSTIC BOT..." 
                            className="flex-1 bg-[#15171F] rounded px-3 py-2 text-[10px] text-white outline-none border border-[#2A2E3D] placeholder:text-gray-700 font-bold"
                          />
                          <button 
                            onClick={sendChat} 
                            className="p-2 rounded bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white border border-[#3B82F6] transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}

                    {showMentor && (
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#15171F]/20 scrollbar-none">
                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-wider mb-2">LIVE MENTOR SHIELDS ONLINE</p>
                        {MENTORS.map((mt, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded bg-[#0D0E12] border border-[#2A2E3D] font-mono">
                            <div className="w-9 h-9 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[10px] font-black text-[#A78BFA]">
                              {mt.avatar}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-white">{mt.name.toUpperCase()}</p>
                              <p className="text-[8px] text-gray-500 uppercase">{mt.skill} // verified</p>
                            </div>
                            <button 
                              disabled={mt.status !== 'online'}
                              className={`px-2.5 py-1.5 rounded text-[8px] font-bold uppercase border transition-colors ${
                                mt.status === 'online' 
                                  ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25' 
                                  : 'border-[#2A2E3D] text-gray-600'
                              }`}
                            >
                              {mt.status === 'online' ? 'Connect' : 'Busy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ════ PHASE 3: COMPILATION AUDIT LOGS (RESULTS) ════ */}
        {phase === 'results' && (
          <motion.div 
            key="results" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#08090C] relative flex items-center justify-center"
          >
            {/* Holographic matrix sparklers */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div 
                key={i} 
                className="absolute rounded-full pointer-events-none" 
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -120 - Math.random() * 150, x: (Math.random() - 0.5) * 400, scale: [0, 1.2, 0] }}
                transition={{ duration: 2.2, delay: i * 0.06 }}
                style={{ 
                  width: 5 + Math.random() * 6, 
                  height: 5 + Math.random() * 6, 
                  left: '50%', 
                  top: '40%',
                  background: ['#FF3366', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i % 5] 
                }}
              />
            ))}

            <div className="max-w-2xl w-full text-center relative z-10 font-mono space-y-6">
              
              {/* Partner Peer avatars */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF3366] to-[#FF5E85] border border-[#FF3366]/40 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(255,51,102,0.2)]">
                  YOU
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }} 
                  className="w-10 h-10 rounded-full border border-[#10B981]/30 bg-[#10B981]/5 flex items-center justify-center shadow"
                >
                  <Heart className="w-4 h-4 text-[#10B981] fill-[#10B981]/20" />
                </motion.div>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] border border-[#3B82F6]/40 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  {partnerAvatar}
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> SESSION_TERMINATED_CLEAN
                </div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">
                  COMPILATION_<span className="text-[#10B981]">AUDIT</span>_LOGS.TXT
                </h2>
              </div>

              {/* High Density HP/XP metrics list */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tests Compiled', val: passedCount, desc: 'passed suites', color: 'text-[#10B981]', border: 'border-[#10B981]/20' },
                  { label: 'Failed Checks', val: failedCount, desc: 'missed specs', color: 'text-[#FF3366]', border: 'border-[#FF3366]/20' },
                  { label: 'Role Swaps', val: roleSwaps, desc: 'balanced loops', color: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]/20' },
                  { label: 'XP Telemetries', val: `+${hpEarned} HP`, desc: 'progression xp', color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' }
                ].map((s, i) => (
                  <motion.div 
                    key={s.label} 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`rounded p-4 bg-[#15171F] border ${s.border} text-center`}
                  >
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mb-2">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                    <p className="text-[7px] text-gray-600 uppercase mt-1 font-bold">{s.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Multi-pane code session diagnostics */}
              <div className="ide-panel bg-[#15171F] border-[#2A2E3D] rounded-lg overflow-hidden text-left">
                <div className="ide-panel-header w-full justify-between py-2 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80 px-4">
                  <span className="text-[9px] font-mono text-gray-500 uppercase flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-[#3B82F6]" /> COMPILER_METRIC_REPORT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[8px] font-bold">COMPILATION: SUCCESS</span>
                </div>
                <div className="p-5 grid grid-cols-3 gap-4 text-center font-mono">
                  <div className="p-3 border border-[#2A2E3D]/60 bg-[#0D0E12]/50 rounded">
                    <p className="text-xl font-bold text-white">{30 - mins}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider mt-1">Minutes elapsed</p>
                  </div>
                  <div className="p-3 border border-[#2A2E3D]/60 bg-[#0D0E12]/50 rounded">
                    <p className="text-xl font-bold text-white">{questions.length}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider mt-1">Questions analyzed</p>
                  </div>
                  <div className="p-3 border border-[#2A2E3D]/60 bg-[#0D0E12]/50 rounded">
                    <p className="text-xl font-bold text-white">{code.reduce((a, c) => a + c.split('\n').length, 0)}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider mt-1">Lines compiled</p>
                  </div>
                </div>
              </div>

              {/* Feedback Survey */}
              <div className="bg-[#15171F] border border-[#2A2E3D]/70 p-5 rounded text-center space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">COLLABORATIVE_EXPERIENCE_SURVEY</h4>
                  <p className="text-[9px] text-gray-500 uppercase mt-0.5">// RATE THE QUALITY OF ACTIVE COMPONENT PEERS</p>
                </div>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setFeedback(s)} className="transition-transform hover:scale-110">
                      <Star className="w-7 h-7" fill={s <= feedback ? '#F59E0B' : 'none'} color={s <= feedback ? '#F59E0B' : '#2A2E3D'} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
                {feedback > 0 && <p className="text-[9px] font-bold text-[#F59E0B] uppercase tracking-wider">{['', 'poor response telemetry', 'fair bandwidth alignment', 'good computational cooperation', 'great synergy factors', 'exceptional collaborative chemistry'][feedback]}</p>}
              </div>

              {/* CTA return routes */}
              <div className="flex gap-3 justify-center pt-2">
                <button 
                  onClick={() => router.push('/student/dashboard')} 
                  className="flex items-center gap-1.5 px-6 py-3 border border-[#2A2E3D] hover:border-gray-500 rounded bg-[#15171F] hover:bg-[#15171F]/80 text-xs text-gray-400 hover:text-white uppercase transition-all"
                >
                  <Home className="w-3.5 h-3.5" /> Return to Command Center
                </button>
                <button 
                  onClick={() => router.push('/student/skill-assessment')}
                  className="flex items-center gap-1.5 px-6 py-3 rounded bg-[#FF3366] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#FF3366]/90 border border-[#FF3366] hover:border-[#FF5E85] shadow-[0_0_15px_rgba(255,51,102,0.2)] transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Start New Session
                </button>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default function CodingRoom() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#08090C] flex flex-col items-center justify-center font-mono text-xs text-gray-500">
        <p>INITIALIZING MULTIPLAYER SECURE TELNET SOCKET...</p>
      </div>
    }>
      <CodingRoomContent />
    </React.Suspense>
  );
}
