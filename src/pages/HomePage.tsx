import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useServices, useCategories } from '@/hooks/useServices';
import ServiceCard from '@/components/ServiceCard';
import { ArrowRight, Star, Shield, Clock, Sparkles, Wrench, Zap, Paintbrush, Settings, Bug, Search, CalendarCheck, CreditCard, ChevronRight } from 'lucide-react';
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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

const HomePage = () => {
  const navigate = useNavigate();
  const { data: services = [] } = useServices();
  const { data: categories = [] } = useCategories();
  const popularServices = services.filter(s => s.is_popular).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-24 md:py-36">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/10 blur-[100px] animate-float" />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full bg-accent/10 blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-sm text-primary-foreground/80">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="font-body">Trusted by 10,000+ homes</span>
            </div>
            <h1 className="font-sans text-5xl font-bold leading-[1.1] tracking-tight text-primary-foreground md:text-7xl">
              Home Services,{' '}
              <span className="text-gradient">Reimagined</span>
            </h1>
            <p className="mt-5 max-w-lg font-body text-lg text-primary-foreground/60 md:text-xl leading-relaxed">
              Book verified professionals for cleaning, repairs, painting and more. Fast, reliable, and backed by our satisfaction guarantee.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services">
                <Button size="lg" className="group gap-2 gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300 rounded-xl px-8">
                  Browse Services <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/5 backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-card/80 backdrop-blur-sm py-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
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
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <h2 className="font-sans text-3xl font-bold text-foreground">Service Categories</h2>
              <p className="mt-2 font-body text-muted-foreground">Choose from a wide range of professional services</p>
            </motion.div>
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Wrench;
                return (
                  <motion.div key={cat.id} variants={fadeUp}>
                    <Card
                      className="group cursor-pointer border border-border/60 p-5 text-center shadow-soft hover-lift noise"
                      onClick={() => navigate('/services')}
                    >
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/8 transition-all duration-300 group-hover:gradient-primary group-hover:shadow-glow group-hover:scale-110">
                        <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
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
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-12 text-center">
              <h2 className="font-sans text-3xl font-bold text-foreground">How It Works</h2>
              <p className="mt-2 font-body text-muted-foreground">Book a service in 4 simple steps</p>
            </motion.div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item, i) => (
                <motion.div key={item.title} variants={fadeUp} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 shadow-soft">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground shadow-glow">
                    {i + 1}
                  </div>
                  <h3 className="font-sans font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 font-body text-sm text-muted-foreground">{item.description}</p>
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
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="font-sans text-3xl font-bold text-foreground">Popular Services</h2>
                <p className="mt-1 font-body text-muted-foreground">Most booked services this month</p>
              </div>
              <Link to="/services">
                <Button variant="ghost" className="group gap-1 font-body">
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
      <section className="gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-sans text-4xl font-bold text-primary-foreground">Ready to get started?</h2>
            <p className="mx-auto mt-4 max-w-md font-body text-primary-foreground/60 text-lg">
              Join thousands of satisfied customers. Book your first service today.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/services">
                <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-300 rounded-xl px-8">
                  Book a Service
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="rounded-xl border-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/5">
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
