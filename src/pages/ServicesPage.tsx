import { useState } from 'react';
import { useServices, useCategories } from '@/hooks/useServices';
import ServiceCard from '@/components/ServiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

const ServicesPage = () => {
  const navigate = useNavigate();
  const { data: services = [], isLoading } = useServices();
  const { data: categories = [] } = useCategories();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.category_name || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || s.category_id === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-1">Browse</p>
        <h1 className="mb-1 font-sans text-3xl font-bold text-foreground">All Services</h1>
        <p className="mb-6 font-body text-sm text-muted-foreground">Find and book the perfect service for your needs</p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-secondary border-border font-body rounded-lg focus:border-primary/50"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={!activeCategory ? 'default' : 'outline'}
          onClick={() => setActiveCategory(null)}
          className={`font-body text-xs rounded-lg ${!activeCategory ? 'bg-primary text-primary-foreground' : 'border-border'}`}
        >
          All
        </Button>
        {categories.map(cat => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setActiveCategory(cat.id)}
            className={`font-body text-xs rounded-lg ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'border-border'}`}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 rounded-lg bg-secondary animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(service => (
            <motion.div key={service.id} variants={fade}>
              <ServiceCard service={service} onBook={() => navigate(`/book/${service.id}`)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center font-body text-muted-foreground">No services found matching your search.</div>
      )}
    </div>
  );
};

export default ServicesPage;
