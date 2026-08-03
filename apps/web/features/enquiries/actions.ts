'use server';

import { z } from 'zod';
import { sendEnquiryNotification } from '@/lib/email';
import { createClient, isDemoMode } from '@/lib/supabase/server';

const enquirySchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  destination: z.string().optional(),
  travelDate: z.string().optional(),
  budget: z.string().optional(),
  adults: z.number().min(1).default(2),
  children: z.number().min(0).default(0),
  travelStyle: z.string().optional(),
  notes: z.string().optional(),
  locale: z.string().default('en'),
});

export async function submitEnquiry(input: z.infer<typeof enquirySchema>) {
  const data = enquirySchema.parse(input);

  if (!isDemoMode()) {
    const supabase = await createClient();
    if (supabase) {
      // Typed insert once generated Supabase types are wired; safe cast for v1.
      await supabase.from('enquiries').insert({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        travel_date: data.travelDate || null,
        budget: data.budget,
        adults: data.adults,
        children: data.children,
        travel_style: data.travelStyle,
        notes: [data.destination, data.notes].filter(Boolean).join('\n'),
        locale: data.locale,
      } as never);
    }
  }

  await sendEnquiryNotification({
    fullName: data.fullName,
    email: data.email,
    destination: data.destination,
    notes: data.notes,
  });

  return { ok: true };
}

export async function subscribeNewsletter(email: string, locale = 'en') {
  const parsed = z.string().email().parse(email);

  if (!isDemoMode()) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.from('newsletter_subscribers').upsert({
        email: parsed,
        locale,
      } as never);
    }
  }

  return { ok: true };
}
