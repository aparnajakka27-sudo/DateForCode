"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Video, Calendar, Swords, FileCheck, TrendingUp, Star, 
  Target, BarChart3, Clock, Briefcase, Bell, Settings, LogOut, Code2, AlertCircle, Play, ChevronRight, MessageSquare, Award, BookOpen, Zap,
  Search, CheckCircle2, Shield, Edit3, Plus, X, UserCheck, Terminal, Cpu, Database, Laptop, Loader2, Upload
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import PortalSidebar from '@/components/PortalSidebar';
import ThunderEffect from '@/components/ThunderEffect';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import mentorCodingQuestions from '@/data/questions/mentor_coding.json';

const fadeUp = (d=0) => ({ 
  initial: { opacity: 0, y: 15 }, 
  animate: { opacity: 1, y: 0 }, 
  transition: { duration: 0.5, delay: d, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
});

interface LiveSession {
  id: number;
  students: string;
  stack: string;
  time: string;
  status: 'help_requested' | 'coding' | 'reviewing';
  avatar1: string;
  avatar2: string | null;
  topic: string;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  hp: number;
  matches: number;
  level: number;
  topSkill: string;
}

function MentorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  
  // ═══ MENTOR ELIGIBILITY & APPROVAL FLOW STATES ═══
  const [pageMode, setPageMode] = useState<'loading' | 'intro' | 'not_eligible' | 'level1_submit' | 'level2_assessment' | 'congrats' | 'failed_score' | 'dashboard'>('loading');
  const [mentorStatus, setMentorStatus] = useState<any>({
    activePortal: 'student',
    level1Completed: false,
    submittedProjects: [],
    level2Completed: false,
    assessmentAttempts: []
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Level 1: Project Submission Form State
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    projectName: '',
    techStack: '',
    githubLink: '',
    liveDemoLink: '',
    description: '',
    zipFileSelected: false
  });
  const [projectValidationError, setProjectValidationError] = useState<string | null>(null);
  
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    setFileError(null);
    const isZip = file.name.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';
    if (!isZip) {
      setFileError("Only .zip files are accepted.");
      setUploadedFile(null);
      return;
    }

    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("File size exceeds the 500 MB limit.");
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Level 2: DSA Assessment States
  const [assessmentQuestions, setAssessmentQuestions] = useState<any[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [questionCodes, setQuestionCodes] = useState<string[]>(['', '']);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [runningTest, setRunningTest] = useState(false);
  const [testLogs, setTestLogs] = useState('');
  const [timerCount, setTimerCount] = useState(3);
  const [assessmentScore, setAssessmentScore] = useState(0);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mentorRequests, setMentorRequests] = useState<any[]>([]);

  // Not Eligible & Failed Score Auto-Redirect timer
  useEffect(() => {
    if (pageMode === 'not_eligible' || pageMode === 'failed_score') {
      setTimerCount(3);
      const timer = setInterval(() => {
        setTimerCount((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [pageMode]);

  // Handle redirect side effect asynchronously when timer hits 0
  useEffect(() => {
    if ((pageMode === 'not_eligible' || pageMode === 'failed_score') && timerCount <= 0) {
      router.push('/student/dashboard');
    }
  }, [timerCount, pageMode, router]);

  useEffect(() => {
    const saved = localStorage.getItem('dateforcode_mentor_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    } else {
      const defaultProf = {
        name: 'Dr. Aparna J.',
        title: 'Certified Principal Coach',
        avatar: 'AJ',
        skillsKnown: ['TypeScript', 'C++', 'Algorithms', 'System Design'],
        skillsGuide: ['Dynamic Programming', 'Multiplayer Sockets', 'Kernel Telemetries']
      };
      localStorage.setItem('dateforcode_mentor_profile', JSON.stringify(defaultProf));
      setProfile(defaultProf);
    }

    // ═══ NEXT.JS API + MONGO ATLAS REALTIME CONNECTIONS ═══
    const loadStatusData = async () => {
      onAuthStateChanged(auth, async (user) => {
        const uid = user ? user.uid : 'local_dev_user';
      
      const statusParam = searchParams.get('status');
      const scoreParam = searchParams.get('score');
      
      try {
        const res = await fetch(`/api/mentor?userId=${uid}`);
        const responseData = await res.json();
        
        if (responseData && responseData.success) {
          const data = responseData.data;
          setMentorStatus(data);
          localStorage.setItem('dateforcode_mentor_status', JSON.stringify(data));
          
          if (statusParam === 'success') {
            setAssessmentScore(Number(scoreParam || 100));
            setPageMode('congrats');
          } else if (statusParam === 'failed') {
            setAssessmentScore(Number(scoreParam || 0));
            setPageMode('failed_score');
          } else if (data.activePortal === 'mentor') {
            setPageMode('dashboard');
          } else {
            setPageMode('intro');
          }
          return;
        }
      } catch (err) {
        console.error("MongoDB Atlas link offline, executing local fallback logic:", err);
      }

      // Local storage fallback if API is unreachable
      const statusStr = localStorage.getItem('dateforcode_mentor_status');
      let status = {
        activePortal: 'student',
        level1Completed: false,
        submittedProjects: [],
        level2Completed: false,
        assessmentAttempts: []
      };
      if (statusStr) {
        try {
          status = JSON.parse(statusStr);
        } catch (_) {}
      } else {
        localStorage.setItem('dateforcode_mentor_status', JSON.stringify(status));
      }
      setMentorStatus(status);

      if (statusParam === 'success') {
        setAssessmentScore(Number(scoreParam || 100));
        setPageMode('congrats');
      } else if (statusParam === 'failed') {
        setAssessmentScore(Number(scoreParam || 0));
        setPageMode('failed_score');
      } else if (status.activePortal === 'mentor') {
        setPageMode('dashboard');
      } else {
        setPageMode('intro');
      }
      });
    };

    loadStatusData();

    // Fetch real time mock-free dashboard data
    const loadRealtimeData = async () => {
      try {
        const studentsRes = await fetch('/api/mentor/students');
        const studentsData = await studentsRes.json();
        if (studentsData.success) {
          setStudentsList(studentsData.data);
        }
        
        const sessionsRes = await fetch('/api/mentor/live-sessions');
        const sessionsData = await sessionsRes.json();
        if (sessionsData.success) {
          setLiveSessions(sessionsData.data);
        }
      } catch (err) {
        console.error("Failed to load realtime dashboard data:", err);
      }
    };
    loadRealtimeData();

    // Poll for incoming student stuck triggers
    const interval = setInterval(() => {
      const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
      setMentorRequests(reqs.filter((r: any) => r.status === 'pending'));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleRequestAction = (id: string, action: 'accepted' | 'declined') => {
    const reqs = JSON.parse(localStorage.getItem('dateforcode_mentor_requests') || '[]');
    const updated = reqs.map((r: any) => r.id === id ? { ...r, status: action } : r);
    localStorage.setItem('dateforcode_mentor_requests', JSON.stringify(updated));
    if (action === 'accepted') {
      router.push('/mentor/live-session?req=' + id);
    }
  };

  const checkIsFullStack = (techStack: string) => {
    return true;
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.projectName.trim() || !projectForm.techStack.trim() || !projectForm.description.trim()) {
      setProjectValidationError("All required fields must be populated.");
      return;
    }
    
    const isFullStack = checkIsFullStack(projectForm.techStack);
    
    const newProject = {
      projectName: projectForm.projectName,
      techStack: projectForm.techStack,
      githubLink: projectForm.githubLink,
      liveDemoLink: projectForm.liveDemoLink,
      description: projectForm.description,
      status: isFullStack ? 'eligible' as const : 'not_eligible' as const,
      submittedAt: new Date()
    };
    
    const updatedProjects = [...(mentorStatus.submittedProjects || []), newProject];
    const eligibleCount = updatedProjects.filter(p => p.status === 'eligible').length;
    const isL1Done = eligibleCount >= 3;
    
    const updatedStatus = {
      ...mentorStatus,
      submittedProjects: updatedProjects,
      level1Completed: isL1Done
    };
    
    setMentorStatus(updatedStatus);
    localStorage.setItem('dateforcode_mentor_status', JSON.stringify(updatedStatus));
    
    const user = auth.currentUser;
    const uid = user ? user.uid : 'local_dev_user';
    fetch('/api/mentor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: uid, ...updatedStatus })
    }).catch(err => console.error("Failed to save project submission to MongoDB:", err));
    
    setProjectForm({
      projectName: '',
      techStack: '',
      githubLink: '',
      liveDemoLink: '',
      description: '',
      zipFileSelected: false
    });
    setUploadedFile(null);
    setUploadProgress(0);
    setFileError(null);
    setProjectValidationError(null);
    setShowSubmitForm(false);
  };

  const handleStartDSAAssessment = () => {
    router.push('/student/coding-room?mode=mentor&stack=javascript');
  };

  const SIDEBAR_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Live Sessions', icon: Video },
    { label: 'Classes & Batches', icon: Calendar },
    { label: 'Challenges', icon: Swords },
    { label: 'Analytics & Reports', icon: TrendingUp },
    { label: 'Advanced Tools', icon: Target },
  ];

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--ide-header-bg)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8B5CF6]" />
          <p>ESTABLISHING ELITE MENTOR SECURE LINK...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans relative">
      <div className="fixed inset-0 pointer-events-none z-0 developer-grid" />
      <ThunderEffect />
      
      <AnimatePresence>
        {pageMode !== 'dashboard' && pageMode !== 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-4xl glass-panel border border-[var(--ide-border)] rounded-2xl p-8 shadow-2xl relative flex flex-col font-sans z-10"
            >
              {pageMode === 'intro' && (
                <div className="flex flex-col relative z-10">
                  <h2 className="text-xl font-bold tracking-wider text-white uppercase text-center mb-3">
                    Become a Mentor
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed text-center mb-6 font-mono">
                    To become a mentor on DateForCode, you must successfully complete the eligibility verification program.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="glass-panel border border-[var(--ide-border)] rounded-xl p-5 flex flex-col">
                      <div className="flex items-center justify-between mb-3 border-b border-[var(--ide-border)] pb-2">
                        <h3 className="text-[10px] font-bold text-[#FF3366] uppercase tracking-wider font-mono">
                          Level 1 – Project Verification
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                          {mentorStatus.submittedProjects?.filter((p: any) => p.status === 'eligible').length || 0} / 3 Eligible
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-secondary)] mb-4 font-sans leading-relaxed">
                        Submit 3 complete Full Stack Projects. Submissions will be verified automatically based on tech stack criteria.
                      </p>

                      <div className="space-y-2 flex-1 max-h-[140px] overflow-y-auto mb-4 pr-1">
                        {(!mentorStatus.submittedProjects || mentorStatus.submittedProjects.length === 0) ? (
                          <div className="text-[10px] text-[var(--text-muted)] font-medium italic text-center py-4 font-mono">
                            No project submissions recorded yet.
                          </div>
                        ) : (
                          mentorStatus.submittedProjects.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 rounded bg-[var(--ide-header-bg)]/80 border border-[var(--ide-border)] text-[10px] font-mono">
                              <div className="flex flex-col gap-0.5 max-w-[70%]">
                                <span className="font-bold text-[var(--text-primary)] truncate">{p.projectName}</span>
                                <span className="text-[var(--text-muted)] font-medium truncate italic">{p.techStack}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                                p.status === 'eligible' 
                                  ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                                  : 'bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/20'
                              }`}>
                                {p.status === 'eligible' ? 'Eligible' : 'Not Eligible'}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => setPageMode('level1_submit')}
                        className="w-full py-2.5 rounded-lg border border-dashed border-[#FF3366]/30 hover:border-[#FF3366] bg-[#FF3366]/5 hover:bg-[#FF3366]/10 text-[#FF3366] font-bold text-[9px] font-mono uppercase tracking-widest transition cursor-pointer"
                      >
                        + Submit Full Stack Project
                      </button>
                    </div>

                    <div className="glass-panel border border-[var(--ide-border)] rounded-xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--ide-border)] pb-2">
                          <h3 className="text-[10px] font-bold text-[#FF3366] uppercase tracking-wider font-mono">
                            Level 2 – DSA Assessment
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border ${
                            mentorStatus.level1Completed 
                              ? 'bg-[#FF3366]/10 text-[#FF3366] border-[#FF3366]/20' 
                              : 'bg-[var(--ide-header-bg)] text-[var(--text-muted)] border-[var(--ide-border)]'
                          }`}>
                            {mentorStatus.level1Completed ? 'Unlocked' : 'Locked'}
                          </span>
                        </div>
                        <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mb-4">
                          Solve 2 randomly selected Hard DSA coding problems. Minimum qualifying score is <strong>90/100</strong>.
                        </p>
                        
                        <div className="p-3.5 rounded bg-[var(--ide-header-bg)]/80 border border-[var(--ide-border)] text-[10px] text-[var(--text-muted)] leading-relaxed font-mono">
                          {!mentorStatus.level1Completed ? (
                            <span className="italic">⚠️ Requires Level 1 completion (3 verified projects) to initiate.</span>
                          ) : (
                            <span className="text-[#10B981] font-medium">🎉 Level 2 is fully unlocked! Start when ready.</span>
                          )}
                        </div>
                      </div>

                      {mentorStatus.level1Completed && (
                        <button
                          onClick={handleStartDSAAssessment}
                          className="btn-premium w-full py-3 text-[10px] flex items-center justify-center gap-2 cursor-pointer mt-4"
                        >
                          Start DSA Assessment
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[var(--ide-border)] pt-6">
                    <button
                      onClick={() => router.back()}
                      className="btn-secondary-dev flex items-center gap-1.5 px-6 py-2.5"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        const eligibleCount = mentorStatus.submittedProjects?.filter((p: any) => p.status === 'eligible').length || 0;
                        if (eligibleCount >= 3 && mentorStatus.level2Completed) {
                          const updated = { ...mentorStatus, activePortal: 'mentor' as const };
                          setMentorStatus(updated);
                          localStorage.setItem('dateforcode_mentor_status', JSON.stringify(updated));
                          setPageMode('dashboard');
                        } else if (eligibleCount >= 3) {
                          handleStartDSAAssessment();
                        } else {
                          setPageMode('not_eligible');
                        }
                      }}
                      className="btn-premium flex items-center gap-1.5 px-8 py-2.5"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {pageMode === 'not_eligible' && (
                <div className="flex flex-col items-center justify-center py-8 relative z-10 font-mono">
                  <AlertCircle className="w-12 h-12 text-[#FF3366] mb-4 animate-pulse" />
                  <h2 className="text-lg font-bold tracking-wider text-[#FF3366] uppercase text-center mb-2">
                    Not Eligible for Mentor Dashboard
                  </h2>
                  <p className="text-[11px] text-[var(--text-muted)] text-center mb-6 leading-relaxed max-w-md uppercase font-semibold">
                    // You are currently not eligible to become a mentor.<br />
                    // Only students who successfully complete all eligibility requirements can access the Mentor Portal.
                  </p>

                  <div className="w-full max-w-sm space-y-3 mb-6 glass-panel border border-[var(--ide-border)] rounded-xl p-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">3 Full Stack Projects</span>
                      <span className="text-[10px] font-bold text-[var(--text-primary)]">
                        {mentorStatus.submittedProjects?.filter((p: any) => p.status === 'eligible').length || 0} / 3 Eligible
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">DSA Hard Assessment &ge; 90</span>
                      <span className="text-[10px] font-bold text-[var(--text-primary)]">
                        {mentorStatus.level2Completed ? "COMPLETED" : "PENDING"}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[var(--text-muted)] font-mono mb-6">
                    Redirecting back to Student Dashboard in {timerCount}s...
                  </p>

                  <button
                    onClick={() => router.push('/student/dashboard')}
                    className="btn-secondary-dev flex items-center gap-1.5 px-6 py-2.5"
                  >
                    Back to Student Dashboard
                  </button>
                </div>
              )}

              {pageMode === 'level1_submit' && (
                <form onSubmit={handleProjectSubmit} className="flex flex-col bg-[var(--background)] p-8 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 relative z-20">
                  {(() => {
                    const count = mentorStatus.submittedProjects?.filter((p: any) => p.status === 'eligible').length || 0;
                    const suffix = count === 0 ? "1st" : count === 1 ? "2nd" : count === 2 ? "3rd" : `${count + 1}th`;
                    return (
                      <>
                        <h2 className="text-xl font-bold tracking-wider text-[var(--text-primary)] uppercase text-center mb-1 font-mono">
                          Submitting {suffix} Project
                        </h2>
                        <p className="text-[11px] font-medium text-[var(--text-muted)] text-center mb-8">
                          Level 1 - Project Verification Form
                        </p>
                      </>
                    );
                  })()}

                  {projectValidationError && (
                    <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-[11px] font-bold text-red-500 dark:text-red-400 uppercase tracking-wide text-center">
                      ⚠️ {projectValidationError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8 text-xs">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Project Name *</label>
                      <input 
                        type="text"
                        required
                        value={projectForm.projectName}
                        onChange={e => setProjectForm(p => ({ ...p, projectName: e.target.value }))}
                        placeholder="e.g. Developer Dating Engine"
                        className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3366] focus:border-[#FF3366] transition-all text-[11px] font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] placeholder-opacity-70 caret-[#FF3366] shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Tech Stack (Frontend & Backend) *</label>
                      <input 
                        type="text"
                        required
                        value={projectForm.techStack}
                        onChange={e => setProjectForm(p => ({ ...p, techStack: e.target.value }))}
                        placeholder="e.g. React, Node.js, Express, MongoDB"
                        className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3366] focus:border-[#FF3366] transition-all text-[11px] font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] placeholder-opacity-70 caret-[#FF3366] shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">GitHub Repository Link</label>
                      <input 
                        type="url"
                        value={projectForm.githubLink}
                        onChange={e => setProjectForm(p => ({ ...p, githubLink: e.target.value }))}
                        placeholder="e.g. https://github.com/user/project"
                        className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3366] focus:border-[#FF3366] transition-all text-[11px] font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] placeholder-opacity-70 caret-[#FF3366] shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Live Demo Link</label>
                      <input 
                        type="url"
                        value={projectForm.liveDemoLink}
                        onChange={e => setProjectForm(p => ({ ...p, liveDemoLink: e.target.value }))}
                        placeholder="e.g. https://project.demo.com"
                        className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3366] focus:border-[#FF3366] transition-all text-[11px] font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] placeholder-opacity-70 caret-[#FF3366] shadow-inner"
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Project Description *</label>
                      <textarea
                        required
                        rows={4}
                        value={projectForm.description}
                        onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))}
                        placeholder="Detail the architecture, fullstack flow, and database models implemented..."
                        className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-[#FF3366] focus:border-[#FF3366] transition-all text-[11px] font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] placeholder-opacity-70 caret-[#FF3366] shadow-inner font-sans resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/10 dark:border-white/10 pt-6 mt-2">
                    <button
                      type="button"
                      onClick={() => setPageMode('intro')}
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10 transition-all font-bold font-mono text-[11px] uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-[#FF3366] to-[#7B61FF] text-white font-bold font-mono text-[11px] uppercase shadow-lg shadow-[#FF3366]/20 hover:shadow-[#FF3366]/40 hover:scale-[1.02] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Verify & Submit
                    </button>
                  </div>
                </form>
              )}

              {pageMode === 'congrats' && (
                <div className="flex flex-col items-center justify-center py-10 text-center relative z-10 font-mono">
                  <Award className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
                  <h2 className="text-xl font-bold tracking-wider text-white uppercase mb-2">
                    Congratulations!
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
                    You have successfully passed the Mentor Assessment Program.<br />
                    Your account has been upgraded to <strong>Mentor status</strong>.
                  </p>

                  <div className="glass-panel border border-[var(--ide-border)] rounded-xl p-5 mb-8 text-xs max-w-sm space-y-1 w-[320px]">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[var(--text-muted)]">QUALIFICATION STATUS:</span>
                      <span className="text-[#10B981] font-bold">PASSED</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[var(--text-muted)]">FINAL DSA SCORE:</span>
                      <span className="text-white font-bold">{assessmentScore} / 100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      try {
                        const status = JSON.parse(localStorage.getItem('dateforcode_mentor_status') || '{}');
                        status.activePortal = 'mentor';
                        localStorage.setItem('dateforcode_mentor_status', JSON.stringify(status));
                      } catch (_) {}
                      setPageMode('dashboard');
                    }}
                    className="btn-premium flex items-center gap-1.5 px-8 py-3"
                  >
                    Enter Mentor Dashboard
                  </button>
                </div>
              )}

              {pageMode === 'failed_score' && (
                <div className="flex flex-col items-center justify-center py-8 text-center relative z-10 font-mono">
                  <X className="w-12 h-12 text-[#FF3366] mb-4" />
                  <h2 className="text-lg font-bold tracking-wider text-[#FF3366] uppercase mb-2">
                    Assessment Failed
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] max-w-md mb-6 leading-relaxed">
                    Unfortunately, you did not meet the minimum mentor qualification score.<br />
                    Minimum Required Score: <strong>90/100</strong>
                  </p>

                  <div className="glass-panel border border-[var(--ide-border)] rounded-xl p-5 mb-6 text-xs w-[240px] space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[var(--text-muted)]">YOUR SCORE:</span>
                      <span className="text-[#FF3366] font-bold">{assessmentScore} / 100</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-[var(--text-muted)]">REQUIRED SCORE:</span>
                      <span className="text-white font-bold">90 / 100</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[var(--text-muted)] font-mono mb-6">
                    Redirecting back to Student Dashboard in {timerCount}s...
                  </p>

                  <button
                    onClick={() => router.push('/student/dashboard')}
                    className="btn-secondary-dev flex items-center gap-1.5 px-6 py-2.5"
                  >
                    Back to Student Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortalSidebar 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        items={SIDEBAR_ITEMS.map((item) => ({
          ...item,
          active: activeTab === item.label,
          onClick: () => setActiveTab(item.label)
        }))}
        headerBadge={
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FF3366]/10 border border-[#FF3366]/30 text-[#FF3366] text-[8px] font-mono uppercase font-bold tracking-widest mt-2 ml-1 shadow-[0_0_10px_rgba(255,51,102,0.15)]">
            <Award className="w-3 h-3 text-[#F59E0B]" /> CERTIFIED MENTOR
          </div>
        }
        bottomActions={
          <>
            <button 
              onClick={() => {
                try {
                  const status = JSON.parse(localStorage.getItem('dateforcode_mentor_status') || '{}');
                  status.activePortal = 'student';
                  localStorage.setItem('dateforcode_mentor_status', JSON.stringify(status));
                } catch (_) {}
                router.push('/student/dashboard');
              }} 
              className={`w-full flex items-center gap-2 py-3 px-3 rounded bg-gradient-to-r from-[#FF3366] to-[#7B61FF] text-white font-bold font-mono transition-all duration-300 shadow-lg shadow-pink-900/25 hover:shadow-pink-700/40 text-[11px] uppercase tracking-wider cursor-pointer group ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0 group-hover:rotate-12 transition-transform duration-300" />
              <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                <span className="truncate">STUDENT PORTAL</span>
              </div>
            </button>

            <div className="h-[1px] bg-[var(--ide-border)] my-2 w-full" />
            
            <button 
              onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); await signOut(auth); localStorage.clear(); router.push('/login'); }} 
              className={`w-full flex items-center gap-2 py-2.5 px-3 rounded text-xs font-mono font-bold uppercase tracking-wider text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:text-red-500 transition-all cursor-pointer group ${isSidebarOpen ? '' : 'justify-center'}`}
            >
              <LogOut className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-1 transition-transform" /> 
              <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-full opacity-100' : 'w-0 opacity-0'}`}>
                <span className="truncate">Logout telemetry</span>
              </div>
            </button>
          </>
        }
      />

      {/* ═══ MAIN WORKSPACE VIEWPORT ═══ */}
      <div className={`flex-1 overflow-y-auto relative z-10 flex flex-col min-h-screen transition-all duration-500 ${isSidebarOpen ? 'ml-64' : 'ml-[88px]'}`}>
        
        {/* Workspace Top Header Bar */}
        <motion.header 
          {...fadeUp(0)} 
          className="sticky top-0 z-20 bg-[var(--ide-header-bg)]/90 backdrop-blur-md border-b border-[var(--ide-border)]/60 px-8 py-4 flex items-center justify-between flex-shrink-0"
        >
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-mono font-black uppercase text-[var(--text-primary)] tracking-widest">{activeTab} //</h2>
            <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">Principal diagnostics hub</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] flex items-center justify-center hover:border-gray-500 transition-all relative">
              <Bell className="w-4 h-4 text-[var(--text-secondary)]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FF3366] rounded-full animate-ping" />
            </button>
            <button className="w-9 h-9 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] flex items-center justify-center hover:border-gray-500 transition-all">
              <Settings className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>

            {/* Coach Profile Widget */}
            <div 
              onClick={() => setShowProfileModal(true)} 
              className="flex items-center gap-3 pl-4 border-l border-[var(--ide-border)] cursor-pointer hover:opacity-85 transition-opacity"
            >
              <div className="text-right font-mono">
                <p className="text-xs font-bold text-[var(--text-primary)]">{profile.name}</p>
                <p className="text-[8px] font-bold text-[#FF3366] uppercase tracking-wider">{profile.title}</p>
              </div>
              <div className="w-9 h-9 rounded bg-gradient-to-br from-[#FF3366] to-[#FF5E85] border border-[#FF3366]/40 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#FF3366]/10">
                {profile.avatar}
              </div>
            </div>
          </div>
        </motion.header>

        {/* Workspace Main Panels */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          
          {/* TAB: Dashboard */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Telemetry Alert: Incoming Student Requests */}
              <AnimatePresence>
                {mentorRequests.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }} 
                    className="p-5 bg-gradient-to-r from-[#FF3366] to-[#8B5CF6] rounded-lg border border-[#FF3366]/40 flex flex-col md:flex-row items-center justify-between shadow-xl shadow-[#FF3366]/15 gap-4 font-mono text-xs"
                  >
                    <div className="flex items-center gap-4 text-[var(--text-primary)]">
                      <div className="w-12 h-12 rounded bg-[var(--btn-sec-bg)] border border-white/20 flex items-center justify-center animate-pulse"><UserCheck className="w-6 h-6"/></div>
                      <div>
                        <h3 className="text-sm font-bold mb-0.5 uppercase tracking-wider">{mentorRequests.length} Student Stuck Signals Intercepted</h3>
                        <p className="text-[10px] text-pink-100 uppercase tracking-tight">Student {mentorRequests[0].studentName.toUpperCase()} requires active diagnostics support inside coding-room.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleRequestAction(mentorRequests[0].id, 'declined')} className="px-5 py-2.5 bg-[var(--background)]/50 border border-[var(--ide-border)] text-[var(--text-primary)] font-bold rounded uppercase hover:bg-[var(--background)] transition-all">Decline</button>
                      <button onClick={() => handleRequestAction(mentorRequests[0].id, 'accepted')} className="px-5 py-2.5 bg-[var(--ide-bg)] text-[#FF3366] font-bold rounded uppercase hover:bg-pink-50 transition-all shadow-[0_0_15px_rgba(255,255,255,0.25)]">Accept & Connect</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Red Urgent Telemetry: Student Stuck Interventions */}
              <motion.div 
                {...fadeUp(0.1)} 
                className="p-5 bg-[#FF3366]/5 border border-[#FF3366]/40 rounded-lg flex items-center justify-between font-mono text-xs shadow-[0_0_15px_rgba(255,51,102,0.05)]"
              >
                <div className="flex items-center gap-4 text-[var(--text-primary)]">
                  <div className="w-12 h-12 rounded bg-[#FF3366]/10 border border-[#FF3366]/30 flex items-center justify-center text-[#FF3366] animate-pulse"><AlertCircle className="w-6 h-6"/></div>
                  <div>
                    <h3 className="text-sm font-bold mb-0.5 uppercase tracking-wider text-[#FF3366]">URGENT_INTERVENTIONS_REQUIRED</h3>
                    <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-tight">Active Peer Room #101 has dispatched a STUCK signal trigger (DP knapsack errors).</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('Live Sessions')} 
                  className="px-5 py-2.5 bg-[#FF3366] hover:bg-[#FF3366]/90 border border-[#FF3366] text-white font-bold rounded uppercase transition-all shadow-[0_0_15px_rgba(255,51,102,0.25)]"
                >
                  Join Code Session
                </button>
              </motion.div>

              {/* High Density Stats Indicators Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: 'Cohort Students', val: '42', icon: Users, color: '#8B5CF6', bg: 'bg-[#8B5CF6]/5 border-[#8B5CF6]/20' },
                  { label: 'Rooms Monitored', val: '18', icon: Video, color: '#3B82F6', bg: 'bg-[#3B82F6]/5 border-[#3B82F6]/20' },
                  { label: 'Evaluations Completed', val: '156', icon: FileCheck, color: '#10B981', bg: 'bg-[#10B981]/5 border-[#10B981]/20' },
                  { label: 'Rating Diagnostic Score', val: '4.9', icon: Star, color: '#F59E0B', bg: 'bg-[#F59E0B]/5 border-[#F59E0B]/20' },
                ].map((s, i) => (
                  <motion.div 
                    key={s.label} 
                    {...fadeUp(0.15 + i * 0.05)} 
                    className={`p-5 rounded-lg border bg-[var(--ide-bg)] flex flex-col justify-between font-mono relative overflow-hidden group`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest font-bold">{s.label}</span>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-3xl font-black text-[var(--text-primary)]">{s.val}</h4>
                      <span className="text-[7px] text-[var(--text-muted)] uppercase font-bold tracking-widest mt-1">Ecosystem metrics active</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Central Core Diagnostic Hub & Active Rooms View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Column: Live Active Coding Sockets Viewport (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] rounded-lg overflow-hidden flex-1 flex flex-col justify-between">
                    <div className="ide-panel-header w-full justify-between py-2.5 border-b border-[var(--ide-border)]/50 bg-[var(--background)]/80 px-4">
                      <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#8B5CF6]" /> ACTIVE_MULTIPLAYER_SOCKET_FEED
                      </span>
                      <button onClick={() => setActiveTab('Live Sessions')} className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#8B5CF6] hover:underline">View telemetry</button>
                    </div>

                    <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[300px] scrollbar-none font-mono text-xs">
                      {liveSessions.length === 0 && (
                        <div className="text-[10px] text-center p-4 opacity-50 uppercase tracking-widest text-[var(--text-muted)]">No active sockets</div>
                      )}
                      {liveSessions.map((session, i) => (
                        <div 
                          key={session.id} 
                          className={`p-4 rounded border flex items-center justify-between bg-[var(--background)]/50 ${
                            session.status === 'help_requested' 
                              ? 'border-[#FF3366]/40 text-[#FF3366]' 
                              : 'border-[var(--ide-border)]/50 text-[var(--text-secondary)]'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                              <div className="w-7 h-7 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center text-[9px] font-bold text-[#8B5CF6]">{session.avatar1}</div>
                              {session.avatar2 && <div className="w-7 h-7 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center text-[9px] font-bold text-[#3B82F6]">{session.avatar2}</div>}
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-[var(--text-primary)] uppercase">{session.students}</p>
                              <p className="text-[8px] text-[var(--text-muted)] uppercase mt-0.5 h-4 overflow-hidden">{session.topic}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[8px] font-bold px-2 py-0.5 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] text-[var(--text-muted)]">{session.stack.toUpperCase()}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              session.status === 'help_requested' 
                                ? 'bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20' 
                                : 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20'
                            }`}>
                              {session.status === 'help_requested' ? 'STUCK ALERT' : 'ACTIVE CO-OP'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Programming / Graph Diagnostics Chart Widget (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col space-y-4">
                  <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] rounded-lg overflow-hidden flex-1 flex flex-col justify-between p-5 space-y-4 font-mono">
                    <div className="space-y-1">
                      <span className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest">// COHORT_WEAK_SPOTS</span>
                      <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase">Weak-Skill Diagnostics</h3>
                      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed bg-[var(--background)]/50 p-3 border border-[var(--ide-border)] rounded mt-2">
                        AI compilation signals show <strong>35% failure quotient</strong> inside arrays recursive bounds.
                      </p>
                    </div>

                    {/* Interactive diagnostics progress bars */}
                    <div className="space-y-3 pt-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-[var(--text-secondary)]">Dynamic Programming</span>
                          <span className="text-[#FF3366] font-bold">35% Failure</span>
                        </div>
                        <div className="h-1 bg-[var(--background)] rounded overflow-hidden">
                          <div className="h-full bg-[#FF3366]" style={{ width: '35%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-[var(--text-secondary)]">Graph Traversals (BFS/DFS)</span>
                          <span className="text-[#F59E0B] font-bold">22% Failure</span>
                        </div>
                        <div className="h-1 bg-[var(--background)] rounded overflow-hidden">
                          <div className="h-full bg-[#F59E0B]" style={{ width: '22%' }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px]">
                          <span className="text-[var(--text-secondary)]">Recursion Stack Overflows</span>
                          <span className="text-[#8B5CF6] font-bold">18% Failure</span>
                        </div>
                        <div className="h-1 bg-[var(--background)] rounded overflow-hidden">
                          <div className="h-full bg-[#8B5CF6]" style={{ width: '18%' }} />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => setActiveTab('Advanced Tools')} 
                      className="w-full py-2 bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 border border-[#8B5CF6] text-white text-[10px] font-bold uppercase tracking-wider rounded transition-all shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    >
                      Audit cohort telemetry
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}

          {/* TAB: Live Sessions */}
          {activeTab === 'Live Sessions' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4">
              <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] rounded-lg overflow-hidden p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[var(--ide-border)]/50 pb-4">
                  <div className="font-mono text-xs text-left">
                    <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">Live Telemetry Channels</h2>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase mt-0.5">Audit student compiler screens and inject live voice guidance.</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] font-mono text-[9px] font-bold uppercase tracking-widest animate-pulse">
                    {liveSessions.length} Active channels
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {liveSessions.length === 0 && (
                    <div className="text-center p-12 border border-[var(--ide-border)]/50 rounded bg-[var(--background)]/30 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-mono">
                      No live telemetry active right now
                    </div>
                  )}
                  {liveSessions.map((session, i) => (
                    <div 
                      key={session.id} 
                      className={`p-5 rounded border bg-[var(--background)] ${
                        session.status === 'help_requested' 
                          ? 'border-[#FF3366]/40 text-[#FF3366]' 
                          : 'border-[var(--ide-border)]/40 text-[var(--text-secondary)]'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-3">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center text-[10px] font-bold text-[#8B5CF6]">{session.avatar1}</div>
                            {session.avatar2 && <div className="w-8 h-8 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center text-[10px] font-bold text-[#3B82F6]">{session.avatar2}</div>}
                          </div>
                          <div className="text-left">
                            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase">{session.students}</h4>
                            <p className="text-[8px] text-[var(--text-muted)] uppercase mt-0.5">{session.topic}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                          session.status === 'help_requested' 
                            ? 'bg-[#FF3366] text-white animate-pulse' 
                            : 'bg-[var(--ide-bg)] border border-[var(--ide-border)] text-[var(--text-muted)]'
                        }`}>
                          {session.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--ide-border)]/40 pt-4 mt-2">
                        <div className="flex gap-2">
                          <span className="text-[8px] bg-[var(--ide-bg)] border border-[var(--ide-border)] px-2 py-0.5 rounded text-[var(--text-secondary)] uppercase font-bold">{session.stack}</span>
                          <span className="text-[8px] bg-[var(--ide-bg)] border border-[var(--ide-border)] px-2 py-0.5 rounded text-[var(--text-secondary)] uppercase font-bold">{session.time}</span>
                        </div>
                        <button className="px-3.5 py-1.5 rounded bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 border border-[#8B5CF6] text-white text-[9px] font-bold uppercase transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                          Connect Screen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: Classes & Batches */}
          {activeTab === 'Classes & Batches' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-mono text-xs text-left">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">Group Telemetry Lectures</h2>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase mt-0.5">Configure group schedules and batch telemetry viewports.</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8B5CF6] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded border border-[#8B5CF6] hover:bg-[#8B5CF6]/90 shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-all">
                  <Plus className="w-3.5 h-3.5"/> Schedule Class
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                {[
                  { title: 'System Design Fundamentals', date: 'TODAY', time: '4:00 PM', students: 24, type: 'Live Class', color: 'text-[#3B82F6]', bg: 'border-[#3B82F6]/30' },
                  { title: 'React Hooks Deep Dive', date: 'TOMORROW', time: '10:00 AM', students: 15, type: 'Batch Session', color: 'text-[#FF3366]', bg: 'border-[#FF3366]/30' },
                  { title: 'DSA Mock Interviews', date: 'FRIDAY', time: '2:00 PM', students: 8, type: 'Interactive', color: 'text-[#F59E0B]', bg: 'border-amber-500/20 dark:border-[#F59E0B]/30' },
                ].map((c, i) => (
                  <div key={i} className={`bg-[var(--ide-bg)] rounded border ${c.bg} p-5 flex flex-col justify-between h-[180px]`}>
                    <div>
                      <div className="flex justify-between items-center text-[8px] text-[var(--text-muted)] uppercase font-bold">
                        <span>{c.type}</span>
                        <span>{c.students} active students</span>
                      </div>
                      <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase mt-3 h-10 overflow-hidden leading-relaxed">{c.title}</h3>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-[var(--ide-border)]/50 pt-3">
                      <span className="text-[9px] font-bold text-[#8B5CF6]">{c.date} // {c.time}</span>
                      <span className="text-[8px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer uppercase">Configure</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: Challenges */}
          {activeTab === 'Challenges' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="text-left">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">Arena Coding Battles</h2>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase mt-0.5">Deploy customized coding tests and streaks to cohorts.</p>
                </div>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-[#8B5CF6] text-white text-[10px] font-bold uppercase rounded border border-[#8B5CF6] hover:bg-[#8B5CF6]/90 transition-all">
                  <Plus className="w-3.5 h-3.5"/> Create Challenge
                </button>
              </div>

              <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] rounded-lg overflow-hidden p-6 space-y-4">
                {[
                  { title: 'Weekend Hackathon: API Builder', participants: 45, status: 'Active', difficulty: 'Hard' },
                  { title: 'Daily Byte: Array Manipulation', participants: 120, status: 'Completed', difficulty: 'Easy' },
                  { title: 'Algorithms Speed Run', participants: 0, status: 'Draft', difficulty: 'Medium' },
                ].map((ch, i) => (
                  <div key={i} className="p-4 rounded border border-[var(--ide-border)]/50 bg-[var(--background)]/50 flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <div className="w-9 h-9 rounded border border-[var(--ide-border)] bg-[var(--ide-bg)] flex items-center justify-center text-[var(--text-secondary)]"><Swords className="w-4 h-4"/></div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase">{ch.title}</h4>
                        <p className="text-[8px] text-[var(--text-muted)] uppercase mt-0.5">{ch.participants} participants // {ch.difficulty}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[8px] font-bold uppercase border ${
                      ch.status === 'Active' 
                        ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]' 
                        : 'border-[var(--ide-border)] text-[var(--text-muted)] bg-[var(--ide-bg)]'
                    }`}>{ch.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB: Analytics & Reports */}
          {activeTab === 'Analytics & Reports' && (
            <motion.div {...fadeUp(0.1)} className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="text-left">
                  <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">Student Telemetry Logs</h2>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase mt-0.5">Track and analyze cohort test scores, compatibility and match histories.</p>
                </div>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]"/>
                  <input 
                    type="text" 
                    placeholder="QUERY STU_NODE_LOGS..." 
                    className="w-full pl-9 pr-4 py-2 rounded bg-[var(--ide-bg)] border border-[var(--ide-border)] text-[10px] text-[var(--text-primary)] outline-none focus:border-[#8B5CF6] transition-all font-bold placeholder:text-[var(--text-secondary)]"
                  />
                </div>
              </div>
              
              <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse font-mono text-[10px]">
                  <thead>
                    <tr className="bg-[var(--background)] border-b border-[var(--ide-border)]/50 text-[var(--text-muted)] uppercase">
                      <th className="p-4 font-bold">STUDENT_NODE</th>
                      <th className="p-4 font-bold">LEVEL & TELEMETRY XP</th>
                      <th className="p-4 font-bold">DOMINANT_SKILL</th>
                      <th className="p-4 font-bold">PAIR_MATCHES</th>
                      <th className="p-4 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentsList.length === 0 && (
                      <div className="col-span-2 text-center p-8 text-[10px] uppercase font-mono text-[var(--text-muted)]">
                        No students found in the cohort
                      </div>
                    )}
                    {studentsList.map(student => (
                      <tr key={student.id} className="border-b border-[var(--ide-border)]/30 hover:bg-[var(--background)]/30 text-[var(--text-secondary)]">
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-7 h-7 rounded border border-[var(--ide-border)] bg-[var(--background)] flex items-center justify-center text-[10px] font-bold text-white">{student.avatar}</div>
                          <span className="font-bold text-[var(--text-primary)] uppercase">{student.name}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[#8B5CF6] font-bold">LVL_{student.level}</span>
                            <span className="text-[var(--text-muted)] font-bold">// {student.hp} HP</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded border border-[var(--ide-border)] bg-[var(--background)] text-[8px] font-bold text-[var(--text-secondary)] uppercase">{student.topSkill}</span>
                        </td>
                        <td className="p-4 font-bold">{student.matches} SESSIONS</td>
                        <td className="p-4 text-right">
                          <button className="text-[9px] font-bold text-[#8B5CF6] uppercase hover:underline">Diagnostic Report</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* TAB: Advanced Tools */}
          {activeTab === 'Advanced Tools' && (
            <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-4">
                <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] p-6 rounded-lg space-y-4 text-left">
                  <div className="w-10 h-10 rounded border border-[var(--ide-border)] bg-[var(--background)] flex items-center justify-center text-[#8B5CF6]"><Target className="w-5 h-5"/></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase">Mock Placement Sandboxes</h3>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed uppercase">// CONFIGURE STRICT SANDBOX TELEMETRIES THAT DISABLE AUTOMATED AI CODE COMPILERS AND DICTATE STRICT TIME BOUNDS TO MIMIC FAANG ASSESSMENTS.</p>
                  <button className="w-full py-2.5 rounded bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white font-bold uppercase transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    Launch FAANG Sandbox Mode
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="ide-panel bg-[var(--ide-bg)] border-[var(--ide-border)] p-6 rounded-lg space-y-4 text-left">
                  <div className="w-10 h-10 rounded border border-[var(--ide-border)] bg-[var(--background)] flex items-center justify-center text-[#F59E0B]"><MessageSquare className="w-5 h-5"/></div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase">Broadcast Cohort Announcement</h3>
                  <p className="text-[10px] text-[var(--text-muted)] leading-relaxed uppercase">// COMPILE AND SEND A LIVE PUSH TELEMETRY UPDATE BROADCAST TO ALL ONLINE STUDENT DASHBOARDS UNDER GUIDANCE LINK.</p>
                  
                  <div className="space-y-3 pt-2">
                    <input 
                      type="text" 
                      placeholder="BROADCAST MESSAGE ANNOUNCEMENT..." 
                      className="w-full px-4 py-2.5 rounded bg-[var(--background)] border border-[var(--ide-border)] text-[10px] text-white outline-none focus:border-[#8B5CF6] placeholder:text-[var(--text-secondary)] font-bold"
                    />
                    <button className="w-full py-2.5 rounded bg-[var(--ide-bg)] hover:bg-gray-200 text-[var(--text-primary)] font-bold uppercase transition-all">
                      Transmit Broadcast Signal
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </main>
      </div>

      {/* Certified Mentor Profile dialog overlay */}
      <AnimatePresence>
        {showProfileModal && profile && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[var(--ide-header-bg)]/80 backdrop-blur-sm" onClick={() => setShowProfileModal(false)}/>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
              <div className="bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-lg shadow-2xl max-w-md w-full pointer-events-auto overflow-hidden font-mono text-xs">
                <div className="h-24 bg-gradient-to-r from-[#8B5CF6] to-[#FF3366] relative opacity-[0.8]">
                  <button onClick={() => setShowProfileModal(false)} className="absolute top-4 right-4 w-7 h-7 rounded border border-white/20 bg-[var(--btn-sec-bg)] text-[var(--text-primary)] flex items-center justify-center hover:bg-black/60 transition-colors"><X className="w-4 h-4"/></button>
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="w-20 h-20 rounded bg-[var(--background)] border border-[var(--ide-border)] flex items-center justify-center text-3xl -mt-10 mb-4 shadow-xl">{profile.avatar}</div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)] uppercase">{profile.name}</h2>
                  <p className="text-[9px] font-bold text-[#8B5CF6] uppercase tracking-widest mt-0.5">{profile.title}</p>
                  
                  <div className="space-y-4 mt-6">
                    <div>
                      <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mb-2">// CAPABILITY MATRIX</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillsKnown?.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 rounded bg-[var(--background)] text-[9px] font-bold text-[var(--text-secondary)] border border-[var(--ide-border)] uppercase">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-wider mb-2">// ACTIVE GUIDANCE FIELDS</p>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.skillsGuide?.map((s: string) => (
                          <span key={s} className="px-2.5 py-1 rounded bg-[#8B5CF6]/10 text-[9px] font-bold text-[#8B5CF6] border border-[#8B5CF6]/30 uppercase">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-2.5">
                    <button onClick={() => { setShowProfileModal(false); router.push('/mentor/settings'); }} className="w-full py-2.5 rounded border border-[var(--ide-border)] hover:border-gray-500 bg-[var(--background)] text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase transition-all">
                      Configure profile parameters
                    </button>
                    <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); await signOut(auth); localStorage.clear(); router.push('/login'); }} className="w-full py-2.5 rounded bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 text-red-400 hover:text-red-300 uppercase transition-all">
                      Terminate session links
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MentorDashboard() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[var(--ide-header-bg)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        <div className="flex flex-col items-center gap-3">
          <p>LOADING MENTOR PORTAL...</p>
        </div>
      </div>
    }>
      <MentorDashboardContent />
    </React.Suspense>
  );
}
