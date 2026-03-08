import { Service } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden border border-border shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
        <div
          className="relative h-40 gradient-primary flex items-center justify-center cursor-pointer"
          onClick={() => navigate(`/service/${service.id}`)}
        >
          <span className="text-4xl font-bold text-primary-foreground/20">{service.category}</span>
          {service.popular && (
            <Badge className="absolute right-3 top-3 gradient-accent border-0 text-accent-foreground">Popular</Badge>
          )}
        </div>
        <div className="p-5">
          <div className="mb-1">
            <h3
              className="cursor-pointer font-semibold text-foreground hover:text-primary transition-colors"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              {service.name}
            </h3>
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
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => navigate(`/service/${service.id}`)}>
                Details <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
              {onBook && (
                <Button size="sm" onClick={() => onBook(service)}>Book Now</Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;
