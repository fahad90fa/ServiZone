import { useState } from 'react';
import { services, categories } from '@/data/mock';
import ServiceCard from '@/components/ServiceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const ServicesPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = services.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = !activeCategory || s.categoryId === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">All Services</h1>
      <p className="mb-6 text-muted-foreground">Find and book the service you need</p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button size="sm" variant={!activeCategory ? 'default' : 'outline'} onClick={() => setActiveCategory(null)}>All</Button>
        {categories.map(cat => (
          <Button key={cat.id} size="sm" variant={activeCategory === cat.id ? 'default' : 'outline'} onClick={() => setActiveCategory(cat.id)}>
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(service => (
          <ServiceCard key={service.id} service={service} onBook={() => navigate(`/book/${service.id}`)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">No services found matching your search.</div>
      )}
    </div>
  );
};

export default ServicesPage;
