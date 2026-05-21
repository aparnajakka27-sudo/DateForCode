"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ChevronRight, ChevronLeft, Trophy, RotateCcw, Sparkles, Zap, Target, Home, AlertTriangle, Eye, EyeOff, ShieldCheck, X, Terminal as TerminalIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getRandomQuestions, PASS_MARK, TOTAL_QUESTIONS } from '@/data/questions';

const SKILL_META: Record<string,{name:string,icon:string,color:string}> = {
  javascript:{name:'JavaScript',icon:'⚡',color:'#FF3366'}, python:{name:'Python',icon:'🐍',color:'#3776AB'},
  typescript:{name:'TypeScript',icon:'🔷',color:'#3178C6'}, react:{name:'React',icon:'⚛️',color:'#61DAFB'},
  nextjs:{name:'Next.js',icon:'▲',color:'#FFFFFF'}, nodejs:{name:'Node.js',icon:'🟢',color:'#10B981'},
  java:{name:'Java',icon:'☕',color:'#ED8B00'}, cpp:{name:'C++',icon:'⚙️',color:'#00599C'},
  'html-css':{name:'HTML & CSS',icon:'🎨',color:'#E34F26'}, sql:{name:'SQL',icon:'🗄️',color:'#4479A1'},
  git:{name:'Git & GitHub',icon:'🔀',color:'#F05032'}, rust:{name:'Rust',icon:'🦀',color:'#CE422B'},
  go:{name:'Go',icon:'🐹',color:'#00ADD8'}, docker:{name:'Docker',icon:'🐳',color:'#2496ED'},
  aws:{name:'AWS Cloud',icon:'☁️',color:'#FF9900'}, flutter:{name:'Flutter',icon:'💙',color:'#02569B'},
};

type Question = {id:number,q:string,options:string[],answer:number};

