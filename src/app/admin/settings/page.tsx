"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Mail, CreditCard, Key, Monitor, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'smtp', label: 'Email / SMTP', icon: Mail },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'auth', label: 'Authentication', icon: Key },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] font-mono tracking-tight">Platform Settings</h1>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">Configure core platform functionality and integrations.</p>
        </div>
        
        <button className="btn-premium flex items-center gap-2">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="ide-panel p-2 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
                  activeTab === tab.id 
                    ? 'bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20' 
                    : 'text-[var(--text-secondary)] hover:bg-[var(--btn-sec-bg)] hover:text-[var(--text-primary)] border border-transparent'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 ide-panel p-6 md:p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--ide-border)] pb-2 mb-4">General Configuration</h3>
                  
                  <div className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Site Name</label>
                      <input type="text" defaultValue="DateForCode" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--ide-border)] rounded-xl text-[var(--text-primary)] focus:border-[#FF3366] outline-none" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Support Email</label>
                      <input type="email" defaultValue="support@dateforcode.com" className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--ide-border)] rounded-xl text-[var(--text-primary)] focus:border-[#FF3366] outline-none" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Maintenance Mode</label>
                      <div className="flex items-center gap-3 mt-2">
                        <button className="relative w-12 h-6 rounded-full bg-[var(--btn-sec-border)] transition-colors duration-300">
                          <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300" />
                        </button>
                        <span className="text-sm text-[var(--text-secondary)]">Currently disabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--ide-border)] pb-2 mb-4">Payment Gateways</h3>
                  
                  <div className="space-y-6 max-w-xl">
                    
                    {/* Stripe */}
                    <div className="p-4 rounded-2xl border border-[var(--ide-border)] bg-[var(--background)]">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-[var(--text-primary)]">Stripe Integration</div>
                        <button className="relative w-12 h-6 rounded-full bg-[#10B981] transition-colors duration-300">
                          <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 translate-x-6" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <input type="password" placeholder="Stripe Publishable Key" defaultValue="pk_test_12345" className="w-full px-4 py-2 bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-xl text-[var(--text-primary)] text-xs font-mono focus:border-[#FF3366] outline-none" />
                        <input type="password" placeholder="Stripe Secret Key" defaultValue="sk_test_12345" className="w-full px-4 py-2 bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-xl text-[var(--text-primary)] text-xs font-mono focus:border-[#FF3366] outline-none" />
                      </div>
                    </div>

                    {/* Razorpay */}
                    <div className="p-4 rounded-2xl border border-[var(--ide-border)] bg-[var(--background)]">
                      <div className="flex justify-between items-center mb-4">
                        <div className="font-bold text-[var(--text-primary)]">Razorpay Integration</div>
                        <button className="relative w-12 h-6 rounded-full bg-[var(--btn-sec-border)] transition-colors duration-300">
                          <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can be similarly implemented... */}
            {['security', 'smtp', 'auth'].includes(activeTab) && (
              <div className="py-20 text-center space-y-4">
                <div className="text-[var(--text-muted)]">Configuration panel for {activeTab.toUpperCase()} is under construction.</div>
              </div>
            )}

          </motion.div>
        </div>

      </div>
    </div>
  );
}
