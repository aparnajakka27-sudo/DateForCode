"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Zap, ChevronRight, Star, Clock, Trophy, Target, Code2, Flame, Terminal as TerminalIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 25 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

const SKILLS = [
  { id:'javascript', name:'JavaScript', icon:'⚡', color:'#FF3366', desc:'Core client-side telemetry modules', questions:10, time:'15 min' },
  { id:'python', name:'Python', icon:'🐍', color:'#3776AB', desc:'Data pipelines, scripting & automation', questions:10, time:'15 min' },
  { id:'typescript', name:'TypeScript', icon:'🔷', color:'#3178C6', desc:'Strict structural type verification', questions:10, time:'15 min' },
  { id:'react', name:'React', icon:'⚛️', color:'#61DAFB', desc:'Reactive component thread engines', questions:10, time:'15 min' },
  { id:'nextjs', name:'Next.js', icon:'▲', color:'#FFFFFF', desc:'Pre-rendered routing systems', questions:10, time:'15 min' },
  { id:'nodejs', name:'Node.js', icon:'🟢', color:'#10B981', desc:'Server runtime sockets & servers', questions:10, time:'15 min' },
  { id:'java', name:'Java', icon:'☕', color:'#ED8B00', desc:'System architecture compilers', questions:10, time:'15 min' },
  { id:'cpp', name:'C++', icon:'⚙️', color:'#00599C', desc:'High performance kernel bindings', questions:10, time:'15 min' },
  { id:'html-css', name:'HTML & CSS', icon:'🎨', color:'#E34F26', desc:'Structural formatting templates', questions:10, time:'15 min' },
  { id:'sql', name:'SQL', icon:'🗄️', color:'#4479A1', desc:'Relational database index queries', questions:10, time:'15 min' },
  { id:'git', name:'Git & GitHub', icon:'🔀', color:'#F05032', desc:'Distributed system version matrices', questions:10, time:'15 min' },
  { id:'rust', name:'Rust', icon:'🦀', color:'#CE422B', desc:'Memory-safe compiler operations', questions:10, time:'15 min' },
  { id:'go', name:'Go', icon:'🐹', color:'#00ADD8', desc:'Concurrent microservice structures', questions:10, time:'15 min' },
  { id:'docker', name:'Docker', icon:'🐳', color:'#2496ED', desc:'Virtual core container managers', questions:10, time:'15 min' },
  { id:'aws', name:'AWS Cloud', icon:'☁️', color:'#FF9900', desc:'Decentralized server configurations', questions:10, time:'15 min' },
  { id:'flutter', name:'Flutter', icon:'💙', color:'#02569B', desc:'Compiled native multi-device viewports', questions:10, time:'15 min' },
];

const FLOATING_CODE = ['{ }','< />','( )','[ ]','=>','&&','||','++','#','@','$','!','**','//','::','let','fn','int','var','if'];

