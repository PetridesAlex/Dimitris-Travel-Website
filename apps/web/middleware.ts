import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isCmsAuthenticatedFromRequest } from '@/lib/cms/auth';
import { DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n/config';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const { response, user } = await updateSession(request);
    const cookieOk = await isCmsAuthenticatedFromRequest(request);
    const authed = Boolean(user) || cookieOk;

    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      if (authed) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin';
        return NextResponse.redirect(url);
      }
      return response;
    }

    if (!authed) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }

    return response;
  }

  const segment = pathname.split('/')[1];
  if (!isValidLocale(segment)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  const { response } = await updateSession(request);
  response.headers.set('x-locale', segment);
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
