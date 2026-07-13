"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  type: 'line' | 'bar';
  dataKey: string; // the key for the X axis
  series: { key: string; color: string; name: string }[];
  delay?: number;
}

export default function ChartCard({ title, subtitle, data, type, dataKey, series, delay = 0 }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="ide-panel p-6 bg-[var(--ide-bg)] border-[var(--ide-border)] h-[400px] flex flex-col"
    >
      <div className="mb-6">
        <h3 className="text-lg font-bold text-[var(--text-primary)] font-mono">{title}</h3>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-1">{subtitle}</p>}
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" vertical={false} />
              <XAxis 
                dataKey={dataKey} 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--panel-bg)', 
                  borderColor: 'var(--panel-border)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px -10px var(--panel-shadow)',
                  color: 'var(--text-primary)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}
                cursor={{ stroke: 'var(--grid-color)', strokeWidth: 2 }}
              />
              {series.map((s, i) => (
                <Line 
                  key={s.key}
                  type="monotone" 
                  dataKey={s.key} 
                  name={s.name}
                  stroke={s.color} 
                  strokeWidth={3}
                  dot={{ r: 0 }}
                  activeDot={{ r: 6, fill: s.color, stroke: 'var(--background)', strokeWidth: 2 }}
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" vertical={false} />
              <XAxis 
                dataKey={dataKey} 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value >= 1000 ? (value / 1000) + 'k' : value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--panel-bg)', 
                  borderColor: 'var(--panel-border)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 30px -10px var(--panel-shadow)',
                  color: 'var(--text-primary)'
                }}
                cursor={{ fill: 'var(--grid-color)' }}
              />
              {series.map((s) => (
                <Bar 
                  key={s.key}
                  dataKey={s.key} 
                  name={s.name}
                  fill={s.color}
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
