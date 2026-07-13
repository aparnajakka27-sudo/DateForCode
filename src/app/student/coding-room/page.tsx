"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Code2, Play, Send, Mic, MicOff, Monitor, Users, MessageSquare, ChevronRight, CheckCircle2, XCircle, Trophy, Zap, ArrowRight, X, Shield, Star, RotateCcw, Home, Eye, Bot, UserCheck, Volume2, AlertTriangle, Heart, Sparkles, Terminal, Cpu, Database, Laptop, Loader2, FileText } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getRandomCodingQuestions, getMentorCodingQuestions, CodingQuestion } from '@/data/codingQuestions';
import Logo from '@/components/Logo';
import SandpackEditor from '@/components/SandpackEditor';
import MonacoEditor from '@/components/MonacoEditor';
import Output from '@/components/Output';
import { SandpackProvider, SandpackPreview, useSandpack, SandpackConsole } from '@codesandbox/sandpack-react';
import FileExplorer, { FileTabs } from '@/components/FileExplorer';

interface LanguageConfig {
  name: string;
  icon: string;
  color: string;
  editor: 'monaco' | 'sandpack';
  template?: 'react' | 'react-ts' | 'vanilla';
  mainFile: string;
}

const LANGUAGES: Record<string, LanguageConfig> = {
  javascript: { name: 'JavaScript', icon: '⚡', color: '#FF3366', editor: 'sandpack', template: 'vanilla', mainFile: '/index.js' },
  typescript: { name: 'TypeScript', icon: '🔷', color: '#3178C6', editor: 'sandpack', template: 'vanilla', mainFile: '/index.js' },
  react: { name: 'React', icon: '⚛️', color: '#61DAFB', editor: 'sandpack', template: 'react', mainFile: '/App.jsx' },
  python: { name: 'Python', icon: '🐍', color: '#3776AB', editor: 'monaco', mainFile: '/solution.py' },
  cpp: { name: 'C++', icon: '⚙️', color: '#00599C', editor: 'monaco', mainFile: '/main.cpp' },
  java: { name: 'Java', icon: '☕', color: '#E32D30', editor: 'monaco', mainFile: '/Main.java' },
  sql: { name: 'SQL', icon: '🗄️', color: '#4479A1', editor: 'monaco', mainFile: '/query.sql' },
  rust: { name: 'Rust', icon: '🦀', color: '#DEA584', editor: 'monaco', mainFile: '/main.rs' },
  go: { name: 'Go', icon: '🐹', color: '#00ADD8', editor: 'monaco', mainFile: '/main.go' },
  html: { name: 'HTML', icon: '🌐', color: '#E34F26', editor: 'sandpack', template: 'vanilla', mainFile: '/index.html' },
  css: { name: 'CSS', icon: '🎨', color: '#1572B6', editor: 'sandpack', template: 'vanilla', mainFile: '/styles.css' }
};

const MENTORS = [
  { name: 'Dr. Priya K.', avatar: 'PK', skill: 'Full-Stack', status: 'online' },
  { name: 'Rahul M.', avatar: 'RM', skill: 'Algorithms', status: 'online' },
  { name: 'Sneha D.', avatar: 'SD', skill: 'System Design', status: 'busy' },
];

const AI_REPLIES = [
  "Try breaking the problem into smaller recursive subproblems.",
  "Consider evaluating performance using a Hash Map with O(1) average lookup.",
  "Check edge constraints: are empty parameters, negative limits, or overflow boundaries accounted for?",
  "Analyze structural complexity. Could a greedy sliding window optimize memory allocations?",
  "The TypeScript compiler suggests structural types mismatch, check return interfaces.",
  "Excellent syntactic optimization path! Proceed with verification.",
  "Verify allocation size boundaries prior to thread dispatching."
];

type Phase = 'protocols' | 'coding' | 'results';
type Role = 'coder' | 'navigator';
type ChatMsg = { from: string; text: string; time: string };

interface NormalizedTestCase {
  input: string;
  expected: string;
}

const getNormalizedTestCases = (q: CodingQuestion) => {
  if (!q) return { visible: [], hidden: [] };
  const visible: NormalizedTestCase[] = (q.visibleTestCases || []).map(tc => ({
    input: tc.input,
    expected: tc.expectedOutput
  }));
  const hidden: NormalizedTestCase[] = (q.hiddenTestCases || []).map(tc => ({
    input: tc.input,
    expected: tc.expectedOutput
  }));

  if (visible.length > 0) {
    return { visible, hidden };
  }

  // Fallback to q.testCases for backward compatibility
  const all = (q.testCases || []).map(tc => ({
    input: tc.input,
    expected: tc.expected
  }));
  const vis = all.slice(0, Math.min(2, all.length));
  let hid = all.slice(2);
  if (hid.length === 0) {
    hid = [
      { input: 'System Edge Case 1', expected: 'Success' },
      { input: 'System Edge Case 2', expected: 'Success' },
      { input: 'System Edge Case 3', expected: 'Success' }
    ];
  }
  return { visible: vis, hidden: hid };
};

interface MonacoSandpackBridgeProps {
  code: string;
  onChange: (val: string) => void;
  disabled?: boolean;
  activeFile: string;
  files: Record<string, { code: string }>;
}

function MonacoSandpackBridge({ code, onChange, disabled = false, activeFile }: MonacoSandpackBridgeProps) {
  const { sandpack } = useSandpack();
  const { files, updateFile } = sandpack;

  // Debounce Monaco editor keystrokes to Sandpack to avoid lag
  useEffect(() => {
    const handler = setTimeout(() => {
      if (files[activeFile] && files[activeFile].code !== code) {
        updateFile(activeFile, code);
      }
    }, 250);

    return () => clearTimeout(handler);
  }, [code, activeFile, updateFile, files]);

  const getFileLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'css') return 'css';
    if (ext === 'html') return 'html';
    if (ext === 'json') return 'json';
    if (ext === 'sql') return 'sql';
    if (ext === 'java') return 'java';
    if (ext === 'cpp') return 'cpp';
    return 'javascript';
  };

  return (
    <MonacoEditor
      value={code}
      onChange={onChange}
      language={getFileLanguage(activeFile)}
      disabled={disabled}
      placeholder={`// Editing ${activeFile}...`}
    />
  );
}

