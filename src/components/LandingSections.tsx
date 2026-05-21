"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Terminal, Shield, Users, GraduationCap, Zap, Target, Heart, Code, Gamepad2, Swords, Star, Award, TrendingUp } from 'lucide-react';
import Logo from './Logo';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 20 }, 
  whileInView: { opacity: 1, y: 0 }, 
  viewport: { once: true, margin: "-50px" }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

function Counter({value, suffix=""}:{value:number, suffix?:string}) {
  const [count, setCount] = useState(0); 
  const ref = useRef<HTMLSpanElement>(null); 
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const t = setInterval(() => {
      s += Math.ceil(value / 15);
      if (s >= value) {
        s = value;
        clearInterval(t);
      }
      setCount(s);
    }, 45);
    return () => clearInterval(t);
  }, [inView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function FloatingSymbols() {
  const syms = ['{', '</>', '()', '#', 'λ', 'const', '0x4A', '[]', '=>'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {syms.map((s, i) => (
        <div 
          key={i} 
          className="absolute text-gray-800/10 font-mono text-xs select-none" 
          style={{
            left: `${10 + i * 11}%`, 
            top: `${5 + ((i * 37) % 80)}%`,
            animation: `pulseGlow ${4 + i}s ease-in-out infinite`
          }}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

export function WhatWeDoSection() {
  return (
    <section id="features" className="relative z-10 bg-[#08090C] py-24 px-8 border-t border-border-dark overflow-hidden scroll-mt-20 developer-grid">
      <FloatingSymbols />
      <div className="max-w-6xl mx-auto relative space-y-16">
        
        <div className="text-center space-y-3">
          <motion.span {...fadeUp()} className="text-[10px] font-mono text-accent-pink tracking-widest uppercase border border-accent-pink/20 px-2 py-0.5 rounded bg-accent-pink/5">
            PLATFORM FEATURES
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight uppercase">
            A SCIENTIFIC MATCHMAKING ECOSYSTEM
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Eliminating empty networking. We compile actual telemetry — tech stack popularity, availability matrices, and coding velocity — to establish high-synergy pairings.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "Scientific Synergy", desc: "Our matchmaking engine aligns core system preferences, schedule overlaps, and style templates to produce a perfect developer index.", color: "#FF3366", borderClass: "group-hover:border-accent-pink/40" },
            { icon: Terminal, title: "Multiplayer IDE Arena", desc: "Write, test, and execute modules collaboratively. Live telemetry, drivers-navigators tracking, stuck diagnostics, and integrated audio overrides.", color: "#3B82F6", borderClass: "group-hover:border-accent-blue/40" },
            { icon: Shield, title: "Mentor stuck interception", desc: "Monitored arenas where certified coaches review codebases live and intervene with instant diagnosis when systems get gridlocked.", color: "#8B5CF6", borderClass: "group-hover:border-accent-purple/40" }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.1)} 
              className="group ide-panel p-8 bg-[#0D0E12] border-border-dark relative transition-all duration-300 hover:bg-[#15171F]"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
              <div 
                className="w-12 h-12 rounded border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                style={{ color: f.color, borderColor: `${f.color}30`, backgroundColor: `${f.color}08` }}
              >
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-mono text-white mb-3 uppercase tracking-wide">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-mono">{f.desc}</p>
              <div className="mt-6 text-[10px] font-mono text-gray-500 flex justify-between">
                <span>MODULE // 0{i + 1}</span>
                <span className="text-accent-pink opacity-0 group-hover:opacity-100 transition-opacity">RUNNING &gt;</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortalsSection() {
  return (
    <section id="portals" className="relative z-10 py-24 px-8 bg-[#0D0E12] border-t border-border-dark scroll-mt-20 noise-bg developer-grid">
      <div className="max-w-6xl mx-auto relative space-y-16">
        
        <div className="text-center space-y-3">
          <motion.span {...fadeUp()} className="text-[10px] font-mono text-accent-blue tracking-widest uppercase border border-accent-blue/20 px-2 py-0.5 rounded bg-accent-blue/5">
            ROLE PROTOCOLS
          </motion.span>
          <h2 className="text-3xl font-bold font-mono text-white tracking-tight uppercase">STUDENT &amp; MENTOR GATEWAYS</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">Choose your integration node. Both vectors optimize for rapid skill progression.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{
            icon: GraduationCap, title: "Student Terminal", color: "#FF3366", accentBg: "rgba(255, 51, 102, 0.05)",
            desc: "Your command grid for growth. Match with compatible peers, run live pairing assess sessions, climb levels, earn HP achievements, and progress.",
            items: ['AI matching diagnostics', 'Real-time multi-pane IDE rooms', 'XP velocity tracking logs', 'Mock assessments & assessments'],
            ItemIcon: Zap
          }, {
            icon: Users, title: "Mentor Dashboard", color: "#8B5CF6", accentBg: "rgba(139, 92, 246, 0.05)",
            desc: "Shape the next core framework. Audit student coding sessions, intercept stuck query diagnostic loops, review compilation logs, and elevate prestige.",
            items: ['Diagnostic cohort statistics', 'Stuck student intervention hub', 'Live session code compiler access', 'Prestigious Gold coaching certification'],
            ItemIcon: Target
          }].map((p, idx) => (
            <motion.div 
              key={idx} 
              {...fadeUp(idx * 0.15)} 
              className="group ide-panel p-8 bg-[#15171F] border-border-dark relative transition-all duration-300 hover:border-gray-600"
            >
              <div 
                className="w-12 h-12 rounded border flex items-center justify-center mb-6"
                style={{ color: p.color, borderColor: `${p.color}30`, backgroundColor: p.accentBg }}
              >
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-mono text-white mb-3 uppercase tracking-tight">{p.title}</h3>
              <p className="text-gray-400 text-xs font-mono leading-relaxed mb-6">{p.desc}</p>
              <ul className="space-y-3 font-mono text-xs text-gray-500">
                {p.items.map((item, i) => (
                  <motion.li key={i} className="flex items-center gap-3 text-gray-400">
                    <div className="w-5 h-5 rounded border border-border-dark flex items-center justify-center bg-[#0D0E12] shrink-0">
                      <p.ItemIcon className="w-3 h-3 text-accent-pink" style={{ color: p.color }} />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LeaderboardSection() {
  return (
    <section id="leaderboard" className="relative z-10 bg-[#08090C] py-24 px-8 border-t border-border-dark scroll-mt-20">
      <FloatingSymbols />
      <div className="max-w-6xl mx-auto relative space-y-16">
        
        <div className="text-center space-y-3">
          <motion.span {...fadeUp()} className="text-[10px] font-mono text-accent-gold tracking-widest uppercase border border-accent-gold/20 px-2 py-0.5 rounded bg-accent-gold/5">
            COMPETE &amp; RISE
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight uppercase">THE ARENA LEADERBOARD</motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-gray-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Every compile, match assessment, and successful project intervention yields Honor Points (HP). Build streaks and certify your status.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Code, label: "Assessment Arena", sub: "Clean builds", gradient: "#FF3366" },
            { icon: Gamepad2, label: "Multiplayer Matches", sub: "Pair programming", gradient: "#3B82F6" },
            { icon: Swords, label: "Intervention Intercepts", sub: "Mentor support", gradient: "#8B5CF6" }
          ].map((c, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.1)} 
              className="group ide-panel p-6 bg-[#0D0E12] text-center border-border-dark transition-all duration-300 hover:bg-[#15171F]"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
                style={{ color: c.gradient, borderColor: `${c.gradient}30`, backgroundColor: `${c.gradient}08` }}
              >
                <c.icon className="w-5 h-5" />
              </div>
              <h4 className="text-md font-bold font-mono text-white mb-1 uppercase tracking-wider">{c.label}</h4>
              <p className="text-gray-500 text-[10px] uppercase font-mono tracking-wider mb-5">{c.sub}</p>
              <div className="text-3xl font-black font-mono text-accent-gold">
                +<Counter value={120} /> HP
              </div>
              <p className="text-gray-600 text-[9px] font-mono mt-1 uppercase">ESTIMATED YIELD</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          {...fadeUp(0.25)} 
          className="ide-panel p-8 bg-[#0D0E12] border-border-dark relative overflow-hidden noise-bg"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded border border-accent-pink/30 bg-[#15171F] flex items-center justify-center shrink-0">
              <TrendingUp className="w-7 h-7 text-accent-pink" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-mono text-white uppercase mb-2">XP MULTIPLIER MECHANISM</h3>
              <p className="text-gray-400 text-xs font-mono leading-relaxed">
                Consistency yields multipliers. Active streaks preserve a <span className="text-accent-pink font-bold">1.5x XP modifier</span>. Falling offline for more than 48 hours resets system registry caches back to zero.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function WhySection() {
  return (
    <section id="why" className="relative z-10 py-24 px-8 bg-[#0D0E12] border-t border-border-dark overflow-hidden scroll-mt-20 developer-grid">
      <div className="max-w-6xl mx-auto relative space-y-16">
        
        <div className="text-center space-y-3">
          <motion.span {...fadeUp()} className="text-[10px] font-mono text-accent-purple tracking-widest uppercase border border-accent-purple/20 px-2 py-0.5 rounded bg-accent-purple/5">
            WHY DATEFORCODE
          </motion.span>
          <h2 className="text-3xl font-bold font-mono text-white tracking-tight uppercase">DEVELOPER-NATIVE ALIGNMENTS</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">No generic social templates. Built exclusively for technical pairing velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Heart, title: "Zero Isolation", desc: "Partner matches bypass sterile profile descriptions. Align entirely on live code exercises.", color: "#FF3366" },
            { icon: Star, title: "Gamified XP Ranks", desc: "Level-up through Silver, Gold, and Cyber-Elite bands. Convert performance directly to ecosystem prestige.", color: "#F59E0B" },
            { icon: Award, title: "Elite Coach Interception", desc: "Mentors are not chat widgets. They possess direct compiler diagnostic injection rights into your IDE.", color: "#8B5CF6" },
            { icon: Zap, title: "Real-time Compiles", desc: "Write authentic software under driver-navigator roles. Sync active cursors and voice feeds.", color: "#3B82F6" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.1)} 
              className="group ide-panel p-6 bg-[#15171F] border-border-dark flex gap-5 transition-all duration-300 hover:border-gray-600"
            >
              <div 
                className="w-10 h-10 rounded border flex items-center justify-center shrink-0"
                style={{ color: item.color, borderColor: `${item.color}30`, backgroundColor: `${item.color}08` }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-mono">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="relative z-10 bg-[#08090C] py-24 px-8 border-t border-border-dark scroll-mt-20">
      <div className="max-w-5xl mx-auto relative space-y-16 text-center">
        
        <div className="space-y-3">
          <motion.span {...fadeUp()} className="text-[10px] font-mono text-accent-pink tracking-widest uppercase border border-accent-pink/20 px-2 py-0.5 rounded bg-accent-pink/5">
            FOUNDING CORE
          </motion.span>
          <h2 className="text-3xl font-bold font-mono text-white tracking-tight uppercase">DEVELOPED BY</h2>
          <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">Engineered by two developers who believe collaborative coding makes stronger developers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {[
            { name: "Aparna", role: "Co-Founder & Lead Architect", color: "#FF3366", bio: "Passionate about building dev tools. Specializes in real-time UI protocols, systems concurrency, and multiplayer WebSockets.", colorClass: "text-accent-pink border-accent-pink/30 bg-accent-pink/5" },
            { name: "Aishwarya", role: "Co-Founder & Compiler Engineer", color: "#3B82F6", bio: "Focuses on telemetry tracking pipelines, diagnostic algorithms, and Firebase integration nodes.", colorClass: "text-accent-blue border-accent-blue/30 bg-accent-blue/5" }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.15)} 
              className="ide-panel p-6 bg-[#0D0E12] border-border-dark flex flex-col justify-between space-y-4 hover:border-gray-600 transition-colors"
            >
              <div>
                <h3 className="text-xl font-bold font-mono text-white uppercase">{f.name}</h3>
                <span className={`text-[9px] font-mono border px-2 py-0.5 rounded inline-block mt-1 font-bold ${f.colorClass}`}>{f.role}</span>
                <p className="text-gray-400 text-xs font-mono leading-relaxed mt-4">{f.bio}</p>
              </div>
              <div className="text-[9px] font-mono text-gray-600 tracking-wider">
                SYS_REGISTRY // VERIFIED OK
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FooterSection() {
  return (
    <footer className="relative z-10 bg-[#08090C] border-t border-border-dark py-12 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <Logo showText={false} className="scale-[0.7] brightness-0 invert" />
          <span className="text-sm font-bold tracking-tight text-white uppercase">DATEFORCODE</span>
        </div>
        <div className="text-center md:text-right space-y-1">
          <div>SECURE TRAFFIC COMPILING SEC-PROTO 4.2</div>
          <div>© 2026 DATEFORCODE. ALL SYSTEM LOGS VERIFIED.</div>
        </div>
      </div>
    </footer>
  );
}

