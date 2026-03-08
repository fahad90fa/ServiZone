import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookings } from '@/hooks/useBookings';
import BookingCard from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { Loader2, CalendarX } from 'lucide-react';
import { motion } from 'framer-motion';

const tabs = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const;

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const { data: bookings = [], isLoading } = useBookings();
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = activeTab === 'all' ? bookings : bookings.filter(b => b.status === activeTab);

  return (
    <div className="container py-8 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-sans text-3xl sm:text-4xl font-bold text-foreground">My Bookings</h1>
        <p className="mb-6 font-body text-muted-foreground">Track your service requests in real-time</p>
      </motion.div>

      <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <Button
            key={tab}
            size="sm"
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className={`capitalize font-body text-xs rounded-lg shrink-0 ${activeTab === tab ? 'gradient-primary border-0 text-primary-foreground' : 'border-border/60'}`}
          >
            {tab.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map(booking => (
              <div key={booking.id} className="cursor-pointer" onClick={() => navigate(`/track/${booking.id}`)}>
                <BookingCard booking={booking} perspective="user" />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center">
              <CalendarX className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
              <p className="font-body text-muted-foreground">No bookings found.</p>
              <Button variant="outline" className="mt-4 font-body rounded-lg" onClick={() => navigate('/services')}>
                Browse Services
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default UserBookingsPage;
