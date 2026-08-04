import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Great_Vibes } from 'next/font/google';
import { getSiteUrl } from '@/lib/site-url';
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
  metadataBase: new URL(getSiteUrl()),
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('uj-preloader-seen')==='1'){document.documentElement.setAttribute('data-uj-ready','1')}else{document.documentElement.classList.add('uj-booting')}}catch(e){document.documentElement.classList.add('uj-booting')}})();`,
          }}
        />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${script.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
