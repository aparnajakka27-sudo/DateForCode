"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Code, GraduationCap, UserCheck, Star, Sparkles, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

const fadeUp = (d=0) => ({ initial:{opacity:0,y:20}, animate:{opacity:1,y:0}, transition:{duration:0.6,delay:d,ease:[0.16,1,0.3,1] as const} });

const AVATARS = ['👨‍🏫','👩‍🏫','👨‍💻','👩‍💻','🧙‍♂️','🧙‍♀️','🧑‍🚀','🧑‍🔬'];
const SKILLS = ['JavaScript','Python','React','Node.js','C++','Java','System Design','SQL','AWS','Docker','Go','Next.js'];

export default function MentorProfileSetup() {
  const router = useRouter();

  React.useEffect(() => {
    if (localStorage.getItem('dateforcode_mentor_profile')) {
      router.push('/mentor/dashboard');
    }
  }, [router]);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [skillsKnown, setSkillsKnown] = useState<string[]>([]);
  const [skillsGuide, setSkillsGuide] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string, list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(skill)) setList(list.filter(s => s !== skill));
    else if (list.length < 5) setList([...list, skill]);
  };

  const finishSetup = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('dateforcode_mentor_profile', JSON.stringify({
        name, title, avatar, skillsKnown, skillsGuide, role: 'mentor', isSetupDone: true
      }));
      router.push('/mentor/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col relative overflow-hidden">
      {/* Background Aesthetics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.015) 1px, transparent 0)',backgroundSize:'32px 32px'}} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#A855F7]/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#06B6D4]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-8 py-6 border-b border-[var(--ide-border)] bg-[var(--panel-bg)] backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo showText={true} className="scale-[0.8] origin-left" />
          <div className="h-6 w-px bg-[var(--btn-sec-bg)]" />
          <span className="text-xs font-black uppercase tracking-widest text-[#FF4D6D]">Mentor Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-[var(--btn-sec-bg)] overflow-hidden">
            <motion.div animate={{width:`${(step/3)*100}%`}} className="h-full bg-[#A855F7] rounded-full"/>
          </div>
          <span className="text-[10px] font-bold text-[var(--text-secondary)]">STEP {step}/3</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex items-center justify-center p-8">
        <div className="max-w-xl w-full">
          {step === 1 && (
            <motion.div key="step1" {...fadeUp(0)} className="bg-[var(--ide-bg)] rounded-3xl border border-[var(--ide-border)] shadow-2xl p-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#D946EF] flex items-center justify-center text-white mb-6 shadow-xl" style={{boxShadow:'0 10px 30px rgba(168,85,247,0.2)'}}>
                <GraduationCap className="w-8 h-8"/>
              </div>
              <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Welcome, Mentor!</h1>
              <p className="text-sm text-[var(--text-muted)] mb-8">Let's set up your profile so students can find you for guidance.</p>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">Full Name</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="E.g. Dr. Priya Patel"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] focus:border-[#A855F7] focus:ring-4 focus:ring-[#A855F7]/10 outline-none text-sm font-bold text-[var(--text-primary)] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-2">Professional Title</label>
                  <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="E.g. Senior Software Engineer @ Google"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] focus:border-[#A855F7] focus:ring-4 focus:ring-[#A855F7]/10 outline-none text-sm font-bold text-[var(--text-primary)] transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-3">Choose Avatar</label>
                  <div className="flex gap-3">
                    {AVATARS.slice(0,6).map(a => (
                      <button key={a} onClick={()=>setAvatar(a)} className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center transition-all ${avatar===a?'bg-purple-50 border-2 border-purple-400 scale-110 shadow-lg':'bg-[var(--btn-sec-bg)] border border-[var(--ide-border)] hover:bg-black/[0.05]'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button disabled={!name || !title} onClick={()=>setStep(2)} className="w-full py-4 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                style={{background:'linear-gradient(135deg,#A855F7,#D946EF)'}}>
                Continue <ArrowRight className="w-4 h-4"/>
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" {...fadeUp(0)} className="bg-[var(--ide-bg)] rounded-3xl border border-[var(--ide-border)] shadow-2xl p-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#06B6D4] to-[#3B82F6] flex items-center justify-center text-white mb-6 shadow-xl" style={{boxShadow:'0 10px 30px rgba(6,182,212,0.2)'}}>
                <Code className="w-8 h-8"/>
              </div>
              <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">Your Tech Stack</h1>
              <p className="text-sm text-[var(--text-muted)] mb-8">What languages and frameworks are you proficient in? (Max 5)</p>

              <div className="flex flex-wrap gap-3 mb-10">
                {SKILLS.map(skill => {
                  const isSelected = skillsKnown.includes(skill);
                  return (
                    <button key={skill} onClick={()=>toggleSkill(skill, skillsKnown, setSkillsKnown)}
                      className={`px-5 py-3 rounded-xl text-xs font-bold transition-all border-2 ${isSelected?'bg-cyan-50 border-cyan-400 text-cyan-600 shadow-sm scale-105':'bg-[var(--ide-bg)] border-[var(--ide-border)] text-[var(--text-secondary)] hover:border-[var(--ide-border)] hover:text-[var(--text-primary)]'}`}>
                      {skill} {isSelected && <Check className="w-3 h-3 inline ml-1"/>}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4">
                <button onClick={()=>setStep(1)} className="px-6 py-4 rounded-xl border border-[var(--ide-border)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]">Back</button>
                <button disabled={skillsKnown.length===0} onClick={()=>setStep(3)} className="flex-1 py-4 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                  style={{background:'linear-gradient(135deg,#06B6D4,#3B82F6)'}}>
                  Next Step <ArrowRight className="w-4 h-4"/>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" {...fadeUp(0)} className="bg-[var(--ide-bg)] rounded-3xl border border-[var(--ide-border)] shadow-2xl p-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center text-white mb-6 shadow-xl" style={{boxShadow:'0 10px 30px rgba(16,185,129,0.2)'}}>
                <BookOpen className="w-8 h-8"/>
              </div>
              <h1 className="text-3xl font-black text-[var(--text-primary)] mb-2">What will you teach?</h1>
              <p className="text-sm text-[var(--text-muted)] mb-8">Select the specific areas you want to guide students in.</p>

              <div className="flex flex-wrap gap-3 mb-10">
                {skillsKnown.map(skill => {
                  const isSelected = skillsGuide.includes(skill);
                  return (
                    <button key={skill} onClick={()=>toggleSkill(skill, skillsGuide, setSkillsGuide)}
                      className={`px-5 py-3 rounded-xl text-xs font-bold transition-all border-2 ${isSelected?'bg-green-50 border-green-400 text-green-600 shadow-sm scale-105':'bg-[var(--ide-bg)] border-[var(--ide-border)] text-[var(--text-secondary)] hover:border-[var(--ide-border)] hover:text-[var(--text-primary)]'}`}>
                      {skill} {isSelected && <Check className="w-3 h-3 inline ml-1"/>}
                    </button>
                  );
                })}
                {skillsKnown.length === 0 && <p className="text-xs text-red-500 font-bold">Please go back and select known skills first.</p>}
              </div>

              <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl p-4 mb-8 flex items-start gap-3">
                <Star className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"/>
                <p className="text-xs text-green-800 font-bold leading-relaxed">Students will be able to request live 1-on-1 sessions, class interventions, and code reviews from you based on these selections.</p>
              </div>

              <div className="flex gap-4">
                <button onClick={()=>setStep(2)} className="px-6 py-4 rounded-xl border border-[var(--ide-border)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)]">Back</button>
                <button disabled={skillsGuide.length===0 || loading} onClick={finishSetup} className="flex-1 py-4 rounded-xl text-white text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl"
                  style={{background:'linear-gradient(135deg,#10B981,#34D399)'}}>
                  {loading ? <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:'linear'}} className="w-5 h-5 border-2 border-[var(--ide-bg)]/30 border-t-white rounded-full"/> : <><Sparkles className="w-4 h-4"/> Complete Setup</>}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
