import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/checkout(.*)']);

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // ISO 27001 Annex A.9: Enforce access control on protected routes
  if (isProtectedRoute(req)) {
    auth().protect();
  }

  // Multi-tenant domain resolution logic
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'corestream.com';
  let tenantId = null;

  if (hostname.includes(rootDomain) && hostname !== rootDomain && hostname !== `www.${rootDomain}`) {
    tenantId = hostname.replace(`.${rootDomain}`, '');
  } else if (hostname !== rootDomain && hostname !== `www.${rootDomain}` && !hostname.includes('localhost')) {
    tenantId = hostname;
  }

  // Path rewrites for tenants
  if (tenantId) {
    return NextResponse.rewrite(new URL(`/${tenantId}${url.pathname}${url.search}`, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Match all paths except static files and _next
    '/',
    '/(api|trpc)(.*)',
  ],
};
