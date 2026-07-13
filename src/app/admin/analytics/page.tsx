"use client";

import React from 'react';
import ChartCard from '@/components/admin/ChartCard';
import { Calendar, Download } from 'lucide-react';

// Mock Data
const userGrowthData = [
  { name: 'Jan', total: 4000, premium: 2400 },
  { name: 'Feb', total: 5000, premium: 2800 },
  { name: 'Mar', total: 6000, premium: 3200 },
  { name: 'Apr', total: 7500, premium: 3900 },
  { name: 'May', total: 8500, premium: 4800 },
  { name: 'Jun', total: 10200, premium: 5200 },
  { name: 'Jul', total: 12450, premium: 6100 },
];

const languageData = [
  { name: 'JavaScript', users: 8500 },
  { name: 'Python', users: 7200 },
  { name: 'TypeScript', users: 6100 },
  { name: 'Java', users: 4500 },
  { name: 'C++', users: 3200 },
  { name: 'Go', users: 2100 },
  { name: 'Rust', users: 1500 },
];

const countryData = [
  { name: 'USA', users: 4500 },
  { name: 'India', users: 3800 },
  { name: 'UK', users: 1200 },
  { name: 'Canada', users: 950 },
  { name: 'Germany', users: 800 },
];

const revenueData = [
  { name: 'Jan', rev: 12000 },
  { name: 'Feb', rev: 14500 },
  { name: 'Mar', rev: 16000 },
  { name: 'Apr', rev: 21000 },
  { name: 'May', rev: 28000 },
  { name: 'Jun', rev: 32500 },
  { name: 'Jul', rev: 45210 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tight">Platform Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Detailed metrics on user growth, activity, and demographics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary-dev flex items-center gap-2">
            <Calendar size={16} />
            <span>Last 6 Months</span>
          </button>
          <button className="btn-secondary-dev flex items-center gap-2">
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="User Growth (YoY)" 
          subtitle="Total vs Premium signups over the last 7 months."
          type="line"
          data={userGrowthData}
          dataKey="name"
          series={[
            { key: 'total', name: 'Total Users', color: '#3B82F6' },
            { key: 'premium', name: 'Premium Users', color: '#FF3366' }
          ]}
          delay={0.1}
        />

        <ChartCard 
          title="Revenue Trajectory" 
          subtitle="Monthly recurring revenue from Premium subscriptions."
          type="bar"
          data={revenueData}
          dataKey="name"
          series={[
            { key: 'rev', name: 'Revenue ($)', color: '#10B981' }
          ]}
          delay={0.2}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Top Programming Languages" 
          subtitle="Most popular languages selected by users."
          type="bar"
          data={languageData}
          dataKey="name"
          series={[
            { key: 'users', name: 'Users', color: '#7B61FF' }
          ]}
          delay={0.3}
        />

        <ChartCard 
          title="User Demographics" 
          subtitle="Top countries by user volume."
          type="bar"
          data={countryData}
          dataKey="name"
          series={[
            { key: 'users', name: 'Users', color: '#3B82F6' }
          ]}
          delay={0.4}
        />
      </div>
    </div>
  );
}
