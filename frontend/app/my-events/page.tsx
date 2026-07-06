'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { users, type Registration } from '@/lib/api';
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  Loader2,
  QrCode,
  XCircle,
} from 'lucide-react';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'Confirmed', cls: 'text-primary border-primary/40 bg-primary/10' },
  WAITLISTED: { label: 'Waitlisted', cls: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10' },
  CANCELLED: { label: 'Cancelled', cls: 'text-red-400 border-red-400/40 bg-red-400/10' },
  ATTENDED: { label: 'Attended', cls: 'text-green-400 border-green-400/40 bg-green-400/10' },
};

type Tab = 'upcoming' | 'past' | 'all';

export default function MyEventsPage() {
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('upcoming');

  useEffect(() => {
    users.myRegistrations()
      .then(setRegs)
      .catch(() => setRegs([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const filtered = regs.filter((r) => {
    const start = new Date(r.event.startAt);
    if (tab === 'upcoming') return start > now && r.status !== 'CANCELLED';
    if (tab === 'past') return start <= now || r.status === 'ATTENDED';
    return true;
  });

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline text-ink mb-1">My Events</h1>
            <p className="text-sm text-ink-muted">All your event registrations in one place.</p>
          </div>
          <Link href="/explore">
            <Button variant="secondary" size="default">
              Browse Events
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border gap-1">
          {(['upcoming', 'past', 'all'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-colors border-b-2 -mb-[1px] ${
                tab === t
                  ? 'border-primary text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }`}
            >
              {t}
            </button>
          ))}
          <span className="ml-auto text-caption text-ink-muted self-center pr-1">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-[2px] border-border border-dashed p-16 text-center">
            <Ticket className="h-10 w-10 text-ink-muted mx-auto mb-4" />
            <p className="text-sm font-semibold text-ink-muted">
              {tab === 'upcoming'
                ? "You don't have any upcoming events."
                : tab === 'past'
                ? "No past events yet."
                : "No registrations yet."}
            </p>
            <Link href="/explore">
              <Button variant="primary" className="mt-4">
                Explore Events
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((reg) => {
              const status = statusConfig[reg.status] ?? statusConfig.CONFIRMED;
              const isPast = new Date(reg.event.startAt) <= now;
              return (
                <div
                  key={reg.id}
                  className={`border-[2px] border-border bg-surface-1 shadow-brutal-sm overflow-hidden ${
                    reg.status === 'CANCELLED' ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-stretch">
                    {/* Date sidebar */}
                    <div className="flex flex-col items-center justify-center w-16 shrink-0 border-r-[2px] border-border bg-canvas py-4 px-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-primary">
                        {new Date(reg.event.startAt).toLocaleString('en', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-black text-ink leading-none">
                        {new Date(reg.event.startAt).getDate()}
                      </span>
                      <span className="text-[9px] text-ink-muted">
                        {new Date(reg.event.startAt).getFullYear()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-sm font-black uppercase tracking-[-0.01em] text-ink truncate">
                            {reg.event.title}
                          </h3>
                          <p className="text-[10px] text-ink-muted mt-0.5">{reg.event.club.name}</p>
                        </div>
                        <span
                          className={`text-[9px] font-black uppercase tracking-[0.12em] border px-2 py-1 shrink-0 ${status.cls}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="text-[10px] text-ink-muted flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(reg.event.startAt)}
                        </span>
                        {reg.event.venue && (
                          <span className="text-[10px] text-ink-muted flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {reg.event.venue}
                          </span>
                        )}
                        {reg.tier && (
                          <span className="text-[10px] text-ink-muted flex items-center gap-1">
                            <Ticket className="h-3 w-3" />
                            {reg.tier.name}
                            {reg.tier.price > 0 && ` · ₹${reg.tier.price}`}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/my-events/${reg.id}`}>
                          <Button variant="secondary" size="default">
                            <QrCode className="h-3.5 w-3.5 mr-1.5" />
                            View Ticket
                          </Button>
                        </Link>
                        <Link href={`/events/${reg.event.slug}`}>
                          <Button variant="tertiary" size="default">
                            Event Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
