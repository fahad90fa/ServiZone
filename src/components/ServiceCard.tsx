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
    <Card className="group overflow-hidden border border-border/40 bg-card/60 shadow-card hover-lift glow-border">
      <div
        className="relative h-44 gradient-primary flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={() => navigate(`/service/${service.id}`)}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(285_80%_65%_/_0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(30_100%_55%_/_0.1),transparent_60%)]" />
        <div className="absolute inset-0 animate-shimmer" />
        <span className="relative text-3xl font-bold font-sans text-primary-foreground/10 tracking-wider uppercase select-none">
          {service.category_name || 'Service'}
        </span>
        {service.is_popular && (
          <Badge className="absolute right-3 top-3 gradient-accent border-0 text-accent-foreground shadow-glow-accent font-body text-xs">
            ⭐ Popular
          </Badge>
        )}
      </div>
      <div className="p-5">
        <h3
          className="cursor-pointer font-sans font-semibold text-foreground hover:text-primary transition-colors duration-300 text-lg"
          onClick={() => navigate(`/service/${service.id}`)}
        >
          {service.name}
        </h3>
        <p className="mt-1.5 mb-4 font-body text-sm text-muted-foreground line-clamp-2">{service.description}</p>

        <div className="mb-4 flex items-center gap-4 text-sm font-body text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
            {service.rating} ({service.review_count})
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {service.duration}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border/30 pt-4">
          <span className="font-sans text-xl font-bold text-foreground">₹{service.price}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => navigate(`/service/${service.id}`)} className="font-body text-xs text-muted-foreground hover:text-primary">
              Details <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
            {onBook && (
              <Button size="sm" onClick={() => onBook(service)} className="gradient-primary border-0 text-primary-foreground shadow-soft hover:shadow-glow font-body text-xs rounded-lg transition-all duration-300">
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
