import { useState } from 'react';
import { bookings as initialBookings } from '@/data/mock';
import BookingCard from '@/components/BookingCard';
import StatCard from '@/components/StatCard';
import { Booking } from '@/types';
import { Calendar, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const ProviderDashboard = () => {
  const [bookingsList, setBookingsList] = useState(initialBookings.filter(b => b.providerId === 'u3'));
  const [available, setAvailable] = useState(true);

  const pending = bookingsList.filter(b => b.status === 'pending').length;
  const active = bookingsList.filter(b => b.status === 'in_progress').length;
  const completed = bookingsList.filter(b => b.status === 'completed').length;
  const revenue = bookingsList.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.price, 0);

  const handleAccept = (id: string) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: 'confirmed' as const } : b));
    toast.success('Job accepted!');
  };

  const handleReject = (id: string) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
    toast.info('Job rejected');
  };

  const handleUpdateStatus = (id: string, status: Booking['status']) => {
    setBookingsList(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    toast.success(`Job marked as ${status.replace('_', ' ')}`);
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Provider Dashboard</h1>
          <p className="text-muted-foreground">Manage your jobs and availability</p>
        </div>
        <Card className="flex items-center gap-3 border border-border px-4 py-2">
          <Label className="text-sm">Available</Label>
          <Switch checked={available} onCheckedChange={setAvailable} />
        </Card>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Pending Jobs" value={pending} icon={Clock} />
        <StatCard title="Active Jobs" value={active} icon={Calendar} />
        <StatCard title="Completed" value={completed} icon={CheckCircle} />
        <StatCard title="Revenue" value={`₹${revenue}`} icon={DollarSign} />
      </div>

      <h2 className="mb-4 text-xl font-bold text-foreground">Your Jobs</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {bookingsList.map(booking => (
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
    </div>
  );
};

export default ProviderDashboard;
