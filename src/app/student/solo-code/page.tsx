"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code2, Play, CheckCircle2, XCircle, ChevronRight, ArrowRight, Home, Trophy, Zap, Sparkles, RotateCcw, Star, Clock, Bot, Send, X, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { getRandomCodingQuestions, CodingQuestion } from '@/data/codingQuestions';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

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

export default function SoloCodePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'pick'|'coding'|'results'>('pick');
  const [stack, setStack] = useState('');
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [code, setCode] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<(boolean|null)[][]>([]);
  const [output, setOutput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{role:string,text:string}[]>([{role:'ai',text:'Hi! I\'m your AI assistant. Ask me anything about your code.'}]);
  const [feedback, setFeedback] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const startCoding = (skillId:string) => {
    setStack(skillId);
    const qs = getRandomCodingQuestions(skillId, 2);
    setQuestions(qs);
    setCode(qs.map(q => q.starter));
    setTestResults(qs.map(q => q.testCases.map(() => null)));
    setPhase('coding');
  };

  const runTests = () => {
    const res = [...testResults];
    res[qIdx] = questions[qIdx].testCases.map(() => Math.random() > 0.35);
    setTestResults(res);
    const p = res[qIdx].filter(Boolean).length;
    const f = res[qIdx].filter(r => r === false).length;
    setOutput(`✓ ${p} passed, ✗ ${f} failed`);
  };

  const finishSession = () => {
    setPhase('results');
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
      p.sessions = (p.sessions||0) + 1;
      const allTests = testResults.flat();
      const passed = allTests.filter(t => t === true).length;
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
  const passed = testResults.flat().filter(t => t === true).length;
  const failed = testResults.flat().filter(t => t === false).length;
  const hp = passed * 5;

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ PICK SKILL ═══ */}
        {phase === 'pick' && (
          <motion.div key="pick" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 relative z-10">
            <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/student/challenges" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-sec-bg)] transition-all border border-transparent hover:border-[var(--ide-border)]">
                  <ArrowLeft className="w-4 h-4"/><span className="text-xs font-bold">Back</span>
                </Link>
                <div className="w-px h-5 bg-black/8"/>
                <Logo showText={true} className="scale-[0.8] origin-left" />
              </div>
            </motion.header>

            <div className="max-w-3xl mx-auto px-8 py-16 text-center">
              <motion.div {...fadeUp(0.1)}>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4D79FF] to-[#6B8AFF] flex items-center justify-center text-white mb-5 shadow-xl" style={{boxShadow:'0 10px 40px rgba(77,121,255,0.2)'}}>
                  <Code2 className="w-8 h-8"/>
                </div>
                <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Choose Your Stack</h1>
                <p className="text-xs text-[var(--text-muted)] mb-10">Pick a language to practice solo coding</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SKILLS.map((s,i) => (
                  <motion.button key={s.id} {...fadeUp(0.15+i*0.04)} whileHover={{y:-6,boxShadow:`0 20px 40px ${s.color}15`}} whileTap={{scale:0.97}}
                    onClick={()=>startCoding(s.id)}
                    className="bg-[var(--ide-bg)] rounded-2xl border-2 border-[var(--ide-border)] p-6 text-center hover:border-transparent transition-all duration-300 group"
                    style={{['--c' as string]:s.color}}>
                    <motion.span whileHover={{scale:1.2,rotate:[0,10,-10,0]}} className="text-3xl block mb-3">{s.icon}</motion.span>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{s.name}</p>
                    <div className="mt-3 w-full h-1 rounded-full bg-[var(--btn-sec-bg)] overflow-hidden">
                      <div className="h-full rounded-full w-0 group-hover:w-full transition-all duration-500" style={{background:s.color}}/>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ CODING ═══ */}
        {phase === 'coding' && (
          <motion.div key="coding" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="bg-[var(--ide-bg)] border-b border-[var(--ide-border)] px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
              <div className="flex items-center gap-3">
                <button onClick={()=>setPhase('pick')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[10px] font-bold border border-[var(--ide-border)] hover:border-[var(--ide-border)] transition-all">
                  <ArrowLeft className="w-3 h-3"/>Back
                </button>
                <div className="w-px h-5 bg-black/8"/>
                <span className="text-xl">{m.icon}</span>
                <span className="text-sm font-extrabold text-[var(--text-primary)]">{m.name}</span>
                <div className="w-px h-5 bg-black/8"/>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-extrabold uppercase tracking-wider" style={{background:`${m.color}15`,color:m.color,border:`1px solid ${m.color}25`}}>
                  <Code2 className="w-3.5 h-3.5"/>Solo Mode
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={()=>setShowChat(!showChat)} className={`p-2.5 rounded-xl border transition-all ${showChat?'bg-purple-50 border-purple-300 text-purple-600 shadow-sm':'bg-[var(--ide-bg)] border-[var(--ide-border)] text-[var(--text-muted)] hover:text-[var(--text-muted)]'}`}>
                  <Bot className="w-4 h-4"/>
                </button>
                <div className="w-px h-5 bg-black/8"/>
                <div className="px-4 py-2 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] font-mono text-sm font-extrabold text-[var(--text-primary)]">
                  <Clock className="w-3.5 h-3.5 inline mr-1.5 text-[var(--text-muted)]"/>No Timer
                </div>
                <button onClick={finishSession} className="px-4 py-2 rounded-xl bg-green-50 border border-green-300 text-green-600 text-xs font-extrabold uppercase tracking-wider hover:bg-green-100 transition-all">
                  <CheckCircle2 className="w-3.5 h-3.5 inline mr-1"/>Submit
                </button>
                <button onClick={()=>setShowEndConfirm(true)} className="px-4 py-2 rounded-xl bg-red-50 border border-red-300 text-red-500 text-xs font-extrabold uppercase tracking-wider hover:bg-red-100 transition-all">
                  <X className="w-3.5 h-3.5 inline mr-1"/>End
                </button>
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
                      <button onClick={()=>setShowEndConfirm(false)} className="flex-1 py-2.5 rounded-xl border border-[var(--ide-border)] text-xs font-bold text-[var(--text-secondary)]">Cancel</button>
                      <button onClick={()=>{setShowEndConfirm(false);finishSession();}} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-bold">End Session</button>
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
                    <button key={qi} onClick={()=>setQIdx(qi)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all ${qi===qIdx?'text-white shadow-sm':'bg-white text-[var(--text-secondary)] border-[var(--ide-border)]'}`}
                      style={qi===qIdx?{background:m.color,borderColor:m.color}:{}}>
                      Q{qi+1}
                    </button>
                  ))}
                </div>
                {questions[qIdx] && (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded text-[8px] font-extrabold uppercase" style={{background:`${m.color}12`,color:m.color}}>{questions[qIdx].difficulty}</span>
                    </div>
                    <h3 className="text-base font-black text-[var(--text-primary)] mb-2">{questions[qIdx].title}</h3>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">{questions[qIdx].desc}</p>

                    <div className="mb-4">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Test Cases</p>
                      {questions[qIdx].testCases.map((tc,ti) => (
                        <div key={ti} className={`flex items-center gap-2 p-2.5 rounded-lg mb-1.5 border text-[10px] ${testResults[qIdx]?.[ti]===true?'bg-green-50 border-green-200':testResults[qIdx]?.[ti]===false?'bg-red-50 border-red-200':'bg-[var(--btn-sec-bg)] border-[var(--ide-border)]'}`}>
                          {testResults[qIdx]?.[ti]===true?<CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0"/>:testResults[qIdx]?.[ti]===false?<XCircle className="w-3 h-3 text-red-500 flex-shrink-0"/>:<div className="w-3 h-3 rounded-full border border-[var(--ide-border)] flex-shrink-0"/>}
                          <code className="font-mono text-[var(--text-muted)] truncate">{tc.input}</code>
                          <span className="text-[var(--text-primary)]/15 flex-shrink-0">→</span>
                          <code className="font-mono text-[var(--text-muted)] flex-shrink-0">{tc.expected}</code>
                        </div>
                      ))}
                    </div>

                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={runTests}
                      className="w-full py-3 rounded-xl text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                      style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`,boxShadow:`0 6px 20px ${m.color}25`}}>
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
                        <div key={i} className={`p-2.5 rounded-xl text-[11px] leading-relaxed ${m.role==='ai'?'bg-purple-50 text-purple-800':'bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] ml-4'}`}>{m.text}</div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-[var(--ide-border)] flex gap-2">
                      <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')sendChat();}}
                        placeholder="Ask anything..." className="flex-1 px-3 py-2 rounded-lg border border-[var(--ide-border)] text-xs focus:outline-none focus:border-purple-300"/>
                      <button onClick={sendChat} className="p-2 rounded-lg bg-purple-500 text-white"><Send className="w-3.5 h-3.5"/></button>
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

            <div className="max-w-lg mx-auto text-center relative z-10">
              <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring'}}>
                <Sparkles className="w-8 h-8 mx-auto text-amber-400 mb-2"/>
              </motion.div>
              <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#4D79FF] to-[#6B8AFF] mb-1">Solo Session Complete!</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-8">Great practice on <span className="font-bold" style={{color:m.color}}>{m.name}</span></p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[{icon:CheckCircle2,val:passed,label:'Passed',c:'#10B981'},{icon:XCircle,val:failed,label:'Failed',c:'#EF4444'},{icon:Trophy,val:`+${hp}`,label:'HP Earned',c:'#F59E0B'}].map((s,i)=>(
                  <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3+i*0.1}}
                    className="rounded-2xl p-5 bg-[var(--ide-bg)] border-2 shadow-md text-center" style={{borderColor:`${s.c}20`}}>
                    <s.icon className="w-6 h-6 mx-auto mb-2" style={{color:s.c}}/>
                    <motion.p initial={{scale:0}} animate={{scale:1}} transition={{delay:0.5+i*0.1,type:'spring'}} className="text-2xl font-black" style={{color:s.c}}>{s.val}</motion.p>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-wider mt-1">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Feedback */}
              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}} className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] p-6 mb-6 shadow-sm">
                <p className="text-sm font-bold text-[var(--text-primary)] mb-3">Rate your experience</p>
                <div className="flex gap-3 justify-center">
                  {[1,2,3,4,5].map(s=>(
                    <motion.button key={s} whileHover={{scale:1.15}} whileTap={{scale:0.9}} onClick={()=>setFeedback(s)}>
                      <Star className="w-8 h-8" fill={s<=feedback?'#F59E0B':'none'} color={s<=feedback?'#F59E0B':'rgba(0,0,0,0.08)'} strokeWidth={1.5}/>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:1}} className="flex gap-3 justify-center">
                <motion.button whileHover={{scale:1.03}} onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-[var(--ide-border)] text-xs font-extrabold text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase tracking-wider">
                  <Home className="w-4 h-4"/>Dashboard
                </motion.button>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>{setPhase('pick');setFeedback(0);setOutput('');}}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider shadow-xl"
                  style={{background:`linear-gradient(135deg,${m.color},${m.color}CC)`,boxShadow:`0 10px 30px ${m.color}25`}}>
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
