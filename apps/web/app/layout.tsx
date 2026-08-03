import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Great_Vibes } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const script = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: {
    default: 'Uncharted Journeys | Luxury Tailor-Made Travel',
    template: '%s | Uncharted Journeys',
  },
  description:
    'We design personalized luxury journeys around the world — cinematic, elegant, and entirely yours.',
  openGraph: {
    type: 'website',
    siteName: 'Uncharted Journeys',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${script.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
