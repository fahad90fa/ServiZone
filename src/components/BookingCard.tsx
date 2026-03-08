import { Booking } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';

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
  onUpdateStatus?: (id: string, status: Booking['status']) => void;
  perspective?: 'user' | 'provider' | 'admin';
}

const BookingCard = ({ booking, showActions, onAccept, onReject, onUpdateStatus, perspective = 'user' }: BookingCardProps) => {
  const status = statusConfig[booking.status];

  return (
    <Card className="overflow-hidden border border-border shadow-card transition-all hover:shadow-elevated">
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{booking.serviceName}</h3>
            <p className="text-sm text-muted-foreground">
              {perspective === 'user' ? `Provider: ${booking.providerName}` : `Customer: ${booking.userName}`}
            </p>
          </div>
          <Badge variant="outline" className={status.className}>{status.label}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {booking.date}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {booking.time}
          </div>
          <div className="col-span-2 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {booking.address}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <DollarSign className="h-4 w-4" />
            ₹{booking.price}
          </div>

          {showActions && booking.status === 'pending' && (
            <div className="flex gap-2">
              {onAccept && <Button size="sm" onClick={() => onAccept(booking.id)}>Accept</Button>}
              {onReject && <Button size="sm" variant="outline" onClick={() => onReject(booking.id)}>Reject</Button>}
            </div>
          )}

          {showActions && booking.status === 'confirmed' && onUpdateStatus && (
            <Button size="sm" onClick={() => onUpdateStatus(booking.id, 'in_progress')}>Start Job</Button>
          )}

          {showActions && booking.status === 'in_progress' && onUpdateStatus && (
            <Button size="sm" onClick={() => onUpdateStatus(booking.id, 'completed')}>Complete</Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BookingCard;
