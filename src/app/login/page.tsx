"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Terminal, Shield, Users, Trophy, Code, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { useUser } from '@/context/UserContext';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { auth, db, googleProvider, githubProvider } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

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
  const [role, setRole] = useState('student');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setRole((params.get('role') || 'student').trim());
    }
  }, []);

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

  // Add redirect for already authenticated users
  const { user, profile, loading: isAuthLoading } = useUser();

  useEffect(() => {
    if (!isAuthLoading && user) {
      // Always route to dashboard. ProtectedRoute will intercept and handle email verification / profile completion logic.
      const userRole = (profile as any)?.role || role || 'student';
      router.replace(`/${userRole}/dashboard`);
    }
  }, [user, profile, isAuthLoading, router, role]);
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      if (isRegister) {
        if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters'); setLoading(false); return; }
        
        // 1. Firebase First
        let fbUser = null;
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          fbUser = cred.user;
        } catch (fbErr: any) {
          if (fbErr.code === 'auth/email-already-in-use') {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            fbUser = cred.user;
          } else {
            throw new Error(fbErr.message || 'Firebase Registration Error');
          }
        }
        
        // 2. Register in Backend
        const res = await fetchWithAuth('/api/auth/register', {
          method: 'POST',
          body: JSON.stringify({ 
            fullName, 
            username: email.split('@')[0], 
            role,
            provider: 'email',
            providerId: fbUser.uid,
            emailVerified: fbUser.emailVerified
          })
        });
        
        const data = await res.json();
        if (!res.ok || !data.success) {
          // If backend fails, consider cleaning up firebase user here, or just show error.
          throw new Error(data.error || 'Backend registration failed');
        }
        
        // Route to dashboard. ProtectedRoute handles incomplete profiles and email verification.
        router.push(`/${role}/dashboard`);
      } else {
        // 1. Firebase First
        let fbUser = null;
        try {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          fbUser = cred.user;
        } catch (fbErr: any) {
          throw new Error('Invalid email or password');
        }
        
        // 2. Login in Backend
        const res = await fetchWithAuth('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ 
            browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown' 
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          await signOut(auth); // Sign out of firebase if backend fails
          throw new Error(data.error || 'Invalid email or password');
        }
        
        if (fbUser && !fbUser.emailVerified) {
          router.push('/email-verification');
          return;
        }

        const u = data.data.user;
        router.push(`/${u.role === 'mentor' ? 'mentor' : 'student'}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
    setLoading(false);
  };

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setError('');
    setLoading(true);
    try {
      const authProvider = provider === 'google' ? googleProvider : githubProvider;
      const result = await signInWithPopup(auth, authProvider);
      
      const res = await fetchWithAuth('/api/auth/social', {
        method: 'POST',
        body: JSON.stringify({
          fullName: result.user.displayName,
          provider,
          providerId: result.user.uid,
          role,
          browser: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown'
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || `${provider} authentication failed`);
      
      const isNew = result.user.metadata.creationTime === result.user.metadata.lastSignInTime; 
      
      if (!result.user.emailVerified) {
        router.push('/email-verification');
        return;
      }

      // Always push to dashboard. ProtectedRoute handles the rest.
      router.push(`/${data.data.user.role}/dashboard`);
    } catch (err: any) {
      setError(err.message || `${provider} sign-in failed.`);
    }
    setLoading(false);
  };

  const handleGoogle = () => handleSocialAuth('google');
  const handleGithub = () => handleSocialAuth('github');

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden selection:bg-[#FF4D8D]/20 font-sans">
      
      {/* LEFT COLUMN: Premium Developer Social Proof & Live Metrics */}
      <section className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-[var(--nav-bg)] border-r border-[var(--nav-border)] p-10 flex-col justify-between relative noise-bg developer-grid">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo showText={true} className="scale-[0.85] origin-left" />
          </Link>
          <div className="flex items-center gap-2 border border-pink-200/60 dark:border-pink-950/60 px-3 py-1 rounded-full bg-[var(--panel-bg)] text-[10px] text-[#FF4D8D] tracking-wider uppercase font-bold shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#FF4D8D] rounded-full animate-ping" />
            Ecosystem Live
          </div>
        </div>

        {/* Mid Stats and Terminal Preview */}
        <div className="my-auto space-y-8 max-w-lg">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Join the Arena.
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              Find partners, pair program in high-stakes environments, test assessment skills, and level up with elite certified mentors.
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 rounded-2xl shadow-sm">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF4D8D]" />
                Pairing Rooms
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">1,482 Active</div>
            </div>
            
            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 rounded-2xl shadow-sm">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-[#FFD166]" />
                XP Velocity
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">+142k/hr</div>
            </div>

            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 rounded-2xl shadow-sm">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-[#3B82F6]" />
                Tasks Solved
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">52,490+</div>
            </div>

            <div className="bg-[var(--panel-bg)] border border-[var(--panel-border)] p-4 rounded-2xl shadow-sm">
              <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#7B61FF]" />
                Mentor Support
              </div>
              <div className="text-lg font-bold text-[var(--text-primary)]">100% SLA</div>
            </div>
          </div>

          {/* Interactive Live Terminal Feed */}
          <div className="ide-panel text-xs overflow-hidden border border-[var(--ide-border)] bg-[var(--ide-bg)] shadow-lg rounded-2xl">
            <div className="ide-panel-header justify-between border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF4D8D]" />
                <span className="font-bold tracking-wider uppercase text-[10px] text-[var(--text-secondary)]">Matchmaker Logs</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">Registry Active</span>
            </div>
            <div className="p-4 space-y-2.5 min-h-[170px] flex flex-col justify-end text-[var(--text-secondary)] bg-[var(--background)]/20">
              {terminalFeed.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="leading-relaxed border-l-2 pl-2 border-[var(--panel-border)] flex items-start gap-1 text-[11px]"
                >
                  <span className="text-[#FF4D8D] shrink-0 font-bold">[{log.time}]</span>
                  <span className="text-[var(--text-secondary)] break-all">{log.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-[10px] font-semibold text-[var(--text-muted)] flex justify-between tracking-wide font-mono">
          <span>PORTAL ACTIVE</span>
          <span>© DATEFORCODE 2026</span>
        </div>
      </section>

      {/* RIGHT COLUMN: Interactive Login/Register Form */}
      <section className="col-span-1 lg:col-span-7 xl:col-span-7 flex flex-col justify-between p-8 min-h-screen relative z-10 bg-[var(--background)]">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between w-full">
          <Link href="/" className="lg:hidden flex items-center gap-3">
            <Logo showText={true} className="scale-[0.8] origin-left" />
          </Link>
          <div className="hidden lg:block" />
          <Link href="/" className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-semibold hover:text-[#FF4D8D] transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            BACK TO LANDING
          </Link>
        </div>

        {/* Form Container */}
        <div className="my-auto mx-auto w-full max-w-md py-12">
          <motion.div {...fadeUp(0.1)} className="glass-panel p-8 rounded-[32px] shadow-2xl relative border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md">
            
            {/* Top Accent Strip */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF4D8D] to-[#7B61FF] rounded-t-[32px]" />
            
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)] mb-1">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs font-semibold mb-6 uppercase tracking-wider text-[#FF4D8D]">
              ROLE: {role}
            </p>

            {/* Error Notification */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center font-semibold">
                [ALERT] {error}
              </motion.div>
            )}

            {/* Main authentication Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isRegister && (
                <motion.div {...fadeUp(0.15)}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF4D8D] transition-colors" />
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={e=>setFullName(e.target.value)} 
                      placeholder="e.g. John Doe" 
                      required 
                      className="w-full pl-10 pr-4 py-3 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF4D8D] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-semibold shadow-sm" 
                    />
                  </div>
                </motion.div>
              )}

              <motion.div {...fadeUp(0.2)}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF4D8D] transition-colors" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    placeholder="developer@dateforcode.com" 
                    required 
                    className="w-full pl-10 pr-4 py-3 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF4D8D] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-semibold shadow-sm" 
                  />
                </div>
              </motion.div>

              <motion.div {...fadeUp(0.25)}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Password</label>
                  {!isRegister && (
                    <button type="button" className="text-[10px] text-[#FF4D8D] hover:underline font-bold">
                      FORGOT?
                    </button>
                  )}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF4D8D] transition-colors" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    placeholder="••••••••" 
                    required 
                    className="w-full pl-10 pr-10 py-3 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF4D8D] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-semibold shadow-sm" 
                  />
                  <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-muted)] transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>

              {isRegister && (
                <motion.div {...fadeUp(0.3)}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 block">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] group-focus-within:text-[#FF4D8D] transition-colors" />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={e=>setConfirmPassword(e.target.value)} 
                      placeholder="••••••••" 
                      required 
                      className="w-full pl-10 pr-10 py-3 bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-[#FF4D8D] rounded-xl text-xs text-[var(--text-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)] font-semibold shadow-sm" 
                    />
                    <button type="button" onClick={()=>setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-muted)] transition-colors">
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
                className="btn-premium w-full py-3.5 mt-4 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-bold"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[var(--ide-bg)]/30 border-t-white rounded-full animate-spin" />
                    Authentication...
                  </>
                ) : (
                  isRegister ? 'Sign Up' : 'Sign In'
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px] bg-[var(--panel-border)]" />
              <span className="text-[9px] font-bold text-[var(--text-muted)] tracking-widest uppercase">OR CONTINUE WITH</span>
              <div className="flex-1 h-[1px] bg-[var(--panel-border)]" />
            </motion.div>

            {/* OAuth Integrations */}
            <motion.div {...fadeUp(0.45)} className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleGoogle} 
                disabled={loading} 
                className="btn-secondary-dev py-3 text-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <GoogleIcon />
                <span>Google</span>
              </button>
              <button 
                onClick={handleGithub} 
                disabled={loading} 
                className="btn-secondary-dev py-3 text-xs flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <GithubIcon className="w-5 h-5 text-[var(--text-muted)]" />
                <span>GitHub</span>
              </button>
            </motion.div>

            {/* Toggle */}
            <motion.p {...fadeUp(0.5)} className="text-center text-xs text-[var(--text-muted)] mt-6 font-semibold">
              {isRegister ? 'Already have an account? ' : 'First time here? '}
              <button 
                onClick={()=>{setIsRegister(!isRegister); setError('');}} 
                className="text-[#FF4D8D] font-bold hover:underline"
              >
                {isRegister ? 'Sign In' : 'Register'}
              </button>
            </motion.p>
          </motion.div>
        </div>

        {/* Small legal details */}
        <div className="text-[10px] text-[var(--text-muted)] text-center font-semibold">
          Secure end-to-end encrypted connection.
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return <LoginContent />;
}
