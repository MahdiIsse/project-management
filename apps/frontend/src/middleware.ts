import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthenticated = !!authToken;
  
  const pathname = request.nextUrl.pathname;
  
  const publicRoutes = ['/login', '/signup'];
  const protectedRoutes = ['/dashboard'];
  const isPublicRoute = publicRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (pathname === '/') {
    const redirectUrl = isAuthenticated 
      ? new URL('/dashboard', request.url)
      : new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  if (isAuthenticated) {
    if (isPublicRoute) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    
    // Allow access to protected routes
    if (isProtectedRoute) {
      return NextResponse.next();
    }
  }
  
  if (!isAuthenticated) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    
    if (isProtectedRoute) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}