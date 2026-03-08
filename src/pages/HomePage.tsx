import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useServices, useCategories } from '@/hooks/useServices';
import ServiceCard from '@/components/ServiceCard';
import { ArrowRight, Star, Shield, Clock, Sparkles, Wrench, Zap, Paintbrush, Settings, Bug, Search, CalendarCheck, CreditCard, ChevronRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Wrench, Zap, Paintbrush, Settings, Bug,
};

const howItWorks = [
  { icon: Search, title: 'Browse Services', description: 'Explore our curated range of professional home services' },
  { icon: CalendarCheck, title: 'Book & Schedule', description: 'Pick your preferred date, time, and share your address' },
  { icon: CreditCard, title: 'Pay Securely', description: 'Multiple payment options with end-to-end encryption' },
  { icon: Star, title: 'Rate & Review', description: 'Share your experience and help the community' },
];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

const HomePage = () => {
  const navigate = useNavigate();
  const { data: services = [] } = useServices();
  const { data: categories = [] } = useCategories();
  const popularServices = services.filter(s => s.is_popular).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-28 md:py-40">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        {/* Animated orbs */}
        <div className="absolute top-20 right-10 h-96 w-96 rounded-full bg-primary/8 blur-[120px] animate-float" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-accent/6 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/3 blur-[150px] animate-pulse-soft" />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full glass-dark px-5 py-2 text-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="font-body text-foreground/70">Trusted by 10,000+ homes across India</span>
            </motion.div>
            <h1 className="font-sans text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-8xl">
              Home Services,{' '}
              <span className="text-gradient">Reimagined</span>
            </h1>
            <p className="mt-6 max-w-xl font-body text-lg text-foreground/40 md:text-xl leading-relaxed">
              Book verified professionals for cleaning, repairs, painting and more — fast, reliable, and backed by our satisfaction guarantee.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/services">
                <Button size="lg" className="group gap-2 gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-500 rounded-2xl px-10 h-14 text-base font-semibold">
                  Browse Services <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-2xl border-border h-14 px-8 text-foreground/70 hover:text-foreground hover:bg-secondary/50 hover:border-primary/30 transition-all duration-300">
                  <Play className="h-4 w-4 mr-2" /> Watch Demo
                </Button>
              </Link>
            </div>

            {/* Stats inline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-16 flex flex-wrap gap-10"
            >
              {[
                { value: '10K+', label: 'Happy Customers' },
                { value: '500+', label: 'Verified Pros' },
                { value: '4.8', label: 'Average Rating' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="font-sans text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="font-body text-sm text-foreground/30">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-card/50 backdrop-blur-sm py-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="container flex flex-wrap items-center justify-center gap-8 text-sm font-body text-muted-foreground"
        >
          {[
            { icon: Star, text: '4.8 Average Rating', color: 'text-warning' },
            { icon: Shield, text: 'Verified Professionals', color: 'text-success' },
            { icon: Clock, text: 'Same Day Service', color: 'text-info' },
            { icon: CreditCard, text: 'Secure Payments', color: 'text-primary' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-12">
              <p className="font-body text-sm font-medium text-primary mb-2 tracking-wider uppercase">What we offer</p>
              <h2 className="font-sans text-4xl font-bold text-foreground">Service Categories</h2>
              <p className="mt-2 font-body text-muted-foreground">Choose from a wide range of professional services</p>
            </motion.div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Wrench;
                return (
                  <motion.div key={cat.id} variants={fadeUp}>
                    <Card
                      className="group cursor-pointer border border-border/60 bg-card/50 p-5 text-center hover-lift glow-border"
                      onClick={() => navigate('/services')}
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-500 group-hover:gradient-primary group-hover:shadow-glow group-hover:scale-110">
                        <Icon className="h-6 w-6 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                      </div>
                      <p className="font-sans text-sm font-semibold text-foreground">{cat.name}</p>
                      <p className="mt-1 font-body text-xs text-muted-foreground line-clamp-1">{cat.description}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="absolute top-0 left-0 right-0 line-glow" />
        <div className="absolute bottom-0 left-0 right-0 line-glow" />
        <div className="container relative">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-14 text-center">
              <p className="font-body text-sm font-medium text-primary mb-2 tracking-wider uppercase">Simple Process</p>
              <h2 className="font-sans text-4xl font-bold text-foreground">How It Works</h2>
              <p className="mt-2 font-body text-muted-foreground">Book a service in 4 simple steps</p>
            </motion.div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item, i) => (
                <motion.div key={item.title} variants={fadeUp} className="relative text-center group">
                  <div className="mx-auto mb-5 flex h-18 w-18 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 transition-all duration-500 group-hover:bg-primary/20 group-hover:shadow-glow group-hover:scale-105" style={{ width: 72, height: 72 }}>
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground shadow-glow">
                    {i + 1}
                  </div>
                  <h3 className="font-sans font-semibold text-foreground text-lg">{item.title}</h3>
                  <p className="mt-2 font-body text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  {i < 3 && (
                    <ChevronRight className="absolute -right-4 top-8 hidden h-5 w-5 text-border lg:block" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-24">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <p className="font-body text-sm font-medium text-primary mb-2 tracking-wider uppercase">Top Picks</p>
                <h2 className="font-sans text-4xl font-bold text-foreground">Popular Services</h2>
                <p className="mt-1 font-body text-muted-foreground">Most booked services this month</p>
              </div>
              <Link to="/services">
                <Button variant="outline" className="group gap-2 font-body rounded-xl border-border hover:border-primary/40 hover:text-primary transition-all">
                  View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {popularServices.map(service => (
                <motion.div key={service.id} variants={fadeUp}>
                  <ServiceCard service={service} onBook={() => navigate(`/book/${service.id}`)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/6 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-0 left-0 right-0 line-glow" />
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-body text-sm font-medium text-primary mb-3 tracking-wider uppercase">Get Started Today</p>
            <h2 className="font-sans text-5xl font-bold text-foreground md:text-6xl">Ready to get started?</h2>
            <p className="mx-auto mt-5 max-w-md font-body text-foreground/40 text-lg leading-relaxed">
              Join thousands of satisfied customers. Book your first service today.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link to="/services">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-500 rounded-2xl px-10 h-14 text-base font-semibold">
                  Book a Service
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="rounded-2xl border-border h-14 px-8 text-foreground/70 hover:text-foreground hover:border-primary/30 transition-all duration-300">
                  Become a Provider
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
