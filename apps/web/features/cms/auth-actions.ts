'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  CMS_COOKIE,
  CMS_SESSION_MAX_AGE_SECONDS,
  createCmsSessionToken,
} from '@/lib/cms/session';
import type { AuthActionResult } from '@/features/cms/types';

function adminFallbackCredentials() {
  const email = process.env.CMS_ADMIN_EMAIL || '';
  const password = process.env.CMS_ADMIN_PASSWORD || '';
  return { email, password };
}

async function setCmsCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CMS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: CMS_SESSION_MAX_AGE_SECONDS,
  });
}

async function clearCmsCookie() {
  const cookieStore = await cookies();
  cookieStore.set(CMS_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function loginAction(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  const trimmedEmail = email.trim().toLowerCase();
  const trimmedPassword = password;

  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false, error: 'Email and password are required.' };
  }

  let supabaseOk = false;
  let supabaseError: string | null = null;

  try {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });
      if (!error) {
        supabaseOk = true;
      } else {
        supabaseError = error.message;
      }
    } else {
      supabaseError = 'Supabase client unavailable';
    }
  } catch (err) {
    supabaseError =
      err instanceof Error ? err.message : 'Supabase Auth failed';
  }

  if (supabaseOk) {
    return { ok: true };
  }

  const fallback = adminFallbackCredentials();
  if (
    fallback.email &&
    fallback.password &&
    trimmedEmail === fallback.email.trim().toLowerCase() &&
    trimmedPassword === fallback.password
  ) {
    const token = await createCmsSessionToken({
      email: fallback.email.trim().toLowerCase(),
      name: 'CMS Admin',
      role: 'super_admin',
    });
    await setCmsCookie(token);
    return { ok: true };
  }

  return {
    ok: false,
    error: supabaseError || 'Invalid email or password.',
  };
}

export async function logoutAction(): Promise<void> {
  try {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch {
    /* ignore sign-out errors */
  }

  await clearCmsCookie();
  redirect('/admin/login');
}
