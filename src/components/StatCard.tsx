import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => (
  <Card className="glass border-border/50 p-5 shadow-soft hover-lift noise group">
    <div className="flex items-start justify-between">
      <div>
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="mt-1 font-sans text-2xl font-bold text-foreground">{value}</p>
        {trend && (
          <p className={`mt-1 flex items-center gap-1 font-body text-xs ${trendUp ? 'text-success' : 'text-destructive'}`}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </p>
        )}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 group-hover:gradient-primary group-hover:shadow-glow transition-all duration-300">
        <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
      </div>
    </div>
  </Card>
);

export default StatCard;
