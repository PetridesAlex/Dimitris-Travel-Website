'use client';

import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  Clock3,
  HeartHandshake,
} from 'lucide-react';
import { destinations } from '@/data/demo';
import { SAVED_DESTINATIONS_KEY } from '@/data/explore-destinations';
import { submitEnquiry } from '@/features/enquiries/actions';
import { cn } from '@/lib/utils';
import {
  accommodations,
  budgets,
  cabinClasses,
  contactMethods,
  durations,
  experiences,
  flexibilityOptions,
  flightExtras,
  occasions,
  stepMeta,
  transportOptions,
  travelStyles,
  trustPoints,
} from '@/components/forms/plan-journey-options';

const STORAGE_KEY = 'uj-plan-journey-draft';

export type PlanJourneyValues = {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: string;
  destinations: string[];
  undecided: boolean;
  departureCountry: string;
  departureAirport: string;
  travelDates: string;
  flexibleDates: string;
  duration: string;
  adults: number;
  children: number;
  infants: number;
  childAges: string[];
  occasion: string;
  travelStyles: string[];
  budget: string;
  accommodations: string[];
  cabinClass: string;
  flightExtras: string[];
  experiences: string[];
  transport: string[];
  specialRequests: string;
  privacyAccepted: boolean;
};

const defaultValues: PlanJourneyValues = {
  fullName: '',
  email: '',
  phone: '',
  contactMethod: 'Email',
  destinations: [],
  undecided: false,
  departureCountry: '',
  departureAirport: '',
  travelDates: '',
  flexibleDates: 'Exact dates',
  duration: '10 Days',
  adults: 2,
  children: 0,
  infants: 0,
  childAges: [],
  occasion: '',
  travelStyles: [],
  budget: '',
  accommodations: [],
  cabinClass: 'Business',
  flightExtras: [],
  experiences: [],
  transport: [],
  specialRequests: '',
  privacyAccepted: false,
};

const trustIcons = [Sparkles, HeartHandshake, Clock3, ShieldCheck];

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
      {children}
      {required ? <span className="ml-1 text-[#c5a059]">*</span> : null}
    </label>
  );
}

function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        'h-12 w-full border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none transition',
        'placeholder:text-white/30 focus:border-[#c5a059]/55 focus:bg-white/[0.06]',
        props.className,
      )}
    />
  );
}

function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'h-12 w-full border border-white/15 bg-white/[0.04] px-4 text-[15px] text-white outline-none transition',
        'focus:border-[#c5a059]/55 focus:bg-white/[0.06]',
        props.className,
      )}
    />
  );
}

function OptionChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'border px-3.5 py-2.5 text-left text-[13px] transition duration-300',
        active
          ? 'border-[#c5a059] bg-[#c5a059]/15 text-[#c5a059]'
          : 'border-white/12 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

