import { dashboardStats, bookings } from '@/data/mock';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Users, Calendar, DollarSign, Wrench, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const barData = [
  { name: 'Mon', bookings: 18 }, { name: 'Tue', bookings: 24 }, { name: 'Wed', bookings: 32 },
  { name: 'Thu', bookings: 28 }, { name: 'Fri', bookings: 42 }, { name: 'Sat', bookings: 38 }, { name: 'Sun', bookings: 22 },
];

const pieData = [
  { name: 'Completed', value: 65 }, { name: 'In Progress', value: 15 },
  { name: 'Pending', value: 12 }, { name: 'Cancelled', value: 8 },
];

const COLORS = ['hsl(152 69% 40%)', 'hsl(250 84% 54%)', 'hsl(37 95% 55%)', 'hsl(0 84% 60%)'];

const AdminDashboard = () => {
  const stats = dashboardStats;

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mb-6 text-muted-foreground">Overview of platform performance</p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Bookings" value={stats.totalBookings.toLocaleString()} icon={Calendar} trend="12% vs last month" trendUp />
        <StatCard title="Today's Bookings" value={stats.bookingsToday} icon={Clock} />
        <StatCard title="Pending" value={stats.pendingBookings} icon={TrendingUp} />
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend="8% vs last month" trendUp />
        <StatCard title="Providers" value={stats.totalProviders} icon={Wrench} />
        <StatCard title="Revenue" value={`₹${(stats.totalRevenue / 100000).toFixed(1)}L`} icon={DollarSign} trend="15% vs last month" trendUp />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border border-border p-5 shadow-card">
          <h3 className="mb-4 font-semibold text-foreground">Bookings This Week</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="bookings" fill="hsl(250 84% 54%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border border-border p-5 shadow-card">
          <h3 className="mb-4 font-semibold text-foreground">Booking Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i] }} />
                <span className="text-muted-foreground">{d.name}</span>
                <span className="ml-auto font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent bookings */}
      <Card className="mt-6 border border-border p-5 shadow-card">
        <h3 className="mb-4 font-semibold text-foreground">Recent Bookings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="py-3 font-mono text-xs text-muted-foreground">{b.id}</td>
                  <td className="py-3 text-foreground">{b.userName}</td>
                  <td className="py-3 text-foreground">{b.serviceName}</td>
                  <td className="py-3 text-muted-foreground">{b.date}</td>
                  <td className="py-3 font-medium text-foreground">₹{b.price}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
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
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
