/**
 * Signed CMS session tokens for httpOnly cookie auth fallback.
 * Uses Web Crypto HMAC-SHA256 (Edge + Node compatible).
 */

export const CMS_COOKIE = 'uj_cms_session';

export const CMS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export type CmsSessionPayload = {
  email: string;
  name: string;
  role: string;
  exp: number;
};

const DEV_FALLBACK_SECRET = 'dev-cms-session-secret-change-me';

function getSecret(): string {
  return process.env.CMS_SESSION_SECRET || DEV_FALLBACK_SECRET;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url');
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const b64 = padded + pad;
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

async function importHmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

/** Create a signed session token. Sets `exp` to now + 7d when omitted. */
export async function createCmsSessionToken(
  payload: Omit<CmsSessionPayload, 'exp'> & { exp?: number },
): Promise<string> {
  const full: CmsSessionPayload = {
    email: payload.email,
    name: payload.name,
    role: payload.role,
    exp:
      payload.exp ??
      Math.floor(Date.now() / 1000) + CMS_SESSION_MAX_AGE_SECONDS,
  };

  const body = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(full)));
  const key = await importHmacKey();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(body),
  );
  return `${body}.${bytesToBase64Url(new Uint8Array(signature))}`;
}

/** Verify a signed token; returns payload or null if invalid/expired. */
export async function verifyCmsSessionToken(
  token: string,
): Promise<CmsSessionPayload | null> {
  try {
    const [body, sig] = token.split('.');
    if (!body || !sig) return null;

    const key = await importHmacKey();
    const expected = new Uint8Array(
      await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)),
    );
    const actual = base64UrlToBytes(sig);
    if (!timingSafeEqual(expected, actual)) return null;

    const json = new TextDecoder().decode(base64UrlToBytes(body));
    const payload = JSON.parse(json) as CmsSessionPayload;

    if (
      typeof payload.email !== 'string' ||
      typeof payload.name !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.exp !== 'number'
    ) {
      return null;
    }

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}
