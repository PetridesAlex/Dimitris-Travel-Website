import { notFound } from 'next/navigation';
import { OrganizationJsonLd } from '@/components/marketing/json-ld';
import { PremiumPreloader } from '@/components/marketing/premium-preloader';
import { CookieConsent } from '@/components/marketing/cookie-consent';
import { Navbar } from '@/components/marketing/navbar';
import { Footer } from '@/components/marketing/footer';
import { getLocaleDirection, isValidLocale, type Locale } from '@/lib/i18n/config';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const dir = getLocaleDirection(locale as Locale);

  return (
    <div lang={locale} dir={dir}>
      <PremiumPreloader />
      <OrganizationJsonLd />
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
      <CookieConsent locale={locale} />
    </div>
  );
}
