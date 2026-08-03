import { AdminPageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { siteSettings } from '@/data/demo';

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader title="Settings" description="Brand, contact details, socials, and feature flags." />
      <Card className="max-w-2xl">
        <CardHeader><CardTitle>Site settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Brand name</Label><Input defaultValue={siteSettings.brandName} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input defaultValue={siteSettings.phone} /></div>
          <div className="space-y-2"><Label>Email</Label><Input defaultValue={siteSettings.email} /></div>
          <div className="space-y-2"><Label>Address</Label><Input defaultValue={siteSettings.address} /></div>
          <div className="space-y-2"><Label>Instagram</Label><Input defaultValue={siteSettings.socials.instagram} /></div>
          <Button variant="admin">Save settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
