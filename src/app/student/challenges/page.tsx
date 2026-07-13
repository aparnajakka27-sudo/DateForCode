"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, Trophy, Zap, ArrowRight, ArrowLeft, Code2, Timer, Swords, Sparkles, Shield, ChevronRight, CheckCircle2, X, Target, Gamepad2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import Link from 'next/link';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:12}, animate:{opacity:1,y:0}, transition:{duration:0.35,delay:d,ease:[0.16,1,0.3,1] as const} });

const PROTOCOLS = [
  {
    id:'partner',
    title:'CODE WITH PARTNER',
    desc:'Match with a developer of equal skill. Collaborative pair programming protocol.',
    icon:Users,
    color:'#FF4D6D',
    gradient:'from-[#FF4D6D] to-[#FF758C]',
    earn:'EARN 50 XP + 15 HP',
    steps:[
      {s:'Choose your coding stack',d:'Pick from 8 technical stacks like JavaScript, Python, C++, etc.'},
      {s:'Take skill assessment',d:'Answer MCQ questions to verify your proficiency level'},
      {s:'Get matched with partner',d:'AI matches you with a developer of similar skill level'},
      {s:'Pair code together',d:'30 min session — switch roles between Coder & Navigator'},
    ],
    features:['Real-time pair coding','AI-matched partner','Role switching (Coder ↔ Navigator)','AI Chat + Mentor help','30 min timed sessions'],
  },
  {
    id:'solo',
    title:'CODE YOURSELF',
    desc:'Solo practice terminal. Tackle algorithm challenges at your own pace. No pressure.',
    icon:User,
    color:'#4D79FF',
    gradient:'from-[#4D79FF] to-[#6B8AFF]',
    earn:'EARN 25 XP + 5 HP',
    steps:[
      {s:'Choose your coding stack',d:'Pick the language you want to practice'},
      {s:'Get coding questions',d:'2 random questions from your chosen stack'},
      {s:'Code at your own pace',d:'No timer pressure — take as long as you need'},
      {s:'Run tests & submit',d:'Test your code against all test cases'},
    ],
    features:['Solo coding terminal','Algorithm practice','No time pressure','AI assistance available','Unlimited attempts'],
  },
  {
    id:'challenge',
    title:'CHALLENGE MODE',
    desc:'High-stakes competitive race. Same question, multiple coders. Fastest correct solution wins!',
    icon:Trophy,
    color:'#10B981',
    gradient:'from-[#10B981] to-[#34D399]',
    earn:'EARN 100 XP + 25 HP',
    steps:[
      {s:'Choose your stack & difficulty',d:'Select language and challenge difficulty level'},
      {s:'Get matched with competitors',d:'Paired with 2-4 coders of similar skill'},
      {s:'Everyone gets the same question',d:'A single coding challenge for all participants'},
      {s:'Race to solve it first!',d:'First to pass all test cases wins the challenge'},
    ],
    features:['Competitive racing','Same question for all','Live progress tracking','Leaderboard ranked','Double XP weekends'],
  },
  {
    id:'playground',
    title:'REACT PLAYGROUND',
    desc:'Sandbox code workspace. Instantly compile, write, and preview React/frontend apps using Sandpack.',
    icon:Code2,
    color:'#8B5CF6',
    gradient:'from-[#8B5CF6] to-[#A78BFA]',
    earn:'UNLIMITED RUNS & PLAY TIME',
    steps:[
      {s:'Launch Sandpack Workspace',d:'Open the pre-configured live Sandpack sandbox environment.'},
      {s:'Edit code in real-time',d:'Modify your React component files dynamically in the code editor.'},
      {s:'Instant live preview rendering',d:'See browser rendering output update live on keypress.'},
      {s:'Zero-backend setup required',d:'Code entirely in the browser workspace sandbox.'},
    ],
    features:['Multi-template workspaces','Vibrant theme configs','Live in-browser preview','Advanced layout controls','Lightweight & instant'],
  },
];

