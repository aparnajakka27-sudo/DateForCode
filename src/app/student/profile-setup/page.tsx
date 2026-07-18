"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Check, X, Rocket, Terminal, Code, Cpu, Shield, Globe, Award } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth } from '@/lib/firebase';
import { useUser } from '@/context/UserContext';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 15 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

const AVATARS = [
  { id: 'kai', img: '/avatars/kai.png', bg: 'bg-teal-700', name: 'KAI', ring: '#0F766E', role: 'Bold, edgy & energetic vibe', colorClass: 'text-teal-400 border-teal-400/30' },
  { id: 'leo', img: '/avatars/leo.png', bg: 'bg-[#4D7C0F]', name: 'LEO', ring: '#4D7C0F', role: 'Curls, comfort & casual charm', colorClass: 'text-emerald-400 border-emerald-400/30' },
  { id: 'maya', img: '/avatars/maya.png', bg: 'bg-[#6D28D9]', name: 'MAYA', ring: '#6D28D9', role: 'Bright, braided & full joy', colorClass: 'text-purple-400 border-purple-400/30' },
  { id: 'luna', img: '/avatars/luna.png', bg: 'bg-[#BE185D]', name: 'LUNA', ring: '#BE185D', role: 'Dreamy, artistic & pastel flair', colorClass: 'text-pink-400 border-pink-400/30' },
  { id: 'jax', img: '/avatars/jax.png', bg: 'bg-[#C2410C]', name: 'JAX', ring: '#C2410C', role: 'Cool, competitive & street smart', colorClass: 'text-orange-400 border-orange-400/30' },
  { id: 'zara', img: '/avatars/zara.png', bg: 'bg-[#CA8A04]', name: 'ZARA', ring: '#CA8A04', role: 'Focused, techy & sharp', colorClass: 'text-yellow-400 border-yellow-400/30' },
  { id: 'finn', img: '/avatars/finn.png', bg: 'bg-[#0369A1]', name: 'FINN', ring: '#0369A1', role: 'Chill, laid-back & creative', colorClass: 'text-blue-400 border-blue-400/30' },
  { id: 'nova', img: '/avatars/nova.png', bg: 'bg-[#B91C1C]', name: 'NOVA', ring: '#B91C1C', role: 'Intense, futuristic & bold', colorClass: 'text-red-400 border-red-400/30' },
  { id: 'remy', img: '/avatars/remy.png', bg: 'bg-[#4338CA]', name: 'REMY', ring: '#4338CA', role: 'Smart, calculated & slick', colorClass: 'text-indigo-400 border-indigo-400/30' },
  { id: 'cleo', img: '/avatars/cleo.png', bg: 'bg-[#0E7490]', name: 'CLEO', ring: '#0E7490', role: 'Vibrant, melodic & upbeat', colorClass: 'text-cyan-400 border-cyan-400/30' },
];

