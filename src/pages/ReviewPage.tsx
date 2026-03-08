import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookings, reviews as initialReviews } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';

const ReviewPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Get completed bookings that haven't been reviewed
  const completedBookings = bookings.filter(b => b.userId === 'u1' && b.status === 'completed');
  const reviewedBookingIds = initialReviews.map(r => r.bookingId);
  const unreviewedBookings = completedBookings.filter(b => !reviewedBookingIds.includes(b.id));
  const [selectedBooking, setSelectedBooking] = useState(unreviewedBookings[0]?.id || '');

  const booking = bookings.find(b => b.id === selectedBooking);

  const handleSubmit = () => {
    if (rating === 0) { toast.error('Please select a rating'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }

    addNotification({
      title: 'Review Submitted',
      message: `Your review for ${booking?.serviceName} has been posted. Thank you!`,
      time: 'Just now',
      type: 'info',
    });

    setSubmitted(true);
    toast.success('Review submitted! Thank you for your feedback.');
  };

  if (submitted) {
    return (
      <div className="container max-w-lg py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border border-border p-10 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <Star className="h-8 w-8 fill-warning text-warning" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Thank You!</h2>
            <p className="mb-6 text-muted-foreground">Your review helps other customers make better choices.</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => navigate('/bookings')}>My Bookings</Button>
              <Button variant="outline" onClick={() => navigate('/services')}>Browse Services</Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border border-border shadow-card overflow-hidden">
          <div className="gradient-primary p-6">
            <h1 className="text-xl font-bold text-primary-foreground">Rate Your Experience</h1>
            <p className="mt-1 text-sm text-primary-foreground/70">Help us improve our services</p>
          </div>

          <div className="p-6 space-y-6">
            {unreviewedBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="font-medium">No pending reviews</p>
                <p className="text-sm">Complete a booking to leave a review</p>
              </div>
            ) : (
              <>
                {unreviewedBookings.length > 1 && (
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">Select Booking</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={selectedBooking}
                      onChange={e => setSelectedBooking(e.target.value)}
                    >
                      {unreviewedBookings.map(b => (
                        <option key={b.id} value={b.id}>{b.serviceName} - {b.date}</option>
                      ))}
                    </select>
                  </div>
                )}

                {booking && (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="font-medium text-foreground">{booking.serviceName}</p>
                    <p className="text-muted-foreground">Provider: {booking.providerName} • {booking.date}</p>
                  </div>
                )}

                <div>
                  <label className="mb-3 block text-sm font-medium text-foreground">Your Rating</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-10 w-10 transition-colors ${
                            star <= (hoveredRating || rating)
                              ? 'fill-warning text-warning'
                              : 'text-border'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    {rating === 1 ? 'Poor' : rating === 2 ? 'Fair' : rating === 3 ? 'Good' : rating === 4 ? 'Very Good' : rating === 5 ? 'Excellent' : 'Tap to rate'}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">Your Review</label>
                  <Textarea
                    placeholder="Tell us about your experience..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button className="w-full gradient-primary border-0 text-primary-foreground" onClick={handleSubmit}>
                  Submit Review
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Previous Reviews */}
        {initialReviews.filter(r => r.userId === 'u1').length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">Your Past Reviews</h2>
            <div className="space-y-3">
              {initialReviews.filter(r => r.userId === 'u1').map(review => (
                <Card key={review.id} className="border border-border p-4 shadow-card">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{review.serviceName}</p>
                      <div className="mt-1 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-warning text-warning' : 'text-border'}`} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewPage;
