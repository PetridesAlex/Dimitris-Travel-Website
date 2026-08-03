'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe2,
  Hotel,
  Sparkles,
  Layers,
  Route,
  Newspaper,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Images,
  Search,
  Settings,
  Users,
  Navigation,
  Home,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/homepage', label: 'Homepage', icon: Home },
  { href: '/admin/destinations', label: 'Destinations', icon: Globe2 },
  { href: '/admin/hotels', label: 'Hotels', icon: Hotel },
  { href: '/admin/experiences', label: 'Experiences', icon: Sparkles },
  { href: '/admin/collections', label: 'Collections', icon: Layers },
  { href: '/admin/itineraries', label: 'Itineraries', icon: Route },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/enquiries', label: 'Enquiries', icon: Inbox },
  { href: '/admin/media', label: 'Media Library', icon: Images },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-[var(--admin-border)] bg-white">
      <div className="flex items-center gap-2 border-b border-[var(--admin-border)] px-5 py-5">
        <PanelLeft className="h-5 w-5 text-[var(--color-gold)]" />
        <div>
          <p className="text-sm font-semibold">Uncharted CMS</p>
          <p className="text-xs text-[var(--admin-muted)]">Luxury Travel Platform</p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {nav.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition',
                active
                  ? 'bg-[var(--color-gold)]/15 font-medium text-[var(--color-gold-dark)]'
                  : 'text-[var(--admin-text)] hover:bg-[var(--admin-bg)]',
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
