import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookings as initialBookings } from '@/data/mock';
import BookingCard from '@/components/BookingCard';
import { Button } from '@/components/ui/button';

const tabs = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const;

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const userBookings = initialBookings.filter(b => b.userId === 'u1');

  const filtered = activeTab === 'all' ? userBookings : userBookings.filter(b => b.status === activeTab);

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">My Bookings</h1>
      <p className="mb-6 text-muted-foreground">Track your service requests</p>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map(tab => (
          <Button key={tab} size="sm" variant={activeTab === tab ? 'default' : 'outline'} onClick={() => setActiveTab(tab)} className="capitalize">
            {tab.replace('_', ' ')}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(booking => (
          <div key={booking.id} className="cursor-pointer" onClick={() => navigate(`/track/${booking.id}`)}>
            <BookingCard booking={booking} perspective="user" />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">No bookings found.</div>
      )}
    </div>
  );
};

export default UserBookingsPage;
