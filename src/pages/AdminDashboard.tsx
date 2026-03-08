import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Wrench, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const barData = [
  { name: 'Mon', bookings: 18 }, { name: 'Tue', bookings: 24 }, { name: 'Wed', bookings: 32 },
  { name: 'Thu', bookings: 28 }, { name: 'Fri', bookings: 42 }, { name: 'Sat', bookings: 38 }, { name: 'Sun', bookings: 22 },
];

const COLORS = ['hsl(152 60% 42%)', 'hsl(38 92% 50%)', 'hsl(210 80% 55%)', 'hsl(0 62% 50%)'];

const AdminDashboard = () => {
  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data } = await supabase.from('bookings').select('*, services(name), profiles!bookings_user_id_fkey(name)');
      return data || [];
    },
  });

  const { data: profiles = [] } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      const { data } = await supabase.from('profiles').select('*');
      return data || [];
    },
  });

  const { data: services = [] } = useQuery({
    queryKey: ['admin-services-count'],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('id');
      return data || [];
    },
  });

  const totalRevenue = bookings.filter((b: any) => b.status === 'completed').reduce((sum: number, b: any) => sum + Number(b.price), 0);
  const pending = bookings.filter((b: any) => b.status === 'pending').length;
  const completed = bookings.filter((b: any) => b.status === 'completed').length;
  const inProgress = bookings.filter((b: any) => b.status === 'in_progress').length;
  const cancelled = bookings.filter((b: any) => b.status === 'cancelled').length;

  const pieData = [
    { name: 'Completed', value: completed || 1 },
    { name: 'In Progress', value: inProgress || 1 },
    { name: 'Pending', value: pending || 1 },
    { name: 'Cancelled', value: cancelled || 1 },
  ];

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary mb-1">Overview</p>
        <h1 className="mb-1 font-sans text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mb-6 font-body text-sm text-muted-foreground">Real-time platform overview</p>
      </motion.div>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Bookings" value={bookings.length} icon={Calendar} trend="Live data" trendUp />
        <StatCard title="Pending" value={pending} icon={Clock} />
        <StatCard title="Completed" value={completed} icon={TrendingUp} />
        <StatCard title="Total Users" value={profiles.length} icon={Users} />
        <StatCard title="Services" value={services.length} icon={Wrench} />
        <StatCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={DollarSign} trend="From completed" trendUp />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="col-span-2 border-border bg-card p-5">
          <h3 className="mb-4 font-sans text-sm font-semibold text-foreground">Bookings This Week</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 4% 15%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(240 5% 45%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(240 5% 45%)' }} />
              <Tooltip contentStyle={{ background: 'hsl(240 5% 9%)', border: '1px solid hsl(240 4% 15%)', borderRadius: '8px', color: 'hsl(40 10% 92%)', fontSize: 13 }} />
              <Bar dataKey="bookings" fill="hsl(38 92% 50%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border-border bg-card p-5">
          <h3 className="mb-4 font-sans text-sm font-semibold text-foreground">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(240 5% 9%)', border: '1px solid hsl(240 4% 15%)', borderRadius: '8px', color: 'hsl(40 10% 92%)', fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 font-body text-sm">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent bookings table */}
      <Card className="mt-4 border-border bg-card p-5">
        <h3 className="mb-4 font-sans text-sm font-semibold text-foreground">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b: any) => (
                <tr key={b.id} className="border-b border-border/50 last:border-0 hover:bg-secondary/50 transition-colors">
                  <td className="py-3 text-foreground">{(b.profiles as any)?.name || 'Unknown'}</td>
                  <td className="py-3 text-foreground">{(b.services as any)?.name || 'Unknown'}</td>
                  <td className="py-3 text-muted-foreground">{b.scheduled_date}</td>
                  <td className="py-3 font-medium text-foreground">₹{b.price}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                      b.status === 'completed' ? 'bg-success/10 text-success' :
                      b.status === 'pending' ? 'bg-warning/10 text-warning' :
                      b.status === 'in_progress' ? 'bg-primary/10 text-primary' :
                      b.status === 'confirmed' ? 'bg-info/10 text-info' :
                      'bg-destructive/10 text-destructive'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-muted-foreground">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
