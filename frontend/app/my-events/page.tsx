'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layouts/app-layout';
import { users, type Registration } from '@/lib/api';
import {
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  Loader2,
  QrCode,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const statusConfig: Record<string, { label: string; cls: string }> = {
  CONFIRMED: { label: 'Confirmed', cls: 'text-accent-teal border-accent-teal/20 bg-accent-teal/10' },
  WAITLISTED: { label: 'Waitlisted', cls: 'text-accent-gold border-accent-gold/20 bg-accent-gold/10' },
  CANCELLED: { label: 'Cancelled', cls: 'text-red-400 border-red-500/20 bg-red-500/10' },
  ATTENDED: { label: 'Attended', cls: 'text-accent-pink border-accent-pink/20 bg-accent-pink/10' },
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
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-6"
        >
          <div className="relative">
            <div className="absolute -left-6 top-0 bottom-0 w-1 bg-accent-pink rounded-full" />
            <h1 className="text-[32px] font-playfair font-bold tracking-tight text-ink mb-1">My Events</h1>
            <p className="text-[15px] font-medium text-ink-muted">All your event registrations in one place.</p>
          </div>
          <Link href="/explore">
            <button className="bg-surface-2 border border-border/80 text-ink px-6 py-3 rounded-full font-semibold text-[14px] hover:border-accent-pink/50 hover:bg-surface-1 transition-all shadow-sm flex items-center gap-2">
              Browse Events <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-border/60 gap-8 relative overflow-hidden">
          {(['upcoming', 'past', 'all'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-4 text-[13px] font-bold uppercase tracking-widest transition-colors relative ${
                tab === t
                  ? 'text-ink'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {t}
              {tab === t && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-pink"
                />
              )}
            </button>
          ))}
          <span className="ml-auto text-[12px] font-semibold text-ink-muted self-center pb-4">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-accent-pink/60" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-2/30 backdrop-blur-sm border border-border/60 rounded-[24px] p-16 text-center shadow-soft"
          >
            <Ticket className="h-12 w-12 text-ink-muted/40 mx-auto mb-4" />
            <p className="text-[16px] font-medium text-ink-muted mb-6">
              {tab === 'upcoming'
                ? "You don't have any upcoming events."
                : tab === 'past'
                ? "No past events yet."
                : "No registrations yet."}
            </p>
            <Link href="/explore">
              <button className="bg-ink text-canvas hover:bg-ink/90 px-6 py-3 rounded-xl font-bold text-[14px] transition-all shadow-md">
                Explore Events
              </button>
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((reg, idx) => {
                const status = statusConfig[reg.status] ?? statusConfig.CONFIRMED;
                return (
                  <motion.div
                    key={reg.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className={`bg-surface-2/60 backdrop-blur-md border border-border/60 rounded-[24px] shadow-sm hover:shadow-soft hover:border-accent-pink/30 transition-all overflow-hidden ${
                      reg.status === 'CANCELLED' ? 'opacity-50 grayscale-[0.5]' : ''
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-stretch">
                      {/* Date sidebar */}
                      <div className="flex flex-col items-center justify-center w-full sm:w-28 shrink-0 bg-canvas/50 border-b sm:border-b-0 sm:border-r border-border/60 py-6 px-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-accent-pink">
                          {new Date(reg.event.startAt).toLocaleString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-[32px] font-playfair font-bold text-ink leading-none mt-1 mb-1">
                          {new Date(reg.event.startAt).getDate()}
                        </span>
                        <span className="text-[11px] font-medium text-ink-muted">
                          {new Date(reg.event.startAt).getFullYear()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 sm:p-8 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="min-w-0">
                              <h3 className="text-[20px] font-playfair font-bold text-ink truncate mb-1">
                                {reg.event.title}
                              </h3>
                              <p className="text-[13px] font-semibold text-ink-muted">{reg.event.club.name}</p>
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider border rounded-full px-3 py-1 shrink-0 ${status.cls}`}
                            >
                              {status.label}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 mb-6">
                            <span className="text-[13px] font-medium text-ink-muted flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {formatTime(reg.event.startAt)}
                            </span>
                            {reg.event.venue && (
                              <span className="text-[13px] font-medium text-ink-muted flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {reg.event.venue}
                              </span>
                            )}
                            {reg.tier && (
                              <span className="text-[13px] font-medium text-ink-muted flex items-center gap-1.5">
                                <Ticket className="h-4 w-4" />
                                {reg.tier.name}
                                {reg.tier.price > 0 && ` · ₹${reg.tier.price}`}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Link href={`/my-events/${reg.id}`}>
                            <button className="bg-surface-1 border border-border/80 text-ink px-5 py-2.5 rounded-xl font-semibold text-[13px] hover:border-accent-pink/50 hover:text-accent-pink transition-all shadow-sm flex items-center gap-2">
                              <QrCode className="h-4 w-4" />
                              View Ticket
                            </button>
                          </Link>
                          <Link href={`/events/${reg.event.slug}`}>
                            <button className="bg-transparent text-ink-muted px-4 py-2.5 rounded-xl font-semibold text-[13px] hover:text-ink hover:bg-surface-1/50 transition-all">
                              Event Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
