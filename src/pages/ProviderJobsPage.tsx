import { useState } from 'react';
import { bookings as initialBookings } from '@/data/mock';
import BookingCard from '@/components/BookingCard';
import { Booking } from '@/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ProviderJobsPage = () => {
  const [bookingsList, setBookingsList] = useState(initialBookings.filter(b => b.providerId === 'u3'));

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
    toast.success(`Status updated`);
  };

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">All Jobs</h1>
      <p className="mb-6 text-muted-foreground">Manage all assigned jobs</p>

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

export default ProviderJobsPage;
