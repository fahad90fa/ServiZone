import { useBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { useCategories, useCreateService } from '@/hooks/useServices';
import { useAuth } from '@/contexts/AuthContext';
import BookingCard from '@/components/BookingCard';
import StatCard from '@/components/StatCard';
import { Calendar, CheckCircle, Clock, DollarSign, Loader2, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';

const ProviderDashboard = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const { data: categories = [] } = useCategories();
  const createService = useCreateService();
  const updateStatus = useUpdateBookingStatus();
  const [available, setAvailable] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category_id: '',
  });

  const pending = bookings.filter(b => b.status === 'pending').length;
  const active = bookings.filter(b => b.status === 'in_progress').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const revenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + Number(b.price), 0);

  const handleAccept = (id: string) => updateStatus.mutate({ id, status: 'confirmed' });
  const handleReject = (id: string) => updateStatus.mutate({ id, status: 'cancelled' });
  const handleUpdateStatus = (id: string, status: string) => updateStatus.mutate({ id, status });

  const handleAddService = async () => {
    if (!form.name || !form.price || !form.category_id) {
      toast.error('Please fill required fields');
      return;
    }
    try {
      await createService.mutateAsync({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        duration: form.duration || '1 hour',
        category_id: form.category_id,
      });
      toast.success('Service added successfully!');
      setForm({ name: '', description: '', price: '', duration: '', category_id: '' });
      setDialogOpen(false);
    } catch (error) {
      toast.error('Failed to add service');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-foreground">Provider Dashboard</h1>
            <p className="font-body text-muted-foreground">Manage jobs & availability in real-time</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-sans text-xl">Add New Service</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label className="mb-1.5 font-body text-sm text-foreground/70">Service Name *</Label>
                    <Input
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Deep Home Cleaning"
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 font-body text-sm text-foreground/70">Category *</Label>
                    <Select value={form.category_id} onValueChange={v => setForm({ ...form, category_id: v })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="mb-1.5 font-body text-sm text-foreground/70">Price (Rs.) *</Label>
                      <Input
                        type="number"
                        value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        placeholder="500"
                        className="bg-secondary border-border"
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 font-body text-sm text-foreground/70">Duration</Label>
                      <Input
                        value={form.duration}
                        onChange={e => setForm({ ...form, duration: e.target.value })}
                        placeholder="1-2 hours"
                        className="bg-secondary border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 font-body text-sm text-foreground/70">Description</Label>
                    <Textarea
                      value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Describe your service..."
                      rows={3}
                      className="bg-secondary border-border resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleAddService}
                    disabled={createService.isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {createService.isPending ? 'Adding...' : 'Add Service'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Card className="flex items-center gap-3 glass border-border/50 px-4 py-2 shadow-soft">
              <Label className="font-body text-sm">Available</Label>
              <Switch checked={available} onCheckedChange={setAvailable} />
            </Card>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        <StatCard title="Pending" value={pending} icon={Clock} />
        <StatCard title="Active" value={active} icon={Calendar} />
        <StatCard title="Completed" value={completed} icon={CheckCircle} />
        <StatCard title="Revenue" value={`₹${revenue.toLocaleString()}`} icon={DollarSign} />
      </motion.div>

      <h2 className="mb-4 font-sans text-xl font-bold text-foreground">Your Jobs</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {bookings.map(booking => (
          <BookingCard
            key={booking.id}
            booking={booking}
            perspective="provider"
            showActions
            onAccept={handleAccept}
            onReject={handleReject}
            onUpdateStatus={handleUpdateStatus}
          />
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="py-20 text-center font-body text-muted-foreground">No jobs assigned yet.</div>
      )}
    </div>
  );
};

export default ProviderDashboard;