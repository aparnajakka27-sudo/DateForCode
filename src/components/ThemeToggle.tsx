"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Determine initial theme on mount
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    
    // Enable transitions dynamically to prevent transitions running on initial load
    root.classList.add('theme-transition');

    if (theme === 'light') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
      window.dispatchEvent(new CustomEvent('themechange', { detail: 'dark' }));
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
      window.dispatchEvent(new CustomEvent('themechange', { detail: 'light' }));
    }

    // Clean up transition class later if desired (optional)
    setTimeout(() => {
      // Keep theme-transition class active for runtime toggles
    }, 1000);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(255,255,255,0.08)] bg-[var(--btn-sec-bg)] dark:bg-[var(--btn-sec-bg)] hover:border-[#FF3366] hover:text-[#FF3366] transition-all duration-300 shadow-sm cursor-pointer overflow-hidden group"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="moon"
            initial={{ y: 20, opacity: 0, rotate: 40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: -40 }}
            transition={{ duration: 0.25 }}
            className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)]"
          >
            <Moon className="w-5 h-5 transition-transform group-hover:scale-110" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ y: 20, opacity: 0, rotate: -40 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -20, opacity: 0, rotate: 40 }}
            transition={{ duration: 0.25 }}
            className="text-[#FF3366]"
          >
            <Sun className="w-5 h-5 transition-transform group-hover:scale-110" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
