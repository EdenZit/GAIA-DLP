import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Get the authentication token from the request
    const token = req.nextauth.token;
    
    // Get the current path being accessed
    const path = req.nextUrl.pathname;

    // Check if user is authenticated
    const isAuthenticated = !!token;

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && (path === '/login' || path === '/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // Role-based access control
    // Only allow instructors to access /instructor routes
    if (path.startsWith('/instructor') && token?.role !== 'instructor') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Only allow admins to access /admin routes
    if (path.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // If all checks pass, allow the request to proceed
    return NextResponse.next();
  },
  {
    callbacks: {
      // Only proceed if we have a token (user is authenticated)
      authorized: ({ token }) => !!token
    }
  }
);

// Define which routes should be protected by this middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/instructor/:path*', 
    '/admin/:path*',
    '/login',
    '/register'
  ]
};
