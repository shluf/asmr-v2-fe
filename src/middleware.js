import { NextResponse } from 'next/server';

export function middleware(request) {
  // Cara yang lebih aman untuk mengakses cookie
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;
  
  // Parse token untuk mendapatkan role (asumsi JWT)
  let userRole = null;
  if (authToken) {
    try {
      // Decode token (bagian ini hanya untuk token simple)
      // Pada implementasi sebenarnya, gunakan JWT decode yang lebih aman
      const tokenParts = authToken.split('.');
      if (tokenParts.length > 1) {
        const payload = JSON.parse(atob(tokenParts[1]));
        userRole = payload.role; // Asumsikan struktur token menyimpan role
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
  }
  
  // Definisikan halaman-halaman yang termasuk auth pages 
  // dengan format Next.js App Router
  const isAuthPage = [
    '/login',
    '/register',
    '/forgot-password',
    '/password-reset',
  ].some(path => request.nextUrl.pathname === path);
  
  // Definisikan halaman-halaman yang bisa diakses tanpa login
  const isGuestPage = [
    '/',
    '/verify-email',
  ].some(path => request.nextUrl.pathname === path);
  
  // Cek apakah ini adalah halaman dashboard spesifik
  // Menggunakan pattern matching untuk App Router
  const isDashboardAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isDashboardRT = request.nextUrl.pathname.startsWith('/rt');
  const isDashboardRW = request.nextUrl.pathname.startsWith('/rw');
  const isDashboardWarga = request.nextUrl.pathname.startsWith('/warga');
  
  // Pemetaan role dan path yang diizinkan
  const rolePathMap = {
    admin: ['/admin'],
    warga: ['/warga'],
    pejabatrt: ['/rt'],
    pejabatrw: ['/rw']
  };
  
  // Jika halaman memerlukan auth tapi user tidak terotentikasi
  if (!isAuthenticated && !isAuthPage && !isGuestPage) {
    // Simpan intended URL di query string untuk redirect setelah login
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
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Verifikasi akses berdasarkan role untuk halaman terbatas
  if (isAuthenticated && userRole) {
    // Jika mencoba akses dashboard yang bukan untuk role-nya
    if (
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
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Buat response default
  const response = NextResponse.next();
  
  // Tambahkan header auth jika ada token
  if (authToken) {
    response.headers.set('Authorization', `Bearer ${authToken}`);
  }

  // Log untuk debugging (jangan gunakan di production)
  // console.log(`Path: ${request.nextUrl.pathname}, Authenticated: ${isAuthenticated}`);

  return response;
}

export const config = {
  matcher: [
    // Jangan intercept API routes, _next static files, dll.
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
};