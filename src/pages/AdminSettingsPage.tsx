import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Globe, Bell, Shield, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const AdminSettingsPage = () => {
  const [platformName, setPlatformName] = useState('ServiZone');
  const [commissionRate, setCommissionRate] = useState('15');
  const [taxRate, setTaxRate] = useState('18');
  const [currency, setCurrency] = useState('INR');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoAssign, setAutoAssign] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="container max-w-3xl py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Platform Settings</h1>
      <p className="mb-6 text-muted-foreground">Configure platform-wide settings</p>

      <div className="space-y-6">
        {/* General */}
        <Card className="border border-border p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Globe className="h-5 w-5 text-primary" /> General Settings
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Platform Name</Label>
              <Input value={platformName} onChange={e => setPlatformName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Currency</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
              <div>
                <Label>Time Zone</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                  <option>Asia/Kolkata (IST)</option>
                  <option>America/New_York (EST)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="border border-border p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <CreditCard className="h-5 w-5 text-primary" /> Pricing & Commission
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Platform Commission (%)</Label>
                <Input type="number" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">Percentage charged to providers per booking</p>
              </div>
              <div>
                <Label>Tax Rate (GST %)</Label>
                <Input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} />
                <p className="mt-1 text-xs text-muted-foreground">Applied on all service bookings</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="border border-border p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Bell className="h-5 w-5 text-primary" /> Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Send email alerts for bookings and updates</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">SMS Notifications</p>
                <p className="text-xs text-muted-foreground">Send SMS alerts to users and providers</p>
              </div>
              <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>
          </div>
        </Card>

        {/* System */}
        <Card className="border border-border p-6 shadow-card">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <Shield className="h-5 w-5 text-primary" /> System
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-assign Providers</p>
                <p className="text-xs text-muted-foreground">Automatically assign available providers to new bookings</p>
              </div>
              <Switch checked={autoAssign} onCheckedChange={setAutoAssign} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Maintenance Mode</p>
                <p className="text-xs text-muted-foreground">Temporarily disable new bookings</p>
              </div>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
          </div>
        </Card>

        <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={() => toast.success('Settings saved!')}>
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
