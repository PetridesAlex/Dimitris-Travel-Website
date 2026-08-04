'use client';

import { Mail, MapPin, Phone, Clock3, Sparkles, MessageCircle } from 'lucide-react';
import { siteSettings } from '@/data/demo';
import { FadeIn, Stagger } from '@/components/motion/fade-in';

const channels = [
  {
    icon: Phone,
    label: 'Call the atelier',
    value: siteSettings.phone,
    href: `tel:${siteSettings.phone.replace(/\s/g, '')}`,
    hint: 'Mon–Fri · 09:00–18:00 GMT',
  },
  {
    icon: Mail,
    label: 'Write to us',
    value: siteSettings.email,
    href: `mailto:${siteSettings.email}`,
    hint: 'Replies within one working day',
  },
  {
    icon: MapPin,
    label: 'Visit by appointment',
    value: siteSettings.address,
    href: null,
    hint: 'Private consultations in Mayfair',
  },
] as const;

const nextSteps = [
  {
    icon: MessageCircle,
    title: 'Share your brief',
    detail: 'Destination, season, and the feeling you want from the trip.',
  },
  {
    icon: Sparkles,
    title: 'Meet your designer',
    detail: 'A specialist shapes a first itinerary tailored to you.',
  },
  {
    icon: Clock3,
    title: 'Refine together',
    detail: 'We iterate until every day feels intentional — then book.',
  },
];

export function ContactPanel() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 h-64 w-64 rounded-full bg-[#c5a059]/10 blur-3xl"
      />

      <FadeIn blur direction="up" distance={28}>
        <p className="mb-3 text-xs tracking-[0.25em] text-[var(--color-gold)] uppercase">
          Get in touch
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-white md:text-5xl">
          We&apos;re here to help
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
          Speak with a journey designer — by phone, email, or through the form. Every enquiry is
          handled personally.
        </p>
      </FadeIn>

      <Stagger className="mt-10 space-y-3" stagger={0.08}>
        {channels.map((channel) => {
          const Icon = channel.icon;
          const inner = (
            <>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#c5a059]/35 bg-[#c5a059]/10 text-[#c5a059] transition duration-300 group-hover:border-[#c5a059] group-hover:bg-[#c5a059]/20">
                <Icon className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold tracking-[0.2em] text-[#c5a059]/80 uppercase">
                  {channel.label}
                </span>
                <span className="mt-1 block truncate text-[15px] text-white transition group-hover:text-[#c5a059]">
                  {channel.value}
                </span>
                <span className="mt-0.5 block text-xs text-white/40">{channel.hint}</span>
              </span>
            </>
          );

          const className =
            'group relative flex w-full items-start gap-4 overflow-hidden border border-white/10 bg-white/[0.03] px-5 py-4 transition duration-300 hover:border-[#c5a059]/40 hover:bg-white/[0.05]';

          if (channel.href) {
            return (
              <a key={channel.label} href={channel.href} className={className}>
                {inner}
              </a>
            );
          }

          return (
            <div key={channel.label} className={className}>
              {inner}
            </div>
          );
        })}
      </Stagger>

      <FadeIn delay={0.25} direction="up" distance={24} className="mt-12">
        <div className="border border-[#c5a059]/20 bg-gradient-to-br from-[#c5a059]/10 via-transparent to-transparent p-6">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
            What happens next
          </p>
          <ol className="mt-5 space-y-5">
            {nextSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex gap-4">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center border border-[#c5a059]/40 text-[#c5a059]">
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-[#c5a059] text-[9px] font-bold text-[#0c0c0c]">
                      {i + 1}
                    </span>
                  </span>
                  <span>
                    <span className="block font-[family-name:var(--font-display)] text-lg text-white">
                      {step.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-white/45">
                      {step.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </FadeIn>
    </div>
  );
}
