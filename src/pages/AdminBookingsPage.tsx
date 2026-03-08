import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const statusOptions = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

const statusStyles: Record<string, string> = {
  pending: 'bg-warning/10 text-warning',
  confirmed: 'bg-info/10 text-info',
  in_progress: 'bg-primary/10 text-primary',
  completed: 'bg-success/10 text-success',
  cancelled: 'bg-destructive/10 text-destructive',
};

const AdminBookingsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const qc = useQueryClient();

  // Real-time
  useEffect(() => {
    const channel = supabase
      .channel('admin-bookings-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        qc.invalidateQueries({ queryKey: ['admin-bookings-page'] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [qc]);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings-page'],
    queryFn: async () => {
      const { data } = await supabase.from('bookings').select('*, services(name)').order('created_at', { ascending: false });
      return (data || []).map((b: any) => ({ ...b, service_name: (b.services as any)?.name || '' }));
    },
  });

  const filtered = bookings.filter((b: any) => {
    const matchSearch = (b.service_name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) toast.error('Failed to update');
    else toast.success(`Status updated to ${status}`);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container py-8 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-sans text-3xl sm:text-4xl font-bold text-foreground">Manage Bookings</h1>
        <p className="mb-6 font-body text-muted-foreground">Real-time booking management</p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card/50 border-border/60 font-body rounded-xl" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['all', ...statusOptions].map(s => (
            <Button key={s} size="sm" variant={statusFilter === s ? 'default' : 'outline'} onClick={() => setStatusFilter(s)}
              className={`capitalize font-body text-xs rounded-lg shrink-0 ${statusFilter === s ? 'gradient-primary border-0 text-primary-foreground' : 'border-border/60'}`}
            >
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {filtered.map((b: any) => (
          <Card key={b.id} className="glass border-border/50 p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-sans font-semibold text-foreground truncate">{b.service_name}</p>
                <p className="font-body text-xs text-muted-foreground">{b.scheduled_date} {b.scheduled_time}</p>
              </div>
              <Badge variant="outline" className={`capitalize font-body text-xs shrink-0 ${statusStyles[b.status] || ''}`}>
                {b.status.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans font-semibold text-foreground">₹{b.price}</span>
              <Select value={b.status} onValueChange={(val) => updateStatus(b.id, val)}>
                <SelectTrigger className="h-8 w-28 text-xs font-body rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(s => (
                    <SelectItem key={s} value={s} className="capitalize text-xs font-body">{s.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop table */}
      <Card className="hidden sm:block glass border-border/50 shadow-elevated noise overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-border/40 text-left text-muted-foreground">
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b: any) => (
              <tr key={b.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                <td className="p-4 text-foreground">{b.service_name}</td>
                <td className="p-4 text-muted-foreground">{b.scheduled_date} {b.scheduled_time}</td>
                <td className="p-4 font-medium text-foreground">₹{b.price}</td>
                <td className="p-4">
                  <Badge variant="outline" className={`capitalize text-xs ${statusStyles[b.status] || ''}`}>
                    {b.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="p-4">
                  <Select value={b.status} onValueChange={(val) => updateStatus(b.id, val)}>
                    <SelectTrigger className="h-8 w-32 text-xs font-body rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map(s => (
                        <SelectItem key={s} value={s} className="capitalize text-xs font-body">{s.replace('_', ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {filtered.length === 0 && (
        <div className="py-20 text-center font-body text-muted-foreground">No bookings found.</div>
      )}
    </div>
  );
};

export default AdminBookingsPage;
