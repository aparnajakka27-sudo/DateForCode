import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT (Must match the one in jwt.ts, ideally from env)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}
const key = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  let decodedToken: any = null;
  let isAuthenticated = false;

  // Try to verify the token
  if (sessionCookie) {
    try {
      const { payload } = await jwtVerify(sessionCookie, key);
      decodedToken = payload;
      isAuthenticated = true;
    } catch (err) {
      // Invalid or expired token
      isAuthenticated = false;
    }
  }

  const role = decodedToken?.role || 'user';
  
  // Define route categories
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login' || pathname === '/register';
  const isMentorRoute = pathname.startsWith('/mentor');
  const isStudentRoute = pathname.startsWith('/student');
  const isProtectedRoute = isStudentRoute || isMentorRoute;

  // Helper for dashboard redirect
  const getDashboardUrl = () => {
    return new URL(role === 'mentor' ? '/mentor/dashboard' : '/student/dashboard', request.url);
  };

  // 1. Unauthenticated Users
  if (!isAuthenticated) {
    if (isProtectedRoute || pathname === '/email-verification') {
      return NextResponse.redirect(new URL('/login?error=session_expired', request.url));
    }
    // Allow access to landing page, login, register, public routes
    return NextResponse.next();
  }

  // 2. Authenticated Users flow
  
  // A. Hitting Login or Register Page while authenticated
  if (isLoginPage) {
    return NextResponse.redirect(getDashboardUrl());
  }

  // B. Hitting Protected Routes (Role Verification)
  if (isProtectedRoute) {
    // Mentor Access Control check
    if (isMentorRoute && role !== 'mentor' && role !== 'owner') {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Ensure middleware only runs on necessary routes to save edge computing time
export const config = {
  matcher: [
    '/', 
    '/login', 
    '/register',
    '/email-verification',
    '/student/:path*', 
    '/mentor/:path*'
  ],
};
