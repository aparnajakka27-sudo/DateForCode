"use client";
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GamificationPage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [isOpened, setIsOpened] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Trigger door open animation shortly after mounting
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpened(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setIsOpened(false); // Trigger doors closing animation
    setTimeout(() => {
      router.back();
    }, shouldReduceMotion ? 400 : 1800); // Shorter timeout if motion is reduced
  };

  const transitionDuration = shouldReduceMotion ? 0.3 : 1.8;
  const transitionEase = shouldReduceMotion ? "easeInOut" : [0.77, 0, 0.175, 1] as [number, number, number, number];

  return (
    <div className="min-h-screen w-screen bg-[#0B0F19] text-white relative overflow-hidden flex items-center justify-center font-mono">
      
      {/* Blurred Dashboard Background Mock (UX enhancement) */}
      <div className="absolute inset-0 z-0 filter blur-md opacity-25 select-none pointer-events-none scale-105 flex bg-[#0B0F19]">
        {/* Mock Sidebar */}
        <div className="w-64 border-r border-slate-800 bg-[#0B0F19] p-6 space-y-6">
          <div className="w-32 h-6 bg-slate-800/40 rounded-md" />
          <div className="space-y-4">
            <div className="w-full h-8 bg-slate-800/40 rounded-md" />
            <div className="w-full h-8 bg-slate-800/40 rounded-md" />
            <div className="w-full h-8 bg-slate-800/40 rounded-md" />
            <div className="w-full h-8 bg-slate-800/40 rounded-md" />
          </div>
        </div>
        {/* Mock Content */}
        <div className="flex-1 p-8 space-y-6">
          <div className="w-48 h-8 bg-slate-800/40 rounded-md" />
          <div className="grid grid-cols-3 gap-6">
            <div className="h-32 bg-slate-800/40 rounded-xl" />
            <div className="h-32 bg-slate-800/40 rounded-xl" />
            <div className="h-32 bg-slate-800/40 rounded-xl" />
          </div>
          <div className="h-64 bg-slate-800/40 rounded-xl" />
        </div>
      </div>

      {/* Dark overlay masking */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-10 bg-black/60 pointer-events-none"
      />

      {/* Background Glow */}
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
        {/* Center Accent Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/[0.04] rounded-full blur-[80px]" />
      </div>

      {/* Cinematic Vault Doors */}
      <div className="absolute inset-0 z-20 flex pointer-events-none select-none">
        {/* Left Door */}
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ 
            x: shouldReduceMotion ? 0 : (isOpened ? "-100%" : 0),
            opacity: shouldReduceMotion ? (isOpened ? 0 : 1) : 1
          }}
          transition={{ duration: transitionDuration, ease: transitionEase }}
          className="w-[50vw] h-screen bg-[#0B0F19] border-r border-slate-800/40 relative flex items-center justify-end overflow-hidden"
        >
          {/* Seam line glow */}
          <div className="absolute inset-y-0 right-0 w-[1px] bg-gradient-to-b from-transparent via-[#8B5CF6]/20 to-transparent" />
        </motion.div>

        {/* Right Door */}
        <motion.div
          initial={{ x: 0, opacity: 1 }}
          animate={{ 
            x: shouldReduceMotion ? 0 : (isOpened ? "100%" : 0),
            opacity: shouldReduceMotion ? (isOpened ? 0 : 1) : 1
          }}
          transition={{ duration: transitionDuration, ease: transitionEase }}
          className="w-[50vw] h-screen bg-[#0B0F19] border-l border-slate-800/40 relative flex items-center justify-start overflow-hidden"
        >
          {/* Seam line glow */}
          <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-[#8B5CF6]/20 to-transparent" />
        </motion.div>
      </div>

      {/* Revealed Center Content */}
      {isOpened && !isClosing && (
        <motion.div
          initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0.2 : 1.5, duration: 0.6, ease: "easeOut" }}
          className="relative z-30 flex flex-col items-center justify-center text-center p-8 max-w-sm select-none font-sans"
        >
          {/* Elegant header */}
          <h1 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-white mb-3 uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-white">
            Coming Soon
          </h1>

          <p className="text-[11px] text-slate-400 tracking-wider leading-relaxed max-w-xs font-normal">
            This feature is currently under development and will be available in a future update.
          </p>
        </motion.div>
      )}

      {/* Close Action Trigger */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ delay: shouldReduceMotion ? 0.1 : 1.2 }}
        onClick={handleClose}
        className="absolute top-6 right-6 z-40 p-2 rounded-full border border-slate-800/60 bg-[#0B0F19]/60 text-slate-400 hover:text-white hover:bg-slate-800/60 transition shadow-md backdrop-blur-md cursor-pointer"
        title="Close Preview"
      >
        <X className="w-3.5 h-3.5" />
      </motion.button>
    </div>
  );
}
