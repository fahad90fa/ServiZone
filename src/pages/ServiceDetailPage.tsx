import { useParams, useNavigate } from 'react-router-dom';
import { useService, useServices } from '@/hooks/useServices';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowLeft, CheckCircle, Shield, Users, Loader2, MapPin, Phone, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

const included = [
  { label: 'Professional equipment', desc: 'Industry-grade tools & products' },
  { label: 'Trained & verified staff', desc: 'Background checked professionals' },
  { label: 'Satisfaction guarantee', desc: '100% money-back promise' },
  { label: 'Eco-friendly products', desc: 'Safe for family & pets' },
  { label: 'Post-service cleanup', desc: 'We leave your space spotless' },
  { label: 'Free re-service', desc: 'If not satisfied' },
];

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading } = useService(serviceId || '');
  const { data: allServices = [] } = useServices();

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

  const relatedServices = allServices.filter(s => s.category_id === service.category_id && s.id !== service.id);
  const imageUrl = getServiceImage(service);

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
        <span className="text-foreground">{service.name}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Hero Section with Image */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Image */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
              <img
                src={imageUrl}
                alt={service.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
              {service.is_popular && (
                <Badge className="absolute left-4 top-4 bg-primary text-primary-foreground border-0 font-body text-xs gap-1">
                  <Sparkles className="h-3 w-3" /> Popular
                </Badge>
              )}
              <div className="absolute bottom-4 left-4 right-4">
                <Badge variant="outline" className="border-foreground/20 text-foreground/80 font-body text-xs bg-background/40 backdrop-blur-sm">
                  {service.category_name}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div>
              <h1 className="font-sans text-2xl lg:text-3xl font-bold text-foreground leading-tight">{service.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 font-body text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {service.rating}
                  <span className="text-muted-foreground/60">({service.review_count})</span>
                </span>
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg">
                  <Clock className="h-3.5 w-3.5" /> {service.duration}
                </span>
                <span className="flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-lg">
                  <Users className="h-3.5 w-3.5" /> {service.review_count}+ booked
                </span>
              </div>
            </div>

            <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.description}</p>

            {/* Price Card */}
            <div className="mt-auto rounded-2xl border border-border bg-secondary/30 p-5">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">Starting at</p>
                  <p className="font-sans text-3xl font-bold text-foreground">₹{service.price}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">Taxes included</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-body text-success">
                  <CheckCircle className="h-3.5 w-3.5" /> Instant booking
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-primary text-primary-foreground font-body rounded-xl hover:bg-primary/90 transition-all duration-300 text-sm font-semibold h-12"
                onClick={() => navigate(`/book/${service.id}`)}
              >
                <Calendar className="h-4 w-4 mr-2" /> Book Now
              </Button>
              <div className="mt-3 flex items-center justify-center gap-4 font-body text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> Free consultation</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> At your doorstep</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8"
        >
          <h2 className="mb-4 font-sans text-lg font-semibold text-foreground">What's included</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {included.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-border/50 bg-secondary/20 p-3.5"
              >
                <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 rounded-2xl border border-success/15 bg-success/5 p-5 flex items-start gap-4"
        >
          <div className="rounded-xl bg-success/10 p-2.5 shrink-0">
            <Shield className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-sans text-sm font-semibold text-foreground">ServiZone Quality Guarantee</h3>
            <p className="mt-1 font-body text-sm text-muted-foreground leading-relaxed">
              Every service is backed by our quality promise. Not satisfied? We'll send another professional or refund you — no questions asked.
            </p>
          </div>
        </motion.div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sans text-lg font-semibold text-foreground">You might also like</h2>
              <Button variant="ghost" size="sm" className="font-body text-xs text-muted-foreground hover:text-primary" onClick={() => navigate('/services')}>
                View all <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.slice(0, 3).map((s, i) => {
                const img = getServiceImage(s);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.45 + i * 0.08 }}
                  >
                    <Card
                      className="group cursor-pointer overflow-hidden border border-border/50 bg-card hover-lift"
                      onClick={() => navigate(`/service/${s.id}`)}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <img src={img} alt={s.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                      </div>
                      <div className="p-3.5">
                        <h3 className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{s.name}</h3>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="font-sans text-base font-bold text-foreground">₹{s.price}</span>
                          <div className="flex items-center gap-2 font-body text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-primary text-primary" /> {s.rating}</span>
                            <span>• {s.duration}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ServiceDetailPage;
