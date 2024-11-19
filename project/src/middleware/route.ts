import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil cookie autentikasi dan peran pengguna
  const token = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const path = request.nextUrl.pathname;

  // Jika tidak ada token dan bukan halaman login, redirect ke "/login"
  if (!token && path !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login
  if (path === '/login' && token && userRole) {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    if (userRole === 'sales') return NextResponse.redirect(new URL('/sales/dashboard', request.url));
    if (userRole === 'customer') return NextResponse.redirect(new URL('/customer/dashboard', request.url));
  }

  // Jika ada token, periksa akses berdasarkan peran
  if (token && userRole) {
    const adminPaths = ['/admin', '/admin/dashboard'];
    const salesPaths = ['/sales', '/sales/dashboard'];
    const customerPaths = ['/customer', '/customer/dashboard'];

    if (userRole === 'admin' && !adminPaths.some((p) => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (userRole === 'sales' && !salesPaths.some((p) => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/sales/dashboard', request.url));
    }
    if (userRole === 'customer' && !customerPaths.some((p) => path.startsWith(p))) {
      return NextResponse.redirect(new URL('/customer/dashboard', request.url));
    }
  }

  // Jika semua pemeriksaan lolos, izinkan permintaan berlanjut
  return NextResponse.next();
}

// Konfigurasi middleware untuk mencakup semua halaman kecuali API dan file statis
export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'],
};
