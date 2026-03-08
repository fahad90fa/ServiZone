import { useState } from 'react';
import { categories as initialCategories } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Sparkles, Wrench, Zap, Paintbrush, Settings, Bug, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  Sparkles, Wrench, Zap, Paintbrush, Settings, Bug,
};

const iconOptions = ['Sparkles', 'Wrench', 'Zap', 'Paintbrush', 'Settings', 'Bug'];

const AdminCategoriesPage = () => {
  const [catList, setCatList] = useState(initialCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', icon: 'Wrench', description: '' });

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', icon: 'Wrench', description: '' });
    setDialogOpen(true);
  };

  const openEdit = (cat: typeof catList[0]) => {
    setEditId(cat.id);
    setForm({ name: cat.name, icon: cat.icon, description: cat.description });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name) { toast.error('Name is required'); return; }
    if (editId) {
      setCatList(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
      toast.success('Category updated!');
    } else {
      setCatList(prev => [...prev, { id: `cat${Date.now()}`, ...form }]);
      toast.success('Category added!');
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setCatList(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted');
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Categories</h1>
          <p className="text-muted-foreground">Organize services into categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-primary border-0 text-primary-foreground" onClick={openAdd}>
              <Plus className="h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{editId ? 'Edit' : 'Add'} Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div>
                <Label>Icon</Label>
                <div className="mt-1.5 flex gap-2">
                  {iconOptions.map(ic => {
                    const Icon = iconMap[ic] || Wrench;
                    return (
                      <button
                        key={ic}
                        type="button"
                        onClick={() => setForm({ ...form, icon: ic })}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                          form.icon === ic ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <Icon className={`h-5 w-5 ${form.icon === ic ? 'text-primary' : 'text-muted-foreground'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSave}>{editId ? 'Update' : 'Add'} Category</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catList.map(cat => {
          const Icon = iconMap[cat.icon] || Wrench;
          return (
            <Card key={cat.id} className="border border-border p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(cat)}><Edit className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {catList.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <FolderOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p>No categories yet. Add one to get started.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
