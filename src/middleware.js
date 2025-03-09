import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;
  const isAuthPage = request.nextUrl.pathname === '/login' || 
                     request.nextUrl.pathname === '/register' ||
                     request.nextUrl.pathname === '/forgot-password' ||
                     request.nextUrl.pathname === '/password-reset';
  const isGuestPage = request.nextUrl.pathname === '/' ||
                      request.nextUrl.pathname === '/verify-email';

  if (!isAuthenticated && !isAuthPage && !isGuestPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const response = NextResponse.next();
  
  if (authToken) {
    response.headers.set('Authorization', `Bearer ${authToken}`);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets).*)'],
};