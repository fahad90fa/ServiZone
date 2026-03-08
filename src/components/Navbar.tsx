import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserRole } from '@/types';
import { Home, Calendar, User, LogOut, Shield, Wrench, ChevronDown, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const roleLabels: Record<UserRole, string> = { user: 'Customer', provider: 'Provider', admin: 'Admin' };

const Navbar = () => {
  const { currentUser, switchRole, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = currentUser?.role === 'admin'
    ? [
        { to: '/admin', label: 'Dashboard', icon: Home },
        { to: '/admin/users', label: 'Users', icon: User },
        { to: '/admin/services', label: 'Services', icon: Wrench },
        { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
      ]
    : currentUser?.role === 'provider'
    ? [
        { to: '/provider', label: 'Dashboard', icon: Home },
        { to: '/provider/jobs', label: 'Jobs', icon: Calendar },
        { to: '/provider/profile', label: 'Profile', icon: User },
      ]
    : [
        { to: '/', label: 'Home', icon: Home },
        { to: '/services', label: 'Services', icon: Wrench },
        { to: '/bookings', label: 'My Bookings', icon: Calendar },
        { to: '/profile', label: 'Profile', icon: User },
      ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Wrench className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">ServiZone</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={isActive(link.to) ? 'default' : 'ghost'}
                size="sm"
                className="gap-2"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Role switcher for demo */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden gap-1 sm:flex">
                <Shield className="h-4 w-4" />
                {currentUser ? roleLabels[currentUser.role] : 'Guest'}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => switchRole('user')}>
                <User className="mr-2 h-4 w-4" /> Switch to Customer
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('provider')}>
                <Wrench className="mr-2 h-4 w-4" /> Switch to Provider
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole('admin')}>
                <Shield className="mr-2 h-4 w-4" /> Switch to Admin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
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
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container flex flex-col gap-1 py-3">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                  <Button variant={isActive(link.to) ? 'default' : 'ghost'} size="sm" className="w-full justify-start gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="mt-2 flex gap-1">
                <Button variant="outline" size="sm" onClick={() => { switchRole('user'); setMobileOpen(false); }} className="flex-1 text-xs">Customer</Button>
                <Button variant="outline" size="sm" onClick={() => { switchRole('provider'); setMobileOpen(false); }} className="flex-1 text-xs">Provider</Button>
                <Button variant="outline" size="sm" onClick={() => { switchRole('admin'); setMobileOpen(false); }} className="flex-1 text-xs">Admin</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
