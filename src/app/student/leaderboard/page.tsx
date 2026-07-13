"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, ArrowLeft, Zap, Sparkles, Crown, Medal, Flame, Star, UserPlus, CheckCircle2, X, Send, Bell, Heart, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:25}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const LEADERBOARD_DATA = [
  { id:'u1', name:'Arjun Patel', hp:840, streak:12, avatar:'AP', online:true, skills:['JavaScript','React'] },
  { id:'u2', name:'Sneha Gupta', hp:720, streak:9, avatar:'SG', online:true, skills:['Python','AI'] },
  { id:'u3', name:'Raj Malhotra', hp:680, streak:8, avatar:'RM', online:false, skills:['C++','DSA'] },
  { id:'u4', name:'Priya Sharma', hp:590, streak:7, avatar:'PS', online:true, skills:['TypeScript','Next.js'] },
  { id:'u5', name:'Kiran Nair', hp:520, streak:6, avatar:'KN', online:true, skills:['Node.js','Express'] },
  { id:'u6', name:'Ananya Das', hp:480, streak:5, avatar:'AD', online:false, skills:['Python','Django'] },
  { id:'u7', name:'Vikram Singh', hp:410, streak:4, avatar:'VS', online:true, skills:['Java','Spring'] },
  { id:'u8', name:'Meera Joshi', hp:350, streak:3, avatar:'MJ', online:false, skills:['React','CSS'] },
  { id:'u9', name:'Rohan Kumar', hp:290, streak:2, avatar:'RK', online:true, skills:['Go','Docker'] },
  { id:'u10', name:'Divya Reddy', hp:220, streak:1, avatar:'DR', online:true, skills:['Flutter','Dart'] },
];

const RANK_BG = ['','linear-gradient(135deg,#FFD700,#FFC107)','linear-gradient(135deg,#C0C0C0,#B0B0B0)','linear-gradient(135deg,#CD7F32,#A0522D)'];
const RANK_SHADOW = ['','0 8px 25px rgba(255,215,0,0.3)','0 8px 25px rgba(192,192,192,0.3)','0 8px 25px rgba(205,127,50,0.3)'];

