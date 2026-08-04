'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { submitEnquiry } from '@/features/enquiries/actions';
import { getContinents, destinations } from '@/data/demo';
import { FadeIn } from '@/components/motion/fade-in';
import { cn } from '@/lib/utils';

const schema = z.object({
  fullName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  destination: z.string().optional(),
  travelDate: z.string().optional(),
  budget: z.string().optional(),
  adults: z.coerce.number().min(1),
  children: z.coerce.number().min(0),
  travelStyle: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
      {children}
      {required ? <span className="ml-1 text-[#c5a059]">*</span> : null}
    </label>
  );
}

function fieldClass(extra?: string) {
  return cn(
    'h-12 w-full border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none transition',
    'placeholder:text-white/30 focus:border-[#c5a059]/55 focus:bg-white/[0.06]',
    extra,
  );
}

function SubmitCta({ pending }: { pending: boolean }) {
  const reduce = useReducedMotion();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'group relative inline-flex h-12 min-w-[220px] items-center justify-center overflow-hidden px-8',
        'text-[12px] font-semibold tracking-[0.2em] text-[#0c0c0c] uppercase',
        'shadow-[0_16px_40px_-16px_rgba(197,160,89,0.95)] disabled:opacity-60',
      )}
    >
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e]"
      />
      {!reduce && !pending ? (
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            repeatDelay: 0.9,
          }}
        />
      ) : null}
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#8f7132] via-[#b8923f] to-[#c5a059] transition-transform duration-500 ease-out group-hover:scale-x-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2.5">
        {pending ? 'Sending…' : 'Send enquiry'}
        {!pending ? (
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.75}
          />
        ) : null}
      </span>
    </button>
  );
}

export function EnquiryForm({
  locale = 'en',
  defaultDestination,
}: {
  locale?: string;
  defaultDestination?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const countries = destinations.filter((d) => d.type === 'country');

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      destination: defaultDestination ?? '',
      travelDate: '',
      budget: '',
      adults: 2,
      children: 0,
      travelStyle: '',
      notes: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      await submitEnquiry({ ...values, locale });
      setDone(true);
      form.reset();
    });
  };

  if (done) {
    return (
      <FadeIn blur direction="scale" distance={20}>
        <div className="relative overflow-hidden border border-[#c5a059]/30 bg-gradient-to-br from-[#c5a059]/15 via-white/[0.04] to-transparent p-10 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#c5a059]/20 blur-3xl"
          />
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-[#c5a059]/50 bg-[#c5a059]/15 text-[#c5a059]">
            <Check className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <p className="mt-6 font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            Thank you
          </p>
          <p className="mx-auto mt-3 max-w-sm text-white/65">
            A journey designer will be in touch within one working day to begin shaping your trip.
          </p>
          <button
            type="button"
            onClick={() => setDone(false)}
            className="mt-8 inline-flex h-11 items-center border border-white/20 px-6 text-[11px] font-semibold tracking-[0.18em] text-white/80 uppercase transition hover:border-[#c5a059]/50 hover:text-[#c5a059]"
          >
            Send another enquiry
          </button>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn blur direction="up" distance={32} duration={0.9}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative overflow-hidden border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm md:p-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-[#c5a059]/8 blur-3xl"
        />

        <div className="relative mb-8 border-b border-white/10 pb-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
            Enquiry
          </p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-white md:text-3xl">
            Tell us about your journey
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50">
            A few details help us prepare a thoughtful first conversation — nothing is final until
            you say so.
          </p>
        </div>

        <div className="relative grid gap-5 md:grid-cols-2">
          <div>
            <FieldLabel required>Full name</FieldLabel>
            <input {...form.register('fullName')} className={fieldClass()} autoComplete="name" />
            {form.formState.errors.fullName ? (
              <p className="mt-1.5 text-xs text-red-300">{form.formState.errors.fullName.message}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel required>Email</FieldLabel>
            <input
              type="email"
              {...form.register('email')}
              className={fieldClass()}
              autoComplete="email"
            />
            {form.formState.errors.email ? (
              <p className="mt-1.5 text-xs text-red-300">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <FieldLabel>Phone</FieldLabel>
            <input
              {...form.register('phone')}
              className={fieldClass()}
              autoComplete="tel"
              placeholder="+44 …"
            />
          </div>
          <div>
            <FieldLabel>Destination</FieldLabel>
            <select {...form.register('destination')} className={fieldClass('appearance-none')}>
              <option value="" className="bg-[#0c0c0c] text-white">
                Select a destination
              </option>
              {countries.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#0c0c0c] text-white">
                  {c.name}
                </option>
              ))}
              {getContinents().map((c) => (
                <option key={c.id} value={c.name} className="bg-[#0c0c0c] text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <FieldLabel>Travel date</FieldLabel>
            <input type="date" {...form.register('travelDate')} className={fieldClass()} />
          </div>
          <div>
            <FieldLabel>Budget</FieldLabel>
            <input
              {...form.register('budget')}
              placeholder="e.g. €10,000 – €15,000"
              className={fieldClass()}
            />
          </div>
          <div>
            <FieldLabel>Adults</FieldLabel>
            <input type="number" min={1} {...form.register('adults')} className={fieldClass()} />
          </div>
          <div>
            <FieldLabel>Children</FieldLabel>
            <input type="number" min={0} {...form.register('children')} className={fieldClass()} />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Travel style</FieldLabel>
            <input
              {...form.register('travelStyle')}
              placeholder="Honeymoon, family, adventure…"
              className={fieldClass()}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Tell us your ideas</FieldLabel>
            <textarea
              {...form.register('notes')}
              rows={4}
              placeholder="Occasions, must-sees, pace, preferences…"
              className={cn(
                fieldClass('h-auto py-3 resize-y'),
                'min-h-[120px] leading-relaxed',
              )}
            />
          </div>
        </div>

        <div className="relative mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xs text-xs leading-relaxed text-white/40">
            Private & confidential. We never share your details — only use them to craft your
            journey.
          </p>
          <SubmitCta pending={pending} />
        </div>
      </form>
    </FadeIn>
  );
}
