"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface UserProfile {
  username: string;
  avatar: string;
  skills: string[];
  bio: string;
  college?: string;
  techStack?: string[];
}

interface UserContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  profileError: string | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  loading: true,
  profileError: null,
  setProfile: () => {},
  refreshProfile: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const hasFetchedProfile = useRef(false);
  const isAuthInitialized = useRef(false);

  const fetchProfile = async (currentUser: FirebaseUser, force = false) => {
    if (hasFetchedProfile.current && !force) return;
    
    console.log("[AUTH] Fetching profile for user:", currentUser.uid);
    setProfileError(null);
    
    try {
      const token = await currentUser.getIdToken();
      
      const fetchPromise = fetch('/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // 30-second timeout to allow Next.js API route cold starts to compile
      const timeoutPromise = new Promise<Response>((_, reject) => {
        setTimeout(() => reject(new Error('Profile fetch timed out (30s)')), 30000);
      });

      const res = await Promise.race([fetchPromise, timeoutPromise]);

      if (res.ok) {
        const data = await res.json();
        console.log("PROFILE FROM API:", data.profile);
        setProfile(data.profile); // Will be null if new user
        hasFetchedProfile.current = true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("[AUTH] Failed to fetch profile. Status:", res.status, errorData);
        setProfileError(errorData.error || 'Failed to fetch profile from server');
        setProfile(null);
      }
    } catch (err: any) {
      console.error("[AUTH] Error in fetchProfile:", err);
      setProfileError(err.message || 'An unexpected error occurred while fetching profile');
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      await fetchProfile(user, true);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("[AUTH] Initializing onAuthStateChanged listener");
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("[AUTH] Auth state changed. User:", currentUser ? currentUser.uid : 'null');
      setUser(currentUser);
      
      try {
        if (currentUser) {
          await fetchProfile(currentUser);
        } else {
          setProfile(null);
          setProfileError(null);
          hasFetchedProfile.current = false;
        }
      } finally {
        if (!isAuthInitialized.current) {
          console.log("[AUTH] Initial load complete. Setting loading to false.");
          isAuthInitialized.current = true;
        }
        setLoading(false);
      }
    });

    return () => {
      console.log("[AUTH] Cleaning up onAuthStateChanged listener");
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, profile, loading, profileError, setProfile, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
