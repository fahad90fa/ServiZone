import { useState } from 'react';
import { services as initialServices, categories } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Star, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminServicesPage = () => {
  const [search, setSearch] = useState('');
  const [servicesList, setServicesList] = useState(initialServices);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'cat1', description: '', price: '', duration: '' });

  const filtered = servicesList.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    const cat = categories.find(c => c.id === form.category);
    const newService = {
      id: `s${Date.now()}`,
      name: form.name,
      categoryId: form.category,
      category: cat?.name || '',
      description: form.description,
      price: Number(form.price),
      duration: form.duration,
      rating: 0,
      reviewCount: 0,
      image: '',
      popular: false,
    };
    setServicesList(prev => [newService, ...prev]);
    setForm({ name: '', category: 'cat1', description: '', price: '', duration: '' });
    setDialogOpen(false);
    toast.success('Service added!');
  };

  const handleDelete = (id: string) => {
    setServicesList(prev => prev.filter(s => s.id !== id));
    toast.success('Service deleted');
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Services</h1>
          <p className="text-muted-foreground">Add, edit, and manage platform services</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground">
              <Plus className="h-4 w-4" /> Add Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Service</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div>
                <Label>Category</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (₹) *</Label><Input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
                <div><Label>Duration</Label><Input value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} placeholder="e.g. 2 hrs" /></div>
              </div>
              <Button className="w-full" onClick={handleAdd}>Add Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <Card className="border border-border shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">Service</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Duration</th>
              <th className="p-4 font-medium">Rating</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4">
                  <div>
                    <span className="font-medium text-foreground">{s.name}</span>
                    {s.popular && <Badge className="ml-2 gradient-accent border-0 text-accent-foreground text-xs">Popular</Badge>}
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{s.category}</td>
                <td className="p-4 font-medium text-foreground">₹{s.price}</td>
                <td className="p-4 text-muted-foreground">{s.duration}</td>
                <td className="p-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {s.rating}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminServicesPage;
