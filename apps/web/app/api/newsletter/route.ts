import { NextResponse } from 'next/server';
import { z } from 'zod';
import { subscribeNewsletter } from '@/features/enquiries/actions';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = z
    .object({ email: z.string().email(), locale: z.string().optional() })
    .safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  await subscribeNewsletter(parsed.data.email, parsed.data.locale ?? 'en');
  return NextResponse.json({ ok: true });
}
