import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Get token (automatically refreshes if expired)
  let token = await user.getIdToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include'
  };

  let response = await fetch(url, config);

  // Retry once with a forced token refresh if the backend rejects the token
  if (response.status === 401 || response.status === 403) {
    try {
      const errorData = await response.clone().json();
      if (
        errorData.error === 'Session expired' || 
        errorData.error === 'Invalid or expired token' ||
        errorData.error === 'Token missing'
      ) {
        console.log('[fetchWithAuth] Token rejected, forcing refresh...');
        token = await user.getIdToken(true); // Force refresh
        
        // Re-construct headers with new token
        const retryHeaders = {
          ...headers,
          'Authorization': `Bearer ${token}`
        };
        
        response = await fetch(url, { ...config, headers: retryHeaders });
        
        // If it still fails, sign out
        if (response.status === 401 || response.status === 403) {
           console.error('[fetchWithAuth] Token refresh failed, logging out...');
           await signOut(auth);
           if (typeof window !== 'undefined') window.location.href = '/login?error=session_expired';
        }
      }
    } catch (e) {
      // Ignore JSON parse errors on clone
    }
  }

  return response;
}
