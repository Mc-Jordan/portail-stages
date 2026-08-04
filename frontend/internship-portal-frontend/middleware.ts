import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from localStorage (Zustand persist stores it there)
  // Since middleware runs on server, we need to check cookies or headers
  const authCookie = request.cookies.get('auth-storage')?.value;
  
  let isAuthenticated = false;
  let userRole = null;
  
  if (authCookie) {
    try {
      const authData = JSON.parse(authCookie);
      isAuthenticated = authData.state?.isAuthenticated || false;
      userRole = authData.state?.user?.role;
    } catch (error) {
      // Invalid cookie data
    }
  }
  
  // Protected routes that require authentication
  const protectedRoutes = ['/student', '/company', '/teacher', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // If accessing protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If accessing login while authenticated, redirect to appropriate dashboard
  if (pathname === '/login' && isAuthenticated && userRole) {
    const redirectPath = getRedirectPath(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  
  // Redirect root to login if not authenticated, or to dashboard if authenticated
  if (pathname === '/' && isAuthenticated && userRole) {
    const redirectPath = getRedirectPath(userRole);
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } else if (pathname === '/' && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

function getRedirectPath(role: string): string {
  switch (role) {
    case 'STUDENT':
      return '/student/offers';
    case 'COMPANY':
      return '/company/dashboard';
    case 'TEACHER':
      return '/teacher/agreements';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/login';
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
