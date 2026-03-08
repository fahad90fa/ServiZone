import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { categories, services } from '@/data/mock';
import ServiceCard from '@/components/ServiceCard';
import { ArrowRight, Star, Shield, Clock, Sparkles, Wrench, Zap, Paintbrush, Settings, Bug } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Wrench, Zap, Paintbrush, Settings, Bug,
};

const HomePage = () => {
  const navigate = useNavigate();
  const popularServices = services.filter(s => s.popular);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(250_84%_54%_/_0.15),_transparent_60%)]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-6xl">
              Home Services,{' '}
              <span className="text-gradient">On Demand</span>
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/70 md:text-xl">
              Book trusted professionals for cleaning, repairs, painting and more. Fast, reliable, and affordable.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/services">
                <Button size="lg" className="gap-2 gradient-primary border-0 text-primary-foreground shadow-elevated">
                  Browse Services <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/bookings">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  My Bookings
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-card py-6">
        <div className="container flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Star className="h-4 w-4 text-warning" /> 4.8 Average Rating</div>
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-success" /> Verified Professionals</div>
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-info" /> Same Day Service</div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container">
          <h2 className="mb-2 text-2xl font-bold text-foreground">Service Categories</h2>
          <p className="mb-8 text-muted-foreground">Choose from a wide range of professional services</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || Wrench;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    className="group cursor-pointer border border-border p-5 text-center shadow-card transition-all hover:shadow-elevated hover:border-primary/30"
                    onClick={() => navigate('/services')}
                  >
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:gradient-primary">
                      <Icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">{cat.name}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="container">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Popular Services</h2>
              <p className="text-muted-foreground">Most booked services this month</p>
            </div>
            <Link to="/services">
              <Button variant="ghost" className="gap-1">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={() => navigate(`/book/${service.id}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
