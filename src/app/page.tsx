"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, LogOut, Terminal as TerminalIcon, Sparkles, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '../components/Logo';
import { WhatWeDoSection, PortalsSection, LeaderboardSection, WhySection, TeamSection, FooterSection } from '../components/LandingSections';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

// Small coding symbols for background effects
const CODE_SYMBOLS = [
  '{', '}', '<', '>', '/', ';', '(', ')', '[', ']',
  '#', '*', '=', '+', '&', '|', '!', '~', '%', '^',
  '//', '=>', '&&', '||', '!=', '==', '<<', '>>',
  '</', '/>', '{}', '()', '[]', 'λ', '0x4A', 'const'
];

interface CodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  symbol: string;
  fontSize: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

const TERMINAL_LOG_TEMPLATES = [
  { type: 'info', text: 'SEARCHING_NODES: Compiling compatibility registers...' },
  { type: 'success', text: 'COGNITIVE_ALIGNMENT: High synergy stack overlap detected.' },
  { type: 'stats', text: 'MATCH_STRENGTH: 97.4% synergy coefficient resolved.' },
  { type: 'system', text: 'ESTABLISHING_SOCKET: Direct WebRTC audio/compiler link allocated.' },
  { type: 'success', text: 'PAIR_ESTABLISHED: [kernel_wizard] paired with [react_guru] -> Room #4928' },
  { type: 'info', text: 'STUCK_INTERCEPT: Student thread #1209 requested mentor diagnostic.' },
  { type: 'mentor', text: 'MENTOR_INJECTED: prestige coach [Dr_Recursion] joined code workspace.' },
  { type: 'success', text: 'STUCK_RESOLVED: Code compile success. +120 HP added to collective.' },
  { type: 'info', text: 'POLLING_ARENA: Awaiting active matchmaking requests...' }
];

