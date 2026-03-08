import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, Check, CreditCard, Info, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const typeIcons: Record<string, React.ElementType> = {
  booking: Calendar,
  payment: CreditCard,
  system: Info,
  info: Info,
};

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full gradient-primary text-[10px] font-bold text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-primary" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            notifications.map(n => {
              const Icon = typeIcons[n.type] || Info;
              return (
                <div
                  key={n.id}
                  className={`flex gap-3 border-b border-border px-4 py-3 transition-colors last:border-0 ${
                    n.read ? 'bg-background' : 'bg-primary/5'
                  }`}
                  onClick={() => markAsRead(n.id)}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    n.type === 'payment' ? 'bg-success/10' : n.type === 'booking' ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      n.type === 'payment' ? 'text-success' : n.type === 'booking' ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      {!n.read && <div className="h-1.5 w-1.5 rounded-full gradient-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/60">{n.time}</p>
                  </div>
                </div>
              );
            })
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
