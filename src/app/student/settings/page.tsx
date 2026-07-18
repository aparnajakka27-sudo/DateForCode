"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User, Shield, Eye, Download, Bell, Lock, Check, RotateCcw, Save, Camera, Search, Mic, LayoutDashboard, Target, Users, Code, Gamepad2, Trophy, Zap, GraduationCap, Settings, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import AccountTab from './AccountTab';
import { auth } from '@/lib/firebase';
import { useUser } from '@/context/UserContext';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:15}, animate:{opacity:1,y:0}, transition:{duration:0.4,delay:d,ease:[0.16,1,0.3,1] as const} });

const SIDEBAR_ITEMS = [
  {icon:LayoutDashboard,label:'Dashboard',href:'/student/dashboard'},
  {icon:Target,label:'Skill Assessment',href:'/student/skill-assessment'},
  {icon:Users,label:'Matching',href:'/student/matching-room'},
  {icon:Code,label:'Coding Room',href:'/student/coding-room'},
  {icon:Gamepad2,label:'Gamification',href:'/student/gamification'},
  {icon:Zap,label:'Challenges',href:'/student/challenges'},
  {icon:Terminal,label:'Playground',href:'/student/playground'},
  {icon:Trophy,label:'Leaderboard',href:'/student/leaderboard'},
  {icon:GraduationCap,label:'Mentor Guidance',href:'/student/mentor-guidance'},
  {icon:Settings,label:'Settings',href:'/student/settings'},
];

const TABS = [
  { id:'edit-profile', label:'Edit Profile', icon:User },
  { id:'account', label:'Account Management', icon:Shield },
  { id:'visibility', label:'Profile Visibility', icon:Eye },
  { id:'import', label:'Import Content', icon:Download },
  { id:'notifications', label:'Notifications', icon:Bell },
  { id:'privacy', label:'Privacy and Data', icon:Lock },
];

const SEARCH_ITEMS = [
  {label:'Edit Profile',desc:'Change your avatar, username, bio, skills',tab:'edit-profile'},
  {label:'Change Avatar',desc:'Update your profile picture',tab:'edit-profile'},
  {label:'Change Username',desc:'Update your display name',tab:'edit-profile'},
  {label:'Update Bio',desc:'Edit your profile bio',tab:'edit-profile'},
  {label:'Change Skills',desc:'Add or remove your coding skills',tab:'edit-profile'},
  {label:'Account Management',desc:'Email, password, account type',tab:'account'},
  {label:'Change Password',desc:'Update your login password',tab:'account'},
  {label:'Convert Account',desc:'Switch between personal and business',tab:'account'},
  {label:'College Name',desc:'Update your college information',tab:'account'},
  {label:'Year of Study',desc:'Update your current year',tab:'account'},
  {label:'Deactivate Account',desc:'Temporarily hide your profile',tab:'account'},
  {label:'Delete Account',desc:'Permanently delete your account and data',tab:'account'},
  {label:'Profile Visibility',desc:'Private profile, online status',tab:'visibility'},
  {label:'Private Profile',desc:'Hide skills, streaks, HP from others',tab:'visibility'},
  {label:'Online Status',desc:'Show or hide your active status',tab:'visibility'},
  {label:'Activity Sharing',desc:'Share coding stats with partners',tab:'visibility'},
  {label:'Leaderboard Visibility',desc:'Show or hide from leaderboard',tab:'visibility'},
  {label:'Import Content',desc:'Connect GitHub, LeetCode, LinkedIn',tab:'import'},
  {label:'Connect GitHub',desc:'Import repositories and contributions',tab:'import'},
  {label:'Connect LeetCode',desc:'Import problem-solving stats',tab:'import'},
  {label:'Notifications',desc:'Match alerts, challenge invites',tab:'notifications'},
  {label:'Match Notifications',desc:'Get notified when AI finds a partner',tab:'notifications'},
  {label:'Challenge Invites',desc:'Notifications for coding challenges',tab:'notifications'},
  {label:'Privacy and Data',desc:'Download data, clear history',tab:'privacy'},
  {label:'Download Data',desc:'Get a copy of all your data',tab:'privacy'},
  {label:'Clear History',desc:'Remove coding session history',tab:'privacy'},
];

