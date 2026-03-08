import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, Award, Heart, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Cities', value: '50+' },
  { label: 'Service Professionals', value: '10,000+' },
  { label: 'Services Completed', value: '2M+' },
  { label: 'Happy Customers', value: '500K+' },
];

const values = [
  { icon: Shield, title: 'Trust & Safety', desc: 'All professionals are background-verified and trained to deliver quality service.' },
  { icon: Award, title: 'Quality Assurance', desc: 'We maintain strict quality standards with regular performance reviews.' },
  { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our top priority with our 100% satisfaction guarantee.' },
  { icon: Users, title: 'Community', desc: 'Building a community of skilled professionals and happy customers.' },
];

const AboutPage = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="gradient-hero py-16 md:py-24">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <h1 className="text-4xl font-extrabold text-primary-foreground md:text-5xl">About ServiZone</h1>
          <p className="mt-4 text-lg text-primary-foreground/70">
            We're on a mission to make home services accessible, reliable, and hassle-free for everyone. 
            Founded in 2024, ServiZone connects you with verified professionals for all your home service needs.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="border-b border-border bg-card py-10">
      <div className="container grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="text-center">
            <p className="text-3xl font-bold text-gradient">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Values */}
    <section className="py-16">
      <div className="container">
        <h2 className="mb-8 text-center text-2xl font-bold text-foreground">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="border border-border p-6 text-center shadow-card h-full">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section className="border-t border-border bg-secondary/30 py-16">
      <div className="container text-center">
        <h2 className="mb-4 text-2xl font-bold text-foreground">Get in Touch</h2>
        <div className="mx-auto mb-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Bangalore, India</span>
          <span className="flex items-center gap-1.5"><Phone className="h-4 w-4" /> +91 1800-123-4567</span>
          <span className="flex items-center gap-1.5"><Mail className="h-4 w-4" /> hello@servizone.com</span>
        </div>
        <Link to="/services">
          <Button size="lg" className="gap-2 gradient-primary border-0 text-primary-foreground">
            Browse Services <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  </div>
);

export default AboutPage;
