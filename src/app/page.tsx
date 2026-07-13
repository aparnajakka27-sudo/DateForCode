"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, LogOut, Sparkles, Activity, ShieldAlert, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import { WhatWeDoSection, PortalsSection, LeaderboardSection, WhySection, TeamSection, FooterSection, TechMarquee } from '../components/LandingSections';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

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
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dashboardLink, setDashboardLink] = useState("/login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<Array<{ id: number; time: string; type: string; text: string }>>([]);
  const [telemetry, setTelemetry] = useState({
    activeMatches: 342,
    connectedSockets: 1482,
    activeMentors: 28,
    averageSynergy: 94.2
  });

  // Track if Dark Mode is active to pass correct properties to Logo
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Spotlight Cursor Position State
  const spotlightX = useSpring(-1000, { stiffness: 120, damping: 20 });
  const spotlightY = useSpring(-1000, { stiffness: 120, damping: 20 });

  useEffect(() => {
    setMounted(true);
    
    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Event listener for theme changes
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsDarkMode(customEvent.detail === 'dark');
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => {
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);

  // Track cursor position for Spotlight effect
  useEffect(() => {
    if (!mounted) return;
    const handleMouseMove = (e: MouseEvent) => {
      spotlightX.set(e.clientX);
      spotlightY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted, spotlightX, spotlightY]);

  // Live Terminal Log Simulator
  useEffect(() => {
    if (!mounted) return;

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

      setTelemetry(prev => ({
        activeMatches: prev.activeMatches + (Math.random() > 0.5 ? 1 : -1),
        connectedSockets: prev.connectedSockets + (Math.random() > 0.5 ? 2 : -2),
        activeMentors: prev.activeMentors + (Math.random() > 0.8 ? 1 : Math.random() < 0.2 ? -1 : 0),
        averageSynergy: parseFloat((prev.averageSynergy + (Math.random() > 0.5 ? 0.05 : -0.05)).toFixed(2))
      }));

    }, 3000);

    return () => clearInterval(logInterval);
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

  // Framer Motion spring styles for spotlight
  const spotlightStyle = {
    x: spotlightX,
    y: spotlightY,
  };

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#FF3366]/20 selection:text-[#FF3366] noise-bg overflow-x-hidden font-sans">
      
      {/* Spotlight Cursor Trail */}
      <motion.div 
        className="spotlight-cursor hidden md:block" 
        style={spotlightStyle} 
      />

      {/* Aurora mesh glows */}
      <div className="aurora-mesh" />

      {/* Floating Premium Glassmorphism Header */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center w-full px-4 md:px-6 pointer-events-none">
        <nav className="pointer-events-auto bg-[var(--nav-bg)] backdrop-blur-xl border border-[var(--nav-border)] shadow-xl rounded-full py-3 px-6 lg:px-8 flex justify-between items-center w-full max-w-[1400px] mx-auto transition-all duration-500 gap-4">
          
          {/* Logo (Far Left, Fixed) */}
          <div className="flex items-center flex-shrink-0">
            <Logo showText={true} isDarkBg={isDarkMode} className="scale-[0.90] md:scale-95 origin-left" />
          </div>
          
          {/* Navigation Links (Center, Flexible, Hidden on smaller screens to prevent overlap) */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-6 xl:gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Portals', href: '#portals' },
              { label: 'Arena', href: '#leaderboard', isLive: true },
              { label: 'Why Us', href: '#why' },
              { label: 'Founders', href: '#team' }
            ].map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="relative text-[12px] font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-300 group flex items-center gap-1.5"
              >
                <span>{item.label}</span>
                {item.isLive && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#10B981]"></span>
                  </span>
                )}
                
                {/* Elegant Animated Dot Indicator */}
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF3366] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-[0_0_8px_rgba(255,51,102,0.8)]" />
              </a>
            ))}
          </div>

          {/* Action Buttons (Far Right, Fixed Shrink-0) */}
          <div className="flex items-center justify-end gap-3 xl:gap-4 flex-shrink-0">
            {/* Theme Toggler Button */}
            <ThemeToggle />

            {/* Unauthenticated State ONLY - authenticated users are automatically redirected by middleware */}
            <Link 
              href="/login" 
              className="flex justify-center items-center w-[110px] h-[40px] rounded-full border border-[var(--btn-sec-border)] bg-[var(--btn-sec-bg)] text-[var(--btn-sec-text)] text-[12px] font-bold hover:border-[#FF3366] hover:text-[#FF3366] transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(255,51,102,0.2)] tracking-wide whitespace-nowrap"
            >
              Sign In
            </Link>
          </div>
        </nav>
      </div>

      {/* Multiplayer Matchmaking Hero Section */}
      <section className="relative z-10 min-h-screen pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col justify-center developer-grid">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: High-Density Platform Stats and Direct Action Nodes */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#FF3366]/30 bg-[#FF3366]/10 text-[#FF3366] text-xs font-bold font-mono shadow-[0_0_12px_rgba(255,51,102,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#FF3366] animate-ping" />
              SYSTEM PROTOCOL // ACTIVE & READY
            </motion.div>

            {/* Hero Text Reveal */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.08]"
              >
                Find your perfect <span className="bg-gradient-to-r from-[#FF3366] via-[#7B61FF] to-[#3B82F6] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,51,102,0.15)]">coding partner.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-[var(--text-secondary)] text-base md:text-lg max-w-xl leading-relaxed font-normal"
              >
                DateForCode is a premium matchmaking ecosystem matching developers based on real-time coding synergy, stack expertise, and schedule compatibility.
              </motion.p>
            </div>

            {/* Live Telemetry Ticker inside Glassmorphism */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 border border-[var(--panel-border)] rounded-3xl bg-[var(--panel-bg)] backdrop-blur-md shadow-2xl text-xs"
            >
              <div>
                <div className="text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider text-[9px] font-mono">Active Matches</div>
                <div className="text-[var(--text-primary)] font-bold text-lg flex items-center gap-1.5 font-mono">
                  <Activity className="w-4 h-4 text-[#3B82F6]" />
                  {telemetry.activeMatches}
                </div>
              </div>
              <div>
                <div className="text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider text-[9px] font-mono">Live Telemetry</div>
                <div className="text-[#10B981] font-bold text-lg flex items-center gap-1.5 font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                  {telemetry.connectedSockets}
                </div>
              </div>
              <div>
                <div className="text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider text-[9px] font-mono">Prestige Mentors</div>
                <div className="text-[#7B61FF] font-bold text-lg flex items-center gap-1.5 font-mono">
                  <ShieldAlert className="w-4 h-4 text-[#7B61FF]" />
                  {telemetry.activeMentors}
                </div>
              </div>
              <div>
                <div className="text-[var(--text-muted)] font-semibold mb-1 uppercase tracking-wider text-[9px] font-mono">Avg Synergy</div>
                <div className="text-[#FF3366] font-bold text-lg flex items-center gap-1.5 font-mono">
                  <Sparkles className="w-4 h-4 text-[#FF3366]" />
                  {telemetry.averageSynergy}%
                </div>
              </div>
            </motion.div>

            {/* Direct Vector CTA Triggers with Gradient Border Button styling */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link 
                href={dashboardLink} 
                className="btn-premium px-8 py-4 flex items-center gap-3 text-xs tracking-wider transition-all duration-300 font-bold"
              >
                <span>{isLoggedIn ? "Go to Dashboard" : "Initiate Setup"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a 
                href="#portals" 
                className="btn-secondary-dev px-8 py-4 text-xs tracking-wider font-semibold transition-all duration-300 flex items-center gap-2"
              >
                Explore Portals
              </a>
            </motion.div>
          </div>

          {/* Right Column: Premium Modern Matchmaking Showcase (Glassmorphism + Terminal Animations) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="ide-panel w-full overflow-hidden shadow-2xl relative border border-[var(--ide-border)] bg-[var(--ide-bg)] backdrop-blur-md rounded-3xl">
              
              {/* Card Header bar */}
              <div className="ide-panel-header justify-between select-none border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-pink-500/80" />
                    <span className="w-3 h-3 rounded-full bg-purple-500/80" />
                    <span className="w-3 h-3 rounded-full bg-blue-500/80" />
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)] ml-2 font-mono">Compatibility Registry</span>
                </div>
                <span className="text-[9px] text-[#FF3366] px-3 py-1 rounded-full bg-[#FF3366]/10 border border-[#FF3366]/20 tracking-widest font-bold font-mono">
                  ACTIVE SYNERGY
                </span>
              </div>

              {/* Terminal Logs Container (Cyberpunk terminal styling) */}
              <div className="p-6 min-h-[300px] max-h-[340px] text-xs overflow-y-auto space-y-3 bg-[var(--background)]/30 scrollbar-none font-mono">
                <div className="text-[var(--text-muted)] text-[10px] font-bold border-b border-[var(--ide-border)] pb-2 mb-2 flex justify-between">
                  <span>REAL-TIME COGNITIVE ALIGNMENTS</span>
                  <span>SYNCED <span className="caret-blink ml-1" /></span>
                </div>

                {terminalLogs.map((log) => {
                  let badgeBg = "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20";
                  if (log.type === "success") badgeBg = "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20";
                  if (log.type === "stats") badgeBg = "bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20";
                  if (log.type === "mentor") badgeBg = "bg-[#7B61FF]/10 text-[#7B61FF] border border-[#7B61FF]/20";

                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-3 border border-[var(--panel-border)] bg-[var(--panel-bg)] p-3 rounded-2xl shadow-sm hover:border-[#FF3366]/20 transition-colors"
                    >
                      <span className="text-[9px] text-[var(--text-muted)] font-semibold px-2 py-0.5 rounded border border-[var(--panel-border)] shrink-0 bg-[var(--btn-sec-bg)] font-mono">
                        {log.time}
                      </span>
                      <div className="flex-1 leading-relaxed text-[11px]">
                        <span className={`font-extrabold text-[9px] tracking-wider px-2 py-0.5 rounded mr-2 uppercase ${badgeBg}`}>
                          {log.type}
                        </span>
                        <span className="text-[var(--text-secondary)] font-medium">{log.text}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Console Status Footer */}
              <div className="bg-[var(--ide-header-bg)] border-t border-[var(--ide-border)] p-4 px-6 text-xs text-[var(--text-secondary)] flex justify-between items-center font-medium font-mono">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FF3366] animate-pulse" />
                  <span className="font-semibold text-[var(--text-primary)]">Perfect Coding Synergy</span>
                </div>
                <div className="text-[9px] tracking-wide text-[var(--text-muted)]">SECURE MATCH PROTOCOL</div>
              </div>

            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div className="flex flex-col items-center justify-center pt-24 pb-8 text-[var(--text-muted)]">
          <span className="text-[10px] uppercase tracking-[0.3em] mb-2 font-bold font-mono">Discover our methodology</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 text-[#FF3366]" />
          </motion.div>
        </div>
      </section>

      {/* Tech Logo Marquee animations inserted right under Hero */}
      <TechMarquee />

      {/* Video Showcase Section (Smooth Scroll Reveal scale animation) */}
      <section ref={videoSectionRef} className="relative z-10 py-24 px-6 md:px-12 overflow-hidden bg-[var(--background)] border-t border-[var(--panel-border)]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-[10px] font-bold text-[#FF3366] tracking-widest uppercase border border-[#FF3366]/30 px-3 py-1 rounded-full bg-[#FF3366]/10">
              Interactive Demo
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] tracking-tight uppercase">HOW WE ELIMINATE EMPTY CHAT</h2>
            <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto">
              Experience the fast, visual compilation of DateForCode real-time code environments.
            </p>
          </div>

          <div
            ref={videoWrapperRef}
            className="w-full overflow-hidden border border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-2xl transition-all duration-500 ease-out rounded-3xl"
            style={{ opacity: 0, transform: 'scale(0.85) translateY(50px)', borderRadius: '24px', willChange: 'transform, opacity' }}
          >
            {/* Window control bar */}
            <div className="ide-panel-header border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)] select-none justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-pink-500/60" />
                <span className="w-3 h-3 rounded-full bg-purple-500/60" />
                <span className="w-3 h-3 rounded-full bg-blue-500/60" />
                <span className="text-xs font-semibold text-[var(--text-secondary)] ml-2 font-mono">quick_compile_screencast.mp4</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            </div>

            <div
              className="relative aspect-video bg-gradient-to-br from-[var(--ide-header-bg)] to-[var(--background)] cursor-pointer group"
              onClick={() => {
                if (videoRef.current && videoRef.current.src) {
                  if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
                  setIsPlaying(!isPlaying);
                }
              }}
            >
              {/* Video Element */}
              <video ref={videoRef} className="w-full h-full object-cover opacity-80" loop muted playsInline />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--btn-sec-bg)] dark:bg-[var(--btn-sec-bg)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex flex-col items-center gap-4 scale-95 group-hover:scale-100 transition-all duration-300">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF3366] to-[#7B61FF] flex items-center justify-center shadow-lg shadow-pink-900/50 hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-white ml-0.5 fill-white" />
                  </div>
                  <span className="text-white text-xs font-bold uppercase tracking-widest font-mono">Play Demo</span>
                </div>
              </div>

              <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <span className="text-[#FF3366]/40 text-[9px] uppercase tracking-[0.4em] font-bold font-mono">Interactive Demo Workspace Pre-compiled</span>
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
