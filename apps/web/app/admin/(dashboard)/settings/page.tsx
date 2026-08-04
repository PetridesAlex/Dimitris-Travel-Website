import Link from 'next/link';
import { Building2, Mail, MapPin, Phone, Share2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/page-header';
import { CmsForm, TextInput } from '@/components/admin/cms-form';
import { saveSiteSettings } from '@/features/cms/actions';
import { settingsQueries } from '@/features/catalog/queries';

export default async function AdminSettingsPage() {
  const brand = await settingsQueries.getBrand();
  const socials = brand.socials || {};

  return (
    <div>
      <AdminPageHeader
        eyebrow="System"
        title="Settings"
        description="Brand identity, contact details, and social presence used across the public site and CMS."
        actions={
          <Link
            href="/en/contact"
            target="_blank"
            className="inline-flex h-11 items-center border border-[var(--admin-border)] bg-white px-4 text-[11px] font-semibold tracking-[0.14em] text-[var(--admin-muted)] uppercase transition hover:border-[#c5a059]/50 hover:text-[#a8863f]"
          >
            View contact page
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="admin-panel overflow-hidden">
          <div className="border-b border-[var(--admin-border)] bg-[linear-gradient(180deg,#faf6ef,#f3eee4)] px-6 py-5">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#c5a059] uppercase">
              Atelier profile
            </p>
            <h2 className="admin-display mt-1 text-2xl text-[var(--admin-text)]">
              Site settings
            </h2>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">
              Changes apply to footer, contact panel, and enquiry notifications.
            </p>
          </div>

          <div className="p-6 md:p-8">
            <CmsForm
              action={saveSiteSettings}
              submitLabel="Save settings"
              className="space-y-8"
            >
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center border border-[#c5a059]/35 bg-[#c5a059]/10 text-[#a8863f]">
                    <Building2 className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--admin-text)]">Brand</h3>
                    <p className="text-xs text-[var(--admin-muted)]">Public-facing name</p>
                  </div>
                </div>
                <TextInput
                  name="brandName"
                  label="Brand name"
                  defaultValue={brand.brandName}
                  hint="Shown in the footer and browser title contexts."
                />
              </section>

              <div className="h-px bg-[var(--admin-border)]" />

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center border border-[#c5a059]/35 bg-[#c5a059]/10 text-[#a8863f]">
                    <Phone className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--admin-text)]">Contact</h3>
                    <p className="text-xs text-[var(--admin-muted)]">How guests reach the atelier</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput name="phone" label="Phone" defaultValue={brand.phone} />
                  <TextInput name="email" label="Email" defaultValue={brand.email} />
                </div>
                <TextInput
                  name="address"
                  label="Address"
                  defaultValue={brand.address}
                  hint="Displayed on the contact page and footer."
                />
              </section>

              <div className="h-px bg-[var(--admin-border)]" />

              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center border border-[#c5a059]/35 bg-[#c5a059]/10 text-[#a8863f]">
                    <Share2 className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--admin-text)]">Social</h3>
                    <p className="text-xs text-[var(--admin-muted)]">Full profile URLs preferred</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <TextInput
                    name="instagram"
                    label="Instagram"
                    defaultValue={socials.instagram || ''}
                    placeholder="https://instagram.com/…"
                  />
                  <TextInput
                    name="telegram"
                    label="Telegram"
                    defaultValue={socials.telegram || ''}
                    placeholder="https://t.me/…"
                  />
                  <TextInput
                    name="whatsapp"
                    label="WhatsApp"
                    defaultValue={socials.whatsapp || ''}
                    placeholder="https://wa.me/…"
                  />
                  <TextInput
                    name="facebook"
                    label="Facebook"
                    defaultValue={socials.facebook || ''}
                    placeholder="https://facebook.com/…"
                  />
                  <TextInput
                    name="linkedin"
                    label="LinkedIn"
                    defaultValue={socials.linkedin || ''}
                    placeholder="https://linkedin.com/…"
                  />
                </div>
              </section>
            </CmsForm>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="admin-panel overflow-hidden">
            <div className="border-b border-[var(--admin-border)] bg-[linear-gradient(165deg,#1a1612,#0f0d0b)] px-5 py-6 text-white">
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
                Live preview
              </p>
              <p className="admin-display mt-3 text-3xl leading-none">
                {brand.brandName || 'Uncharted Journeys'}
              </p>
              <p className="mt-3 text-sm text-white/55">As guests see it on contact & footer</p>
            </div>
            <div className="space-y-4 p-5">
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" strokeWidth={1.6} />
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-[var(--admin-muted)] uppercase">
                    Phone
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--admin-text)]">{brand.phone || '—'}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" strokeWidth={1.6} />
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-[var(--admin-muted)] uppercase">
                    Email
                  </p>
                  <p className="mt-0.5 break-all text-sm text-[var(--admin-text)]">
                    {brand.email || '—'}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c5a059]" strokeWidth={1.6} />
                <div>
                  <p className="text-[10px] tracking-[0.16em] text-[var(--admin-muted)] uppercase">
                    Address
                  </p>
                  <p className="mt-0.5 text-sm text-[var(--admin-text)]">{brand.address || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-kpi p-5">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--admin-muted)] uppercase">
              Tip
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--admin-text)]">
              Keep phone and email current — enquiry forms and the contact panel pull from these
              fields.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
