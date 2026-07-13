"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, Clock, UserCheck, Search, Filter, MessageSquare, Code2, Zap, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

// Initialized empty array for upcoming Firestore integration
interface Mentor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  company: string;
  skills: string[];
  rating: number;
  sessions: number;
  online: boolean;
  waitTime: string;
}
const MOCK_MENTORS: Mentor[] = [];

export default function MentorGuidancePage() {
  const router = useRouter();
  const [mentors, setMentors] = useState(MOCK_MENTORS);
  const [search, setSearch] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [requestSentTo, setRequestSentTo] = useState<string|null>(null);
  const [selectedMentor, setSelectedMentor] = useState<typeof MOCK_MENTORS[0]|null>(null);

  // Combine mock mentors with any users who logged in as mentors (simulated via localStorage if we had it, but we'll use mock for UI richness)
  useEffect(() => {
    // Just simulating a dynamic fetch
    const onlineMentors = mentors.filter(m => m.online);
    // You could theoretically pull from a global DB here
  }, []);

  const filters = ['All', 'React', 'Python', 'C++', 'System Design', 'Next.js', 'Go'];

  const filteredMentors = mentors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.skills.some(s=>s.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = selectedFilter === 'All' || m.skills.includes(selectedFilter);
    return matchesSearch && matchesFilter;
  }).sort((a,b) => (a.online===b.online ? 0 : a.online ? -1 : 1));

  const onlineCount = mentors.filter(m => m.online).length;

  const handleRequest = (m: typeof MOCK_MENTORS[0]) => {
    setSelectedMentor(null);
    setRequestSentTo(m.id);
    
    // Save request to localStorage for mentor to see
    const studentProfile = JSON.parse(localStorage.getItem('dateforcode_profile')||'{}');
    const newReq = {
      id: Date.now().toString(),
      mentorId: m.id,
      studentName: studentProfile.username || 'Student',
      studentAvatar: studentProfile.avatar || 'ninja',
      status: 'pending',
      timestamp: Date.now()
    };
    
    const existing = JSON.parse(localStorage.getItem('dateforcode_mentor_requests')||'[]');
    localStorage.setItem('dateforcode_mentor_requests', JSON.stringify([...existing, newReq]));

    // Poll for acceptance
    const interval = setInterval(() => {
      const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests')||'[]');
      const current = reqs.find((r:any) => r.id === newReq.id);
      if (current && current.status === 'accepted') {
        clearInterval(interval);
        const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
        p.hp = (p.hp||0) + 10;
        localStorage.setItem('dateforcode_progress', JSON.stringify(p));
        router.push('/student/solo-code?mentor='+m.id);
      } else if (current && current.status === 'declined') {
        clearInterval(interval);
        setRequestSentTo(null);
        alert('Mentor is currently busy. Please try another mentor.');
      }
    }, 1000);
    
    // Fallback: auto-accept after 15 seconds if no mentor action (for demo purposes)
    setTimeout(() => {
      clearInterval(interval);
      if (requestSentTo === m.id) { // Still waiting
        const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests')||'[]');
        const current = reqs.find((r:any) => r.id === newReq.id);
        if (current && current.status === 'pending') {
            current.status = 'accepted';
            localStorage.setItem('dateforcode_mentor_requests', JSON.stringify(reqs));
            const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
            p.hp = (p.hp||0) + 10;
            localStorage.setItem('dateforcode_progress', JSON.stringify(p));
            router.push('/student/solo-code?mentor='+m.id);
        }
      }
    }, 15000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <motion.div animate={{x:[-20,20,-20]}} transition={{duration:10,repeat:Infinity}} className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#06B6D4]/[0.03] rounded-full blur-[120px]" />
        <motion.div animate={{x:[20,-20,20]}} transition={{duration:15,repeat:Infinity}} className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3B82F6]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-sec-bg)] transition-all border border-transparent hover:border-[var(--ide-border)]">
            <ArrowLeft className="w-4 h-4"/><span className="text-xs font-bold">Dashboard</span>
          </Link>
          <div className="w-px h-5 bg-black/8"/>
          <Logo showText={true} className="scale-[0.8] origin-left" />
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"/>
            <span className="text-xs font-bold text-cyan-700">{onlineCount} Mentors Online</span>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-10">
        {/* Title */}
        <motion.div {...fadeUp(0.1)} className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#22D3EE] flex items-center justify-center text-white shadow-xl" style={{boxShadow:'0 10px 30px rgba(6,182,212,0.2)'}}>
                <BookOpen className="w-6 h-6"/>
              </div>
              <h1 className="text-3xl font-black text-[var(--text-primary)]">Mentor Guidance</h1>
            </div>
            <p className="text-sm text-[var(--text-muted)]">Connect with industry experts for live code reviews and architectural guidance.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input type="text" placeholder="Search by name or skill..." value={search} onChange={e=>setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] focus:border-cyan-300 focus:ring-4 focus:ring-cyan-50 transition-all text-xs font-bold text-[var(--text-primary)] outline-none shadow-sm" />
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div {...fadeUp(0.15)} className="flex flex-wrap gap-2 mb-8">
          <div className="flex items-center gap-2 px-3 text-[var(--text-muted)]"><Filter className="w-4 h-4"/></div>
          {filters.map(f => (
            <button key={f} onClick={()=>setSelectedFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${selectedFilter===f ? 'bg-cyan-50 border-cyan-200 text-cyan-600 shadow-sm' : 'bg-[var(--ide-bg)] border-[var(--ide-border)] text-[var(--text-secondary)] hover:bg-[var(--btn-sec-bg)]'}`}>
              {f}
            </button>
          ))}
        </motion.div>

        {/* Mentor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMentors.map((m, i) => (
            <motion.div key={m.id} {...fadeUp(0.2 + i*0.05)}
              className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] p-6 relative overflow-hidden group hover:border-cyan-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
              style={{boxShadow:'0 4px 20px rgba(0,0,0,0.03)'}}
              onClick={()=>setSelectedMentor(m)}>
              
              <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-cyan-400 to-blue-500" />
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-black/5 to-black/10 border border-[var(--ide-border)] flex items-center justify-center text-lg font-black text-[var(--text-muted)] shadow-inner">
                      {m.avatar}
                    </div>
                    {m.online && <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--ide-bg)] shadow-sm" />}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[var(--text-primary)]">{m.name}</h3>
                    <p className="text-[10px] font-bold text-cyan-600 mb-0.5">{m.role} @ {m.company}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-secondary)]">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400"/> {m.rating} ({m.sessions} sessions)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {m.skills.map(s=>(
                  <span key={s} className="px-2.5 py-1 rounded-md bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] text-[9px] font-bold text-[var(--text-muted)]">{s}</span>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--ide-border)]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold">
                  {m.online ? (
                    <><Clock className="w-3.5 h-3.5 text-cyan-500"/><span className="text-cyan-600">Wait: {m.waitTime}</span></>
                  ) : (
                    <><Clock className="w-3.5 h-3.5 text-[var(--text-muted)]"/><span className="text-[var(--text-secondary)]">Offline</span></>
                  )}
                </div>
                {m.online ? (
                  <button onClick={(e)=>{e.stopPropagation(); handleRequest(m);}} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-600 text-[10px] font-bold hover:bg-cyan-100 transition-colors">
                    <UserCheck className="w-3.5 h-3.5"/> Connect
                  </button>
                ) : (
                  <button onClick={(e)=>e.stopPropagation()} className="px-3 py-1.5 rounded-lg border border-[var(--ide-border)] text-[var(--text-muted)] text-[10px] font-bold cursor-not-allowed">
                    Unavailable
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {filteredMentors.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Search className="w-8 h-8 mx-auto text-[var(--text-primary)]/10 mb-3"/>
              <p className="text-sm font-bold text-[var(--text-secondary)]">No mentors found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Profile Modal */}
      <AnimatePresence>
        {selectedMentor && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setSelectedMentor(null)}/>
            <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] shadow-2xl max-w-md w-full overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-cyan-400 to-blue-500 relative">
                  <button onClick={()=>setSelectedMentor(null)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/20 transition-colors"><X className="w-4 h-4"/></button>
                </div>
                <div className="px-8 pb-8 relative">
                  <div className="relative inline-block -mt-10 mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-[var(--ide-bg)] p-1 shadow-lg">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center text-2xl font-black text-[var(--text-muted)]">
                        {selectedMentor.avatar}
                      </div>
                    </div>
                    {selectedMentor.online && <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--ide-bg)] shadow-sm"/>}
                  </div>
                  <h3 className="text-2xl font-black text-[var(--text-primary)] mb-1">{selectedMentor.name}</h3>
                  <p className="text-xs font-bold text-cyan-600 mb-4">{selectedMentor.role} @ {selectedMentor.company}</p>
                  
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] text-center">
                      <Star className="w-5 h-5 mx-auto text-amber-400 fill-amber-400 mb-1"/>
                      <p className="text-sm font-black text-[var(--text-primary)]">{selectedMentor.rating}</p>
                      <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">Rating</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] text-center">
                      <MessageSquare className="w-5 h-5 mx-auto text-blue-400 mb-1"/>
                      <p className="text-sm font-black text-[var(--text-primary)]">{selectedMentor.sessions}</p>
                      <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">Sessions</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] text-center">
                      <Clock className="w-5 h-5 mx-auto text-green-400 mb-1"/>
                      <p className="text-sm font-black text-[var(--text-primary)]">{selectedMentor.waitTime}</p>
                      <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">Wait Time</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMentor.skills.map(s=>(
                        <span key={s} className="px-3 py-1.5 rounded-lg bg-cyan-50 border border-cyan-100 text-[10px] font-bold text-cyan-700">{s}</span>
                      ))}
                    </div>
                  </div>

                  {selectedMentor.online ? (
                    <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>handleRequest(selectedMentor)}
                      className="w-full py-4 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg"
                      style={{background:'linear-gradient(135deg,#06B6D4,#3B82F6)',boxShadow:'0 8px 25px rgba(6,182,212,0.3)'}}>
                      <Code2 className="w-4 h-4"/> Request Live Session
                    </motion.button>
                  ) : (
                    <button className="w-full py-4 rounded-xl bg-[var(--btn-sec-bg)] text-[var(--text-secondary)] text-sm font-black flex items-center justify-center gap-2 cursor-not-allowed">
                      <Clock className="w-4 h-4"/> Currently Offline
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Requesting State Toast/Overlay */}
      <AnimatePresence>
        {requestSentTo && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--btn-sec-bg)] backdrop-blur-sm">
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="bg-[var(--ide-bg)] rounded-3xl border border-[var(--ide-border)] shadow-2xl p-8 max-w-sm w-full text-center mx-4">
              <motion.div animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:'linear'}} className="w-16 h-16 mx-auto rounded-full border-4 border-[var(--ide-border)] border-t-cyan-500 mb-6"/>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-2">Pinging Mentor...</h3>
              <p className="text-xs text-[var(--text-muted)] mb-6">Waiting for {MOCK_MENTORS.find(m=>m.id===requestSentTo)?.name} to accept your session request.</p>
              <div className="h-1.5 w-full bg-[var(--btn-sec-bg)] rounded-full overflow-hidden">
                <motion.div animate={{x:['-100%','100%']}} transition={{duration:1.5,repeat:Infinity,ease:'easeInOut'}} className="w-1/2 h-full bg-cyan-500 rounded-full"/>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
