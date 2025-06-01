import { NextResponse } from 'next/server';
import { extractJwtPayload } from './lib/jwt';

export function middleware(request) {
  // Get the auth token from cookies
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;
  
  let userRole = null;
  if (authToken) {
    try {
      const payload = extractJwtPayload(authToken);
      if (payload) {
        userRole = payload.role.toLowerCase();
      }
    } catch (error) {
      console.error('Error getting user role:', error);
    }
  }
  
  // halaman-halaman yang tidak bisa diakses setelah login
  const isAuthPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/password-reset',
  ].some(path => request.nextUrl.pathname === path);
  
  // halaman-halaman yang bisa diakses tanpa login
  const isGuestPage = [
    '/',
    '/verify-email',
  ].some(path => request.nextUrl.pathname === path);
  
  const isDashboardAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardRT = request.nextUrl.pathname.startsWith('/rt');
  const isDashboardRW = request.nextUrl.pathname.startsWith('/rw');
  const isDashboardWarga = request.nextUrl.pathname.startsWith('/warga');
  const isDashboard = request.nextUrl.pathname === '/dashboard';
  
  const rolePathMap = {
    admin: ['/admin'],
    warga: ['/warga'],
    pejabatrt: ['/rt'],
    pejabatrw: ['/rw']
  };
  
  // Jika halaman memerlukan auth tapi user tidak terotentikasi
  if (!isAuthenticated && !isAuthPage && !isGuestPage) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Jika user sudah login tapi mencoba akses halaman auth
  if (isAuthenticated && isAuthPage) {
    // Redirect ke dashboard sesuai role
    if (userRole && rolePathMap[userRole]) {
      return NextResponse.redirect(new URL(rolePathMap[userRole][0], request.url));
    }
    // Fallback ke homepage jika role tidak valid
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verifikasi akses berdasarkan role untuk halaman terbatas
  if (isAuthenticated && userRole) {
    if (
      (isDashboard) ||
      (isDashboardAdmin && userRole !== 'admin') ||
      (isDashboardRT && userRole !== 'pejabatrt') ||
      (isDashboardRW && userRole !== 'pejabatrw') ||
      (isDashboardWarga && userRole !== 'warga')
    ) {
      // Redirect ke dashboard berdasarkan role mereka
      if (rolePathMap[userRole]) {
        return NextResponse.redirect(new URL(rolePathMap[userRole][0], request.url));
      }
      // Fallback ke homepage
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Buat response default
  const response = NextResponse.next();
  
  // Tambahkan header auth jika ada token
  if (authToken) {
    response.headers.set('Authorization', `Bearer ${authToken}`);
  }

  // Log untuk debugging 
  // console.log(`Path: ${request.nextUrl.pathname}, Authenticated: ${isAuthenticated}`);

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};