export default function TestPage() {
  const router = useRouter();
  const params = useParams();
  const skillId = params.skillId as string;
  const meta = SKILL_META[skillId] || {name:'Assessment',icon:'📝',color:'#FF3366'};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number|null)[]>([]);
  const [selectedOption, setSelectedOption] = useState<number|null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Load questions
  useEffect(() => {
    const qs = getRandomQuestions(skillId, TOTAL_QUESTIONS);
    setQuestions(qs);
    setAnswers(new Array(qs.length).fill(null));
  }, [skillId]);

  // Fullscreen + navigation lock
  useEffect(() => {
    if (questions.length === 0 || isFinished) return;
    (async () => { try { await document.documentElement.requestFullscreen(); } catch(_) {} })();
    const blockBack = () => { window.history.pushState(null,'',window.location.href); };
    window.history.pushState(null,'',window.location.href);
    window.addEventListener('popstate', blockBack);
    const blockKeys = (e: KeyboardEvent) => { if(e.key==='Escape'||e.key==='F11'||(e.altKey&&e.key==='F4')) e.preventDefault(); };
    window.addEventListener('keydown', blockKeys);
    const blockBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', blockBeforeUnload);
    return () => { window.removeEventListener('popstate', blockBack); window.removeEventListener('keydown', blockKeys); window.removeEventListener('beforeunload', blockBeforeUnload); };
  }, [questions.length, isFinished]);

  const finishTest = useCallback(() => {
    setAnswers(prev => [...prev]);
    setIsFinished(true);
    (async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); } catch(_) {} })();
  }, []);

  // Timer
  useEffect(() => {
    if (isFinished || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => { if (prev <= 1) { clearInterval(timer); finishTest(); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished, questions.length, finishTest]);

  const selectOption = (oi: number) => { if (!isFinished) setSelectedOption(oi); };
  
  const confirmAndNext = () => {
    if (selectedOption === null && answers[currentQ] === null) return;
    const a = [...answers]; 
    if (selectedOption !== null) a[currentQ] = selectedOption; 
    setAnswers(a);
    setSelectedOption(null);
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };
  
  const goToPrev = () => { 
    if (currentQ > 0) { 
      setCurrentQ(currentQ - 1); 
      setSelectedOption(answers[currentQ - 1]); 
    } 
  };
  
  const goToQ = (i: number) => { 
    setCurrentQ(i); 
    setSelectedOption(answers[i]); 
  };

  const handleSubmit = () => {
    if (selectedOption !== null) { 
      const a = [...answers]; 
      a[currentQ] = selectedOption; 
      setAnswers(a); 
    }
    finishTest();
  };

  const score = answers.reduce((acc: number, ans, i) => (ans !== null && questions[i] && ans === questions[i].answer ? acc + 1 : acc), 0);
  const attempted = answers.filter(a => a !== null).length;
  const wrong = attempted - score;
  const passed = score >= PASS_MARK;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const active = selectedOption ?? answers[currentQ];

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#08090C] flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin mb-4"/>
        <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Allocating thread compilers...</p>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-[#08090C] text-[#F3F4F6] z-[9999] flex flex-col overflow-hidden font-sans developer-grid noise-bg">
      
      {/* ═══ TOP TELEMETRY BAR ═══ */}
      {!isFinished && (
        <>
          <div className="relative z-20 bg-[#0D0E12] border-b border-[#2A2E3D]/50 px-6 py-3.5 flex items-center justify-between flex-shrink-0 font-mono text-xs select-none">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center text-lg font-bold" style={{ color: meta.color }}>
                {meta.icon}
              </div>
              <div>
                <p className="text-white font-bold uppercase tracking-wider">{meta.name} telemetry scan</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                  PORT: 0{currentQ + 1} OF 10 // TARGET: {PASS_MARK}/10 SUCCESS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 border font-bold uppercase font-mono text-xs rounded ${
                timeLeft < 60 
                  ? 'bg-red-950/20 border-red-500/50 text-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
                  : 'bg-[#15171F] border-[#2A2E3D] text-white'
              }`}>
                <Clock className="w-4 h-4 text-accent-pink" />
                {mins.toString().padStart(2,'0')}:{secs.toString().padStart(2,'0')}
              </div>
              
              <div className="px-4 py-2 border border-[#2A2E3D] bg-[#15171F] text-xs font-bold text-gray-400 uppercase rounded">
                PORTS: {attempted}/{TOTAL_QUESTIONS}
              </div>

              <button 
                onClick={() => setShowEndConfirm(true)} 
                className="px-4 py-2 border border-red-900/30 hover:border-red-500 bg-red-950/10 text-red-400 hover:text-red-500 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5"
              >
                <X className="w-3.5 h-3.5"/>TERMINATE SCAN
              </button>
            </div>
          </div>

          <div className="h-[2px] bg-[#08090C] w-full flex-shrink-0 relative overflow-hidden">
            <motion.div 
              className="h-full" 
              style={{ background: meta.color }} 
              animate={{ width: `${((currentQ+1)/TOTAL_QUESTIONS)*100}%` }} 
              transition={{ duration: 0.2 }} 
            />
          </div>
        </>
      )}

      {/* ═══ MAIN CORE CONTENT ═══ */}
      {!isFinished ? (
        <div className="flex-1 flex overflow-hidden">
          
          {/* Question / Compiler Editor Panel */}
          <div className="flex-1 overflow-y-auto p-8 relative">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentQ} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.2 }} 
                className="max-w-2xl mx-auto space-y-6"
              >
                
                {/* IDE styled question pane */}
                <div className="ide-panel bg-[#15171F] border-[#2A2E3D] overflow-hidden">
                  <div className="ide-panel-header py-2.5 justify-between select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                      <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                      <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                      <span className="text-[10px] font-mono text-gray-500 uppercase ml-2">question_thread_node.cpp</span>
                    </div>
                    <span className="text-[9px] font-mono text-accent-pink uppercase font-bold tracking-widest">// SECURE_CORE</span>
                  </div>

                  <div className="p-8 space-y-4">
                    <span className="px-2 py-0.5 border border-accent-pink/30 bg-accent-pink/5 text-accent-pink text-[9px] font-mono font-bold uppercase rounded">
                      THREAD INDEX: {currentQ + 1}
                    </span>
                    <h2 className="text-lg md:text-xl font-mono font-bold text-white leading-relaxed pt-2">
                      {questions[currentQ].q}
                    </h2>
                  </div>
                </div>

                {/* Option Choice Buttons */}
                <div className="space-y-3">
                  {questions[currentQ].options.map((opt, oi) => {
                    const isSel = active === oi;
                    return (
                      <button 
                        key={oi} 
                        onClick={() => selectOption(oi)}
                        className={`w-full text-left p-4.5 rounded border transition-all duration-200 flex items-center gap-4 ${
                          isSel 
                            ? 'border-accent-pink bg-accent-pink/5 shadow-[0_0_15px_rgba(255,51,102,0.1)]' 
                            : 'border-[#2A2E3D] bg-[#15171F] hover:border-gray-600'
                        }`}
                      >
                        <div 
                          className={`w-8 h-8 rounded border font-mono font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${
                            isSel 
                              ? 'bg-[#FF3366] border-[#FF3366] text-white' 
                              : 'bg-[#0D0E12] border-[#2A2E3D] text-gray-400 group-hover:text-white'
                          }`}
                        >
                          {String.fromCharCode(65 + oi)}
                        </div>
                        <span className={`text-xs font-mono font-bold ${isSel ? 'text-white' : 'text-gray-300'}`}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Nav buttons */}
                <div className="flex items-center justify-between font-mono text-xs">
                  <button 
                    onClick={goToPrev} 
                    disabled={currentQ === 0} 
                    className="flex items-center gap-1.5 px-5 py-3 border border-[#2A2E3D] rounded text-gray-400 hover:text-white hover:border-gray-500 disabled:opacity-20 disabled:pointer-events-none transition-all uppercase font-bold"
                  >
                    <ChevronLeft className="w-4 h-4"/>Prev Thread
                  </button>
                  
                  <div className="flex items-center gap-3">
                    {currentQ === questions.length - 1 ? (
                      <button 
                        onClick={handleSubmit}
                        className="flex items-center gap-1.5 px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded font-bold uppercase transition-all shadow-lg shadow-green-950/20"
                      >
                        <ShieldCheck className="w-4 h-4"/>SUBMIT RESULTS
                      </button>
                    ) : (
                      <button 
                        onClick={confirmAndNext}
                        className="flex items-center gap-1.5 px-6 py-3.5 bg-[#FF3366] hover:bg-accent-pink-hover text-white rounded font-bold uppercase transition-all shadow-lg shadow-red-950/20"
                      >
                        Compile Next<ChevronRight className="w-4 h-4"/>
                      </button>
                    )}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Telemetry Grid Ports */}
          <div className="w-64 bg-[#0D0E12] border-l border-[#2A2E3D]/50 p-5 flex flex-col flex-shrink-0 overflow-y-auto font-mono select-none">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-1.5">
              <TerminalIcon className="w-3.5 h-3.5 text-accent-pink" />
              PROCESS THREADS
            </p>

            <div className="grid grid-cols-2 gap-2 mb-6 text-[10px]">
              {questions.map((_, i) => {
                const isCur = i === currentQ;
                const isAns = answers[i] !== null;
                
                let borderClass = "border-[#2A2E3D] text-gray-500 bg-transparent";
                if (isCur) borderClass = "border-accent-pink text-[#FF3366] bg-accent-pink/5 font-bold shadow-[0_0_8px_rgba(255,51,102,0.1)]";
                else if (isAns) borderClass = "border-accent-blue text-[#3B82F6] bg-accent-blue/5 font-bold";

                return (
                  <button 
                    key={i} 
                    onClick={() => goToQ(i)}
                    className={`p-2.5 rounded border text-left flex flex-col justify-between h-14 transition-all ${borderClass}`}
                  >
                    <span>PORT 0{i+1}</span>
                    <span className="text-[8px] font-bold opacity-60">
                      {isCur ? '[ACTIVE]' : isAns ? '[RESOLVED]' : '[EMPTY]'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 mt-auto text-[9px] font-bold text-gray-500 uppercase border-t border-[#2A2E3D]/30 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm border border-accent-pink bg-accent-pink/10"/> ACTIVE NODE
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm border border-accent-blue bg-accent-blue/10"/> COMPILATION CACHED
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm border border-[#2A2E3D] bg-transparent"/> PENDING QUEUE
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#2A2E3D]/30">
              <button 
                onClick={handleSubmit}
                className="w-full py-3 bg-[#10B981] hover:bg-green-600 text-white rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4"/>EXECUTE COMPILE
              </button>
            </div>
          </div>

        </div>
      ) : (
        
        /* ═══ RESULTS COMPILATION AUDIT ═══ */
        <div className="flex-1 overflow-y-auto relative p-8">
          
          {/* CONFETTI / ERROR PARTICLES FLOATING */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
            {passed && Array.from({length:20}).map((_, i) => (
              <motion.div 
                key={i} 
                className="absolute rounded-sm" 
                initial={{ opacity: 0, y: -20, x: Math.random() * 100 + 'vw' }}
                animate={{ opacity: [0, 0.8, 0.8, 0], y: ['0vh', '100vh'], rotate: [0, 360] }}
                transition={{ duration: 3 + Math.random() * 2, repeat: 1 }}
                style={{ 
                  left: `${Math.random() * 100}%`, 
                  width: 5 + Math.random() * 6, 
                  height: 5 + Math.random() * 6,
                  background: ['#FF3366', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i%5]
                }} 
              />
            ))}
          </div>

          <div className="max-w-2xl mx-auto space-y-8 relative z-20 pt-8 pb-16">
            
            {/* Audit log window */}
            <div className="ide-panel bg-[#15171F] border-[#2A2E3D] overflow-hidden">
              <div className="ide-panel-header py-2.5 justify-between select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase ml-2">compilation_audit_logs.txt</span>
                </div>
                <span className={`text-[9px] font-mono uppercase font-bold tracking-widest ${passed ? 'text-[#10B981]' : 'text-red-500'}`}>
                  {passed ? '// SUCCESS' : '// ERROR_OVERFLOW'}
                </span>
              </div>

              <div className="p-8 text-center space-y-4">
                <div className="relative w-20 h-20 mx-auto">
                  <div className={`absolute inset-0 rounded blur-lg opacity-30 ${passed ? 'bg-accent-green' : 'bg-red-500'}`} />
                  <div className="relative w-full h-full border border-[#2A2E3D] bg-[#0D0E12] rounded flex items-center justify-center text-4xl">
                    {passed ? '🏆' : '💪'}
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className={`text-2xl font-mono font-bold uppercase tracking-wider ${passed ? 'text-[#10B981]' : 'text-red-500'}`}>
                    {passed ? 'COMPILATION OK // CLEARED' : 'THREAD GRIDLOCKED // REATTEMPT'}
                  </h2>
                  <p className="text-gray-400 text-xs font-mono max-w-sm mx-auto leading-relaxed">
                    {passed 
                      ? `Successfully mapped ${score}/10 core logic ports in ${meta.name}. Synergy matrix verified ok.` 
                      : `Mapped ${score}/10 correct ports in ${meta.name}. Systems require 70%+ correct vectors to compile access.`
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Score Ring + Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border border-[#2A2E3D] rounded bg-[#0D0E12] p-8">
              
              {/* Radial score ring */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-36 h-36">
                  <div className={`absolute inset-2 rounded-full blur-xl opacity-20 ${passed ? 'bg-[#10B981]' : 'bg-red-500'}`} />
                  <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#2A2E3D" strokeWidth="6"/>
                    <motion.circle cx="60" cy="60" r="52" fill="none" strokeWidth="6" strokeLinecap="round"
                      stroke={passed ? '#10B981' : '#EF4444'} strokeDasharray={`${2*Math.PI*52}`}
                      initial={{ strokeDashoffset: 2*Math.PI*52 }} 
                      animate={{ strokeDashoffset: 2*Math.PI*52-(score/TOTAL_QUESTIONS)*2*Math.PI*52 }}
                      transition={{ delay: 0.2, duration: 1 }} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20 font-mono">
                    <span className={`text-4xl font-bold leading-none ${passed ? 'text-[#10B981]' : 'text-red-500'}`}>
                      {score}
                    </span>
                    <span className="text-[9px] text-gray-500 uppercase tracking-widest mt-0.5">OF 10 PORT</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded mt-1.5 ${passed ? 'bg-accent-green/10 text-accent-green' : 'bg-red-950/20 text-red-500'}`}>
                      {Math.round((score/TOTAL_QUESTIONS)*100)}% OK
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats telemetry */}
              <div className="md:col-span-7 grid grid-cols-2 gap-4 text-left font-mono">
                {[
                  { val: attempted, label: 'COMPILATIONS', color: '#3B82F6', icon: CheckCircle2 },
                  { val: score, label: 'VALID PORTS', color: '#10B981', icon: Target },
                  { val: wrong, label: 'CRITICAL ERR', color: '#EF4444', icon: XCircle },
                  { val: `+${score*5} HP`, label: 'PRESTIGE XP', color: '#F59E0B', icon: Trophy }
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded border border-[#2A2E3D] bg-[#15171F]/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded border flex items-center justify-center shrink-0" style={{ color: s.color, borderColor: `${s.color}25` }}>
                      <s.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-md font-bold text-white leading-none">{s.val}</p>
                      <p className="text-[8px] text-gray-500 uppercase font-bold tracking-widest mt-1">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Actions */}
            <div className="bg-[#15171F] border border-[#2A2E3D] rounded p-5 flex items-center justify-between font-mono text-xs select-none">
              <div className="flex items-center gap-3">
                {passed ? (
                  <>
                    <button 
                      onClick={() => router.push('/student/dashboard')} 
                      className="px-5 py-3 border border-[#2A2E3D] hover:border-gray-500 text-gray-400 hover:text-white rounded uppercase font-bold transition-colors"
                    >
                      Dashboard
                    </button>
                    
                    <button 
                      onClick={() => {
                        try {
                          const p = JSON.parse(localStorage.getItem('dateforcode_progress') || '{}');
                          p.skillDone = true;
                          const today = new Date().toISOString().split('T')[0];
                          if (p.lastDate !== today) {
                            p.streak = (p.streak || 0) + 1;
                            p.lastDate = today;
                          }
                          localStorage.setItem('dateforcode_progress', JSON.stringify(p));
                        } catch(_) {}
                        router.push(`/student/matching-room?skill=${skillId}`);
                      }}
                      className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded font-bold uppercase transition-all shadow-lg shadow-green-950/20 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4"/>ENTER MATCHING ROOM
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => router.push('/student/skill-assessment')} 
                      className="px-5 py-3 border border-[#2A2E3D] hover:border-gray-500 text-gray-400 hover:text-white rounded uppercase font-bold transition-colors"
                    >
                      Exit Node
                    </button>
                    
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-[#FF3366] hover:bg-accent-pink-hover text-white rounded font-bold uppercase transition-all shadow-lg shadow-red-950/20 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4"/>RE-INIT PROTOCOL
                    </button>
                  </>
                )}
              </div>

              <button 
                onClick={() => setShowReview(!showReview)} 
                className="px-4 py-3 border border-[#2A2E3D] hover:border-gray-500 text-gray-400 hover:text-white rounded uppercase font-bold transition-colors flex items-center gap-2"
              >
                {showReview ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                {showReview ? 'HIDE REVIEW' : 'REVIEW INTERNALS'}
              </button>
            </div>

            {/* Answer Review list */}
            <AnimatePresence>
              {showReview && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="space-y-4 font-mono text-xs"
                >
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-accent-pink"/> 
                    INTERNALS LOGS SUMMARY
                  </p>
                  
                  {questions.map((q, i) => {
                    const userAns = answers[i]; 
                    const isCorrect = userAns === q.answer; 
                    const notAttempted = userAns === null;
                    const borderC = notAttempted ? 'border-[#2A2E3D]' : isCorrect ? 'border-accent-green/30 bg-accent-green/5' : 'border-red-950/30 bg-red-950/5';
                    
                    return (
                      <div key={i} className={`rounded border p-5 space-y-4 ${borderC}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs shrink-0 ${
                            notAttempted 
                              ? 'border-[#2A2E3D] text-gray-500 bg-transparent' 
                              : isCorrect 
                                ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/5' 
                                : 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/5'
                          }`}>
                            {notAttempted ? '—' : isCorrect ? '✓' : '✗'}
                          </div>
                          <div className="flex-1">
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              notAttempted 
                                ? 'bg-transparent text-gray-500 border border-[#2A2E3D]' 
                                : isCorrect 
                                  ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
                                  : 'bg-red-950/20 text-red-500 border border-red-900/20'
                            }`}>
                              PORT_0{i+1} • {notAttempted ? 'NOT ATTEMPTED' : isCorrect ? 'COMPILED SUCCESS' : 'VERIFY FAILED'}
                            </span>
                            <p className="text-sm font-bold text-white mt-2 leading-relaxed">
                              {q.q}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 ml-11">
                          {q.options.map((opt, oi) => {
                            const isUserPick = userAns === oi; 
                            const isRight = q.answer === oi;
                            
                            let boxStyle = "border-[#2A2E3D] text-gray-400 bg-transparent";
                            if (isRight) boxStyle = "border-accent-green/40 text-accent-green bg-accent-green/5";
                            else if (isUserPick) boxStyle = "border-red-950 text-red-400 bg-red-950/20";
                            
                            return (
                              <div key={oi} className={`px-4 py-2.5 rounded border text-xs font-bold flex items-center gap-2 ${boxStyle}`}>
                                <span className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-black shrink-0 ${
                                  isRight 
                                    ? 'bg-[#10B981]/15 text-[#10B981]' 
                                    : isUserPick 
                                      ? 'bg-red-950/20 text-red-500' 
                                      : 'bg-[#08090C] text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className="flex-1 text-[11px] font-bold">{opt}</span>
                                {isRight && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-accent-green shrink-0"/>}
                                {isUserPick && !isRight && <XCircle className="w-3.5 h-3.5 ml-auto text-red-500 shrink-0"/>}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}

      {/* ═══ CONSOLE TERMINATE DIALOG ═══ */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4" 
            onClick={() => setShowEndConfirm(false)}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"/>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95 }} 
              onClick={e => e.stopPropagation()} 
              className="relative bg-[#0D0E12] border border-red-500/40 rounded-lg p-8 max-w-sm w-full shadow-2xl text-center font-mono text-xs"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-[#EF4444]" />
              <div className="w-14 h-14 mx-auto rounded border border-red-900/30 bg-red-950/10 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500 animate-pulse"/>
              </div>
              
              <h3 className="text-md font-bold text-white mb-2 uppercase tracking-wider">TERMINATE VERIFICATION?</h3>
              <p className="text-gray-400 mb-1 leading-relaxed">
                You have resolved {attempted} of 10 threads.
              </p>
              <p className="text-red-400 font-bold mb-6">
                UNRESOLVED PORTS WILL BE EVALUATED AS ZERO.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowEndConfirm(false)} 
                  className="flex-1 py-3 border border-[#2A2E3D] hover:border-gray-500 rounded text-gray-400 hover:text-white uppercase font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => { setShowEndConfirm(false); handleSubmit(); }} 
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded uppercase font-bold transition-colors"
                >
                  End Scan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
