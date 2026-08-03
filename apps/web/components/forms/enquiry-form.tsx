'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { submitEnquiry } from '@/features/enquiries/actions';
import { getContinents, destinations } from '@/data/demo';
import { FadeIn } from '@/components/motion/fade-in';

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
        <div className="rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-ink-soft)] p-8 text-center text-white">
          <p className="font-[family-name:var(--font-display)] text-3xl">
            Thank you
          </p>
          <p className="mt-3 text-white/70">
            A journey designer will be in touch shortly.
          </p>
          <Button className="mt-6" onClick={() => setDone(false)}>
            Send another enquiry
          </Button>
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn blur direction="up" distance={32} duration={0.9}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-2"
    >
      <div className="space-y-2">
        <Label className="text-white">Full name</Label>
        <Input {...form.register('fullName')} className="border-white/20 bg-white/10 text-white" />
        {form.formState.errors.fullName ? (
          <p className="text-xs text-red-300">{form.formState.errors.fullName.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label className="text-white">Email</Label>
        <Input type="email" {...form.register('email')} className="border-white/20 bg-white/10 text-white" />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Phone</Label>
        <Input {...form.register('phone')} className="border-white/20 bg-white/10 text-white" />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Destination</Label>
        <select
          {...form.register('destination')}
          className="flex h-11 w-full rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white"
        >
          <option value="">Select a destination</option>
          {countries.map((c) => (
            <option key={c.id} value={c.name} className="text-black">
              {c.name}
            </option>
          ))}
          {getContinents().map((c) => (
            <option key={c.id} value={c.name} className="text-black">
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label className="text-white">Travel date</Label>
        <Input type="date" {...form.register('travelDate')} className="border-white/20 bg-white/10 text-white" />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Budget</Label>
        <Input {...form.register('budget')} placeholder="e.g. €10,000 – €15,000" className="border-white/20 bg-white/10 text-white placeholder:text-white/40" />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Adults</Label>
        <Input type="number" {...form.register('adults')} className="border-white/20 bg-white/10 text-white" />
      </div>
      <div className="space-y-2">
        <Label className="text-white">Children</Label>
        <Input type="number" {...form.register('children')} className="border-white/20 bg-white/10 text-white" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="text-white">Travel style</Label>
        <Input {...form.register('travelStyle')} placeholder="Honeymoon, family, adventure…" className="border-white/20 bg-white/10 text-white placeholder:text-white/40" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="text-white">Tell us your ideas</Label>
        <Textarea {...form.register('notes')} className="border-white/20 bg-white/10 text-white" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={pending} className="w-full md:w-auto">
          {pending ? 'Sending…' : 'Plan Your Journey'}
        </Button>
      </div>
    </form>
    </FadeIn>
  );
}
