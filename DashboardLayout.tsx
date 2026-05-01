import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, Bell, LogOut, Building2, Users, CheckSquare, Menu, X, Calendar, MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useState } from 'react';

const navItems = {
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
    { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  ],
  management: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
    { to: '/approvals', icon: CheckSquare, label: 'Approvals' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  ],
  user: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/bookings', icon: CalendarDays, label: 'Book' },
    { to: '/events', icon: Calendar, label: 'Events' },
    { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile, role, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = navItems[role] || navItems.user;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    // <div className="min-h-screen gradient-bg">
    <div
  className="min-h-screen"
  style={{
    backgroundImage: "url('/bg7.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
      {/* Top bar */}
      <header className="sticky top-0 z-50 glass-card-strong border-b border-border/50">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="font-display font-bold text-lg gradient-text hidden sm:block">
                Auditorium Utilization & Alert System
              </h1>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {items.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}>
                  <Button
                    variant={active ? 'default' : 'ghost'}
                    size="sm"
                    className={active ? 'gradient-primary text-primary-foreground' : ''}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full gradient-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">{profile?.name || 'User'}</p>
                <p className="text-muted-foreground text-xs capitalize">{role}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden border-t border-border/50 p-4 space-y-1"
          >
            {items.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={active ? 'default' : 'ghost'}
                    className={`w-full justify-start ${active ? 'gradient-primary text-primary-foreground' : ''}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </motion.div>
        )}
      </header>

      {/* Content */}
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
