import { Claims } from '@auth0/nextjs-auth0';
import { getSession, withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  isAdminRoute,
  isPatientRoute,
  isUserAdmin,
  isUserGodAdmin,
  isUserPatient,
  isUserClinicAdmin,
  isClinicAdminRoute,
  isAccountAdminRoute,
  isUserAccountAdmin,
} from '@/utils';

export const middleware = withMiddlewareAuthRequired(async (request: NextRequest) => {
  const res = NextResponse.next();
  const { url } = request;
  
  if (
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/thank-you') ||
    request.nextUrl.pathname.startsWith('/not-found') ||
    request.nextUrl.pathname.startsWith('/api/signup')
  ) {
    return res;
  }
  
  const session = await getSession(request, res);

  if (!isUserAuthorized(url, session?.user)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return res;
});

function isUserAuthorized(url: string, user: Claims | undefined) {
  const roles = user?.['.roles'];
  return (
    (isAdminRoute(url) && isUserAdmin(roles)) ||
    (isClinicAdminRoute(url) && isUserClinicAdmin(roles)) ||
    ((isAccountAdminRoute(url) || isClinicAdminRoute(url)) && isUserAccountAdmin(roles)) ||
    (isPatientRoute(url) && isUserPatient(roles)) ||
    !(isAdminRoute(url) || isPatientRoute(url)) ||
    isUserGodAdmin(roles)
  );
}

export const config = {
  matcher: ['/', '/((?!login$|signup|thank-you|not-found$|api/signup).*)'],
};
