import { Service } from '@/hooks/useServices';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group overflow-hidden border-border bg-card hover-lift">
      <div
        className="relative h-40 bg-secondary flex items-center justify-center cursor-pointer"
        onClick={() => navigate(`/service/${service.id}`)}
      >
        <span className="font-sans text-2xl font-bold text-muted-foreground/20 uppercase tracking-wider select-none">
          {service.category_name || 'Service'}
        </span>
        {service.is_popular && (
          <Badge className="absolute right-3 top-3 bg-primary text-primary-foreground border-0 font-body text-xs">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3
          className="cursor-pointer font-sans font-semibold text-foreground group-hover:text-primary transition-colors text-base"
          onClick={() => navigate(`/service/${service.id}`)}
        >
          {service.name}
        </h3>
        <p className="mt-1 mb-3 font-body text-sm text-muted-foreground line-clamp-2">{service.description}</p>

        <div className="mb-3 flex items-center gap-4 font-body text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {service.rating} ({service.review_count})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <span className="font-sans text-xl font-bold text-foreground">₹{service.price}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/service/${service.id}`)} className="font-body text-xs text-muted-foreground hover:text-primary">
              Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
            {onBook && (
              <Button size="sm" onClick={() => onBook(service)} className="bg-primary text-primary-foreground font-body text-xs rounded-lg hover:bg-primary/90">
                Book Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
