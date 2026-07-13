"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Info, ArrowLeft, X, AlertTriangle, ShieldAlert, Check, RefreshCw, KeyRound, UserMinus } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, signOut, deleteUser } from 'firebase/auth';
import { doc, deleteDoc, addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AccountTab() {
  const router = useRouter();
  const [email] = useState(auth.currentUser?.email || 'Not connected');
  const [showPwModal, setShowPwModal] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isPersonal, setIsPersonal] = useState(false);
  const [showConvertMsg, setShowConvertMsg] = useState(false);
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const d = localStorage.getItem('dateforcode_account');
    if (d) {
      const p = JSON.parse(d);
      setIsPersonal(p.isPersonal || false);
      setCollege(p.college || '');
      setYear(p.year || '');
      setFullName(p.fullName || '');
    }
  }, []);

  const handleSaveAccount = () => {
    localStorage.setItem('dateforcode_account', JSON.stringify({ isPersonal, college, year, fullName }));
  };

  const handleChangePw = async () => {
    setPwError(''); setPwSuccess(false);
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    try {
      const user = auth.currentUser;
      if (!user || !user.email) { setPwError('No user signed in'); return; }
      const cred = EmailAuthProvider.credential(user.email, oldPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setPwSuccess(true);
      setTimeout(() => {
        setShowPwModal(false);
        setPwSuccess(false);
        setOldPw('');
        setNewPw('');
      }, 1500);
    } catch {
      setPwError('Old password is incorrect or session expired');
    }
  };

  const handleConvert = () => {
    const newVal = !isPersonal;
    setIsPersonal(newVal);
    localStorage.setItem('dateforcode_account', JSON.stringify({ isPersonal: newVal, college, year, fullName }));
    if (newVal) setShowConvertMsg(true);
  };

  const handleDeactivate = async () => {
    localStorage.setItem('dateforcode_deactivated', 'true');
    await signOut(auth);
    router.push('/');
  };

  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        // 1. Delete associated records in Firestore
        await deleteDoc(doc(db, 'users', user.uid));
        
        // 2. Log deletion event to administrative logs
        await addDoc(collection(db, 'admin_logs'), {
          eventType: 'ACCOUNT_DELETED',
          email: user.email || 'Unknown',
          details: `User permanently deleted account. UID: ${user.uid}`,
          timestamp: Date.now(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : "Server"
        });

        // 3. Delete Firebase Auth credentials
        await deleteUser(user);
      }
    } catch (e) {
      console.error("Account deletion failed:", e);
    } finally {
      // 4. Wipe active local storage sessions and redirect
      localStorage.clear();
      await signOut(auth);
      router.push('/');
    }
  };

  return (
    <motion.div key="account" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h2 className="text-xl font-bold font-mono tracking-tight text-[var(--text-primary)] mb-2">
        <span className="text-[#FF3366] mr-2">&gt;_</span>Account Management
      </h2>
      <p className="text-sm text-[var(--text-secondary)] mb-8 font-mono">Configure credentials, workspace parameters, and account scopes.</p>

      <div className="bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-xl p-8 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF3366]/[0.02] rounded-full blur-[80px] pointer-events-none" />

        {/* Email */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 block font-mono">System credentials</label>
          <div className="max-w-md">
            <label className="text-[10px] text-[#FF3366] font-mono mb-1 block">REGISTERED_EMAIL_URI</label>
            <input
              type="text"
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-lg border border-[var(--ide-border)] text-sm bg-[var(--background)] text-[var(--text-secondary)] font-mono cursor-not-allowed opacity-75 focus:outline-none"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center justify-between max-w-md pb-6 border-b border-[var(--ide-border)]">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block font-mono">AUTHENTICATION_KEY</label>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-mono tracking-widest">••••••••</p>
          </div>
          <button
            onClick={() => setShowPwModal(true)}
            className="btn-secondary-dev text-xs flex items-center gap-1.5 py-2 px-4"
          >
            <KeyRound className="w-3.5 h-3.5" /> Rekey
          </button>
        </div>

        {/* Convert Account */}
        <div className="pb-6 border-b border-[var(--ide-border)]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2 block font-mono">ACCOUNT_SCOPE_PROTOCOL</label>
          <p className="text-xs text-[var(--text-secondary)] mb-4 font-mono">
            {isPersonal
              ? 'CURRENT_SCOPE: PERSONAL (Restricted matched networking & mentor interactions).'
              : 'CURRENT_SCOPE: BUSINESS (Enabled high-density pairing, collaborative arenas, & active guidance).'}
          </p>
          <button
            onClick={handleConvert}
            className="btn-secondary-dev text-xs flex items-center gap-1.5 py-2 px-4 hover:border-[#FF3366] hover:text-[var(--text-primary)]"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isPersonal ? 'Activate Premium Matching' : 'Convert Scope'}
          </button>
          <AnimatePresence>
            {showConvertMsg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 rounded-lg bg-[var(--ide-header-bg)] border border-amber-500/20 dark:border-[#F59E0B]/30 text-xs text-[var(--text-secondary)] font-mono"
              >
                <div className="flex items-center gap-2 mb-2 text-[#F59E0B]">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="font-bold">WARNING: CRITICAL PROTOCOLS SUSPENDED</p>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[var(--text-secondary)]">
                  <li>Matching Arenas — Collaborative multiplayer pairing deactivated</li>
                  <li>Elite Guidance — Stuck escalation triggers disconnected</li>
                </ul>
                <p className="mt-2 text-xs text-[var(--text-muted)]">&gt;_ Toggle Account Scope to restore absolute platform telemetry.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Personal Information */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 block font-mono">METADATA_REGISTRY</label>
          <div className="space-y-4 max-w-md">
            <div>
              <label className="text-[10px] text-[var(--text-secondary)] font-mono mb-1 block">FULL_NAME</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#FF3366] focus:ring-1 focus:ring-[#FF3366]/20 transition-all bg-[var(--background)] font-mono"
                placeholder="Ex: Alan Turing"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-secondary)] font-mono mb-1 block">AFFILIATION_OR_COLLEGE</label>
              <input
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#FF3366] focus:ring-1 focus:ring-[#FF3366]/20 transition-all bg-[var(--background)] font-mono"
                placeholder="Ex: Cambridge University"
              />
            </div>
            <div>
              <label className="text-[10px] text-[var(--text-secondary)] font-mono mb-1 block">YEAR_OF_STUDY</label>
              <select
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#FF3366] transition-all bg-[var(--background)] font-mono"
              >
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Deactivation & Deletion */}
        <div className="pt-6 border-t border-[var(--ide-border)]">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4 block font-mono">DANGER_ZONE_FUNCTIONS</label>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-[var(--ide-border)] bg-amber-500/5 dark:bg-[#1A1513]">
              <div>
                <p className="text-sm font-bold text-[var(--text-secondary)] font-mono">Deactivate telemetry</p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">Temporarily offline developer node. Restore at login.</p>
              </div>
              <button
                onClick={() => setShowDeactivate(true)}
                className="px-4 py-2 rounded border border-amber-500/20 dark:border-[#F59E0B]/30 hover:border-[#F59E0B] text-[#F59E0B] text-[10px] font-mono font-bold uppercase transition-colors"
              >
                Deactivate
              </button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 dark:border-red-950 bg-red-500/5 dark:bg-[#1A0E0F]">
              <div>
                <p className="text-sm font-bold text-red-500 font-mono font-bold">WIPE_NODE_DATA</p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1">Permanently erase profile registry, XP scores, and streaks.</p>
              </div>
              <button
                onClick={() => setShowDelete(true)}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-[var(--text-primary)] text-[10px] font-mono font-bold uppercase transition-colors"
              >
                Wipe Registry
              </button>
            </div>
          </div>
        </div>

        {/* Reset & Save */}
        <div className="flex items-center gap-3 pt-6 border-t border-[var(--ide-border)]">
          <button
            onClick={() => { setFullName(''); setCollege(''); setYear(''); }}
            className="btn-secondary-dev flex items-center gap-1.5"
          >
            Reset
          </button>
          <button
            onClick={handleSaveAccount}
            className="btn-premium flex items-center gap-1.5"
          >
            Save Registry
          </button>
        </div>
      </div>

      {/* ═══ Password Modal ═══ */}
      <AnimatePresence>
        {showPwModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => { setShowPwModal(false); setPwError(''); setOldPw(''); setNewPw(''); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[var(--background)] border border-[var(--ide-border)] rounded-xl shadow-2xl z-50 p-8 noise-bg"
            >
              <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#FF3366]" /> CHANGE_KEY_SET
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-mono text-[var(--text-secondary)]">OLD_PASSWORD_HASH</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showOld ? 'text' : 'password'}
                      value={oldPw}
                      onChange={e => setOldPw(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#FF3366] transition-all bg-[var(--ide-bg)] font-mono"
                    />
                    <button
                      onClick={() => setShowOld(!showOld)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-[var(--text-secondary)] mb-1.5 block">NEW_PASSWORD_HASH</label>
                  <div className="relative">
                    <input
                      type={showNew ? 'text' : 'password'}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-[var(--ide-border)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#FF3366] transition-all bg-[var(--ide-bg)] font-mono"
                    />
                    <button
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono mt-1.5">&gt;_ Requires 8+ alphanumeric characters.</p>
                </div>
                <button
                  onClick={() => setShowTips(true)}
                  className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <Info className="w-3.5 h-3.5" /> SECURE_COMPLIANCE_TIPS
                </button>
                {pwError && <p className="text-xs text-red-500 font-mono font-bold mt-2">&gt;_ ERROR: {pwError}</p>}
                {pwSuccess && <p className="text-xs text-green-500 font-mono font-bold mt-2">&gt;_ SUCCESS: Telemetry updated.</p>}
              </div>
              <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-[var(--ide-border)]">
                <button
                  onClick={() => { setShowPwModal(false); setPwError(''); setOldPw(''); setNewPw(''); }}
                  className="btn-secondary-dev text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePw}
                  disabled={!oldPw || !newPw}
                  className="btn-premium text-xs font-mono disabled:opacity-30 disabled:pointer-events-none"
                >
                  Apply Key
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Password Tips Modal ═══ */}
      <AnimatePresence>
        {showTips && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setShowTips(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[var(--background)] border border-[var(--ide-border)] rounded-xl shadow-2xl z-[60] p-8"
            >
              <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-[#F59E0B]" /> SEC_REQUIREMENTS
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4 font-mono leading-relaxed">
                We strongly enforce cryptographic rigor. To avoid dictionary scanning hazards:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-secondary)] font-mono mb-6">
                <li>Avoid dates, usernames, or basic dictionary patterns.</li>
                <li>Incorporate special syntax signals ($, @, _, /).</li>
                <li>Avoid overlapping keys used in outer web domains.</li>
              </ul>
              <button
                onClick={() => setShowTips(false)}
                className="w-full py-3 rounded bg-gradient-to-r from-[#FF3366] to-[#FF4D6D] text-[var(--text-primary)] text-xs font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-all"
              >
                Acknowledge Protocol
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Deactivate Modal ═══ */}
      <AnimatePresence>
        {showDeactivate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowDeactivate(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg bg-[var(--background)] border border-[var(--ide-border)] rounded-xl shadow-2xl p-10 text-center relative noise-bg">
                <button
                  onClick={() => setShowDeactivate(false)}
                  className="absolute top-6 left-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold font-mono text-[var(--text-primary)] mb-4 flex items-center justify-center gap-2">
                  <UserMinus className="w-6 h-6 text-[#F59E0B]" /> DEACTIVATE_NODE
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mb-8 max-w-sm mx-auto font-mono leading-relaxed">
                  Initiating profile telemetry suspension. This will isolate this node, stopping all matches and active sessions.
                </p>
                <div className="bg-[var(--ide-bg)] border border-[var(--ide-border)] rounded-lg p-6 mb-8 inline-block text-left font-mono">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--ide-header-bg)] border border-[var(--ide-border)] flex items-center justify-center">
                      <span className="text-xs">💾</span>
                    </div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">
                      @{JSON.parse(localStorage.getItem('dateforcode_profile') || '{}').username || 'user'}
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-normal">
                    Node credentials remain stored. Re-log at any interval to instantly re-boot telemetry:
                  </p>
                  <p className="text-xs font-bold mt-2 text-[#FF3366]">{auth.currentUser?.email}</p>
                </div>
                <div>
                  <button
                    onClick={handleDeactivate}
                    className="btn-premium px-8 py-3 uppercase tracking-wider font-mono text-xs"
                  >
                    Confirm Telemetry Pause
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══ Delete Modal ═══ */}
      <AnimatePresence>
        {showDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowDelete(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-lg bg-[var(--ide-header-bg)] border border-[#EF4444]/30 rounded-xl shadow-2xl p-10 text-center relative noise-bg">
                <button
                  onClick={() => setShowDelete(false)}
                  className="absolute top-6 left-6 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                <h2 className="text-xl font-bold font-mono text-red-500 mb-4 uppercase">
                  WIPE_ALL_NODE_REGISTRY
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-sm mx-auto font-mono leading-relaxed">
                  Executing permanent account deletion sequence. This will wipe all XP metrics, streaks, matched logs, diagnostic skill reports, and cloud credentials.
                </p>
                <p className="text-xs text-red-500 font-bold font-mono mb-8 uppercase tracking-widest animate-pulse">
                  WARNING: THIS ACTION CANNOT BE UNDONE.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => setShowDelete(false)}
                    className="btn-secondary-dev text-xs font-mono py-3 px-6"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 rounded bg-red-600 hover:bg-red-700 text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    WIPE TELEMETRY FOREVER
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
