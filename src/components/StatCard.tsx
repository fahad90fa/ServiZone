import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => (
  <Card className="border-border bg-card p-4">
    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-4.5 w-4.5 text-primary" />
    </div>
    <p className="font-sans text-2xl font-bold text-foreground">{value}</p>
    <p className="font-body text-xs text-muted-foreground mt-0.5">{title}</p>
    {trend && (
      <p className={`mt-1 font-body text-xs ${trendUp ? 'text-success' : 'text-destructive'}`}>{trend}</p>
    )}
  </Card>
);

export default StatCard;
