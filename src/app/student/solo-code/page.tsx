"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, Code2, Play, CheckCircle2, XCircle, ChevronRight, ArrowRight, Home, Trophy, Zap, Sparkles, RotateCcw, Star, Clock, Bot, Send, X, AlertTriangle, Loader2, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { getRandomCodingQuestions, CodingQuestion } from '@/data/codingQuestions';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:30,scale:0.95}, animate:{opacity:1,y:0,scale:1}, transition:{duration:0.5,delay:d,ease:'easeOut'} as const });

const SKILLS = [
  { id:'javascript', name:'JavaScript', icon:'⚡', color:'#D97706' },
  { id:'python', name:'Python', icon:'🐍', color:'#3776AB' },
  { id:'typescript', name:'TypeScript', icon:'🔷', color:'#3178C6' },
  { id:'react', name:'React', icon:'⚛️', color:'#61DAFB' },
  { id:'nextjs', name:'Next.js', icon:'▲', color:'#555' },
  { id:'nodejs', name:'Node.js', icon:'🟢', color:'#339933' },
  { id:'cpp', name:'C++', icon:'⚙️', color:'#00599C' },
  { id:'sql', name:'SQL', icon:'🗄️', color:'#4479A1' },
];

const LOADING_MESSAGES = [
  "🧠 Waking up the compiler...",
  "☕ Giving caffeine to the code...",
  "🚀 Charging developer mode...",
  "🔍 Looking for bugs before they find you...",
  "💻 Summoning your coding arena...",
  "⚡ Plugging into the matrix..."
];

