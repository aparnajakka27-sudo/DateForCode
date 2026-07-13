"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Code2, MessageSquare, Maximize2, Share2, Users, ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

function LiveSessionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqId = searchParams.get('req');
  
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [studentInfo, setStudentInfo] = useState<any>(null);

  useEffect(() => {
    const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
    const req = reqs.find((r:any) => r.id === reqId);
    if (req) {
      setStudentInfo(req);
    }
  }, [reqId]);

  const endSession = () => {
    if(confirm("End the live mentorship session?")) {
      router.push('/mentor/dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-hidden font-sans">
      {/* Sidebar / Tools */}
      <div className="w-16 bg-[var(--btn-sec-bg)] border-r border-[var(--ide-border)]/50 flex flex-col items-center py-4 gap-4 z-20 shadow-2xl">
        <button onClick={()=>router.push('/mentor/dashboard')} className="w-10 h-10 rounded-xl bg-[var(--btn-sec-bg)] flex items-center justify-center hover:bg-[var(--btn-sec-bg)] transition-colors mb-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center relative group">
          <Code2 className="w-5 h-5" />
          <span className="absolute left-14 px-2 py-1 bg-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Student Code</span>
        </button>
        <button className="w-10 h-10 rounded-xl hover:bg-[var(--btn-sec-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors relative group">
          <MessageSquare className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-xl hover:bg-[var(--btn-sec-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mt-auto relative group">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Coding Area (Spectator) */}
      <div className="flex-1 flex flex-col relative">
        <header className="h-14 bg-black/20 border-b border-[var(--ide-border)]/50 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-bold text-[var(--text-secondary)]">LIVE OBSERVER</span>
            </div>
            <div className="w-px h-4 bg-[var(--btn-sec-bg)] mx-2" />
            <h2 className="text-sm font-black text-[var(--text-primary)]">{studentInfo ? `${studentInfo.studentName}'s Environment` : 'Loading Session...'}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-[var(--btn-sec-bg)] rounded-xl p-1 border border-[var(--ide-border)]/50">
              <button onClick={()=>setMicOn(!micOn)} className={`w-10 h-8 rounded-lg flex items-center justify-center transition-colors ${micOn?'bg-cyan-500 text-[var(--text-primary)]':'text-[var(--text-muted)] hover:text-[var(--text-primary)]/80'}`}>
                {micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}
              </button>
              <button onClick={()=>setVideoOn(!videoOn)} className={`w-10 h-8 rounded-lg flex items-center justify-center transition-colors ${videoOn?'bg-cyan-500 text-[var(--text-primary)]':'text-[var(--text-muted)] hover:text-[var(--text-primary)]/80'}`}>
                {videoOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}
              </button>
            </div>
            <button onClick={endSession} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-[var(--text-primary)] border border-red-500/30 text-xs font-black rounded-xl transition-colors flex items-center gap-2">
              <PhoneOff className="w-3.5 h-3.5" /> Leave
            </button>
          </div>
        </header>

        <div className="flex-1 bg-[var(--background)] p-6 relative">
          {/* Mock Student Code View */}
          <div className="absolute inset-4 rounded-2xl bg-[var(--background)] border border-[var(--ide-border)]/50 shadow-2xl overflow-hidden font-mono text-sm text-[var(--text-secondary)] p-6 leading-relaxed">
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 text-xs font-bold text-[var(--text-muted)]">index.js — View Only</span>
            </div>
            <p><span className="text-pink-400">function</span> <span className="text-blue-400">reverseString</span>(s) {'{'}</p>
            <p className="ml-4 text-[var(--text-muted)]">{'// Student is typing...'}</p>
            <p className="ml-4"><span className="text-pink-400">return</span> s.<span className="text-cyan-300">split</span>(<span className="text-green-300">''</span>).<span className="text-cyan-300">reverse</span>().<span className="text-cyan-300">join</span>(<span className="text-green-300">''</span>);</p>
            <p>{'}'}</p>
            <div className="absolute bottom-6 left-6 text-xs text-cyan-400 font-bold animate-pulse flex items-center gap-2">
              <Users className="w-4 h-4" /> Syncing in real-time...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MentorLiveSession() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[var(--ide-header-bg)] flex flex-col items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        <p>ESTABLISHING ELITE VIDEO TELEMETRY SENSORS...</p>
      </div>
    }>
      <LiveSessionContent />
    </React.Suspense>
  );
}
