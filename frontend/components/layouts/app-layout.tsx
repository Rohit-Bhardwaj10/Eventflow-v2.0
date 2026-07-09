'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Compass,
  User,
  LogOut,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/my-events', label: 'My Events', icon: CalendarCheck },
  { href: '/my-clubs', label: 'My Clubs', icon: Users },
  { href: '/explore', label: 'Explore', icon: Compass },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-border"></div>
          <div className="absolute inset-0 rounded-full border-2 border-accent-teal border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex bg-canvas relative overflow-hidden text-ink">
      {/* Subtle background effects */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_30%,#000_60%,transparent_100%)]" />
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Glass Sidebar */}
      <aside className="w-64 flex flex-col shrink-0 relative z-20 m-4 rounded-3xl bg-surface-2/60 backdrop-blur-xl border border-border/60 shadow-soft-lg overflow-hidden">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-border/40">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20 shadow-inner">
              <Zap className="h-4 w-4 text-accent-teal" />
            </div>
            <span className="text-[16px] font-playfair font-bold tracking-wide text-ink">
              Eventflow
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted/70 px-3 mb-4">
            Menu
          </p>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 text-[14px] font-medium transition-all rounded-xl relative overflow-hidden group ${
                  active
                    ? 'text-ink bg-surface-1/50 border border-border/50 shadow-sm'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-1/30'
                }`}
              >
                {active && (
                  <motion.div 
                    layoutId="activeNavTab" 
                    className="absolute inset-0 bg-accent-teal/5 border border-accent-teal/10 rounded-xl"
                  />
                )}
                <Icon className={`h-4 w-4 shrink-0 relative z-10 transition-colors ${active ? 'text-accent-teal' : 'group-hover:text-ink'}`} />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border/40 bg-surface-1/20">
          <Link href="/profile">
            <div className="flex items-center gap-3 px-3 py-3 hover:bg-surface-1/50 rounded-xl transition-all cursor-pointer mb-2 border border-transparent hover:border-border/50">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border border-border/60 shadow-sm"
                />
              ) : (
                <div className="h-10 w-10 bg-surface-2 border border-border/60 flex items-center justify-center rounded-full shadow-sm">
                  <span className="text-[12px] font-bold text-ink">{initials}</span>
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-[14px] font-semibold text-ink truncate">{user.name}</span>
                <span className="text-[12px] text-ink-muted truncate">{user.email}</span>
              </div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative z-10">
        <header className="h-20 flex items-center justify-end px-10 shrink-0 sticky top-0 z-30">
          {/* Subtle gradient behind header */}
          <div className="absolute inset-0 bg-gradient-to-b from-canvas via-canvas/80 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 text-[14px] text-ink-muted hover:text-ink transition-all bg-surface-2/40 backdrop-blur-md border border-border/50 px-4 py-2 rounded-full hover:border-border/80 shadow-sm"
            >
              <User className="h-4 w-4" />
              <span className="font-semibold">{user.name}</span>
            </Link>
          </div>
        </header>
        
        <div className="flex-1 px-10 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