export default function LeaderboardPage() {
  const router = useRouter();
  const [hp, setHp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [username, setUsername] = useState('You');
  const [tab, setTab] = useState<'hp'|'streak'>('hp');
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [showRequestSent, setShowRequestSent] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof LEADERBOARD_DATA[0]|null>(null);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('dateforcode_progress')||'{}');
      const prof = JSON.parse(localStorage.getItem('dateforcode_profile')||'{}');
      setHp(p.hp||0); setStreak(p.streak||0);
      if (prof.username) setUsername(prof.username);
      const sr = JSON.parse(localStorage.getItem('dateforcode_sent_requests')||'[]');
      setSentRequests(sr);
    } catch(_) {}
  }, []);

  const sendPairRequest = (userId:string, userName:string) => {
    const updated = [...sentRequests, userId];
    setSentRequests(updated);
    localStorage.setItem('dateforcode_sent_requests', JSON.stringify(updated));
    // Save to notifications for the other user (simulated)
    try {
      const notifs = JSON.parse(localStorage.getItem('dateforcode_notifications')||'[]');
      notifs.push({ id: Date.now().toString(), type:'pair_request', from: username, fromId:'me', toId: userId, toName: userName, status:'pending', time: new Date().toISOString() });
      localStorage.setItem('dateforcode_notifications', JSON.stringify(notifs));
    } catch(_){}
    setShowRequestSent(userName);
    setTimeout(() => setShowRequestSent(''), 3000);
  };

  const sorted = tab === 'hp' ? [...LEADERBOARD_DATA].sort((a,b) => b.hp - a.hp) : [...LEADERBOARD_DATA].sort((a,b) => b.streak - a.streak);
  const myRank = sorted.findIndex(u => hp > u.hp) + 1 || sorted.length + 1;

  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <motion.div animate={{y:[-20,20,-20]}} transition={{duration:8,repeat:Infinity}} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FFD700]/[0.02] rounded-full blur-[120px]" />
        <motion.div animate={{y:[20,-20,20]}} transition={{duration:10,repeat:Infinity}} className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#FF4D6D]/[0.02] rounded-full blur-[100px]" />
      </div>

      <motion.header {...fadeUp(0)} className="sticky top-0 z-20 bg-[var(--nav-bg)] backdrop-blur-md border-b border-[var(--nav-border)] px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/student/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--btn-sec-bg)] transition-all border border-transparent hover:border-[var(--ide-border)]">
            <ArrowLeft className="w-4 h-4"/><span className="text-xs font-bold">Dashboard</span>
          </Link>
          <div className="w-px h-5 bg-black/8"/>
          <Logo showText={true} className="scale-[0.8] origin-left" />
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] shadow-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#FF4D6D]"/><span className="text-sm font-extrabold">{hp} HP</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-[var(--ide-bg)] border border-[var(--ide-border)] shadow-sm flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500"/><span className="text-sm font-extrabold">{streak}d</span>
          </div>
        </div>
      </motion.header>

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-10">
        {/* Title */}
        <motion.div {...fadeUp(0.1)} className="text-center mb-8">
          <motion.div initial={{scale:0,rotate:-20}} animate={{scale:1,rotate:0}} transition={{type:'spring',delay:0.2}} className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white mb-4 shadow-xl" style={{boxShadow:'0 10px 35px rgba(245,158,11,0.25)'}}>
            <Trophy className="w-8 h-8"/>
          </motion.div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] mb-1">Global Leaderboard</h1>
          <p className="text-xs text-[var(--text-muted)]">Top coders ranked by performance • Send pair requests to compete together</p>
        </motion.div>

        {/* Tabs */}
        <motion.div {...fadeUp(0.15)} className="flex items-center gap-2 justify-center mb-8">
          {[{key:'hp' as const,label:'HP Score',icon:Zap,c:'#FF4D6D'},{key:'streak' as const,label:'Streak',icon:Flame,c:'#F97316'}].map(t=>(
            <button key={t.key} onClick={()=>setTab(t.key)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold border-2 transition-all ${tab===t.key?'shadow-sm':'border-[var(--ide-border)] text-[var(--text-muted)]'}`}
              style={tab===t.key?{background:`${t.c}08`,color:t.c,borderColor:`${t.c}25`}:{}}>
              <t.icon className="w-4 h-4"/>{t.label}
            </button>
          ))}
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div {...fadeUp(0.2)} className="flex items-end justify-center gap-5 mb-10">
          {[1,0,2].map((idx,pos) => {
            const u = sorted[idx]; if(!u) return null;
            const heights = ['h-24','h-32','h-20'];
            const sizes = ['w-14 h-14','w-18 h-18','w-14 h-14'];
            const ranks = [2,1,3];
            const r = ranks[pos];
            return (
              <motion.div key={u.id} initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.3+pos*0.15,type:'spring'}} className="flex flex-col items-center">
                <div className="relative mb-2">
                  <motion.div whileHover={{scale:1.1,rotate:5}} className={`${sizes[pos]} rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg`}
                    style={{background:RANK_BG[r],boxShadow:RANK_SHADOW[r]}}>
                    {u.avatar}
                  </motion.div>
                  {u.online && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[var(--ide-bg)]"/>}
                  {r===1 && <motion.div animate={{rotate:[0,10,-10,0]}} transition={{duration:2,repeat:Infinity}} className="absolute -top-3 left-1/2 -translate-x-1/2 text-xl">👑</motion.div>}
                </div>
                <p className="text-xs font-bold text-[var(--text-primary)] mb-0.5">{u.name}</p>
                <p className="text-[9px] text-[var(--text-muted)] font-bold mb-2">{tab==='hp'?`${u.hp} HP`:`${u.streak} days`}</p>
                <div className={`${heights[pos]} w-20 rounded-t-xl flex items-start justify-center pt-3 relative overflow-hidden`}
                  style={{background:`${RANK_BG[r]}15`}}>
                  <span className="text-2xl relative z-10">{r===1?'🥇':r===2?'🥈':'🥉'}</span>
                  <motion.div animate={{y:[-100,0]}} transition={{duration:1,delay:0.5+pos*0.1}} className="absolute inset-0" style={{background:`${RANK_BG[r]}08`}}/>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Full List */}
        <motion.div {...fadeUp(0.3)} className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] shadow-sm overflow-hidden mb-6">
          <div className="px-6 py-3 bg-[var(--btn-sec-bg)] border-b border-[var(--ide-border)] grid grid-cols-12 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            <span className="col-span-1">#</span><span className="col-span-4">Player</span><span className="col-span-2 text-center">HP</span><span className="col-span-2 text-center">Streak</span><span className="col-span-3 text-right">Action</span>
          </div>
          {sorted.map((u,i) => {
            const prevRank = tab==='hp' ? [...LEADERBOARD_DATA].sort((a,b)=>b.hp-a.hp).findIndex(x=>x.id===u.id) : [...LEADERBOARD_DATA].sort((a,b)=>b.streak-a.streak).findIndex(x=>x.id===u.id);
            const rankChange = prevRank - i;
            const isRequested = sentRequests.includes(u.id);
            return (
              <motion.div key={u.id} initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.35+i*0.04}}
                className={`px-6 py-3.5 grid grid-cols-12 items-center border-b border-[var(--ide-border)]/50 hover:bg-[var(--btn-sec-bg)] transition-colors cursor-pointer ${i<3?'bg-amber-50/20':''}`}
                onClick={()=>setSelectedUser(u)}>
                <span className="col-span-1 text-xs font-extrabold text-[var(--text-muted)] flex items-center gap-1">
                  {i+1}
                  {rankChange>0 && <ArrowUpRight className="w-3 h-3 text-green-500"/>}
                  {rankChange<0 && <ArrowDownRight className="w-3 h-3 text-red-400"/>}
                </span>
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[9px] font-black text-white" style={{background:i<3?RANK_BG[i+1]:'linear-gradient(135deg,#CBD5E1,#94A3B8)'}}>{u.avatar}</div>
                    {u.online && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[var(--ide-bg)]"/>}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--text-primary)] block">{u.name}</span>
                    <span className="text-[8px] text-[var(--text-muted)]">{u.skills.join(' • ')}</span>
                  </div>
                </div>
                <span className="col-span-2 text-center text-xs font-bold text-[#FF4D6D]">{u.hp}</span>
                <span className="col-span-2 text-center text-xs font-bold text-orange-400">{u.streak}d 🔥</span>
                <div className="col-span-3 flex justify-end">
                  {isRequested ? (
                    <span className="text-[9px] font-bold text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/>Sent</span>
                  ) : (
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                      onClick={(e)=>{e.stopPropagation();sendPairRequest(u.id,u.name);}}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold bg-[#FF4D6D]/8 text-[#FF4D6D] border border-[#FF4D6D]/15 hover:bg-[#FF4D6D]/15 transition-all">
                      <UserPlus className="w-3 h-3"/>Pair
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
          {/* Your row */}
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8}} className="px-6 py-4 grid grid-cols-12 items-center bg-[#FF4D6D]/5 border-t-2 border-[#FF4D6D]/20">
            <span className="col-span-1 text-xs font-extrabold text-[#FF4D6D]">{myRank}</span>
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF4D6D] flex items-center justify-center text-[9px] font-black text-white">{username.slice(0,2).toUpperCase()}</div>
              <span className="text-xs font-bold text-[#FF4D6D]">{username} (You)</span>
            </div>
            <span className="col-span-2 text-center text-xs font-bold text-[#FF4D6D]">{hp}</span>
            <span className="col-span-2 text-center text-xs font-bold text-orange-400">{streak}d 🔥</span>
            <span className="col-span-3"/>
          </motion.div>
        </motion.div>
      </div>

      {/* Request Sent Toast */}
      <AnimatePresence>
        {showRequestSent && (
          <motion.div initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} exit={{y:50,opacity:0}}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl bg-green-500 text-white text-sm font-bold shadow-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4"/>Pair request sent to {showRequestSent}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setSelectedUser(null)}/>
            <motion.div initial={{scale:0.9,opacity:0,y:20}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.9,opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="bg-[var(--ide-bg)] rounded-2xl border border-[var(--ide-border)] shadow-2xl max-w-sm w-full p-8 text-center">
                <button onClick={()=>setSelectedUser(null)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-[var(--btn-sec-bg)] flex items-center justify-center"><X className="w-4 h-4 text-[var(--text-secondary)]"/></button>
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-xl mx-auto"
                    style={{background:sorted.indexOf(selectedUser)<3?RANK_BG[sorted.indexOf(selectedUser)+1]:'linear-gradient(135deg,#CBD5E1,#94A3B8)'}}>
                    {selectedUser.avatar}
                  </div>
                  {selectedUser.online && <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-3 border-white"/>}
                </div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">{selectedUser.name}</h3>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-4">Rank #{sorted.indexOf(selectedUser)+1} • {selectedUser.online?'🟢 Online':'⚫ Offline'}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#FF4D6D]/5 border border-[#FF4D6D]/10">
                    <p className="text-lg font-black text-[#FF4D6D]">{selectedUser.hp}</p>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold">HP Score</p>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                    <p className="text-lg font-black text-orange-500">{selectedUser.streak}d</p>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold">Streak</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center mb-5">
                  {selectedUser.skills.map(s=>(<span key={s} className="px-3 py-1 rounded-lg text-[9px] font-bold bg-[var(--btn-sec-bg)] text-[var(--text-muted)]">{s}</span>))}
                </div>
                {sentRequests.includes(selectedUser.id) ? (
                  <div className="py-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-xs font-bold flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4"/>Request Sent</div>
                ) : (
                  <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={()=>{sendPairRequest(selectedUser.id,selectedUser.name);setSelectedUser(null);}}
                    className="w-full py-3.5 rounded-xl text-white text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                    style={{background:'linear-gradient(135deg,#FF4D6D,#FF758C)',boxShadow:'0 8px 25px rgba(255,77,109,0.2)'}}>
                    <UserPlus className="w-4 h-4"/>Send Pair Request
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
