"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Laptop, Cpu, Settings, Code2, Terminal as TerminalIcon, Home, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Sandpack } from '@codesandbox/sandpack-react';
import { dracula, cyberpunk, monokaiPro, nightOwl, aquaBlue } from '@codesandbox/sandpack-themes';

const themeMapping: Record<string, any> = {
  dracula,
  cyberpunk,
  'monokai-pro': monokaiPro,
  'night-owl': nightOwl,
  'aqua-blue': aquaBlue,
  dark: 'dark',
  light: 'light'
};

const fadeUp = (d = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
});

const TEMPLATES = [
  { id: 'vanilla', name: 'HTML / CSS / JS (Vanilla)', icon: '⚡' },
  { id: 'react', name: 'React (JS)', icon: '⚛️' },
  { id: 'react-ts', name: 'React (TS)', icon: '🔷' },
  { id: 'svelte', name: 'Svelte', icon: '🔥' },
  { id: 'vue', name: 'Vue', icon: '🟢' },
];

const THEMES = [
  { id: 'dracula', name: 'Dracula' },
  { id: 'cyberpunk', name: 'Cyberpunk' },
  { id: 'monokai-pro', name: 'Monokai Pro' },
  { id: 'night-owl', name: 'Night Owl' },
  { id: 'aqua-blue', name: 'Aqua Blue' },
  { id: 'dark', name: 'Sandpack Dark' },
  { id: 'light', name: 'Sandpack Light' },
];

export default function PlaygroundPage() {
  const [template, setTemplate] = useState<any>('vanilla');
  const [editorTheme, setEditorTheme] = useState<any>('dracula');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Sync default Sandpack theme with document body class if possible
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    setEditorTheme(isDark ? 'dracula' : 'light');
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden theme-transition">
      {/* Background Grids */}
      <div className="fixed inset-0 pointer-events-none z-0 developer-grid" />
      <div className="aurora-mesh" />

      {/* Floating Header */}
      <div className="w-full px-6 pt-4 relative z-20 pointer-events-none">
        <motion.header 
          {...fadeUp(0)} 
          className="max-w-7xl mx-auto backdrop-blur-xl border border-[var(--nav-border)] px-6 py-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] pointer-events-auto bg-[var(--nav-bg)] transition-all hover:border-[var(--text-muted)]/20"
        >
          <div className="flex items-center gap-4">
            <Link href="/student/challenges" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-sec-bg)] transition-all border border-transparent hover:border-[var(--ide-border)]">
              <ArrowLeft className="w-4 h-4"/>
              <span className="text-xs font-bold">Back to Challenges</span>
            </Link>
            <div className="w-px h-5 bg-[var(--ide-border)] hidden md:block"/>
            <Link href="/" className="flex items-center gap-2">
              <Logo showText={false} className="scale-[0.5]"/>
              <span className="text-sm font-serif font-bold text-[var(--text-primary)]">Date<span className="text-[#FF4D6D]">for</span>Code</span>
            </Link>
            <div className="px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-mono font-black uppercase tracking-wider">
              Developer Sandbox
            </div>
          </div>

          {/* Configuration Selectors */}
          <div className="flex flex-wrap items-center gap-3 relative z-30">
            {/* Template Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Template:</span>
              <select 
                value={template} 
                onChange={(e) => setTemplate(e.target.value)} 
                className="bg-[var(--ide-bg)] text-[var(--text-primary)] border border-[var(--ide-border)] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
              >
                {TEMPLATES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">Theme:</span>
              <select 
                value={editorTheme} 
                onChange={(e) => setEditorTheme(e.target.value)} 
                className="bg-[var(--ide-bg)] text-[var(--text-primary)] border border-[var(--ide-border)] rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
              >
                {THEMES.map((t) => (
                  <option key={t.id} value={t.id}>
                    🎨 {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-px h-5 bg-[var(--ide-border)]"/>
            <ThemeToggle />
          </div>
        </motion.header>
      </div>

      {/* Workspace */}
      <motion.main 
        {...fadeUp(0.1)}
        className="flex-1 relative z-10 p-4 md:p-6 flex flex-col"
      >
        <div className="bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-2xl overflow-hidden shadow-2xl flex-1 flex flex-col">
          {/* IDE Window Bar */}
          <div className="bg-[var(--ide-header-bg)] border-b border-[var(--ide-border)] px-5 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#EF4444] opacity-80"/>
                <div className="w-3 h-3 rounded-full bg-[#F59E0B] opacity-80"/>
                <div className="w-3 h-3 rounded-full bg-[#10B981] opacity-80"/>
              </div>
              <div className="w-px h-4 bg-[var(--ide-border)] mx-2"/>
              <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5 uppercase font-bold tracking-wider">
                <Code2 className="w-3.5 h-3.5 text-purple-500"/> sandpack_terminal_core.sys
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10B981]/15 text-[#10B981] text-[9px] font-mono font-bold uppercase tracking-wider animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"/> Dev Server Active
              </span>
            </div>
          </div>

          {/* Sandpack IDE */}
          <div className="flex-1 min-h-[500px]">
            {isClient && (
              <Sandpack
                template={template}
                theme={themeMapping[editorTheme] || 'dark'}
                options={{
                  showNavigator: true,
                  showLineNumbers: true,
                  showInlineErrors: true,
                  editorHeight: "calc(100vh - 180px)",
                  editorWidthPercentage: 55,
                  closableTabs: true,
                  resizablePanels: true,
                }}
              />
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
