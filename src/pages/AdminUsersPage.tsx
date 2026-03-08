import { useState } from 'react';
import { users as initialUsers } from '@/data/mock';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, User } from 'lucide-react';
import { toast } from 'sonner';

const AdminUsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [usersList, setUsersList] = useState(initialUsers);

  const filtered = usersList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleStatus = (id: string) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' as const : 'active' as const } : u));
    toast.success('User status updated');
  };

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Manage Users</h1>
      <p className="mb-6 text-muted-foreground">View and manage all platform users</p>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2">
          {['all', 'user', 'provider', 'admin'].map(r => (
            <Button key={r} size="sm" variant={roleFilter === r ? 'default' : 'outline'} onClick={() => setRoleFilter(r)} className="capitalize">
              {r === 'all' ? 'All' : r + 's'}
            </Button>
          ))}
        </div>
      </div>

      <Card className="border border-border shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="p-4 font-medium">User</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Phone</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium text-foreground">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4 text-muted-foreground">{u.phone}</td>
                <td className="p-4">
                  <Badge variant="outline" className="capitalize">{u.role}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant="outline" className={u.status === 'active' ? 'bg-success/10 text-success border-success/30' : 'bg-destructive/10 text-destructive border-destructive/30'}>
                    {u.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <Button size="sm" variant="outline" onClick={() => toggleStatus(u.id)}>
                    {u.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
