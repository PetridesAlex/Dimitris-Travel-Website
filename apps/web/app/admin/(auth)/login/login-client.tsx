'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { loginAction } from '@/features/cms/auth-actions';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop';

export default function AdminLoginClient() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
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
  }

  return (
    <div className="flex min-h-screen w-full bg-[#f7f3eb]">
      {/* Left — brand / atmosphere */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/55 to-[#0c0c0c]/25" />
        </motion.div>

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="font-[family-name:var(--font-display)] text-3xl tracking-wide text-white">
              Uncharted
              <span className="ml-2 text-[#c5a059]">Journeys</span>
            </p>
            <p className="mt-2 text-[11px] font-semibold tracking-[0.22em] text-white/55 uppercase">
              Atelier CMS
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="max-w-md"
          >
            <h2 className="font-[family-name:var(--font-display)] text-4xl leading-[1.1] text-white xl:text-5xl">
              Curate the journey
              <br />
              <span className="text-[#c5a059]">behind the curtain.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Destinations, itineraries, and guest enquiries — managed with the same quiet
              precision as the trips themselves.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — sign in */}
      <div className="flex w-full items-center justify-center px-6 py-12 sm:px-10 lg:w-1/2 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="w-full max-w-md"
        >
          <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase lg:hidden">
            Uncharted Journeys · CMS
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-[#0c0c0c] sm:text-5xl">
            Sign in
          </h1>
          <p className="mt-3 text-sm text-[#5c574e]">
            Access the atelier to manage catalogue, content, and enquiries.
          </p>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            onSubmit={onSubmit}
            className="mt-10 space-y-4"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[11px] font-semibold tracking-[0.16em] text-[#5c574e] uppercase"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@uncharted.example"
                required
                autoComplete="username"
                className="h-12 w-full border border-[#e4ddd0] bg-white px-4 text-[#0c0c0c] placeholder:text-[#9a9488] outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/40"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[11px] font-semibold tracking-[0.16em] text-[#5c574e] uppercase"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                  className="h-12 w-full border border-[#e4ddd0] bg-white px-4 pr-12 text-[#0c0c0c] placeholder:text-[#9a9488] outline-none transition focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059]/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9a9488] transition hover:text-[#0c0c0c]"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" strokeWidth={1.6} />
                  ) : (
                    <EyeOff className="h-5 w-5" strokeWidth={1.6} />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p className="border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 flex h-12 w-full items-center justify-center bg-[#0c0c0c] text-[11px] font-semibold tracking-[0.18em] text-white uppercase transition hover:bg-[#1a1612] disabled:opacity-60"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </motion.form>

          <p className="mt-8 text-center text-xs text-[#9a9488]">
            Staff access only · Uncharted Journeys
          </p>
        </motion.div>
      </div>
    </div>
  );
}
