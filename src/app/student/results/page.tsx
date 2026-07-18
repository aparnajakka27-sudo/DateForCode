"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Code2, ArrowRight, History, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function ResultsPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans relative overflow-hidden selection:bg-[#FF4D8D]/20">
      {/* Background Matrix */}
      <div className="fixed inset-0 pointer-events-none z-0 developer-grid opacity-[0.15]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <nav className="relative z-30 bg-[var(--nav-bg)] border-b border-[var(--nav-border)] px-8 py-4 flex items-center justify-between shadow-sm">
        <Logo showText={true} className="scale-[0.85] origin-left" />
        <button 
          onClick={() => router.push('/student/dashboard')}
          className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-muted)] hover:text-white transition-colors uppercase tracking-wider"
        >
          <Home className="w-4 h-4" /> Exit
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full glass-panel border border-[var(--ide-border)] rounded-3xl overflow-hidden shadow-2xl bg-[var(--ide-bg)]"
        >
          <div className="p-10 space-y-8 text-center">
            
            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center relative">
              <Trophy className="w-12 h-12 text-[#10B981]" />
              <div className="absolute inset-0 rounded-full border-4 border-[#10B981] border-t-transparent animate-spin opacity-20" />
            </div>

            <div className="space-y-3">
              <h2 className="text-4xl font-black font-mono text-white uppercase tracking-tight">
                Session <span className="text-[#10B981]">Complete</span>
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Your code has been submitted successfully and evaluated. The telemetric data, XP, and history have been securely logged to your MongoDB profile.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 font-mono mt-8 border-t border-[var(--ide-border)]/50 pt-8">
              <div className="p-4 bg-[var(--background)] border border-[var(--ide-border)] rounded-xl">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase mb-1">XP Earned</span>
                <span className="text-xl font-bold text-[#FFD166]">+250</span>
              </div>
              <div className="p-4 bg-[var(--background)] border border-[var(--ide-border)] rounded-xl">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase mb-1">Accuracy</span>
                <span className="text-xl font-bold text-[#10B981]">98%</span>
              </div>
              <div className="p-4 bg-[var(--background)] border border-[var(--ide-border)] rounded-xl">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase mb-1">Time Bonus</span>
                <span className="text-xl font-bold text-[#3B82F6]">1.2x</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <button 
                onClick={() => router.push('/student/dashboard')}
                className="btn-premium px-8 py-3 text-xs flex items-center justify-center gap-2"
              >
                Return Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <button 
                onClick={() => router.push('/student/matching-room')}
                className="px-8 py-3 rounded-lg border border-[var(--ide-border)] bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" /> Practice Again
              </button>

              <button 
                onClick={() => router.push('/student/history')}
                className="px-8 py-3 rounded-lg border border-[var(--ide-border)] bg-[var(--background)] hover:border-[var(--text-muted)] text-[var(--text-muted)] hover:text-white text-xs font-mono font-bold uppercase transition-colors flex items-center justify-center gap-2"
              >
                <History className="w-4 h-4" /> View History
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  );
}
