import { Booking } from '@/hooks/useBookings';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-warning/10 text-warning border-warning/30' },
  confirmed: { label: 'Confirmed', className: 'bg-info/10 text-info border-info/30' },
  in_progress: { label: 'In Progress', className: 'bg-primary/10 text-primary border-primary/30' },
  completed: { label: 'Completed', className: 'bg-success/10 text-success border-success/30' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/30' },
};

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  perspective?: 'user' | 'provider' | 'admin';
}

const BookingCard = ({ booking, showActions, onAccept, onReject, onUpdateStatus, perspective = 'user' }: BookingCardProps) => {
  const status = statusConfig[booking.status] || statusConfig.pending;

  return (
    <Card className="border-border bg-card p-4 sm:p-5">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-sans font-semibold text-foreground truncate">{booking.service_name || 'Service'}</h3>
          <p className="font-body text-sm text-muted-foreground truncate">
            {perspective === 'user' ? 'Provider assigned' : `Customer: ${booking.user_name || 'User'}`}
          </p>
        </div>
        <Badge variant="outline" className={`shrink-0 font-body text-xs ${status.className}`}>{status.label}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-1.5 font-body text-sm text-muted-foreground sm:grid-cols-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <span className="truncate">{booking.scheduled_date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <span>{booking.scheduled_time}</span>
        </div>
        <div className="col-span-1 sm:col-span-2 flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
          <span className="truncate">{booking.address || 'Address not provided'}</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-1 font-sans font-semibold text-foreground">
          <IndianRupee className="h-4 w-4" />
          {booking.price}
        </div>

        {showActions && booking.status === 'pending' && (
          <div className="flex gap-2">
            {onAccept && <Button size="sm" onClick={() => onAccept(booking.id)} className="bg-primary text-primary-foreground font-body text-xs rounded-lg hover:bg-primary/90">Accept</Button>}
            {onReject && <Button size="sm" variant="outline" onClick={() => onReject(booking.id)} className="font-body text-xs rounded-lg border-border hover:border-destructive/40 hover:text-destructive">Reject</Button>}
          </div>
        )}

        {showActions && booking.status === 'confirmed' && onUpdateStatus && (
          <Button size="sm" onClick={() => onUpdateStatus(booking.id, 'in_progress')} className="bg-primary text-primary-foreground font-body text-xs rounded-lg hover:bg-primary/90">Start Job</Button>
        )}

        {showActions && booking.status === 'in_progress' && onUpdateStatus && (
          <Button size="sm" onClick={() => onUpdateStatus(booking.id, 'completed')} className="bg-success text-success-foreground font-body text-xs rounded-lg hover:bg-success/90">Complete</Button>
        )}
      </div>
    </Card>
  );
};

export default BookingCard;
