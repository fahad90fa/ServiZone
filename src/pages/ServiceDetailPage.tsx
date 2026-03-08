import { useParams, useNavigate } from 'react-router-dom';
import { useService, useServices } from '@/hooks/useServices';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowLeft, CheckCircle, Shield, Users, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

  return (
    <div className="container max-w-4xl py-10">
      <Button variant="ghost" className="mb-4 gap-2 font-body rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card className="overflow-hidden border border-border/30 shadow-elevated">
          <div className="gradient-primary p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(285_80%_65%_/_0.4),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(30_100%_55%_/_0.1),transparent_60%)]" />
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative flex flex-col md:flex-row items-start justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-3 border-primary-foreground/20 text-primary-foreground/90 font-body">{service.category_name}</Badge>
                <h1 className="font-sans text-4xl font-bold text-primary-foreground">{service.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 font-body text-sm text-primary-foreground/60">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> {service.rating} ({service.review_count} reviews)</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {service.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {service.review_count}+ bookings</span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-body text-sm text-primary-foreground/50">Starting at</p>
                <p className="font-sans text-4xl font-bold text-primary-foreground">₹{service.price}</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-card">
            <h2 className="mb-3 font-sans text-lg font-semibold text-foreground">About this service</h2>
            <p className="mb-6 font-body text-muted-foreground leading-relaxed">{service.description}</p>

            <h2 className="mb-3 font-sans text-lg font-semibold text-foreground">What's included</h2>
            <div className="mb-6 grid gap-2 sm:grid-cols-2">
              {['Professional equipment', 'Trained & verified staff', 'Satisfaction guarantee', 'Eco-friendly products', 'Post-service cleanup', 'Free re-service if unsatisfied'].map(item => (
                <div key={item} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-2xl bg-success/5 border border-success/15 p-4">
              <div className="flex items-center gap-2 font-sans text-sm font-medium text-foreground">
                <Shield className="h-4 w-4 text-success" /> ServiZone Guarantee
              </div>
              <p className="mt-1 font-body text-sm text-muted-foreground">All services are backed by our quality guarantee. If you're not satisfied, we'll make it right.</p>
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-6">
              <div>
                <p className="font-sans text-3xl font-bold text-foreground">₹{service.price}</p>
                <p className="font-body text-sm text-muted-foreground">{service.duration} • Taxes included</p>
              </div>
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground shadow-glow hover:shadow-elevated transition-all duration-500 rounded-2xl px-8 font-body" onClick={() => navigate(`/book/${service.id}`)}>
                Book Now
              </Button>
            </div>
          </div>
        </Card>

        {relatedServices.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-4 font-sans text-xl font-bold text-foreground">Related Services</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedServices.map(s => (
                <Card
                  key={s.id}
                  className="cursor-pointer border border-border/30 bg-card/60 p-4 shadow-card hover-lift glow-border font-body"
                  onClick={() => navigate(`/service/${s.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sans font-semibold text-foreground">{s.name}</h3>
                      <p className="text-sm text-muted-foreground">{s.duration} • ₹{s.price}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {s.rating}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ServiceDetailPage;