const getInitialFiles = (stack: string, initialCode: string): Record<string, { code: string }> => {
  const st = stack.toLowerCase();
  if (st === 'react' || st === 'react-ts') {
    const hasApp = initialCode.includes("export default function App") || initialCode.includes("class App");
    const reactCode = hasApp ? initialCode : `import React from 'react';

// Your solution code:
${initialCode}

export default function App() {
  const testInput = "hello";
  const result = typeof reverseString === 'function' ? reverseString(testInput) : 'Function not defined';

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', background: '#0f172a', color: 'white', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
      <h3 style={{ marginTop: 0, color: '#61DAFB' }}>⚛️ React Sandbox Live Preview</h3>
      <p style={{ color: '#94a3b8', fontSize: '13px' }}>Calling <code>reverseString("{testInput}")</code>:</p>
      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10B981', background: '#1e293b', padding: '10px', borderRadius: '4px' }}>
        "{result}"
      </div>
      <p style={{ color: '#64748b', fontSize: '10px', marginTop: '12px', marginBottom: 0, fontStyle: 'italic' }}>
        Edit the function in Monaco to see results update live.
      </p>
    </div>
  );
}`;
    return {
      '/App.jsx': { code: reactCode },
      '/index.css': { code: `body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }` },
      '/package.json': { code: `{\n  "dependencies": {\n    "react": "^18.0.0",\n    "react-dom": "^18.0.0"\n  }\n}` }
    };
  } else if (st === 'javascript' || st === 'typescript') {
    const jsCode = `${initialCode}

// Live preview visualization helper
const app = document.getElementById('app');
if (app) {
  const result = typeof reverseString === 'function' ? reverseString("hello") : 'Function not defined';
  app.innerHTML = \`
    <div style="font-family: sans-serif; padding: 20px; color: #10B981; background: #0f172a; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.25); max-width: 400px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      <h3 style="margin-top:0; color: #FF3366; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">⚡ Vanilla JS Live Preview</h3>
      <p style="color: #94a3b8; font-size: 12px; margin-bottom: 8px;">Output of <code>reverseString("hello")</code>:</p>
      <div style="font-size: 18px; font-weight: bold; color: white; font-family: monospace; background: #1e293b; padding: 10px; border-radius: 4px; border: 1px solid #334155;">
        "\\\${result}"
      </div>
      <p style="color: #64748b; font-size: 9px; margin-top: 12px; margin-bottom: 0; font-style: italic;">Changes in Monaco editor will live-rebuild this preview pane.</p>
    </div>
  \`;
}`;
    return {
      '/index.js': { code: jsCode },
      '/index.html': { code: `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="styles.css">\n</head>\n<body>\n  <div id="app" style="padding-top: 40px;"></div>\n  <script src="index.js"></script>\n</body>\n</html>` },
      '/styles.css': { code: `body { font-family: sans-serif; background: #0f172a; color: white; padding: 20px; }` }
    };
  } else if (st === 'python') {
    return { '/solution.py': { code: initialCode } };
  } else if (st === 'java') {
    return { '/Main.java': { code: initialCode } };
  } else if (st === 'cpp') {
    return { '/main.cpp': { code: initialCode } };
  } else if (st === 'sql') {
    return { '/query.sql': { code: initialCode } };
  } else if (st === 'rust') {
    return { '/main.rs': { code: initialCode } };
  } else if (st === 'go') {
    return { '/main.go': { code: initialCode } };
  }
  return { '/solution.js': { code: initialCode } };
};

function CodingRoomContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const searchParams = sp;
  const stack = sp.get('skill') || 'javascript';
  const partnerName = sp.get('partner') || 'Aarav Mehta';
  const partnerAvatar = sp.get('avatar') || 'AM';
  const m = LANGUAGES[stack.toLowerCase()] || LANGUAGES.javascript;

  const [editorTheme, setEditorTheme] = useState<any>('dark');
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    setEditorTheme(isDark ? 'dark' : 'light');
  }, []);

  const [files, setFiles] = useState<Record<string, { code: string }>>({});
  const [activeFile, setActiveFile] = useState<string>('');
  const [previewTab, setPreviewTab] = useState<'preview' | 'console'>('preview');
  const [isRunning, setIsRunning] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<{ stdout: string; stderr: string; results?: any[] } | null>(null);
  const [terminalTab, setTerminalTab] = useState<'output' | 'stdout' | 'stderr'>('output');

  const useSandpack = m.editor === 'sandpack';

  const [phase, setPhase] = useState<Phase>('protocols');
  const [questions, setQuestions] = useState<CodingQuestion[]>([]);
  const [activeQ, setActiveQ] = useState(0);
  const [code, setCode] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [role, setRole] = useState<Role>('coder');
  const [roleSwaps, setRoleSwaps] = useState(0);
  const [micOn, setMicOn] = useState(false);
  const [screenShare, setScreenShare] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([{ from: 'bot', text: '[SYSTEM] Connected to AI diagnostic telemetry socket. Ask me anything about the coding challenges.', time: 'now' }]);
  const [chatInput, setChatInput] = useState('');
  
  // Custom Flow States
  const [visibleResults, setVisibleResults] = useState<(boolean | null)[][]>([]);
  const [hiddenResults, setHiddenResults] = useState<(boolean | null)[][]>([]);
  const [isRunningHidden, setIsRunningHidden] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [passedStatus, setPassedStatus] = useState<'PASS' | 'FAIL' | null>(null);

  const [partnerReady, setPartnerReady] = useState(false);
  const [myReady, setMyReady] = useState(false);
  const [feedback, setFeedback] = useState(0);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [tickerMsg, setTickerMsg] = useState('Teammate connected to matching room');
  const [mentorAlertStatus, setMentorAlertStatus] = useState<'idle' | 'requesting' | 'dispatched'>('idle');

  // Load questions & restore session if autosave exists
  useEffect(() => {
    let qs: CodingQuestion[] = [];
    const isMentorMode = searchParams.get('mode') === 'mentor';
    if (isMentorMode) {
      const bank = getMentorCodingQuestions(stack);
      const shuffled = [...bank].sort(() => Math.random() - 0.5);
      qs = shuffled.slice(0, 2);
    } else {
      qs = getRandomCodingQuestions(stack, 2);
    }
    setQuestions(qs);

    const savedCodeKey = `dfc_code_${stack}_${qs.map(q => q.id).join('_')}`;
    const savedCode = localStorage.getItem(savedCodeKey);
    if (savedCode) {
      try {
        setCode(JSON.parse(savedCode));
      } catch (_) {
        setCode(qs.map(q => q.starter));
      }
    } else {
      setCode(qs.map(q => q.starter));
    }
    
    // Set up test case counts dynamically
    const visResultsList: (boolean | null)[][] = [];
    const hidResultsList: (boolean | null)[][] = [];
    
    qs.forEach(q => {
      const norm = getNormalizedTestCases(q);
      visResultsList.push(norm.visible.map(() => null));
      hidResultsList.push(norm.hidden.map(() => null));
    });
    
    setVisibleResults(visResultsList);
    setHiddenResults(hidResultsList);
  }, [stack, searchParams]);

  // Auto redirect timer for failed mentor assessment
  useEffect(() => {
    const isMentorMode = searchParams.get('mode') === 'mentor';
    if (isMentorMode && phase === 'results' && passedStatus === 'FAIL') {
      const timer = setTimeout(() => {
        router.push(`/mentor/dashboard?status=failed&score=${finalScore}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, passedStatus, searchParams, finalScore, router]);

  // Autosave code to localStorage on changes
  useEffect(() => {
    if (questions.length === 0 || code.length === 0) return;
    const savedCodeKey = `dfc_code_${stack}_${questions.map(q => q.id).join('_')}`;
    localStorage.setItem(savedCodeKey, JSON.stringify(code));
  }, [code, questions, stack]);

  // Autosave files to localStorage on changes
  useEffect(() => {
    if (questions.length === 0 || activeFile === '' || Object.keys(files).length === 0) return;
    const savedFilesKey = `dfc_files_${stack}_q${activeQ}_${questions[activeQ]?.id}`;
    localStorage.setItem(savedFilesKey, JSON.stringify({ files, activeFile }));
  }, [files, activeFile, activeQ, questions, stack]);

  // Synchronize files (loading autosave files if available, otherwise getInitialFiles)
  useEffect(() => {
    if (questions.length === 0 || code.length === 0) return;
    const initialCode = code[activeQ] || '';
    const config = LANGUAGES[stack.toLowerCase()] || LANGUAGES.javascript;
    const mainFile = config.mainFile;

    const savedFilesKey = `dfc_files_${stack}_q${activeQ}_${questions[activeQ]?.id}`;
    const savedData = localStorage.getItem(savedFilesKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFiles(parsed.files);
        setActiveFile(parsed.activeFile);
        return;
      } catch (_) {}
    }

    setFiles(getInitialFiles(stack, initialCode));
    setActiveFile(mainFile);
  }, [activeQ, questions]);

  const handleCodeChange = (newVal: string) => {
    setFiles(prev => ({
      ...prev,
      [activeFile]: { code: newVal }
    }));
    
    if (role === 'coder') {
      const c = [...code];
      c[activeQ] = newVal;
      setCode(c);
      setTickerMsg("Compiling keystrokes in active driver session...");
    }
  };

  const handleFileCreate = (fileName: string) => {
    setFiles(prev => ({
      ...prev,
      [fileName]: { code: `// New file ${fileName}\n` }
    }));
    setActiveFile(fileName);
  };

  const handleFileDelete = (fileName: string) => {
    setFiles(prev => {
      const next = { ...prev };
      delete next[fileName];
      if (activeFile === fileName) {
        const remaining = Object.keys(next);
        setActiveFile(remaining[0] || '');
      }
      return next;
    });
  };

  const getFileLanguage = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (ext === 'js' || ext === 'jsx') return 'javascript';
    if (ext === 'ts' || ext === 'tsx') return 'typescript';
    if (ext === 'css') return 'css';
    if (ext === 'html') return 'html';
    if (ext === 'json') return 'json';
    if (ext === 'sql') return 'sql';
    if (ext === 'java') return 'java';
    if (ext === 'cpp') return 'cpp';
    return 'javascript';
  };

  // Telemetry countdown
  useEffect(() => {
    if (phase !== 'coding') return;
    const t = setInterval(() => {
      setTimeLeft(p => {
        if (p <= 1) {
          clearInterval(t);
          finishSession();
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // Teammate typing/compiling simulation ticker
  useEffect(() => {
    if (phase !== 'coding') return;
    const tickers = [
      `${partnerName} is checking test cases...`,
      `${partnerName} updated lines inside solution...`,
      `${partnerName} is inspecting computational time complexity...`,
      `${partnerName} started WebRTC audio voice stream...`,
      `${partnerName} changed character allocations...`
    ];
    const t = setInterval(() => {
      setTickerMsg(tickers[Math.floor(Math.random() * tickers.length)]);
    }, 9000);
    return () => clearInterval(t);
  }, [phase, partnerName]);

  // Fullscreen block rules for strict test arena
  useEffect(() => {
    if (phase !== 'coding') return;

    // Attempt fullscreen
    (async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (_) { }
    })();

    const block = () => window.history.pushState(null, '', window.location.href);
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', block);

    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'F11' || e.key === 'F5' || e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
      }
      if ((e.ctrlKey || e.metaKey) && ['w', 't', 'n', 'r', 'l', 'q'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.altKey && (e.key === 'Tab' || e.key === 'F4')) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('keydown', blockKeys, true);

    const blockCtxMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', blockCtxMenu);

    const onBlur = () => {
      try {
        window.focus();
      } catch (_) { }
    };
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('popstate', block);
      window.removeEventListener('keydown', blockKeys, true);
      window.removeEventListener('contextmenu', blockCtxMenu);
      window.removeEventListener('blur', onBlur);
    };
  }, [phase]);

  const finishSession = useCallback(() => {
    setPhase('results');
    (async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        }
      } catch (_) { }
    })();

    // Update LocalStorage metrics
    try {
      const isMentorMode = searchParams.get('mode') === 'mentor';
      if (!isMentorMode) {
        const p = JSON.parse(localStorage.getItem('dateforcode_progress') || '{}');
        p.codeDone = true;
        p.sessions = (p.sessions || 0) + 1;
        
        const isPassed = passedStatus === 'PASS';
        const earnedHp = (isPassed ? 50 : 20) + roleSwaps * 5;
        p.hp = (p.hp || 0) + earnedHp;

        const today = new Date().toISOString().split('T')[0];
        if (p.lastDate !== today) {
          p.streak = (p.streak || 0) + 1;
          p.lastDate = today;
        }
        localStorage.setItem('dateforcode_progress', JSON.stringify(p));
      }
    } catch (_) { }
  }, [roleSwaps, passedStatus, searchParams]);

  // Execute visible test cases flow (Calls Secure Docker Sandbox API)
  const runTests = async () => {
    const activeCode = code[activeQ] || '';
    const q = questions[activeQ];
    if (!q) return;

    setIsExecuting(true);
    setTerminalLogs(null);
    setTickerMsg(`COMPILING solution.${stack === 'cpp' ? 'cpp' : 'py'} inside secure Docker sandbox...`);
    const normalized = getNormalizedTestCases(q);

    // Reset results list to null to trigger "running" status spinner
    const resettingVis = [...visibleResults];
    resettingVis[activeQ] = normalized.visible.map(() => null);
    setVisibleResults(resettingVis);

    try {
      const res = await fetch("http://localhost:5000/execute-test-suite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: activeCode,
          language: stack,
          functionName: q.functionName || 'findMedianSortedArrays',
          testCases: normalized.visible,
          files: files
        })
      });

      const data = await res.json();
      if (data.error) {
        setTickerMsg(`[COMPILER ERROR] ${data.error}`);
        const newVis = [...visibleResults];
        newVis[activeQ] = normalized.visible.map(() => false);
        setVisibleResults(newVis);
        
        setTerminalLogs({
          stdout: '',
          stderr: data.error,
          results: []
        });
        setTerminalTab('stderr');

        setChatMsgs(p => [...p, {
          from: 'system',
          text: `[COMPILER ERROR]: ${data.error}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        return;
      }

      const results = data.results || [];
      const newVis = [...visibleResults];
      newVis[activeQ] = results.map((r: any) => r.passed);
      setVisibleResults(newVis);
      setTickerMsg(`Execution resolved. Compiled success.`);

      setTerminalLogs({
        stdout: results.map((r: any, idx: number) => `Case #${idx + 1}: ${r.passed ? 'PASSED' : 'FAILED'} | Expected: ${r.expected} | Actual: ${r.actual}`).join('\n'),
        stderr: '',
        results: results
      });
      setTerminalTab('output');

      const failed = results.filter((r: any) => !r.passed).length;
      if (failed > 0) {
        setChatMsgs(p => [...p, {
          from: 'system',
          text: `[COMPILER SUCCESS]: Executed test suite. ${failed} visible test cases failed. Adjust solution parameters.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        setChatMsgs(p => [...p, {
          from: 'system',
          text: `[COMPILER SUCCESS]: All visible test cases compiled green! Proceed to submit.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }

    } catch (e: any) {
      console.error(e);
      setTickerMsg(`[ERROR] Connection failed to Secure Sandbox Compiler.`);
      setTerminalLogs({
        stdout: '',
        stderr: `Execution Connection Exception: ${e.message}`,
        results: []
      });
      setTerminalTab('stderr');
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit flow: Run Hidden Test Cases -> Calculate Score -> Pass / Fail
  const submitSolution = async () => {
    if (myReady) return;
    setMyReady(true);
    setIsRunningHidden(true);
    setTickerMsg("RUNNING SECURE EVALUATIONS ON HIDDEN TEST CASES...");

    try {
      const newHiddenResults = [...hiddenResults];
      
      for (let idx = 0; idx < questions.length; idx++) {
        const q = questions[idx];
        const normalized = getNormalizedTestCases(q);
        const activeCode = code[idx] || '';

        const questionFiles = idx === activeQ ? files : getInitialFiles(stack, activeCode);
        const res = await fetch("http://localhost:5000/execute-test-suite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: activeCode,
            language: stack,
            functionName: q.functionName || 'findMedianSortedArrays',
            testCases: normalized.hidden,
            files: questionFiles
          })
        });

        const data = await res.json();
        const results = data.results || [];
        
        if (data.error) {
          newHiddenResults[idx] = normalized.hidden.map(() => false);
        } else {
          newHiddenResults[idx] = results.map((r: any) => r.passed);
        }
      }

      setHiddenResults(newHiddenResults);

      let totalTests = 0;
      let passedTests = 0;

      questions.forEach((q, idx) => {
        const visRes = visibleResults[idx] || [];
        const hidRes = newHiddenResults[idx] || [];

        visRes.forEach((r) => {
          totalTests++;
          if (r === true) passedTests++;
        });
        hidRes.forEach((r) => {
          totalTests++;
          if (r === true) passedTests++;
        });
      });

      const scorePercent = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 100;
      setFinalScore(scorePercent);
      
      const isMentorMode = searchParams.get('mode') === 'mentor';
      if (isMentorMode) {
        const isPassed = scorePercent >= 90;
        setPassedStatus(isPassed ? 'PASS' : 'FAIL');
        
        // Save database & local logs
        try {
          const statusStr = localStorage.getItem('dateforcode_mentor_status') || '{}';
          const status = JSON.parse(statusStr);
          
          const newAttempt = {
            score: scorePercent,
            passed: isPassed,
            questionsSelected: questions.map(q => q.id),
            attemptedAt: new Date()
          };
          
          status.assessmentAttempts = [...(status.assessmentAttempts || []), newAttempt];
          if (isPassed) {
            status.level2Completed = true;
            status.activePortal = 'mentor';
            status.isMentorApproved = true;
            status.mentorApprovalDate = new Date();
          }
          
          localStorage.setItem('dateforcode_mentor_status', JSON.stringify(status));
          
          // Save to MongoDB Atlas
          const uid = localStorage.getItem('dateforcode_uid') || 'local_dev_user';
          fetch('/api/mentor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, ...status })
          }).catch(err => console.error("Failed to POST mentor attempt to MongoDB Atlas:", err));
        } catch (err) {
          console.error("Local status update crashed:", err);
        }
        
        setPhase('results');
        setIsRunningHidden(false);
        return;
      }

      const status = scorePercent >= 70 ? 'PASS' : 'FAIL';
      setPassedStatus(status);
      
      setIsRunningHidden(false);
      setPartnerReady(true);
    } catch (e) {
      console.error(e);
      setTickerMsg(`[ERROR] Submission crashed due to sandbox connection issue.`);
      setIsRunningHidden(false);
      setMyReady(false);
    }
  };

  const toggleRole = () => {
    setRole(r => r === 'coder' ? 'navigator' : 'coder');
    setRoleSwaps(s => s + 1);
    setTickerMsg(`Role swapped: You are now a ${role === 'coder' ? 'navigator' : 'coder'}.`);
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMsgs(p => [...p, { from: 'you', text: chatInput, time: now }]);
    setChatInput('');
    setTimeout(() => {
      setChatMsgs(p => [...p, { from: 'bot', text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1200);
  };

  // Live stuck intervention simulation
  const triggerMentorIntervention = () => {
    setMentorAlertStatus('requesting');
    setTickerMsg("DISPATCHING STUCK ALERT TELEMETRY METRIC TO LIVE MENTOR HUBS...");

    // Simulate mentor dispatching within 4 seconds
    setTimeout(() => {
      setMentorAlertStatus('dispatched');
      setTickerMsg("LIVE MENTOR HAS BEEN DISPATCHED TO ENCRYPTED STREAM LINK.");

      // Inject to chat
      setChatMsgs(p => [...p, {
        from: 'system',
        text: 'Live Mentor Dr. Priya K. has joined the session channel to guide your stuck thread.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 4000);
  };

  useEffect(() => {
    if (myReady && partnerReady) finishSession();
  }, [myReady, partnerReady, finishSession]);

  const mins = Math.floor(timeLeft / 60), secs = timeLeft % 60;
  
  // Scoring counts for results
  const totalVisPassed = visibleResults.flat().filter(t => t === true).length;
  const totalVisFailed = visibleResults.flat().filter(t => t === false).length;
  const totalHidPassed = hiddenResults.flat().filter(t => t === true).length;
  const totalHidFailed = hiddenResults.flat().filter(t => t === false).length;
  
  const passedCount = totalVisPassed + totalHidPassed;
  const failedCount = totalVisFailed + totalHidFailed;
  const hpEarned = (passedStatus === 'PASS' ? 50 : 20) + roleSwaps * 5;

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--ide-header-bg)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3366]" />
          <p>LOADING SECURE TESTING ENVIRONMENT PORT...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-[var(--background)] text-[var(--foreground)] z-[9999] flex flex-col overflow-hidden font-sans noise-bg">
      <div className="absolute inset-0 developer-grid pointer-events-none opacity-30 z-0" />
      <div className="absolute inset-0 aurora-mesh pointer-events-none opacity-40 z-0" />
      
      {/* ════ RUNNING HIDDEN TEST CASES PREMIUM OVERLAY ════ */}
      <AnimatePresence>
        {isRunningHidden && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[var(--background)]/90 backdrop-blur-md font-mono text-xs text-[var(--text-primary)]"
          >
            <Cpu className="w-12 h-12 text-[#FF3366] animate-spin mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest text-[#FF3366] accent-glow mb-2">RUNNING SECURE EVALUATIONS</p>
            <p className="text-[var(--text-muted)] uppercase tracking-widest font-semibold">// COMPILING HIDDEN TEST CASES IN SECURE CONTAINER...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ════ PHASE 1: ELITE PROTOCOLS HANDSHAKE ════ */}
        {phase === 'protocols' && (
          <motion.div
            key="proto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-6 md:p-10 overflow-y-auto relative z-10"
          >
            <motion.div
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-xl w-full"
            >
              <div className="glass-panel p-6 md:p-8 rounded-xl overflow-hidden flex flex-col justify-between border border-border-dark/60 shadow-2xl relative">
                
                {/* Panel Header */}
                <div className="w-full flex justify-between items-center py-3 border-b border-border-dark bg-[var(--ide-header-bg)]/60 px-6 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-2 tracking-widest">
                    <Terminal className="w-3.5 h-3.5 text-[#FF3366]" /> ROOM_HANDSHAKE_VALIDATOR.EXE
                  </span>
                  <span className="text-[10px] font-mono text-accent-pink uppercase font-bold tracking-widest">SECURE PORT 443</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg border border-border-dark flex items-center justify-center text-2xl bg-bg-dark-950 shadow-inner" style={{ color: m.color }}>
                    {m.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-mono font-bold text-[var(--text-primary)] tracking-tight uppercase">{m.name} Multiplayer Arena</h2>
                    <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest font-semibold">// ENCRYPTED SOCKET CONNECTION SUCCESS</p>
                  </div>
                </div>

                {/* Rules Monospace Checklist */}
                <div className="space-y-2.5 mb-6">
                  {[
                    { icon: Clock, text: 'Strict 30 minutes allocation to solve 2 telemetry modules.', hl: false },
                    { icon: Users, text: `Active Node Link: Teammate ${partnerName.toUpperCase()} connected.`, hl: false },
                    { icon: Code2, text: 'Driver/Navigator protocol active. Swap control key anytime.', hl: false },
                    { icon: Mic, text: 'Integrated WebRTC voice & viewport diagnostics.', hl: false },
                    { icon: Shield, text: 'Security sandbox mode. Navigation tab change registers tab-out warning.', hl: true },
                    { icon: Trophy, text: 'XP Velocity: +50 HP for passing the strict test validation.', hl: true }
                  ].map((r, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg border font-mono text-[10px] transition-all ${r.hl
                          ? 'bg-[#FF3366]/5 border-[#FF3366]/30 text-[#FF3366]'
                          : 'bg-bg-dark-900/50 border-border-dark/60 text-[var(--text-secondary)]'
                        }`}
                    >
                      <r.icon className="w-4 h-4 shrink-0" style={{ color: r.hl ? '#FF3366' : m.color }} />
                      <span className="tracking-wide">{r.text.toUpperCase()}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setPhase('coding')}
                  className="btn-premium w-full py-3 rounded-lg text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Code2 className="w-4 h-4" /> Compile Handshake & Enter <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ════ PHASE 2: FLAGSHIP MULTIPLAYER SPLIT IDE TERMINAL ════ */}
        {phase === 'coding' && (
          <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="flex-1 flex flex-col relative z-10">

            {/* Top Workspace Floating Toolbar */}
            <div className="w-[calc(100%-2rem)] mx-auto mt-4 px-6 py-2.5 bg-[var(--ide-header-bg)]/80 backdrop-blur-xl border border-border-dark/60 rounded-2xl flex items-center justify-between flex-shrink-0 z-30 font-mono shadow-md">
              <div className="flex items-center gap-4">
                <Logo showText={true} className="scale-[0.7] origin-left" />
                <div className="w-px h-5 bg-border-dark" />

                {/* Driver / Navigator Key Badging */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-bold uppercase border transition-all duration-300 ${role === 'coder'
                      ? 'bg-[#FF3366]/10 border-[#FF3366]/30 text-[#FF3366]'
                      : 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]'
                    }`}
                >
                  {role === 'coder' ? <Code2 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span className="tracking-widest">{role === 'coder' ? 'Driver (Active Control)' : 'Navigator (Telemetry Monitor)'}</span>
                </div>

                <button
                  onClick={toggleRole}
                  className="px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border border-border-dark hover:border-gray-500 bg-bg-dark-800 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" /> Swap Roles
                </button>
              </div>

              {/* Central Active Compiler Sim Ticker */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-bg-dark-900 border border-border-dark/50 rounded-md text-[9px] text-[var(--text-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                <span className="tracking-wider">{tickerMsg.toUpperCase()}</span>
              </div>

              {/* Workspace Telemetries & Controls */}
              <div className="flex items-center gap-2">
                {/* Teammate status indicator */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-bg-dark-800 border border-border-dark text-[9px]">
                  <div className="w-5 h-5 rounded-md bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center text-[var(--text-primary)] text-[9px] font-bold">{partnerAvatar}</div>
                  <span className="text-[var(--text-secondary)] tracking-wide">{partnerName.toUpperCase()}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                </div>

                <div className="w-px h-5 bg-border-dark" />

                {/* Voice channel toggle */}
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-2 rounded-md border transition-all ${micOn
                      ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981] shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                      : 'bg-bg-dark-800 border-border-dark text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  title={micOn ? 'Mute' : 'Unmute'}
                >
                  {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>

                {/* Screen Share toggle */}
                <button
                  onClick={() => setScreenShare(!screenShare)}
                  className={`p-2 rounded-md border transition-all ${screenShare
                      ? 'bg-[#3B82F6]/10 border-[#3B82F6]/40 text-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                      : 'bg-bg-dark-800 border-border-dark text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  title="Share Viewport"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>

                {/* AI stuck assistant panel button */}
                <button
                  onClick={() => { setShowChat(!showChat); setShowMentor(false); }}
                  className={`p-2 rounded-md border transition-all ${showChat
                      ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/40 text-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.15)]'
                      : 'bg-bg-dark-800 border-border-dark text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  title="AI Diagnostic Chat"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                {/* live mentor stuck intervention trigger button */}
                <button
                  onClick={triggerMentorIntervention}
                  disabled={mentorAlertStatus !== 'idle'}
                  className={`px-3 py-1.5 rounded-md font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${mentorAlertStatus === 'requesting'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 animate-pulse'
                      : mentorAlertStatus === 'dispatched'
                        ? 'bg-purple-500/10 border-purple-500/40 text-purple-400'
                        : 'bg-[#F59E0B]/10 border-amber-500/20 dark:border-[#F59E0B]/30 text-[#F59E0B] hover:bg-[#F59E0B]/20'
                    }`}
                  title="Intervention Stuck Request"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{mentorAlertStatus === 'requesting' ? 'Requesting...' : mentorAlertStatus === 'dispatched' ? 'Mentor Online' : 'Stuck Intervention'}</span>
                </button>

                <div className="w-px h-5 bg-border-dark" />

                {/* Monospace Telemetry Clock */}
                <div className={`px-3 py-1.5 rounded-md font-mono text-xs font-bold border flex items-center gap-1.5 ${timeLeft < 300
                    ? 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366] animate-pulse'
                    : 'bg-bg-dark-800 border-border-dark text-[var(--text-primary)]'
                  }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}</span>
                </div>

                <button
                  onClick={() => setShowEndConfirm(true)}
                  className="px-3 py-1.5 rounded-md border border-[#FF3366]/30 text-[#FF3366] text-[9px] font-bold uppercase bg-[#FF3366]/5 hover:bg-[#FF3366]/15 transition-all tracking-wider"
                >
                  Exit Room
                </button>
              </div>
            </div>

            {/* End session confirm dialog */}
            <AnimatePresence>
              {showEndConfirm && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-sm">
                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-panel border border-border-dark rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 font-mono text-xs">
                    <div className="w-12 h-12 mx-auto rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center mb-4"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                    <h3 className="text-sm font-bold text-center text-[var(--text-primary)] mb-2 uppercase tracking-wide">End Coding Session?</h3>
                    <p className="text-[var(--text-secondary)] text-center mb-6 leading-relaxed">Closing this viewport compiles existing progress and returns both nodes back to the dashboard command panels.</p>
                    <div className="flex gap-3">
                      <button onClick={() => setShowEndConfirm(false)} className="flex-1 py-2 rounded-lg border border-border-dark bg-bg-dark-900 text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase transition-all">Cancel</button>
                      <button onClick={() => { setShowEndConfirm(false); finishSession(); }} className="flex-1 py-2 rounded-lg bg-[#FF3366] text-white hover:bg-[#FF3366]/90 border border-[#FF3366] uppercase transition-all">Compile & Exit</button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex overflow-hidden relative mt-3 px-4 pb-4 gap-4">
              {/* LEFT — Question thread & compiler test nodes */}
              <div className="w-[300px] bg-[var(--ide-bg)]/90 border border-[var(--ide-border)]/50 rounded-2xl flex flex-col flex-shrink-0 z-20 font-mono shadow-md overflow-hidden">
                <div className="flex border-b border-[var(--ide-border)]/50 bg-[var(--ide-header-bg)]/90 px-2 pt-2 gap-1">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveQ(i)}
                      className={`px-4 py-2 text-[10px] font-bold rounded-t-lg border-t border-x transition-colors ${i === activeQ
                          ? 'bg-[var(--ide-bg)] text-[#FF3366] border-border-dark/80'
                          : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]'
                        }`}
                    >
                      MODULE_0{i + 1}.{stack === 'cpp' ? 'CPP' : stack === 'python' ? 'PY' : stack === 'rust' ? 'RS' : stack === 'go' ? 'GO' : stack === 'java' ? 'JAVA' : stack === 'sql' ? 'SQL' : 'TS'}
                    </button>
                  ))}
                </div>

                {/* Challenge specs viewport */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-bg-dark-800/20 scrollbar-none">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-[#FF3366]/30 bg-[#FF3366]/5 text-[#FF3366]">
                      DIFFICULTY: {questions[activeQ]?.difficulty.toUpperCase()}
                    </span>
                    <span className="text-[8px] text-[var(--text-muted)] font-semibold uppercase">Telemetry Socket: #082-Q</span>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-tight">{questions[activeQ]?.title}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans whitespace-pre-wrap">{questions[activeQ]?.desc}</p>

                  <div className="w-full h-px bg-border-dark/50" />

                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#FF3366] mb-2 accent-glow">VISIBLE_TEST_CASES</p>
                  <Output 
                    testCases={getNormalizedTestCases(questions[activeQ]).visible}
                    results={visibleResults[activeQ]}
                    isExecuting={isExecuting}
                  />
                </div>

                {/* Operations footer */}
                <div className="p-4 border-t border-[var(--ide-border)]/50 space-y-2 bg-[var(--ide-header-bg)]/80">
                  <button
                    onClick={runTests}
                    className="w-full py-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25 transition-all tracking-wider"
                  >
                    <Play className="w-3.5 h-3.5" /> Execute Test Suite (Compile)
                  </button>
                  <button
                    onClick={submitSolution}
                    disabled={myReady}
                    className={`w-full py-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 border transition-all tracking-wider ${myReady
                        ? 'bg-[#F59E0B]/10 border-amber-500/20 dark:border-[#F59E0B]/30 text-[#F59E0B]'
                        : 'border-border-dark text-[var(--text-muted)] hover:text-[#FF3366] hover:border-[#FF3366] bg-bg-dark-900/60'
                      }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>{myReady ? (partnerReady ? 'MUTUAL HANDSHAKE SUCCESSFUL' : 'WAITING FOR PEER HANDSHAKE...') : 'SUBMIT SOLUTION MATRIX'}</span>
                  </button>
                </div>
              </div>

              {/* CENTER — Premium Code Terminal Window (High Density Editor UI) */}
              <div className="flex-1 flex flex-col bg-bg-dark-950 relative z-10 border border-[var(--ide-border)]/50 rounded-2xl shadow-md overflow-hidden">
                <div className="bg-[var(--background)] px-5 py-2.5 flex items-center justify-between border-b border-border-dark/50 font-mono select-none">
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                    {useSandpack ? 'SANDBOX WORKSPACE' : `SOLUTION.${stack === 'cpp' ? 'cpp' : stack === 'python' ? 'py' : stack === 'rust' ? 'rs' : stack === 'go' ? 'go' : stack === 'java' ? 'java' : stack === 'sql' ? 'sql' : 'js'}`}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-[8px] text-[#FF3366] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3366] shadow-[0_0_8px_#FF3366]" /> LIVE EDITOR CONNECTED
                    </span>
                  </div>
                </div>

                <div className="flex-1 relative overflow-hidden font-mono flex h-full">
                  {/* File Explorer (Step 5 - Unified) */}
                  <FileExplorer
                    files={files}
                    activeFile={activeFile}
                    onActiveFileChange={setActiveFile}
                    onFileCreate={handleFileCreate}
                    onFileDelete={handleFileDelete}
                  />

                  {/* Right portion containing Editor + optional Preview */}
                  <div className="flex-1 h-full flex flex-col overflow-hidden relative">
                    {/* Tabs bar */}
                    <FileTabs
                      files={Object.keys(files)}
                      activeFile={activeFile}
                      onActiveFileChange={setActiveFile}
                    />

                    <div className="flex-1 flex overflow-hidden h-full w-full relative">
                      {useSandpack ? (
                        <SandpackProvider
                          template={
                            stack === 'react' || stack === 'react-ts'
                              ? (stack === 'react-ts' ? 'react-ts' : 'react')
                              : 'vanilla'
                          }
                          theme={editorTheme}
                          files={files}
                        >
                          <div className="flex-1 flex overflow-hidden h-full w-full">
                            {/* Editor: Monaco Synced (Step 1) */}
                            <div className="flex-1 h-full border-r border-border-dark/50 flex flex-col relative overflow-hidden">
                              <MonacoSandpackBridge 
                                code={files[activeFile]?.code || ''} 
                                onChange={handleCodeChange}
                                disabled={role !== 'coder'}
                                activeFile={activeFile}
                                files={files}
                              />

                              {/* Teammate custom cursor simulation over the IDE */}
                              {role === 'navigator' && (
                                <motion.div
                                  className="absolute pointer-events-none flex flex-col items-start"
                                  animate={{ x: [100, 180, 120, 240, 160], y: [80, 160, 220, 110, 190] }}
                                  transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                  <div className="w-[1.5px] h-4 bg-[#FF3366] animate-pulse" />
                                  <div className="px-1.5 py-0.5 rounded bg-[#FF3366] text-[8px] font-bold text-white font-mono uppercase tracking-widest mt-1 shadow-md">
                                    {partnerName} typing...
                                  </div>
                                </motion.div>
                              )}
                            </div>

                            {/* Live Preview Panel */}
                            <div className="w-[38%] h-full bg-[var(--ide-bg)] border-l border-border-dark/50 flex flex-col shrink-0 overflow-hidden font-mono text-[var(--text-secondary)] relative">
                              <div className="hidden">
                                <SandpackPreview />
                                <SandpackConsole />
                              </div>
                              {!isRunning ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-[var(--ide-header-bg)]">
                                  <button
                                    onClick={() => setIsRunning(true)}
                                    className="w-[120px] h-[36px] bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-lg shadow-[0_4px_14px_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] transition-all flex items-center justify-center cursor-pointer tracking-wide text-sm font-sans border border-[#10B981]/50"
                                  >
                                    ▶ Run Code
                                  </button>
                                </div>
                              ) : (
                                <iframe 
                                  src="https://8wvjnn.csb.app/?standalone" 
                                  className="w-full h-full border-0"
                                  sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                                  allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; clipboard-write; clipboard-read"
                                  title="App Preview"
                                />
                              )}
                            </div>
                          </div>
                        </SandpackProvider>
                      ) : (
                        <div className="flex-1 flex overflow-hidden h-full w-full">
                          {/* Editor: Monaco */}
                          <div className="flex-1 h-full border-r border-border-dark/50 flex flex-col relative overflow-hidden">
                            <MonacoEditor
                              value={files[activeFile]?.code || ''}
                              onChange={handleCodeChange}
                              disabled={role !== 'coder'}
                              language={getFileLanguage(activeFile)}
                              placeholder="// Waiting for driver control key swap to write code..."
                            />

                            {/* Teammate custom cursor simulation over the IDE */}
                            {role === 'navigator' && (
                              <motion.div
                                className="absolute pointer-events-none flex flex-col items-start"
                                animate={{ x: [100, 180, 120, 240, 160], y: [80, 160, 220, 110, 190] }}
                                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                <div className="w-[1.5px] h-4 bg-[#FF3366] animate-pulse" />
                                <div className="px-1.5 py-0.5 rounded bg-[#FF3366] text-[8px] font-bold text-white font-mono uppercase tracking-widest mt-1 shadow-md">
                                  {partnerName} typing...
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Right Side Backend Terminal Output Panel (Step 4) */}
                          <div className="w-[38%] h-full bg-[var(--ide-bg)] border-l border-border-dark/50 flex flex-col shrink-0 overflow-hidden font-mono text-[var(--text-secondary)]">
                            {/* Tabs */}
                            <div className="flex bg-[var(--background)] border-b border-border-dark/50 select-none">
                              <button
                                onClick={() => setTerminalTab('output')}
                                className={`flex items-center gap-1.5 px-4 py-2 border-r border-border-dark/50 cursor-pointer text-[10px] font-bold transition-all ${
                                  terminalTab === 'output'
                                    ? 'bg-[var(--ide-bg)] text-[#FF3366] border-t-2 border-t-[#FF3366]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--ide-header-bg)]/40'
                                }`}
                              >
                                <Terminal className="w-3 h-3" /> TEST RESULTS
                              </button>
                              <button
                                onClick={() => setTerminalTab('stdout')}
                                className={`flex items-center gap-1.5 px-4 py-2 border-r border-border-dark/50 cursor-pointer text-[10px] font-bold transition-all ${
                                  terminalTab === 'stdout'
                                    ? 'bg-[var(--ide-bg)] text-[#FF3366] border-t-2 border-t-[#FF3366]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--ide-header-bg)]/40'
                                }`}
                              >
                                <FileText className="w-3 h-3" /> CONSOLE STDOUT
                              </button>
                              <button
                                onClick={() => setTerminalTab('stderr')}
                                className={`flex items-center gap-1.5 px-4 py-2 border-r border-border-dark/50 cursor-pointer text-[10px] font-bold transition-all ${
                                  terminalTab === 'stderr'
                                    ? 'bg-[var(--ide-bg)] text-[#FF3366] border-t-2 border-t-[#FF3366]'
                                    : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--ide-header-bg)]/40'
                                }`}
                              >
                                <AlertTriangle className="w-3 h-3" /> ERRORS
                              </button>
                            </div>

                            {/* Pane Content */}
                            <div className="flex-1 p-4 bg-black text-slate-300 overflow-y-auto text-[11px] leading-relaxed">
                              {terminalTab === 'output' && (
                                <div className="space-y-3">
                                  <p className="text-[10px] text-[#FF3366] uppercase font-bold tracking-widest border-b border-border-dark/30 pb-1">Test Assertions</p>
                                  {terminalLogs?.results && terminalLogs.results.length > 0 ? (
                                    terminalLogs.results.map((r: any, idx: number) => (
                                      <div key={idx} className={`p-2.5 rounded border ${r.passed ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-red-950/20 border-red-800/30'}`}>
                                        <div className="flex items-center justify-between mb-1.5">
                                          <span className="font-bold text-[9px] uppercase">Case #{idx + 1}</span>
                                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${r.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {r.passed ? 'Passed' : 'Failed'}
                                          </span>
                                        </div>
                                        <div className="space-y-1 font-mono text-[10px] text-[var(--text-secondary)]">
                                          <p><span className="text-[var(--text-muted)]">Input:</span> {questions[activeQ]?.testCases[idx]?.input || idx + 1}</p>
                                          <p><span className="text-[var(--text-muted)]">Expected:</span> <code className="text-blue-400">{r.expected}</code></p>
                                          <p><span className="text-[var(--text-muted)]">Actual:</span> <code className={r.passed ? "text-emerald-400" : "text-red-400"}>{r.actual}</code></p>
                                          {r.error && <p className="text-red-400 mt-1"><span className="text-red-500 font-bold">Error:</span> {r.error}</p>}
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-[var(--text-muted)] italic">No compile logs available. Press Run to execute compilation.</p>
                                  )}
                                </div>
                              )}

                              {terminalTab === 'stdout' && (
                                <div className="font-mono whitespace-pre-wrap">
                                  {terminalLogs?.stdout || <span className="text-[var(--text-muted)] italic">Console output is empty.</span>}
                                </div>
                              )}

                              {terminalTab === 'stderr' && (
                                <div className="font-mono text-red-400 whitespace-pre-wrap">
                                  {terminalLogs?.stderr || <span className="text-[var(--text-muted)] italic">No compilation or execution errors.</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Collapsible AI stuck compiler diagnostic chat */}
              <AnimatePresence>
                {(showChat || showMentor) && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="bg-[var(--ide-bg)]/95 border border-border-dark/50 rounded-2xl flex flex-col overflow-hidden flex-shrink-0 z-20 font-mono text-[10px] shadow-md"
                  >
                    <div className="flex border-b border-border-dark bg-[var(--ide-header-bg)]/90">
                      <button
                        onClick={() => { setShowChat(true); setShowMentor(false); }}
                        className={`flex-1 py-3 font-bold uppercase transition-colors tracking-wider ${showChat
                            ? 'text-[#FF3366] bg-[var(--ide-bg)] border-b-2 border-[#FF3366]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                          }`}
                      >
                        <Bot className="w-3.5 h-3.5 inline mr-1" /> Diagnostic Bot
                      </button>
                      <button
                        onClick={() => { setShowMentor(true); setShowChat(false); }}
                        className={`flex-1 py-3 font-bold uppercase transition-colors tracking-wider ${showMentor
                            ? 'text-[#F59E0B] bg-[var(--ide-bg)] border-b-2 border-[#F59E0B]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                          }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Active Mentors
                      </button>
                    </div>

                    {showChat && (
                      <>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--ide-bg)]/40 scrollbar-none flex flex-col justify-end">
                          {chatMsgs.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'you' ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-[90%] px-3 py-2.5 rounded-lg border text-[10px] leading-relaxed ${msg.from === 'you'
                                    ? 'bg-[#3B82F6]/5 border-[#3B82F6]/30 text-[var(--text-primary)]'
                                    : msg.from === 'system'
                                      ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#A78BFA]'
                                      : 'bg-[var(--ide-header-bg)] border-border-dark/80 text-[var(--text-secondary)]'
                                  }`}
                              >
                                {msg.from === 'bot' && <Bot className="w-3.5 h-3.5 inline mr-1.5 text-[#10B981]" />}
                                {msg.text}
                                <span className="block text-[7px] text-[var(--text-muted)] mt-1 uppercase font-semibold">{msg.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 border-t border-border-dark/50 bg-[var(--ide-header-bg)] flex gap-2">
                          <input
                            value={chatInput}
                            onChange={e => setChatInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && sendChat()}
                            placeholder="QUERY DIAGNOSTIC BOT..."
                            className="flex-1 bg-[var(--ide-bg)] rounded-md px-3 py-2 text-[10px] text-[var(--text-primary)] outline-none border border-border-dark placeholder:text-[var(--text-secondary)] font-bold"
                          />
                          <button
                            onClick={sendChat}
                            className="p-2 rounded-md bg-[#3B82F6] hover:bg-[#3B82F6]/90 text-white border border-[#3B82F6] transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </>
                    )}

                    {showMentor && (
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--ide-bg)]/40 scrollbar-none">
                        <p className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-wider mb-2">LIVE MENTOR SHIELDS ONLINE</p>
                        {MENTORS.map((mt, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-dark-900 border border-border-dark font-mono">
                            <div className="w-9 h-9 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center text-[10px] font-black text-[#A78BFA]">
                              {mt.avatar}
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-tight">{mt.name}</p>
                              <p className="text-[8px] text-[var(--text-muted)] uppercase font-semibold">{mt.skill} // verified</p>
                            </div>
                            <button
                              disabled={mt.status !== 'online'}
                              className={`px-2.5 py-1.5 rounded-md text-[8px] font-bold uppercase border transition-colors ${mt.status === 'online'
                                  ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981] hover:bg-[#10B981]/25'
                                  : 'border-border-dark text-[var(--text-muted)]'
                                }`}
                            >
                              {mt.status === 'online' ? 'Connect' : 'Busy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ════ PHASE 3: COMPILATION AUDIT LOGS (RESULTS) ════ */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto p-6 md:p-10 bg-[var(--background)] relative flex items-center justify-center"
          >
            {/* Holographic matrix sparklers */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -120 - Math.random() * 150, x: (Math.random() - 0.5) * 400, scale: [0, 1.2, 0] }}
                transition={{ duration: 2.2, delay: i * 0.06 }}
                style={{
                  width: 5 + Math.random() * 6,
                  height: 5 + Math.random() * 6,
                  left: '50%',
                  top: '40%',
                  background: ['#FF3366', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][i % 5]
                }}
              />
            ))}

            <div className="max-w-2xl w-full text-center relative z-10 font-mono space-y-6">

              {/* Partner Peer avatars */}
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF3366] to-[#FF5E85] border border-[#FF3366]/40 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(255,51,102,0.2)]">
                  YOU
                </div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  className="w-10 h-10 rounded-full border border-[#10B981]/30 bg-[#10B981]/5 flex items-center justify-center shadow"
                >
                  <Heart className="w-4 h-4 text-[#10B981] fill-[#10B981]/20" />
                </motion.div>
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] border border-[#3B82F6]/40 flex items-center justify-center text-white text-base font-black shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  {partnerAvatar}
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> SESSION_TERMINATED_CLEAN
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)] uppercase tracking-tight">
                  COMPILATION_<span className="text-[#10B981]">AUDIT</span>_LOGS.TXT
                </h2>
                
                {/* Brand New Premium Pass/Fail Badge and Score */}
                <div className="mt-6 flex flex-col items-center justify-center p-6 glass-panel border border-border-dark rounded-xl max-w-md mx-auto space-y-4 shadow-xl">
                  <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest font-mono">FINAL EVALUATION</p>
                  <div className="flex items-center gap-6">
                    <div className="text-left font-mono">
                      <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider">ACCURACY SCORE</p>
                      <p className="text-4xl font-black text-[var(--text-primary)]">{finalScore}%</p>
                    </div>
                    <div className="w-px h-10 bg-border-dark" />
                    <div className={`px-5 py-2.5 rounded-lg text-lg font-black tracking-widest uppercase border ${
                      passedStatus === 'PASS' 
                        ? 'bg-[#10B981]/10 border-[#10B981]/40 text-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                        : 'bg-[#FF3366]/10 border-[#FF3366]/40 text-[#FF3366] shadow-[0_0_20px_rgba(255,51,102,0.15)]'
                    }`}>
                      {passedStatus}
                    </div>
                  </div>
                   <p className="text-[9px] text-[var(--text-secondary)] font-sans leading-relaxed">
                    {searchParams.get('mode') === 'mentor' ? (
                      passedStatus === 'PASS'
                        ? 'Congratulations! You have successfully passed the Mentor Assessment. Your account has been upgraded to Mentor status.'
                        : `Unfortunately, you did not meet the minimum mentor qualification score. You scored ${finalScore}/100. Minimum Required Score: 90/100. Redirecting back to Student Dashboard in 3 seconds...`
                    ) : (
                      passedStatus === 'PASS' 
                        ? 'Congratulations! Your code passed the strict security parameters and hidden test suites.' 
                        : 'Failure: Accuracy fell below the 70% threshold. Review edge cases and try again.'
                    )}
                  </p>
                </div>
              </div>

              {/* High Density HP/XP metrics list */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Tests Passed', val: passedCount, desc: 'passed suites', color: 'text-[#10B981]', border: 'border-[#10B981]/20' },
                  { label: 'Failed Checks', val: failedCount, desc: 'missed specs', color: 'text-[#FF3366]', border: 'border-[#FF3366]/20' },
                  { label: 'Role Swaps', val: roleSwaps, desc: 'balanced loops', color: 'text-[#8B5CF6]', border: 'border-[#8B5CF6]/20' },
                  { label: 'XP Telemetries', val: `+${hpEarned} HP`, desc: 'progression xp', color: 'text-[#F59E0B]', border: 'border-[#F59E0B]/20' }
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`rounded-lg p-4 bg-bg-dark-900 border ${s.border} text-center shadow-inner`}
                  >
                    <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-2">{s.label}</p>
                    <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                    <p className="text-[7px] text-[var(--text-muted)] uppercase mt-1 font-bold tracking-wider">{s.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Multi-pane code session diagnostics */}
              <div className="glass-panel border-border-dark rounded-xl overflow-hidden text-left shadow-lg">
                <div className="w-full flex justify-between py-2.5 border-b border-border-dark bg-[var(--ide-header-bg)]/80 px-4">
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase flex items-center gap-1.5 tracking-wider font-semibold">
                    <Laptop className="w-3.5 h-3.5 text-[#3B82F6]" /> COMPILER_METRIC_REPORT
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[8px] font-bold tracking-wider">COMPILATION: SUCCESS</span>
                </div>
                <div className="p-5 grid grid-cols-3 gap-4 text-center font-mono">
                  <div className="p-3 border border-border-dark bg-bg-dark-950/60 rounded-lg">
                    <p className="text-xl font-bold text-[var(--text-primary)]">{30 - mins}</p>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider mt-1">Minutes elapsed</p>
                  </div>
                  <div className="p-3 border border-border-dark bg-bg-dark-950/60 rounded-lg">
                    <p className="text-xl font-bold text-[var(--text-primary)]">{questions.length}</p>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider mt-1">Questions analyzed</p>
                  </div>
                  <div className="p-3 border border-border-dark bg-bg-dark-950/60 rounded-lg">
                    <p className="text-xl font-bold text-[var(--text-primary)]">{code.reduce((a, c) => a + c.split('\n').length, 0)}</p>
                    <p className="text-[8px] text-[var(--text-muted)] uppercase font-bold tracking-wider mt-1">Lines compiled</p>
                  </div>
                </div>
              </div>

              {/* Feedback Survey */}
              <div className="glass-panel border border-border-dark p-5 rounded-xl text-center space-y-4 shadow-lg">
                <div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider">COLLABORATIVE_EXPERIENCE_SURVEY</h4>
                  <p className="text-[9px] text-[var(--text-muted)] uppercase mt-0.5 font-semibold">// RATE THE QUALITY OF ACTIVE COMPONENT PEERS</p>
                </div>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} onClick={() => setFeedback(s)} className="transition-transform hover:scale-110">
                      <Star className="w-7 h-7" fill={s <= feedback ? '#F59E0B' : 'none'} color={s <= feedback ? '#F59E0B' : '#1E2333'} strokeWidth={1.5} />
                    </button>
                  ))}
                </div>
                {feedback > 0 && <p className="text-[9px] font-bold text-[#F59E0B] uppercase tracking-wider">{['', 'poor response telemetry', 'fair bandwidth alignment', 'good computational cooperation', 'great synergy factors', 'exceptional collaborative chemistry'][feedback]}</p>}
              </div>

              {/* CTA return routes */}
              <div className="flex gap-3 justify-center pt-2">
                {searchParams.get('mode') === 'mentor' ? (
                  passedStatus === 'PASS' ? (
                    <button
                      onClick={() => router.push(`/mentor/dashboard?status=success&score=${finalScore}`)}
                      className="btn-premium flex items-center gap-1.5 px-6 py-3 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Enter Mentor Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/mentor/dashboard?status=failed&score=${finalScore}`)}
                      className="btn-secondary-dev flex items-center gap-1.5 px-6 py-3 cursor-pointer"
                    >
                      <Home className="w-3.5 h-3.5" /> Return to Dashboard
                    </button>
                  )
                ) : (
                  <>
                    <button
                      onClick={() => router.push('/student/dashboard')}
                      className="btn-secondary-dev flex items-center gap-1.5 px-6 py-3"
                    >
                      <Home className="w-3.5 h-3.5" /> Return to Command Center
                    </button>
                    <button
                      onClick={() => router.push('/student/skill-assessment')}
                      className="btn-premium flex items-center gap-1.5 px-6 py-3"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Start New Session
                    </button>
                  </>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}

export default function CodingRoom() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[var(--ide-header-bg)] flex flex-col items-center justify-center font-mono text-xs text-[var(--text-muted)]">
        <p>INITIALIZING MULTIPLAYER SECURE TELNET SOCKET...</p>
      </div>
    }>
      <CodingRoomContent />
    </React.Suspense>
  );
}
