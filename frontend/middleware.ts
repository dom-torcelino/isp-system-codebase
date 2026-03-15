import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Why: Extract the secure HTTP-only cookie set by our auth Server Action.
  const token = request.cookies.get('jwt_token')?.value;
  
  const currentPath = request.nextUrl.pathname;
  
  // Why: Define explicitly public paths that do not require authentication.
  const isPublicPath = currentPath === '/login' || currentPath === '/forgot-password';

  if (!token && !isPublicPath) {
    // Why: The user is trying to access a protected dashboard route without a token.
    // Redirect them to the login page, preserving the original URL they tried to visit (optional enhancement).
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && isPublicPath) {
    // Why: The user already has a session but is trying to view the login page.
    // Push them directly into the application to prevent redundant authentications.
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // Why: If the token exists and the route is protected, or the token is missing and the route is public, let the request proceed normally.
  return NextResponse.next();
}

// Why: The matcher optimizes middleware execution. 
// It instructs Next.js to completely ignore API routes, static files, images, and the favicon.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};