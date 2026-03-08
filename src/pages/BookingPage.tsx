import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Star, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === serviceId);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '' });

  if (!service) {
    return <div className="container py-20 text-center text-muted-foreground">Service not found.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('success');
    toast.success('Booking confirmed!');
  };

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <AnimatePresence mode="wait">
        {step === 'form' ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="overflow-hidden border border-border shadow-card">
              <div className="gradient-primary p-6">
                <h1 className="text-xl font-bold text-primary-foreground">{service.name}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {service.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.duration}</span>
                  <span className="font-semibold text-primary-foreground">₹{service.price}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1.5 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Date *</Label>
                    <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} min="2026-03-08" />
                  </div>
                  <div>
                    <Label className="mb-1.5 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Time *</Label>
                    <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Address *</Label>
                  <Input placeholder="Enter your full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>
                <div>
                  <Label className="mb-1.5">Notes (optional)</Label>
                  <Textarea placeholder="Any special instructions..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">₹{service.price}</p>
                  </div>
                  <Button type="submit" size="lg" className="gradient-primary border-0 text-primary-foreground">
                    Confirm Booking
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border border-border p-10 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Booking Confirmed!</h2>
              <p className="mb-6 text-muted-foreground">
                Your {service.name} has been booked for {form.date} at {form.time}.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => navigate('/bookings')}>View Bookings</Button>
                <Button variant="outline" onClick={() => navigate('/services')}>Book Another</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;
