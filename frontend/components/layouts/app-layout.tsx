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
  Bell,
  LogOut,
  Zap,
} from 'lucide-react';

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
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-caption text-ink-muted">Loading...</p>
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
    <div className="min-h-screen flex bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="h-7 w-7 bg-primary flex items-center justify-center border border-border">
              <Zap className="h-4 w-4 text-ink" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-ink">
              Eventflow
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-muted px-2 mb-3">
            Menu
          </p>
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors rounded-sm ${
                  active
                    ? 'bg-primary text-ink'
                    : 'text-ink-muted hover:text-ink hover:bg-surface-1'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <Link href="/profile">
            <div className="flex items-center gap-3 px-2 py-2 hover:bg-surface-1 rounded-sm transition-colors cursor-pointer mb-1">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="h-8 w-8 bg-surface-2 border border-border flex items-center justify-center rounded-full">
                  <span className="text-[10px] font-black text-ink">{initials}</span>
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-ink truncate">{user.name}</span>
                <span className="text-[10px] text-ink-muted truncate">{user.email}</span>
              </div>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-2 py-2 text-sm text-ink-muted hover:text-ink hover:bg-surface-1 rounded-sm transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-14 border-b border-border flex items-center justify-between px-8 shrink-0 sticky top-0 bg-canvas z-10">
          <div />
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="font-semibold">{user.name}</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
