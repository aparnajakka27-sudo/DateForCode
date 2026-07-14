import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT (Must match the one in jwt.ts, ideally from env)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}
const key = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
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
  const email = decodedToken?.email || '';
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aparnajakka27@gmail.com').trim().toLowerCase();
  
  // Define route categories
  const isLandingPage = pathname === '/';
  const isLoginPage = pathname === '/login' || pathname === '/register';
  const isAdminRoute = pathname.startsWith('/admin');
  const isMentorRoute = pathname.startsWith('/mentor');
  const isStudentRoute = pathname.startsWith('/student');
  const isProtectedRoute = isStudentRoute || isMentorRoute || isAdminRoute;

  // 1. If hitting Landing Page or Login Page while authenticated, redirect to proper dashboard instantly
  if (isAuthenticated && (isLandingPage || isLoginPage)) {
    if (email === adminEmail || role === 'owner') {
      return NextResponse.redirect(new URL('/admin', request.url));
    } else if (role === 'mentor') {
      return NextResponse.redirect(new URL('/mentor/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
  }

  // 2. If hitting protected routes without authentication, redirect to login
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login?error=session_expired', request.url));
  }

  // 3. Strict Admin Access Control
  if (isAdminRoute) {
    if (email !== adminEmail && role !== 'owner') {
      // Access denied, redirect to user dashboard
      return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
  }

  // 4. Mentor Access Control (Optional strict checking, assumes role === mentor)
  if (isMentorRoute && role !== 'mentor' && role !== 'owner') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url));
  }

  return NextResponse.next();
}

// Ensure middleware only runs on necessary routes to save edge computing time
export const config = {
  matcher: [
    '/', 
    '/login', 
    '/register',
    '/admin/:path*', 
    '/student/:path*', 
    '/mentor/:path*'
  ],
};
