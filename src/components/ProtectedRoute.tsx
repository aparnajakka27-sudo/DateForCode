"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

function isProfileComplete(profile: any): boolean {
  if (!profile) return false;
  if (!profile.username || profile.username.trim() === '') return false;
  if (!profile.avatar || profile.avatar.trim() === '') return false;
  if (!profile.bio || profile.bio.trim() === '') return false;
  if (!profile.skills || profile.skills.length === 0) return false;
  return true;
}

export default function ProtectedRoute({ children, role }: { children: React.ReactNode, role: 'student' | 'mentor' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, profileError, refreshProfile } = useUser();

  useEffect(() => {
    // 1. Loading or Error -> Do not redirect yet
    if (loading || profileError) {
      return;
    }

    let dest = '';
    let reason = '';
    const isComplete = isProfileComplete(profile);
    const isProfileSetupPath = pathname.includes('/profile-setup');

    // 2. UNAUTHENTICATED
    if (!user) {
      if (pathname !== '/login') {
        dest = '/login';
        reason = 'User is null';
      }
    }
    // 3. EMAIL_NOT_VERIFIED
    else if (!user.emailVerified) {
      if (pathname !== '/email-verification') {
        dest = '/email-verification';
        reason = 'Email not verified';
      }
    }
    // 4. PROFILE_INCOMPLETE
    else if (!isComplete) {
      if (!isProfileSetupPath) {
        dest = `/${role}/profile-setup`;
        reason = 'Profile incomplete';
      }
    }
    // 5. PROFILE_COMPLETE
    else if (isComplete) {
      if (isProfileSetupPath) {
        dest = `/${role}/dashboard`;
        reason = 'Profile already complete';
      }
    }

    console.log(`
----------------------
CURRENT PATH: ${pathname}
PROFILE: ${profile ? JSON.stringify(profile).substring(0, 100) + '...' : 'null'}
USER: ${user ? user.uid : 'null'}
PROFILE EXISTS: ${!!profile}
PROFILE COMPLETE: ${isComplete}
REDIRECTING TO: ${dest || 'NONE'}
REASON: ${reason || 'N/A'}
----------------------`);

    if (dest) {
      router.replace(dest);
    }
  }, [user, profile, loading, profileError, pathname, router, role]);

  // Render Logic
  
  if (profileError) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-sans text-center px-4">
        <div className="flex flex-col items-center gap-4 max-w-md">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center text-2xl mb-2 font-bold">!</div>
          <h2 className="text-xl text-[var(--text-primary)] font-bold mb-2">Unable to load dashboard</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">{profileError}</p>
          <button 
            onClick={() => refreshProfile()}
            className="px-6 py-3 bg-[#FF4D8D] hover:bg-[#FF3366] text-white rounded-md font-bold transition-colors uppercase tracking-widest text-xs"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ONLY show loading screen if context is actively loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF4D8D]/20 border-t-[#FF4D8D] rounded-full animate-spin" />
          <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-bold font-mono">Warming engine core...</div>
        </div>
      </div>
    );
  }

  // STATE MACHINE BLOCKING
  // If we are about to redirect, return null so we don't flash content or infinite load
  if (!user) return null;
  if (!user.emailVerified) return null;
  
  const isProfileSetupPath = pathname.includes('/profile-setup');
  const isComplete = isProfileComplete(profile);
  
  if (!isComplete && !isProfileSetupPath) return null; // Waiting for router.replace to setup
  if (isComplete && isProfileSetupPath) return null; // Waiting for router.replace to dashboard

  return <>{children}</>;
}
