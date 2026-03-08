import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useServices, useCategories } from '@/hooks/useServices';
import ServiceCard from '@/components/ServiceCard';
import { ArrowRight, Star, Shield, Clock, Wrench, Zap, Paintbrush, Settings, Bug, Sparkles, Search, CalendarCheck, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Wrench, Zap, Paintbrush, Settings, Bug,
};

const howItWorks = [
  { icon: Search, title: 'Browse', desc: 'Find the exact service you need from our curated catalog.' },
  { icon: CalendarCheck, title: 'Schedule', desc: 'Pick a time that works for you. Same-day available.' },
  { icon: CreditCard, title: 'Pay', desc: 'Secure checkout with multiple payment options.' },
  { icon: Star, title: 'Review', desc: 'Rate your experience and help others choose.' },
];

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HomePage = () => {
  const navigate = useNavigate();
  const { data: services = [] } = useServices();
  const { data: categories = [] } = useCategories();
  const popularServices = services.filter(s => s.is_popular).slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero — asymmetric editorial layout */}
      <section className="relative border-b border-border py-20 md:py-32">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-body text-xs font-medium text-primary">
                Trusted by 10,000+ homes
              </span>
              <h1 className="font-sans text-5xl font-800 leading-[1.05] text-foreground md:text-7xl">
                Home services,<br />
                <span className="text-gradient">done right.</span>
              </h1>
              <p className="mt-5 max-w-md font-body text-base text-muted-foreground leading-relaxed">
                Book verified professionals for cleaning, repairs, painting and more. Fast, reliable, satisfaction guaranteed.
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/services">
                  <Button size="lg" className="gap-2 rounded-xl bg-primary px-8 font-body text-sm font-semibold text-primary-foreground hover:bg-primary/90 h-12">
                    Browse Services <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="rounded-xl border-border font-body text-sm h-12 px-6 text-muted-foreground hover:text-foreground hover:border-foreground/20">
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:grid grid-cols-2 gap-3"
            >
              {[
                { value: '10K+', label: 'Customers', color: 'bg-primary/10 text-primary' },
                { value: '500+', label: 'Professionals', color: 'bg-success/10 text-success' },
                { value: '4.8★', label: 'Avg Rating', color: 'bg-warning/10 text-primary' },
                { value: '24h', label: 'Avg Response', color: 'bg-info/10 text-info' },
              ].map(s => (
                <Card key={s.label} className="border-border bg-card p-5">
                  <p className={`inline-flex items-center rounded-lg px-2.5 py-1 font-body text-xs font-medium ${s.color}`}>{s.label}</p>
                  <p className="mt-3 font-sans text-3xl font-bold text-foreground">{s.value}</p>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-card py-4">
        <div className="container flex flex-wrap items-center justify-center gap-8 font-body text-sm text-muted-foreground">
          {[
            { icon: Star, text: '4.8 Average Rating' },
            { icon: Shield, text: 'Verified Pros' },
            { icon: Clock, text: 'Same Day Service' },
            { icon: CreditCard, text: 'Secure Payments' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-primary" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
            <motion.div variants={fade} className="mb-10">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-2">Categories</p>
              <h2 className="font-sans text-3xl font-bold text-foreground">What we offer</h2>
            </motion.div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat) => {
                const Icon = iconMap[cat.icon] || Wrench;
                return (
                  <motion.div key={cat.id} variants={fade}>
                    <Card
                      className="group cursor-pointer border-border bg-card p-4 text-center hover-lift hover:border-primary/30 transition-colors"
                      onClick={() => navigate('/services')}
                    >
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-sans text-sm font-semibold text-foreground">{cat.name}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section className="border-y border-border bg-card/50 py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
            <motion.div variants={fade} className="mb-12 text-center">
              <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-2">Process</p>
              <h2 className="font-sans text-3xl font-bold text-foreground">How it works</h2>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item, i) => (
                <motion.div key={item.title} variants={fade} className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="absolute -top-2 right-1/2 translate-x-6 -translate-y-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="font-sans text-base font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1.5 font-body text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
            <motion.div variants={fade} className="mb-10 flex items-end justify-between gap-4">
              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-2">Popular</p>
                <h2 className="font-sans text-3xl font-bold text-foreground">Most booked this month</h2>
              </div>
              <Link to="/services">
                <Button variant="outline" size="sm" className="gap-1.5 font-body text-xs rounded-lg border-border hover:border-primary/40 hover:text-primary">
                  View All <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {popularServices.map(service => (
                <motion.div key={service.id} variants={fade}>
                  <ServiceCard service={service} onBook={() => navigate(`/book/${service.id}`)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-sans text-4xl font-bold text-foreground md:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-muted-foreground">
              Join thousands of satisfied customers. Book your first service today.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link to="/services">
                <Button size="lg" className="rounded-xl bg-primary px-8 font-body text-sm font-semibold text-primary-foreground hover:bg-primary/90 h-12">
                  Book a Service
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="rounded-xl border-border font-body text-sm h-12 px-6 hover:border-primary/40 hover:text-primary">
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
