import { useBookings, useUpdateBookingStatus } from '@/hooks/useBookings';
import BookingCard from '@/components/BookingCard';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ProviderJobsPage = () => {
  const { data: bookings = [], isLoading } = useBookings();
  const updateStatus = useUpdateBookingStatus();

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
        <h1 className="mb-2 font-sans text-3xl sm:text-4xl font-bold text-foreground">All Jobs</h1>
        <p className="mb-6 font-body text-muted-foreground">Manage all assigned jobs in real-time</p>
      </motion.div>

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

export default ProviderJobsPage;