function toggleList(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function PlanJourneyForm({ locale = 'en' }: { locale?: string }) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<PlanJourneyValues>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);

  const countries = useMemo(
    () => destinations.filter((d) => d.type === 'country').map((d) => d.name),
    [],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let next: PlanJourneyValues = { ...defaultValues };
      let nextStep = 1;

      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlanJourneyValues> & { step?: number };
        const { step: savedStep, ...rest } = parsed;
        next = { ...next, ...rest };
        if (savedStep && savedStep >= 1 && savedStep <= 4) nextStep = savedStep;
      }

      // Prefill from Explore Journey Board (heart saves)
      const boardRaw = localStorage.getItem(SAVED_DESTINATIONS_KEY);
      if (boardRaw) {
        const board = JSON.parse(boardRaw) as { name: string }[];
        if (Array.isArray(board) && board.length > 0 && !next.undecided) {
          const names = board.map((b) => b.name).filter(Boolean);
          next = {
            ...next,
            destinations: Array.from(new Set([...names, ...next.destinations])),
          };
        }
      }

      setValues(next);
      setStep(nextStep);
    } catch {
      // ignore corrupt drafts
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || done) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...values, step }));
  }, [values, step, hydrated, done]);

  useEffect(() => {
    setValues((prev) => {
      const nextAges = [...prev.childAges];
      while (nextAges.length < prev.children) nextAges.push('');
      while (nextAges.length > prev.children) nextAges.pop();
      if (nextAges.join() === prev.childAges.join()) return prev;
      return { ...prev, childAges: nextAges };
    });
  }, [values.children]);

  const update = useCallback(<K extends keyof PlanJourneyValues>(key: K, value: PlanJourneyValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const validateStep = (current: number) => {
    const nextErrors: Record<string, string> = {};
    if (current === 1) {
      if (values.fullName.trim().length < 2) nextErrors.fullName = 'Please enter your full name';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) nextErrors.email = 'Enter a valid email';
      if (!values.undecided && values.destinations.length === 0) {
        nextErrors.destinations = 'Select at least one destination or mark as undecided';
      }
    }
    if (current === 2) {
      if (values.adults < 1) nextErrors.adults = 'At least one adult is required';
      if (!values.occasion) nextErrors.occasion = 'Please choose an occasion';
    }
    if (current === 3) {
      if (!values.budget) nextErrors.budget = 'Please select a budget range';
    }
    if (current === 4) {
      if (!values.privacyAccepted) nextErrors.privacyAccepted = 'Please accept the privacy terms';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = () => {
    if (!validateStep(4)) return;
    startTransition(async () => {
      const brief = [
        `Contact: ${values.contactMethod}`,
        `Phone: ${values.phone || '—'}`,
        `Destinations: ${values.undecided ? 'Undecided' : values.destinations.join(', ')}`,
        `Departure: ${values.departureCountry || '—'} / ${values.departureAirport || '—'}`,
        `Dates: ${values.travelDates || '—'} (${values.flexibleDates})`,
        `Duration: ${values.duration}`,
        `Travellers: ${values.adults} adults, ${values.children} children, ${values.infants} infants`,
        values.children > 0 ? `Child ages: ${values.childAges.join(', ')}` : null,
        `Occasion: ${values.occasion}`,
        `Travel styles: ${values.travelStyles.join(', ') || '—'}`,
        `Budget: ${values.budget}`,
        `Accommodation: ${values.accommodations.join(', ') || '—'}`,
        `Flights: ${values.cabinClass}; ${values.flightExtras.join(', ') || 'no extras'}`,
        `Experiences: ${values.experiences.join(', ') || '—'}`,
        `Transport: ${values.transport.join(', ') || '—'}`,
        `Special requests: ${values.specialRequests || '—'}`,
      ]
        .filter(Boolean)
        .join('\n');

      await submitEnquiry({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        destination: values.undecided ? 'Undecided' : values.destinations.join(', '),
        travelDate: values.travelDates,
        budget: values.budget,
        adults: values.adults,
        children: values.children,
        travelStyle: values.travelStyles.join(', '),
        notes: values.specialRequests,
        brief,
        locale,
      });

      localStorage.removeItem(STORAGE_KEY);
      setDone(true);
    });
  };

  if (done) {
    return (
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-[#c5a059]/25 bg-[#0c0c0c] px-6 py-12 text-center md:px-12 md:py-16"
      >
        <p className="text-[11px] font-semibold tracking-[0.3em] text-[#c5a059] uppercase">
          Enquiry received
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl text-white md:text-5xl">
          Thank you for your enquiry.
        </h2>
        <div className="mx-auto mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-white/65">
          <p>Your request has been received by one of our Journey Designers.</p>
          <p>
            Within the next 24 hours, we&apos;ll begin crafting a personalised itinerary tailored
            exclusively to your preferences.
          </p>
          <p>
            If needed, we&apos;ll contact you to refine the details before presenting your bespoke
            proposal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setValues(defaultValues);
            setStep(1);
          }}
          className="mt-10 inline-flex h-11 items-center border border-[#c5a059]/50 px-6 text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase transition hover:bg-[#c5a059] hover:text-[#0c0c0c]"
        >
          Start another brief
        </button>
      </motion.div>
    );
  }

  return (
    <div className="border border-[#c5a059]/20 bg-[#0c0c0c]">
      <div className="border-b border-white/10 px-5 py-5 md:px-8 md:py-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.3em] text-[#c5a059] uppercase">
              Step {step} of 4
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white md:text-3xl">
              {stepMeta[step - 1]?.title}
            </h2>
          </div>
          <p className="text-[11px] tracking-[0.16em] text-white/35 uppercase">
            Progress saved automatically
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stepMeta.map((s) => (
            <div key={s.id} className="space-y-2">
              <div
                className={cn(
                  'h-1 w-full transition-colors duration-500',
                  s.id <= step ? 'bg-[#c5a059]' : 'bg-white/10',
                )}
              />
              <p
                className={cn(
                  'hidden text-[10px] tracking-[0.16em] uppercase sm:block',
                  s.id <= step ? 'text-[#c5a059]' : 'text-white/30',
                )}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 py-8 md:px-8 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            {step === 1 ? (
              <>
                <section className="space-y-5">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Personal details
                  </h3>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel required>Full name</FieldLabel>
                      <TextField
                        value={values.fullName}
                        onChange={(e) => update('fullName', e.target.value)}
                        placeholder="Alexandra Petrides"
                      />
                      {errors.fullName ? (
                        <p className="mt-1.5 text-xs text-red-300">{errors.fullName}</p>
                      ) : null}
                    </div>
                    <div>
                      <FieldLabel required>Email address</FieldLabel>
                      <TextField
                        type="email"
                        value={values.email}
                        onChange={(e) => update('email', e.target.value)}
                        placeholder="you@example.com"
                      />
                      {errors.email ? (
                        <p className="mt-1.5 text-xs text-red-300">{errors.email}</p>
                      ) : null}
                    </div>
                    <div>
                      <FieldLabel>Phone number</FieldLabel>
                      <TextField
                        value={values.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        placeholder="+44 20 0000 0000"
                      />
                    </div>
                    <div>
                      <FieldLabel>Preferred contact method</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {contactMethods.map((method) => (
                          <OptionChip
                            key={method}
                            active={values.contactMethod === method}
                            onClick={() => update('contactMethod', method)}
                          >
                            {method}
                          </OptionChip>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Journey details
                  </h3>
                  <div>
                    <FieldLabel required>Destination</FieldLabel>
                    <div className="mb-3">
                      <OptionChip
                        active={values.undecided}
                        onClick={() =>
                          setValues((prev) => ({
                            ...prev,
                            undecided: !prev.undecided,
                            destinations: !prev.undecided ? [] : prev.destinations,
                          }))
                        }
                      >
                        If undecided
                      </OptionChip>
                    </div>
                    {!values.undecided ? (
                      <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
                        {countries.map((country) => (
                          <OptionChip
                            key={country}
                            active={values.destinations.includes(country)}
                            onClick={() =>
                              update('destinations', toggleList(values.destinations, country))
                            }
                          >
                            {country}
                          </OptionChip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/45">
                        Perfect — we&apos;ll help you discover the right destination.
                      </p>
                    )}
                    {errors.destinations ? (
                      <p className="mt-1.5 text-xs text-red-300">{errors.destinations}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel>Departure country</FieldLabel>
                      <TextField
                        value={values.departureCountry}
                        onChange={(e) => update('departureCountry', e.target.value)}
                        placeholder="United Kingdom"
                      />
                    </div>
                    <div>
                      <FieldLabel>Departure airport</FieldLabel>
                      <TextField
                        value={values.departureAirport}
                        onChange={(e) => update('departureAirport', e.target.value)}
                        placeholder="LHR"
                      />
                    </div>
                    <div>
                      <FieldLabel>Preferred travel dates</FieldLabel>
                      <TextField
                        value={values.travelDates}
                        onChange={(e) => update('travelDates', e.target.value)}
                        placeholder="e.g. 12–22 October 2026"
                      />
                    </div>
                    <div>
                      <FieldLabel>Flexible dates?</FieldLabel>
                      <div className="flex flex-wrap gap-2">
                        {flexibilityOptions.map((opt) => (
                          <OptionChip
                            key={opt}
                            active={values.flexibleDates === opt}
                            onClick={() => update('flexibleDates', opt)}
                          >
                            {opt}
                          </OptionChip>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Duration</FieldLabel>
                    <div className="flex flex-wrap gap-2">
                      {durations.map((opt) => (
                        <OptionChip
                          key={opt}
                          active={values.duration === opt}
                          onClick={() => update('duration', opt)}
                        >
                          {opt}
                        </OptionChip>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <section className="space-y-5">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Travellers
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-3">
                    {(
                      [
                        ['adults', 'Adults'],
                        ['children', 'Children'],
                        ['infants', 'Infants'],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key}>
                        <FieldLabel>{label}</FieldLabel>
                        <div className="flex h-12 items-center border border-white/15 bg-white/[0.04]">
                          <button
                            type="button"
                            className="h-full px-4 text-white/70 hover:text-white"
                            onClick={() =>
                              update(
                                key,
                                Math.max(key === 'adults' ? 1 : 0, values[key] - 1),
                              )
                            }
                          >
                            −
                          </button>
                          <span className="flex-1 text-center text-lg text-white">
                            {values[key]}
                          </span>
                          <button
                            type="button"
                            className="h-full px-4 text-white/70 hover:text-white"
                            onClick={() => update(key, values[key] + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.adults ? (
                    <p className="text-xs text-red-300">{errors.adults}</p>
                  ) : null}

                  {values.children > 0 ? (
                    <div>
                      <FieldLabel>Age of each child</FieldLabel>
                      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {values.childAges.map((age, i) => (
                          <TextField
                            key={i}
                            type="number"
                            min={0}
                            max={17}
                            value={age}
                            onChange={(e) => {
                              const next = [...values.childAges];
                              next[i] = e.target.value;
                              update('childAges', next);
                            }}
                            placeholder={`Child ${i + 1} age`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Occasion
                  </h3>
                  <SelectField
                    value={values.occasion}
                    onChange={(e) => update('occasion', e.target.value)}
                  >
                    <option value="" className="bg-[#0c0c0c]">
                      Select an occasion
                    </option>
                    {occasions.map((o) => (
                      <option key={o} value={o} className="bg-[#0c0c0c]">
                        {o}
                      </option>
                    ))}
                  </SelectField>
                  {errors.occasion ? (
                    <p className="text-xs text-red-300">{errors.occasion}</p>
                  ) : null}
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Travel style
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {travelStyles.map((style) => (
                      <OptionChip
                        key={style}
                        active={values.travelStyles.includes(style)}
                        onClick={() =>
                          update('travelStyles', toggleList(values.travelStyles, style))
                        }
                      >
                        {style}
                      </OptionChip>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <section className="space-y-5">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Budget
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {budgets.map((b) => (
                      <OptionChip
                        key={b}
                        active={values.budget === b}
                        onClick={() => update('budget', b)}
                      >
                        {b}
                      </OptionChip>
                    ))}
                  </div>
                  {errors.budget ? (
                    <p className="text-xs text-red-300">{errors.budget}</p>
                  ) : null}
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Accommodation preferences
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                    {accommodations.map((item) => (
                      <OptionChip
                        key={item}
                        active={values.accommodations.includes(item)}
                        onClick={() =>
                          update('accommodations', toggleList(values.accommodations, item))
                        }
                      >
                        {item}
                      </OptionChip>
                    ))}
                  </div>
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Flights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cabinClasses.map((cabin) => (
                      <OptionChip
                        key={cabin}
                        active={values.cabinClass === cabin}
                        onClick={() => update('cabinClass', cabin)}
                      >
                        {cabin}
                      </OptionChip>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {flightExtras.map((extra) => (
                      <OptionChip
                        key={extra}
                        active={values.flightExtras.includes(extra)}
                        onClick={() =>
                          update('flightExtras', toggleList(values.flightExtras, extra))
                        }
                      >
                        {extra}
                      </OptionChip>
                    ))}
                  </div>
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Experiences
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {experiences.map((item) => (
                      <OptionChip
                        key={item}
                        active={values.experiences.includes(item)}
                        onClick={() =>
                          update('experiences', toggleList(values.experiences, item))
                        }
                      >
                        {item}
                      </OptionChip>
                    ))}
                  </div>
                </section>

                <section className="space-y-5 border-t border-white/10 pt-8">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Transport
                  </h3>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                    {transportOptions.map((item) => (
                      <OptionChip
                        key={item}
                        active={values.transport.includes(item)}
                        onClick={() => update('transport', toggleList(values.transport, item))}
                      >
                        {item}
                      </OptionChip>
                    ))}
                  </div>
                </section>
              </>
            ) : null}

            {step === 4 ? (
              <>
                <section className="space-y-5">
                  <h3 className="font-[family-name:var(--font-display)] text-xl text-white">
                    Special requests
                  </h3>
                  <textarea
                    value={values.specialRequests}
                    onChange={(e) => update('specialRequests', e.target.value)}
                    rows={6}
                    placeholder="Tell us about your dream journey, special celebrations, preferred hotels, must-see places, accessibility requirements, dietary preferences, or anything else that will help us craft the perfect itinerary."
                    className="w-full border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] leading-relaxed text-white outline-none placeholder:text-white/30 focus:border-[#c5a059]/55"
                  />
                </section>

                <section className="border border-[#c5a059]/20 bg-white/[0.03] p-5 md:p-6">
                  <p className="text-[10px] font-semibold tracking-[0.28em] text-[#c5a059] uppercase">
                    Summary
                  </p>
                  <dl className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-2">
                    <div>
                      <dt className="text-white/35">Name</dt>
                      <dd className="text-white">{values.fullName || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Email</dt>
                      <dd className="text-white">{values.email || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Destination</dt>
                      <dd className="text-white">
                        {values.undecided
                          ? 'Undecided'
                          : values.destinations.join(', ') || '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Travellers</dt>
                      <dd className="text-white">
                        {values.adults} adults
                        {values.children ? `, ${values.children} children` : ''}
                        {values.infants ? `, ${values.infants} infants` : ''}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Occasion</dt>
                      <dd className="text-white">{values.occasion || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Budget</dt>
                      <dd className="text-white">{values.budget || '—'}</dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Duration</dt>
                      <dd className="text-white">{values.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-white/35">Flights</dt>
                      <dd className="text-white">{values.cabinClass}</dd>
                    </div>
                  </dl>
                </section>

                <label className="flex cursor-pointer items-start gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={values.privacyAccepted}
                    onClick={() => update('privacyAccepted', !values.privacyAccepted)}
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition',
                      values.privacyAccepted
                        ? 'border-[#c5a059] bg-[#c5a059] text-[#0c0c0c]'
                        : 'border-white/30 text-transparent',
                    )}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                  <span className="text-sm leading-relaxed text-white/65">
                    I agree to the{' '}
                    <Link href={`/${locale}/privacy`} className="text-[#c5a059] hover:underline">
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link href={`/${locale}/terms`} className="text-[#c5a059] hover:underline">
                      Terms & Conditions
                    </Link>
                    .
                  </span>
                </label>
                {errors.privacyAccepted ? (
                  <p className="text-xs text-red-300">{errors.privacyAccepted}</p>
                ) : null}
              </>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex h-11 items-center gap-2 border border-white/15 px-5 text-[11px] font-semibold tracking-[0.18em] text-white/70 uppercase transition enabled:hover:border-white/35 enabled:hover:text-white disabled:opacity-30"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-11 items-center gap-2 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e] px-6 text-[11px] font-semibold tracking-[0.18em] text-[#0c0c0c] uppercase transition hover:brightness-110"
            >
              Continue
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onSubmit}
              disabled={pending}
              className="inline-flex h-11 items-center gap-2 bg-gradient-to-r from-[#a8863f] via-[#c5a059] to-[#d4b56e] px-6 text-[11px] font-semibold tracking-[0.18em] text-[#0c0c0c] uppercase transition hover:brightness-110 disabled:opacity-60"
            >
              {pending ? 'Sending…' : 'Submit enquiry'}
              {!pending ? <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} /> : null}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PlanJourneyTrust() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {trustPoints.map((point, i) => {
        const Icon = trustIcons[i] ?? Sparkles;
        return (
          <div
            key={point.title}
            className="border border-[#c5a059]/20 bg-[#0c0c0c]/80 px-5 py-5"
          >
            <Icon className="h-5 w-5 text-[#c5a059]" strokeWidth={1.4} />
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg text-white">
              {point.title}
            </p>
            <p className="mt-1 text-sm text-white/45">{point.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
