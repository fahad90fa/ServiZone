import { useBookings } from '@/hooks/useBookings';
import StatCard from '@/components/StatCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, CheckCircle, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ProviderEarningsPage = () => {
  const { data: bookings = [], isLoading } = useBookings();
  
  const completed = bookings.filter(b => b.status === 'completed');
  const totalEarnings = completed.reduce((sum, b) => sum + Number(b.price), 0);
  const platformFee = Math.round(totalEarnings * 0.15);
  const netEarnings = totalEarnings - platformFee;

  // Group completed bookings by month for chart
  const getMonthlyData = () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap: Record<string, number> = {};
    
    completed.forEach(b => {
      const date = new Date(b.scheduled_date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyMap[key] = (monthlyMap[key] || 0) + Number(b.price);
    });

    // Get last 6 months
    const result = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      result.push({
        month: monthNames[d.getMonth()],
        earnings: monthlyMap[key] || 0,
      });
    }
    return result;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const monthlyData = getMonthlyData();

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-2 font-sans text-3xl font-bold text-foreground">Earnings</h1>
        <p className="mb-6 font-body text-muted-foreground">Track your income and payment history in real-time</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard title="Total Earnings" value={`Rs. ${totalEarnings.toLocaleString()}`} icon={DollarSign} />
        <StatCard title="Platform Fee (15%)" value={`Rs. ${platformFee.toLocaleString()}`} icon={TrendingUp} />
        <StatCard title="Net Earnings" value={`Rs. ${netEarnings.toLocaleString()}`} icon={DollarSign} trend="Net after fees" trendUp />
        <StatCard title="Jobs Completed" value={completed.length} icon={CheckCircle} />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="col-span-2 border border-border p-5 shadow-card">
          <h3 className="mb-4 font-sans font-semibold text-foreground">Monthly Earnings</h3>
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
          <h3 className="mb-4 font-sans font-semibold text-foreground">Payment History</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {completed.map(b => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{b.service_name || 'Service'}</p>
                  <p className="font-body text-xs text-muted-foreground">{b.scheduled_date}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm font-semibold text-foreground">Rs. {Number(b.price).toLocaleString()}</p>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30 text-xs">Paid</Badge>
                </div>
              </motion.div>
            ))}
            {completed.length === 0 && (
              <p className="py-8 text-center font-body text-sm text-muted-foreground">No completed jobs yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProviderEarningsPage;