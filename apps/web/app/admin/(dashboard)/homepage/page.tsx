import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const sections = [
  { type: 'hero', label: 'Luxury Hero', enabled: true },
  { type: 'trust_bar', label: 'Trust / Features Bar', enabled: true },
  { type: 'continents', label: 'Explore by Continent', enabled: true },
  { type: 'experiences', label: 'Featured Experiences', enabled: true },
  { type: 'itineraries', label: 'Signature Journeys', enabled: true },
  { type: 'testimonials', label: 'Testimonials', enabled: true },
  { type: 'blog', label: 'Travel Inspiration', enabled: true },
  { type: 'newsletter', label: 'Newsletter', enabled: true },
  { type: 'cta_band', label: 'Plan Your Journey CTA', enabled: true },
];

export default function AdminHomepagePage() {
  return (
    <div>
      <AdminPageHeader title="Homepage builder" description="Ordered section list. Each block has a typed schema editable in CMS." />
      <div className="space-y-3">
        {sections.map((s, idx) => (
          <Card key={s.type}>
            <CardHeader className="flex-row items-center justify-between space-y-0 py-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--admin-muted)]">#{idx + 1}</span>
                <CardTitle className="text-base">{s.label}</CardTitle>
                <Badge>{s.type}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="adminOutline" className="h-8 px-3 text-xs">Edit</Button>
                <Button variant="adminOutline" className="h-8 px-3 text-xs">{s.enabled ? 'Disable' : 'Enable'}</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-[var(--admin-muted)]">
              Drag to reorder · locale-aware content via translation tabs
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
