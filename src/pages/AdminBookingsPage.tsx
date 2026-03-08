import { useState } from 'react';
import { bookings as initialBookings } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { toast } from 'sonner';
import { Booking } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusOptions: Booking['status'][] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-info/10 text-info',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const AdminBookingsPage = () => {
  const [search, setSearch] = useState('');
  const [bookingsList, setBookingsList] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = bookingsList.filter(b => {
    const matchSearch = b.userName.toLowerCase().includes(search.toLowerCase()) || b.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: Booking['status']) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Booking status updated to ${status}`);
  };

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Manage Bookings</h1>
      <p className="mb-6 text-muted-foreground">View and update all platform bookings</p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {['all', ...statusOptions].map(s => (
            <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)} className="capitalize text-xs">
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border border-border shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">ID</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Provider</th>
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4 font-mono text-xs text-muted-foreground">{b.id}</td>
                <td className="p-4 text-foreground">{b.userName}</td>
                <td className="p-4 text-foreground">{b.providerName}</td>
                <td className="p-4 text-foreground">{b.serviceName}</td>
                <td className="p-4 text-muted-foreground">{b.date} {b.time}</td>
                <td className="p-4 font-medium text-foreground">₹{b.price}</td>
                <td className="p-4">
                  <Badge variant="outline" className={`capitalize ${statusStyles[b.status]}`}>
                    {b.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="p-4">
                  <Select value={b.status} onValueChange={(val) => updateStatus(b.id, val as Booking['status'])}>
                    <SelectTrigger className="h-8 w-32 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => (
                        <SelectItem key={s} value={s} className="capitalize text-xs">{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminBookingsPage;
