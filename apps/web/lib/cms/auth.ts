import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  CMS_COOKIE,
  verifyCmsSessionToken,
  type CmsSessionPayload,
} from '@/lib/cms/session';

export type CmsSession = {
  email: string;
  name: string;
  role: string;
  source: 'cookie' | 'supabase';
};

function fromPayload(
  payload: CmsSessionPayload,
  source: CmsSession['source'],
): CmsSession {
  return {
    email: payload.email,
    name: payload.name,
    role: payload.role,
    source,
  };
}

/** Read CMS session from signed cookie, then fall back to Supabase Auth + profiles. */
export async function getCmsSession(): Promise<CmsSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE)?.value;
  if (token) {
    const payload = await verifyCmsSessionToken(token);
    if (payload) return fromPayload(payload, 'cookie');
  }

  try {
    const supabase = await createClient();
    if (!supabase) return null;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, role, is_active')
      .eq('id', user.id)
      .maybeSingle();

    if (profile && (profile as { is_active?: boolean }).is_active === false) {
      return null;
    }

    const row = profile as {
      full_name?: string | null;
      email?: string | null;
      role?: string | null;
    } | null;

    return {
      email: row?.email || user.email || '',
      name:
        row?.full_name ||
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        '',
      role: row?.role || 'content_writer',
      source: 'supabase',
    };
  } catch {
    return null;
  }
}

/** Redirect to login when there is no CMS session. */
export async function requireCmsSession(): Promise<CmsSession> {
  const session = await getCmsSession();
  if (!session) {
    redirect('/admin/login');
  }
  return session;
}

/**
 * Middleware helper: verify the signed CMS cookie only.
 * Middleware should also accept a Supabase user via updateSession.
 */
export async function isCmsAuthenticatedFromRequest(
  request: NextRequest,
): Promise<boolean> {
  const token = request.cookies.get(CMS_COOKIE)?.value;
  if (!token) return false;
  const payload = await verifyCmsSessionToken(token);
  return payload !== null;
}