const SKILLS = [
  { name: 'JavaScript', color: '#D97706', popularity: '94%', demand: 'High' },
  { name: 'TypeScript', color: '#3178C6', popularity: '98%', demand: 'Critical' },
  { name: 'Python', color: '#3776AB', popularity: '90%', demand: 'High' },
  { name: 'React', color: '#61DAFB', popularity: '95%', demand: 'Critical' },
  { name: 'Next.js', color: '#FFFFFF', popularity: '97%', demand: 'Critical' },
  { name: 'Node.js', color: '#339933', popularity: '88%', demand: 'High' },
  { name: 'Rust', color: '#CE422B', popularity: '85%', demand: 'Trending' },
  { name: 'Go', color: '#00ADD8', popularity: '82%', demand: 'High' },
  { name: 'SQL', color: '#4479A1', popularity: '89%', demand: 'Stable' },
  { name: 'Docker', color: '#2496ED', popularity: '87%', demand: 'Stable' },
  { name: 'AWS', color: '#FF9900', popularity: '84%', demand: 'High' },
  { name: 'C++', color: '#00599C', popularity: '78%', demand: 'Stable' },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { profile, refreshProfile, loading } = useUser();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('kai');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Auth and profile redirection handled by layout

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : prev.length < 8 ? [...prev, skill] : prev
    );
  };

  const canProceed = () => {
    if (step === 0) return username.trim().length >= 3;
    if (step === 1) return selectedAvatar !== '';
    if (step === 2) return selectedSkills.length >= 1;
    return true;
  };

  const handleFinish = async () => {
    const profile = { username, avatar: selectedAvatar, skills: selectedSkills, bio };
    
    if (auth.currentUser) {
      try {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch('/api/user/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(profile)
        });
        
        if (res.ok) {
          await refreshProfile();
        }
      } catch (err) {
        console.error("Failed to create profile", err);
      }
    }

    localStorage.setItem('dateforcode_student_setup', 'true');
    setShowPreview(true);
  };

  const avatarData = AVATARS.find(a => a.id === selectedAvatar) || AVATARS[0];

  const steps = [
    { title: "Define Identity", sub: "Initialize your unique developer handle for match routing" },
    { title: "Pick Your Blob Buddy", sub: "Choose your primary developer persona" },
    { title: "Configure Technology Stack", sub: "Select the languages and systems in your primary toolbox (max 8)" },
    { title: "Write Compiler Bio", sub: "A brief log statement to introduce your coding philosophy to partners" },
  ];

  const handleNextAvatar = () => {
    const idx = AVATARS.findIndex(a => a.id === selectedAvatar);
    setSelectedAvatar(AVATARS[(idx + 1) % AVATARS.length].id);
  };

  const handlePrevAvatar = () => {
    const idx = AVATARS.findIndex(a => a.id === selectedAvatar);
    setSelectedAvatar(AVATARS[(idx - 1 + AVATARS.length) % AVATARS.length].id);
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-[var(--ide-header-bg)] text-[var(--foreground)] relative overflow-hidden font-sans select-none">
      
      {/* LEFT COLUMN: Setup Steps Form Flow */}
      <section className="col-span-1 lg:col-span-7 flex flex-col justify-between p-6 md:p-12 min-h-screen relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between">
          <Logo showText={true} className="scale-[0.8] origin-left" />
          <button 
            onClick={() => step > 0 ? setStep(step - 1) : router.back()} 
            className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-mono tracking-wider hover:text-accent-pink transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>
        </div>

        {/* Progress Grid */}
        <div className="max-w-xl w-full mx-auto my-6">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex-1 h-1 bg-[var(--ide-bg)] border border-border-dark overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: i <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-accent-pink"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-2 font-mono text-[9px] text-[var(--text-muted)] uppercase tracking-widest">
            <span>STEP: {step + 1} OF 4</span>
            <span>SYSTEM CONTEXT MATCHING READY</span>
          </div>
        </div>

        {/* Form Area */}
        <div className="my-auto mx-auto w-full max-w-xl">
          <motion.div 
            key={step} 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <div className="mb-8">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-accent-pink/10 border border-accent-pink/30 text-[9px] font-mono text-accent-pink tracking-widest uppercase mb-3">
                <Terminal className="w-3.5 h-3.5" /> PROFILE CONFIGURATION MODULE
              </span>
              <h1 className="text-3xl font-bold font-mono tracking-tight text-white mb-2 uppercase">{steps[step].title}</h1>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{steps[step].sub}</p>
            </div>

            {/* Step 0: Username */}
            {step === 0 && (
              <div className="ide-panel p-6 bg-[var(--background)] border-border-dark space-y-4">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 block">Developer Handle (UID)</label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono text-[var(--text-muted)]">@</span>
                  <input
                    type="text" 
                    value={username} 
                    onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))}
                    placeholder="e.g. kernel_hacker" 
                    maxLength={20} 
                    autoFocus
                    className="w-full pl-10 pr-4 py-3.5 bg-[var(--ide-bg)] border border-border-dark rounded text-md text-gray-900 font-mono focus:outline-none focus:border-accent-pink transition-colors placeholder:text-[var(--text-secondary)]"
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                  <span>No spaces or capitals, numbers & underscores allowed</span>
                  <span className={username.length >= 3 ? 'text-accent-green' : 'text-[var(--text-muted)]'}>{username.length}/20 chars</span>
                </div>
              </div>
            )}

            {/* Step 1: Avatar / Persona Class */}
            {step === 1 && (
              <div className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-black min-h-[450px]">
                {/* Center: Carousel Image */}
                <div className="flex flex-col items-center justify-center">
                  <div className={`relative w-48 h-80 md:w-64 md:h-96 rounded-[32px] overflow-hidden shadow-inner ${avatarData.bg} transition-colors duration-500`}>
                    <img src={avatarData.img} alt={avatarData.name} className="w-full h-full object-cover transform scale-110" />
                  </div>
                  <div className="flex items-center gap-4 mt-6">
                    <button onClick={handlePrevAvatar} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <ArrowLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <button onClick={handleNextAvatar} className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Technology Skills Stack */}
            {step === 2 && (
              <div className="ide-panel p-6 bg-[var(--background)] border-border-dark space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>SELECT SYSTEM CAPABILITIES</span>
                  <span className="text-accent-pink font-bold">{selectedSkills.length}/8 SELECTED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SKILLS.map((skill) => {
                    const active = selectedSkills.includes(skill.name);
                    return (
                      <button 
                        key={skill.name}
                        onClick={() => toggleSkill(skill.name)}
                        className={`p-2.5 rounded border text-left flex flex-col justify-between font-mono cursor-pointer transition-colors duration-150 ${
                          active 
                            ? 'bg-[var(--ide-bg)] border-accent-pink' 
                            : 'bg-[#0E1015] border-border-dark hover:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-bold text-white">{skill.name}</span>
                          <span className={`text-[8px] px-1 py-0.2 rounded ${
                            skill.demand === 'Critical' ? 'bg-red-950/40 text-red-400 border border-red-900/50' :
                            skill.demand === 'High' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/50' : 'bg-zinc-950/40 text-zinc-400 border border-zinc-900/50'
                          }`}>{skill.demand}</span>
                        </div>
                        <div className="flex justify-between items-center w-full mt-2 text-[8px] text-[var(--text-muted)]">
                          <span>POPULARITY:</span>
                          <span className="text-[var(--text-secondary)]">{skill.popularity}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Bio */}
            {step === 3 && (
              <div className="ide-panel p-6 bg-[var(--background)] border-border-dark space-y-4">
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 block">Compiler Bio Statement</label>
                <div className="relative">
                  <textarea
                    value={bio} 
                    onChange={e=>setBio(e.target.value)} 
                    maxLength={160}
                    placeholder="e.g. Linux systems programmer looking to build highly-optimized Rust microservices. Streaks active."
                    rows={5}
                    className="w-full p-4 bg-[var(--ide-bg)] border border-border-dark rounded text-sm text-white font-mono focus:outline-none focus:border-accent-pink transition-colors placeholder:text-[var(--text-muted)] resize-none leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[var(--text-muted)]">
                    {bio.length}/160
                  </div>
                </div>
              </div>
            )}

            {/* Step Navigation Controls */}
            <div className="flex items-center justify-between mt-8">
              <button 
                onClick={() => step > 0 && setStep(step - 1)} 
                className={`flex items-center gap-1.5 text-xs font-mono tracking-wider transition-colors cursor-pointer uppercase ${
                  step === 0 ? 'opacity-0 pointer-events-none' : 'text-[var(--text-muted)] hover:text-white'
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> PREV STEP
              </button>

              {step < 3 ? (
                <button 
                  onClick={() => canProceed() && setStep(step + 1)} 
                  disabled={!canProceed()}
                  className="btn-premium flex items-center gap-2 cursor-pointer text-xs disabled:opacity-30 disabled:pointer-events-none"
                >
                  NEXT STATE
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button 
                  onClick={handleFinish}
                  className="btn-premium flex items-center gap-2 bg-[#10B981] hover:bg-emerald-600 cursor-pointer text-xs shadow-emerald-950/20"
                >
                  <Rocket className="w-4 h-4 animate-bounce" />
                  LAUNCH ARENA CARD
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Small operational notice */}
        <div className="text-[9px] font-mono text-[var(--text-muted)] text-center tracking-wide uppercase">
          Ecosystem ID generation encrypted under SHA-256 standard protocols.
        </div>
      </section>

      {/* RIGHT COLUMN: Live Card Preview Render */}
      <section className="hidden lg:flex lg:col-span-5 bg-[var(--background)] border-l border-border-dark p-8 flex-col justify-center items-center relative noise-bg developer-grid">
        
        {/* Interactive glow effect in back */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[160px] opacity-10 bg-accent-pink" style={{ background: avatarData.ring }} />

        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Live Compiler Preview</span>
          </div>

          {/* Premium Developer Identity Card */}
          <div className="ide-panel bg-[var(--ide-bg)]/80 backdrop-blur border-border-dark relative overflow-hidden shadow-2xl">
            
            {/* Design header lines */}
            <div className="ide-panel-header justify-between">
              <div className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-accent-pink" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">SYS_CARD // COMPILING</span>
              </div>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6 relative z-10">
              
              <div className="flex items-center gap-4">
                {/* Avatar ring representation */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded bg-[var(--background)] border-2 flex items-center justify-center shadow-lg" style={{ borderColor: avatarData.ring }}>
                    <img src={avatarData.img} alt="avatar" className="w-16 h-16" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent-green border-2 border-[#15171F] rounded-full flex items-center justify-center" />
                </div>

                {/* Handle and Persona info */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-mono tracking-tight text-white truncate max-w-[180px]">
                    @{username || 'handle_pending'}
                  </h3>
                  <div className={`text-[9px] font-mono border px-1.5 py-0.5 rounded inline-block bg-black/30 font-bold tracking-wider uppercase ${avatarData.colorClass}`}>
                    {avatarData.role}
                  </div>
                </div>
              </div>

              {/* Bio Block */}
              <div className="space-y-1.5">
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Developer Statement</div>
                <div className="p-3 bg-[var(--background)] border border-border-dark rounded min-h-[72px] text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
                  {bio || "Waiting for compiler bio statement..."}
                </div>
              </div>

              {/* Tech stack */}
              <div className="space-y-2">
                <div className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Capabilities Stack</div>
                <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map(s => {
                      const sk = SKILLS.find(x => x.name === s);
                      return (
                        <span 
                          key={s} 
                          className="px-2 py-0.5 rounded text-[9px] font-mono border"
                          style={{ color: sk?.color || '#fff', borderColor: `${sk?.color}30` || '#222', backgroundColor: `${sk?.color}10` || '#111' }}
                        >
                          {s}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Stack empty. Select items...</span>
                  )}
                </div>
              </div>

              {/* Ecosystem Stats Preview block */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-border-dark text-center font-mono">
                <div className="bg-[var(--background)] p-2 border border-border-dark rounded">
                  <div className="text-[8px] text-[var(--text-muted)] uppercase">SYNERGY</div>
                  <div className="text-xs font-bold text-white">0%</div>
                </div>
                <div className="bg-[var(--background)] p-2 border border-border-dark rounded">
                  <div className="text-[8px] text-[var(--text-muted)] uppercase">HP STREAK</div>
                  <div className="text-xs font-bold text-accent-pink">1x</div>
                </div>
                <div className="bg-[var(--background)] p-2 border border-border-dark rounded">
                  <div className="text-[8px] text-[var(--text-muted)] uppercase">ARENA XP</div>
                  <div className="text-xs font-bold text-accent-gold">0 XP</div>
                </div>
              </div>

            </div>

          </div>

          <div className="flex gap-2 text-[10px] font-mono text-[var(--text-muted)] justify-center">
            <Cpu className="w-3.5 h-3.5 text-accent-pink" />
            <span>Multiplayer Profile Synchronizer active</span>
          </div>
        </div>
      </section>

      {/* ═══ Profile Setup Launch Preview Popup ═══ */}
      <AnimatePresence>
        {showPreview && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-[var(--ide-header-bg)]/80 backdrop-blur-md z-40" 
              onClick={() => setShowPreview(false)} 
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--background)] border border-border-dark z-50 shadow-2xl p-8 rounded-lg overflow-y-auto"
            >
              {/* Close */}
              <button 
                onClick={() => setShowPreview(false)} 
                className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-mono text-accent-green uppercase tracking-widest border border-accent-green/30 px-2 py-0.5 rounded bg-accent-green/10 mb-2">
                    <Award className="w-3 h-3" /> System Initialized Successfully
                  </span>
                  <h2 className="text-2xl font-bold font-mono text-white tracking-tight uppercase">Developer Registered</h2>
                </div>

                {/* Main Rendered Card */}
                <div className="ide-panel bg-[var(--ide-bg)] border-border-dark p-6 relative overflow-hidden text-left">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/10 rounded-full blur-[40px]" style={{ backgroundColor: avatarData.ring }} />
                  <div className="relative flex items-center gap-4">
                    <div className="w-16 h-16 rounded bg-[var(--background)] border flex items-center justify-center shrink-0 overflow-hidden" style={{ borderColor: avatarData.ring }}>
                      <img src={avatarData.img} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-mono text-white">@{username}</h3>
                      <div className={`text-[8px] font-mono border px-1.5 py-0.5 rounded inline-block bg-[var(--btn-sec-bg)] font-bold uppercase tracking-wider ${avatarData.colorClass}`}>
                        {avatarData.role}
                      </div>
                    </div>
                  </div>

                  {bio && (
                    <div className="mt-4 p-3 bg-[var(--background)] border border-border-dark rounded text-xs font-mono text-[var(--text-secondary)]">
                      {bio}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {selectedSkills.map(s => {
                      const sk = SKILLS.find(x => x.name === s);
                      return (
                        <span 
                          key={s} 
                          className="px-2 py-0.5 rounded text-[8px] font-mono border"
                          style={{ color: sk?.color || '#fff', borderColor: `${sk?.color}30` || '#222', backgroundColor: `${sk?.color}10` || '#111' }}
                        >
                          {s}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
                  <div className="bg-[var(--ide-bg)] p-3 border border-border-dark rounded">
                    <span className="text-[8px] text-[var(--text-muted)] block uppercase">SYNERGY</span>
                    <span className="text-sm font-bold text-white">99%</span>
                  </div>
                  <div className="bg-[var(--ide-bg)] p-3 border border-border-dark rounded">
                    <span className="text-[8px] text-[var(--text-muted)] block uppercase">STREAK</span>
                    <span className="text-sm font-bold text-accent-pink">1x</span>
                  </div>
                  <div className="bg-[var(--ide-bg)] p-3 border border-border-dark rounded">
                    <span className="text-[8px] text-[var(--text-muted)] block uppercase">XP REWARD</span>
                    <span className="text-sm font-bold text-accent-gold">+200</span>
                  </div>
                </div>

                {/* Final Launch Button */}
                <button 
                  onClick={() => router.push('/student/dashboard')}
                  className="btn-premium w-full py-4 text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  ENTER MATCHING COMMAND CENTER
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

