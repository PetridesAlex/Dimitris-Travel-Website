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
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  badge?: number;
};

type NavGroup = { label: string; items: NavItem[] };

export function AdminSidebar({ enquiryCount = 0 }: { enquiryCount?: number }) {
  const pathname = usePathname();

  const groups: NavGroup[] = [
    {
      label: 'Overview',
      items: [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/homepage', label: 'Homepage', icon: Home },
      ],
    },
    {
      label: 'Catalogue',
      items: [
        { href: '/admin/destinations', label: 'Destinations', icon: Globe2 },
        { href: '/admin/hotels', label: 'Hotels', icon: Hotel },
        { href: '/admin/experiences', label: 'Experiences', icon: Sparkles },
        { href: '/admin/collections', label: 'Collections', icon: Layers },
        { href: '/admin/itineraries', label: 'Itineraries', icon: Route },
      ],
    },
    {
      label: 'Publish',
      items: [
        { href: '/admin/blog', label: 'Blog', icon: Newspaper },
        { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
        { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
        { href: '/admin/media', label: 'Media Library', icon: Images },
      ],
    },
    {
      label: 'CRM',
      items: [
        {
          href: '/admin/enquiries',
          label: 'Enquiries',
          icon: Inbox,
          badge: enquiryCount > 0 ? enquiryCount : undefined,
        },
      ],
    },
    {
      label: 'System',
      items: [
        { href: '/admin/seo', label: 'SEO', icon: Search },
        { href: '/admin/navigation', label: 'Navigation', icon: Navigation },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="relative flex h-screen w-[272px] shrink-0 flex-col border-r border-[var(--admin-sidebar-border)] bg-[var(--admin-sidebar)] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#c5a059]/15 to-transparent"
      />

      <div className="relative border-b border-[var(--admin-sidebar-border)] px-5 py-5">
        <Link href="/admin" className="group flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 items-center justify-center border border-[#c5a059]/45 bg-[#c5a059]/12 text-[#c5a059] transition group-hover:border-[#c5a059] group-hover:bg-[#c5a059]/20">
            <span className="font-[family-name:var(--font-display)] text-lg leading-none">U</span>
          </span>
          <span>
            <span className="block font-[family-name:var(--font-display)] text-[22px] leading-none tracking-tight text-white">
              Uncharted
            </span>
            <span className="mt-1.5 block text-[10px] font-semibold tracking-[0.22em] text-[#c5a059] uppercase">
              CMS Atelier
            </span>
          </span>
        </Link>
      </div>

      <nav className="relative flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
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
                      'group relative flex items-center gap-3 px-3 py-2.5 text-[13px] transition duration-200',
                      active
                        ? 'bg-[var(--admin-sidebar-active)] text-[#e8d5a8]'
                        : 'text-white/70 hover:bg-[var(--admin-sidebar-hover)] hover:text-white',
                    )}
                  >
                    {active ? (
                      <span className="absolute inset-y-1.5 left-0 w-[2px] bg-[#c5a059]" />
                    ) : null}
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition',
                        active ? 'text-[#c5a059]' : 'text-white/40 group-hover:text-[#c5a059]',
                      )}
                      strokeWidth={1.6}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="min-w-[1.25rem] rounded-full bg-[#c5a059] px-1.5 py-0.5 text-center text-[10px] font-bold text-[#0c0c0c]">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-[var(--admin-sidebar-border)] p-4">
        <Link
          href="/en"
          target="_blank"
          className="flex items-center justify-between gap-2 border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[12px] text-white/65 transition hover:border-[#c5a059]/40 hover:text-[#c5a059]"
        >
          <span>Open public site</span>
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.6} />
        </Link>
      </div>
    </aside>
  );
}
