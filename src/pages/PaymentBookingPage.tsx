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
import { Calendar, Clock, MapPin, Star, ChevronRight, CheckCircle, CreditCard, Smartphone, Building, Loader2, Shield, ArrowLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const categoryImages: Record<string, string> = {
  cleaning: '/images/cleaning.jpg',
  plumbing: '/images/plumbing.jpg',
  electrical: '/images/electrical.jpg',
  painting: '/images/painting.jpg',
  'pest control': '/images/pest-control.jpg',
  'appliance repair': '/images/appliance-repair.jpg',
};

const getServiceImage = (service: any): string => {
  if (service.image_url && service.image_url.length > 5) return service.image_url;
  const catName = (service.category_name || '').toLowerCase();
  for (const [key, val] of Object.entries(categoryImages)) {
    if (catName.includes(key)) return val;
  }
  const sName = (service.name || '').toLowerCase();
  for (const [key, val] of Object.entries(categoryImages)) {
    if (sName.includes(key)) return val;
  }
  return '/images/cleaning.jpg';
};

const steps = ['Schedule', 'Payment', 'Done'];

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
  const stepIdx = { details: 0, payment: 1, success: 2 }[step];
  const imageUrl = getServiceImage(service);

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
      toast.success('Booking confirmed!');
    } catch {
      toast.error('Failed to create booking');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container max-w-5xl py-6 pb-16">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center gap-2 font-body text-sm text-muted-foreground"
      >
        <span className="cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('/')}>Home</span>
        <ChevronRight className="h-3 w-3" />
        <span className="cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate('/services')}>Services</span>
        <ChevronRight className="h-3 w-3" />
        <span className="cursor-pointer hover:text-foreground transition-colors" onClick={() => navigate(`/service/${service.id}`)}>{service.name}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Book</span>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="mb-8 flex items-center justify-center gap-0"
      >
        {steps.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                i < stepIdx ? 'bg-success text-success-foreground' : i === stepIdx ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {i < stepIdx ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block font-body text-sm ${
                i <= stepIdx ? 'font-medium text-foreground' : 'text-muted-foreground'
              }`}>{label}</span>
            </div>
            {i < 2 && <div className={`mx-3 sm:mx-4 h-px w-10 sm:w-16 transition-colors duration-300 ${i < stepIdx ? 'bg-success' : 'bg-border'}`} />}
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Details */}
        {step === 'details' && (
          <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Form */}
              <div className="lg:col-span-3">
                <h1 className="font-sans text-xl font-bold text-foreground mb-1">Schedule your service</h1>
                <p className="font-body text-sm text-muted-foreground mb-5">Choose a date, time, and location that works for you.</p>

                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 flex items-center gap-1.5 font-body text-sm text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" /> Preferred Date <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={form.date}
                        onChange={e => setForm({ ...form, date: e.target.value })}
                        className="bg-secondary/50 border-border font-body rounded-xl h-11"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <Label className="mb-1.5 flex items-center gap-1.5 font-body text-sm text-foreground">
                        <Clock className="h-3.5 w-3.5 text-primary" /> Preferred Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="time"
                        value={form.time}
                        onChange={e => setForm({ ...form, time: e.target.value })}
                        className="bg-secondary/50 border-border font-body rounded-xl h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="mb-1.5 flex items-center gap-1.5 font-body text-sm text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" /> Service Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. 42, MG Road, Sector 5, Bangalore"
                      value={form.address}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                      className="bg-secondary/50 border-border font-body rounded-xl h-11"
                    />
                  </div>
                  <div>
                    <Label className="mb-1.5 font-body text-sm text-foreground">Special Instructions</Label>
                    <Textarea
                      placeholder="Any details the professional should know..."
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="bg-secondary/50 border-border font-body rounded-xl min-h-[80px]"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground font-body rounded-xl h-12 text-sm font-semibold hover:bg-primary/90 transition-all">
                    Continue to Payment
                  </Button>
                </form>
              </div>

              {/* Service Summary Sidebar */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden border border-border/50 bg-card sticky top-24">
                  <div className="relative h-36 overflow-hidden">
                    <img src={imageUrl} alt={service.name} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  </div>
                  <div className="p-4 -mt-8 relative">
                    <h3 className="font-sans text-base font-semibold text-foreground">{service.name}</h3>
                    <div className="mt-1.5 flex items-center gap-3 font-body text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {service.rating}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.duration}</span>
                    </div>

                    <div className="mt-4 space-y-2 font-body text-sm border-t border-border/50 pt-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service fee</span>
                        <span className="text-foreground">Rs. {service.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">GST (18%)</span>
                        <span className="text-foreground">Rs. {tax}</span>
                      </div>
                      <div className="flex justify-between border-t border-border/50 pt-2 font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-primary font-sans text-lg">Rs. {total}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-start gap-2 rounded-xl bg-success/5 border border-success/15 p-3">
                      <Shield className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-muted-foreground">Free cancellation up to 4 hours before the scheduled time.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Payment */}
        {step === 'payment' && (
          <motion.div key="payment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <Button variant="ghost" size="sm" className="mb-4 gap-1.5 font-body text-sm text-muted-foreground hover:text-foreground rounded-lg -ml-2" onClick={() => setStep('details')}>
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to details
                </Button>
                <h1 className="font-sans text-xl font-bold text-foreground mb-1">Choose payment method</h1>
                <p className="font-body text-sm text-muted-foreground mb-5">All transactions are secure and encrypted.</p>

                <div className="space-y-3">
                  {[
                    { key: 'card' as const, label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard' },
                    { key: 'upi' as const, label: 'JazzCash / Easypaisa', icon: Smartphone, desc: 'Mobile wallets' },
                    { key: 'netbanking' as const, label: 'Bank Transfer', icon: Building, desc: 'All major banks supported' },
                  ].map(method => (
                    <div
                      key={method.key}
                      className={`flex cursor-pointer items-center gap-3.5 rounded-xl border p-4 transition-all font-body ${
                        paymentMethod === method.key
                          ? 'border-primary bg-primary/5'
                          : 'border-border/50 hover:border-border'
                      }`}
                      onClick={() => setPaymentMethod(method.key)}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        paymentMethod === method.key ? 'bg-primary/10' : 'bg-secondary'
                      }`}>
                        <method.icon className={`h-5 w-5 ${paymentMethod === method.key ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{method.label}</p>
                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        paymentMethod === method.key ? 'border-primary' : 'border-muted-foreground/30'
                      }`}>
                        {paymentMethod === method.key && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card fields */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'card' && (
                    <motion.div key="card-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="mt-4 space-y-3 rounded-xl border border-border/50 bg-secondary/20 p-4">
                        <div>
                          <Label className="mb-1.5 font-body text-sm text-foreground">Card Number</Label>
                          <Input placeholder="1234 5678 9012 3456" className="bg-background border-border font-body rounded-xl h-11" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="mb-1.5 font-body text-sm text-foreground">Expiry Date</Label>
                            <Input placeholder="MM / YY" className="bg-background border-border font-body rounded-xl h-11" />
                          </div>
                          <div>
                            <Label className="mb-1.5 font-body text-sm text-foreground">CVV</Label>
                            <Input placeholder="***" type="password" className="bg-background border-border font-body rounded-xl h-11" />
                          </div>
                        </div>
                        <div>
                          <Label className="mb-1.5 font-body text-sm text-foreground">Cardholder Name</Label>
                          <Input placeholder="Name on card" className="bg-background border-border font-body rounded-xl h-11" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === 'upi' && (
                    <motion.div key="upi-fields" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <div className="mt-4 rounded-xl border border-border/50 bg-secondary/20 p-4">
                        <Label className="mb-1.5 font-body text-sm text-foreground">Mobile Wallet Number</Label>
                        <Input placeholder="03XX-XXXXXXX" className="bg-background border-border font-body rounded-xl h-11" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-2">
                <Card className="border border-border/50 bg-card p-5 sticky top-24">
                  <h2 className="font-sans text-base font-semibold text-foreground mb-4">Order Summary</h2>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                    <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0">
                      <img src={imageUrl} alt={service.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{service.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{service.duration}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 font-body text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service fee</span>
                      <span className="text-foreground">&#8377;{service.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span className="text-foreground">&#8377;{tax}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2.5 font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary font-sans text-lg">&#8377;{total}</span>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="rounded-xl bg-secondary/30 p-3 mb-4 space-y-1.5 font-body text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-primary" /> {form.date}</div>
                    <div className="flex items-center gap-2"><Clock className="h-3 w-3 text-primary" /> {form.time}</div>
                    <div className="flex items-center gap-2"><MapPin className="h-3 w-3 text-primary" /> {form.address}</div>
                  </div>

                  <Button
                    className="w-full bg-primary text-primary-foreground font-body rounded-xl h-12 text-sm font-semibold hover:bg-primary/90 transition-all"
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing...</span>
                    ) : (
                      <>Pay &#8377;{total}</>
                    )}
                  </Button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 font-body text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> Secured by 256-bit SSL encryption
                  </div>
                </Card>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Success */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
            <div className="max-w-lg mx-auto">
              <Card className="border border-border/50 bg-card p-8 sm:p-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
                >
                  <CheckCircle className="h-10 w-10 text-success" />
                </motion.div>

                <h2 className="mb-1 font-sans text-2xl font-bold text-foreground">Booking Confirmed!</h2>
                <p className="mb-6 font-body text-sm text-muted-foreground">Your service has been booked successfully.</p>

                <div className="rounded-xl bg-secondary/30 border border-border/50 p-4 mb-6 text-left space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl overflow-hidden shrink-0">
                      <img src={imageUrl} alt={service.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{service.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{service.duration}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-body text-xs border-t border-border/50 pt-3">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="text-foreground font-medium">{form.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time</p>
                      <p className="text-foreground font-medium">{form.time}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount Paid</p>
                      <p className="text-foreground font-medium">&#8377;{total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Payment</p>
                      <p className="text-foreground font-medium capitalize">{paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Card'}</p>
                    </div>
                  </div>
                  <div className="font-body text-xs border-t border-border/50 pt-3">
                    <p className="text-muted-foreground">Address</p>
                    <p className="text-foreground font-medium">{form.address}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
                  <Button onClick={() => navigate('/bookings')} className="bg-primary text-primary-foreground font-body rounded-xl hover:bg-primary/90">
                    View My Bookings
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/services')} className="font-body rounded-xl border-border">
                    Browse More Services
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentBookingPage;
