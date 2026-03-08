import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useService } from '@/hooks/useServices';
import { useCreateBooking } from '@/hooks/useBookings';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Star, ArrowLeft, CheckCircle, CreditCard, Smartphone, Building, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const PaymentBookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { data: service, isLoading } = useService(serviceId || '');
  const createBooking = useCreateBooking();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [processing, setProcessing] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!service) {
    return <div className="container py-20 text-center font-body text-muted-foreground">Service not found.</div>;
  }

  const tax = Math.round(Number(service.price) * 0.18);
  const total = Number(service.price) + tax;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    if (!currentUser) return;
    setProcessing(true);

    try {
      await createBooking.mutateAsync({
        user_id: currentUser.id,
        service_id: service.id,
        scheduled_date: form.date,
        scheduled_time: form.time,
        price: total,
        address: form.address,
        notes: form.notes || undefined,
      });
      setStep('success');
      toast.success('Payment successful! Booking confirmed.');
    } catch {
      toast.error('Failed to create booking');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 sm:py-10 px-4">
      <Button variant="ghost" className="mb-4 gap-2 font-body rounded-lg" onClick={() => step === 'details' ? navigate(-1) : step === 'payment' ? setStep('details') : null}>
        <ArrowLeft className="h-4 w-4" /> {step === 'payment' ? 'Back to details' : 'Back'}
      </Button>

      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-2">
        {['Details', 'Payment', 'Confirmation'].map((label, i) => {
          const stepIdx = { details: 0, payment: 1, success: 2 }[step];
          return (
            <div key={label} className="flex flex-1 items-center gap-1 sm:gap-2">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                i <= stepIdx ? 'gradient-primary text-primary-foreground shadow-glow' : 'bg-muted text-muted-foreground'
              }`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className={`hidden text-xs sm:text-sm sm:block font-body ${i <= stepIdx ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < 2 && <div className={`h-0.5 flex-1 rounded ${i < stepIdx ? 'gradient-primary' : 'bg-border'}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card className="overflow-hidden glass border-border/50 shadow-elevated noise">
              <div className="gradient-primary p-5 sm:p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(280_78%_60%_/_0.3),transparent_60%)]" />
                <div className="relative">
                  <h1 className="font-sans text-lg sm:text-xl font-bold text-primary-foreground">{service.name}</h1>
                  <div className="mt-2 flex items-center gap-4 font-body text-sm text-primary-foreground/70">
                    <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {service.rating}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.duration}</span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleDetailsSubmit} className="space-y-4 p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Calendar className="h-3.5 w-3.5 text-primary" /> Date *</Label>
                    <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-background/50 font-body rounded-lg" />
                  </div>
                  <div>
                    <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><Clock className="h-3.5 w-3.5 text-primary" /> Time *</Label>
                    <Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-background/50 font-body rounded-lg" />
                  </div>
                </div>
                <div>
                  <Label className="mb-1.5 flex items-center gap-1 font-body text-sm"><MapPin className="h-3.5 w-3.5 text-primary" /> Address *</Label>
                  <Input placeholder="Enter your full address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="bg-background/50 font-body rounded-lg" />
                </div>
                <div>
                  <Label className="mb-1.5 font-body text-sm">Notes (optional)</Label>
                  <Textarea placeholder="Any special instructions..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-background/50 font-body rounded-lg" />
                </div>
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground shadow-glow font-body rounded-xl">Proceed to Payment</Button>
              </form>
            </Card>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-5">
              <Card className="glass border-border/50 p-5 sm:p-6 shadow-elevated noise md:col-span-3">
                <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { key: 'card' as const, label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                    { key: 'upi' as const, label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                    { key: 'netbanking' as const, label: 'Net Banking', icon: Building, desc: 'All major banks' },
                  ].map(method => (
                    <div
                      key={method.key}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 sm:p-4 transition-all font-body ${
                        paymentMethod === method.key ? 'border-primary bg-primary/5 shadow-soft' : 'border-border/60 hover:border-primary/30'
                      }`}
                      onClick={() => setPaymentMethod(method.key)}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        paymentMethod === method.key ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <method.icon className={`h-5 w-5 ${paymentMethod === method.key ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                      <div className="ml-auto shrink-0">
                        <div className={`h-4 w-4 rounded-full border-2 ${
                          paymentMethod === method.key ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                        }`}>
                          {paymentMethod === method.key && <div className="m-0.5 h-2 w-2 rounded-full bg-primary-foreground" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-3">
                    <div><Label className="mb-1.5 font-body text-sm">Card Number</Label><Input placeholder="1234 5678 9012 3456" className="bg-background/50 font-body rounded-lg" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="mb-1.5 font-body text-sm">Expiry</Label><Input placeholder="MM/YY" className="bg-background/50 font-body rounded-lg" /></div>
                      <div><Label className="mb-1.5 font-body text-sm">CVV</Label><Input placeholder="123" type="password" className="bg-background/50 font-body rounded-lg" /></div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <Label className="mb-1.5 font-body text-sm">UPI ID</Label>
                    <Input placeholder="yourname@upi" className="bg-background/50 font-body rounded-lg" />
                  </div>
                )}
              </Card>

              <Card className="glass border-border/50 p-5 sm:p-6 shadow-elevated noise md:col-span-2">
                <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">Order Summary</h2>
                <div className="space-y-3 font-body text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{service.name}</span><span className="text-foreground">₹{service.price}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">₹{tax}</span></div>
                  <div className="border-t border-border/40 pt-3">
                    <div className="flex justify-between font-sans font-semibold"><span className="text-foreground">Total</span><span className="text-foreground">₹{total}</span></div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-muted/30 p-3 font-body text-xs text-muted-foreground space-y-0.5">
                  <p><strong>Date:</strong> {form.date}</p>
                  <p><strong>Time:</strong> {form.time}</p>
                  <p><strong>Address:</strong> {form.address}</p>
                </div>

                <Button
                  className="mt-4 w-full gradient-primary border-0 text-primary-foreground shadow-glow font-body rounded-xl"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${total}`
                  )}
                </Button>

                <p className="mt-2 text-center font-body text-xs text-muted-foreground">
                  🔒 Secured by 256-bit SSL encryption
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="glass border-border/50 p-8 sm:p-10 text-center shadow-elevated noise">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
              >
                <CheckCircle className="h-10 w-10 text-success" />
              </motion.div>
              <h2 className="mb-2 font-sans text-2xl font-bold text-foreground">Payment Successful!</h2>
              <p className="mb-1 font-body text-muted-foreground">Your booking has been confirmed.</p>
              <p className="mb-6 font-body text-sm text-muted-foreground">
                {service.name} • {form.date} at {form.time}
              </p>
              <div className="mb-6 rounded-xl bg-muted/30 p-4 font-body text-sm space-y-1">
                <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="font-semibold text-foreground">₹{total}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="capitalize text-foreground">{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Card'}</span></div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                <Button onClick={() => navigate('/bookings')} className="gradient-primary border-0 text-primary-foreground font-body rounded-xl">View Bookings</Button>
                <Button variant="outline" onClick={() => navigate('/services')} className="font-body rounded-xl">Book Another</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentBookingPage;
