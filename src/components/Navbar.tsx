import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserRole } from '@/contexts/AuthContext';
import { Home, Calendar, User, LogOut, Shield, Wrench, ChevronDown, Menu, X, Clock, DollarSign, Star, HelpCircle, Settings, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '@/components/NotificationBell';

const roleLabels: Record<UserRole, string> = { user: 'Customer', provider: 'Provider', admin: 'Admin' };

const Navbar = () => {
  const { currentUser, switchRole, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path + '/'));

  const navLinks = currentUser?.role === 'admin'
    ? [
        { to: '/admin', label: 'Dashboard', icon: Home },
        { to: '/admin/users', label: 'Users', icon: User },
        { to: '/admin/services', label: 'Services', icon: Wrench },
        { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
        { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
        { to: '/admin/settings', label: 'Settings', icon: Settings },
      ]
    : currentUser?.role === 'provider'
    ? [
        { to: '/provider', label: 'Dashboard', icon: Home },
        { to: '/provider/jobs', label: 'Jobs', icon: Calendar },
        { to: '/provider/earnings', label: 'Earnings', icon: DollarSign },
        { to: '/provider/reviews', label: 'Reviews', icon: Star },
        { to: '/provider/availability', label: 'Availability', icon: Clock },
        { to: '/provider/profile', label: 'Profile', icon: User },
      ]
    : [
        { to: '/', label: 'Home', icon: Home },
        { to: '/services', label: 'Services', icon: Wrench },
        { to: '/bookings', label: 'Bookings', icon: Calendar },
        { to: '/profile', label: 'Profile', icon: User },
        { to: '/help', label: 'Help', icon: HelpCircle },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 glass">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-soft group-hover:shadow-glow transition-shadow duration-300">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-sans text-xl font-bold text-foreground">Servi<span className="text-gradient">Zone</span></span>
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 text-xs font-body rounded-lg transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <link.icon className="h-3.5 w-3.5" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {currentUser && <NotificationBell />}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-1.5 sm:flex rounded-lg border-border/60 font-body text-xs">
                <div className="h-5 w-5 rounded-md gradient-primary flex items-center justify-center">
                  <User className="h-3 w-3 text-primary-foreground" />
                </div>
                {currentUser ? roleLabels[currentUser.role] : 'Guest'}
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass border-border/50 shadow-elevated">
              <DropdownMenuItem onClick={() => switchRole('user')} className="font-body text-sm">
                <User className="mr-2 h-4 w-4 text-info" /> Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('provider')} className="font-body text-sm">
                <Wrench className="mr-2 h-4 w-4 text-success" /> Provider
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('admin')} className="font-body text-sm">
                <Shield className="mr-2 h-4 w-4 text-warning" /> Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="font-body text-sm text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border/50 md:hidden glass"
          >
            <div className="container flex flex-col gap-1 py-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 font-body ${isActive(link.to) ? 'bg-primary/10 text-primary' : ''}`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="mt-2 flex gap-1">
                {(['user', 'provider', 'admin'] as UserRole[]).map(r => (
                  <Button key={r} variant="outline" size="sm" onClick={() => { switchRole(r); setMobileOpen(false); }} className="flex-1 text-xs font-body capitalize rounded-lg">
                    {roleLabels[r]}
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