export default function LandingPage() {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dashboardLink, setDashboardLink] = useState("/login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; time: string; type: string; text: string }>>([]);
  const [telemetry, setTelemetry] = useState({
    activeMatches: 342,
    connectedSockets: 1482,
    activeMentors: 28,
    averageSynergy: 94.2
  });

  useEffect(() => {
    setMounted(true);
    const isStudent = localStorage.getItem('dateforcode_student_setup');
    const isMentor = localStorage.getItem('dateforcode_mentor_profile');
    
    if (isStudent || isMentor) {
      setIsLoggedIn(true);
      const link = isMentor ? "/mentor/dashboard" : "/student/dashboard";
      setDashboardLink(link);
    }
  }, []);

  // Live Terminal Log Simulator
  useEffect(() => {
    if (!mounted) return;

    // Seed initial logs
    const seedLogs = Array.from({ length: 6 }).map((_, index) => {
      const template = TERMINAL_LOG_TEMPLATES[index % TERMINAL_LOG_TEMPLATES.length];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      return {
        id: index,
        time: timeStr,
        type: template.type,
        text: template.text
      };
    });
    setTerminalLogs(seedLogs);

    // Dynamic compilation ticker
    let logCounter = 6;
    const logInterval = setInterval(() => {
      const template = TERMINAL_LOG_TEMPLATES[Math.floor(Math.random() * TERMINAL_LOG_TEMPLATES.length)];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      setTerminalLogs(prev => {
        const next = [...prev, {
          id: logCounter++,
          time: timeStr,
          type: template.type,
          text: template.text
        }];
        if (next.length > 8) {
          next.shift();
        }
        return next;
      });

      // Fluctuate telemetry values slightly to simulate dynamic updates
      setTelemetry(prev => ({
        activeMatches: prev.activeMatches + (Math.random() > 0.5 ? 1 : -1),
        connectedSockets: prev.connectedSockets + (Math.random() > 0.5 ? 2 : -2),
        activeMentors: prev.activeMentors + (Math.random() > 0.8 ? 1 : Math.random() < 0.2 ? -1 : 0),
        averageSynergy: parseFloat((prev.averageSynergy + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2))
      }));

    }, 3000);

    return () => clearInterval(logInterval);
  }, [mounted]);

  // Glowing Code particles (adapted for dark mode background)
  useEffect(() => {
    if (!mounted) return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: CodeParticle[] = [];
    let lastX = 0, lastY = 0, animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawn = (x: number, y: number) => {
      const colors = ['#FF3366', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
          fontSize: Math.random() * 10 + 9,
          life: 0,
          maxLife: Math.random() * 60 + 40,
          rotation: (Math.random() - 0.5) * 60,
          rotationSpeed: (Math.random() - 0.5) * 3,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const mouseAbsoluteY = e.clientY + scrollTop;
      if (mouseAbsoluteY > window.innerHeight) return;

      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      if (Math.sqrt(dx * dx + dy * dy) > 8) {
        spawn(e.clientX, e.clientY);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let i = particles.length;
      while (i--) { if (particles[i].life >= particles[i].maxLife) particles.splice(i, 1); }

      for (const p of particles) {
        p.life++;
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.03; p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.font = `bold ${p.fontSize}px 'Space Mono', 'Courier New', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      }
      animId = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    loop();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [mounted]);

  // Scroll-driven video popup animation
  useEffect(() => {
    if (!mounted) return;
    const section = videoSectionRef.current;
    const wrapper = videoWrapperRef.current;
    if (!section || !wrapper) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowH = window.innerHeight;

      const start = windowH;
      const end = windowH * 0.3;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));

      const scale = 0.85 + progress * 0.15;
      const opacity = progress;
      const translateY = (1 - progress) * 50;
      const radius = 20 - progress * 14;

      wrapper.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      wrapper.style.opacity = `${opacity}`;
      wrapper.style.borderRadius = `${radius}px`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[#08090C] text-[#F3F4F6] selection:bg-[#FF3366]/20 selection:text-[#FF3366] noise-bg overflow-x-hidden font-sans">
      {/* Code Particles Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />

      {/* Sticky High-Contrast Header */}
      <nav className="fixed top-0 w-full z-50 bg-[#08090C]/80 backdrop-blur-md border-b border-[#2A2E3D]/50 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center">
          <Logo showText={true} className="scale-[0.9] origin-left" />
        </div>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: 'Ecosystem Features', href: '#features' },
            { label: 'Role Portals', href: '#portals' },
            { label: 'Skill Arena', href: '#leaderboard' },
            { label: 'Why Us', href: '#why' },
            { label: 'Founders', href: '#team' }
          ].map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-[11px] font-bold font-mono uppercase tracking-[0.2em] text-[#9CA3AF] hover:text-white transition-colors duration-200 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-[#FF3366] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link 
                href={dashboardLink} 
                className="px-5 py-2 text-xs font-mono font-bold uppercase tracking-widest border border-accent-blue/30 bg-accent-blue/5 text-[#3B82F6] hover:bg-accent-blue/15 transition-all duration-300 rounded"
              >
                Dashboard
              </Link>
              <button 
                onClick={async () => {
                  await signOut(auth);
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-2 border border-[#2A2E3D] hover:border-[#FF3366] hover:text-[#FF3366] rounded text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Exit
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-6 py-2 rounded border border-[#2A2E3D] bg-[#15171F] text-white text-xs font-mono font-bold uppercase tracking-widest hover:border-accent-pink hover:text-[#FF3366] transition-all duration-300"
            >
              System Auth // Login
            </Link>
          )}
        </div>
      </nav>

      {/* Multiplayer Matchmaking Hero Section */}
      <section className="relative z-10 min-h-screen pt-32 pb-16 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-center developer-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: High-Density Platform Stats and Direct Action Nodes */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded border border-accent-pink/30 bg-accent-pink/5 text-accent-pink text-[11px] font-mono uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-ping" />
              Multiplayer Matchmaking Operational v2.4
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-mono tracking-tight text-white leading-tight uppercase">
              BECAUSE EVERY GREAT PROJECT NEEDS A <span className="text-[#FF3366] accent-glow">GREAT PARTNER.</span>
            </h1>

            <p className="text-[#9CA3AF] text-sm md:text-base max-w-xl font-mono leading-relaxed">
              DateForCode is a hyper-focused peer-programming match matrix. We discard traditional social bio slop and compile concrete telemetry: tech stacks, scheduled calendar overlaps, and code speed alignment vectors.
            </p>

            {/* Live Telemetry Ticker */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-border-dark rounded bg-[#0D0E12] font-mono text-xs">
              <div>
                <div className="text-gray-500 uppercase text-[9px] tracking-wider mb-0.5">Active Matches</div>
                <div className="text-white font-bold text-base flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-accent-blue" />
                  {telemetry.activeMatches}
                </div>
              </div>
              <div>
                <div className="text-gray-500 uppercase text-[9px] tracking-wider mb-0.5">Live Telemetry</div>
                <div className="text-[#10B981] font-bold text-base flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  {telemetry.connectedSockets}
                </div>
              </div>
              <div>
                <div className="text-gray-500 uppercase text-[9px] tracking-wider mb-0.5">Prestige Mentors</div>
                <div className="text-accent-gold font-bold text-base flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-accent-gold" />
                  {telemetry.activeMentors}
                </div>
              </div>
              <div>
                <div className="text-gray-500 uppercase text-[9px] tracking-wider mb-0.5">Avg Synergy</div>
                <div className="text-accent-pink font-bold text-base flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-accent-pink" />
                  {telemetry.averageSynergy}%
                </div>
              </div>
            </div>

            {/* Direct Vector CTA Triggers */}
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                href={dashboardLink} 
                className="btn-premium px-8 py-3.5 flex items-center gap-3 text-xs tracking-[0.15em] uppercase transition-all duration-300"
              >
                <span>{isLoggedIn ? "Go to Dashboard" : "Initiate System Setup"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#portals" 
                className="btn-secondary-dev px-8 py-3.5 text-xs tracking-[0.12em] uppercase transition-all duration-300 flex items-center gap-2"
              >
                Explore Portals
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Real-Time Matchmaking Queue Console */}
          <div className="lg:col-span-5">
            <div className="ide-panel w-full overflow-hidden shadow-2xl relative">
              
              {/* Panel Header bar */}
              <div className="ide-panel-header justify-between select-none">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                    <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase ml-2">match_queue_compiler.sh</span>
                </div>
                <span className="text-[9px] font-mono text-[#10B981] px-2 py-0.5 rounded bg-accent-green/10 border border-accent-green/20 uppercase tracking-widest font-bold">
                  LIVE SOCKETS
                </span>
              </div>

              {/* Terminal Logs Container */}
              <div className="p-5 min-h-[300px] max-h-[340px] font-mono text-xs overflow-y-auto space-y-3 bg-[#0D0E12]/80 scrollbar-none">
                <div className="text-gray-600 text-[10px] uppercase border-b border-border-dark pb-2 mb-2 flex justify-between">
                  <span>TELEMETRY STACKS COMPILED</span>
                  <span>TIME UTC</span>
                </div>

                {terminalLogs.map((log) => {
                  let badgeColor = "text-[#3B82F6]";
                  if (log.type === "success") badgeColor = "text-[#10B981]";
                  if (log.type === "stats") badgeColor = "text-[#FF3366]";
                  if (log.type === "mentor") badgeColor = "text-[#8B5CF6]";

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3 border-l border-border-dark pl-3 hover:bg-white/[0.02] py-1 rounded transition-colors"
                    >
                      <span className="text-gray-600 shrink-0 text-[10px]">{log.time}</span>
                      <div className="flex-1 leading-relaxed">
                        <span className={`font-bold ${badgeColor} mr-1`}>
                          [{log.type.toUpperCase()}]
                        </span>
                        <span className="text-gray-300">{log.text}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Console Status Footer */}
              <div className="bg-[#08090C] border-t border-border-dark p-3.5 px-5 font-mono text-[10px] text-gray-500 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <TerminalIcon className="w-3.5 h-3.5 text-accent-pink" />
                  <span>MATRIX: ACTIVE</span>
                </div>
                <div>SECURE TLS 1.3 // 256-BIT</div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center justify-center pt-24 pb-8 text-[#2A2E3D]">
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] mb-2 text-gray-600">Scroll down for full audit</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-accent-pink" />
          </motion.div>
        </div>
      </section>

      {/* Video Showcase Section — Refined IDE-Framed popup */}
      <section ref={videoSectionRef} className="relative z-10 py-16 md:py-24 px-6 md:px-12 overflow-hidden bg-[#0D0E12] border-t border-border-dark">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-mono text-accent-blue tracking-widest uppercase border border-accent-blue/20 px-2 py-0.5 rounded bg-accent-blue/5">
              interactive compilation demo
            </span>
            <h2 className="text-3xl font-bold font-mono text-white tracking-tight uppercase">HOW WE ELIMINATE EMPTY CHAT</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto font-mono">
              Watch a quick compilation walk of DateForCode real-time code environments.
            </p>
          </div>

          <div
            ref={videoWrapperRef}
            className="w-full overflow-hidden border border-border-dark bg-[#08090C] shadow-2xl transition-all duration-500 ease-out"
            style={{ opacity: 0, transform: 'scale(0.85) translateY(50px)', borderRadius: '20px', willChange: 'transform, opacity' }}
          >
            {/* Window control bar */}
            <div className="ide-panel-header border-b border-border-dark select-none justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                <span className="text-[10px] font-mono text-gray-500 uppercase ml-2">quick_compile_screencast.mp4</span>
              </div>
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" />
            </div>

            <div
              className="relative aspect-video bg-gradient-to-br from-[#0a0a0a] to-[#12131a] cursor-pointer group"
              onClick={() => {
                if (videoRef.current && videoRef.current.src) {
                  if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
                  setIsPlaying(!isPlaying);
                }
              }}
            >
              {/* Video Element */}
              <video ref={videoRef} className="w-full h-full object-cover" loop muted playsInline />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center gap-4 scale-95 group-hover:scale-100 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-[#FF3366] flex items-center justify-center shadow-lg shadow-accent-pink/30 hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-white ml-0.5 fill-white" />
                  </div>
                  <span className="text-white text-[11px] font-mono font-bold uppercase tracking-[0.25em]">Compile Demo</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <span className="text-white/20 text-[9px] font-mono uppercase tracking-[0.4em]">Interactive Demo Workspace Pre-compiled</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sections Overhauled for High Density */}
      <WhatWeDoSection />
      <PortalsSection />
      <LeaderboardSection />
      <WhySection />
      <TeamSection />
      <FooterSection />
    </main>
  );
}
