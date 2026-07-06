'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { users, events, type Registration, type Event, ApiError } from '@/lib/api';
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  Compass,
  Users,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isUpcoming(startAt: string) {
  return new Date(startAt) > new Date();
}

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-primary/20 text-primary border-primary/30',
  WAITLISTED: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-400/30',
  ATTENDED: 'bg-green-500/20 text-green-400 border-green-400/30',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [myRegs, setMyRegs] = useState<Registration[]>([]);
  const [discover, setDiscover] = useState<Event[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(true);
  const [loadingDiscover, setLoadingDiscover] = useState(true);

  useEffect(() => {
    users.myRegistrations()
      .then((data) => setMyRegs(data))
      .catch(() => setMyRegs([]))
      .finally(() => setLoadingRegs(false));

    events.list(1, 6)
      .then((data) => setDiscover(data.events))
      .catch(() => setDiscover([]))
      .finally(() => setLoadingDiscover(false));
  }, []);

  const upcomingRegs = myRegs.filter(
    (r) => r.status !== 'CANCELLED' && isUpcoming(r.event.startAt),
  );

  const firstName = user?.name?.split(' ')[0] ?? 'Student';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Welcome */}
        <div>
          <h1 className="text-headline text-ink mb-1">
            Welcome back, {firstName}.
          </h1>
          <p className="text-sm text-ink-muted">
            Here is what&apos;s happening around campus.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Events Registered', value: myRegs.length, icon: Ticket },
            { label: 'Upcoming', value: upcomingRegs.length, icon: CalendarDays },
            { label: 'Attended', value: myRegs.filter((r) => r.status === 'ATTENDED').length, icon: Users },
            { label: 'Explore Live', value: discover.length, icon: Compass },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="border-[2px] border-border bg-surface-1 p-4 shadow-brutal-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ink-muted">
                  {label}
                </span>
              </div>
              <span className="text-3xl font-black text-ink">{value}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Registered Events */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-subhead text-ink font-semibold">Your Upcoming Events</h2>
            <Link href="/my-events">
              <Button variant="tertiary" size="default">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loadingRegs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="border-[2px] border-border bg-surface-1 p-5 h-24 animate-pulse"
                />
              ))}
            </div>
          ) : upcomingRegs.length === 0 ? (
            <div className="border-[2px] border-border border-dashed bg-surface-1 p-8 text-center">
              <CalendarDays className="h-8 w-8 text-ink-muted mx-auto mb-3" />
              <p className="text-sm font-semibold text-ink-muted">No upcoming events.</p>
              <Link href="/explore">
                <Button variant="secondary" size="default" className="mt-4">
                  Browse Events
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingRegs.slice(0, 4).map((reg) => (
                <Link key={reg.id} href={`/my-events/${reg.id}`}>
                  <div className="border-[2px] border-border bg-surface-1 p-5 shadow-brutal-sm hover:-translate-y-0.5 hover:shadow-brutal transition-all flex items-start gap-4 cursor-pointer">
                    {/* Date block */}
                    <div className="shrink-0 w-14 flex flex-col items-center border-[2px] border-border bg-canvas p-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">
                        {new Date(reg.event.startAt).toLocaleString('en', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black text-ink leading-none">
                        {new Date(reg.event.startAt).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 border ${statusColors[reg.status] ?? ''}`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-[-0.01em] text-ink truncate">
                        {reg.event.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-[10px] text-ink-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(reg.event.startAt)}
                        </span>
                        {reg.event.venue && (
                          <span className="text-[10px] text-ink-muted flex items-center gap-1 truncate max-w-[120px]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {reg.event.venue}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-muted mt-1 block">
                        {reg.event.club.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Discover Events */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-subhead text-ink font-semibold">Discover Events</h2>
          </div>

          {loadingDiscover ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-[2px] border-border bg-surface-1 h-40 animate-pulse"
                />
              ))}
            </div>
          ) : discover.length === 0 ? (
            <div className="border-[2px] border-border border-dashed bg-surface-1 p-8 text-center">
              <p className="text-sm text-ink-muted">No published events right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {discover.map((ev) => (
                <Link key={ev.id} href={`/events/${ev.slug}`}>
                  <Card
                    variant="default"
                    className="flex flex-col cursor-pointer hover:bg-surface-2 transition-colors h-full"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-ink-muted">
                        {formatDate(ev.startAt)}
                      </span>
                      {ev.category && (
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] border border-border px-2 py-0.5 text-primary">
                          {ev.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-[-0.01em] text-ink mb-2 line-clamp-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-ink-muted line-clamp-2 flex-1">{ev.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <span className="text-[10px] text-ink-muted">{ev.club.name}</span>
                      <span className="text-[10px] font-black text-primary">
                        {ev._count?.registrations ?? 0} registered
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/explore">
              <Button variant="secondary" size="lg">
                Explore All Events →
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
