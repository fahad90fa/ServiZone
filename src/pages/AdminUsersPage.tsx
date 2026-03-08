import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { motion } from 'framer-motion';

const AdminUsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ['admin-all-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*, user_roles(role)');
      return data || [];
    },
  });

  const filtered = profiles.filter((u: any) => {
    const matchSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
    const userRole = (u.user_roles as any)?.[0]?.role || 'user';
    const matchRole = roleFilter === 'all' || userRole === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', id);
    if (error) toast.error('Failed to update');
    else toast.success('User status updated');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-sans text-3xl sm:text-4xl font-bold text-foreground">Manage Users</h1>
        <p className="mb-6 font-body text-muted-foreground">View and manage all platform users</p>
      </motion.div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card/50 border-border/60 font-body rounded-xl" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'user', 'provider', 'admin'].map(r => (
            <Button
              key={r}
              size="sm"
              variant={roleFilter === r ? 'default' : 'outline'}
              onClick={() => setRoleFilter(r)}
              className={`capitalize font-body text-xs rounded-lg shrink-0 ${roleFilter === r ? 'gradient-primary border-0 text-primary-foreground' : 'border-border/60'}`}
            >
              {r === 'all' ? 'All' : r + 's'}
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="block sm:hidden space-y-3">
        {filtered.map((u: any) => {
          const role = (u.user_roles as any)?.[0]?.role || 'user';
          return (
            <Card key={u.id} className="glass border-border/50 p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans font-semibold text-foreground truncate">{u.name}</p>
                  <p className="font-body text-xs text-muted-foreground truncate">{u.email}</p>
                </div>
                <Badge variant="outline" className="capitalize font-body text-xs shrink-0">{role}</Badge>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <Badge variant="outline" className={`font-body text-xs ${u.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-destructive/10 text-destructive border-destructive/30'}`}>
                  {u.status}
                </Badge>
                <Button size="sm" variant="outline" onClick={() => toggleStatus(u.id, u.status)} className="font-body text-xs rounded-lg">
                  {u.status === 'active' ? 'Suspend' : 'Activate'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop table */}
      <Card className="hidden sm:block glass border-border/50 shadow-elevated noise overflow-x-auto">
        <table className="w-full font-body text-sm">
          <thead>
            <tr className="border-b border-border/40 text-left text-muted-foreground">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u: any) => {
              const role = (u.user_roles as any)?.[0]?.role || 'user';
              return (
                <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{u.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{u.email}</td>
                  <td className="p-4 text-muted-foreground">{u.phone || '—'}</td>
                  <td className="p-4"><Badge variant="outline" className="capitalize text-xs">{role}</Badge></td>
                  <td className="p-4">
                    <Badge variant="outline" className={`text-xs ${u.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-destructive/10 text-destructive border-destructive/30'}`}>
                      {u.status}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Button size="sm" variant="outline" onClick={() => toggleStatus(u.id, u.status)} className="text-xs rounded-lg">
                      {u.status === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
