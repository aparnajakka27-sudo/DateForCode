"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Shield, Eye, Download, Bell, Lock, Check, RotateCcw, Save, Search, Mic, LayoutDashboard, Target, Users, Code, Gamepad2, Trophy, Zap, GraduationCap, Settings, Video, Calendar, Swords, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:15}, animate:{opacity:1,y:0}, transition:{duration:0.4,delay:d,ease:[0.16,1,0.3,1] as const} });

const SIDEBAR_ITEMS = [
  { label:'Dashboard', icon:LayoutDashboard, href:'/mentor/dashboard' },
  { label:'Settings', icon:Settings, href:'/mentor/settings' },
];

const TABS = [
  { id:'edit-profile', label:'Edit Profile', icon:User },
  { id:'account', label:'Account Management', icon:Shield },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'privacy', label:'Privacy and Data', icon:Lock },
];

const SEARCH_ITEMS = [
  {label:'Edit Profile',desc:'Change your avatar, name, title, skills',tab:'edit-profile'},
  {label:'Account Management',desc:'Email, password, account type',tab:'account'},
  {label:'Notifications',desc:'Match alerts, class reminders',tab:'notifications'},
  {label:'Privacy and Data',desc:'Download data, clear history',tab:'privacy'},
];

const SKILLS = [
  'React', 'Node.js', 'Python', 'TypeScript', 'Java', 'C++', 'System Design', 'Algorithms', 'Go', 'Rust', 'AWS', 'Docker'
];

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'edit-profile');
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition not supported in this browser'); return; }
    const r = new SR(); r.continuous = false; r.interimResults = false; r.lang = 'en-US';
    r.onresult = (e:any) => { setSearchQuery(e.results[0][0].transcript); setIsListening(false); };
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    recognitionRef.current = r; r.start(); setIsListening(true);
  };

  const [original, setOriginal] = useState({name:'',title:'',avatar:'👨‍🏫',skillsKnown:[] as string[],skillsGuide:[] as string[]});
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState('👨‍🏫');
  const [skillsKnown, setSkillsKnown] = useState<string[]>([]);
  const [skillsGuide, setSkillsGuide] = useState<string[]>([]);

  useEffect(() => {
    const s = localStorage.getItem('dateforcode_mentor_profile');
    if (s) { 
      const p = JSON.parse(s); 
      setOriginal(p); 
      setName(p.name||''); 
      setTitle(p.title||''); 
      setAvatar(p.avatar||'👨‍🏫'); 
      setSkillsKnown(p.skillsKnown||[]); 
      setSkillsGuide(p.skillsGuide||[]);
    } else {
      router.push('/mentor/profile-setup');
    }
  }, [router]);

  const filteredResults = searchQuery.trim().length > 0 ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  
  const handleSave = () => { 
    const p = { ...original, name, title, avatar, skillsKnown, skillsGuide }; 
    localStorage.setItem('dateforcode_mentor_profile',JSON.stringify(p)); 
    setOriginal(p); 
    setSaved(true); 
    setTimeout(()=>setSaved(false),2000); 
  };
  
  const handleReset = () => { 
    setName(original.name); 
    setTitle(original.title); 
    setAvatar(original.avatar); 
    setSkillsKnown([...original.skillsKnown]); 
    setSkillsGuide([...original.skillsGuide]);
  };

  const toggleSkill = (s:string, type: 'known' | 'guide') => {
    if (type === 'known') {
      setSkillsKnown(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
    } else {
      setSkillsGuide(p => p.includes(s) ? p.filter(x=>x!==s) : [...p,s]);
    }
  };

  return (
    <main className="relative min-h-screen bg-bg-dark-950 developer-grid overflow-hidden noise-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-purple/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent-gold/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Top bar with search */}
      <nav className="relative z-20 py-3 px-8 flex items-center border-b border-border-dark bg-bg-dark-900/60 backdrop-blur-xl gap-4">
        <button onClick={()=>router.push('/mentor/dashboard')} className="flex items-center gap-2 text-gray-500 text-xs font-mono font-bold uppercase tracking-wider hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />&gt;_ BACK
        </button>
        <div className="w-px h-5 bg-border-dark" />
        <Link href="/" className="flex items-center gap-2">
            <Logo showText={true} className="scale-[0.55] origin-left text-white" />
        </Link>
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search mentor credentials..." className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-bg-dark-950 border border-border-dark text-sm text-white focus:outline-none focus:border-accent-purple/50 focus:bg-bg-dark-950 transition-all placeholder:text-gray-600 font-mono" />
            <button onClick={startVoice} className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isListening?'bg-accent-purple text-white scale-110':'text-gray-500 hover:text-white hover:bg-border-dark'}`}><Mic className="w-3.5 h-3.5" /></button>
            {/* Search results dropdown */}
            <AnimatePresence>
              {filteredResults.length > 0 && (
                <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute top-full left-0 right-0 mt-2 bg-bg-dark-900 rounded-lg border border-border-dark shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto font-mono">
                  {filteredResults.map((item,i) => (
                    <button key={i} onClick={()=>{setActiveTab(item.tab);setSearchQuery('');}} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent-purple/10 transition-colors border-b border-border-dark last:border-0">
                      <Search className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0"><p className="text-sm font-bold text-gray-300 truncate">{item.label}</p><p className="text-[10px] text-gray-500 truncate">{item.desc}</p></div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex min-h-[calc(100vh-57px)]">
        {/* Left Side Icon Strip */}
        <div className="w-14 flex-shrink-0 bg-bg-dark-900 border-r border-border-dark flex flex-col items-center py-4 gap-1.5 relative z-30">
          {SIDEBAR_ITEMS.map((n)=>(
            <div key={n.label} className="relative group">
              <button onClick={()=>router.push(n.href)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${n.label==='Settings' ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20' : 'text-gray-500 hover:text-white hover:bg-border-dark'}`}>
                <n.icon className="w-4 h-4" />
              </button>
              <div className="fixed ml-[3.5rem] -mt-8 px-3 py-1.5 rounded bg-bg-dark-900 border border-border-dark text-white text-[11px] font-mono whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl" style={{zIndex:9999}}>
                {n.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-bg-dark-900 border-l border-b border-border-dark rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selector Sidebar */}
        <motion.div {...fadeUp(0.05)} className="w-52 flex-shrink-0 bg-bg-dark-900/40 backdrop-blur-md border-r border-border-dark p-4 relative z-10 font-mono">
          <h1 className="text-sm font-bold text-gray-400 mb-5 px-2 tracking-widest uppercase">&gt;_ Credentials</h1>
          <div className="space-y-1">
            {TABS.map((tab,i)=>(
              <motion.button key={tab.id} {...fadeUp(0.08+i*0.03)} onClick={()=>setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all leading-tight ${activeTab===tab.id?'bg-accent-purple/10 text-accent-purple border border-accent-purple/20':'text-gray-500 hover:text-gray-300 hover:bg-border-dark/30 border border-transparent'}`}>
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Configuration Body Panel */}
        <div className="flex-1 p-10 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab==='edit-profile' && (
              <motion.div key="ep" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="max-w-4xl">
                <h2 className="text-xl font-bold font-mono tracking-tight text-white mb-2"><span className="text-accent-gold mr-2">👑</span>Edit Prestigious Profile</h2>
                <p className="text-sm text-gray-400 mb-8 font-mono">Configure custom titles, verified skill frameworks, and active guidance scopes.</p>
                
                <div className="bg-bg-dark-900 border border-border-dark rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/[0.01] rounded-full blur-[80px]" />
                  
                  {/* Photo & Avatar Customizer */}
                  <div className="mb-8">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3 block font-mono">MENTOR_IDENTIFIER_SYMBOL</label>
                    <div className="flex items-center gap-6">
                      <div className="relative group">
                        <div className="w-20 h-20 rounded-2xl bg-bg-dark-950 border border-border-dark shadow-2xl flex items-center justify-center text-4xl cursor-pointer hover:border-accent-purple/50 transition-colors">
                          {avatar}
                        </div>
                        <input type="text" value={avatar} onChange={e=>setAvatar(e.target.value)} maxLength={2} className="absolute inset-0 opacity-0 cursor-pointer" title="Click to change emoji" />
                      </div>
                      <div className="flex-1 max-w-md space-y-4 font-mono">
                        <div>
                          <label className="text-[10px] text-gray-400 mb-1 block">FULL_NAME</label>
                          <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-border-dark text-sm text-white focus:outline-none focus:border-accent-purple transition-all bg-bg-dark-950"/>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 mb-1 block">VERIFIED_PROFESSIONAL_TITLE</label>
                          <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Staff Engineer @ Netflix" className="w-full px-4 py-3 rounded-lg border border-border-dark text-sm text-white focus:outline-none focus:border-accent-purple transition-all bg-bg-dark-950"/>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills Known */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3"><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">KNOWN_SKILLSETS</label></div>
                    <div className="flex flex-wrap gap-2 max-w-2xl font-mono">
                      {SKILLS.map(sk=>{const a=skillsKnown.includes(sk);return(
                        <button key={sk} onClick={()=>toggleSkill(sk, 'known')} className="px-3.5 py-1.5 rounded text-[10px] font-bold uppercase transition-all border" style={{borderColor:a?'#8B5CF6':'rgba(255,255,255,0.06)',background:a?'rgba(139,92,246,0.12)':'#0D0E12',color:a?'#a78bfa':'rgba(255,255,255,0.3)'}}>{sk}</button>
                      );})}
                    </div>
                  </div>

                  {/* Skills Guide */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3"><label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">MENTORING_SCOPE_GUIDES</label></div>
                    <div className="flex flex-wrap gap-2 max-w-2xl font-mono">
                      {SKILLS.map(sk=>{const a=skillsGuide.includes(sk);return(
                        <button key={sk} onClick={()=>toggleSkill(sk, 'guide')} className="px-3.5 py-1.5 rounded text-[10px] font-bold uppercase transition-all border" style={{borderColor:a?'#F59E0B':'rgba(255,255,255,0.06)',background:a?'rgba(245,158,11,0.12)':'#0D0E12',color:a?'#fbbf24':'rgba(255,255,255,0.3)'}}>{sk}</button>
                      );})}
                    </div>
                  </div>

                  {/* Control Nodes */}
                  <div className="flex items-center gap-3 pt-6 border-t border-border-dark font-mono">
                    <button onClick={handleReset} className="btn-secondary-dev flex items-center gap-1.5 hover:border-accent-purple hover:text-white"><RotateCcw className="w-3.5 h-3.5"/>Reset</button>
                    <button onClick={handleSave} className="btn-premium bg-accent-purple hover:bg-accent-purple/80 shadow-accent-purple/10 flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/>{saved?'Wrote changes ✓':'Save Changes'}</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab !== 'edit-profile' && (
               <motion.div key="other" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} className="flex flex-col items-center justify-center h-64 text-gray-500 font-mono text-xs border border-dashed border-border-dark rounded-xl bg-bg-dark-900/20">
                 <p>&gt;_ INTERFACE SECTION UNDER DEVELOPMENT</p>
                 <p className="text-[10px] text-gray-600 mt-2">Certified database registries locked.</p>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function MentorSettings() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-bg-dark-950 flex flex-col items-center justify-center font-mono text-xs text-gray-500 tracking-widest">
        <div className="w-6 h-6 border-2 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin mb-3"/>
        PARSING ELITE MENTOR TELEMETRY...
      </div>
    }>
      <SettingsContent />
    </React.Suspense>
  );
}