export default function ChallengesPage() {
  const router = useRouter();
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [xpScore, setXpScore] = useState<number>(0);
  const [hpScore, setHpScore] = useState<number>(0);

  useEffect(() => {
    setXpScore(1420);
    setHpScore(95);
  }, []);

  const handleStart = (id:string) => {
    if (id === 'partner') router.push('/student/skill-assessment');
    else if (id === 'solo') router.push('/student/solo-code');
    else if (id === 'challenge') router.push('/student/challenge-mode');
    else if (id === 'playground') router.push('/student/playground');
  };

  const selected = PROTOCOLS.find(p => p.id === selectedProtocol);

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden pb-12">
      {/* Optimized static bg blurs (hardware accelerated, no scale/re-layout overhead) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <motion.div animate={{opacity:[0.015, 0.03, 0.015]}} transition={{duration:8,repeat:Infinity}} className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#FF4D6D] rounded-full blur-[150px] transform translate-z-0 will-change-transform" />
        <motion.div animate={{opacity:[0.015, 0.03, 0.015]}} transition={{duration:10,repeat:Infinity}} className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-[#4D79FF] rounded-full blur-[130px] transform translate-z-0 will-change-transform" />
        <motion.div animate={{opacity:[0.015, 0.02, 0.015]}} transition={{duration:6,repeat:Infinity}} className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#10B981] rounded-full blur-[100px] transform translate-z-0 will-change-transform" />
      </div>

      {/* Floating Rounded Nav Bar */}
      <div className="sticky top-0 z-20 w-full px-6 pt-4 pointer-events-none">
        <motion.header 
          {...fadeUp(0)} 
          className="max-w-7xl mx-auto backdrop-blur-xl border border-[var(--nav-border)] px-8 py-3.5 rounded-2xl flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] pointer-events-auto bg-[var(--nav-bg)] transition-all hover:border-[var(--text-muted)]/20"
        >
          <div className="flex items-center gap-4">
            <Link href="/student/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-sec-bg)] transition-all border border-transparent hover:border-[var(--ide-border)]">
              <ArrowLeft className="w-4 h-4"/>
              <span className="text-xs font-bold">Back to Dashboard</span>
            </Link>
            <div className="w-px h-5 bg-black/8"/>
            <Link href="/" className="flex items-center gap-2">
              <Logo showText={false} className="scale-[0.5]"/>
              <span className="text-sm font-serif font-bold text-[var(--text-primary)]">Date<span className="text-[#FF4D6D]">for</span>Code</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{scale:1.03}} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500"/>
              <span className="text-sm font-extrabold text-[var(--text-primary)]">{xpScore.toLocaleString()} XP</span>
            </motion.div>
            <motion.div whileHover={{scale:1.03}} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] shadow-sm">
              <Zap className="w-4 h-4 text-[#FF4D6D]"/>
              <span className="text-sm font-extrabold text-[var(--text-primary)]">{hpScore} HP</span>
            </motion.div>
          </div>
        </motion.header>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-16">
        {/* Title */}
        <motion.div {...fadeUp(0.1)} className="text-center mb-14">
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',delay:0.2}} className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF758C] flex items-center justify-center text-white mb-5 shadow-xl" style={{boxShadow:'0 10px 40px rgba(255,77,109,0.2)'}}>
            <Gamepad2 className="w-8 h-8"/>
          </motion.div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] mb-2">
            SELECT <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D6D] to-[#FF758C]">PROTOCOL</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">Choose your interaction gateway</p>
        </motion.div>

        {/* Protocol Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PROTOCOLS.map((p,i) => (
            <motion.div key={p.id} {...fadeUp(0.2+i*0.1)}
              onMouseEnter={()=>setHoveredCard(p.id)} onMouseLeave={()=>setHoveredCard(null)}
              className="group relative bg-[var(--ide-bg)] rounded-2xl border-2 overflow-hidden cursor-pointer"
              style={{
                borderColor: hoveredCard===p.id ? `${p.color}30` : 'rgba(0,0,0,0.05)',
                boxShadow: hoveredCard===p.id ? `0 25px 60px -15px ${p.color}20` : '0 2px 10px rgba(0,0,0,0.03)',
                transform: hoveredCard===p.id ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
              onClick={()=>setSelectedProtocol(p.id)}
            >
              {/* Animated top accent */}
              <motion.div className="h-1.5 w-full" style={{background:`linear-gradient(90deg,${p.color},${p.color}AA)`}}
                animate={hoveredCard===p.id?{scaleX:[1,1.1,1]}:{}} transition={{duration:1,repeat:Infinity}}/>
              
              {/* Icon area */}
              <div className="p-8 pb-4 relative">
                <motion.div animate={hoveredCard===p.id?{rotate:[0,5,-5,0],scale:[1,1.1,1]}:{}} transition={{duration:0.6}}
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{background:`linear-gradient(135deg,${p.color},${p.color}CC)`,boxShadow:`0 8px 25px ${p.color}25`}}>
                  <p.icon className="w-8 h-8 text-white"/>
                </motion.div>
                {/* Glow */}
                <div className="absolute top-6 left-6 w-16 h-16 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" style={{background:p.color}}/>
              </div>

              {/* Content */}
              <div className="px-8 pb-8">
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-2 tracking-wide">{p.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-5">{p.desc}</p>

                {/* Quick features */}
                <div className="space-y-2 mb-5">
                  {p.features.slice(0,3).map((f,fi) => (
                    <div key={fi} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:p.color}}/>
                      <span className="text-[10px] text-[var(--text-secondary)] font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Earn badge */}
                <motion.div whileHover={{scale:1.03}} className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-5" style={{background:`${p.color}08`,border:`1px solid ${p.color}15`}}>
                  <Zap className="w-3.5 h-3.5" style={{color:p.color}}/>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{color:p.color}}>{p.earn}</span>
                </motion.div>

                {/* CTA */}
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                  className="w-full py-3.5 rounded-xl text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                  style={{background:`linear-gradient(135deg,${p.color},${p.color}BB)`,boxShadow:`0 8px 30px ${p.color}25`}}>
                  View Steps
                  <ChevronRight className="w-3.5 h-3.5"/>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div {...fadeUp(0.5)} className="flex items-center justify-center gap-6">
          {[{icon:Sparkles,title:'XP COINS',desc:'Used for bio ranking & leaderboards',c:'#F59E0B'},{icon:Shield,title:'HP SCORE',desc:'Honor points for collaboration quality',c:'#FF4D6D'}].map(info=>(
            <motion.div key={info.title} whileHover={{y:-3}} className="flex items-center gap-3 px-6 py-4 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] shadow-sm">
              <info.icon className="w-5 h-5" style={{color:info.c}}/>
              <div>
                <p className="text-xs font-extrabold text-[var(--text-primary)]">{info.title}</p>
                <p className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-wider">{info.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ═══ Steps Modal ═══ */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setSelectedProtocol(null)}/>
            <motion.div initial={{opacity:0,y:40,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:40,scale:0.95}} transition={{type:'spring',damping:25,stiffness:300}}
              className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="bg-[var(--ide-bg)] rounded-3xl border border-[var(--ide-border)] shadow-2xl max-w-lg w-full overflow-hidden">
                {/* Header */}
                <div className="relative p-8 pb-6" style={{background:`linear-gradient(135deg,${selected.color}08,${selected.color}03)`}}>
                  <button onClick={()=>setSelectedProtocol(null)} className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-[var(--btn-sec-bg)] flex items-center justify-center hover:bg-black/10 transition-colors">
                    <X className="w-4 h-4 text-[var(--text-secondary)]"/>
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} transition={{type:'spring'}}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{background:`linear-gradient(135deg,${selected.color},${selected.color}CC)`,boxShadow:`0 8px 25px ${selected.color}25`}}>
                      <selected.icon className="w-7 h-7"/>
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--text-primary)]">{selected.title}</h3>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">How it works</p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="px-8 py-6">
                  <div className="space-y-4 mb-6">
                    {selected.steps.map((step,i) => (
                      <motion.div key={i} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.1+i*0.1}}
                        className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.15+i*0.1,type:'spring'}}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md flex-shrink-0" style={{background:`linear-gradient(135deg,${selected.color},${selected.color}CC)`}}>
                            {i+1}
                          </motion.div>
                          {i < selected.steps.length-1 && (
                            <motion.div initial={{height:0}} animate={{height:'100%'}} transition={{delay:0.2+i*0.1,duration:0.4}}
                              className="w-0.5 flex-1 mt-1" style={{background:`${selected.color}20`}}/>
                          )}
                        </div>
                        <div className="pb-2">
                          <p className="text-sm font-bold text-[var(--text-primary)] mb-0.5">{step.s}</p>
                          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{step.d}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* All features */}
                  <div className="p-4 rounded-xl mb-6" style={{background:`${selected.color}05`,border:`1px solid ${selected.color}10`}}>
                    <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{color:`${selected.color}80`}}>Features included</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.features.map((f,fi) => (
                        <span key={fi} className="text-[9px] font-bold px-2.5 py-1 rounded-lg" style={{background:`${selected.color}08`,color:selected.color}}>{f}</span>
                      ))}
                    </div>
                  </div>

                  {/* Earn */}
                  <div className="flex items-center gap-2 mb-6 justify-center">
                    <Sparkles className="w-4 h-4" style={{color:selected.color}}/>
                    <span className="text-xs font-extrabold uppercase tracking-wider" style={{color:selected.color}}>{selected.earn}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button onClick={()=>setSelectedProtocol(null)} className="flex-1 py-3.5 rounded-xl border border-[var(--ide-border)] text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all">Cancel</button>
                    <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>handleStart(selected.id)}
                      className="flex-[2] py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                      style={{background:`linear-gradient(135deg,${selected.color},${selected.color}BB)`,boxShadow:`0 8px 30px ${selected.color}25`}}>
                      {selected.id==='partner'?'Start Assessment':selected.id==='solo'?'Start Coding':selected.id==='challenge'?'Enter Challenge':'Launch Playground'}
                      <ArrowRight className="w-4 h-4"/>
                    </motion.button>
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
