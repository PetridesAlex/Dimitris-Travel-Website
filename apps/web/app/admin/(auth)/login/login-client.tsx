'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginAction } from '@/features/cms/auth-actions';

export default function AdminLoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState('info@webrunneragency.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="admin-shell relative flex min-h-screen items-center justify-center p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(197,160,89,0.18),transparent_55%)]"
      />
      <div className="admin-panel relative w-full max-w-md overflow-hidden p-8 md:p-10">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
          Uncharted Atelier
        </p>
        <h1 className="admin-display mt-3 text-4xl text-[var(--admin-text)]">CMS Sign in</h1>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          Manage destinations, itineraries, and guest enquiries.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await loginAction(email, password);
              if (!result.ok) {
                setError(result.error);
                return;
              }
              const next = search.get('next') || '/admin';
              router.replace(next);
              router.refresh();
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[11px] tracking-[0.16em] uppercase">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              className="h-11 rounded-none border-[var(--admin-border)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[11px] tracking-[0.16em] uppercase">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="h-11 rounded-none border-[var(--admin-border)]"
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            type="submit"
            variant="admin"
            className="h-11 w-full rounded-none tracking-[0.14em] uppercase"
            disabled={pending}
          >
            {pending ? 'Signing in…' : 'Enter atelier'}
          </Button>
        </form>
      </div>
    </div>
  );
}