const AVATARS = [
  { id: 'kai', img: '/avatars/kai.png', ring: '#0F766E' },
  { id: 'leo', img: '/avatars/leo.png', ring: '#4D7C0F' },
  { id: 'maya', img: '/avatars/maya.png', ring: '#6D28D9' },
  { id: 'luna', img: '/avatars/luna.png', ring: '#BE185D' },
  { id: 'jax', img: '/avatars/jax.png', ring: '#C2410C' },
  { id: 'zara', img: '/avatars/zara.png', ring: '#CA8A04' },
  { id: 'finn', img: '/avatars/finn.png', ring: '#0369A1' },
  { id: 'nova', img: '/avatars/nova.png', ring: '#B91C1C' },
  { id: 'remy', img: '/avatars/remy.png', ring: '#4338CA' },
  { id: 'cleo', img: '/avatars/cleo.png', ring: '#0E7490' },
];

const SKILLS = [
  { name:'JavaScript', color:'#F59E0B' },
  { name:'TypeScript', color:'#3B82F6' },
  { name:'Python', color:'#3776AB' },
  { name:'React', color:'#06B6D4' },
  { name:'Next.js', color:'#ffffff' },
  { name:'Node.js', color:'#10B981' },
  { name:'Java', color:'#ED8B00' },
  { name:'C++', color:'#00599C' },
  { name:'HTML/CSS', color:'#E34F26' },
  { name:'MongoDB', color:'#47A248' },
  { name:'SQL', color:'#4479A1' },
  { name:'Git', color:'#F05032' },
  { name:'Docker', color:'#2496ED' },
  { name:'AWS', color:'#FF9900' },
  { name:'Rust', color:'#CE422B' },
  { name:'Go', color:'#00ADD8' },
];

function Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'edit-profile');
  const [showAvatars, setShowAvatars] = useState(false);
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

  const [original, setOriginal] = useState({username:'',avatar:'',skills:[] as string[],bio:''});
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');

  const { user, profile, refreshProfile } = useUser();

  useEffect(() => {
    if (profile) {
      setOriginal(profile as any);
      setUsername(profile.username||'');
      setAvatar(profile.avatar||'');
      setSkills(profile.skills||[]);
      setBio(profile.bio||'');
    }
  }, [profile]);

  // Legacy migration map for settings
  const LEGACY_AVATAR_MAP: Record<string, string> = {
    ninja: 'kai', astro: 'leo', pixel: 'maya', cyber: 'luna', nova: 'kai', ghost: 'leo',
    spark: 'maya', zen: 'kai', blade: 'leo', storm: 'luna', volt: 'kai', frost: 'leo',
    blaze: 'maya', sage: 'luna', echo: 'kai'
  };

  const currentAvatarId = avatar ? (LEGACY_AVATAR_MAP[avatar] || avatar) : 'kai';
  const avData = AVATARS.find(a => a.id === currentAvatarId) || AVATARS[0];
  const avatarImg = avData.img;
  const filteredResults = searchQuery.trim().length > 0 ? SEARCH_ITEMS.filter(i => i.label.toLowerCase().includes(searchQuery.toLowerCase()) || i.desc.toLowerCase().includes(searchQuery.toLowerCase())) : [];
  const handleSave = async () => {
    const p={username,avatar,skills,bio};
    
    if (user) {
      try {
        const token = await user.getIdToken();
        await fetch('/api/user/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(p)
        });
        await refreshProfile();
      } catch (err) {
        console.error("Failed to sync profile to MongoDB", err);
      }
    }

    setOriginal(p);
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };
  const handleReset = () => {
    setUsername(original.username);
    setAvatar(original.avatar);
    setSkills([...original.skills]);
    setBio(original.bio);
    setShowAvatars(false);
  };
  const toggleSkill = (s:string) => setSkills(p=>p.includes(s)?p.filter(x=>x!==s):p.length<8?[...p,s]:p);

  return (
    <main className="relative min-h-screen bg-[var(--background)] developer-grid overflow-hidden noise-bg">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accent-pink/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-accent-blue/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Sleek Dark Top bar */}
      <nav className="relative z-20 py-3 px-8 flex items-center border-b border-[var(--ide-border)] bg-[var(--ide-header-bg)]/60 backdrop-blur-xl gap-4">
        <button onClick={()=>router.push('/student/dashboard')} className="flex items-center gap-2 text-[var(--text-secondary)] text-xs font-mono font-bold uppercase tracking-wider hover:text-[var(--text-primary)] transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />&gt;_ BACK
        </button>
        <div className="w-px h-5 bg-border-dark" />
        <Logo showText={true} className="scale-[0.8] origin-left text-[var(--text-primary)]" />
        <div className="flex-1 max-w-lg mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search configs..." className="w-full pl-10 pr-12 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-accent-pink/50 focus:bg-[var(--background)] transition-all placeholder:text-[var(--text-muted)] font-mono" />
            <button onClick={startVoice} className={`absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isListening?'bg-accent-pink text-[var(--text-primary)] scale-110':'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-border-dark'}`}><Mic className="w-3.5 h-3.5" /></button>
            {/* Search results dropdown */}
            <AnimatePresence>
              {filteredResults.length > 0 && (
                <motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute top-full left-0 right-0 mt-2 bg-[var(--ide-header-bg)] rounded-lg border border-[var(--ide-border)] shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto font-mono">
                  {filteredResults.map((item,i) => (
                    <button key={i} onClick={()=>{setActiveTab(item.tab);setSearchQuery('');}} className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-accent-pink/10 transition-colors border-b border-[var(--ide-border)] last:border-0">
                      <Search className="w-3.5 h-3.5 text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
                      <div className="min-w-0"><p className="text-sm font-bold text-[var(--text-secondary)] truncate">{item.label}</p><p className="text-[10px] text-[var(--text-secondary)] truncate">{item.desc}</p></div>
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
        <div className="w-14 flex-shrink-0 bg-[var(--ide-header-bg)] border-r border-[var(--ide-border)] flex flex-col items-center py-4 gap-1.5 relative z-30">
          {SIDEBAR_ITEMS.map((n)=>(
            <div key={n.label} className="relative group">
              <button onClick={()=>router.push(n.href)} className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${n.label==='Settings' ? 'bg-accent-pink/10 text-accent-pink border border-accent-pink/20' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-border-dark'}`}>
                <n.icon className="w-4 h-4" />
              </button>
              <div className="fixed ml-[3.5rem] -mt-8 px-3 py-1.5 rounded bg-[var(--ide-header-bg)] border border-[var(--ide-border)] text-[var(--text-primary)] text-[11px] font-mono whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible pointer-events-none transition-all duration-200 shadow-xl" style={{zIndex:9999}}>
                {n.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[var(--ide-header-bg)] border-l border-b border-[var(--ide-border)] rotate-45" />
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selector Sidebar */}
        <motion.div {...fadeUp(0.05)} className="w-52 flex-shrink-0 bg-[var(--ide-header-bg)]/40 backdrop-blur-md border-r border-[var(--ide-border)] p-4 relative z-10 font-mono">
          <h1 className="text-sm font-bold text-[var(--text-secondary)] mb-5 px-2 tracking-widest uppercase">&gt;_ Configs</h1>
          <div className="space-y-1">
            {TABS.map((tab,i)=>(
              <motion.button key={tab.id} {...fadeUp(0.08+i*0.03)} onClick={()=>setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-left transition-all leading-tight ${activeTab===tab.id?'bg-accent-pink/10 text-accent-pink border border-accent-pink/20':'text-[var(--text-secondary)] hover:text-[var(--text-secondary)] hover:bg-border-dark/30 border border-transparent'}`}>
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
                <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-2"><span className="text-accent-pink mr-2">&gt;_</span>Edit Profile</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 font-mono">Configure custom hacker handle, toolbox tags, and bio telemetry.</p>
                
                <div className="bg-[var(--ide-header-bg)] border border-[var(--ide-border)] rounded-xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-pink/[0.01] rounded-full blur-[80px]" />
                  
                  {/* Photo & Avatar Customizer */}
                  <div className="mb-8">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-3 block font-mono">AVATAR_PERSONA_SIGNATURE</label>
                    <div className="flex items-center gap-6">
                      <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20 pointer-events-none rounded-full" style={{backgroundColor: avData?.ring||'#A855F7'}} />
                      <div className="relative">
                        <div className="w-24 h-24 rounded bg-[var(--background)] border-2 flex items-center justify-center relative overflow-hidden" style={{borderColor: avData?.ring||'#A855F7'}}>
                          <img src={avatarImg} alt="avatar" className="w-full h-full object-cover" />
                          <button onClick={()=>setShowAvatars(true)} className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                            <span className="text-[10px] font-mono text-white">CHANGE</span>
                          </button>
                        </div>
                      </div>
                      <button onClick={()=>setShowAvatars(!showAvatars)} className="btn-secondary-dev flex items-center gap-1.5 text-xs py-2.5 px-4"><Camera className="w-3.5 h-3.5"/>Re-roll Persona</button>
                    </div>
                    <AnimatePresence>{showAvatars && (
                      <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}} className="overflow-hidden">
                        <div className="grid grid-cols-8 gap-3 mt-5 p-4 bg-[var(--background)] rounded-xl border border-[var(--ide-border)]">
                          {AVATARS.map(a => (
                            <button key={a.id} onClick={()=>{setAvatar(a.id);setShowAvatars(false);}} className={`w-14 h-14 rounded bg-[var(--background)] border flex items-center justify-center overflow-hidden transition-all ${currentAvatarId===a.id?'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]':'border-border-dark hover:border-gray-500 hover:scale-105'}`}>
                              <img src={a.img} alt={a.id} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}</AnimatePresence>
                  </div>

                  {/* Username input */}
                  <div className="mb-6"><label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block font-mono">HACKER_HANDLE_ID</label>
                    <div className="relative max-w-md">
                      <input type="text" value={username} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))} maxLength={20} className="w-full px-4 py-3 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] font-mono focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink/20 transition-all bg-[var(--background)]"/>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 font-mono">Platform endpoint: dateforcode.com/@{username||'handle'}</p>
                    </div>
                  </div>

                  {/* Bio input */}
                  <div className="mb-6"><label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block font-mono">BIO_TELEMETRY</label>
                    <div className="relative max-w-md">
                      <textarea value={bio} onChange={e=>setBio(e.target.value)} maxLength={160} rows={3} className="w-full px-4 py-3 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-accent-pink focus:ring-1 focus:ring-accent-pink/20 transition-all bg-[var(--background)] font-mono resize-none leading-relaxed" placeholder="Initialize custom bio narrative..."/>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-1.5 font-mono text-right">{bio.length}/160</p>
                    </div>
                  </div>

                  {/* Skills tags selection */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3"><label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-mono">SKILLBOX_INDEX</label><span className="text-[10px] font-mono text-accent-pink">{skills.length}/8 tags active</span></div>
                    <div className="flex flex-wrap gap-2 max-w-2xl">
                      {SKILLS.map(sk=>{const a=skills.includes(sk.name);return(
                        <button key={sk.name} onClick={()=>toggleSkill(sk.name)} className="px-3 py-2 rounded text-[10px] font-bold uppercase tracking-wider transition-all border font-mono" style={{borderColor:a?sk.color:'rgba(255,255,255,0.06)',background:a?`${sk.color}12`:'#0D0E12',color:a?sk.color:'rgba(255,255,255,0.3)'}}>{sk.name}</button>
                      );})}
                    </div>
                  </div>

                  {/* Control Nodes */}
                  <div className="flex items-center gap-3 pt-6 border-t border-[var(--ide-border)]">
                    <button onClick={handleReset} className="btn-secondary-dev flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5"/>Reset</button>
                    <button onClick={handleSave} className="btn-premium flex items-center gap-1.5"><Save className="w-3.5 h-3.5"/>{saved?'Wrote changes ✓':'Save Changes'}</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab==='account' && <AccountTab />}

            {activeTab==='visibility' && (
              <motion.div key="vis" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="max-w-4xl">
                <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-2"><span className="text-accent-pink mr-2">&gt;_</span>Profile Visibility</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 font-mono">Manage network visibility, online availability logs, and profile search filters.</p>
                
                <div className="bg-[var(--ide-header-bg)] border border-[var(--ide-border)] rounded-xl p-8 space-y-6">
                  <div className="pb-5 border-b border-[var(--ide-border)]">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-[var(--text-secondary)] font-mono">ISOLATED_NODE_MODE (Private)</p><p className="text-xs text-[var(--text-secondary)] mt-1 max-w-lg font-mono">When active, only custom tags are visible to other entities. Overlap scheduling algorithms are disabled.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-[var(--background)] border border-[var(--ide-border)] flex items-center justify-start px-0.5"><div className="w-5 h-5 bg-gray-600 rounded-full shadow" /></div>
                    </div>
                  </div>
                  <div className="pb-5 border-b border-[var(--ide-border)]">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-[var(--text-secondary)] font-mono">ONLINE_STATUS_LOGGING</p><p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">Show active presence inside dashboards and coding room nodes.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-accent-pink flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-[var(--ide-bg)] rounded-full shadow" /></div>
                    </div>
                  </div>
                  <div className="pb-5 border-b border-[var(--ide-border)]">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-[var(--text-secondary)] font-mono">METRICS_SHARING</p><p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">Share week-to-week XP speed curves and challenge telemetry with matched peers.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-accent-pink flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-[var(--ide-bg)] rounded-full shadow" /></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-bold text-[var(--text-secondary)] font-mono">LEADERBOARD_REGISTRY</p><p className="text-xs text-[var(--text-secondary)] mt-1 font-mono">Permit rank listings to appear on the public global leaderboard feeds.</p></div>
                      <div className="w-11 h-6 rounded-full cursor-pointer bg-accent-pink flex items-center justify-end px-0.5"><div className="w-5 h-5 bg-[var(--ide-bg)] rounded-full shadow" /></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab==='import' && (
              <motion.div key="imp" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="max-w-4xl">
                <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-2"><span className="text-accent-pink mr-2">&gt;_</span>Import Content</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 font-mono">Synchronize developer accounts and problem-solving registries.</p>
                
                <div className="space-y-3">
                  {[
                    {n:'GitHub Integration',d:'Import repository structures & contributions',e:'🐙',color:'#333',url:'https://github.com/login/oauth/authorize'},
                    {n:'LeetCode Registry',d:'Synchronize completed algorithms & assessments',e:'💡',color:'#F89F1B',url:'https://leetcode.com/accounts/login/'},
                    {n:'LinkedIn Professional Profile',d:'Import professional tags and bio parameters',e:'💼',color:'#0A66C2',url:'https://www.linkedin.com/login'},
                  ].map((item,idx)=>(
                    <motion.div key={item.n} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.05+idx*0.06}}
                      className="flex items-center justify-between p-5 bg-[var(--ide-header-bg)] border border-[var(--ide-border)] rounded-xl hover:border-accent-pink/35 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg flex items-center justify-center text-xl bg-[var(--background)] border border-[var(--ide-border)] group-hover:scale-105 transition-transform duration-300">{item.e}</div>
                        <div><p className="text-sm font-bold text-[var(--text-secondary)] font-mono">{item.n}</p><p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">{item.d}</p></div>
                      </div>
                      <button onClick={()=>{if(item.url!=='#')window.open(item.url,'_blank','width=600,height=700');}} className="btn-secondary-dev text-[10px] font-bold uppercase tracking-wider py-2 px-4 border-gray-700 hover:border-accent-pink hover:text-[var(--text-primary)]">Connect</button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab==='notifications' && (
              <motion.div key="notif" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="max-w-4xl">
                <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-2"><span className="text-accent-pink mr-2">&gt;_</span>Notifications</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 font-mono">Manage event triggers, matchmaking indicators, and real-time guidance alarms.</p>
                
                <div className="bg-[var(--ide-header-bg)] border border-[var(--ide-border)] rounded-xl p-6 space-y-1">
                  {[
                    {l:'Match Found',d:'Receive notifications when AI matches an active coding partner',color:'#FF3366',emoji:'🤝',def:true},
                    {l:'Challenge Invites',d:'Alarms when another entity offers a challenge invite',color:'#F97316',emoji:'⚔️',def:true},
                    {l:'Session Reminders',d:'Timers on scheduled coding sprints & deadlines',color:'#3B82F6',emoji:'📅',def:true},
                    {l:'Mentor Help Responses',d:'Alerts when a certified mentor replies to a stuck trigger',color:'#8B5CF6',emoji:'🎓',def:true},
                    {l:'Leaderboard Updates',d:'XP ranking changes or level-up events',color:'#10B981',emoji:'🏆',def:false},
                  ].map((item,idx)=>{
                    const key = `notif_${item.l}`;
                    const stored = typeof window!=='undefined'?localStorage.getItem(key):null;
                    const isOn = stored!==null ? stored==='true' : item.def;
                    return (
                      <motion.div key={item.l} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:0.05+idx*0.05}}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-[var(--background)]/40 transition-colors">
                        <div className="flex items-center gap-4 font-mono">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base bg-[var(--background)] border border-[var(--ide-border)]">{item.emoji}</div>
                          <div><p className="text-sm font-bold text-[var(--text-secondary)]">{item.l}</p><p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{item.d}</p></div>
                        </div>
                        <button onClick={(e)=>{const newVal=!isOn;localStorage.setItem(key,String(newVal));(e.target as HTMLElement).closest('[data-notif]')?.setAttribute('data-on',String(newVal));window.location.reload();}}
                          data-notif data-on={String(isOn)}
                          className={`w-11 h-6 rounded-full cursor-pointer transition-all duration-300 flex items-center px-0.5 ${isOn?'justify-end':'justify-start'}`}
                          style={{background:isOn?item.color:'rgba(255,255,255,0.08)'}}>
                          <div className="w-5 h-5 bg-[var(--ide-bg)] rounded-full shadow-md transition-all"/>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab==='privacy' && (
              <motion.div key="priv" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.3}} className="max-w-4xl">
                <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-2"><span className="text-accent-pink mr-2">&gt;_</span>Privacy & Data</h2>
                <p className="text-sm text-[var(--text-secondary)] mb-8 font-mono">Extract registries, clear session queues, and manage platform safety.</p>
                
                <div className="bg-[var(--ide-header-bg)] border border-[var(--ide-border)] rounded-xl p-8 space-y-6 font-mono">
                  {/* Download Data */}
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.05}} className="pb-6 border-b border-[var(--ide-border)]">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--ide-border)] flex items-center justify-center text-lg flex-shrink-0">📥</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--text-secondary)] mb-1">DOWNLOAD_DATAFRAME</p>
                        <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">Extract a compiled text register representing total HP, streaks, active skills indices, and credentials.</p>
                        <button onClick={()=>{
                          const p = JSON.parse(localStorage.getItem('dateforcode_profile')||'{}');
                          const a = JSON.parse(localStorage.getItem('dateforcode_account')||'{}');
                          const lines = [
                            'DateForCode — User Data Report',`Generated: ${new Date().toLocaleString()}`,'',
                            '══ Profile ══',`Username: @${p.username||'N/A'}`,`Bio: ${p.bio||'N/A'}`,`Avatar: ${p.avatar||'N/A'}`,`Skills: ${(p.skills||[]).join(', ')||'None'}`,'',
                            '══ Account ══',`Full Name: ${a.fullName||'N/A'}`,`College: ${a.college||'N/A'}`,`Year: ${a.year||'N/A'}`,`Account Type: ${a.isPersonal?'Personal':'Business'}`,'',
                            '══ Stats ══',`HP Score: 0`,`Streak: 0 days`,`Matches: 0`,`Sessions: 0`,`Leaderboard Position: N/A`,'',
                            '══ Achievements ══','First Login: ✓','Profile Setup: ✓','',
                            '— End of Report —'
                          ];
                          const blob = new Blob([lines.join('\n')],{type:'text/plain'});
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a'); link.href=url; link.download='DateForCode_UserData.txt'; link.click();
                          URL.revokeObjectURL(url);
                        }} className="px-5 py-2.5 rounded bg-accent-blue text-[var(--text-primary)] text-[10px] font-bold uppercase tracking-wider shadow shadow-accent-blue/15 hover:opacity-95 transition-all flex items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" />Request Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                  {/* Clear History */}
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-500/5 dark:bg-[#1A0E0F] border border-red-500/20 dark:border-red-950 flex items-center justify-center text-lg flex-shrink-0">🗑️</div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-red-500 mb-1">RESET_SESSION_TELEMETRY</p>
                        <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">This resets all current achievements, matching logs, and streaks. Profile metadata is preserved. This operation is irreversible.</p>
                        <button onClick={()=>{
                          if(confirm('⚠️ Are you sure?\n\nThis will permanently clear:\n• HP Score → 0\n• Streaks → 0\n• Matches → 0\n• Sessions → 0\n• All coding activity history\n\nYour profile and account will remain. This cannot be undone.')){
                            localStorage.removeItem('dateforcode_stats');
                            alert('✓ Activity history cleared. All stats have been reset to 0.');
                          }
                        }} className="px-5 py-2.5 rounded border border-red-500/20 bg-[#1F0D0E] hover:border-red-500 text-red-500 text-[10px] font-bold uppercase tracking-wider transition-all">
                          Wipe Session Stats
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (<React.Suspense fallback={<div className="min-h-screen bg-[var(--ide-header-bg)] flex flex-col items-center justify-center font-mono text-xs text-[var(--text-secondary)] tracking-wider"><div className="w-6 h-6 border-2 border-accent-pink/20 border-t-accent-pink rounded-full animate-spin mb-3"/>PARSING SETTINGS TELEMETRY...</div>}><Content /></React.Suspense>);
}
