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

const categoryImages: Record<string, string> = {
  cleaning: '/images/cleaning.jpg',
  plumbing: '/images/plumbing.jpg',
  electrical: '/images/electrical.jpg',
  painting: '/images/painting.jpg',
  'pest control': '/images/pest-control.jpg',
  'appliance repair': '/images/appliance-repair.jpg',
};

const getServiceImage = (service: Service): string => {
  if (service.image_url && service.image_url.length > 5) return service.image_url;
  const catName = (service.category_name || '').toLowerCase();
  for (const [key, val] of Object.entries(categoryImages)) {
    if (catName.includes(key)) return val;
  }
  // fallback: match service name
  const sName = service.name.toLowerCase();
  for (const [key, val] of Object.entries(categoryImages)) {
    if (sName.includes(key)) return val;
  }
  return '/images/cleaning.jpg';
};

const ServiceCard = ({ service, onBook }: ServiceCardProps) => {
  const navigate = useNavigate();
  const imageUrl = getServiceImage(service);

  return (
    <Card className="group overflow-hidden border-border bg-card hover-lift">
      <div
        className="relative h-44 cursor-pointer overflow-hidden"
        onClick={() => navigate(`/service/${service.id}`)}
      >
        <img
          src={imageUrl}
          alt={service.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
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
          <span className="font-sans text-xl font-bold text-foreground">Rs. {service.price}</span>
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
