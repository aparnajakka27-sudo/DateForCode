"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { auth } from '@/lib/firebase';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { useUser } from '@/context/UserContext';

export default function EmailVerificationPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  // If user is already verified, route to dashboard
  useEffect(() => {
    if (!loading && user?.emailVerified) {
      router.push('/login');
    }
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleResend = async () => {
    if (!user) return;
    setSending(true);
    setMessage('');
    try {
      await sendEmailVerification(user);
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setMessage('Too many requests. Please wait a minute before sending another email.');
      } else {
        setMessage('Failed to send verification email. Try again later.');
      }
    }
    setSending(false);
  };

  const handleRefresh = async () => {
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        router.push('/login');
      } else {
        setMessage('Email is not verified yet.');
      }
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4D8D]/20 border-t-[#FF4D8D] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans noise-bg relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 developer-grid opacity-30" />
      
      {/* Premium Navbar */}
      <nav className="relative z-30 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] px-8 py-4 flex items-center justify-between shadow-sm">
        <Logo showText={true} className="scale-[0.85] origin-left" />
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-red-400 transition-colors uppercase tracking-wider"
        >
          <LogOut className="w-4 h-4" /> Disconnect
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-panel border border-[var(--ide-border)] rounded-2xl overflow-hidden shadow-2xl bg-[var(--ide-bg)]"
        >
          <div className="p-8 space-y-6 text-center">
            
            <div className="w-20 h-20 mx-auto rounded-full bg-[#3B82F6]/10 border-2 border-[#3B82F6]/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Mail className="w-10 h-10 text-[#3B82F6]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-mono text-[var(--text-primary)] uppercase tracking-tight">Verify Your Email</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                We've sent a verification link to <span className="font-bold text-[var(--text-primary)]">{user?.email}</span>. 
                Please verify your email address to access the ecosystem.
              </p>
            </div>

            {message && (
              <div className="p-3 bg-[var(--background)] border border-[var(--ide-border)] rounded text-xs font-mono text-[var(--text-secondary)]">
                {message}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button 
                onClick={handleRefresh}
                className="btn-premium w-full py-3 text-xs flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> I've Verified My Email
              </button>

              <button 
                onClick={handleResend}
                disabled={sending}
                className="w-full py-3 rounded border border-[var(--ide-border)] bg-[var(--background)] text-xs font-mono font-bold text-[var(--text-muted)] hover:text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Resend Email'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  );
}
