"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: number; // positive or negative percentage
  icon: LucideIcon;
  color: 'pink' | 'blue' | 'purple' | 'green';
  delay?: number;
}

const colorMap = {
  pink: {
    bg: 'from-[#FF3366]/20 to-[#FF3366]/5',
    text: 'text-[#FF3366]',
    border: 'border-[#FF3366]/20',
    shadow: 'hover:shadow-[0_10px_30px_-10px_rgba(255,51,102,0.3)]'
  },
  blue: {
    bg: 'from-[#3B82F6]/20 to-[#3B82F6]/5',
    text: 'text-[#3B82F6]',
    border: 'border-[#3B82F6]/20',
    shadow: 'hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)]'
  },
  purple: {
    bg: 'from-[#7B61FF]/20 to-[#7B61FF]/5',
    text: 'text-[#7B61FF]',
    border: 'border-[#7B61FF]/20',
    shadow: 'hover:shadow-[0_10px_30px_-10px_rgba(123,97,255,0.3)]'
  },
  green: {
    bg: 'from-[#10B981]/20 to-[#10B981]/5',
    text: 'text-[#10B981]',
    border: 'border-[#10B981]/20',
    shadow: 'hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)]'
  }
};

export default function StatCard({ title, value, trend, icon: Icon, color, delay = 0 }: StatCardProps) {
  const isPositive = trend >= 0;
  const theme = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`glass-panel p-6 rounded-3xl border border-[var(--panel-border)] bg-[var(--panel-bg)] flex flex-col gap-4 relative overflow-hidden group ${theme.shadow} transition-all duration-300`}
    >
      {/* Background Gradient Blob */}
      <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${theme.bg} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className="flex justify-between items-start z-10">
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider font-mono">
            {title}
          </p>
          <h3 className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tight">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border}`}>
          <Icon className={`w-5 h-5 ${theme.text}`} />
        </div>
      </div>

      <div className="flex items-center gap-2 z-10 mt-2">
        <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{Math.abs(trend)}%</span>
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">vs last month</span>
      </div>
    </motion.div>
  );
}
