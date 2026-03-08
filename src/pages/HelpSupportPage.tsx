import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, Phone, MapPin, Clock, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  { q: 'How do I book a service?', a: 'Browse our services, select the one you need, choose a date and time, provide your address, and proceed to payment. A professional will be assigned to your booking.' },
  { q: 'Can I cancel a booking?', a: 'Yes, you can cancel a booking before the provider starts the service. Go to My Bookings and select the booking you want to cancel.' },
  { q: 'How are providers verified?', a: 'All our service providers go through a thorough background check, skill verification, and training program before they are onboarded.' },
  { q: 'What payment methods are accepted?', a: 'We accept credit/debit cards, UPI, and net banking. All payments are processed securely.' },
  { q: 'What if I\'m not satisfied with the service?', a: 'We offer a satisfaction guarantee. If you\'re not happy, contact us within 24 hours and we\'ll arrange a free re-service or a refund.' },
  { q: 'How do I become a service provider?', a: 'Sign up as a provider, complete your profile, submit your documents for verification, and once approved, you can start accepting jobs.' },
];

const HelpSupportPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="mt-2 text-muted-foreground">We're here to help you with any questions or concerns</p>
      </div>

      {/* Contact Cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Phone, title: 'Call Us', detail: '+91 1800-123-4567', sub: 'Mon-Sat, 8AM-8PM' },
          { icon: Mail, title: 'Email Us', detail: 'support@servizone.com', sub: 'Response within 24hrs' },
          { icon: MessageCircle, title: 'Live Chat', detail: 'Chat with us', sub: 'Available 24/7' },
        ].map((item, i) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border border-border p-5 text-center shadow-card hover:shadow-elevated transition-all">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm font-medium text-primary">{item.detail}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* FAQ */}
        <div>
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
            <HelpCircle className="h-5 w-5 text-primary" /> Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground">Send us a Message</h2>
          <Card className="border border-border p-6 shadow-card">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Subject</Label>
                <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief subject" />
              </div>
              <div>
                <Label>Message *</Label>
                <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Describe your issue or question..." />
              </div>
              <Button type="submit" className="w-full gradient-primary border-0 text-primary-foreground">Send Message</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
