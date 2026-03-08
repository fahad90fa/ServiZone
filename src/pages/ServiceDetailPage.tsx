import { useParams, useNavigate } from 'react-router-dom';
import { services } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowLeft, CheckCircle, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const ServiceDetailPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return <div className="container py-20 text-center text-muted-foreground">Service not found.</div>;
  }

  const relatedServices = services.filter(s => s.categoryId === service.categoryId && s.id !== service.id);

  return (
    <div className="container max-w-4xl py-8">
      <Button variant="ghost" className="mb-4 gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border border-border shadow-card">
          <div className="gradient-primary p-8">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="mb-3 border-primary-foreground/30 text-primary-foreground">{service.category}</Badge>
                <h1 className="text-3xl font-bold text-primary-foreground">{service.name}</h1>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-warning text-warning" /> {service.rating} ({service.reviewCount} reviews)</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {service.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {service.reviewCount}+ bookings</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-primary-foreground/60">Starting at</p>
                <p className="text-3xl font-bold text-primary-foreground">₹{service.price}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <h2 className="mb-3 text-lg font-semibold text-foreground">About this service</h2>
            <p className="mb-6 text-muted-foreground leading-relaxed">{service.description}</p>

            <h2 className="mb-3 text-lg font-semibold text-foreground">What's included</h2>
            <div className="mb-6 grid gap-2 sm:grid-cols-2">
              {['Professional equipment', 'Trained & verified staff', 'Satisfaction guarantee', 'Eco-friendly products', 'Post-service cleanup', 'Free re-service if unsatisfied'].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Shield className="h-4 w-4 text-success" /> ServiZone Guarantee
              </div>
              <p className="mt-1 text-sm text-muted-foreground">All services are backed by our quality guarantee. If you're not satisfied, we'll make it right.</p>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
              <div>
                <p className="text-2xl font-bold text-foreground">₹{service.price}</p>
                <p className="text-sm text-muted-foreground">{service.duration} • Taxes included</p>
              </div>
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground" onClick={() => navigate(`/book/${service.id}`)}>
                Book Now
              </Button>
            </div>
          </div>
        </Card>

        {relatedServices.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-foreground">Related Services</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedServices.map(s => (
                <Card
                  key={s.id}
                  className="cursor-pointer border border-border p-4 shadow-card transition-all hover:shadow-elevated"
                  onClick={() => navigate(`/service/${s.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{s.name}</h3>
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
