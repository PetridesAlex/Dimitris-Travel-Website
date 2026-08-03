import { AdminPageHeader, DataTable } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const redirects = [
  { from: '/japan', to: '/en/destinations/asia/japan', code: 301 },
  { from: '/morocco-tours', to: '/en/destinations/africa/morocco', code: 301 },
];

export default function AdminSeoPage() {
  return (
    <div>
      <AdminPageHeader title="SEO" description="Defaults, redirects, and templates. Per-entity SEO lives on translation forms." />
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>SEO defaults</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title template</Label>
              <Input defaultValue="%s | Uncharted Journeys" />
            </div>
            <div className="space-y-2">
              <Label>Default meta description</Label>
              <Input defaultValue="Tailor-made luxury journeys around the world." />
            </div>
            <Button variant="admin">Save defaults</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Structured data</CardTitle></CardHeader>
          <CardContent className="text-sm text-[var(--admin-muted)] space-y-2">
            <p>Automatic JSON-LD for TravelAgency, TouristDestination, TouristTrip, Article, BreadcrumbList, FAQPage.</p>
            <p>Sitemap: /sitemap.xml · Robots: /robots.txt</p>
          </CardContent>
        </Card>
      </div>
      <h2 className="mb-4 text-lg font-semibold">Redirects</h2>
      <DataTable
        columns={['From', 'To', 'Code']}
        rows={redirects.map((r) => [r.from, r.to, String(r.code)])}
      />
    </div>
  );
}
