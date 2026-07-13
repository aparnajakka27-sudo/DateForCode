"use client";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Cpu, Terminal, Shield, Users, GraduationCap, Zap, Target, Heart, Code, Gamepad2, Swords, Star, Award, TrendingUp } from 'lucide-react';
import Logo from './Logo';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 30, scale: 0.98 }, 
  whileInView: { opacity: 1, y: 0, scale: 1 }, 
  viewport: { once: true, margin: "-100px" }, 
  transition: { duration: 0.6, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
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
  const syms = ['{', '</>', '()', '#', 'λ', 'const', '0x4A', '[]', '=>', 'import', 'async', 'await'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {syms.map((s, i) => (
        <div 
          key={i} 
          className="absolute text-[var(--text-muted)]/10 dark:text-[var(--text-muted)]/10 font-mono text-sm select-none animate-pulse" 
          style={{
            left: `${10 + i * 8}%`, 
            top: `${10 + ((i * 41) % 75)}%`,
            animationDelay: `${i * 0.5}s`
          }}
        >
          {s}
        </div>
      ))}
    </div>
  );
}

export function TechMarquee() {
  const techs = [
    "JavaScript", "TypeScript", "React.js", "Next.js", "Python", 
    "Rust", "Go Lang", "C++", "Docker", "Supabase", "Firebase", 
    "TailwindCSS", "Node.js", "PostgreSQL", "GraphQL"
  ];
  const marqueeItems = [...techs, ...techs, ...techs];

  return (
    <div className="w-full py-10 overflow-hidden relative border-y border-[var(--nav-border)] bg-[var(--nav-bg)] backdrop-blur-md">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none" />
      <div className="animate-marquee flex whitespace-nowrap gap-12 items-center">
        {marqueeItems.map((tech, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3366] shadow-[0_0_8px_#FF3366]" />
            <span className="font-mono text-xs font-bold tracking-widest text-[var(--text-secondary)] uppercase hover:text-[var(--text-primary)] transition-colors duration-200 cursor-default">
              {tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhatWeDoSection() {
  return (
    <section id="features" className="relative z-10 bg-[var(--background)] py-32 px-8 border-t border-[var(--nav-border)] overflow-hidden scroll-mt-20 developer-grid">
      <FloatingSymbols />
      <div className="max-w-6xl mx-auto relative space-y-20">
        
        <div className="text-center space-y-4">
          <motion.span {...fadeUp()} className="text-xs font-bold text-[#FF3366] tracking-widest uppercase border border-[#FF3366]/30 px-4 py-1.5 rounded-full bg-[#FF3366]/10 shadow-[0_0_15px_rgba(255,51,102,0.15)]">
            PLATFORM FEATURES
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight">
            A SCIENTIFIC MATCHMAKING ECOSYSTEM
          </motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[var(--text-secondary)] text-base max-w-2xl mx-auto leading-relaxed">
            Eliminating empty networking. We match developers on real-time coding synergy, stack expertise, and schedule compatibility to establish high-synergy pairings.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Cpu, title: "Scientific Synergy", desc: "Our matchmaking engine aligns core system preferences, schedule overlaps, and style templates to produce a perfect developer index.", color: "#FF3366" },
            { icon: Terminal, title: "Multiplayer Workspace", desc: "Write, test, and execute modules collaboratively. Live telemetry, drivers-navigators tracking, stuck diagnostics, and integrated audio overrides.", color: "#3B82F6" },
            { icon: Shield, title: "Stuck Interception", desc: "Monitored arenas where certified coaches review codebases live and intervene with instant diagnosis when systems get gridlocked.", color: "#7B61FF" }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.1)} 
              className="group glass-panel glass-panel-interactive p-8 rounded-[24px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              <div 
                className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                style={{ color: f.color, borderColor: `${f.color}40`, backgroundColor: `${f.color}15`, boxShadow: `0 0 15px ${f.color}20` }}
              >
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 tracking-tight">{f.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-8 text-[10px] font-bold text-[var(--text-muted)] flex justify-between items-center font-mono">
                <span>MODULE // 0{i + 1}</span>
                <span className="text-[#FF3366] opacity-0 group-hover:opacity-100 transition-opacity font-bold font-mono">DETAILS &gt;&gt;</span>
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
    <section id="portals" className="relative z-10 py-32 px-8 bg-[var(--background)] border-t border-[var(--nav-border)] scroll-mt-20 noise-bg developer-grid">
      <div className="max-w-6xl mx-auto relative space-y-20">
        
        <div className="text-center space-y-4">
          <motion.span {...fadeUp()} className="text-xs font-bold text-[#3B82F6] tracking-widest uppercase border border-[#3B82F6]/30 px-4 py-1.5 rounded-full bg-[#3B82F6]/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            ROLE PROTOCOLS
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight uppercase">STUDENT &amp; MENTOR GATEWAYS</h2>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto leading-relaxed">Choose your path. Both gateways optimize for rapid skill progression and high compatibility.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{
            icon: GraduationCap, title: "Student Gateway", color: "#FF3366", accentBg: "rgba(255, 51, 102, 0.1)",
            desc: "Your command grid for growth. Match with compatible peers, run live pairing assess sessions, climb levels, earn HP achievements, and progress.",
            items: ['AI matching diagnostics', 'Real-time multi-pane IDE rooms', 'XP velocity tracking logs', 'Mock assessments & reviews'],
            ItemIcon: Zap
          }, {
            icon: Users, title: "Mentor Dashboard", color: "#7B61FF", accentBg: "rgba(123, 97, 255, 0.1)",
            desc: "Shape the next core framework. Audit student coding sessions, intercept stuck query diagnostic loops, review compilation logs, and elevate prestige.",
            items: ['Diagnostic cohort statistics', 'Stuck student intervention hub', 'Live session code compiler access', 'Prestigious coaching certification'],
            ItemIcon: Target
          }].map((p, idx) => (
            <motion.div 
              key={idx} 
              {...fadeUp(idx * 0.15)} 
              className="group glass-panel glass-panel-interactive p-8 rounded-[32px] relative overflow-hidden"
            >
              <div 
                className="w-12 h-12 rounded-2xl border flex items-center justify-center mb-6"
                style={{ color: p.color, borderColor: `${p.color}35`, backgroundColor: p.accentBg, boxShadow: `0 0 15px ${p.color}15` }}
              >
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">{p.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{p.desc}</p>
              <ul className="space-y-3 text-xs text-[var(--text-muted)]">
                {p.items.map((item, i) => (
                  <motion.li key={i} className="flex items-center gap-3 text-[var(--text-secondary)] font-medium">
                    <div className="w-5 h-5 rounded-lg border border-[var(--panel-border)] flex items-center justify-center bg-[var(--background)] shrink-0 shadow-sm">
                      <p.ItemIcon className="w-3 h-3 text-[#FF3366]" style={{ color: p.color }} />
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
    <section id="leaderboard" className="relative z-10 bg-[var(--background)] py-32 px-8 border-t border-[var(--nav-border)] scroll-mt-20">
      <FloatingSymbols />
      <div className="max-w-6xl mx-auto relative space-y-20">
        
        <div className="text-center space-y-4">
          <motion.span {...fadeUp()} className="text-xs font-bold text-[#FFD166] tracking-widest uppercase border border-[#FFD166]/30 px-4 py-1.5 rounded-full bg-[#FFD166]/10 shadow-[0_0_15px_rgba(255,209,102,0.15)]">
            COMPETE &amp; RISE
          </motion.span>
          <motion.h2 {...fadeUp(0.1)} className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight uppercase">THE ARENA LEADERBOARD</motion.h2>
          <motion.p {...fadeUp(0.15)} className="text-[var(--text-secondary)] text-base max-w-2xl mx-auto leading-relaxed">
            Every compile, match assessment, and successful project intervention yields Honor Points (HP). Build streaks and certify your status.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Code, label: "Assessment Arena", sub: "Clean builds", gradient: "#FF3366" },
            { icon: Gamepad2, label: "Multiplayer Matches", sub: "Pair programming", gradient: "#3B82F6" },
            { icon: Swords, label: "Intervention Intercepts", sub: "Mentor support", gradient: "#7B61FF" }
          ].map((c, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.1)} 
              className="group glass-panel glass-panel-interactive p-8 rounded-[24px] text-center"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
                style={{ color: c.gradient, borderColor: `${c.gradient}30`, backgroundColor: `${c.gradient}10` }}
              >
                <c.icon className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)] mb-1 tracking-tight">{c.label}</h4>
              <p className="text-[var(--text-muted)] text-xs font-semibold uppercase tracking-wider mb-5 font-mono">{c.sub}</p>
              <div className="text-3xl font-black text-[#FFD166] drop-shadow-sm font-mono">
                +<Counter value={120} /> HP
              </div>
              <p className="text-[var(--text-muted)] text-[10px] mt-2 font-bold tracking-wider font-mono">ESTIMATED YIELD</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          {...fadeUp(0.25)} 
          className="glass-panel p-8 rounded-[24px] relative overflow-hidden noise-bg border-[var(--nav-border)]"
        >
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl border border-[var(--panel-border)] bg-[var(--btn-sec-bg)] flex items-center justify-center shrink-0 shadow-sm">
              <TrendingUp className="w-6 h-6 text-[#FF3366]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">XP MULTIPLIER MECHANISM</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                Consistency yields multipliers. Active streaks preserve a <span className="text-[#FF3366] font-bold">1.5x XP modifier</span>. Stay connected to keep your streak multiplier active and climbing.
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
    <section id="why" className="relative z-10 py-32 px-8 bg-[var(--background)] border-t border-[var(--nav-border)] overflow-hidden scroll-mt-20 developer-grid">
      <div className="max-w-6xl mx-auto relative space-y-20">
        
        <div className="text-center space-y-4">
          <motion.span {...fadeUp()} className="text-xs font-bold text-[#7B61FF] tracking-widest uppercase border border-[#7B61FF]/30 px-4 py-1.5 rounded-full bg-[#7B61FF]/10 shadow-[0_0_15px_rgba(123,97,255,0.15)]">
            WHY DATEFORCODE
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">DEVELOPER-NATIVE ALIGNMENTS</h2>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto leading-relaxed">No generic social templates. Built exclusively for technical pairing velocity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: Heart, title: "Zero Isolation", desc: "Partner matches bypass sterile profile descriptions. Align entirely on live code exercises.", color: "#FF3366" },
            { icon: Star, title: "Gamified XP Ranks", desc: "Level-up through Silver, Gold, and Cyber-Elite bands. Convert performance directly to ecosystem prestige.", color: "#FFD166" },
            { icon: Award, title: "Interception Rights", desc: "Mentors are not chat widgets. They possess direct compiler diagnostic injection rights into your IDE.", color: "#7B61FF" },
            { icon: Zap, title: "Real-time Compiles", desc: "Write authentic software under driver-navigator roles. Sync active cursors and voice feeds.", color: "#3B82F6" }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.1)} 
              className="group glass-panel glass-panel-interactive p-8 rounded-[24px] flex gap-5"
            >
              <div 
                className="w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm"
                style={{ color: item.color, borderColor: `${item.color}30`, backgroundColor: `${item.color}10` }}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight">{item.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{item.desc}</p>
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
    <section id="team" className="relative z-10 bg-[var(--background)] py-32 px-8 border-t border-[var(--nav-border)] scroll-mt-20">
      <div className="max-w-5xl mx-auto relative space-y-20 text-center">
        
        <div className="space-y-4">
          <motion.span {...fadeUp()} className="text-xs font-bold text-[#FF3366] tracking-widest uppercase border border-[#FF3366]/30 px-4 py-1.5 rounded-full bg-[#FF3366]/10 shadow-[0_0_15px_rgba(255,51,102,0.15)]">
            FOUNDING CORE
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight">DEVELOPED BY</h2>
          <p className="text-[var(--text-secondary)] text-base max-w-lg mx-auto leading-relaxed">Engineered by two developers who believe collaborative coding makes stronger developers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {[
            { name: "Aparna", role: "Co-Founder & Lead Architect", color: "#FF3366", bio: "Passionate about building dev tools. Specializes in real-time UI protocols, systems concurrency, and multiplayer WebSockets.", colorClass: "text-[#FF3366] border-[#FF3366]/30 bg-[#FF3366]/10 shadow-[0_0_12px_rgba(255,51,102,0.1)]" },
            { name: "Aishwarya", role: "Co-Founder & Compiler Engineer", color: "#3B82F6", bio: "Focuses on telemetry tracking pipelines, diagnostic algorithms, and Firebase integration nodes.", colorClass: "text-[#3B82F6] border-[#3B82F6]/30 bg-[#3B82F6]/10 shadow-[0_0_12px_rgba(59,130,246,0.1)]" }
          ].map((f, i) => (
            <motion.div 
              key={i} 
              {...fadeUp(i * 0.15)} 
              className="glass-panel glass-panel-interactive p-8 rounded-[32px] flex flex-col justify-between space-y-6"
            >
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{f.name}</h3>
                <span className={`text-[10px] border px-3 py-1 rounded-full inline-block mt-2 font-bold uppercase tracking-wider font-mono ${f.colorClass}`}>{f.role}</span>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed mt-4">{f.bio}</p>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest font-mono">
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
    <footer className="relative z-10 bg-[var(--nav-bg)] border-t border-[var(--nav-border)] py-16 px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--text-secondary)] font-semibold font-mono">
        <div className="flex items-center gap-3">
          <Logo showText={false} className="scale-[0.7] opacity-80" />
          <span className="text-sm font-extrabold tracking-tight text-[var(--text-primary)] uppercase">DATEFORCODE</span>
        </div>
        <div className="text-center md:text-right space-y-1">
          <div className="tracking-wider text-[var(--text-muted)] font-mono">SECURE TRAFFIC COMPILING SEC-PROTO 4.2</div>
          <div className="text-[var(--text-muted)] font-mono">© 2026 DATEFORCODE. ALL SYSTEM LOGS VERIFIED.</div>
        </div>
      </div>
    </footer>
  );
}
