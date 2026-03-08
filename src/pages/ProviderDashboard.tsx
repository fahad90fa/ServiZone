import { useBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import BookingCard from '@/components/BookingCard';
import StatCard from '@/components/StatCard';
import { Calendar, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ProviderDashboard = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const updateStatus = useUpdateBookingStatus();
  const [available, setAvailable] = useState(true);

  const pending = bookings.filter(b => b.status === 'pending').length;
  const active = bookings.filter(b => b.status === 'in_progress').length;
  const completed = bookings.filter(b => b.status === 'completed').length;
  const revenue = bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + Number(b.price), 0);

  const handleAccept = (id: string) => updateStatus.mutate({ id, status: 'confirmed' });
  const handleReject = (id: string) => updateStatus.mutate({ id, status: 'cancelled' });
  const handleUpdateStatus = (id: string, status: string) => updateStatus.mutate({ id, status });

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
          <Card className="flex items-center gap-3 glass border-border/50 px-4 py-2 shadow-soft w-fit">
            <Label className="font-body text-sm">Available</Label>
            <Switch checked={available} onCheckedChange={setAvailable} />
          </Card>
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
