/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdminPageHeader } from '@/components/admin/page-header';
import { NavigationEditor } from '@/components/admin/navigation-editor';
import { createServiceClient } from '@/lib/supabase/server';

export default async function AdminNavigationPage() {
  const db = createServiceClient();
  let items: { id?: string; href: string; label: string; sortOrder: number }[] = [];

  if (db) {
    const { data: menu } = await (db as any)
      .from('navigation_menus')
      .select('id')
      .eq('key', 'primary')
      .maybeSingle();

    if (menu?.id) {
      const { data: rows } = await (db as any)
        .from('navigation_items')
        .select('id, href, sort_order, navigation_item_translations(label, locale)')
        .eq('menu_id', menu.id)
        .order('sort_order');
      items = (rows || []).map((r: any) => {
        const trs = r.navigation_item_translations as
          | { label?: string; locale?: string }[]
          | null;
        const tr = trs?.find((t) => t.locale === 'en') || trs?.[0];
        return {
          id: r.id as string,
          href: r.href as string,
          label: String(tr?.label ?? ''),
          sortOrder: Number(r.sort_order ?? 0),
        };
      });
    }
  }

  if (!items.length) {
    items = [
      { href: '/', label: 'Home', sortOrder: 1 },
      { href: '/destinations', label: 'Destinations', sortOrder: 2 },
      { href: '/experiences', label: 'Experiences', sortOrder: 3 },
      { href: '/collections', label: 'Special Collections', sortOrder: 4 },
      { href: '/about', label: 'About Us', sortOrder: 5 },
      { href: '/contact', label: 'Contact', sortOrder: 6 },
    ];
  }

  return (
    <div>
      <AdminPageHeader
        title="Navigation"
        description="Primary header menu and footer link columns."
      />
      <NavigationEditor initial={items} />
    </div>
  );
}
