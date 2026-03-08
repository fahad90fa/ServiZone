import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border border-border shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
        <div className="relative h-40 gradient-primary flex items-center justify-center">
          <span className="text-4xl font-bold text-primary-foreground/20">{service.category}</span>
          {service.popular && (
            <Badge className="absolute right-3 top-3 gradient-accent border-0 text-accent-foreground">Popular</Badge>
          )}
        </div>
        <div className="p-5">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{service.name}</h3>
          </div>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{service.description}</p>

          <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {service.rating} ({service.reviewCount})
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {service.duration}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-foreground">₹{service.price}</span>
            {onBook && (
              <Button size="sm" onClick={() => onBook(service)}>Book Now</Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
