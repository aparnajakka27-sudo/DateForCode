"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Terminal, Shield, Users, Trophy, Code } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth, googleProvider, githubProvider } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';

const GithubIcon = ({className="w-5 h-5"}:{className?:string}) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const GoogleIcon = () => <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>;

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 15 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

const mockTerminalLogs = [
  { id: 1, type: "SUCCESS", time: "14:58:02", text: "Match completed in Skill assessments: student 'k_rust' with 'wasm_dev' (Chemistry: 98%)" },
  { id: 2, type: "MENTOR", time: "14:58:19", text: "Elite Mentor 'vbyte' resolved DP transition diagnostic bug in Coding Room #42" },
  { id: 3, type: "STREAK", time: "14:58:35", text: "Student 'k_rust' achieved XP streak multiplier x1.5 (Level 12 Gold Rank)" },
  { id: 4, type: "QUEUE", time: "14:58:50", text: "Ecosystem Queue: 68 students active in LeetCode-Hard matchmaking pipeline..." },
  { id: 5, type: "MATCH", time: "14:59:12", text: "Connecting pairing partners [driver: 'dev_alex', navigator: 'coder_jen']" }
];

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') || 'student').trim();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terminalFeed, setTerminalFeed] = useState(mockTerminalLogs);

  // Auto-scrolling simulated logs
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalFeed(prev => {
        const nextTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        const randomLogs = [
          { type: "SUCCESS", text: `Match established: Skill level aligned at Silver III (Compatibility: 94%)` },
          { type: "MENTOR", text: `Mentor intervention request answered: stuck in sliding-window DP` },
          { type: "STREAK", text: `User 'codewizard' level up: Bronze III -> Silver I (+120 XP)` },
          { type: "QUEUE", text: `Real-time compilation pass: Code room #108 driver synchronized` }
        ];
        const selected = randomLogs[Math.floor(Math.random() * randomLogs.length)];
        const nextLog = {
          id: Date.now(),
          type: selected.type,
          time: nextTime,
          text: selected.text
        };
        return [...prev.slice(1), nextLog];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('dateforcode_student_setup')) {
      router.push('/student/dashboard');
    } else if (localStorage.getItem('dateforcode_mentor_profile')) {
      router.push('/mentor/dashboard');
    }
  }, [router]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (isRegister) {
        if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName) await updateProfile(cred.user, { displayName: fullName });
        router.push(`/${role}/profile-setup`);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push(`/${role}/dashboard`);
      }
    } catch (err: unknown) {
      const e = err as { code?: string };
      switch (e.code) {
        case 'auth/user-not-found': setError('No account found with this email'); break;
        case 'auth/wrong-password': setError('Incorrect password'); break;
        case 'auth/email-already-in-use': setError('Email is already registered'); break;
        case 'auth/invalid-email': setError('Invalid email address'); break;
        case 'auth/invalid-credential': setError('Invalid email or password'); break;
        default: setError('Authentication failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => { setError(''); setLoading(true); try { const result = await signInWithPopup(auth, googleProvider); const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime; router.push(isNew ? `/${role}/profile-setup` : `/${role}/dashboard`); } catch { setError('Google sign-in failed.'); } setLoading(false); };
  const handleGithub = async () => { setError(''); setLoading(true); try { const result = await signInWithPopup(auth, githubProvider); const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime; router.push(isNew ? `/${role}/profile-setup` : `/${role}/dashboard`); } catch { setError('GitHub sign-in failed.'); } setLoading(false); };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-[#08090C] text-[#F3F4F6] relative overflow-hidden selection:bg-accent-pink/20 font-sans">
      
      {/* LEFT COLUMN: Premium Developer Social Proof & Live Metrics */}
      <section className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-[#0D0E12] border-r border-border-dark p-8 flex-col justify-between relative noise-bg developer-grid">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo showText={true} className="scale-[0.85] origin-left" />
          </Link>
          <div className="flex items-center gap-2 border border-border-dark px-2.5 py-1 rounded bg-[#15171F] text-[10px] text-accent-pink font-mono tracking-wider uppercase">
            <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-ping" />
            Ecosystem Live
          </div>
        </div>

        {/* Mid Stats and Terminal Preview */}
        <div className="my-auto space-y-8 max-w-lg">
          <div>
            <h2 className="text-2xl font-bold font-mono tracking-tight text-white mb-2 uppercase">
              Join the Arena.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find partners, pair program in high-stakes environments, test assessment skills, and level up with elite certified mentors.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#15171F] border border-border-dark p-3.5 rounded">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-accent-pink" />
                Pairing Rooms
              </div>
              <div className="text-xl font-bold font-mono text-white">1,482 Active</div>
            </div>
            
            <div className="bg-[#15171F] border border-border-dark p-3.5 rounded">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-accent-gold" />
                Global XP Velocity
              </div>
              <div className="text-xl font-bold font-mono text-white">+142k/hr</div>
            </div>

            <div className="bg-[#15171F] border border-border-dark p-3.5 rounded">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-accent-blue" />
                Completed Tasks
              </div>
              <div className="text-xl font-bold font-mono text-white">52,490+</div>
            </div>

            <div className="bg-[#15171F] border border-border-dark p-3.5 rounded">
              <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-accent-purple" />
                Mentor Support
              </div>
              <div className="text-xl font-bold font-mono text-white">100% SLA</div>
            </div>
          </div>

          {/* Interactive Live Terminal Feed */}
          <div className="ide-panel text-xs overflow-hidden">
            <div className="ide-panel-header justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-accent-pink" />
                <span className="font-mono font-bold tracking-wider uppercase text-[10px] text-gray-400">Matchmaker Terminal Logs</span>
              </div>
              <span className="text-[10px] text-gray-500 font-mono">bash v4.2</span>
            </div>
            <div className="p-4 space-y-2.5 font-mono min-h-[170px] flex flex-col justify-end text-gray-400">
              {terminalFeed.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="leading-relaxed border-l-2 pl-2 border-border-dark flex items-start gap-1"
                >
                  <span className="text-accent-pink shrink-0">[{log.time}]</span>
                  <span className="text-gray-300 break-all">{log.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-mono text-gray-600 flex justify-between">
          <span>SECURE DEV-PORTAL v1.0.4</span>
          <span>© DATEFORCODE 2026</span>
        </div>
      </section>

      {/* RIGHT COLUMN: Interactive Login/Register Form */}
      <section className="col-span-1 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-8 min-h-screen relative z-10">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="lg:hidden flex items-center gap-3">
            <Logo showText={true} className="scale-[0.8] origin-left" />
          </Link>
          <div className="hidden lg:block" />
          <Link href="/" className="flex items-center gap-2 text-gray-400 text-xs font-mono tracking-wider hover:text-accent-pink transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            EXIT TO LANDING
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto mx-auto w-full max-w-md py-12">
          <motion.div {...fadeUp(0.1)} className="ide-panel p-8 bg-[#0D0E12] shadow-2xl border-border-dark relative">
            
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-pink to-accent-blue" />
            
            <h2 className="text-2xl font-bold font-mono tracking-tight text-white mb-1 uppercase">
              {isRegister ? 'INITIALIZE USER' : 'AUTHENTICATE USER'}
            </h2>
            <p className="text-gray-400 text-xs font-mono mb-6 uppercase tracking-widest text-accent-pink">
              ROLE: {role}
            </p>

            {/* Error Notification */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 rounded bg-red-950/40 border border-red-800 text-red-400 text-xs text-center font-mono">
                [ERROR] {error}
              </motion.div>
            )}

            {/* Main authentication Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegister && (
                <motion.div {...fadeUp(0.15)}>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={e=>setFullName(e.target.value)} 
                      placeholder="e.g. John Doe" 
                      required 
                      className="w-full pl-10 pr-4 py-2.5 bg-[#15171F] border border-border-dark rounded text-sm text-white font-mono focus:outline-none focus:border-accent-pink transition-colors placeholder:text-gray-600" 
                    />
                  </div>
                </motion.div>
              )}

              <motion.div {...fadeUp(0.2)}>
                <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    placeholder="developer@dateforcode.com" 
                    required 
                    className="w-full pl-10 pr-4 py-2.5 bg-[#15171F] border border-border-dark rounded text-sm text-white font-mono focus:outline-none focus:border-accent-pink transition-colors placeholder:text-gray-600" 
                  />
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.25)}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">Password</label>
                  {!isRegister && (
                    <button type="button" className="text-[10px] font-mono text-accent-pink hover:text-accent-pink-hover transition-colors">
                      FORGOT?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="w-full pl-10 pr-10 py-2.5 bg-[#15171F] border border-border-dark rounded text-sm text-white font-mono focus:outline-none focus:border-accent-pink transition-colors placeholder:text-gray-600" 
                  />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {isRegister && (
                <motion.div {...fadeUp(0.3)}>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-accent-pink transition-colors" />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={e=>setConfirmPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                      className="w-full pl-10 pr-10 py-2.5 bg-[#15171F] border border-border-dark rounded text-sm text-white font-mono focus:outline-none focus:border-accent-pink transition-colors placeholder:text-gray-600" 
                    />
                    <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button 
                {...fadeUp(0.35)} 
                type="submit" 
                disabled={loading} 
                className="btn-premium w-full py-3.5 mt-2 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    COMPILING CERTIFICATE...
                  </>
                ) : (
                  isRegister ? 'INITIALIZE SYSTEM ACCOUNT' : 'DECRYPT SYSTEM ACCESS'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-border-dark" />
              <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase">AUTH PROVIDERS</span>
              <div className="flex-1 h-[1px] bg-border-dark" />
            </motion.div>

            {/* OAuth Integrations */}
            <motion.div {...fadeUp(0.45)} className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleGoogle} 
                disabled={loading} 
                className="btn-secondary-dev py-3 text-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button 
                onClick={handleGithub} 
                disabled={loading} 
                className="btn-secondary-dev py-3 text-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
              >
                <GithubIcon className="w-5 h-5 text-gray-300" />
                <span>GitHub</span>
              </button>
            </motion.div>

            {/* Toggle */}
            <motion.p {...fadeUp(0.5)} className="text-center text-xs text-gray-400 mt-6 font-mono">
              {isRegister ? 'ALREADY ACTIVE IN ECOSYSTEM? ' : 'FIRST TIME IN THE ARENA? '}
              <button 
                onClick={()=>{setIsRegister(!isRegister); setError('');}} 
                className="text-accent-pink font-bold hover:underline underline-offset-4 decoration-accent-pink/30 hover:decoration-accent-pink"
              >
                {isRegister ? 'SIGN IN' : 'REGISTER'}
              </button>
            </motion.p>
          </motion.div>
        </div>

        {/* Small legal details */}
        <div className="text-[9px] font-mono text-gray-600 text-center tracking-wide uppercase">
          Ecosystem traffic encrypted by AES-256 GCM. Unauthorized access logged under SecOp protocol 42.
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#08090C] flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin" />
          <div className="text-[10px] text-gray-500 uppercase tracking-widest">Warming engine core...</div>
        </div>
      </div>
    }>
      <LoginContent />
    </React.Suspense>
  );
}

