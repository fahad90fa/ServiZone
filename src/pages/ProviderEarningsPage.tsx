import { bookings } from '@/data/mock';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ProviderEarningsPage = () => {
  const myBookings = bookings.filter(b => b.providerId === 'u3');
  const completed = myBookings.filter(b => b.status === 'completed');
  const totalEarnings = completed.reduce((sum, b) => sum + b.price, 0);
  const platformFee = Math.round(totalEarnings * 0.15);
  const netEarnings = totalEarnings - platformFee;

  const monthlyData = [
    { month: 'Oct', earnings: 12500 },
    { month: 'Nov', earnings: 18200 },
    { month: 'Dec', earnings: 15800 },
    { month: 'Jan', earnings: 22400 },
    { month: 'Feb', earnings: 19600 },
    { month: 'Mar', earnings: netEarnings },
  ];

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold text-foreground">Earnings</h1>
      <p className="mb-6 text-muted-foreground">Track your income and payment history</p>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Earnings" value={`Rs. ${totalEarnings.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Platform Fee (15%)" value={`Rs. ${platformFee.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Net Earnings" value={`Rs. ${netEarnings.toLocaleString()}`} icon={DollarSign} trend="Net after fees" trendUp />
        <StatCard title="Jobs Completed" value={completed.length} icon={CheckCircle} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border border-border p-5 shadow-card">
          <h3 className="mb-4 font-semibold text-foreground">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="hsl(250 84% 54%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="border border-border p-5 shadow-card">
          <h3 className="mb-4 font-semibold text-foreground">Payment History</h3>
          <div className="space-y-3">
            {completed.map(b => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{b.serviceName}</p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">Rs. {b.price}</p>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">Paid</Badge>
                </div>
              </motion.div>
            ))}
            {completed.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">No completed jobs yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProviderEarningsPage;
