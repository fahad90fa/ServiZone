import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: StatCardProps) => (
  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
    <Card className="glass-dark border-border/30 p-4 shadow-card hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
      <div className="flex items-start justify-between mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <p className="font-sans text-2xl font-bold text-foreground">{value}</p>
      <p className="font-body text-xs text-muted-foreground mt-0.5">{title}</p>
      {trend && (
        <p className={`mt-1 font-body text-xs ${trendUp ? 'text-success' : 'text-destructive'}`}>{trend}</p>
      )}
    </Card>
  </motion.div>
);

export default StatCard;
