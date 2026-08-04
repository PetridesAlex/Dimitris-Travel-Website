'use server';

import { z } from 'zod';
import { sendEnquiryNotification } from '@/lib/email';
import {
  createAnonClient,
  createServiceClient,
  isDemoMode,
} from '@/lib/supabase/server';

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
  brief: z.string().optional(),
});

export async function submitEnquiry(input: z.infer<typeof enquirySchema>) {
  const data = enquirySchema.parse(input);

  const notes = [data.destination, data.notes, data.brief]
    .filter(Boolean)
    .join('\n\n');

  if (!isDemoMode()) {
    const row = {
      full_name: data.fullName,
      email: data.email,
      phone: data.phone || null,
      travel_date: data.travelDate || null,
      budget: data.budget || null,
      adults: data.adults,
      children: data.children,
      travel_style: data.travelStyle || null,
      notes,
      locale: data.locale,
    };

    // Prefer service role (server-validated) so public forms work even if anon RLS/grants are tight.
    // Untyped client: loose Database schema makes .insert() infer `never`.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = (createServiceClient() ?? createAnonClient()) as any;
    if (client) {
      const { error } = await client.from('enquiries').insert(row);
      if (error) {
        console.error('enquiry insert failed:', error.message);
        throw new Error('Could not save enquiry. Please try again.');
      }
    }
  }

  await sendEnquiryNotification({
    fullName: data.fullName,
    email: data.email,
    destination: data.destination,
    notes,
  });

  return { ok: true };
}

export async function subscribeNewsletter(email: string, locale = 'en') {
  const parsed = z.string().email().parse(email);

  if (!isDemoMode()) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = (createServiceClient() ?? createAnonClient()) as any;
    if (client) {
      const { error } = await client.from('newsletter_subscribers').upsert({
        email: parsed,
        locale,
      });
      if (error) {
        console.error('newsletter upsert failed:', error.message);
        throw new Error('Could not subscribe. Please try again.');
      }
    }
  }

  return { ok: true };
}
