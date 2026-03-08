import { useParams, useNavigate } from 'react-router-dom';
import { bookings } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Calendar, User, Phone, CheckCircle, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { key: 'pending', label: 'Booking Placed', description: 'Your booking request has been submitted' },
  { key: 'confirmed', label: 'Confirmed', description: 'Service provider has accepted your booking' },
  { key: 'in_progress', label: 'In Progress', description: 'Service professional is at your location' },
  { key: 'completed', label: 'Completed', description: 'Service has been completed successfully' },
];

const statusIndex: Record<string, number> = { pending: 0, confirmed: 1, in_progress: 2, completed: 3, cancelled: -1 };

const BookingTrackingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const booking = bookings.find(b => b.id === bookingId);

  if (!booking) {
    return <div className="container py-20 text-center text-muted-foreground">Booking not found.</div>;
  }

  const currentStep = statusIndex[booking.status] ?? -1;
  const isCancelled = booking.status === 'cancelled';

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border border-border shadow-card">
          <div className="gradient-primary p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-primary-foreground/60">Booking #{booking.id}</p>
                <h1 className="mt-1 text-xl font-bold text-primary-foreground">{booking.serviceName}</h1>
              </div>
              <Badge variant="outline" className={`capitalize ${
                isCancelled ? 'border-destructive/30 text-destructive' : 'border-primary-foreground/30 text-primary-foreground'
              }`}>
                {booking.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {/* Tracking Steps */}
            {!isCancelled && (
              <div className="mb-6">
                <h2 className="mb-4 font-semibold text-foreground">Tracking</h2>
                <div className="space-y-0">
                  {steps.map((step, i) => {
                    const isCompleted = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div key={step.key} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          {isCompleted ? (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary">
                              <CheckCircle className="h-4 w-4 text-primary-foreground" />
                            </div>
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-border">
                              <Circle className="h-3 w-3 text-muted-foreground" />
                            </div>
                          )}
                          {i < steps.length - 1 && (
                            <div className={`my-1 h-8 w-0.5 ${i < currentStep ? 'gradient-primary' : 'bg-border'}`} />
                          )}
                        </div>
                        <div className="pb-6">
                          <p className={`text-sm font-medium ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                            {isCurrent && <span className="ml-2 text-xs text-primary">(Current)</span>}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isCancelled && (
              <div className="mb-6 rounded-lg bg-destructive/5 p-4 text-center">
                <p className="font-medium text-destructive">This booking has been cancelled</p>
              </div>
            )}

            {/* Booking Details */}
            <h2 className="mb-3 font-semibold text-foreground">Booking Details</h2>
            <div className="space-y-3 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">{booking.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Address:</span>
                <span className="font-medium text-foreground">{booking.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium text-foreground">{booking.providerName}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-xl font-bold text-foreground">₹{booking.price}</p>
              </div>
              {booking.status === 'completed' && (
                <Badge className="bg-success/10 text-success border-success/30">Paid</Badge>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default BookingTrackingPage;
