import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { services } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, MapPin, Star, ArrowLeft, CheckCircle, CreditCard, Smartphone, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNotifications } from '@/contexts/NotificationContext';

const PaymentBookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === serviceId);
  const { addNotification } = useNotifications();
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [form, setForm] = useState({ date: '', time: '', address: '', notes: '' });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [processing, setProcessing] = useState(false);

  if (!service) {
    return <div className="container py-20 text-center text-muted-foreground">Service not found.</div>;
  }

  const tax = Math.round(service.price * 0.18);
  const total = service.price + tax;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.date || !form.time || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setStep('payment');
  };

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep('success');
      addNotification({
        title: 'Payment Successful',
        message: `Payment of ₹${total} received for ${service.name}. Your booking is confirmed!`,
        time: 'Just now',
        type: 'payment',
      });
      addNotification({
        title: 'Booking Confirmed',
        message: `${service.name} booked for ${form.date} at ${form.time}.`,
        time: 'Just now',
        type: 'booking',
      });
      toast.success('Payment successful!');
    }, 2000);
  };

  return (
    <div className="container max-w-2xl py-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => step === 'details' ? navigate(-1) : step === 'payment' ? setStep('details') : null}>
        <ArrowLeft className="h-4 w-4" /> {step === 'payment' ? 'Back to details' : 'Back'}
      </Button>

      {/* Progress bar */}
      <div className="mb-6 flex items-center gap-2">
        {['Details', 'Payment', 'Confirmation'].map((label, i) => {
          const stepIdx = { details: 0, payment: 1, success: 2 }[step];
          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= stepIdx ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {i < stepIdx ? '✓' : i + 1}
              </div>
              <span className={`hidden text-sm sm:block ${i <= stepIdx ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{label}</span>
              {i < 2 && <div className={`h-0.5 flex-1 ${i < stepIdx ? 'gradient-primary' : 'bg-border'}`} />}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <Card className="overflow-hidden border border-border shadow-card">
              <div className="gradient-primary p-6">
                <h1 className="text-xl font-bold text-primary-foreground">{service.name}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-warning text-warning" /> {service.rating}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {service.duration}</span>
                </div>
              </div>
              <form onSubmit={handleDetailsSubmit} className="space-y-4 p-6">
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
                <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Proceed to Payment</Button>
              </form>
            </Card>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid gap-6 md:grid-cols-5">
              <Card className="border border-border p-6 shadow-card md:col-span-3">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { key: 'card' as const, label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                    { key: 'upi' as const, label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                    { key: 'netbanking' as const, label: 'Net Banking', icon: Building, desc: 'All major banks' },
                  ].map(method => (
                    <div
                      key={method.key}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-all ${
                        paymentMethod === method.key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setPaymentMethod(method.key)}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        paymentMethod === method.key ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <method.icon className={`h-5 w-5 ${paymentMethod === method.key ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                      <div className="ml-auto">
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
                    <div><Label className="mb-1.5">Card Number</Label><Input placeholder="1234 5678 9012 3456" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label className="mb-1.5">Expiry</Label><Input placeholder="MM/YY" /></div>
                      <div><Label className="mb-1.5">CVV</Label><Input placeholder="123" type="password" /></div>
                    </div>
                    <div><Label className="mb-1.5">Cardholder Name</Label><Input placeholder="Name on card" /></div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <Label className="mb-1.5">UPI ID</Label>
                    <Input placeholder="yourname@upi" />
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="mt-4">
                    <Label className="mb-1.5">Select Bank</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                      <option>State Bank of India</option>
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}
              </Card>

              <Card className="border border-border p-6 shadow-card md:col-span-2">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{service.name}</span><span className="text-foreground">₹{service.price}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span className="text-foreground">₹{tax}</span></div>
                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between font-semibold"><span className="text-foreground">Total</span><span className="text-foreground">₹{total}</span></div>
                  </div>
                </div>

                <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <p><strong>Date:</strong> {form.date}</p>
                  <p><strong>Time:</strong> {form.time}</p>
                  <p><strong>Address:</strong> {form.address}</p>
                </div>

                <Button
                  className="mt-4 w-full gradient-primary border-0 text-primary-foreground"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${total}`
                  )}
                </Button>

                <p className="mt-2 text-center text-xs text-muted-foreground">
                  🔒 Secured by 256-bit SSL encryption
                </p>
              </Card>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border border-border p-10 text-center shadow-card">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
              >
                <CheckCircle className="h-10 w-10 text-success" />
              </motion.div>
              <h2 className="mb-2 text-2xl font-bold text-foreground">Payment Successful!</h2>
              <p className="mb-1 text-muted-foreground">Your booking has been confirmed.</p>
              <p className="mb-6 text-sm text-muted-foreground">
                {service.name} • {form.date} at {form.time}
              </p>
              <div className="mb-6 rounded-lg bg-muted/50 p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Amount Paid</span><span className="font-semibold text-foreground">₹{total}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="capitalize text-foreground">{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Card'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs text-foreground">TXN{Date.now()}</span></div>
              </div>
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

export default PaymentBookingPage;
