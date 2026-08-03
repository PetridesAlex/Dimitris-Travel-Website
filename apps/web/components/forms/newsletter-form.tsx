'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { subscribeNewsletter } from '@/features/enquiries/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.string().email();

export function NewsletterForm({ locale = 'en' }: { locale?: string }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      onSubmit={(e) => {
        e.preventDefault();
        const parsed = schema.safeParse(email);
        if (!parsed.success) {
          setMessage('Please enter a valid email.');
          return;
        }
        startTransition(async () => {
          await subscribeNewsletter(email, locale);
          setMessage('Welcome aboard — inspiration is on its way.');
          setEmail('');
        });
      }}
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="border-white/20 bg-white/10 text-white placeholder:text-white/40"
      />
      <Button type="submit" disabled={pending}>
        Subscribe
      </Button>
      {message ? (
        <p className="basis-full text-sm text-[var(--color-gold)]">{message}</p>
      ) : null}
    </form>
  );
}
