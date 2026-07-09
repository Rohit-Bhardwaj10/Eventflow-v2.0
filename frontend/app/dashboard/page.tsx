'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
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
import { motion } from 'framer-motion';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isUpcoming(startAt: string) {
  return new Date(startAt) > new Date();
}

const statusColors: Record<string, string> = {
  CONFIRMED: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
  WAITLISTED: 'bg-accent-gold/10 text-accent-gold border-accent-gold/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
  ATTENDED: 'bg-accent-pink/10 text-accent-pink border-accent-pink/20',
};

// Subtle number counter component
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    let totalDuration = 1000;
    let incrementTime = Math.max(totalDuration / end, 20);
    
    const timer = setInterval(() => {
      start += 1;
      setDisplayValue(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

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
      <div className="max-w-5xl mx-auto flex flex-col gap-14">
        {/* Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent-teal rounded-full" />
          <h1 className="text-[32px] font-playfair font-bold tracking-tight text-ink mb-2">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[16px] font-medium text-ink-muted">
            Here is what&apos;s happening around campus.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Events Registered', value: myRegs.length, icon: Ticket, color: 'text-accent-teal', bg: 'bg-accent-teal/10' },
            { label: 'Upcoming', value: upcomingRegs.length, icon: CalendarDays, color: 'text-accent-gold', bg: 'bg-accent-gold/10' },
            { label: 'Attended', value: myRegs.filter((r) => r.status === 'ATTENDED').length, icon: Users, color: 'text-accent-pink', bg: 'bg-accent-pink/10' },
            { label: 'Explore Live', value: discover.length, icon: Compass, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10' },
          ].map(({ label, value, icon: Icon, color, bg }, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              key={label}
              className="bg-surface-2/60 backdrop-blur-xl border border-border/60 rounded-[24px] p-6 shadow-soft group hover:border-accent-teal/30 transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`h-8 w-8 rounded-full ${bg} flex items-center justify-center border border-canvas shadow-inner`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                  {label}
                </span>
              </div>
              <span className="text-[36px] font-playfair font-bold text-ink group-hover:text-accent-teal transition-colors">
                <AnimatedNumber value={value} />
              </span>
            </motion.div>
          ))}
        </div>

        {/* Upcoming Registered Events */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h2 className="text-[20px] font-playfair font-medium text-ink">Your Upcoming Events</h2>
            <Link href="/my-events" className="text-[13px] font-semibold text-accent-teal hover:text-accent-teal/80 flex items-center transition-colors">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loadingRegs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-surface-2/40 border border-border/40 rounded-3xl h-28 animate-pulse"
                />
              ))}
            </div>
          ) : upcomingRegs.length === 0 ? (
            <div className="bg-surface-2/30 backdrop-blur-sm border border-border/60 rounded-3xl p-10 text-center shadow-soft">
              <CalendarDays className="h-10 w-10 text-ink-muted/50 mx-auto mb-4" />
              <p className="text-[15px] font-medium text-ink-muted mb-6">No upcoming events on your calendar.</p>
              <Link href="/explore">
                <button className="bg-surface-1 border border-border/80 text-ink px-6 py-2.5 rounded-full font-medium text-[14px] hover:border-accent-teal/50 hover:shadow-sm transition-all">
                  Browse Events
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingRegs.slice(0, 4).map((reg) => (
                <Link key={reg.id} href={`/my-events/${reg.id}`}>
                  <div className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[20px] p-5 shadow-sm hover:shadow-soft hover:border-accent-teal/40 transition-all group flex items-center gap-5 cursor-pointer h-full">
                    {/* Date block */}
                    <div className="w-16 h-16 flex flex-col items-center justify-center border border-border/80 bg-canvas rounded-xl group-hover:border-accent-teal/30 transition-colors shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">
                        {new Date(reg.event.startAt).toLocaleString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-[24px] font-playfair font-bold text-ink leading-none mt-1">
                        {new Date(reg.event.startAt).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColors[reg.status] ?? ''}`}
                        >
                          {reg.status}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-bold text-ink truncate group-hover:text-primary transition-colors">
                        {reg.event.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="text-[12px] font-medium text-ink-muted flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(reg.event.startAt)}
                        </span>
                        {reg.event.venue && (
                          <span className="text-[12px] font-medium text-ink-muted flex items-center gap-1.5 truncate max-w-[120px]">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            {reg.event.venue}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Discover Events */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-accent-pink/10 flex items-center justify-center border border-accent-pink/20">
                <Sparkles className="h-4 w-4 text-accent-pink" />
              </div>
              <h2 className="text-[20px] font-playfair font-medium text-ink">Discover Events</h2>
            </div>
            <Link href="/explore" className="text-[13px] font-semibold text-accent-pink hover:text-accent-pink/80 flex items-center transition-colors">
              Explore All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loadingDiscover ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-surface-2/40 border border-border/40 rounded-[24px] h-48 animate-pulse"
                />
              ))}
            </div>
          ) : discover.length === 0 ? (
            <div className="bg-surface-2/30 backdrop-blur-sm border border-border/60 rounded-[24px] p-10 text-center shadow-soft">
              <p className="text-[15px] font-medium text-ink-muted">No published events right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {discover.map((ev) => (
                <Link key={ev.id} href={`/events/${ev.slug}`}>
                  <div className="bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[24px] p-6 shadow-sm hover:shadow-soft hover:border-accent-pink/30 transition-all group flex flex-col h-full cursor-pointer relative overflow-hidden">
                    
                    {/* Glass sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">
                        {formatDate(ev.startAt)}
                      </span>
                      {ev.category && (
                        <span className="glass-pill px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-accent-pink">
                          {ev.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[16px] font-bold text-ink mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors relative z-10">
                      {ev.title}
                    </h3>
                    <p className="text-[13px] text-ink-muted line-clamp-2 flex-1 font-medium relative z-10">
                      {ev.description}
                    </p>
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60 relative z-10">
                      <span className="text-[11px] font-semibold text-ink-muted">{ev.club.name}</span>
                      <span className="text-[11px] font-bold text-accent-pink flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        {ev._count?.registrations ?? 0}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </AppLayout>
  );
}
