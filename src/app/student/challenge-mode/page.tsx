"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code2, Play, CheckCircle2, XCircle, ChevronRight, ArrowRight, Home, Trophy, Zap, Sparkles, Crown, Star, Clock, Bot, Send, X, Users, Timer, Swords, Medal, Flame, Shield, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { getRandomCodingQuestions, CodingQuestion } from '@/data/codingQuestions';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const SKILLS = [
  { id:'javascript', name:'JavaScript', icon:'⚡', color:'#D97706' },
  { id:'python', name:'Python', icon:'🐍', color:'#3776AB' },
  { id:'typescript', name:'TypeScript', icon:'🔷', color:'#3178C6' },
  { id:'cpp', name:'C++', icon:'⚙️', color:'#00599C' },
  { id:'nodejs', name:'Node.js', icon:'🟢', color:'#339933' },
  { id:'react', name:'React', icon:'⚛️', color:'#61DAFB' },
];

const FAKE_OPPONENTS = [
  { name:'Arjun P.', avatar:'AP', progress:0 },
  { name:'Sneha G.', avatar:'SG', progress:0 },
  { name:'Raj M.', avatar:'RM', progress:0 },
];

export default function ChallengeModePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'pick'|'matching'|'coding'|'results'>('pick');
  const [stack, setStack] = useState('');
  const [question, setQuestion] = useState<CodingQuestion|null>(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<(boolean|null)[]>([]);
  const [output, setOutput] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [opponents, setOpponents] = useState(FAKE_OPPONENTS);
  const [matchCountdown, setMatchCountdown] = useState(5);
  const [myProgress, setMyProgress] = useState(0);
  const [winner, setWinner] = useState('');
  const [feedback, setFeedback] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const m = SKILLS.find(s => s.id === stack) || SKILLS[0];
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  // Start challenge
  const startChallenge = (skillId:string) => {
    setStack(skillId);
    setPhase('matching');
    // Simulate matching countdown
    let count = 5;
    const ci = setInterval(() => {
      count--;
      setMatchCountdown(count);
      if (count <= 0) {
        clearInterval(ci);
        const qs = getRandomCodingQuestions(skillId, 1);
        setQuestion(qs[0]);
        setCode(qs[0].starter);
        setTestResults(qs[0].testCases.map(() => null));
        setOpponents(FAKE_OPPONENTS.map(o => ({...o, progress: 0})));
        setPhase('coding');
      }
    }, 1000);
  };

  // Timer
  useEffect(() => {
    if (phase !== 'coding') return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(t); finishChallenge('time'); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Simulate opponents progress
  useEffect(() => {
    if (phase !== 'coding') return;
    const oi = setInterval(() => {
      setOpponents(prev => prev.map(o => ({
        ...o,
        progress: Math.min(100, o.progress + (1 + Math.random() * 3))
      })));
    }, 2000);
    // Simulate an opponent finishing
    const finishTimer = setTimeout(() => {
      setOpponents(prev => {
        const updated = [...prev];
        const idx = Math.floor(Math.random() * prev.length);
        updated[idx] = {...updated[idx], progress: 100};
        return updated;
      });
    }, 25000 + Math.random() * 20000);
    return () => { clearInterval(oi); clearTimeout(finishTimer); };
  }, [phase]);

  const runTests = () => {
    if (!question) return;
    const res = question.testCases.map(() => Math.random() > 0.3);
    setTestResults(res);
    const p = res.filter(Boolean).length;
    const f = res.filter(r => r === false).length;
    setOutput(`✓ ${p} passed, ✗ ${f} failed`);
    const progress = (p / question.testCases.length) * 100;
    setMyProgress(progress);
    if (p === question.testCases.length) {
      finishChallenge('win');
    }
  };

  const finishChallenge = (reason:'win'|'time') => {
    const allPassed = testResults.every(t => t === true);
    if (reason === 'win' || allPassed) setWinner('you');
    else {
      const finished = opponents.find(o => o.progress >= 100);
      setWinner(finished?.name || opponents[0].name);
    }
    setPhase('results');
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
      p.sessions = (p.sessions||0) + 1;
      const passed = testResults.filter(t => t === true).length;
      const bonus = (reason === 'win' || allPassed) ? 25 : 0;
      p.hp = (p.hp||0) + passed * 15 + bonus;
      const today = new Date().toISOString().split('T')[0];
      if (p.lastDate !== today) { p.streak = (p.streak||0) + 1; p.lastDate = today; }
      localStorage.setItem('dateforcode_progress', JSON.stringify(p));
    } catch(_) {}
  };

  const passed = testResults.filter(t => t === true).length;
  const failed = testResults.filter(t => t === false).length;
  const hp = passed * 15 + (winner === 'you' ? 25 : 0);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ PICK ═══ */}
        {phase === 'pick' && (
          <motion.div key="pick" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 relative z-10">
            <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-8 py-4 flex items-center gap-4">
              <Link href="/student/challenges" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-sec-bg)] transition-all border border-transparent hover:border-[var(--ide-border)]">
                <ArrowLeft className="w-4 h-4"/><span className="text-xs font-bold">Back</span>
              </Link>
              <div className="w-px h-5 bg-black/8"/>
              <Logo showText={false} className="scale-[0.5]"/>
              <span className="text-sm font-serif font-bold text-[var(--text-primary)]">Date<span className="text-[#FF4D6D]">for</span>Code</span>
            </motion.header>

            <div className="max-w-3xl mx-auto px-8 py-16 text-center">
              <motion.div {...fadeUp(0.1)}>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center text-white mb-5 shadow-xl" style={{boxShadow:'0 10px 40px rgba(16,185,129,0.2)'}}>
                  <Swords className="w-8 h-8"/>
                </div>
                <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Challenge Mode</h1>
                <p className="text-xs text-[var(--text-muted)] mb-3">Race against other coders — same question, fastest wins!</p>
                <div className="flex items-center justify-center gap-4 mb-10">
                  <span className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-600">🏆 Winner gets +25 Bonus HP</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-600">⏱ 10 Min Timer</span>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SKILLS.map((s,i) => (
                  <motion.button key={s.id} {...fadeUp(0.15+i*0.04)} whileHover={{y:-6,boxShadow:`0 20px 40px ${s.color}15`}} whileTap={{scale:0.97}}
                    onClick={()=>startChallenge(s.id)}
                    className="bg-[var(--ide-bg)] rounded-2xl border-2 border-[var(--ide-border)] p-6 text-center hover:border-transparent transition-all duration-300 group">
                    <motion.span whileHover={{scale:1.2}} className="text-3xl block mb-3">{s.icon}</motion.span>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{s.name}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ MATCHING ═══ */}
        {phase === 'matching' && (
          <motion.div key="matching" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex items-center justify-center relative z-10">
            <div className="text-center">
              <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:'linear'}} className="w-20 h-20 mx-auto rounded-full border-4 border-[var(--ide-border)] border-t-green-500 mb-8"/>
              <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2">Finding Opponents...</h2>
              <p className="text-xs text-[var(--text-muted)] mb-6">Matching you with coders of similar skill</p>
              <div className="flex items-center justify-center gap-3 mb-8">
                {FAKE_OPPONENTS.map((o,i) => (
                  <motion.div key={o.name} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.5+i*0.3,type:'spring'}}
                    className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center text-xs font-black text-[var(--text-secondary)] shadow">{o.avatar}</div>
                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">{o.name}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:1.5,type:'spring'}} className="w-16 h-16 mx-auto rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-green-600">{matchCountdown}</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══ CODING ═══ */}
        {phase === 'coding' && (
          <motion.div key="coding" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="bg-[var(--ide-bg)] border-b border-[var(--ide-border)] px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xl">{m.icon}</span>
                <span className="text-sm font-extrabold text-[var(--text-primary)]">{m.name}</span>
                <div className="w-px h-5 bg-black/8"/>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider bg-green-50 border border-green-200 text-green-600">
                  <Swords className="w-3.5 h-3.5"/>Challenge
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                {/* Opponents progress */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)]">
                  {opponents.map((o,i) => (
                    <div key={o.name} className="flex items-center gap-1.5" title={`${o.name}: ${Math.round(o.progress)}%`}>
                      <div className="w-5 h-5 rounded-md bg-black/10 flex items-center justify-center text-[7px] font-black text-[var(--text-secondary)]">{o.avatar}</div>
                      <div className="w-12 h-1.5 rounded-full bg-[var(--btn-sec-bg)] overflow-hidden">
                        <motion.div animate={{width:`${o.progress}%`}} className="h-full rounded-full" style={{background:o.progress>=100?'#10B981':'#CBD5E1'}}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-px h-5 bg-black/8"/>
                <div className={`px-4 py-2 rounded-xl font-mono text-base font-extrabold border ${timeLeft<60?'bg-red-50 border-red-300 text-red-600 animate-pulse shadow-sm':timeLeft<180?'bg-amber-50 border-amber-200 text-amber-600':'bg-[var(--ide-bg)] border-[var(--ide-border)] text-[var(--text-primary)]'}`}>
                  <Timer className="w-3.5 h-3.5 inline mr-1.5"/>{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                </div>
                <button onClick={()=>setShowEndConfirm(true)} className="px-4 py-2 rounded-xl bg-red-50 border border-red-300 text-red-600 text-xs font-extrabold uppercase tracking-wider hover:bg-red-100 transition-all">
                  <X className="w-3.5 h-3.5 inline mr-1"/>End
                </button>
              </div>
            </div>

            {/* End Confirm Modal */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] shadow-2xl p-8 max-w-sm w-full mx-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4"><AlertTriangle className="w-7 h-7 text-red-500"/></div>
                    <h3 className="text-lg font-black text-center text-[var(--text-primary)] mb-2">End Challenge?</h3>
                    <p className="text-xs text-center text-[var(--text-secondary)] mb-6">You will forfeit this round. Your current progress will still be saved.</p>
                    <div className="flex gap-3">
                      <button onClick={()=>setShowEndConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--ide-border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Cancel</button>
                      <button onClick={()=>{setShowEndConfirm(false);finishChallenge('time');}} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600">End Challenge</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden">
              {/* LEFT — Question */}
              <div className="w-[340px] flex-shrink-0 border-r border-[var(--ide-border)] bg-[var(--ide-bg)] overflow-y-auto p-5">
                {question && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-green-50 border border-green-200 text-green-600">{question.difficulty}</span>
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase bg-red-50 border border-red-200 text-red-500">Competitive</span>
                    </div>
                    <h3 className="text-base font-black text-[var(--text-primary)] mb-2">{question.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">{question.desc}</p>

                    {/* My progress bar */}
                    <div className="mb-4 p-3 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-bold text-[var(--text-muted)]">Your Progress</span>
                        <span className="text-[9px] font-bold" style={{color:m.color}}>{Math.round(myProgress)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[var(--btn-sec-bg)] overflow-hidden">
                        <motion.div animate={{width:`${myProgress}%`}} className="h-full rounded-full" style={{background:`linear-gradient(90deg,${m.color},${m.color}CC)`}}/>
                      </div>
                    </div>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Test Cases</p>
                    {question.testCases.map((tc,ti) => (
                      <div key={ti} className={`flex items-center gap-2 p-2.5 rounded-lg mb-1.5 border text-[10px] ${testResults[ti]===true?'bg-green-50 border-green-200':testResults[ti]===false?'bg-red-50 border-red-200':'bg-[var(--btn-sec-bg)] border-[var(--ide-border)]'}`}>
                        {testResults[ti]===true?<CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0"/>:testResults[ti]===false?<XCircle className="w-3 h-3 text-red-500 flex-shrink-0"/>:<div className="w-3 h-3 rounded-full border border-[var(--ide-border)] flex-shrink-0"/>}
                        <code className="font-mono text-[var(--text-muted)] truncate">{tc.input}</code>
                        <span className="text-[var(--text-primary)]/15 flex-shrink-0">→</span>
                        <code className="font-mono text-[var(--text-muted)] flex-shrink-0">{tc.expected}</code>
                      </div>
                    ))}

                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={runTests}
                      className="w-full mt-4 py-3 rounded-xl text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                      style={{background:'linear-gradient(135deg,#10B981,#10B981CC)',boxShadow:'0 6px 20px rgba(16,185,129,0.25)'}}>
                      <Play className="w-3.5 h-3.5"/>Run Tests
                    </motion.button>
                    {output && <p className="text-[10px] text-center mt-2 font-bold text-[var(--text-secondary)]">{output}</p>}
                  </>
                )}
              </div>

              {/* RIGHT — Editor */}
              <div className="flex-1 flex flex-col">
                <div className="bg-[var(--background)] px-4 py-2 flex items-center justify-between border-b border-[var(--ide-border)]/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400/80"/><div className="w-3 h-3 rounded-full bg-yellow-400/80"/><div className="w-3 h-3 rounded-full bg-green-400/80"/></div>
                    <span className="text-[10px] font-mono text-[var(--text-muted)] ml-2">challenge.{stack==='python'?'py':stack==='cpp'?'cpp':'js'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold text-red-400 animate-pulse">● LIVE CHALLENGE</span>
                  </div>
                </div>
                <textarea value={code} onChange={e=>setCode(e.target.value)}
                  className="flex-1 bg-[var(--background)] text-[var(--text-primary)] font-mono text-sm p-5 resize-none focus:outline-none leading-relaxed"
                  style={{tabSize:2}} spellCheck={false}/>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ RESULTS ═══ */}
        {phase === 'results' && (
          <motion.div key="results" initial={{opacity:0}} animate={{opacity:1}} className="flex-1 overflow-y-auto p-8 bg-[var(--background)] relative z-10">
            {Array.from({length:25}).map((_,i)=>(
              <motion.div key={i} className="absolute rounded-full pointer-events-none" initial={{opacity:0,scale:0,y:0}}
                animate={{opacity:[0,1,0],y:-150-i*10,x:(i%2===0?1:-1)*50*(i%5),scale:[0,1,0],rotate:i*30}}
                transition={{duration:2.5,delay:i*0.06}}
                style={{width:6+i%5*2,height:6+i%5*2,left:'50%',top:'30%',background:['#10B981','#FFD700','#FF4D6D','#3B82F6','#8B5CF6'][i%5]}}/>
            ))}

            <div className="max-w-lg mx-auto text-center relative z-10">
              {/* Winner announcement */}
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',delay:0.2}}>
                {winner === 'you' ? (
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white mb-4 shadow-2xl" style={{boxShadow:'0 15px 40px rgba(245,158,11,0.3)'}}>
                    <Crown className="w-10 h-10"/>
                  </div>
                ) : (
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white mb-4 shadow-xl">
                    <Medal className="w-10 h-10"/>
                  </div>
                )}
              </motion.div>

              <h2 className="text-3xl font-black mb-1" style={{color:winner==='you'?'#F59E0B':'#666'}}>
                {winner === 'you' ? '🏆 You Won!' : 'Challenge Complete'}
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                {winner === 'you' ? 'You were the fastest to pass all test cases!' : `${winner} finished first. Keep practicing!`}
              </p>
              {winner === 'you' && <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="text-xs font-bold text-amber-500 mb-6">+25 Bonus HP Earned!</motion.p>}

              {/* Standings */}
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] shadow-lg p-5 mb-6">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-3">Final Standings</p>
                {[{name:'You',progress:myProgress,isYou:true},...opponents].sort((a,b)=>(b.progress===100?1:0)-(a.progress===100?1:0)||b.progress-a.progress).map((p,i)=>(
                  <div key={p.name} className={`flex items-center gap-3 p-3 rounded-xl mb-1.5 ${(p as any).isYou?'bg-amber-50 border border-amber-200':'bg-[var(--btn-sec-bg)]'}`}>
                    <span className="text-sm font-black text-[var(--text-muted)] w-5">{i+1}</span>
                    <span className={`text-xs font-bold ${(p as any).isYou?'text-amber-600':'text-[var(--text-primary)]'}`}>{p.name}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--btn-sec-bg)] overflow-hidden ml-2">
                      <div className="h-full rounded-full" style={{width:`${p.progress}%`,background:p.progress>=100?'#10B981':'#CBD5E1'}}/>
                    </div>
                    <span className="text-[9px] font-bold text-[var(--text-muted)]">{Math.round(p.progress)}%</span>
                    {i===0 && <span className="text-sm">🏆</span>}
                  </div>
                ))}
              </motion.div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{icon:CheckCircle2,val:passed,label:'Passed',c:'#10B981'},{icon:XCircle,val:failed,label:'Failed',c:'#EF4444'},{icon:Trophy,val:`+${hp}`,label:'HP',c:'#F59E0B'}].map((s,i)=>(
                  <motion.div key={s.label} initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:0.6+i*0.1}}
                    className="rounded-2xl p-4 bg-[var(--ide-bg)] border-2 shadow-md text-center" style={{borderColor:`${s.c}20`}}>
                    <s.icon className="w-5 h-5 mx-auto mb-1" style={{color:s.c}}/>
                    <p className="text-xl font-black" style={{color:s.c}}>{s.val}</p>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1}} className="flex gap-3 justify-center">
                <motion.button whileHover={{scale:1.03}} onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--ide-border)] text-xs font-extrabold text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-wider">
                  <Home className="w-4 h-4"/>Dashboard
                </motion.button>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>{setPhase('pick');setTimeLeft(600);setMyProgress(0);setOutput('');setTestResults([]);setOpponents(FAKE_OPPONENTS);setFeedback(0);}}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-xl"
                  style={{background:'linear-gradient(135deg,#10B981,#10B981CC)',boxShadow:'0 10px 30px rgba(16,185,129,0.25)'}}>
                  <Swords className="w-4 h-4"/>Challenge Again
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
