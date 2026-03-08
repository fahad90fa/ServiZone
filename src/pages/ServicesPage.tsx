import { useState } from 'react';
import { useServices, useCategories } from '@/hooks/useServices';
import ServiceCard from '@/components/ServiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

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
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="font-body text-sm font-medium text-primary mb-2 tracking-wider uppercase">Browse</p>
        <h1 className="mb-2 font-sans text-4xl font-bold text-foreground">All Services</h1>
        <p className="mb-8 font-body text-muted-foreground">Find and book the perfect service for your needs</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-secondary/50 border-border/40 font-body rounded-xl focus:border-primary/50 transition-colors"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-8 flex flex-wrap gap-2"
      >
        <Button
          size="sm"
          variant={!activeCategory ? 'default' : 'outline'}
          onClick={() => setActiveCategory(null)}
          className={`font-body rounded-lg transition-all duration-300 ${!activeCategory ? 'gradient-primary border-0 text-primary-foreground shadow-glow' : 'border-border/40 hover:border-primary/40'}`}
        >
          All
        </Button>
        {categories.map(cat => (
          <Button
            key={cat.id}
            size="sm"
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setActiveCategory(cat.id)}
            className={`font-body rounded-lg transition-all duration-300 ${activeCategory === cat.id ? 'gradient-primary border-0 text-primary-foreground shadow-glow' : 'border-border/40 hover:border-primary/40'}`}
          >
            {cat.name}
          </Button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-secondary/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div initial="hidden" animate="show" variants={stagger} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(service => (
            <motion.div key={service.id} variants={fadeUp}>
              <ServiceCard service={service} onBook={() => navigate(`/book/${service.id}`)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-20 text-center font-body text-muted-foreground">No services found matching your search.</div>
      )}
    </div>
  );
};

export default ServicesPage;
