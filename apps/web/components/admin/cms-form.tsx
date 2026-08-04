'use client';

import {
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { ActionResult } from '@/features/cms/types';

type FormAction = (formData: FormData) => Promise<ActionResult>;

export function CmsForm({
  action,
  children,
  submitLabel = 'Save',
  dangerAction,
  dangerLabel = 'Delete',
  dangerRedirect,
  className,
}: {
  action: FormAction;
  children: ReactNode;
  submitLabel?: string;
  dangerAction?: FormAction;
  dangerLabel?: string;
  dangerRedirect?: string;
  className?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function run(actionFn: FormAction, form: HTMLFormElement, isDanger = false) {
    setError(null);
    setSuccess(false);
    const fd = new FormData(form);
    startTransition(async () => {
      const result = await actionFn(fd);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
      router.refresh();
      if (isDanger && dangerRedirect) {
        router.push(dangerRedirect);
      } else if (!isDanger && result.id && !fd.get('id')) {
        // After create, stay; parent list refresh is enough
      }
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    run(action, e.currentTarget);
  }

  return (
    <form onSubmit={onSubmit} className={cn('space-y-5', className)}>
      {children}
      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Saved successfully.
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button type="submit" variant="admin" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
        {dangerAction ? (
          <Button
            type="button"
            variant="adminOutline"
            disabled={pending}
            className="border-red-200 text-red-700 hover:bg-red-50"
            onClick={(e) => {
              const form = e.currentTarget.closest('form');
              if (!form) return;
              if (!window.confirm('Delete this item? This cannot be undone.')) return;
              run(dangerAction, form, true);
            }}
          >
            {dangerLabel}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint ? <p className="text-xs text-[var(--admin-muted)]">{hint}</p> : null}
    </div>
  );
}

export function TextInput({
  name,
  label,
  defaultValue,
  type = 'text',
  required,
  hint,
  placeholder,
}: {
  name: string;
  label: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
      />
    </Field>
  );
}

export function TextArea({
  name,
  label,
  defaultValue,
  rows = 4,
  hint,
  required,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="border-[var(--admin-border)]"
      />
    </Field>
  );
}

export function Select({
  name,
  label,
  defaultValue,
  options,
  hint,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? options[0]?.value}
        className="flex h-11 w-full rounded-md border border-[var(--admin-border)] bg-white px-3 py-2 text-sm text-[var(--admin-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-[var(--admin-text)]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[var(--admin-border)] text-[var(--color-gold)] focus:ring-[var(--color-gold)]"
      />
      {label}
    </label>
  );
}

export const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];