export default function SkillAssessment() {
  const router = useRouter();
  const [hoveredSkill, setHoveredSkill] = useState<string|null>(null);
  const [selectedSkill, setSelectedSkill] = useState<typeof SKILLS[0]|null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = SKILLS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchFilter.toLowerCase());
    if (category === 'all') return matchSearch;
    if (category === 'web') return matchSearch && ['javascript','typescript','react','nextjs','html-css','nodejs'].includes(s.id);
    if (category === 'systems') return matchSearch && ['cpp','rust','go','java'].includes(s.id);
    if (category === 'devops') return matchSearch && ['docker','aws','git','sql'].includes(s.id);
    if (category === 'mobile') return matchSearch && ['flutter','react'].includes(s.id);
    return matchSearch;
  });

  return (
    <main className="relative min-h-screen bg-[#08090C] text-[#F3F4F6] noise-bg overflow-x-hidden font-sans">
      {/* ══ Animated Background ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 developer-grid" />

      {/* Floating code symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {FLOATING_CODE.map((sym, i) => (
          <div 
            key={i} 
            className="absolute font-mono select-none text-gray-800/10 text-xs" 
            style={{
              left: `${3 + ((i * 53) % 92)}%`,
              top: `${2 + ((i * 37) % 90)}%`,
              animation: `pulseGlow ${4 + i}s ease-in-out infinite`
            }}
          >
            {sym}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-20 py-4 px-8 flex items-center justify-between border-b border-[#2A2E3D]/50 bg-[#08090C]/80 backdrop-blur-md">
        <button 
          onClick={() => router.push('/student/dashboard')} 
          className="flex items-center gap-2 text-gray-500 text-xs font-mono font-bold uppercase tracking-wider hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          // EXIT_TO_DASHBOARD
        </button>
        <Logo showText={true} className="scale-[0.8] origin-right" />
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16 space-y-12">
        
        {/* Hero */}
        <motion.div {...fadeUp(0)} className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-accent-pink/30 bg-accent-pink/5 text-accent-pink text-[11px] font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            SKILL EVALUATION MODULE ACTIVE
          </div>
          
          <h1 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight uppercase">
            CHOOSE YOUR <span className="text-[#FF3366] accent-glow">BATTLEGROUND</span>
          </h1>
          
          <p className="text-gray-400 text-sm max-w-lg mx-auto font-mono leading-relaxed">
            Select a technology compiler to scan your capabilities. Scoring 70%+ compiles a permanent badge, boosting match compatibility synergy.
          </p>
        </motion.div>

        {/* Category filter pills */}
        <motion.div {...fadeUp(0.1)} className="flex items-center justify-center gap-3 flex-wrap">
          {[
            { id: 'all', label: 'All Stacks', emoji: '🌟' },
            { id: 'web', label: 'Web Systems', emoji: '🌐' },
            { id: 'systems', label: 'Core / Performance', emoji: '⚙️' },
            { id: 'devops', label: 'Infrastructure', emoji: '🚀' },
            { id: 'mobile', label: 'Native / Clients', emoji: '📱' }
          ].map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setCategory(cat.id)}
              className={`px-4 py-2 border font-mono rounded text-xs uppercase tracking-wider transition-all duration-200 ${
                category === cat.id 
                  ? 'bg-accent-pink/15 border-[#FF3366] text-[#FF3366] shadow-[0_0_10px_rgba(255,51,102,0.15)]' 
                  : 'bg-[#15171F] border-[#2A2E3D] text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <span className="mr-1.5">{cat.emoji}</span>{cat.label}
            </button>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div {...fadeUp(0.15)} className="max-w-md mx-auto">
          <div className="relative group font-mono">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-pink/30 to-accent-blue/30 rounded blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <input 
              value={searchFilter} 
              onChange={e => setSearchFilter(e.target.value)} 
              placeholder="SEARCH_TELEMETRY_NODES..." 
              className="relative w-full px-5 py-3 rounded bg-[#15171F] border border-[#2A2E3D] text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-pink transition-all font-bold" 
            />
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((skill, idx) => (
            <motion.button 
              key={skill.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ delay: 0.05 + idx * 0.03, duration: 0.4 }}
              onMouseEnter={() => setHoveredSkill(skill.id)} 
              onMouseLeave={() => setHoveredSkill(null)}
              onClick={() => setSelectedSkill(skill)}
              className="group text-left ide-panel bg-[#15171F] border-[#2A2E3D] hover:border-gray-500 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="ide-panel-header w-full justify-between py-2 border-b border-[#2A2E3D]/50 bg-[#0D0E12]/80">
                <span className="text-[9px] font-mono text-gray-500 uppercase">COMPILER // {skill.id.toUpperCase()}</span>
                <span className="text-[9px] font-mono text-accent-pink opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-bold">
                  RUN_SYS &gt;
                </span>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded border flex items-center justify-center text-xl shrink-0" 
                    style={{ 
                      color: skill.color, 
                      borderColor: hoveredSkill===skill.id ? skill.color : '#2A2E3D', 
                      backgroundColor: `${skill.color}08` 
                    }}
                  >
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono text-white uppercase group-hover:text-accent-pink transition-colors">{skill.name}</h3>
                    <span className="text-[9px] font-mono text-gray-500 uppercase">Telemetry Node</span>
                  </div>
                </div>

                <p className="text-gray-400 text-[11px] font-mono leading-relaxed h-10">
                  {skill.desc}
                </p>

                <div className="flex items-center gap-3 font-mono text-[9px] text-gray-500 uppercase font-bold tracking-tight">
                  <span className="flex items-center gap-1"><Code2 className="w-3.5 h-3.5 text-accent-pink"/> {skill.questions} Q</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-accent-blue"/> {skill.time}</span>
                  <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-[#10B981]"/> {Math.ceil(skill.questions * 0.7)}+ TO PASS</span>
                </div>
              </div>

              {/* Progress bar border footer */}
              <div className="h-1 bg-[#0D0E12] w-full mt-auto relative overflow-hidden">
                <motion.div 
                  className="h-full" 
                  style={{ background: skill.color }} 
                  initial={{ width: 0 }} 
                  animate={{ width: hoveredSkill === skill.id ? '100%' : '0%' }} 
                  transition={{ duration: 0.3 }} 
                />
              </div>
            </motion.button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 font-mono">
            <p className="text-gray-600 text-xs">NO MODULES MATCH SEARCH PARAMETERS. RE-INITIATING FILTER POOL...</p>
          </div>
        )}
      </div>

      {/* ══ Skill Detail Modal ══ */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4" 
            onClick={() => setSelectedSkill(null)}
          >
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#0D0E12] border border-[#2A2E3D] rounded overflow-hidden shadow-2xl"
            >
              {/* Header bar */}
              <div className="ide-panel-header justify-between select-none">
                <div className="flex items-center gap-2">
                  <TerminalIcon className="w-3.5 h-3.5 text-accent-pink" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase">battleground_compiler_setup.yaml</span>
                </div>
                <button onClick={() => setSelectedSkill(null)} className="w-6 h-6 rounded border border-[#2A2E3D] bg-[#15171F] flex items-center justify-center hover:border-white transition-colors">
                  <X className="w-3.5 h-3.5 text-gray-500 hover:text-white" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                
                <div className="flex items-center gap-4 border-b border-[#2A2E3D]/50 pb-5">
                  <div 
                    className="w-14 h-14 rounded border flex items-center justify-center text-3xl shrink-0" 
                    style={{ background: `${selectedSkill.color}08`, borderColor: `${selectedSkill.color}25` }}
                  >
                    {selectedSkill.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-mono text-white uppercase">{selectedSkill.name} CHALLENGE</h2>
                    <p className="text-xs font-mono text-gray-500 mt-0.5 uppercase">{selectedSkill.desc}</p>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 font-mono">
                  {[
                    { icon: Code2, val: `${selectedSkill.questions}`, label: 'MCQ ITEMS', color: '#FF3366' },
                    { icon: Clock, val: `${selectedSkill.time}`, label: 'DURATION', color: '#3B82F6' },
                    { icon: Trophy, val: '+50 XP', label: 'PRESTIGE HP', color: '#F59E0B' },
                  ].map((s) => (
                    <div key={s.label} className="rounded border border-[#2A2E3D] p-4 text-center bg-[#15171F]/50">
                      <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
                      <p className="text-sm font-bold text-white uppercase">{s.val}</p>
                      <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Target badge */}
                <div className="flex items-center justify-center gap-3 py-3 px-4 rounded border border-dashed border-[#2A2E3D] bg-[#15171F] font-mono">
                  <Target className="w-4 h-4 text-[#10B981]" />
                  <p className="text-xs text-[#10B981] font-bold uppercase tracking-wider">
                    Score {Math.ceil(selectedSkill.questions * 0.7)}+ out of {selectedSkill.questions} correct to unlock matchmaking
                  </p>
                </div>

                {/* Rules */}
                <div className="rounded border border-[#2A2E3D] p-5 bg-[#15171F]/30 font-mono space-y-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5"/> ASSESSMENT CRITERIA
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-center gap-2.5">
                      <Flame className="w-3.5 h-3.5 text-accent-pink shrink-0" />
                      Timed multi-choice verification.
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Flame className="w-3.5 h-3.5 text-accent-pink shrink-0" />
                      Zero limits on system re-execution/attempts.
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Flame className="w-3.5 h-3.5 text-accent-pink shrink-0" />
                      Compiles permanent Hacker badge profile chips.
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 font-mono text-xs pt-2">
                  <button 
                    onClick={() => setSelectedSkill(null)} 
                    className="flex-1 py-3.5 border border-[#2A2E3D] hover:border-gray-500 text-gray-400 hover:text-white rounded uppercase font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => router.push(`/student/skill-assessment/${selectedSkill.id}`)}
                    className="flex-1 py-3.5 bg-[#FF3366] hover:bg-accent-pink-hover text-white rounded uppercase font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    INIT PROTOCOL
                  </button>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