// --- MagneticCard Component ---
const MagneticCard = ({ s, i, onClick, selectedId }: { s: typeof SKILLS[0], i: number, onClick: () => void, selectedId: string }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });
  
  const [isHovered, setIsHovered] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  const isSelected = selectedId === s.id;

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    x.set(distanceX * 0.05);
    y.set(distanceY * 0.05);

    // Update cursor light position via css vars
    ref.current.style.setProperty('--lx', `${e.clientX - rect.left}px`);
    ref.current.style.setProperty('--ly', `${e.clientY - rect.top}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || clicked) return;
    const rect = ref.current.getBoundingClientRect();
    setClickPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setClicked(true);
    onClick();
  };

  const floatDelay = useRef(Math.random() * 2).current;

  return (
    <motion.div 
      {...fadeUp(0.15 + i * 0.05)} 
      whileHover={{ y: -8 }}
      className="relative"
    >
      <motion.button
        ref={ref}
        style={{ x: mouseXSpring, y: mouseYSpring }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        animate={isSelected ? { scale: 1.08, boxShadow: `0 0 30px ${s.color}40`, borderColor: `${s.color}60` } : {}}
        className={`w-full h-full relative group bg-white rounded-[24px] border p-8 text-center transition-all duration-300 overflow-hidden ${isSelected ? 'z-50' : 'border-gray-100 hover:shadow-2xl hover:border-transparent'}`}
      >
        {/* Background Shine (runs every 8s) */}
        <motion.div 
          className="absolute inset-0 z-0 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.8) 25%, transparent 30%)',
            backgroundSize: '200% 100%'
          }}
          animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
          transition={{ repeat: Infinity, duration: 0.9, repeatDelay: 7.1, ease: 'linear' }}
        />

        {/* Ripple Effect */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute rounded-full bg-white z-0 pointer-events-none"
              style={{ left: clickPos.x - 20, top: clickPos.y - 20, width: 40, height: 40 }}
            />
          )}
        </AnimatePresence>

        {/* Cursor Light Effect */}
        <div
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered || isSelected ? 1 : 0,
            background: `radial-gradient(circle 80px at var(--lx, 50%) var(--ly, 50%), rgba(255,255,255,0.1), transparent)`
          }}
        />

        {/* Card Base Colors (glow on hover) */}
        <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${isHovered || isSelected ? 'opacity-10' : 'opacity-0'}`} style={{background:s.color}} />
        <div className={`absolute inset-0 transition-opacity duration-500 blur-xl pointer-events-none ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`} style={{background:`radial-gradient(circle at 50% 0%, ${s.color}20, transparent 70%)`}} />
        
        {/* Icon */}
        <motion.div 
          className="relative z-10 w-16 h-16 mx-auto rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-5 transition-all duration-300"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, delay: floatDelay, ease: 'easeInOut' }}
        >
          <motion.span 
            animate={isSelected ? { rotate: 360 } : isHovered ? { rotate: [0, -8, 8, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="text-3xl block"
          >
            {s.icon}
          </motion.span>
        </motion.div>
        
        <p className="relative z-10 text-base font-bold text-gray-800 tracking-wide">{s.name}</p>
        
        {/* Bottom bar indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-50 overflow-hidden">
          <div className={`h-full w-0 transition-all duration-700 ease-out ${isHovered || isSelected ? 'w-full' : ''}`} style={{background:s.color}}/>
        </div>
      </motion.button>
    </motion.div>
  );
};

// --- Particle Field Component ---
const ParticleField = () => {
  const [particles, setParticles] = useState<{id:number, x:number, size:number, opacity:number, delay:number, duration:number}[]>([]);
  useEffect(() => {
    const p = Array.from({length: 40}).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 15
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute bottom-[-10px] rounded-full blur-[1px]"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, opacity: p.opacity, boxShadow: '0 0 6px 1px rgba(96, 165, 250, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
          animate={{ y: ['0vh', '-110vh'] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// --- Split Text Component for Heading ---
const SplitText = ({ text }: { text: string }) => {
  return (
    <span className="inline-block">
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function SoloCodePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'pick'|'loading'|'coding'|'results'>('pick');
  const [stack, setStack] = useState('');
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [code, setCode] = useState<string[]>([]);
  const [execState, setExecState] = useState<'idle' | 'compiling' | 'running' | 'finished' | 'submit_running' | 'submit_finished'>('idle');
  const [execProgress, setExecProgress] = useState(0); 
  const [expandedTc, setExpandedTc] = useState<number | null>(null);
  const [execStats, setExecStats] = useState<any>(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{role:string,text:string}[]>([{role:'ai',text:'Hi! I\'m your AI assistant. Ask me anything about your code.'}]);
  const [feedback, setFeedback] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  
  // Parallax Grid
  const gridX = useMotionValue(0);
  const gridY = useMotionValue(0);
  const gridXSpring = useSpring(gridX, { stiffness: 100, damping: 20, mass: 0.5 });
  const gridYSpring = useSpring(gridY, { stiffness: 100, damping: 20, mass: 0.5 });

  const handleGridMouseMove = (e: React.MouseEvent) => {
    const xPos = (e.clientX / window.innerWidth) - 0.5;
    const yPos = (e.clientY / window.innerHeight) - 0.5;
    gridX.set(xPos * 12); // Max 6px each way
    gridY.set(yPos * 12);
  };

  useEffect(() => {
    let interval: any;
    if (phase === 'loading') {
      interval = setInterval(() => {
        setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  const handleStackSelect = (skillId: string) => {
    setStack(skillId);
    setTimeout(() => {
      setPhase('loading');
      setTimeout(() => {
        const qs = getRandomCodingQuestions(skillId, 2);
        setQuestions(qs);
        setCode(qs.map(q => q.starter));
        setExecState('idle');
        setExecStats(null);
        setPhase('coding');
      }, 3000); // Wait 3s in loading screen
    }, 400); // Wait 400ms after click animation
  };

  const runTests = async (isSubmit = false) => {
    setExecState(isSubmit ? 'submit_running' : 'compiling');
    setExpandedTc(null);
    setExecProgress(0);
    
    // Fake compile delay
    await new Promise(r => setTimeout(r, 1500));
    
    // Simulate compilation error 5% of time
    if (Math.random() < 0.05) {
      setExecState('finished');
      setExecStats({ type: 'compile_error', log: "solution.cpp\nLine 24\nerror:\nexpected ';'" });
      return;
    }
    
    setExecState('running');
    
    const tcs = questions[qIdx].testCases;
    const hiddenCount = isSubmit ? 10 : 0; // Fake hidden cases count
    const totalCases = tcs.length + hiddenCount;
    
    const results = [];
    let hasFail = false;
    
    // Run visible cases sequentially
    for (let i = 0; i < tcs.length; i++) {
      setExecProgress(i);
      await new Promise(r => setTimeout(r, 600)); // Delay per test case
      
      const p = Math.random() > 0.35;
      if (!p) hasFail = true;
      
      // Memory limit / Time limit simulation
      let err = null;
      if (!p && Math.random() < 0.1) err = 'TLE';
      else if (!p && Math.random() < 0.1) err = 'MLE';
      else if (!p && Math.random() < 0.1) err = 'RE';
      
      const mockOut = p ? tcs[i].expected : (err ? null : "Incorrect Value");
      results.push({ passed: p, out: mockOut, time: Math.floor(Math.random()*20)+1, mem: (Math.random()*10+5).toFixed(1), err });
    }
    
    let hiddenResults = { passed: hiddenCount, failed: 0 };
    if (isSubmit && !hasFail) {
      for (let i=0; i<hiddenCount; i++) {
        setExecProgress(tcs.length + i);
        await new Promise(r => setTimeout(r, 100));
        if (Math.random() < 0.2) { hasFail = true; hiddenResults.failed++; hiddenResults.passed--; }
      }
    } else if (isSubmit && hasFail) {
      hiddenResults = { passed: Math.floor(hiddenCount/2), failed: Math.ceil(hiddenCount/2) };
    }
    
    setExecProgress(totalCases);
    setExecState(isSubmit ? 'submit_finished' : 'finished');
    setExecStats({ type: 'success', results, hiddenResults, time: 14, mem: 7.8, hasFail, totalVisible: tcs.length, totalHidden: hiddenCount });
  };

  const finishSession = () => {
    setPhase('results');
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
      p.sessions = (p.sessions||0) + 1;
      const passed = execStats?.type === 'success' ? execStats.results.filter((r:any)=>r.passed).length + (execStats.hiddenResults?.passed || 0) : 0;
      p.hp = (p.hp||0) + passed * 5;
      const today = new Date().toISOString().split('T')[0];
      if (p.lastDate !== today) { p.streak = (p.streak||0) + 1; p.lastDate = today; }
      localStorage.setItem('dateforcode_progress', JSON.stringify(p));
    } catch(_) {}
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatHistory(h => [...h, {role:'user',text:chatMsg}]);
    const msg = chatMsg; setChatMsg('');
    setTimeout(() => {
      setChatHistory(h => [...h, {role:'ai',text:`Great question about "${msg.slice(0,30)}..." — try breaking the problem into smaller steps. Check your edge cases!`}]);
    }, 800);
  };

  const m = SKILLS.find(s => s.id === stack) || SKILLS[0];
  const passed = execStats?.type === 'success' ? execStats.results.filter((r:any) => r.passed).length + (execStats.hiddenResults?.passed || 0) : 0;
  const failed = execStats?.type === 'success' ? execStats.results.filter((r:any) => !r.passed).length + (execStats.hiddenResults?.failed || 0) : 0;
  const hp = passed * 5;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden" onMouseMove={phase === 'pick' ? handleGridMouseMove : undefined}>
      {/* Background Gradient Animation */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(77,121,255,0.12) 0%, transparent 60%)',
          backgroundSize: '200% 200%'
        }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
      />
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(139,92,246,0.08) 0%, transparent 50%)',
          backgroundSize: '200% 200%'
        }}
        animate={{ backgroundPosition: ['100% 0%', '0% 100%', '100% 0%'] }}
        transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
      />
      
      {/* Dot pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
      </div>

      <ParticleField />

      <AnimatePresence mode="wait">
        {/* ═══ PICK SKILL ═══ */}
        {phase === 'pick' && (
          <motion.div key="pick" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0, scale:0.95}} transition={{duration:0.8}} className="flex-1 relative z-10">
            <motion.header initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="sticky top-0 z-20 bg-white/50 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/student/challenges" className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all border border-transparent">
                  <ArrowLeft className="w-4 h-4"/><span className="text-xs font-bold">Back</span>
                </Link>
                <div className="w-px h-5 bg-gray-200"/>
                <motion.div initial={{scale:0.85}} animate={{scale:1}} transition={{duration:0.8, ease: 'easeOut'}}>
                  <Logo showText={true} className="scale-[0.8] origin-left" />
                </motion.div>
              </div>
            </motion.header>

            <div className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10">
              <motion.div className="mb-16">
                <motion.div {...fadeUp(0.2)} className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                  <div className="relative w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#4D79FF] to-[#6B8AFF] flex items-center justify-center text-white shadow-2xl border border-white/20">
                    <Code2 className="w-10 h-10"/>
                  </div>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 mb-4 tracking-tight">
                  <SplitText text="Choose Your Stack" />
                </h1>
                
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.6 }}
                  className="text-sm md:text-base font-medium text-gray-500 max-w-md mx-auto"
                >
                  Master algorithms, practice data structures, and sharpen your logic in an isolated coding environment.
                </motion.p>
              </motion.div>

              <motion.div style={{ x: gridXSpring, y: gridYSpring }} className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {SKILLS.map((s,i) => (
                  <MagneticCard key={s.id} s={s} i={i} onClick={() => handleStackSelect(s.id)} selectedId={stack} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══ LOADING STACK ═══ */}
        {phase === 'loading' && (
          <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex items-center justify-center relative z-10">
            <div className="text-center space-y-6">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="w-16 h-16 mx-auto rounded-full border-4 border-gray-100 border-t-blue-500 shadow-xl"
              />
              <AnimatePresence mode="wait">
                <motion.p 
                  key={loadingMsgIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm font-mono font-bold text-gray-500 tracking-wider"
                >
                  {LOADING_MESSAGES[loadingMsgIdx]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ CODING ═══ */}
        {phase === 'coding' && (
          <motion.div key="coding" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col relative z-20">
            {/* Top Bar */}
            <div className="bg-[var(--ide-bg)] border-b border-[var(--ide-border)] px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setPhase('pick')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[10px] font-bold border border-[var(--ide-border)] hover:border-[var(--ide-border)] transition-all">
                  <ArrowLeft className="w-3 h-3"/>Back
                </motion.button>
                <div className="w-px h-5 bg-black/8"/>
                <span className="text-xl">{m.icon}</span>
                <span className="text-sm font-extrabold text-[var(--text-primary)]">{m.name}</span>
                <div className="w-px h-5 bg-black/8"/>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider" style={{background:`${m.color}15`,color:m.color,border:`1px solid ${m.color}25`}}>
                  <Code2 className="w-3.5 h-3.5"/>Solo Mode
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={()=>setShowChat(!showChat)} className={`p-2.5 rounded-xl border transition-all ${showChat?'bg-purple-50 border-purple-300 text-purple-600 shadow-sm':'bg-[var(--ide-bg)] border-[var(--ide-border)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
                  <Bot className="w-4 h-4"/>
                </motion.button>
                <div className="w-px h-5 bg-black/8"/>
                <div className="px-4 py-2 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] font-mono text-sm font-extrabold text-[var(--text-primary)]">
                  <Clock className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-muted)]"/>No Timer
                </div>
                <motion.button whileHover={{scale:1.03, boxShadow: '0 4px 12px rgba(34,197,94,0.2)'}} whileTap={{scale:0.97}} onClick={finishSession} className="px-4 py-2 rounded-xl bg-green-50 border border-green-300 text-green-600 text-xs font-extrabold uppercase tracking-wider transition-all">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1"/>Submit
                </motion.button>
                <motion.button whileHover={{scale:1.03, boxShadow: '0 4px 12px rgba(239,68,68,0.2)'}} whileTap={{scale:0.97}} onClick={()=>setShowEndConfirm(true)} className="px-4 py-2 rounded-xl bg-red-50 border border-red-300 text-red-500 text-xs font-extrabold uppercase tracking-wider transition-all">
                  <X className="w-3.5 h-3.5 inline mr-1"/>End
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {showEndConfirm && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] shadow-2xl p-8 max-w-sm w-full mx-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4"><AlertTriangle className="w-7 h-7 text-red-500"/></div>
                    <h3 className="text-lg font-black text-center text-[var(--text-primary)] mb-2">End Session?</h3>
                    <p className="text-xs text-center text-[var(--text-secondary)] mb-6">Your progress will be saved but you won't earn additional HP.</p>
                    <div className="flex gap-3">
                      <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>setShowEndConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--ide-border)] text-xs font-bold text-[var(--text-secondary)]">Cancel</motion.button>
                      <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>{setShowEndConfirm(false);finishSession();}} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold">End Session</motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden">
              {/* LEFT — Question */}
              <div className="w-[340px] flex-shrink-0 border-r border-[var(--ide-border)] bg-[var(--ide-bg)] overflow-y-auto p-5">
                <div className="flex gap-2 mb-4">
                  {questions.map((_,qi) => (
                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} key={qi} onClick={()=>setQIdx(qi)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${qi===qIdx?'text-white shadow-sm':'bg-white text-[var(--text-secondary)] border-[var(--ide-border)]'}`}
                      style={qi===qIdx?{background:m.color,borderColor:m.color}:{}}>
                      Q{qi+1}
                    </motion.button>
                  ))}
                </div>
                {questions[qIdx] && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase" style={{background:`${m.color}12`,color:m.color}}>{questions[qIdx].difficulty}</span>
                    </div>
                    <h3 className="text-base font-black text-[var(--text-primary)] mb-2">{questions[qIdx].title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">{questions[qIdx].desc}</p>

                    {execState === 'idle' ? (
                      <div className="mb-4">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Test Cases</p>
                        {questions[qIdx].testCases.map((tc,ti) => (
                          <div key={ti} className="flex flex-col p-2.5 rounded-lg mb-1.5 border bg-[var(--btn-sec-bg)] border-[var(--ide-border)] text-[10px]">
                            <div className="flex items-center gap-2 mb-1 text-[var(--text-secondary)] font-bold">
                              <Play className="w-3 h-3"/> Test Case {ti+1}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <div><span className="text-[8px] text-[var(--text-muted)] uppercase">Input</span><br/><code className="font-mono text-[var(--text-primary)]">{tc.input}</code></div>
                              <div><span className="text-[8px] text-[var(--text-muted)] uppercase">Expected</span><br/><code className="font-mono text-[var(--text-primary)]">{tc.expected}</code></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : execState === 'compiling' || execState === 'submit_running' ? (
                      <div className="mb-4 p-4 rounded-xl border border-blue-200 bg-blue-50 text-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto mb-2"/>
                        <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                          {execState === 'submit_running' ? "Running Hidden Cases..." : "Running Test Cases..."}
                        </p>
                        <p className="text-[10px] text-blue-500 mt-1">{LOADING_MESSAGES[execProgress % LOADING_MESSAGES.length]}</p>
                      </div>
                    ) : execState === 'running' ? (
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)] mb-1">
                          <span>Executing Test Cases...</span>
                          <span>{Math.round((execProgress / questions[qIdx].testCases.length)*100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
                          <motion.div className="h-full bg-blue-500 rounded-full" initial={{width:0}} animate={{width:`${(execProgress / questions[qIdx].testCases.length)*100}%`}}/>
                        </div>
                        {questions[qIdx].testCases.map((tc,ti) => {
                          const isActive = execProgress === ti;
                          const isDone = execProgress > ti;
                          const res = isDone ? execStats?.results[ti] : null;
                          return (
                            <motion.div key={ti} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
                              className={`flex items-center gap-2 p-2.5 rounded-lg mb-1.5 border text-[10px] transition-all 
                                ${isActive ? 'border-blue-400 bg-blue-50 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                : isDone && res?.passed ? 'bg-green-50 border-green-200'
                                : isDone && !res?.passed ? 'bg-red-50 border-red-200' 
                                : 'bg-[var(--btn-sec-bg)] border-[var(--ide-border)] opacity-50'}`}>
                              {isActive ? <Loader2 className="w-3 h-3 text-blue-500 animate-spin"/> : isDone && res?.passed ? <CheckCircle2 className="w-3 h-3 text-green-500"/> : isDone && !res?.passed ? <XCircle className="w-3 h-3 text-red-500"/> : <div className="w-3 h-3 rounded-full border border-gray-300"/>}
                              <span className={`font-bold ${isActive?'text-blue-700':isDone&&res?.passed?'text-green-700':isDone&&!res?.passed?'text-red-700':'text-[var(--text-muted)]'}`}>
                                Test Case {ti+1} {isActive?'Running...':isDone&&res?.passed?'Passed':isDone&&!res?.passed?'Failed':'Waiting'}
                              </span>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (execState === 'finished' || execState === 'submit_finished') && execStats ? (
                      <div className="mb-4">
                        {execStats.type === 'compile_error' ? (
                          <div className="rounded-xl overflow-hidden border border-red-300 shadow-sm">
                            <div className="bg-red-50 px-3 py-2 border-b border-red-200 flex items-center gap-2 text-[10px] font-bold text-red-700 uppercase tracking-wider">
                              <Terminal className="w-3.5 h-3.5"/> Compilation Error
                            </div>
                            <div className="bg-[#0f172a] p-3 overflow-x-auto text-[10px] font-mono text-red-400 whitespace-pre">
                              {execStats.log}
                            </div>
                          </div>
                        ) : execStats.type === 'success' ? (
                          <>
                            <div className={`p-4 rounded-xl border mb-4 shadow-sm ${execStats.hasFail ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                              <h4 className={`text-sm font-black mb-1 flex items-center gap-1 ${execStats.hasFail ? 'text-red-700' : 'text-green-700'}`}>
                                {execStats.hasFail ? <XCircle className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>} 
                                {execState === 'submit_finished' && !execStats.hasFail ? '🎉 Accepted' : execState === 'submit_finished' && execStats.hasFail ? '❌ Wrong Answer' : execStats.hasFail ? 'Test Cases Failed' : '🎉 All Test Cases Passed'}
                              </h4>
                              <p className={`text-[10px] font-bold ${execStats.hasFail?'text-red-500':'text-green-600'}`}>
                                {execState === 'submit_finished' ? 
                                  `${execStats.hiddenResults.passed} / ${execStats.totalHidden} Hidden Cases Passed` :
                                  `${execStats.results.filter((r:any)=>r.passed).length} / ${execStats.totalVisible} Public Cases Passed`}
                              </p>
                              
                              <div className="grid grid-cols-2 gap-2 mt-3 border-t border-black/5 pt-3">
                                <div><span className="text-[8px] uppercase tracking-wider opacity-60">Execution Time</span><p className="text-xs font-mono font-bold text-gray-800">{execStats.time} ms</p></div>
                                <div><span className="text-[8px] uppercase tracking-wider opacity-60">Memory</span><p className="text-xs font-mono font-bold text-gray-800">{execStats.mem} MB</p></div>
                              </div>
                            </div>

                            {execState === 'submit_finished' && (
                               <div className="mb-3 text-[10px] font-bold text-[var(--text-secondary)]">Hidden Test Cases executed securely.</div>
                            )}

                            {execStats.results.map((res:any, ti:number) => (
                              <motion.div key={ti} className={`mb-2 rounded-lg border overflow-hidden transition-all ${res.passed?'border-green-200':'border-red-300'}`}>
                                <button onClick={() => setExpandedTc(expandedTc === ti ? null : ti)} className={`w-full px-3 py-2 flex items-center justify-between text-[10px] font-bold ${res.passed?'bg-green-50 text-green-700':'bg-red-50 text-red-700'}`}>
                                  <div className="flex items-center gap-2">
                                    {res.passed ? <CheckCircle2 className="w-3 h-3"/> : <XCircle className="w-3 h-3"/>}
                                    Test Case {ti+1}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[9px] opacity-70">{res.time}ms</span>
                                    {expandedTc === ti ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                                  </div>
                                </button>
                                <AnimatePresence>
                                  {expandedTc === ti && (
                                    <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="overflow-hidden bg-white">
                                      <div className="p-3 grid grid-cols-1 gap-2 text-[10px]">
                                        {res.err && (
                                          <div className="p-2 rounded bg-red-100 text-red-700 font-bold mb-1">
                                            Runtime Error: {res.err === 'TLE' ? 'Time Limit Exceeded' : res.err === 'MLE' ? 'Memory Limit Exceeded' : 'Segmentation Fault'}
                                          </div>
                                        )}
                                        <div><span className="text-[8px] text-gray-400 uppercase">Input</span><div className="mt-1 p-1.5 bg-gray-50 rounded font-mono text-gray-600">{questions[qIdx].testCases[ti].input}</div></div>
                                        <div><span className="text-[8px] text-gray-400 uppercase">Expected</span><div className="mt-1 p-1.5 bg-gray-50 rounded font-mono text-gray-600">{questions[qIdx].testCases[ti].expected}</div></div>
                                        {!res.passed && !res.err && (
                                          <div><span className="text-[8px] text-red-400 uppercase">Your Output</span><div className="mt-1 p-1.5 bg-red-50 border border-red-200 text-red-600 rounded font-mono">{res.out}</div></div>
                                        )}
                                        {res.passed && (
                                          <div><span className="text-[8px] text-gray-400 uppercase">Your Output</span><div className="mt-1 p-1.5 bg-gray-50 rounded font-mono text-gray-600">{res.out}</div></div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </>
                        ) : null}
                      </div>
                    ) : null}

                    {execState === 'idle' || execStats?.type === 'compile_error' ? (
                      <motion.button whileHover={{scale:1.03, boxShadow:`0 10px 30px ${m.color}40`}} whileTap={{scale:0.97}} onClick={()=>runTests(false)}
                        className="w-full py-3 rounded-xl text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
                        style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`}}>
                        <Play className="w-3.5 h-3.5"/>Run Tests
                      </motion.button>
                    ) : execState === 'running' || execState === 'compiling' || execState === 'submit_running' ? (
                      <button disabled className="w-full py-3 rounded-xl bg-gray-200 text-gray-400 text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed transition-all">
                        <Loader2 className="w-3.5 h-3.5 animate-spin"/>Executing...
                      </button>
                    ) : (execState === 'finished' || execState === 'submit_finished') ? (
                      <div className="flex gap-2">
                         <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>runTests(false)}
                            className="flex-1 py-3 rounded-xl border border-[var(--ide-border)] text-xs font-extrabold uppercase tracking-wider text-[var(--text-secondary)] hover:bg-gray-50 transition-all">
                            Run Again
                         </motion.button>
                         {execState !== 'submit_finished' && (
                           <motion.button whileHover={{scale:1.03, boxShadow:`0 10px 30px rgba(34,197,94,0.4)`}} whileTap={{scale:0.97}} onClick={()=>runTests(true)}
                              className="flex-1 py-3 rounded-xl bg-green-500 text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center shadow-lg transition-all">
                              Submit
                           </motion.button>
                         )}
                      </div>
                    ) : null}
                  </>
                )}
              </div>

              {/* RIGHT — Editor */}
              <div className="flex-1 flex flex-col">
                <div className="bg-[var(--background)] px-4 py-2 flex items-center justify-between border-b border-[var(--ide-border)]/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/80"/><div className="w-3 h-3 rounded-full bg-yellow-400/80"/><div className="w-3 h-3 rounded-full bg-green-400/80"/></div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] ml-2">solution.{stack==='python'?'py':stack==='cpp'?'cpp':stack==='sql'?'sql':'js'}</span>
                  </div>
                </div>
                <textarea ref={editorRef} value={code[qIdx]||''} onChange={e=>{const c=[...code];c[qIdx]=e.target.value;setCode(c);}}
                  className="flex-1 bg-[var(--background)] text-[var(--text-primary)] font-mono text-sm p-5 resize-none focus:outline-none leading-relaxed"
                  style={{tabSize:2}} spellCheck={false}/>
              </div>

              {/* AI Chat */}
              <AnimatePresence>
                {showChat && (
                  <motion.div initial={{width:0,opacity:0}} animate={{width:300,opacity:1}} exit={{width:0,opacity:0}} className="border-l border-[var(--ide-border)] bg-[var(--ide-bg)] flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--ide-border)] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-purple-500"/><span className="text-xs font-bold">AI Assistant</span>
                      </div>
                      <button onClick={()=>setShowChat(false)}><X className="w-3.5 h-3.5 text-[var(--text-muted)]"/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {chatHistory.map((m,i)=>(
                        <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} key={i} className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${m.role==='ai'?'bg-purple-50 text-purple-800':'bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] ml-4'}`}>{m.text}</motion.div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-[var(--ide-border)] flex gap-2">
                      <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sendChat();}}
                        placeholder="Ask anything..." className="flex-1 px-3 py-2 rounded-lg border border-[var(--ide-border)] text-xs focus:outline-none focus:border-purple-300"/>
                      <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={sendChat} className="p-2 rounded-lg bg-purple-500 text-white"><Send className="w-3.5 h-3.5"/></motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ═══ RESULTS ═══ */}
        {phase === 'results' && (
          <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 overflow-y-auto p-8 bg-[var(--background)] relative z-10">
            {/* Confetti */}
            {Array.from({length:20}).map((_,i)=>(
              <motion.div key={i} className="absolute rounded-full pointer-events-none" initial={{opacity:0,scale:0,y:0}}
                animate={{opacity:[0,1,0],y:-120-i*8,x:(i%2===0?1:-1)*40*(i%5),scale:[0,1,0]}}
                transition={{duration:2,delay:i*0.05}}
                style={{width:5+i%4*2,height:5+i%4*2,left:'50%',top:'35%',background:['#10B981','#3B82F6','#8B5CF6','#F59E0B','#FF4D6D'][i%5]}}/>
            ))}

            <div className="max-w-lg mx-auto text-center relative z-10 mt-10">
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring'}}>
                <Sparkles className="w-12 h-12 mx-auto text-amber-400 mb-4"/>
              </motion.div>
              <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#4D79FF] to-[#6B8AFF] mb-2 tracking-tight">Session Complete!</h2>
              <p className="text-sm font-medium text-gray-500 mb-10">Great practice on <span className="font-bold" style={{color:m.color}}>{m.name}</span></p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[{icon:CheckCircle2,val:passed,label:'Passed',c:'#10B981'},{icon:XCircle,val:failed,label:'Failed',c:'#EF4444'},{icon:Trophy,val:`+${hp}`,label:'HP Earned',c:'#F59E0B'}].map((s,i)=>(
                  <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.1}}
                    className="rounded-[24px] p-6 bg-white border border-gray-100 shadow-sm text-center relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity" style={{background:s.c}}/>
                    <s.icon className="w-8 h-8 mx-auto mb-3" style={{color:s.c}}/>
                    <motion.p initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5+i*0.1,type:'spring'}} className="text-3xl font-black" style={{color:s.c}}>{s.val}</motion.p>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-2">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Feedback */}
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.8}} className="bg-white rounded-[24px] border border-gray-100 p-8 mb-8 shadow-sm">
                <p className="text-sm font-bold text-gray-800 mb-4">Rate your experience</p>
                <div className="flex gap-4 justify-center">
                  {[1,2,3,4,5].map(s=>(
                    <motion.button key={s} whileHover={{scale:1.15, y:-2}} whileTap={{scale:0.9}} onClick={()=>setFeedback(s)}>
                      <Star className="w-8 h-8 drop-shadow-sm transition-colors" fill={s<=feedback?'#F59E0B':'none'} color={s<=feedback?'#F59E0B':'#E5E7EB'} strokeWidth={1.5}/>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1}} className="flex gap-4 justify-center">
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-gray-100 text-sm font-extrabold text-gray-500 hover:text-gray-800 hover:border-gray-200 uppercase tracking-wider transition-colors">
                  <Home className="w-4 h-4"/>Dashboard
                </motion.button>
                <motion.button whileHover={{scale:1.03, boxShadow: `0 10px 30px ${m.color}30`}} whileTap={{scale:0.97}} onClick={()=>{setPhase('pick');setFeedback(0);setExecStats(null);setExecState('idle');setStack('');}}
                  className="flex items-center gap-2 px-10 py-4 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-lg transition-all"
                  style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`}}>
                  <RotateCcw className="w-4 h-4"/>Practice Again
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
