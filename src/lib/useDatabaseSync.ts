"use client";

import { useEffect, useRef } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export function useDatabaseSync() {
  const lastSyncRef = useRef<string>("");
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Associate device with only this active user account
        localStorage.setItem('dateforcode_active_device_uid', user.uid);
        
        try {
          isSyncingRef.current = true;
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            
            // Restore all previous data to localStorage
            if (data.profile) {
              localStorage.setItem('dateforcode_profile', JSON.stringify(data.profile));
            } else {
              localStorage.removeItem('dateforcode_profile');
            }

            if (data.studentSetup) {
              localStorage.setItem('dateforcode_student_setup', data.studentSetup);
            } else {
              localStorage.removeItem('dateforcode_student_setup');
            }

            if (data.mentorProfile) {
              localStorage.setItem('dateforcode_mentor_profile', JSON.stringify(data.mentorProfile));
            } else {
              localStorage.removeItem('dateforcode_mentor_profile');
            }

            if (data.account) {
              localStorage.setItem('dateforcode_account', JSON.stringify(data.account));
            } else {
              localStorage.removeItem('dateforcode_account');
            }

            if (data.deactivated) {
              localStorage.setItem('dateforcode_deactivated', data.deactivated);
            } else {
              localStorage.removeItem('dateforcode_deactivated');
            }

            if (data.theme) {
              localStorage.setItem('theme', data.theme);
              if (data.theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            }
          } else {
            // First time registration: Create record in database
            const profile = localStorage.getItem('dateforcode_profile');
            const studentSetup = localStorage.getItem('dateforcode_student_setup');
            const mentorProfile = localStorage.getItem('dateforcode_mentor_profile');
            const account = localStorage.getItem('dateforcode_account');
            const deactivated = localStorage.getItem('dateforcode_deactivated');
            const theme = localStorage.getItem('theme') || 'light';

            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              profile: profile ? JSON.parse(profile) : null,
              studentSetup: studentSetup || null,
              mentorProfile: mentorProfile ? JSON.parse(mentorProfile) : null,
              account: account ? JSON.parse(account) : null,
              deactivated: deactivated || null,
              theme: theme,
              updatedAt: Date.now()
            });
          }

          // Update hash reference of last synced state
          lastSyncRef.current = getLocalStateHash();
        } catch (e) {
          console.error("Error restoring user session:", e);
        } finally {
          isSyncingRef.current = false;
        }
      } else {
        // Clear active device uid on sign out
        localStorage.removeItem('dateforcode_active_device_uid');
        lastSyncRef.current = "";
      }
    });

    return () => unsubscribe();
  }, []);

  // Periodic LocalStorage changes synchronization
  useEffect(() => {
    const syncInterval = setInterval(async () => {
      const user = auth.currentUser;
      if (!user || isSyncingRef.current) return;

      const currentHash = getLocalStateHash();
      if (currentHash !== lastSyncRef.current) {
        // Local state has changes, upload immediately
        try {
          isSyncingRef.current = true;
          const userDocRef = doc(db, 'users', user.uid);

          const profile = localStorage.getItem('dateforcode_profile');
          const studentSetup = localStorage.getItem('dateforcode_student_setup');
          const mentorProfile = localStorage.getItem('dateforcode_mentor_profile');
          const account = localStorage.getItem('dateforcode_account');
          const deactivated = localStorage.getItem('dateforcode_deactivated');
          const theme = localStorage.getItem('theme') || 'light';

          await updateDoc(userDocRef, {
            profile: profile ? JSON.parse(profile) : null,
            studentSetup: studentSetup || null,
            mentorProfile: mentorProfile ? JSON.parse(mentorProfile) : null,
            account: account ? JSON.parse(account) : null,
            deactivated: deactivated || null,
            theme: theme,
            updatedAt: Date.now()
          });

          lastSyncRef.current = currentHash;
        } catch (e) {
          console.error("Error synchronizing changes to database:", e);
        } finally {
          isSyncingRef.current = false;
        }
      }
    }, 1500);

    return () => clearInterval(syncInterval);
  }, []);
}

// Helper to generate a fingerprint hash of local storage states
function getLocalStateHash(): string {
  const profile = localStorage.getItem('dateforcode_profile') || "";
  const studentSetup = localStorage.getItem('dateforcode_student_setup') || "";
  const mentorProfile = localStorage.getItem('dateforcode_mentor_profile') || "";
  const account = localStorage.getItem('dateforcode_account') || "";
  const deactivated = localStorage.getItem('dateforcode_deactivated') || "";
  const theme = localStorage.getItem('theme') || "light";

  return `${profile}|${studentSetup}|${mentorProfile}|${account}|${deactivated}|${theme}`;
}
